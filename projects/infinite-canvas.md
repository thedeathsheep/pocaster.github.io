---
layout: case-study
title: "Infinite Canvas"
subtitle: "A production surface for script, assets, shots, and AI generation — designed around what creative work needs to remember."
case_kind: "SumengAI / Research dossier"
case_theme: "echo"
case_format: "dossier"
role: "Product strategy, user research, PRD, interaction design, and prototype direction"
scope: "Canvas / Agent / Script import / Asset system / Collaboration"
product_status: "Released and iterated · Apr—Aug 2026"
archive_sources:
  - "画布与 Agent：AI 短剧生产场景下的竞品结论与产品建议"
  - "短剧创作画布工作台 · 全量需求与功能说明"
  - "画布 2 期需求调整方案：短剧多模态生成画布"
  - "画布 2 期需求说明（P0 版）"
  - "三类用户反馈整合：海外客户 / 国内客户 / 自由创作者"
  - "画布能力提需：剧本 / 分镜导入"
  - "对话流与画布数据联动 PRD"
  - "节点工具栏能力 MVP 需求说明"
  - "画布节点级有锁协作需求说明"
permalink: /projects/infinite-canvas/
---
<span id="situation"></span>
## Situation / the production break

短剧生产不是从一张空白画布开始的。剧本在文档里，角色和场景图在本地或资产库里，镜头在生成页里，结果又散在不同任务记录中。每换一个镜头，用户都要重新上传、重新绑定、重新向模型解释一次已经做过的决定。

我先把问题写成一条生产链，而不是一个功能需求：**文本 → 资产 → 镜头 → 生成 → 采用 → 下一镜头**。画布的价值不在“无限”，而在于让这条链上的对象和关系可以继续存在。

<span id="evidence"></span>
## Evidence / what the material changed

这项工作经过竞品结论、一期/二期 PRD、P0 评审、节点原型、导入方案、反馈转需求和协作规则等多轮收敛。下面的证据不是界面展示，而是每个产品判断的来源。

{% include case-evidence.html id="canvas-overview" index="01" wide=true src="/assets/img/projects/infinite-canvas/evidence/canvas-overview.png" alt="无限画布中的文本节点与生成入口" claim="PRODUCT WALKTHROUGH / THE CANVAS AS A WORKSPACE" caption="从文本节点到生成入口，画布把创作上下文留在同一工作面上。" note="真实走查图：重点不是界面数量，而是用户能否从已有内容继续下一步。" %}
{% include case-evidence.html id="canvas-assets" index="02" wide=true src="/assets/img/projects/infinite-canvas/evidence/asset-library-release.png" alt="发布版本中的资产库" claim="RELEASE MATERIAL / ASSETS WITH CONTEXT" caption="资产库承接角色、场景、道具和参考图，成为创作链路中的可复用资源层。" %}
{% include case-evidence.html id="canvas-map" index="03" src="/assets/img/projects/infinite-canvas/evidence/canvas-system-map.svg" alt="画布对象与生产链关系图" claim="SYSTEM MODEL / SOURCE TO RESULT" caption="脚本提供来源，资产提供上下文，镜头承载任务，结果保留版本与采用状态。" %}

<span id="tension"></span>
## Tension / one surface, four pressures

<div class="case-tension-grid"><div><b>CREATOR</b><strong>从已有材料开始</strong><p>剧本、参考图和半成品都不能被丢掉。</p></div><div><b>SYSTEM</b><strong>保留上下文关系</strong><p>对象需要有来源、类型和可复用状态。</p></div><div><b>BUSINESS</b><strong>减少无效生成</strong><p>更少重复绑定意味着更少试错成本。</p></div><div><b>BOUNDARY</b><strong>不做通用白板</strong><p>画布必须服务短剧生产，而不是承载一切。</p></div></div>
{% include case-evidence.html id="canvas-entry" index="04" src="/assets/img/projects/infinite-canvas/evidence/canvas-entry-flow.svg" alt="剧本入口和镜头入口汇入同一画布上下文" claim="INFORMATION ARCHITECTURE / TWO WAYS IN" caption="从剧本开始和从单个镜头开始是两种真实状态；最终落到同一套对象、资产和结果关系里。" %}

<span id="decisions"></span>
## Decisions / the ledger

{% include case-decision-ledger.html id="canvas-ledger-one" index="01" alternatives="通用白板、文件堆放区、面向短剧生产对象的画布。" decision="以生产对象为核心：脚本、资产、镜头、任务和结果都有语义。" why_now="先做自由摆放，后续 Agent、导入和资产复用都会重新定义关系。" excluded="首版不追求任意节点、全量专家参数和完整剪辑时间线。" %}
{% include case-decision-ledger.html id="canvas-ledger-two" index="02" alternatives="独立聊天框，或理解当前节点并写回画布的 Agent。" decision="选择上下文内 Agent：围绕节点、选区或明确范围执行，并把结构化结果写回。" why_now="结果停在聊天里，用户仍要手动搬运，项目状态不会累积。" excluded="不允许无预览地改写整张画布；所有改变都必须可撤销。" %}

<span id="prototype"></span>
## Prototype / make the model usable

产品形态收敛为“画布主区 + 右侧属性/执行配置 + 侧栏或底部 Agent”。画布承载对象与关系，属性区处理模型、比例、质量和风格，Agent 负责当前上下文里的可执行动作。
{% include case-evidence.html id="canvas-return" index="05" src="/assets/img/projects/infinite-canvas/evidence/canvas-return-node.png" alt="生成结果回到画布节点" claim="RELEASE MATERIAL / RESULT WRITEBACK" caption="结果回到对应位置，保留版本和来源，下一次修改从已有结果继续。" %}
这套方案把剧本/分镜导入、节点工具栏、素材拖入镜头、视频任务状态、结果版本和对话流—画布联动放进同一套语义里。它们不是并列功能，而是同一条生产链的不同入口。

<span id="validation"></span>
## Validation / what should be measured

后续验证拆成四个可观察行为：减少重复上传和绑定；角色、场景和道具是否跨镜头复用；不同入口是否更快得到第一条可用结果；Agent 建议是否被应用并写回。成功标准先记录基线，再比较入口和版本；不把产品假设写成已经发生的结果。

<span id="archive"></span>
{% include case-source-index.html sources=page.archive_sources note="原始工作文档为内部资料。公开页保留研究结论、产品判断和可发布视觉证据；未公开链接、客户内容和内部讨论不直接开放。" %}
