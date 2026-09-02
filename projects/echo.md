---
layout: case-study
title: "Echo AI 写作助手"
subtitle: "让检索、素材和 AI 提示进入写作过程，而不是把写作者拉进另一个聊天窗口。"
case_kind: "个人项目 / AI 产品 Case"
case_theme: "echo"
role: "产品定义、交互设计与原型开发"
scope: "定位 / MVP / 体验迭代 / 本地优先架构"
product_status: "可体验原型 · BYOK"
live_url: "https://echo.inevitable-event.com/"
live_label: "在线体验 Echo"
permalink: /projects/echo/
---

## 产品不是替你写，而是让你继续写

<div class="case-study-proof">
{% include case-status.html kind="implemented" label="当前原型" %}
{% include case-status.html kind="decision" label="产品判断" %}
{% include case-status.html kind="planned" label="后续方向" %}
</div>

写长文本时，真正稀缺的不是一句可以生成的文字，而是一个能持续承载素材、判断与修订的上下文。现实里，片段在笔记里、资料在网页里、草稿在编辑器里；普通聊天工具擅长一次问答，却很难知道用户此刻正写到哪里、已经否定过什么、下一步应当继续展开还是回到材料。

Echo 从这个问题出发：**AI 不应接管正文，而应低打断地参与写作状态。** 第一版因此不把“更长的聊天记录”当成核心能力，而是先做一张可持续使用的写作工作台。

{% include case-figure.html src="/assets/img/projects/echo/workspace.png" alt="Echo 当前线上工作台：文稿入口、共鸣库入口和本地优先提示位于同一写作界面" caption="当前原型界面。未配置模型时，产品明确提示能力边界；文稿仍可在本地继续编辑与保存。" %}

## 一张图看懂产品路径

<div class="case-study-flow" aria-label="Echo 的写作支持闭环">
  <div class="case-study-flow__step"><span>01</span><strong>文档事件</strong><small>输入、停顿、切换、修订</small></div>
  <div class="case-study-flow__step"><span>02</span><strong>作者记忆</strong><small>作品、素材、偏好与修订痕迹</small></div>
  <div class="case-study-flow__step"><span>03</span><strong>环境式代理</strong><small>在后台形成候选，而非抢占正文</small></div>
  <div class="case-study-flow__step"><span>04</span><strong>织带与详情</strong><small>提示在写作环境中出现、可展开追溯</small></div>
  <div class="case-study-flow__step"><span>05</span><strong>采纳与反馈</strong><small>用户决定采用、修改或忽略</small></div>
</div>

这是 Echo 的目标闭环。当前原型已具备文稿、知识库、织带提示、设置与帮助等基础能力；“长期作者记忆”和多代理协同则被清楚保留为后续架构方向，而不是伪装成已经完成的功能。

## MVP：先验证“不中断”，再扩展“会思考”

我把第一版的范围收在四个连续动作里：

1. **持续写作：** 文稿在当前设备自动保存，写作不依赖先建立一轮聊天。
2. **带着材料写：** 资料可以进入知识库，减少每次从零拼接上下文。
3. **低打断提示：** 织带负责提供候选方向，详情面板负责展开依据，不让弹窗覆盖正文。
4. **用户保有决定权：** AI 的价值是提出结构、回响和修改线索；接受、改写、忽略与回到原材料始终是用户动作。

<div class="case-study-callout"><p><strong>MVP 取舍：</strong>先证明“AI 进入写作过程而不打断写作”是否成立，而不是先堆叠更多 Agent、模型供应商或一键生成入口。</p></div>

## 关键决策 01：把强提醒收回到段落边上

{% include case-decision.html id="echo-decision-one" index="DECISION / 01" title="诊断必须可感知，但不该成为新的阅读对象" problem="早期的陈词滥调提示更像浮层或醒目标签，用户能看见问题，但它同时切断了阅读节奏。" decision="诊断应贴近被诊断的段落，并让用户在需要时才进一步展开；提示应承担定位，不承担解释全文。" action="将提示收敛为随当前段落对齐的侧边弱标记；通过编辑器段落视口数据校准位置，避免标记随内容滚动产生漂移。" result="已完成交互收敛与位置对齐实现。此处展示的是可验证的迭代结果，不宣称尚未测量的效率提升。" %}

{% include case-figure.html variant="archive" src="/assets/img/projects/echo/early-workspace.png" alt="Echo 的早期工作台界面，用于呈现产品从功能展示走向持续写作界面的演进" caption="早期工作台记录：界面先验证文稿与灵感同屏，后续迭代再进一步收敛提示的存在感与段落对齐方式。" %}

## 关键决策 02：辅助能力失败，主写作链路不能失败

{% include case-decision.html id="echo-decision-two" index="DECISION / 02" title="模型兼容性是产品的降级问题，不只是接口报错" problem="用于筛选织带内容的兼容模型出现能力或接口不匹配，若直接失败，用户会把辅助提示不可用理解为整个写作台不可用。" decision="写作主任务与辅助能力解耦；当特定模型不满足要求时，应给出可预期的回退路径。" action="将不兼容模型从该辅助链路中剔除，并回退到主模型能力，保留文稿、本地保存和写作主界面的可用性。" result="已完成兼容性降级处理；下一阶段再通过真实写作者使用记录评估提示的采纳与修订价值。" %}

## 现在验证了什么，还没有验证什么

<div class="case-study-two-mode">
  <div>
    <span class="case-study-two-mode__label">IMPLEMENTED</span>
    <h3>一张可继续的写作台</h3>
    <p>文稿、本地保存、知识库、织带提示、设置与帮助在同一工作流中；模型调用由用户主动配置。</p>
  </div>
  <div>
    <span class="case-study-two-mode__label">NEXT TO VALIDATE</span>
    <h3>作者是否愿意长期留下来</h3>
    <p>仍需通过真实写作任务验证：用户是否愿意导入自己的材料，以及先理清再生成是否能带来更可继续修改的文本。</p>
  </div>
</div>

<div class="work-links">
  <a href="https://echo.inevitable-event.com/" target="_blank" rel="noopener noreferrer">在线体验 Echo ↗</a>
</div>
