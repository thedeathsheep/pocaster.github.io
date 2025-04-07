---
layout: post
title: 2D物理(14) Torque & Moment of Inertia
cover-img: /assets/img/0028963732_0.jpg
thumbnail-img: /assets/img/0028963732_0.jpg
share-img: /assets/img/0028963732_0.jpg
tags: [Gamedev, Public, AI]
author: pocaster
mathjax: true
---
## **扭矩与转动惯量系统详解**

---

### **I. 扭矩的物理本质**

#### **1.1 旋转运动的"力量"**
扭矩（Torque）是改变物体旋转状态的动力因素，相当于平移运动中的力。数学定义为：
```math
τ = r × F     \\ (叉乘运算)
‖τ‖ = ‖r‖‖F‖sinθ
```

#### **1.2 扭矩的性质**
- **作用点敏感**：同一力在不同作用位置生成不同扭矩
- **方向性**：遵循右手定则确定旋转方向
- **叠加性**：多个扭矩可代数叠加

![Torque Lever Example](https://sciencenotes.org/wp-content/uploads/2022/08/Simple-Machines.png)

---

### **II. 转动惯量的物理意义**

#### **2.1 旋转运动的"质量"**
转动惯量（Moment of Inertia）I 反映了物体抵抗旋转状态变化的程度：
```math
I = Σ m_i r_i² \\ (离散质量分布)
I = ∫ r² dm  \\ (连续质量分布)
```

#### **2.2 关键特性对比**

| **属性**       | 平移运动          | 旋转运动            |
|---------------|-----------------|-------------------|
| 惯性量          | 质量 (mass)      | 转动惯量 (I)        |
| 运动定律        | F = ma          | τ = Iα            |
| 能量形式        | (1/2)mv²        | (1/2)Iω²          |
| 叠加方式        | 标量直接相加       | 需考虑轴心位置        |

---

### **III. 扭矩的工程实现**

#### **3.1 数据结构设计**
```cpp
struct RigidBody {
    // 线性运动
    Vec2 position;    
    Vec2 velocity;
    Vec2 force_accum; 
  
    // 旋转运动
    float rotation;   
    float angular_vel;
    float torque_accum;  // 累计扭矩
  
    // 惯量属性
    float inv_mass;    
    float inv_inertia; 
  
    // 关联的碰撞形状
    const Shape* shape;
};
```

#### **3.2 扭矩计算原理**
```cpp
void ApplyForceAtPoint(const Vec2& force, const Vec2& point) {
    Vec2 r = point - position;        // 计算到质心的矢量
    torque_accum += Cross(r, force);  // 累积扭矩值
  
    force_accum += force;  // 同时记录线力
}
```

#### **3.3 叉乘计算细节**
```cpp
float Cross(const Vec2& a, const Vec2& b) {
    return a.x * b.y - a.y * b.x;
}

/* 
解释：
- 正值 → 逆时针旋转
- 负值 → 顺时针旋转
- 零值 → 力过质心，不产生旋转 
*/
```

---

### **IV. 转动惯量的计算策略**

#### **4.1 常用形状的解析公式**

形状 | 公式 | 代码实现
-----|------|----------
圆盘（质量m，半径r） | I = (1/2)mr² | `return 0.5f * mass * radius * radius;`
实心方块（宽w，高h） | I = (m(w²+h²))/12 | `return (w*w + h*h) * mass / 12.0f;`
细棒（长L）绕端点 | I = (mL²)/3 | `return mass * length * length / 3.0f;`
质点（距离r） | I = mr² | `return mass * r * r;`

#### **4.2 复合形状的计算**
采用**平行轴定理**计算复杂构型的转动惯量：
```math
I_{total} = I_{center} + md²
```
```cpp
// 示例：计算两个质点的转动惯量
float CalculateCompoundInertia() {
    const float m1 = 2.0f, d1 = 3.0f; // 质量2kg，距轴3m
    const float m2 = 1.0f, d2 = 4.0f;
    return m1*d1*d1 + m2*d2*d2;
}
```

---

### **V. 角加速度处理流程**

#### **5.1 完整物理步进**
```cpp
void SimulateStep(float dt) {
    // 清除累计值
    ClearAccumulators();
  
    // 应用所有外力
    ApplyExternalForces();
  
    // 计算角加速度
    const float alpha = torque_accum * inv_inertia;  // α = τ/I
  
    // 积分更新状态
    Integrate(alpha, dt);
}
```

#### **5.2 积分方法选择**
```cpp
void Integrate(float alpha, float dt) {
    // 半隐式欧拉法（稳定，适合实时模拟）
    angular_vel += alpha * dt;         // ω += α*Δt
    rotation += angular_vel * dt;      // θ += ω*Δt
  
    // 数值稳定性处理
    angular_vel *= powf(0.99f, dt);    // 角速度阻尼
}
```

---

### **VI. 动态转动惯量引擎设计**

#### **6.1 自动惯量更新机制**
```cpp
void RigidBody::UpdateInertia() {
    if (shape) {  // 若形状变化则重新计算
        inertia = shape->ComputeInertia(mass);
        inv_inertia = (inertia > 0) ? 1.0f/inertia : 0;
    }
}
```

#### **6.2 惯量张量（3D扩展准备）**
```math
I = 
\begin{bmatrix}
I_{xx} & -I_{xy} & -I_{xz} \\
-I_{yx} & I_{yy} & -I_{yz} \\
-I_{zx} & -I_{zy} & I_{zz}
\end{bmatrix}
```
```cpp
struct InertiaTensor {
    float data[3][3]; 
    // 必要时可降维处理：2D仅需I_zz分量
};
```

---

### **VII. 调试与验证技术**

#### **7.1 单位测试案例**
```cpp
TEST(InertiaTest, SolidCube) {
    Box cube(2.0f, 2.0f); // 边长为2m的方块
    float I = cube.ComputeInertia(12.0f); // 质量12kg
  
    // 理论值 = [m(w²+h²)]/12 = 12*(4+4)/12 = 8
    ASSERT_FLOAT_EQ(I, 8.0f); 
}
```

#### **7.2 收敛性验证**
```cpp
void VerifyAngularMotion() {
    // 给定恒定扭矩，验证角加速度精度
    RigidBody body/* 初始化*/;
    const float τ = 10.0f;
    body.torque_accum = τ;

    float ω_prev = body.angular_vel;
    body.Integrate(0.1f);
    float Δω = body.angular_vel - ω_prev;
  
    // 理想Δω = (τ/I)*Δt
    float expected = τ * body.inv_inertia * 0.1f;
    ASSERT_NEAR(Δω, expected, 1e-5);
}
```

#### **7.3 能量守恒监控**
```cpp
void CheckEnergyConservation() {
    float energy_rot = 0.5f * inertia * angular_vel * angular_vel;
    // 可与平移动能相加，监测总能量变化
}
```

---

### **VIII. 高级优化技巧**

#### **8.1 惯量预计算系统**
对常用形状建立查找表：
```cpp
static std::map<ShapeType, float> inertia_LUT = {
    {CIRCLE, [](float m, float r){ return 0.5f*m*r*r; }},
    {BOX, [](float m, float w, h){ return m*(w*w+h*h)/12.0f; }},
    // ...其他形状预设
};
```

#### **8.2 SIMD优化加速**
```cpp
// 使用SSE指令并行计算多个刚体的角加速度
__m128 inv_inertias = _mm_load_ps(&bodies[0].inv_inertia);
__m128 torques = _mm_load_ps(&bodies[0].torque_accum);

__m128 alphas = _mm_mul_ps(torques, inv_inertias); // α = τ*I⁻¹
```

---

### **IX. 碰撞响应中的扭矩补偿**

当发生碰撞时，冲量应用需考虑旋转分量：
```cpp
void ApplyImpulseWithRotation(const Vec2& impulse, const Vec2& contact_point) {
    // 线速度变化
    velocity += impulse * inv_mass;
  
    // 角速度变化（r为接触点相对于质心的矢量）
    Vec2 r = contact_point - position;
    angular_vel += Cross(r, impulse) * inv_inertia;
}
```

---

### **X. 常见问题解决方案**


| **问题现象**              | **物理根源**                | **修复方案**                 |
|--------------------------|---------------------------|----------------------------|
| 物体发生非物理高速旋转     | Δt过大导致数值发散           | 采用变步长积分/增加阻尼       |
| 物体静止却持续旋转         | 未清除残余扭矩               | 每帧清零torque_accum        |
| 复合形状旋转轴漂移         | 未正确应用平行轴定理          | 重新计算质心参考系的转动惯量  |
| 碰撞后出现异常抖动         | 冲量应用点计算误差            | 严格验证接触点位置的坐标变换  |

---

### **关键设计总结**
- 扭矩计算的核心在于**作用点与方向的精确描述**
- 转动惯量是**物体质量分布的空间特性**的数字编码
- 现代物理引擎通过**预计算惯量+运行时扭矩综合**实现高效模拟
- 保持**dimensionless原则**（所有物理量需统一单位）
