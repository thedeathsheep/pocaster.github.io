---
layout: post
title: 2D物理(10)SoftBody & Verlet 积分
cover-img: /assets/img/0028963732_0.jpg
thumbnail-img: /assets/img/0028963732_0.jpg
share-img: /assets/img/0028963732_0.jpg
tags: [Game Dev]
author: pocaster
mathjax: true
---


## **软体模拟（Soft Bodies）与Verlet积分深入解析**

---

### **I. Verlet积分的基础理论与优势**

#### **1. Verlet积分原理**
Verlet是一种基于位置更新的数值积分法，核心思想是通过 **当前和前一帧的位置** 推算下一帧位置，绕过了直接依赖速度的计算。

**基础公式**：
$$
x_{t+\Delta t} = 2x_t - x_{t-\Delta t} + a_t (\Delta t)^2
$$
其中：
- $$x_{t+\Delta t}$$：下一时刻位置
- $$x_t$$：当前时刻位置
- $$x_{t-\Delta t}$$：上一时刻位置
- $$a_t$$：当前加速度

#### **2. Verlet的独特优势**
---

| **特性**                 | **说明**                            |
|--------------------------|-------------------------------------|
| **时间可逆性**           | 适合需要回放系统的物理模拟          |
| **守恒能量特性**        | 天然减少能量逸散，适合弹簧系统      |
| **无需显式存储速度**    | 通过位置差隐式计算速度，节省内存    |
---
#### **3. 代码实现**
```cpp
struct Particle {
    Vec2 position;     // 当前位置
    Vec2 prev_position; // 上一帧位置
    Vec2 acceleration; 
    bool movable = true; // 是否固定（如布料四角）
};

void VerletIntegrate(Particle& p, float dt) {
    if (!p.movable) return;

    Vec2 temp = p.position; // 保存当前帧位置
    Vec2 velocity = (p.position - p.prev_position); // 隐式速度 ≈ Δx/Δt (dt已被吸收)
    p.position += velocity + p.acceleration * dt * dt;
    p.prev_position = temp;
    p.acceleration = Vec2(0,0); // 清空加速度
}
```

---

### **II. 软体动力学模型：质點-弹簧系统**

#### **1. 网格拓扑构造**
软体由 **质点（粒子）和连接弹簧** 组成，常见网格类型：

---

| **网格类型**     | **连接方式**                      | **适用场景**          |
|------------------|-----------------------------------|-----------------------|
| **四面体网格**   | 三维结构，每个四面体含4个质点      | 实体软体(如果冻)     |
| **三角形网格**   | 二维/三维表面网格，每个面三个质点   | 布料、薄膜           |
| **棱柱网格**     | 棱边连接主导                      | 绳索、链状结构       |

---

**代码结构**：
```cpp
struct SoftBody {
    vector<Particle> particles;
    vector<Spring> springs;  // 弹簧数组
    vector<Triangle> faces;  // 面信息（可选，用于碰撞检测）
};

struct Spring {
    int particleA, particleB; // 关联的质点索引
    float rest_length;        // 自然长度
    float stiffness;          // 弹性系数k
    float damping;            // 阻尼系数b
};
```

#### **2. 弹簧类型多元化**
软体中需组合多种弹簧类型以增强结构稳定性：

| **弹簧类型**    | **作用**                           | **示意图**             |
|-----------------|------------------------------------|------------------------|
| **结构弹簧**    | 连接相邻节点，防止拉伸               | 粒子间直接连线         |
| **剪切弹簧**    | 连接对角线节点，抵抗剪切变形         | 网格对角线连线         |
| **弯曲弹簧**    | 跨间隔连接，阻止网格过度弯曲         | 跳过一个节点的长连接   |

---

### **III. 软体更新流程：约束与积分结合**

#### **1. 完整模拟管线**
以下流程每帧执行一次（伪代码）：
```cpp
void SoftBody::Update(float dt) {
    // 1. 重置所有粒子的加速度
    for (auto& p : particles) p.acceleration = Vec2(0,0);

    // 2. 收集外力（重力、风力等）
    ApplyExternalForces(particles);

    // 3. Verlet积分更新位置（见前文代码）
    for (auto& p : particles) VerletIntegrate(p, dt);

    // 4. 处理所有弹簧约束（多次迭代提高稳定性）
    for (int i = 0; i < SOLVER_ITERATIONS; ++i) {
        for (auto& spring : springs) {
            ApplySpringConstraint(spring);
        }
    }

    // 5. 碰撞检测与响应（可选）
    ResolveCollisions();
}
```

#### **2. 弹簧约束的松弛法求解**
Verlet常与 **位置约束** 结合，而非直接处理力。弹簧通过将粒子拉向满足长度的位置来模拟弹性：

```cpp
void ApplySpringConstraint(const Spring& spring) {
    Particle& a = particles[spring.particleA];
    Particle& b = particles[spring.particleB];
  
    Vec2 delta = b.position - a.position;
    float curr_length = delta.Length();
  
    // 计算长度偏离比例
    float diff = (curr_length - spring.rest_length) / curr_length;
    if (curr_length == 0) return; // 防止除以零

    // 计算位置修正量 (考虑刚度和阻尼)
    Vec2 correction = delta * diff * spring.stiffness;

    // 分布修正到两个粒子（若可移动）
    if (a.movable) a.position += correction * 0.5f;
    if (b.movable) b.position -= correction * 0.5f;
}
```

**关键参数**：
- `stiffness` 越高，弹簧越刚硬（建议0.1~0.9之间）
- `SOLVER_ITERATIONS` 迭代次数影响稳定性，通常3~6次

---

### **IV. 高级技巧：稳定性与优化**

#### **1. 时步控制与子步（Substepping）**
当时间步长 `dt` 较大时（如1/30秒），物理更新可能出现抖动。可通过划分子步提升精度：
```cpp
void SoftBody::UpdateWithSubsteps(float dt, int substeps) {
    float sub_dt = dt / substeps;
    for (int i = 0; i < substeps; ++i) {
        Update(sub_dt); // 执行多次子步更新
    }
}
```

#### **2. 显式与半隐式积分的对比**
虽然Verlet适合一般软体场景，但在高刚度系统中可能需要切换到更稳定的隐式积分。
---

| **积分方法**      | **复杂度** | **稳定性**         | **适合场景**         |
|--------------------|------------|--------------------|----------------------|
| **显式Verlet**     | O(n)       | 中等，需迭代松弛    | 适度弹性、布料       |
| **隐式欧拉**       | O(n³)      | 极高，但计算昂贵    | 极刚性材料（如橡胶） |
| **Position-Based** | O(n)       | 高度可控           | 实时软体、游戏开发   |
---

#### **3. 碰撞与撕裂扩展**
- **边界处理**：将软体粒子与碰撞体间的排斥力纳入约束
- **动态拓扑修改**：当弹簧拉伸超过阈值时移除，模拟布料撕裂

```cpp
void HandleSpringBreak() {
    for (auto& s : springs) {
        Vec2 delta = particles[s.particleB].position - 
                    particles[s.particleA].position;
        if (delta.Length() > s.rest_length * BREAK_THRESHOLD) {
            MarkSpringForDeletion(s); // 标记为待删除
        }
    }
    DeleteMarkedSprings(); // 实际移除超限弹簧
}
```

---

### **V. 实现案例：2D可交互软球**

#### **1. 初始化软球**
生成圆形分布的质点及交叉弹簧：
```cpp
SoftBody CreateSoftBall(Vec2 center, float radius, int layers) {
    SoftBody ball;

    // 生成同心圆粒子层
    for (int layer = 0; layer < layers; ++layer) {
        float r = radius * (layer + 1) / layers;
        int num_particles = 10 * (layer + 1);
        for (int i = 0; i < num_particles; ++i) {
            float angle = 2 * PI * i / num_particles;
            Particle p;
            p.position = center + Vec2(r * cos(angle), r * sin(angle));
            if (layer == layers-1) p.movable = false; // 外层固定
            ball.particles.push_back(p);
        }
    }

    // 构建弹簧网格（结构+剪切+弯曲连接）
    // 具体连接逻辑需根据环形拓扑计算，此处简化
    return ball;
}
```

#### **2. 渲染与交互**
将粒子网格渲染为三角面片，实现软体形变效果：
```cpp
void RenderSoftBody(const SoftBody& body) {
    // 绘制顶点间连线
    for (const auto& spring : body.springs) {
        DrawLine(body.particles[spring.particleA].position,
                 body.particles[spring.particleB].position);
    }

    // 可选：填充三角面片颜色
    for (const auto& face : body.faces) {
        FillTriangle(face.p1, face.p2, face.p3);
    }
}
```

---

### **VI. 总结：设计抉择与性能调优**

#### **1. 关键参数优化表**
| **参数**           | **性能影响**            | **视觉影响**         | **推荐优化方向**         |
|--------------------|-------------------------|----------------------|--------------------------|
| **弹簧迭代次数**   | 迭代越多，CPU开销越大   | 形变更稳定，抖动减少 | 自适应迭代（动态调整）   |
| **网格分辨率**     | 粒子越多计算负载越高     | 细节更精细           | LOD系统（远近不同精度）  |
| **Verlet子步**     | 增加子步提高更新频率     | 运动更顺滑           | 基于场景重要性分级控制   |

#### **2. 生产环境中的常见方案**
- **游戏开发**：Position-Based Dynamics (PBD) + 低迭代次数，优先保障帧率
- **影视级模拟**：有限元法 (FEM) + 隐式积分，追求物理精确性
- **移动端优化**：将Verlet计算移至GPU计算着色器，批量处理粒子

```cpp
// 示例：计算着色器中的Verlet积分（GLSL）
#version 450
layout(local_size_x = 256) in;
layout(std430, binding=0) buffer Particles {
    vec2 positions[];
    vec2 prev_positions[];
    vec2 accelerations[];
    bool movable[];
};

void main() {
    uint idx = gl_GlobalInvocationID.x;
    if (!movable[idx]) return;

    vec2 temp = positions[idx];
    vec2 velocity = positions[idx] - prev_positions[idx];
    positions[idx] += velocity + accelerations[idx] * dt * dt;
    prev_positions[idx] = temp;
}
```
