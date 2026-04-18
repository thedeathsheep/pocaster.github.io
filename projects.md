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
        <div class="content-card-header">
          <div>
            <p class="content-card-label">{{ project.kind | replace: "-", " " }}</p>
            <h3>{{ project.title }}</h3>
          </div>
          <span class="status-chip status-{{ project.status }}">
            {% case project.status %}
              {% when 'active' %}进行中
              {% when 'planning' %}筹备中
              {% when 'paused' %}暂停
              {% when 'archived' %}归档
              {% else %}{{ project.status }}
            {% endcase %}
          </span>
        </div>

        <p>{{ project.summary }}</p>

        {% if project.stack %}
          <ul class="content-meta-list">
            {% for item in project.stack %}
              <li>{{ item }}</li>
            {% endfor %}
          </ul>
        {% endif %}

        {% if project.url and project.url != "" %}
          <p class="content-card-link">
            <a href="{{ project.url | relative_url }}">{{ project.cta_label | default: "查看" }}</a>
          </p>
        {% endif %}
      </article>
    {% endfor %}
    {% else %}
      <article class="content-card">
        <div class="content-card-header">
          <div>
            <p class="content-card-label">archive</p>
            <h3>还没有项目条目</h3>
          </div>
          <span class="status-chip status-planning">筹备中</span>
        </div>
        <p>这里已经给工具、实验和长期 side project 预留好了位置，等条目准备好就可以直接挂进来。</p>
      </article>
    {% endif %}
  </div>

  <h2>这一页的内容范围</h2>

  <ul>
    <li>站点本身和一些小工具。</li>
    <li>不属于游戏分类的技术实验或创意项目。</li>
    <li>那些值得拥有自己位置的长期个人作品。</li>
  </ul>
</div>
