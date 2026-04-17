---
layout: page
title: Projects
permalink: /projects/
subtitle: Tools, experiments, and longer-running work that does not belong in the game shelf.
---

<div class="content-index-page">
  <div class="content-index-intro">
    <p>This page is for non-game work: site tooling, technical experiments, utilities, and any long-lived side project that deserves a stable reference point.</p>
    <p>As the site grows, this section becomes the archive for work that is useful to revisit even when it is not front-page material.</p>
  </div>

  <h2>Current Projects</h2>

  <div class="content-card-grid">
    {% if site.data.projects and site.data.projects.size > 0 %}
    {% for project in site.data.projects %}
      <article class="content-card">
        <div class="content-card-header">
          <div>
            <p class="content-card-label">{{ project.kind | replace: "-", " " }}</p>
            <h3>{{ project.title }}</h3>
          </div>
          <span class="status-chip status-{{ project.status }}">{{ project.status }}</span>
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
            <a href="{{ project.url | relative_url }}">{{ project.cta_label | default: "Open project" }}</a>
          </p>
        {% endif %}
      </article>
    {% endfor %}
    {% else %}
      <article class="content-card">
        <div class="content-card-header">
          <div>
            <p class="content-card-label">archive</p>
            <h3>No project entry yet</h3>
          </div>
          <span class="status-chip status-planning">planning</span>
        </div>
        <p>This section is ready for tools, experiments, and long-lived side projects once they are ready to be listed.</p>
      </article>
    {% endif %}
  </div>

  <h2>What belongs here</h2>

  <ul>
    <li>Site tooling and small utilities.</li>
    <li>Creative or technical experiments that are not games.</li>
    <li>Long-lived personal projects that deserve a stable home page.</li>
  </ul>
</div>
