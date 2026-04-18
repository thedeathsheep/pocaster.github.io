---
layout: page
title: 游戏
permalink: /games/
subtitle: 可玩的内容、原型，以及那些也许会继续长大的实验。
---

<div class="content-index-page">
  <div class="content-index-intro">
    <p>这里放的是我做过、正在做，或者准备继续做下去的游戏内容。</p>
    <p>有些已经可以打开试玩，有些还停留在原型阶段；只要它们值得被看见，我就会把它们留在这里。</p>
  </div>

  <h2>游戏列表</h2>

  <div class="content-card-grid">
    {% if site.data.games and site.data.games.size > 0 %}
    {% for game in site.data.games %}
      <article class="content-card">
        <div class="content-card-header">
          <div>
            <p class="content-card-label">{{ game.platform }}</p>
            <h3>{{ game.title }}</h3>
          </div>
          <span class="status-chip status-{{ game.status }}">
            {% case game.status %}
              {% when 'active' %}进行中
              {% when 'planning' %}筹备中
              {% when 'paused' %}暂停
              {% when 'archived' %}归档
              {% else %}{{ game.status }}
            {% endcase %}
          </span>
        </div>

        <p>{{ game.summary }}</p>

        {% if game.stack %}
          <ul class="content-meta-list">
            {% for item in game.stack %}
              <li>{{ item }}</li>
            {% endfor %}
          </ul>
        {% endif %}

        {% if game.url and game.url != "" %}
          <p class="content-card-link">
            <a href="{{ game.url | relative_url }}">{{ game.cta_label | default: "查看" }}</a>
          </p>
        {% else %}
          <p class="content-card-note">等第一版可公开体验的内容准备好后，这里会出现独立页面。</p>
        {% endif %}
      </article>
    {% endfor %}
    {% else %}
      <article class="content-card">
        <div class="content-card-header">
          <div>
            <p class="content-card-label">Web</p>
            <h3>还没有公开游戏页</h3>
          </div>
          <span class="status-chip status-planning">筹备中</span>
        </div>
        <p>这里预留给第一个正式挂到站上的 Web 游戏或可玩原型。</p>
        <p class="content-card-note">等第一版可公开体验的内容准备好后，这里会出现独立页面。</p>
      </article>
    {% endif %}
  </div>

  <h2>这里会慢慢长出来什么</h2>

  <ul>
    <li>偏 Web 的游戏和互动实验会优先放在这里。</li>
    <li>如果某个作品继续长大，它会拥有自己的单独页面。</li>
    <li>已经能玩的版本和仍在摸索的原型都可以并排出现。</li>
  </ul>
</div>
