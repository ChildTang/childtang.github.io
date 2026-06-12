---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
excerpt: "Full list of publications by Ye Li — embodied intelligence (VLA) and efficient deep learning."
---

<link rel="stylesheet" href="/assets/css/publications.css?v={{ site.time | date: '%s' }}">

<a class="scholar-link" href="https://scholar.google.com/citations?user=Nof6bfUAAAAJ&amp;hl=en" target="_blank" rel="noopener noreferrer">
  📚 View full profile on Google Scholar
</a>

<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:1.2em;">
  <span class="stat-badge-cite">📊 {{ site.data.citations._total | default: 152 }}+ Citations</span>
  <span class="stat-badge-h">🎯 h-index {{ site.data.citations._hindex | default: 7 }}</span>
</div>

> Publications are listed by year (most recent first). **\*** denotes first/co-first authorship; **†** denotes advisor-first authorship (student lead author).

{% include base_path %}

{% assign pubs_by_year = site.publications | group_by_exp: "p", "p.date | date: '%Y'" | sort: "name" | reverse %}
<div style="padding:0; margin:0;">
{% for year in pubs_by_year %}
  <h3 class="pub-year-head">{{ year.name }}</h3>
  {% assign year_items = year.items | sort: "date" | reverse %}
  {% for post in year_items %}{% include archive-single-cv.html %}{% endfor %}
{% endfor %}
</div>
