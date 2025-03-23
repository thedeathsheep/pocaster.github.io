---
layout: post
title: 2D物理(11)Rigid Body
cover-img: /assets/img/0028963732_0.jpg
thumbnail-img: /assets/img/0028963732_0.jpg
share-img: /assets/img/0028963732_0.jpg
tags: [Gamedev, Public]
author: pocaster
mathjax: true
---

## **刚体物理（Rigid Body Dynamics）详解**

---

### **I. 刚体的核心概念**
刚体与粒子的本质差异在于：刚体 **不可变形**，运动可分解为 **平动（Translation）** 和 **旋转（Rotation）**，需要同时追踪质心运动、转动惯量和角动量。

#### **1. 刚体特性**
- **质心（Center of Mass）**：物体的平均质量分布位置，是平动计算的基准点。
- **转动惯量（Moment of Inertia）**：描述刚体对旋转运动的惯性，类比质量的旋转等价量。
- **取向（Orientation）**：可用 **欧拉角/四元数/旋转矩阵** 表示物体的空间朝向。

#### **2. 运动分离定理**
刚体运动可分离为：
1. **质心的平动**：用牛顿第二定律 $$ F = ma $$ 描述。
2. **绕质心的旋转**：用欧拉方程 $$ \tau = I \alpha + \omega \times (I \omega) $$ 描述。

---

### **II. 质心的计算与运动**

#### **1. 质心公式**
离散质点系统：
$$
\vec{r}_{\text{COM}} = \frac{1}{M} \sum_{i} m_i \vec{r}_i
$$
连续刚体：
$$
\vec{r}_{\text{COM}} = \frac{1}{M} \int \vec{r} \, dm
$$

#### **2. 质心运动代码实现**
```cpp
struct RigidBody {
    Vec2 position;        // 质心位置
    Vec2 velocity;        // 线速度
    Vec2 acceleration;
    float mass;
  
    float rotation;       // 绕质心的旋转角度（2D）
    float angular_vel;    // 角速度（rad/s）
    float torque;         // 合外力矩
    float inertia;        // 转动惯量
};

void UpdateCOM(RigidBody& body, float dt) {
    // 平动：更新质心位置
    body.velocity += body.acceleration * dt;
    body.position += body.velocity * dt;
    body.acceleration = Vec2(0,0); // 重置加速度
}
```

---

### **III. 转动惯量与旋转动力学**

#### **1. 转动惯量计算（2D简化）**
离散质量块模型：
$$
I = \sum_i m_i r_i^2
$$
$$ r_i $$ 为质点到旋转轴的距离。
常见形状公式：
- **实心圆盘**：$$ I = \frac{1}{2}mr^2 $$
- **细长杆（绕中心）**：$$ I = \frac{1}{12}ml^2 $$
- **点粒子**：$$ I = mr^2 $$

#### **2. 力矩的物理意义**
力矩（Torque）$$ \tau $$ 是力对旋转作用的度量：
$$
\tau = \vec{r} \times \vec{F}
$$
其中 $$ \vec{r} $$ 是从质心到受力点的向量。

#### **3. 角运动更新**
角加速度 $$ \alpha $$ 由力矩和转动惯量计算：
$$
\alpha = \frac{\tau}{I}
$$
代码实现：
```cpp
void UpdateRotation(RigidBody& body, float dt) {
    float angular_accel = body.torque / body.inertia;
    body.angular_vel += angular_accel * dt;
    body.rotation += body.angular_vel * dt;
    body.torque = 0; // 重置力矩
}
```

---

### **IV. 力的作用点与力矩**
刚体受力点的位置直接影响力矩生成，需要将力分离为质心平动和绕质心的力矩。

#### **1. 受力处理步骤**
1. 将施加到某个点 $$ \vec{r} $$ 的力 $$ F $$ 分解为：
   - **质心平动分量**：直接叠加到合外力 $$ F_{\text{total}} $$。
   - **力矩分量**：$$ \tau = \vec{r} \times F $$。

#### **2. 代码实现**
```cpp
void ApplyForceAtPoint(RigidBody& body, Vec2 force, Vec2 apply_point) {
    // 1. 计算矢径（从质心到作用点）
    Vec2 r = apply_point - body.position;
  
    // 2. 叠加合外力
    body.acceleration += force / body.mass;
  
    // 3. 计算力矩（2D叉积简化为标量）
    float torque = r.x * force.y - r.y * force.x;
    body.torque += torque;
}
```

---

### **V. 分离平动与旋转的完整更新**

```cpp
void RigidBody::Update(float dt) {
    // 平动更新（牛顿定律）
    velocity += acceleration * dt;
    position += velocity * dt;
  
    // 旋转更新（欧拉方程）
    angular_vel += (torque / inertia) * dt;
    rotation += angular_vel * dt;
  
    // 重置临时变量
    acceleration = Vec2(0,0);
    torque = 0.0f;
}
```

**注**：更复杂的3D刚体需使用四元数和惯性张量，此处给出2D简化版。

---

### **VI. 碰撞响应与冲量**

#### **1. 碰撞冲量的基本方程**
当刚体A和B碰撞时，冲量 $$ J $$ 满足：
$$
J = \frac{-(1 + \epsilon) v_{\text{rel}} \cdot n}{n \cdot n \left( \frac{1}{m_A} + \frac{1}{m_B} \right) + \left( \frac{(r_A \times n)^2}{I_A} + \frac{(r_B \times n)^2}{I_B} \right) }
$$
其中：
- $$ \epsilon $$：恢复系数（0: 完全非弹性，1: 完全弹性）
- $$ n $$：碰撞法线方向
- $$ r_A, r_B $$：碰撞点相对质心的矢径
- $$ I_A, I_B $$：转动惯量

#### **2. 碰撞响应代码步骤**
```cpp
void ResolveCollision(RigidBody& a, RigidBody& b, 
                      Vec2 collision_point, Vec2 normal, 
                      float restitution) {
    // 1. 计算相对速度
    Vec2 r_a = collision_point - a.position;
    Vec2 r_b = collision_point - b.position;
    Vec2 v_a = a.velocity + Vec2(-a.angular_vel * r_a.y, a.angular_vel * r_a.x);
    Vec2 v_b = b.velocity + Vec2(-b.angular_vel * r_b.y, b.angular_vel * r_b.x);
    Vec2 v_rel = v_a - v_b;
  
    // 2. 相对速度法向分量
    float vel_along_normal = Dot(v_rel, normal);
    if (vel_along_normal > 0) return; // 避免远离碰撞
  
    // 3. 计算冲量分母项
    float inv_mass_sum = a.inv_mass + b.inv_mass;
    float r_a_cross_n = Cross(r_a, normal);
    float r_b_cross_n = Cross(r_b, normal);
    float denom = inv_mass_sum + 
                 (r_a_cross_n * r_a_cross_n) * a.inv_inertia +
                 (r_b_cross_n * r_b_cross_n) * b.inv_inertia;
  
    // 4. 计算冲量大小
    float j = -(1 + restitution) * vel_along_normal / denom;
    Vec2 impulse = j * normal;
  
    // 5. 应用冲量
    a.velocity += impulse * a.inv_mass;
    b.velocity -= impulse * b.inv_mass;
    a.angular_vel += Cross(r_a, impulse) * a.inv_inertia;
    b.angular_vel -= Cross(r_b, impulse) * b.inv_inertia;
}
```

---

### **VII. 刚体物理与形状交互**

#### **1. 常见刚体形状属性**

---

| **形状**           | **质心位置**         | **转动惯量**（绕质心）      |
|--------------------|----------------------|-----------------------------|
| **圆盘**           | 几何中心             | $$ I = \frac{1}{2} m r^2 $$ |
| **矩形**           | 对角线交点           | $$ I = \frac{1}{12} m (w^2 + h^2) $$|
| **多边形**         | 顶点加权平均         | 离散积分公式计算            |


---
#### **2. 多刚体系统的结构代码**
```cpp
class PhysicsWorld {
    vector<RigidBody> bodies;
  
    void Step(float dt) {
        // 1. 清除上一帧的数据
        for (auto& body : bodies) {
            body.ClearForces();
        }
      
        // 2. 采集施加的力/力矩（例如重力、推力）
        for (auto& body : bodies) {
            ApplyGravity(body);
            ApplyUserForces(body);
        }
      
        // 3. 碰撞检测
        BroadPhase(); // 粗略检测可能碰撞对
        NarrowPhase(); // 精确检测并生成碰撞信息
      
        // 4. 求解约束与冲量
        for (auto& contact : contacts) {
            ResolveCollision(contact);
        }
      
        // 5. 积分更新所有刚体
        for (auto& body : bodies) {
            body.Update(dt);
        }
    }
};
```

---

### **VIII. 高级话题：刚体睡眠机制**

#### **1. 能量阈值检测**
当刚体的动能（平动+旋转）低于阈值时，将其标记为睡眠状态，减少计算：
$$
E_{\text{kinetic}} = \frac{1}{2} m v^2 + \frac{1}{2} I \omega^2
$$
代码示例：
```cpp
void CheckSleepState(RigidBody& body) {
    float linear_energy = 0.5f * body.mass * body.velocity.SqrLength();
    float angular_energy = 0.5f * body.inertia * body.angular_vel * body.angular_vel;
  
    if (linear_energy + angular_energy < SLEEP_THRESHOLD) {
        body.Sleep();
    }
}
```

#### **2. 唤醒机制**
当外力或碰撞施加到睡眠刚体时，强制其退出睡眠状态。

---

### **IX. 刚体模拟的常见陷阱与优化**

---

| **问题**                  | **原因**                          | **解决方法**                      |
|---------------------------|-----------------------------------|-----------------------------------|
| **数值发散（抖动）**      | 过大时间步长或高刚度碰撞          | 使用子步（Substepping）           |
| **旋转能量爆炸**          | 欧拉积分误差积累                  | 切换到Verlet或Runge-Kutta积分     |
| **穿透（Tunneling）**     | 快速移动物体跳过碰撞检测          | 启用连续碰撞检测（CCD）           |
| **堆叠不稳定**            | 迭代约束次数不足                  | 增加迭代次数或使用Solver批处理    |

---

## **实战案例：弹跳方块模拟**

```cpp
void SimulateBouncingBox() {
    RigidBody box;
    box.mass = 1.0f;
    box.inertia = CalculateBoxInertia(2.0f, 2.0f); // 宽高各2米
    box.position = Vec2(0, 5.0f); // 初始高度5米

    // 主循环
    while (true) {
        // 重力施加到质心
        box.ApplyForceAtCenter(Vec2(0, -9.8f * box.mass));
      
        // 地面碰撞检测
        if (box.position.y < 0) {
            Vec2 collision_point = Vec2(box.position.x, 0);
            ResolveCollision(box, ground, collision_point, Vec2(0,1), 0.5f);
        }
      
        box.Update(0.016f); // 模拟60 FPS
    }
}
```

---

通过正确处理平动、旋转和碰撞关系，刚体系统可实现从稳定堆叠到动态破坏的多样物理交互。注意数值稳定性与性能的平衡，是实时仿真的关键挑战。