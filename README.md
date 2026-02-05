# Jekyll Novel Reader (Minimalis)

Template Jekyll untuk GitHub Pages: gaya minimalis ala website manga/webnovel.

## Fitur
- Home menampilkan daftar novel
- Halaman novel menampilkan daftar semua chapter
  - Default: tampilkan 30 chapter dulu
  - Tombol **More**: menampilkan semua + list bisa di-scroll di dalam kotak (bukan scroll page)
- Halaman chapter:
  - Tombol **Prev/Next** otomatis sesuai urutan `chapter`
  - Kontrol ukuran font dinamis (A− / slider / A+), tersimpan (localStorage)
- Dark mode default (AMOLED) + menu theme (Dark / Light / Ikuti perangkat), preferensi tersimpan
- Mobile & desktop responsive
- Nambah novel/chapter cukup dengan file Markdown

> Catatan: GitHub Pages punya proses build Jekyll bawaan dan juga opsi GitHub Actions (disarankan oleh GitHub untuk automation). Template ini aman untuk build default karena tidak pakai plugin non-standar.

## Struktur Konten
### Tambah Novel
Buat file baru di:
- `_novels/<slug>.md`

Contoh:
```md
---
layout: novel
title: "Judul Novel"
author: "Nama Penulis"
description: "Deskripsi singkat"
order: 1
---
```

`<slug>` ini dipakai sebagai kunci dan harus sama dengan folder chapter-nya.

### Tambah Chapter
Buat file baru di:
- `_chapters/<slug-novel>/<id>.md`

Contoh:
```md
---
layout: chapter
title: "Chapter 3 — Judul"
novel: <slug-novel>
chapter: 3
---

Isi chapter dalam Markdown...
```

## Jalankan Lokal (opsional)
1) Install Ruby + Bundler
2) Di root repo:
```bash
bundle install
bundle exec jekyll serve
```
Buka `http://127.0.0.1:4000`

## Deploy ke GitHub Pages
1) Push repo ke GitHub
2) Buka repo → Settings → Pages
3) Source: `Deploy from a branch`
4) Branch: `main` dan folder: `/ (root)`

Kalau kamu pakai Project Site, set `baseurl` di `_config.yml` menjadi `/<nama-repo>`.

---
Kalau kamu mau, nanti aku bisa tambahkan:
- Search chapter
- Bookmark terakhir dibaca
- Pagination/virtual list untuk ribuan chapter
- Keyboard shortcuts (←/→)
