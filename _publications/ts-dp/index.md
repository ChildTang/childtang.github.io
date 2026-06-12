---
title: "TS-DP: Reinforcement Speculative Decoding for Temporal Adaptive Diffusion Policy Acceleration"
collection: publications
permalink: /publications/ts-dp/
date: 2025-12-13
selected: true
first_author: true
venue_short: Preprint
venue_label: "Preprint"
badge: arxiv
thumbnail: "/publications/ts-dp/framework.png"
authors: "<strong>Y. Li*</strong>, J. Feng, Y. Meng, K. Ji, C. Tang, X. Wen, S.-T. Xia, Z. Wang, W. Zhu"
description: "TS-DP is the first to bring lossless speculative decoding to Diffusion Policy, with an RL scheduler that adapts the speculative computation to time-varying task difficulty in embodied control."
highlight: "⚡ up to 4.17× faster · >94% drafts accepted · 25 Hz real-time (Franka) · lossless"
abstract: "Diffusion Policy (DP) excels at embodied control but is slow due to iterative denoising, while embodied tasks demand dynamic, adaptive computation. Static lossy methods (e.g., quantization) cannot handle this, whereas speculative decoding offers a lossless, adaptive—yet underexplored—alternative. TS-DP is the first framework to enable temporally-adaptive speculative decoding for DP: a distilled Transformer drafter imitates the base model to replace costly denoising calls, and an RL-based scheduler adjusts speculative parameters to match time-varying task difficulty. Across diverse embodied environments, TS-DP achieves up to 4.17× faster inference with over 94% accepted drafts, reaching 25 Hz real-time control without performance degradation."
venue: 'arXiv preprint, 2025'
paperurl: 'https://arxiv.org/abs/2512.15773'
citation: 'Ye Li, Jiahe Feng, Yuan Meng, Kangye Ji, Chen Tang, Xinwan Wen, Shu-Tao Xia, Zhi Wang, Wenwu Zhu. &quot;TS-DP: Reinforcement Speculative Decoding for Temporal Adaptive Diffusion Policy Acceleration.&quot; arXiv:2512.15773, 2025.'
bibtex: |
  @article{li2025ts,
    title={TS-DP: Reinforcement Speculative Decoding For Temporal Adaptive Diffusion Policy Acceleration},
    author={Li, Ye and Feng, Jiahe and Meng, Yuan and Ji, Kangye and Tang, Chen and Wen, Xinwan and Xia, Shutao and Wang, Zhi and Zhu, Wenwu},
    journal={arXiv preprint arXiv:2512.15773},
    year={2025}
  }
---

Diffusion Policy (DP) excels at embodied control but suffers from high inference latency, because each action requires many iterative denoising steps. Embodied tasks are also **temporally non-uniform** — difficulty varies over time — so they need a dynamic, adaptable amount of computation. Static, lossy accelerators (e.g., quantization) cannot meet this need, while **speculative decoding** offers a lossless and adaptive alternative that has been largely unexplored for DP.

**TS-DP** (Temporal-aware Reinforcement-based Speculative Diffusion Policy) is the first framework to enable speculative decoding for Diffusion Policy with temporal adaptivity:

- **Distilled Transformer drafter.** A lightweight drafter is distilled to imitate the base policy and replace its costly denoising calls, proposing candidate actions cheaply.
- **RL-based scheduler.** A reinforcement-learning scheduler adapts the speculative parameters to time-varying task difficulty, preserving accuracy while maximizing efficiency.

Across diverse embodied environments, TS-DP achieves **up to 4.17× faster inference** with **over 94% accepted drafts**, reaching **25 Hz** real-time diffusion-based control **without performance degradation**.
