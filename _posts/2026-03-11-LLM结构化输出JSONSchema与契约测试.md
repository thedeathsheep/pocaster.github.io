---
layout: post
title: LLM 结构化输出：从 JSON Schema 到契约测试（我在生产里踩过的坑）
cover-img: /assets/img/AI-Agent-Workflow.png
thumbnail-img: /assets/img/AI-Agent-Workflow.png
share-img: /assets/img/AI-Agent-Workflow.png
tags: [AI, Programming]
author: pocaster
published: false
mermaid: true
excerpt: 把 LLM 接进业务系统时，最费时间的往往不是 prompt，而是「输出能不能稳定被程序消费」。本文从 JSON Schema、解析策略、失败分级到契约测试，整理一套我在项目里反复验证过的工程化路径。
---
把大模型接进业务系统时，最磨人的阶段常常不是「怎么把话说漂亮」，而是**输出能不能稳定地被程序消费**。自由文本适合人类阅读，却不适合作为机器之间的接口：少一个字段、类型飘了、枚举越界，下游就会连锁崩溃。

我后来把这件事当成**普通的 API 契约问题**来处理：先定义 schema，再谈生成质量。prompt 可以迭代一百次，但如果没有可验证的边界，迭代只是在噪声里打转。

![Structured output pipeline](/assets/img/AI-Agent-Workflow.png)

## 1. 为什么「能跑 JSON」不等于「能用 JSON」

很多团队的第一步是：在 prompt 里写「请输出 JSON」。模型往往真的能吐出看起来像 JSON 的东西，但生产环境会遇到几类典型故障：

- **包裹噪声**：前后多了说明文字、Markdown 代码块标记、或半截解释。
- **结构漂移**：字段名大小写变化、嵌套层级不一致、数组有时变成单对象。
- **类型不稳定**：数字变成字符串、`null` 与缺省字段混用、布尔写成 `"true"`。
- **语义越界**：枚举值不在约定集合里，或必填字段在「模型认为没必要」时被省略。

这些问题的共同点是：**解析器与业务代码都假设了「理想 JSON」**，而真实分布从来不是理想的。

我的习惯是：把「从模型输出到业务对象」拆成显式阶段，每一阶段都有单一职责和可观测日志。

<div class="mermaid">
flowchart LR
  R[Raw completion] --> N[Normalize text]
  N --> E[Extract JSON blob]
  E --> P[Parse JSON]
  P --> V[Validate schema]
  V --> M[Map to domain model]
  M -->|fail| F[Structured failure record]
</div>

## 2. JSON Schema：先写契约，再写 prompt

在具体工程里，我会把 **JSON Schema** 当作「对模型输出的类型系统」。它不解决幻觉内容是否可信，但至少解决「形状对不对」。

### 2.1 我会坚持的 schema 习惯

- **尽量少用「任意 object」**：`additionalProperties` 一放开，下游就很难维护。
- **必填字段写死**：用 `required` 列出真正强依赖的键；可选字段用 `nullable` 或显式 `null` 约定，而不是「有时出现有时消失」。
- **枚举用 closed set**：业务上允许的取值写成 `enum`；超出集合一律判为验证失败，进入修复或重试路径。
- **字符串也要约束**：`minLength` / `maxLength` / `pattern`（在合理范围内）能挡住一大批「啰嗦型输出」。

### 2.2 「strict mode」与工具侧能力

如果使用的推理平台支持 **strict JSON / schema-guided decoding**，我会优先打开。它不能消灭所有坏输出，但能把「形状错误」从常见变成罕见，显著降低解析复杂度。

没有平台能力时，补救思路是：

- 缩小输出体积（更少字段、更浅嵌套）。
- 把复杂结构拆成多次调用（每次 schema 更简单）。
- 对高风险字段单独走一次「校验 + 重写」子调用。

## 3. 解析策略：宁可啰嗦，不要侥幸

### 3.1 文本归一化

在 `Extract JSON blob` 阶段，我通常会做几件朴素但有效的事：

- 去掉首尾空白与 BOM。
- 若检测到 Markdown fence（\`\`\`json），截取中间段。
- 若存在「第一个 `{` 到最后一个 `}`」的启发式切片，记录置信度与原始片段 hash，便于线上回放。

### 3.2 解析失败要分级

我把失败分成至少三类，便于告警与重试策略：

1. **SyntaxError**：根本不是合法 JSON——多半是包裹噪声或截断。
2. **SchemaError**：JSON 合法但不符合 schema——多半是字段漂移或类型错误。
3. **SemanticError**：schema 通过但业务规则不通过——例如数值区间、互斥字段、与外部门禁一致性。

前两类更适合自动重试（换温度、换模型、或让模型只做「修复 JSON」）。第三类更适合走业务分支：拒绝、降级、或转人工。

## 4. 与 Agent 工具调用对齐：输出也是「工具协议」的一部分

当 LLM 需要调用工具时，我倾向于把「工具参数」也 schema 化，并与 function calling / tool schema 对齐。这样有三件事同时受益：

- 模型侧：参数形状被约束。
- 运行时：校验失败可以映射到明确的 `tool_error` 事件。
- 评测：可以对「参数正确率」做离线指标，而不是只看最终回答是否好听。

<div class="mermaid">
sequenceDiagram
  participant L as LLM
  participant R as Runtime
  participant T as Tool
  L->>R: tool_call proposal
  R->>R: validate against tool schema
  alt invalid
    R->>L: repair prompt / retry policy
  else valid
    R->>T: execute
    T->>R: result
    R->>L: observation
  end
</div>

## 5. 契约测试：让「坏输出」在 CI 里先爆炸

我会为「解析 + 校验 + 映射」写一层**契约测试**，输入不是理想 JSON，而是一批从日志里脱敏捞出来的真实坏样本，再加上人工构造的边界样例。

最小测试集通常覆盖：

- 带 Markdown 包裹的输出。
- 字段缺失与类型错误。
- 枚举越界与空数组/空字符串的语义。
- 超长字符串与极端数字（是否触发截断、是否溢出）。

测试断言的目标不是「模型永远正确」，而是**系统在坏输入下行为可预测**：重试次数、降级路径、错误码、以及是否留下可回放记录。

## 6. 伪代码：校验与修复的骨架

下面是我在文档里常用的「结构示意」（非特定语言实现）：

```text
function consume_llm_output(raw_text, schema, domain_rules):
  blob = extract_json_blob(raw_text)
  if blob is null:
    return Failure(kind: SYNTAX, detail: "no_json_blob")

  value = parse_json(blob)
  if parse_failed:
    return Failure(kind: SYNTAX, detail: parse_error)

  schema_result = validate_json_schema(value, schema)
  if not schema_result.ok:
    return Failure(kind: SCHEMA, detail: schema_result.errors)

  domain_result = validate_domain_rules(value, domain_rules)
  if not domain_result.ok:
    return Failure(kind: SEMANTIC, detail: domain_result.errors)

  model = map_to_domain_model(value)
  return Success(model)
```

## 7. 上线后我会盯的指标

- **schema pass rate**：通过 schema 的比例；突然下降通常意味着 prompt、模型版本或上游模板变更。
- **repair success rate**：若存在自动修复子调用，修复成功率与平均额外耗时。
- **field-level error heatmap**：哪几个字段最常出错，优先简化 schema 或拆分调用。
- **p95 output tokens**：输出变长往往预示结构漂移或「解释欲」上升。

## 8. 小结

结构化输出不是「让模型更听话」的玄学，而是**把不确定性关进契约里**。我在实践里的优先级一直是：

1. schema 足够简单、可验证；
2. 解析与校验分层、失败可分级；
3. 契约测试覆盖真实坏样本；
4. 线上指标能定位到字段与版本。

做到这四步，再回去迭代 prompt，效率会高很多：至少能分清「是话没说清」还是「接口本身太脆」。
