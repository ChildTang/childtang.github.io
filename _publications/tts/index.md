---
title: "Test-time Sparsity for Extreme Fast Action Diffusion"
collection: publications
permalink: /publications/tts/
date: 2026-06-01
selected: true
first_author: false
venue_short: CVPR
venue_label: "CVPR 2026"
badge: cvpr
thumbnail: "/publications/tts/overview.png"
authors: "K. Ji, Y. Meng, J. Zhou, <strong>Y. Li</strong>, C. Tang, Z. Wang"
description: "TTS accelerates action diffusion to real time via test-time sparsity — dynamically predicting prunable computations at each forward, with a parallelized pipeline and an omnidirectional feature-reuse strategy reaching 95% sparsity."
highlight: "⚡ 92% fewer FLOPs · 5× faster · 47.5 Hz real-time · lossless"
abstract: "Action diffusion produces high-fidelity actions but is costly due to iterative denoising, and feature-caching accelerators struggle to adapt to the policy dynamics of open-environment rollouts. TTS proposes test-time sparsity: it dynamically predicts prunable residual computations for each model forward at test time. To keep the savings real, a highly parallelized pipeline shares a lightweight pruner with the diffusion transformer and overlaps pruning with decoding (cutting non-decoder delay to milliseconds); an omnidirectional reuse strategy then reaches 95% sparsity by reusing features cached within the current forward, across denoising timesteps, and across rollout iterations. TTS reduces FLOPs by 92% and accelerates action generation by 5×, achieving lossless performance at 47.5 Hz."
venue: 'IEEE/CVF Conference on Computer Vision and Pattern Recognition 2026 (<strong>CVPR 2026</strong>)'
paperurl: 'https://arxiv.org/abs/2605.13316'
code: 'https://github.com/ky-ji/Test-time-Sparsity'
citation: 'Kangye Ji, Yuan Meng, Jianbo Zhou, Ye Li, Chen Tang, Zhi Wang. &quot;Test-time Sparsity for Extreme Fast Action Diffusion.&quot; CVPR 2026.'
bibtex: |
  @inproceedings{ji2026test,
    title={Test-time Sparsity for Extreme Fast Action Diffusion},
    author={Ji, Kangye and Meng, Yuan and Zhou, Jianbo and Li, Ye and Tang, Chen and Wang, Zhi},
    booktitle={Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition},
    pages={9414--9423},
    year={2026}
  }
---

Action diffusion excels at high-fidelity action generation but incurs heavy computational cost due to iterative denoising. Existing accelerators that reuse cached features struggle to adapt to the policy dynamics arising from diverse perceptions and multi-round rollouts in open environments.

**TTS** introduces **test-time sparsity**: it accelerates action diffusion by **dynamically predicting prunable residual computations for each model forward at test time**. Two bottlenecks are addressed:

- **Parallelized inference pipeline.** A lightweight pruner shares the encoder with the diffusion transformer; encoding and pruning are decoupled from the autoregressive denoising loop (all timesteps processed in parallel), and the pruner is overlapped with decoder inference via asynchronism — minimizing non-decoder delay to milliseconds.
- **Omnidirectional reuse.** Achieves **95% sparsity** by selectively reusing features cached from the current forward, previous denoising timesteps, and earlier rollout iterations, supervised with only a few sampled trajectories.

TTS reduces **FLOPs by 92%** and accelerates action generation by **5×**, achieving **lossless** performance at **47.5 Hz**.
