---
layout: default
title: Home
---

# List of Novels

<div class="grid">
  {% assign novels_sorted = site.novels | sort: "order" %}
  {% for n in novels_sorted %}
    <a class="novel-card{% if n.cover %} has-cover{% endif %}" href="{{ n.url | relative_url }}">
      {% if n.cover %}
        <img class="novel-cover"
             src="{{ n.cover | relative_url }}"
             alt="Cover {{ n.title }}"
             loading="lazy">
      {% endif %}

      <div class="novel-card-title">{{ n.title }}</div>
      {% if n.description %}<div class="novel-card-desc">{{ n.description | truncate: 160 }}</div>{% endif %}
      <div class="novel-card-meta muted small">Klik untuk lihat daftar chapter</div>
    </a>
  {% endfor %}

  {% if novels_sorted.size == 0 %}
    <div class="muted">Belum ada novel. Tambahkan file di folder <code>_novels</code>.</div>
  {% endif %}
</div>
