---
layout: case-study
title: "3D Director's Desk"
subtitle: "A spatial planning layer for AI short-drama creators: block once, cover a scene with cameras, then return usable control signals to the canvas."
case_kind: "SumengAI / Research dossier"
case_theme: "echo"
case_format: "dossier"
role: "User research, product positioning, MVP definition, prototype scope, and interaction design"
scope: "Creator research / Competitive analysis / 3D director MVP / Resource review"
product_status: "Research and clickable prototype · Jul—Aug 2026"
archive_sources:
  - "3D 导演台产品规划｜AI 短剧 / 漫剧创作者研究与 MVP"
  - "3D 导演台用户需求与真实社媒证据研究（2026-07）"
  - "RunningHub 3D 导演台功能说明（截图标注版）"
  - "LiblibTV 导演台功能说明（截图标注版）"
  - "3D 导演台真实模型资源清单（评审版）"
  - "画布 2 期需求调整方案：短剧多模态生成画布"
permalink: /projects/3d-directors-desk/
---
<span id="situation"></span>
## Situation / the repeated failure

短剧创作者反复遇到的不是“不会建模”，而是镜头关系不稳定：两个人谁在左边、面向谁、视线落在哪里、道具在谁手里、切到近景后轴线是否还成立。提示词和单张参考图很难稳定承载这些关系，于是每换一个镜头就要重新抽卡、重新解释、重新返工。

我把导演台定义成画布内的**镜头规划与空间连续性控制层**。它先把场面调度说清楚，再把可被下游模型消费的参考带回生产链路；它不是简化版 Blender，也不承诺一张 3D 截图就能保证生成结果。

<span id="evidence"></span>
## Evidence / from research to a testable task

研究先从公开教程、评论和搜索信号形成假设，再结合竞品流程、对象/机位组织和真实工作材料收敛。最终被固定成一个可重复任务：给定双人对话、角色和场景素材，产出主镜头、A 过肩、B 反打并回写画布。
{% include case-evidence.html id="director-baseline" index="01" src="/assets/img/projects/3d-directors-desk/director-panel.png" alt="竞品导演台对象调度界面" claim="COMPETITOR REFERENCE / OBJECT CONTROL" caption="竞品基线证明了对象、舞台变换和属性调节的必要性；它也提醒我，专业控制不能成为新手的默认语言。" note="此图是竞品走查材料，不是本人开发界面。" %}
{% include case-evidence.html id="director-node" index="02" wide=true src="/assets/img/projects/3d-directors-desk/evidence/director-canvas-overview.png" alt="画布中的3D导演台节点与镜头关系" claim="PRODUCT WALKTHROUGH / DIRECTOR AS A NODE" caption="导演台不是独立的 3D 房间，而是画布中连接场景、文本、资产和镜头结果的生产节点。" note="真实走查图：用画布关系解释导演台为何存在。" %}
{% include case-evidence.html id="director-golden-task" index="03" src="/assets/img/projects/3d-directors-desk/evidence/golden-task.svg" alt="导演台黄金任务流程" claim="RESEARCH PROTOCOL / GOLDEN TASK" caption="验证对象被固定为：带入素材、完成站位、生成覆盖镜头、回写画布；停留时长不是价值指标。" %}

<span id="tension"></span>
## Tension / the product has four jobs
<div class="case-tension-grid"><div><b>ACCESS</b><strong>零基础能开始</strong><p>默认不把用户丢进 XYZ、对象树和复杂导航。</p></div><div><b>FIDELITY</b><strong>空间关系不漂</strong><p>位置、朝向、视线和轴线要能跨镜头保持。</p></div><div><b>CONTROL</b><strong>下游能消费</strong><p>参考图只是起点，结构化信息按模型能力展开。</p></div><div><b>COST</b><strong>失败前可见</strong><p>先验证构图，再决定是否正式生成。</p></div></div>
{% include case-evidence.html id="director-control" index="04" src="/assets/img/projects/3d-directors-desk/evidence/control-layer.svg" alt="导演语言到结构化控制信息的渐进披露" claim="PRODUCT MODEL / SEMANTIC TO STRUCTURED" caption="用户用“面向 B”“过肩近景”“保持同侧”表达意图，系统再转成位置、视线、相机和深度等控制信息。" %}

<span id="decisions"></span>
## Decisions / the ledger
{% include case-decision-ledger.html id="director-ledger-one" index="01" alternatives="专业 DCC/Blender 语言，或导演语言。" decision="默认使用演员、机位、景别、面向和镜头包等导演语言。" why_now="3D 眩晕和导航迷失会直接阻断第一次任务。" excluded="首屏不暴露完整对象树、XYZ、材质和骨骼控制。" %}
{% include case-decision-ledger.html id="director-ledger-two" index="02" alternatives="只输出 RGB 参考图，或一开始承诺完整结构化控制。" decision="先交付构图参考，再按下游能力增加深度、姿态、分割和相机元数据。" why_now="不同模型遵循能力不同，必须把能控制什么变成可测事实。" excluded="不承诺任何下游模型 100% 遵循 3D 参考。" %}
{% include case-decision-ledger.html id="director-ledger-three" index="03" alternatives="完整 3D 编辑器，或只证明镜头规划闭环。" decision="V1 只证明一次站位、多机位覆盖并回写画布。" why_now="产品价值来自减少重抽和返工，而不是拥有更多按钮。" excluded="复杂动画时间线、最终渲染、自定义模型和骨骼编辑进入 P1/P2。" %}

<span id="prototype"></span>
## Prototype / the minimum believable loop

MVP 被压缩为四步：选任务、摆调度、出镜头、回写画布。默认视图采用俯视/2D 导演模式；用户拖动角色、设置面向、选择过肩/近景等语义镜头，再获得一组可继续生成的参考。
{% include case-evidence.html id="director-world" index="05" wide=true src="/assets/img/projects/3d-directors-desk/evidence/director-world-setup.png" alt="3D场景配置与导演台入口" claim="PRODUCT WALKTHROUGH / SCENE BEFORE SHOT" caption="场景配置先解决空间、资产与镜头的关系，再进入具体镜头规划。" note="真实走查图：能力拆解聚焦必须保留的舞台操作，而不是复制专业软件的全部负担。" %}
关闭只保存工程；截图生成图片节点；导出才生成预演视频节点。三个动作的产品语义不能混成一次“生成”。

<span id="validation"></span>
## Validation / the scorecard

首轮验证覆盖 AI 漫剧新手、稳定更新的个人创作者和工作室/MCN 用户。统一任务是双人对话覆盖镜头；记录首次有效参考图时间、求助次数、误操作、相机迷失、跨轴、回写成功率、位置/朝向相关失败和重试次数。

核心指标不是导演台停留时长，而是同一场景获得的可用镜头数、首轮生成可接受率、每个可用镜头的总消耗，以及是否减少下游重试。文档中的数值属于待验证目标，不冒充上线结果。

<span id="archive"></span>
{% include case-source-index.html sources=page.archive_sources note="原始研究、竞品走查和资源评审为内部材料。公开页保留决策逻辑与可发布证据；竞品图已明确标注，内部链接和未公开内容不直接开放。" %}
