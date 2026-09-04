---
layout: editorial
title: Projects
permalink: /projects/
subtitle: Product cases, interactive narratives, and independent experiments still in motion.
---
<div class="ie-project-index"><header class="ie-page-heading"><h1>Projects</h1><p>{{ page.subtitle }}</p></header><div class="ie-index">{% for project in site.data.projects %}<a class="ie-index__row" href="{{ project.case_url | relative_url }}"><span class="ie-index__no">0{{ forloop.index }}</span><h2 class="ie-index__name">{{ project.title }}</h2><p class="ie-index__summary">{{ project.summary }}</p><span class="ie-index__meta">{{ project.kind }}<br>{{ project.year | default: '2024—Now' }}</span><span class="ie-index__arrow">↗</span></a>{% endfor %}</div></div>
