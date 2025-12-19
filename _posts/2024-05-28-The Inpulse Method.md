---
layout: post
title: 2D物理(20) The Impluse Method
cover-img: /assets/img/0028963732_0.jpg
thumbnail-img: /assets/img/0028963732_0.jpg
share-img: /assets/img/0028963732_0.jpg
tags: [Game Dev, AI]
author: pocaster
mathjax: true
---

## **Impulse Method 核心推导与冲量计算**

---

### **I. 相对速度计算基础**

#### **1.1 接触点速度解析**
$$
\mathbf{v}_A = \mathbf{v}_{cm}^A + \mathbf{\omega}_A \times (\mathbf{p} - \mathbf{x}_A)
$$
$$
\mathbf{v}_B = \mathbf{v}_{cm}^B + \mathbf{\omega}_B \times (\mathbf{p} - \mathbf{x}_B)
$$

- **物理含义**：接触点实际速度 = 质心速度 + 旋转分量
- **图示参考**：
  ![Contact point velocity](https://www.nitinpandey.com/images/Tutorials/VelocityAtPointOnBody.png)

---

### **II. 恢复系数理论**

#### **2.1 牛顿恢复定律**
定义碰撞前后的相对速度关系：

$$
(\mathbf{v}_B' - \mathbf{v}_A') \cdot \mathbf{n} = -e (\mathbf{v}_B - \mathbf{v}_A) \cdot \mathbf{n}
$$
- **e**: 恢复系数（橡胶≈0.8，钢球≈0.95，黏土=0）
- **数学限制**：0 ≤ e ≤ 1 （e=1为完全弹性碰撞）

---

### **III. 冲量方程推导**

#### **3.1 动量守恒方程**
冲量改变物体线速度和角速度：

$$
\Delta \mathbf{v}_A = -\frac{\mathbf{j}}{m_A} \quad 
\Delta \mathbf{\omega}_A = -(-\mathbf{r}_A \times \mathbf{j}) \cdot \mathbf{I}_A^{-1}
$$

#### **3.2 法线方向冲量公式**
$$
j_n = \frac{-(1+e) (\mathbf{v}_B - \mathbf{v}_A) \cdot \mathbf{n} }{ \frac{1}{m_A} + \frac{1}{m_B} + \mathbf{n} \cdot [ ( \mathbf{r}_A \times \mathbf{n}/I_A ) \times \mathbf{r}_A ] + ... }
$$
**分量拆解**：
- 分母项第一部分：质量反项和
- 分母项第二部分：转动惯量相关项

#### **3.3 完整推导步骤**
$$
// 相对速度投影到法线方向
float v_rel = Dot( (vB + Cross(omegaB, rB)) - (vA + Cross(omegaA, rA)) ), n );

// 法线方向有效质量计算
float invEffectiveMass = 1/mA + 1/mB 
    + Dot( Cross(rA, n)/IA, Cross(rA, n) ) 
    + Dot( Cross(rB, n)/IB, Cross(rB, n) );

// 恢复系数项
float v_bounce = -(1 + e) * v_rel;

// 求出法线冲量
float jn = v_bounce / invEffectiveMass;

$$

---

### **IV. 摩擦冲量处理**

#### **4.1 库伦摩擦模型**
$$
|\mathbf{j}_t| \leq \mu \cdot \mathbf{j}_n
$$
- **静摩擦阶段**（相对切向速度 < ε）：
  $$
  \mathbf{j}_t = -\frac{ (\mathbf{v}_{rel}^t \cdot \mathbf{t}) }{\mathbf{t}^T M^{-1} \mathbf{t}} \mathbf{t}
  $$

- **动摩擦阶段**：
  $$
  \mathbf{j}_t = \mu_d \cdot \mathbf{j}_n \cdot \text{sign}(\mathbf{v}_{rel}^t) \cdot \mathbf{t}
  $$

#### **4.2 代码实现**
```cpp
// 计算切向方向
Vec2 tangent = (v_rel - normal * Dot(v_rel, normal)).Normalize(); 

// 摩擦冲量计算
float jt = -Dot(v_rel, tangent) / invEffectiveMass;
jt = Clamp(jt, -j_n * static_friction, j_n * static_friction);

// 合成总冲量
Vec2 impulse = j_n * normal + j_t * tangent;
$$

---

### **V. 旋转效应解析**

#### **5.1 等效接触点力矩**
$$
\mathbf{M}_A = \mathbf{r}_A \times \mathbf{j}
$$

#### **5.2 角速度更新公式**
$$
\Delta \mathbf{\omega}_A = \mathbf{I}_A^{-1} (\mathbf{r}_A \times \mathbf{j}) 
$$

---

### **VI. 数值实现策略**

#### **6.1 基本算法流程**
$$mermaid
graph LR
    CalcNormalImpulse[计算法线冲量 jn] --> FrictionCheck[摩擦力限制检验] 
    FrictionCheck --> ApplyImpulse[应用冲量到物体]
    ApplyImpulse --> UpdateVel[更新速度]
$$

#### **6.2 关键代码实现**
```cpp
struct ContactSolver {
    float SolveNormalImpulse(Rigidbody& a, Rigidbody& b, 
                            Contact& c, Mat2& rotation) 
    {
        Vec2 rA = c.point - a.position;
        Vec2 rB = c.point - b.position;
      
        // 计算接触点速度差
        Vec2 vA = a.linearVelocity + a.angularVelocity * Ortho(rA);
        Vec2 vB = b.linearVelocity + b.angularVelocity * Ortho(rB);
        Vec2 dv = vB - vA;
      
        // 计算法线方向参数
        float vn = dv.Dot(c.normal);
        float e = c.restitution;
        float eff_mass = 1.0f / (a.invMass + b.invMass 
                           + CrossSqr(rA, c.normal) * a.invInertia
                           + CrossSqr(rB, c.normal) * b.invInertia);
                         
        float jn = -(1.0f + e) * vn * eff_mass;
        jn = std::max(jn, 0.0f); // 确保物理合理
      
        return jn;
    }
};
$$

---

### **VII. 常见问题调试**

#### **7.1 震荡解决方案**
- **引入速度阈值**：当相对速度低于阈值时停止计算
  ```cpp
  const float VELOCITY_SLEEP_THRESHOLD = 0.1f;
  if (vn < VELOCITY_SLEEP_THRESHOLD) break;
  $$

#### **7.2 旋转失效检测**
- **转动惯量校验**：检查物体惯性矩是否为合理值
  ```cpp
  assert(rigidbody.inertia > FLT_EPSILON);
  $$

#### **7.3 特殊情形处理**
**静态物体碰撞**（质量无限大物体）：
$$
m_A \rightarrow \infty \Rightarrow \Delta\mathbf{v}_A = 0, \Delta\mathbf{\omega}_A = 0
$$

**处理步骤伪代码**：
$$python
if a.isStatic or b.isStatic:
    eff_mass = 1.0 / (a.invMass + b.invMass) 
    # 将静态物体的invMass设为0
$$

---

### **VIII. 高级应用技巧**

#### **8.1 预热启动优化**
```cpp
// 使用上一帧缓存的冲量提升收敛速度
void ApplyWarmStart(Contact& c) {
    a.ApplyImpulse(-c.impulse * BETA, c.point); 
    b.ApplyImpulse( c.impulse * BETA, c.point);
}
$$

#### **8.2 混合冲量策略**
$$mermaid
graph TD
    Iter1[迭代1-4次: 普通求解] --> Iter2[迭代5-8次: 增强摩擦计算]
    Iter2 --> Iter3[最后迭代次: 限制最大冲量幅度]
$$

---

> **工程最佳实践**：在商业级物理引擎中，通常采用 **分8次迭代的序列冲量算法** 配合 **Baumgarte稳定性补偿项**，并设置 **冲量最大允许变化范围** 以避免数值爆炸。以下是建议配置参数：
> ```cpp
> const int SOLVER_ITERATIONS = 8;
> const float IMPULSE_ACCUM_LIMIT = 100.0f; 
> const float BIAS_FACTOR = 0.2f; // 用于穿透修正
> $$