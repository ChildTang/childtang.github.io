---
title: "VVS: Accelerating Speculative Decoding for Visual Autoregressive Generation via Partial Verification Skipping"
collection: publications
permalink: /publications/vvs/
date: 2026-06-01
selected: true
first_author: false
venue_short: CVPR
venue_label: "CVPR 2026"
badge: cvpr
thumbnail: "/publications/vvs/overview.png"
authors: "H. Dong, <strong>Y. Li</strong>, R. Lu, C. Tang, S.-T. Xia, Z. Wang"
description: "VVS is the first to bring step-skipping to speculative decoding: by skipping verification steps for visual autoregressive generation, it directly cuts target-model forward passes via a verification-free token selector, feature caching, and skipped-step scheduling."
highlight: "⚡ 2.8× fewer target-model forward passes · competitive generation quality"
abstract: "Visual autoregressive (AR) generation is strong for image synthesis but slow due to next-token prediction, and speculative decoding's 'draft one step, then verify one step' paradigm prevents a direct reduction in forward passes. Leveraging the interchangeability of visual tokens, VVS explores verification skipping for the first time to explicitly cut target-model forward passes. It integrates three modules: (1) a verification-free token selector with dynamic truncation, (2) token-level feature caching and reuse, and (3) fine-grained skipped-step scheduling. VVS reduces target-model forward passes by 2.8× relative to vanilla AR decoding while maintaining competitive generation quality, offering a superior speed-quality trade-off over conventional speculative decoding."
venue: 'IEEE/CVF Conference on Computer Vision and Pattern Recognition 2026 (<strong>CVPR 2026</strong>)'
paperurl: 'https://arxiv.org/abs/2511.13587'
code: 'https://github.com/HyattDD/VVS'
citation: 'Haotian Dong, Ye Li, Rongwei Lu, Chen Tang, Shu-Tao Xia, Zhi Wang. &quot;VVS: Accelerating Speculative Decoding for Visual Autoregressive Generation via Partial Verification Skipping.&quot; CVPR 2026.'
bibtex: |
  @inproceedings{dong2026vvs,
    title={Vvs: Accelerating speculative decoding for visual autoregressive generation via partial verification skipping},
    author={Dong, Haotian and Li, Ye and Lu, Rongwei and Tang, Chen and Xia, Shu-Tao and Wang, Zhi},
    booktitle={Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition},
    pages={12173--12182},
    year={2026}
  }
---

Visual autoregressive (AR) generation models show strong potential for image generation, but their next-token-prediction paradigm incurs considerable inference latency. Although speculative decoding (SD) accelerates visual AR models, its "draft one step, then verify one step" paradigm prevents a direct reduction in the number of forward passes, limiting its acceleration potential.

Motivated by the interchangeability of visual tokens, **VVS** explores **verification skipping** in the SD process for the first time, explicitly cutting the number of target-model forward passes. Building on the observations that verification redundancy and stale-feature reusability are key to preserving quality during verification-free steps, VVS integrates three complementary modules:

- a **verification-free token selector** with dynamic truncation,
- **token-level feature caching and reuse**, and
- **fine-grained skipped-step scheduling**.

VVS reduces target-model forward passes by **2.8×** relative to vanilla AR decoding while maintaining competitive generation quality, offering a superior speed-quality trade-off over conventional SD frameworks.
