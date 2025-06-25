# %% [markdown]
# # 博客文章创建工具
# 
# 这个脚本可以帮助你快速创建新的博客文章。运行下面的代码块即可开始。

# %%
import os
from datetime import datetime
import sys

# %% [markdown]
# ## 创建新文章
# 
# 运行下面的代码块，设置文章标题和日期即可创建新文章。

# %%
def create_new_post(title, date_str="today"):
    # 处理日期
    if date_str.lower() == "today":
        date_str = datetime.now().strftime("%Y-%m-%d")
    
    # 创建文件名
    filename = f"{date_str}-{title}.md"
    filepath = os.path.join("_posts", filename)
    
    # 创建头信息
    header = f"""---
layout: post
title: {title}
cover-img: /assets/img/0028963732_0.jpg
thumbnail-img: /assets/img/0028963732_0.jpg
share-img: /assets/img/0028963732_0.jpg
tags: [Public]
author: pocaster
published: false
math: true
mermaid: true
---

"""
    
    # 写入文件
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(header)
    
    print(f"Created new post: {filepath}")
    return filepath

# %%
# 在这里设置文章标题和日期
title = "AI笔记17"  # 修改这里的标题
date_str = "2024-02-13"  # 使用 "today" 表示当前日期，或者输入具体日期如 "2024-02-10"

# 创建文章
filepath = create_new_post(title, date_str)
print(f"\n文件已创建：{filepath}")

# %% [markdown]
# ## 使用说明
# 
# 1. 在代码块中修改 `title` 和 `date_str` 变量的值
#    - `title`: 文章标题
#    - `date_str`: 
#      - 使用 "today" 表示当前日期
#      - 或者输入具体日期，格式为 YYYY-MM-DD
# 2. 运行代码块即可创建新文章
# 3. 可以重复运行代码块创建多篇文章
# 
# 提示：在 VS Code 中，你可以：
# - 使用 `# %%` 分隔代码块
# - 点击代码块上方的 "Run Cell" 按钮运行
# - 使用快捷键 `Shift + Enter` 运行当前代码块 