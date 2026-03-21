---
layout: post
title: Agent Evals：把离线指标变成上线监控（带落地流程）
cover-img: /assets/img/roadmap.jpeg
thumbnail-img: /assets/img/roadmap.jpeg
share-img: /assets/img/roadmap.jpeg
tags: [AI, Agent]
author: pocaster
published: true
mermaid: true
---
Agent 的“离线指标”如果不能迁移到“线上监控”，最后就会变成两套体系：离线评测说还能用，线上用户却频繁踩雷。本文给一套把离线评估落到上线监控的闭环流程，让指标真正可运维。

![Evals roadmap](/assets/img/roadmap.jpeg)

## 1. 先区分三类评估：Offline / Online / Regression

### 1.1 Offline Evals（离线）
用于回答：版本 A 相比版本 B 更可靠吗？

### 1.2 Online Monitoring（线上）
用于回答：在真实分布下是否退化？

### 1.3 Regression Suite（回归）
用于回答：改动是否破坏了“过去稳定”的能力？

它们分别对应不同数据源、不同采样策略、不同触发频率。

<div class="mermaid">
graph LR
  O[Online traffic] --> S[Sampling]
  S --> A[Annotation or heuristics]
  A --> M[Metrics dashboard]
  M --> T[Trigger rollback / fix]
  R[Offline eval set] --> C[Compare versions]
  C --> G[Promote model/pipeline]
  G --> P[Regression tests on each change]
</div>

## 2. 离线指标怎么选：不要只选“答对率”

Agent 的风险点通常不是“语言不通”，而是“行动不对”或“引用不可信”。因此指标建议按行为拆分：

- task_success_rate：任务是否完成
- groundedness / citation_reliability：是否基于引用且引用匹配
- tool_accuracy：工具参数是否正确（成功但错了也算）
- refusal_rate：该拒绝时是否拒绝（避免安全事故）
- latency_cost_tradeoff：延迟与成本是否在 SLA 内

### 小技巧：把指标拆成“可解释子项”
例如 groundedness 可以拆成：
1. Retrieval coverage（检索覆盖）
2. Answer citation alignment（回答引用对齐）
3. Hallucination intensity（幻觉强度）

这样上线追问题时不会只看到一个分数。

## 3. 线上监控怎么做：用“可观测事件”而非“主观体验”

线上指标建议来自事件日志（event log），并尽量做到端到端可追踪。

### 3.1 建议的观测事件
- tool_call_start / tool_call_end（工具调用耗时与结果）
- retrieval_hit / retrieval_miss（检索命中/未命中）
- policy_refusal（策略拒绝原因）
- validation_pass / validation_fail（结果验证通过/失败）

### 3.2 触发规则（Trigger Policy）
把“告警”设计成“可行动”的动作：
- 如果 validation_fail 率上升超过阈值：触发回归测试
- 如果 tool_timeout 上升：优先回看外部依赖/限流策略
- 如果 citation_mismatch 上升：优先回看检索与拼接逻辑

## 4. 从离线到线上迁移：样本分层（Sampling）是关键

很多团队迁移失败是因为“线上样本太杂”，离线评测集却高度理想。建议使用分层采样：

- 按用户意图分层
- 按知识覆盖度分层（检索命中 vs 未命中）
- 按工具复杂度分层（无工具 / 单工具 / 多工具）
- 按风险类型分层（敏感 / 非敏感）

### 4.1 分层采样的“配方”（Recipe）

把分层写成可配置的规则，便于复盘与回归：

<div class="mermaid">
graph TD
  U[User intent] --> I[Intent bucket]
  K[KB coverage] --> C[Coverage bucket]
  T[Tool complexity] --> X[Tool bucket]
  R[Risk type] --> Y[Risk bucket]
  I --> S[Sampling plan]
  C --> S
  X --> S
  Y --> S
</div>

![Sampling plan](/assets/img/AI-Agent-Workflow.png)

## 5. 落地交付：一个最小可用（MVP）Evals 系统

如果我需要一个可以马上跑起来的版本，可以按下面最小闭环建立：

1. 离线评测集：先从 100 个真实问题变体开始
2. 事件日志：把 tool、retrieval、policy、validation 做成可聚合事件
3. 在线抽样：每天抽 50-200 条，按分层规则分配
4. 每周回归：用 regression suite 做版本对比并固化结果

## 6. 示例：告警与回滚策略（伪代码）

```text
IF online.validation_fail_rate > baseline * 1.2 THEN
  run_regression_suite()
  IF regression_score_drop_detected THEN
    rollback_to_last_good()
  ENDIF
ENDIF
```

## 7. 我会使用的“检查清单”

- [ ] 离线指标能解释“失败类型”
- [ ] 线上指标来自事件日志（可追溯）
- [ ] 抽样策略覆盖关键分层
- [ ] 回滚策略与回归测试打通

不同业务里 Agent 的“主战场”不一样：客服更重一次解决与转人工，知识问答更重引用与拒答，工具型更重参数正确与超时。指标字典和抽样分层不必追求一套万能表，按场景选主指标、再配一组辅助指标，通常比堆满仪表盘更管用。写到这里算收笔：评测不是为了打分好看，而是为了在出事前能看见。

