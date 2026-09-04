---
layout: case-study
title: "Another History"
subtitle: "A narrative system where character, memory, and world state become accountable actions and consequences—not unconstrained continuation."
case_kind: "Independent project / Generative narrative case"
case_theme: "another-history"
role: "Product definition, narrative systems, and prototyping"
scope: "Experience goals / MVP / Rule systems / AI boundaries"
product_status: "Playable prototype · Skeleton mode / Dynamic BYOK mode"
live_url: "https://history.inevitable-event.com/"
live_label: "Play Another History"
permalink: /projects/another-history/
preview_img: "/assets/img/projects/another-history/journey.png"
---

## 不是让模型续写，而是让玩家能走进去

<div class="case-study-proof">
{% include case-status.html kind="implemented" label="可玩原型" %}
{% include case-status.html kind="decision" label="体验规则" %}
{% include case-status.html kind="planned" label="连续世界方向" %}
</div>

生成式叙事最容易滑向两种失控：要么只是把一段自由文本接在另一段后面，玩家没有真正可做的事；要么为了让故事好看，模型忘记角色、时间和已经发生的事实。Another History 的产品问题不是如何生成更多剧情，而是：**怎样让玩家的观察与行动进入一个持续成立的世界，并留下可回看的旅程。**

所以我先把交互缩回到具体的人、事、地点与迹象。玩家不会收到当前任务，而是在眼前的场景里观察、接近、询问、跟随、等待或离开；世界依据已经确定的状态给予回应。

{% include case-figure.html src="/assets/img/projects/another-history/journey.png" alt="Another History 的旅程主界面，包含境遇文本、状态、物证、线索与异史卷轴" caption="本地原型的主界面：叙事、选择、状态与异史卷轴同时存在，目的是让每次行动都有可追溯的上下文。" %}

## 一张图看懂：行动如何变成一段异史

<div class="case-study-flow" aria-label="Another History 的互动叙事循环">
  <div class="case-study-flow__step"><span>01</span><strong>抵达场景</strong><small>世界给出少量具体、可感知的兴趣点</small></div>
  <div class="case-study-flow__step"><span>02</span><strong>观察与行动</strong><small>接近、询问、跟随、等待或离开</small></div>
  <div class="case-study-flow__step"><span>03</span><strong>更新状态</strong><small>地点、时间、线索、物证与既知事实</small></div>
  <div class="case-study-flow__step"><span>04</span><strong>叙事回应</strong><small>骨架决定后果，AI 在约束内补足表达</small></div>
  <div class="case-study-flow__step"><span>05</span><strong>形成记录</strong><small>只回收玩家实际经历过的内容</small></div>
</div>

## MVP：先打磨一段完整旅程，而不是先造一个开放世界

第一阶段选择《无水之渡》作为 20—30 分钟纵向切片：玩家抵达干涸渡口，在渡夫、药贩与湿绳等具体对象之间停留和选择；黄昏由行动与时间推进而来，离开也可以是有效结局。

<div class="case-study-callout"><p><strong>MVP 取舍：</strong>先验证一段旅程是否能做到行动可理解、状态可连续、不同走法都能收束，再扩展更多地点、人物与连续世界，而不是用内容数量掩盖体验问题。</p></div>

{% include case-figure.html src="/assets/img/projects/another-history/entry.png" alt="Another History 的行旅入口界面，中央提供开始新行旅按钮" caption="入口界面刻意保持克制：先让玩家走进一段具体旅程，而不是先阅读一整套世界观说明。" %}

## 关键决策 01：骨架保证可玩，AI 负责让世界有呼吸

<div class="case-study-two-mode">
  <div>
    <span class="case-study-two-mode__label">SKELETON MODE · NO KEY</span>
    <h3>预设骨架保证完整体验</h3>
    <p>剧情导向、禁忌、目标、门禁与后果来自结构化 JSON。即使用户跳过 API 配置，仍可进入预设体验，不把能玩交给模型接口。</p>
  </div>
  <div>
    <span class="case-study-two-mode__label">DYNAMIC MODE · BYOK</span>
    <h3>动态生成被收进规则边界</h3>
    <p>接入 OpenAI 兼容 API 后，Conductor、Writer 与 ChoiceEngine 生成境遇、选项和微分支；它们只能在骨架约束的既知事实中工作。</p>
  </div>
</div>

{% include case-decision.html id="history-decision-one" index="DECISION / 01" title="不让 API 可用性决定产品是否可玩" problem="完全依赖实时生成的叙事，一旦用户没有 Key、模型波动或服务失败，产品就失去最基本的体验闭环。" decision="先把世界骨架、关键节点与行动后果固化；AI 是增强层，不是游戏规则与可玩性的唯一来源。" action="以结构化骨架数据约束剧情导向、禁忌、门禁和状态后果，并把动态生成放在 Conductor、Writer、ChoiceEngine 的受控顺序中。" result="当前原型同时支持无 Key 的骨架入口和用户自带 Key 的动态模式；两者的边界在产品说明中明确呈现。" %}

## 关键决策 02：世界需要账本，结局不能泄露玩家没见过的事

{% include case-decision.html id="history-decision-two" index="DECISION / 02" title="把记住什么从提示词要求变成产品规则" problem="长叙事中，模型容易遗忘时间、人物关系和已发生的后果；更糟的是，结局可能替玩家补写未经历的信息。" decision="地点、时间、物证、线索、已知事实与行动后果必须作为可持久化状态维护；异史只回收玩家已观察到的事实。" action="将世界账本、旅程状态、运行时节点和记录持久化拆成独立模块，并为关键事实边界建立回归测试。" result="当前代码已包含状态、存档与事实边界相关的单元测试；连续世界规模与系统化评测仍处于后续迭代阶段。" %}

## 现在验证了什么，还没有验证什么

<div class="case-study-two-mode">
  <div>
    <span class="case-study-two-mode__label">IMPLEMENTED</span>
    <h3>一段有约束的可玩旅程</h3>
    <p>骨架、状态、物证、线索、卷轴、多槽存档与 BYOK 动态引擎均已有代码和可运行原型支撑。</p>
  </div>
  <div>
    <span class="case-study-two-mode__label">NEXT TO VALIDATE</span>
    <h3>更长世界中的持续探索感</h3>
    <p>下一步不是简单增加事件，而是验证跨地点、跨时间的世界账本能否持续提供新发现，同时保持规则可解释、后果可信。</p>
  </div>
</div>

<div class="work-links">
  <a href="https://history.inevitable-event.com/" target="_blank" rel="noopener noreferrer">在线体验 Another History ↗</a>
</div>
