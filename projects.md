---
layout: page
title: 项目
permalink: /projects/
subtitle: 工具、实验，以及那些不属于“游戏”分类的长期工作。
---

<div class="content-index-page">
  <div class="content-index-intro">
    <p>这里放的是游戏之外的作品：站点本身、技术实验、工具，以及一些想认真留下来的 side project。</p>
    <p>它们不一定都很大，但都足够代表我正在做什么、关心什么。</p>
  </div>

  <h2>项目列表</h2>

  <div class="content-card-grid">
    {% if site.data.projects and site.data.projects.size > 0 %}
    {% for project in site.data.projects %}
      <article class="content-card">
        <h3>{{ project.title }}</h3>

        <p>{{ project.summary }}</p>

        <p class="content-card-link">
          {% if project.case_url and project.case_url != "" %}
            <a href="{{ project.case_url | relative_url }}">查看案例</a>
          {% endif %}
          {% if project.live_url and project.live_url != "" %}
            <a href="{{ project.live_url }}" target="_blank" rel="noopener noreferrer">{{ project.live_label | default: "在线体验" }}</a>
          {% endif %}
        </p>
      </article>
    {% endfor %}
    {% else %}
      <article class="content-card">
        <h3>还没有项目条目</h3>
        <p>这里已经给工具、实验和长期 side project 预留好了位置，等条目准备好就可以直接挂进来。</p>
      </article>
    {% endif %}
  </div>

</div>
