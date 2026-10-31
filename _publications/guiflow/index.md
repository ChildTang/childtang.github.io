---
title: "GUIFlow: Temporal Redundancy-Aware Incremental Inference for GUI Agents"
collection: publications
permalink: /publications/guiflow/
date: 2026-10-26
selected: true
first_author: true
venue_short: Preprint
venue_label: "Preprint"
badge: arxiv
thumbnail: "/publications/guiflow/framework.png"
authors: "<strong>Y. Li*</strong>, H. Ding, H. Liu, Y. Meng, Y. Shen, Y. Wang, K. Ji, H. Cui, H. Duan, C. Tang, J. Li, S.-T. Xia, Z. Wang"
description: "GUIFlow turns multi-step GUI-agent inference into incremental computation: instead of rebuilding every representation at each step, it selectively updates states carried across the trajectory — reusing computation through visual encoding, prefill, and decoding."
highlight: "⚡ up to 3.39× offline (geo-mean) · 3.49× online (OSWorld)"
abstract: "GUI agents built on vision-language models interact with continuously evolving interfaces, yet conventional inference repeatedly recomputes representations of largely overlapping observations and histories, while changes in context, interface content, and action arguments prevent straightforward cache reuse. GUIFlow enables full-pipeline incremental inference for multi-image GUI interaction: historical KV states are position-aligned and injected into the current context; change signals guide selective updates of current-observation states in the vision encoder and language model; and earlier action responses serve as speculative drafts verified by the target model. This cross-step reuse requires no additional training, no separate draft model, and no changes to model-visible inputs or the action interface. GUIFlow achieves up to 3.39× geometric-mean speedup on offline multi-image benchmarks and up to 3.49× in online, closed-loop interaction on OSWorld, with task performance broadly comparable to the dense baseline."
venue: 'arXiv preprint, 2026'
paperurl: 'https://arxiv.org/abs/2610.34959'
citation: 'Ye Li, Haoran Ding, Huanan Liu, Yuan Meng, Yutian Shen, Yuansong Wang, Kangye Ji, Hanyun Cui, Hongbo Duan, Chen Tang, Jiawei Li, Shu-Tao Xia, Zhi Wang. &quot;GUIFlow: Temporal Redundancy-Aware Incremental Inference for GUI Agents.&quot; arXiv:2610.34959, 2026.'
bibtex: |
  @article{li2026guiflow,
    title={GUIFlow: Temporal Redundancy-Aware Incremental Inference for GUI Agents},
    author={Li, Ye and Ding, Haoran and Liu, Huanan and Meng, Yuan and Shen, Yutian and Wang, Yuansong and Ji, Kangye and Cui, Hanyun and Duan, Hongbo and Tang, Chen and others},
    journal={arXiv preprint arXiv:2610.34959},
    year={2026}
  }
---

GUI agents built on vision-language models interact with **continuously evolving interfaces**, yet conventional inference recomputes the representations of largely overlapping observations and histories at **every** step. This makes multi-step interaction costly, while changes in context, interface content, and action arguments prevent straightforward cache reuse.

**GUIFlow** is a framework for **full-pipeline incremental inference** in multi-image GUI interaction. Its central insight is that advancing a decision need not require rebuilding all supporting representations — each step can instead selectively update computational states maintained across the trajectory:

- **Position-aligned history reuse.** Historical KV states are re-aligned to their new positions and injected into the current context, so past screenshots and turns are not re-encoded.
- **Change-guided selective updates.** Change signals between consecutive screens decide which current-observation states to refresh in the vision encoder and the language model.
- **Self-speculative decoding.** Earlier action responses serve as speculative drafts that the target model verifies, accelerating decoding without a separate draft model.

Together, these mechanisms enable cross-step reuse throughout **visual encoding, prefill, and decoding** — with **no additional training**, **no separate draft model**, and **no changes** to the model-visible inputs or action interface. Across Qwen3-VL, UI-TARS-1.5, and GUI-Owl-1.5, GUIFlow achieves **up to 3.39× geometric-mean speedup** on offline multi-image benchmarks (AITW, Mind2Web) and **up to 3.49×** in online, closed-loop interaction on **OSWorld**, while maintaining task performance broadly comparable to the dense baseline.
