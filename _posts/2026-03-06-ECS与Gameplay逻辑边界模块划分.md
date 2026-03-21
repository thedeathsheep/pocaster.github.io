---
layout: post
title: ECS 与 Gameplay：我在模块边界上画的线
cover-img: /assets/img/cover02.jpg
thumbnail-img: /assets/img/cover02.jpg
share-img: /assets/img/cover02.jpg
tags: [Game Dev]
author: pocaster
published: false
mermaid: true
excerpt: ECS 常被说成性能银弹，但更大收益往往在架构清晰度。本文从组件职责、系统调度顺序、Gameplay 标签与事件总线出发，记录一套划分「模拟层 / 规则层 / 表现层」的经验，避免把游戏逻辑写成一团互相掏指针的意大利面。
---

第一次认真用 ECS（Entity-Component-System）时，我冲着想榨干缓存友好与并行调度。跑起来之后才发现：**真正省下的往往是沟通成本**——当「什么东西放在哪」有约定，策划加需求、程序查 bug 都不会从全局搜函数开始。

反过来，边界画歪时，ECS 也会变成另一种意大利面：组件像万能字典，系统之间通过隐式顺序耦合，debug 时谁在改数据都说不清。本文记录我后来在项目里坚持的划分方式，偏工程向，不绑定某一引擎方言。

![ECS boundaries](/assets/img/cover02.jpg)

## 1. 三个层次：模拟、规则、表现

我习惯在脑子里把游戏循环拆成三层：

- **Simulation（模拟）**：位置、速度、碰撞体、生命值等「世界状态」如何随时间推进。
- **Rules / Gameplay（规则）**：伤害公式、状态效果、任务进度、掉落与结算——**玩法真相**发生在这里。
- **Presentation（表现）**：动画参数、音效触发、UI 刷新、镜头——只读模拟与规则的结果，或发请求，不偷偷改真相。

ECS 常常主要服务第一层；但若把第二层也拆得好，长期扩展会轻松很多。

<div class="mermaid">
flowchart TB
  subgraph sim[Simulation]
    S1[Transform integrate]
    S2[Physics broad/narrow]
  end
  subgraph rules[Gameplay rules]
    R1[Combat resolution]
    R2[Quest progression]
  end
  subgraph pres[Presentation]
    P1[Animation sync]
    P2[UI events]
  end
  sim --> rules
  rules --> pres
</div>

## 2. 组件职责：宁可多系统，少「上帝组件」

早期最容易犯的错，是做一个 `PlayerComponent` 把移动、战斗、背包、任务全塞进去。短期省事，长期任何小功能都要碰同一块内存。

我会倾向：

- **按变更频率拆分**：每帧变的与偶尔变的不要硬绑在同一结构里。
- **按权威来源拆分**：例如 `Health` 可以只属于规则层写入，表现层只订阅变化。
- **禁止跨层偷偷写**：表现层若直接改 `Transform` 而不走模拟规则，迟早出现「客户端看起来对、服务器不对」类问题（联机或回放场景尤其痛）。

## 3. 系统顺序：把依赖画成有向无环图

多系统并行很香，但**写共享组件**时必须有顺序约定。我的习惯是维护一张显式表（或拓扑排序配置）：

- 物理积分 → 碰撞解析 → 伤害结算 → 死亡处理 → 销毁队列；
- 任务与剧情触发放在「规则稳定之后」，避免读到半帧状态。

没有这张图，就会出现「有时先扣血有时先加盾」这种顺序敏感 bug，复现还靠运气。

## 4. Gameplay 标签与事件：少掏邻居组件

系统之间直接 `GetComponent` 链式调用，是耦合温床。我更愿意用两类机制之一：

- **显式事件**（fire-and-forget 或队列）：`OnDamaged`、`OnQuestCompleted`，携带必要 payload；
- **短期存在的命令组件**：例如 `PendingDamage` 由专门系统消费后删除。

关键是：**数据流方向单一**，避免 A 系统改 B，B 又回调 A。

## 5. 与脚本、策划表数据的边界

策划驱动的数值表、脚本任务、对话图，通常属于规则层输入。我会约定：

- 表驱动只修改「规则可理解的中间模型」，不直接操纵表现对象；
- 热更或动态加载失败时，有清晰降级（回默认表、禁用某特性），而不是半初始化状态继续跑。

## 6. 调试与回放：ECS 友好的日志长什么样

为了查「是谁改了血量」，我会让规则系统在写入前打**结构化 diff**（示意）：

```text
frame=18442 entity=e_7712
change=Health
from=32
to=18
reason=DOT_tick
system=StatusEffectSystem
```

回放时重放同一输入流，对比 diff 序列是否一致。ECS 若边界干净，这类回归会比单体架构便宜很多。

## 7. 常见反模式（我踩过就写进团队备忘）

- **UI 里算伤害**：表现层偷跑规则，后期一定分裂。
- **在动画事件里改任务状态**：时间轴与规则时钟纠缠，版本一多必炸。
- **用字符串魔法分支代替组件组合**：短期 if 很快，长期无法静态分析依赖。

## 8. 收束

ECS 不是语法，而是一种**组织纪律**。当模拟、规则、表现三层边界清楚，系统顺序有文档、事件有 payload，项目才能在人数变多时仍然可维护。我的底线很简单：**任何一帧的世界状态，都能回答「是谁、依据什么规则、改动了哪些权威数据」**——答不出来，就别怪 bug 难查。

</think>


<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Read