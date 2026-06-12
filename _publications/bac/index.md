---
title: "Block-wise Adaptive Caching for Accelerating Diffusion Policy"
collection: publications
permalink: /publications/bac/
date: 2026-04-23
selected: true
first_author: false
venue_short: ICLR
venue_label: "ICLR 2026"
badge: iclr
thumbnail: "/publications/bac/framework.png"
authors: "K. Ji, Y. Meng, H. Cui, <strong>Y. Li</strong>, J. Zhou, S. Hua, L. Chen, Z. Wang"
description: "BAC is a training-free plugin that accelerates Diffusion Policy by caching intermediate action features per transformer block — each block gets its own optimal update schedule, with a Bubbling Union Algorithm to stop cross-block cache-error propagation."
highlight: "⚡ up to 3× inference speedup · training-free plugin · lossless"
abstract: "Diffusion Policy has strong visuomotor modeling ability but its high denoising cost is impractical for real-time robotic control, and existing diffusion accelerators fail to generalize to it due to architectural and data divergences. BAC (Block-wise Adaptive Caching) accelerates Diffusion Policy by caching intermediate action features, achieving lossless acceleration by adaptively updating and reusing cached features at the block level — based on the observation that feature similarities are non-uniform over time and block-specific. An Adaptive Caching Scheduler picks optimal update timesteps by maximizing global feature similarity; since per-block scheduling causes error surges from inter-block error propagation (especially in FFN blocks), a Bubbling Union Algorithm truncates these errors by updating high-error upstream blocks before downstream FFNs. As a training-free plugin compatible with transformer-based Diffusion Policy and VLA models, BAC delivers up to 3× inference speedup for free."
venue: 'International Conference on Learning Representations 2026 (<strong>ICLR 2026</strong>)'
paperurl: 'https://arxiv.org/abs/2506.13456'
code: 'https://github.com/ky-ji/BAC'
projectpage: 'https://block-wise-adaptive-caching.github.io'
citation: 'Kangye Ji, Yuan Meng, Hanyun Cui, Ye Li, Jianbo Zhou, Shengjia Hua, Lei Chen, Zhi Wang. &quot;Block-wise Adaptive Caching for Accelerating Diffusion Policy.&quot; ICLR 2026.'
bibtex: |
  @inproceedings{ji2026blockwise,
    title={Block-wise Adaptive Caching for Accelerating Diffusion Policy},
    author={Ji, Kangye and Meng, Yuan and Cui, Hanyun and Li, Ye and Zhou, Jianbo and Hua, Shengjia and Chen, Lei and Wang, Zhi},
    booktitle={International Conference on Learning Representations},
    year={2026}
  }
---

Diffusion Policy has demonstrated strong visuomotor modeling capabilities, but its high computational cost during denoising renders it impractical for real-time robotic control. Despite huge redundancy across repetitive denoising steps, existing diffusion-acceleration techniques fail to generalize to Diffusion Policy due to fundamental architectural and data divergences.

**BAC (Block-wise Adaptive Caching)** accelerates Diffusion Policy by caching intermediate action features, achieving **lossless** acceleration by adaptively updating and reusing cached features at the **block level** — based on the key observation that feature similarities are **non-uniform over time and block-specific**:

- **Adaptive Caching Scheduler.** Identifies optimal per-block update timesteps by maximizing global feature similarity between cached and skipped features.
- **Bubbling Union Algorithm.** Per-block scheduling alone triggers error surges from inter-block error propagation (especially in FFN blocks); BAC truncates these errors by updating high-error upstream blocks before downstream FFNs.

As a **training-free plugin** compatible with transformer-based Diffusion Policy and vision-language-action models, BAC achieves **up to 3× inference speedup for free**.
