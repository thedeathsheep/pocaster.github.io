---
layout: post
title: 2D物理(19) The Projection Method
cover-img: /assets/img/0028963732_0.jpg
thumbnail-img: /assets/img/0028963732_0.jpg
share-img: /assets/img/0028963732_0.jpg
tags: [Game Dev, AI]
author: pocaster
mathjax: true
---

## **投影方法深度解析**

---

### **I. 核心数学建模**

#### **1.1 投影方向理论**
当检测到穿透时，需要沿碰撞法线( **n** )方向分解位移：
$$$
\Delta x = \lambda \cdot \mathbf{\hat{n}} 
$$
其中 \( \lambda \) 与穿透深度δ相关，满足：
$$
\Delta x_a + \Delta x_b = \delta \cdot \mathbf{\hat{n}}
$$

#### **1.2 质量比例分配原理**
刚体质量影响位移分配权重：
$$
k = \frac{m_b}{m_a + m_b} \quad \Rightarrow \quad 
\begin{cases} 
\Delta x_a = -k \cdot \delta \cdot \mathbf{\hat{n}} \\
\Delta x_b = (1 -k) \cdot \delta \cdot \mathbf{\hat{n}}
\end{cases}
$$
确保动量守恒与视觉效果合理

---

### **II. 基础实现框架**

#### **2.1 位置投影公式**
```cpp
void PositionProjection(Rigidbody& a, Rigidbody& b, 
                        const Vec2& normal, float penetration) {
    const float slop = 0.01f;  // 允许的最小穿透修正
    const float percent = 0.8f; // 矫正比例
  
    float total_mass = a.inv_mass + b.inv_mass;
    if (total_mass <= 0) return;
  
    // 计算质量加权后的修正向量
    Vec2 correction = normal * (std::max(penetration - slop, 0.0f) / total_mass) * percent;
  
    a.position -= a.inv_mass * correction;
    b.position += b.inv_mass * correction;
}
```

#### **2.2 速度投影公式**
```cpp
void VelocityProjection(Rigidbody& a, Rigidbody& b,
                        const Vec2& normal, float penetration) {
    // 基于恢复系数的速度响应
    const float e = std::min(a.restitution, b.restitution);
  
    Vec2 relative_vel = b.velocity - a.velocity;
    float vel_along_normal = relative_vel.Dot(normal);
  
    // 仅在接近时处理
    if (vel_along_normal > 0) return;
  
    float impulse_mag = -(1 + e) * vel_along_normal;
    impulse_mag /= (a.inv_mass + b.inv_mass);
  
    Vec2 impulse = impulse_mag * normal;
  
    a.velocity -= a.inv_mass * impulse;
    b.velocity += b.inv_mass * impulse;
}
```

---

### **III. 刚体旋转处理**

#### **3.1 接触点速度计算**
考虑旋转带来的切线速度：
$$
v_i^{total} = v_i^{linear} + \omega_i \times r_i
$$
代码实现：
```cpp
Vec2 GetVelocityAt(const Rigidbody& body, const Vec2& contact_point) {
    return body.velocity + body.angular_velocity * 
          (contact_point - body.position).Perpendicular();
}
```

#### **3.2 含扭矩的投影方程**
```cpp
void ApplyImpulseWithRotation(Rigidbody& body, const Vec2& impulse, 
                             const Vec2& contact_point) {
    body.velocity += impulse * body.inv_mass;
    body.angular_velocity += 
        (contact_point - body.position).Cross(impulse) * body.inv_inertia;
}
```

---

### **IV. 动态摩擦模型**

#### **4.1 切向速度计算**
```cpp
Vec2 tangent_vel = relative_vel - normal * relative_vel.Dot(normal);
float max_friction = friction_coeff * impulse_mag;
  
// 剪切冲量计算
Vec2 friction_impulse = tangent_vel.Truncate(max_friction);
```

#### **4.2 切向冲量应用**
```cpp
a.velocity -= a.inv_mass * friction_impulse;
b.velocity += b.inv_mass * friction_impulse;
```

---

### **V. 迭代求解策略**

#### **5.1 多步迭代优化**
```cpp
for (int i = 0; i < solver_iterations; ++i) {
    for (auto& contact : contacts) {
        SolveVelocityConstraint(contact);
        SolvePositionConstraint(contact);
    }
}
```
典型配置：<br>
- **桌面应用**：8-10次迭代<br>
- **移动端游戏**：4-6次<br>
- **高精度仿真**：20+次

---

### **VI. 矩阵形式表达**

#### **6.1 接触约束雅可比矩阵**
$$
J = \begin{bmatrix}
-\mathbf{\hat{n}} & -(r_a \times \mathbf{\hat{n}}) & 
\mathbf{\hat{n}} & r_b \times \mathbf{\hat{n}}
\end{bmatrix}
$$
其中 \( r \) 为接触点距质心的向量

$$
M_{\text{eff}} = \frac{1}{\frac{1}{m_a} + \frac{1}{m_b} + 
\frac{(r_a \times \mathbf{\hat{n}})^2}{I_a} + 
\frac{(r_b \times \mathbf{\hat{n}})^2}{I_b}}
$$

---

### **VII. 实践技巧**

#### **7.1 数值稳定化处理**
- **速度阈值滤波**：
```cpp
if (abs(vel_along_normal) < 0.1f) {
    impulse *= 0.5f;  // 消除微小震荡
}
```
- **深度缓冲突变**：
```cpp
penetration = smooth_step(old_depth, new_depth, 0.2f);
```

#### **7.2 混合刚体处理**

| **刚体类型** | 碰撞响应策略             |
|--------------|-------------------------|
| 静态物体     | 仅移动动态物体           |
| 运动学物体   | 部分冲量传递            |
| 角色控制器   | 自定义响应曲线          |

---

### **VIII. 性能优化**

#### **8.1 Warm Starting**
预热约束求解器：
```cpp
// 使用上一帧冲量初始化
impulse *= persistence_factor; 
```

#### **8.2 Batch 批次处理**
SIMD优化后的代码架构：
```cpp
__m128 impulse4 = _mm_mul_ps(vel4, inv_mass4);
// 同时处理4个接触点
```

---

### **IX. 进阶问题处理**

#### **9.1 堆叠稳定性**
堆栈倒塌的解决方案：
- **金字塔约束法**：优先处理底层接触<br>
- **多级求解策略**：每层单独迭代

#### **9.2 多物体连环碰撞**
使用传播标识：
```cpp
bool needs_recheck = true;
while (needs_recheck) {
    needs_recheck = SolvePropagatedCollisions();
}
```

---

### **X. 验证指标**

#### **10.1 能量守恒检测**
监测系统动能变化：
$$
\Delta E = \left| \frac{E_{\text{post}}}{E_{\text{pre}}} \right| \in [0.9,1.1]
$$

#### **10.2 穿透持续检测**
设置碰撞维持计数器：
```cpp
if (contact.persist_frames > 3) {
    ForceSeparation(); // 强制分离机制
}
```


> **设计准则**
> 始终遵循能量流向原则：计算得到的冲量需要确保系统动能不会异常增加。建议基于误差项的平方量级调整迭代次数，实现自适应性调节。最终的解决方案应达到：
> - **位置正确性**：帧末无视觉穿透
> - **速度连续性**：碰撞瞬间速度突变符合预期
> - **能量稳定性**：长时间仿真无能量异常积累
