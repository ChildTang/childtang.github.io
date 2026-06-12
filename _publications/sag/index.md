---
title: "Sparse ActionGen: Accelerating Diffusion Policy with Real-time Pruning"
collection: publications
permalink: /publications/sag/
date: 2026-07-06
selected: true
first_author: false
venue_short: ICML
venue_label: "ICML 2026"
badge: icml
thumbnail: "/publications/sag/framework.png"
authors: "K. Ji, J. Zhou, Y. Meng, <strong>Y. Li</strong>, H. Cui, Z. Wang"
description: "SAG accelerates Diffusion Policy to real time via a rollout-adaptive prune-then-reuse scheme — an observation-conditioned pruner identifies prunable computations on the fly, and a one-for-all strategy reuses activations across timesteps and blocks."
highlight: "⚡ up to 4× generation speedup · no performance loss"
abstract: "Diffusion Policy models multi-modal action distributions well but its multi-step denoising is too slow for real-time visuomotor control, and existing caching accelerators use static schedules that don't adapt to robot-environment dynamics. SAG (Sparse ActionGen) enables extremely sparse action generation via a rollout-adaptive prune-then-reuse mechanism: it first identifies prunable computations globally, then reuses cached activations to substitute them. An observation-conditioned diffusion pruner — designed to be highly parameter- and inference-efficient — captures rollout dynamics for environment-aware adaptation, and a one-for-all reuse strategy reuses activations across both timesteps and blocks in a zig-zag manner to minimize global redundancy. Across multiple robotic benchmarks, SAG achieves up to 4× generation speedup without sacrificing performance."
venue: 'International Conference on Machine Learning 2026 (<strong>ICML 2026</strong>)'
paperurl: 'https://arxiv.org/abs/2601.12894'
code: 'https://github.com/ky-ji/SAG'
projectpage: 'https://sparse-actiongen.github.io'
citation: 'Kangye Ji, Jianbo Zhou, Yuan Meng, Ye Li, Hanyun Cui, Zhi Wang. &quot;Sparse ActionGen: Accelerating Diffusion Policy with Real-time Pruning.&quot; ICML 2026.'
bibtex: |
  @inproceedings{ji2026sparse,
    title={Sparse ActionGen: Accelerating Diffusion Policy with Real-time Pruning},
    author={Ji, Kangye and Zhou, Jianbo and Meng, Yuan and Li, Ye and Cui, Hanyun and Wang, Zhi},
    booktitle={Proceedings of the International Conference on Machine Learning},
    year={2026}
  }
---

Diffusion Policy dominates action generation thanks to its strong modeling of multi-modal action distributions, but its multi-step denoising makes it impractical for real-time visuomotor control. Existing caching-based accelerators rely on **static** schedules that fail to adapt to the **dynamics** of robot-environment interactions, leading to suboptimal performance.

**SAG (Sparse ActionGen)** enables extremely sparse action generation:

- **Rollout-adaptive prune-then-reuse.** It first identifies prunable computations globally, then reuses cached activations to substitute them during action diffusion.
- **Observation-conditioned diffusion pruner.** A highly parameter- and inference-efficient pruner adapts to each rollout's observations for environment-aware, real-time prediction.
- **One-for-all reuse.** Activations are reused across both timesteps and blocks in a zig-zag manner, minimizing global redundancy.

Across multiple robotic benchmarks, SAG achieves **up to 4× generation speedup without sacrificing performance**.
