---
layout: post
title: 2D物理(21) AT Separeting Axis Theorem
cover-img: /assets/img/0028963732_0.jpg
thumbnail-img: /assets/img/0028963732_0.jpg
share-img: /assets/img/0028963732_0.jpg
tags: [Gamedev, Public, AI]
author: pocaster
mathjax: true
---

## **分离轴定理 (Separating Axis Theorem - SAT)**
**硬核碰撞检测的数学基础**

---

### **I. 理论精髓解析**

$$
\boxed{\text{分离轴存在性判断条件}}
\begin{aligned}
&\forall \mathbf{n} \in \text{Axes}(A \cup B),\ \text{无重叠} \Rightarrow \text{无碰撞（必要充分条件）} \\
&\exist \mathbf{n} \in \text{Axes}(A \cup B),\ \text{投影间隔} \Rightarrow \text{分离轴存在}
\end{aligned}
$$
- **几何学本质**：检测最小穿透距离问题
- **适用范围**：所有**凸形组合**（凸 vs 凸，凸 vs 凹）

---

### **II. 三角形碰撞检测推导**

#### **2.1 分离轴生成策略**
**三角形特有轴集**=边法线集合：
$$
\text{Axes}(triangle) = \{ \mathbf{n}_1^{\perp}, \mathbf{n}_2^{\perp}, \mathbf{n}_3^{\perp} \} \cup \text{目标图形边法线}
$$

#### **2.2 流程可视化**
![SAT检测流程](https://www.toptal.com/game/video-game-physics-part-ii-collision-detection-for-solid-objects/sat_axis.png)

---

### **III. 投影区间计算技术**

**投影区间数学描述**：
$$
\text{interval}(Poly,\mathbf{n}) = [\min(\{\mathbf{v}_i \cdot \mathbf{n}\}), \max(\{\mathbf{v}_i \cdot \mathbf{n}\})]
$$

**优化步骤**：
1. 转换轴向量为单位向量
2. 并行计算顶点投影值
3. SIMD加速极大值/极小值检索

**Python伪代码实现**：
```python
def project(poly, axis):
    min_proj = float('inf')
    max_proj = -float('inf')
    for point in poly.points:
        proj = dot(point, axis)
        min_proj = min(min_proj, proj)
        max_proj = max(max_proj, proj)
    return (min_proj, max_proj)
```

---

### **IV. OBB专用分离轴优化**

#### **4.1 OBB轴生成策略**
$$
\text{Axes}(OBB_A, OBB_B) = \{\mathbf{u}_A^1, \mathbf{u}_A^2, \mathbf{u}_B^1, \mathbf{u}_B^2\}
$$
**减少检测轴数量**（仅需4轴而非全轴集）

#### **4.2 特殊分离轴案例**
当两OBB主轴**正交时必存在**至少1条分离轴：
$$
\text{if} \ \mathbf{u}_A^i \cdot \mathbf{u}_B^j = 0 \ (\forall i,j) \Rightarrow \text{快速判断路径触发}
$$

---

### **V. 穿透深度计算**

**发现碰撞时计算MTD（最小平移向量）**：
$$
\text{MTD} = \mathbf{n}_{separation} \times \delta_{min} 
$$
其中：
- δ_min : 所有潜在轴上的最小穿透值
- **n_separation** : 对应最小穿透轴的极性方向

**计算方法**：
```cpp
void FindMTD(std::vector<Axis>& axes) {
    float min_overlap = FLT_MAX;
    Vec2 smallest_axis;
  
    for(auto& axis : axes) {
        // 计算投影重叠距离
        float overlap = CalculateOverlap(axis);
      
        if(overlap < 0) return NO_COLLISION;
        if(overlap < min_overlap) {
            min_overlap = overlap;
            smallest_axis = axis.normal;
        }
    }
  
    return { smallest_axis * min_overlap, min_overlap };
}
```

---

### **VI. 高级代码实现**

#### **6.1 完整碰撞检测函数**
```cpp
bool SATCollision(const Polygon& A, const Polygon& B) {
    // 收集所有候选分离轴
    std::vector<Vec2> axes = GetAxes(A);
    axes.insert(axes.end(), GetAxes(B).begin(), GetAxes(B).end());

    for (const Vec2& axis : axes) {
        Projection pA = ProjectPolygon(A, axis);
        Projection pB = ProjectPolygon(B, axis);
      
        // 投影区间是否不重叠
        if (!pA.Overlaps(pB)) {
            return false;
        }
    }
    return true;
}
```

#### **6.2 优化轴生成**
使用位掩码快速筛选冗余轴：
```cpp
uint8_t flags = 0; 
for (Edge e : edges) {
    if (!IsAxisUnique(e.normal, flags)) continue;
    axes.push_back(e.normal);
    UpdateFlags(flags, e.normal);
}
```

---

### **VII. 性能优化指南**

| **策略**              | **平均性能增益（倍）** | **适用场景**               |
|------------------------|----------------------|---------------------------|
| 提前终止检测           | ×1.5 ~ ×3           | 快速剔除系统               |
| 分离轴预计算缓存       | ×5 ~ ×7            | 静态/低频运动物体         |
| SIMD向量化投影计算     | ×2.5 ~ ×4          | 多核处理器环境             |
| 层次包围盒预处理       | ×10+               | 复杂场景物体级联检测       |

---

### **VIII. 实用调试工具**

#### **8.1 可视化投影轴**
```cpp
void DebugDrawSAT(const Contact& c) {
    for(auto& axis : c.test_axes) {
        DrawDebugLine(axis * 10.0f, Color::Yellow);
        DrawProjectionIntervals(axis);
    }
    if(c.collided) {
        DrawMTDVector(c.mtd);
    }
}
```

#### **8.2 实时参数调整面板**
```javascript
// Unity风格编辑器扩展
[CustomEditor(typeof(SATComponent))]
public class SATInspector : Editor {
    public bool visualizeAxes = true;
    public bool showProjection = false;
  
    void OnSceneGUI() {
        if(visualizeAxes) DrawSATDebugInfo();
        if(showProjection) DrawProjectionSpheres();
    }
}
```

---

> **终极提示**：在游戏物理引擎开发中将SAT的分离轴验证转换为**并行计算任务**，采用Job System可提升**40%-70%性能**！关键要分离轴检测的原子性特性与数据局部性。