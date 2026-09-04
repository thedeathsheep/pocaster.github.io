---
layout: editorial
title: Writing
permalink: /writing/
subtitle: Notes on products, generative AI, creative tools, games, and narrative systems.
---
<div class="ie-writing-index"><header class="ie-page-heading"><h1>Writing</h1><p>{{ page.subtitle }}</p></header><div class="ie-index">{% assign posts = site.posts | sort: 'date' | reverse %}{% for post in posts %}<a class="ie-writing-row" href="{{ post.url | relative_url }}"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%Y.%m.%d' }}</time><span class="ie-writing-row__title">{{ post.title }}</span><span class="ie-writing-row__tags">{{ post.tags | join: ' · ' }}</span></a>{% endfor %}</div></div>
