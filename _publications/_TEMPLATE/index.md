---
# ── Publication entry template ──
# To add a new paper: copy this folder to _publications/<slug>/ , rename nothing
# (keep file name index.md), set `published: true`, and fill the fields below.
# Put the paper's thumbnail image in the same folder and point `thumbnail` to it.
published: false

title: "Full Paper Title Here"
collection: publications
permalink: /publications/<slug>/      # clean URL for this paper's detail page
date: 2026-01-01                       # used for sorting (newest first)

# ── Homepage Selected Publications (optional) ──
selected: false                        # true => shown on homepage Selected list
venue_short: ICLR                      # filter key: ICLR | NeurIPS | ICML | CVPR | TPAMI | Preprint
venue_label: "ICLR 2026"               # badge text
badge: iclr                            # badge color: iclr | neurips | icml | cvpr | journal | oral | arxiv
authors: "<strong>Y. Li*</strong>, Co Author, ..."   # HTML; bold yourself, * = first/co-first
description: "One-line summary of the work."
highlight: "Key result / metric (optional)"
thumbnail:                             # e.g. teaser.png (in this folder) or /path/to.png ; blank => text card
abstract: "Short abstract preview shown under the ▾ Abstract toggle."

# ── Links ──
paperurl: ""                           # main paper link (OpenReview / journal / arXiv)
arxiv: ""                              # optional separate arXiv link
projectpage: ""                        # optional project/detail page link

# ── /publications/ list page (legacy fields, still used there) ──
venue: ""                              # long venue string for the list page
citation: ""                           # full citation string
bibtex: |
  @inproceedings{key,
    title={...},
    author={...},
    year={2026}
  }
---

Optional body: this becomes the paper's detail page content at the permalink above.
