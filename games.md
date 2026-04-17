---
layout: page
title: Games
permalink: /games/
subtitle: Playable work, prototypes, and the experiments that may turn into something larger.
---

<div class="content-index-page">
  <div class="content-index-intro">
    <p>This page collects web-first game work, playable prototypes, and experiments that are still taking shape.</p>
    <p>Each entry keeps the current status visible so it is easy to tell whether something is live, in progress, or still waiting for its first public build.</p>
  </div>

  <h2>Current Games</h2>

  <div class="content-card-grid">
    {% if site.data.games and site.data.games.size > 0 %}
    {% for game in site.data.games %}
      <article class="content-card">
        <div class="content-card-header">
          <div>
            <p class="content-card-label">{{ game.platform }}</p>
            <h3>{{ game.title }}</h3>
          </div>
          <span class="status-chip status-{{ game.status }}">{{ game.status }}</span>
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
            <a href="{{ game.url | relative_url }}">{{ game.cta_label | default: "Play or view" }}</a>
          </p>
        {% else %}
          <p class="content-card-note">A dedicated page will appear here once the first public build is ready.</p>
        {% endif %}
      </article>
    {% endfor %}
    {% else %}
      <article class="content-card">
        <div class="content-card-header">
          <div>
            <p class="content-card-label">Web</p>
            <h3>No public game page yet</h3>
          </div>
          <span class="status-chip status-planning">planning</span>
        </div>
        <p>This slot is reserved for the first public web game or prototype that gets its own page on the site.</p>
        <p class="content-card-note">A dedicated page will appear here once the first public build is ready.</p>
      </article>
    {% endif %}
  </div>

  <h2>How I organize games</h2>

  <ul>
    <li>Web-first projects live here by default.</li>
    <li>Individual games can later move into their own pages under <code>/games/&lt;slug&gt;/</code>.</li>
    <li>Finished releases and rough prototypes can share the same index as long as their status stays clear.</li>
  </ul>
</div>
