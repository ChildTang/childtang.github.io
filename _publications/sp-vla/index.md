---
title: "SP-VLA: A Joint Model Scheduling and Token Pruning Approach for VLA Model Acceleration"
collection: publications
permalink: /publication/2026-01-02-SP-VLA-ICLR2026
date: 2026-01-02
selected: true
first_author: true
venue_short: ICLR
venue_label: "ICLR 2026"
badge: iclr
thumbnail: "/publications/sp-vla/main_idea.png"
authors: "<strong>Y. Li*</strong>, Y. Meng, Z. Sun, K. Ji, C. Tang, J. Fan, X. Ma, S.-T. Xia, Z. Wang, W. Zhu"
description: "SP-VLA is the first method to exploit temporal redundancy in VLA inference: it reads the end-effector's speed to separate intuitive from deliberative steps, delegating cheap steps to a lightweight generator and reserving the full VLA model for critical ones — achieving lossless acceleration."
highlight: "⚡ 2.5x lossless (Franka) 1.5× lossless (LIBERO) · 2.4× (SimplerEnv)"
abstract: "Vision-Language-Action (VLA) models deliver strong control but are too slow for real-time robotics. SP-VLA accelerates them by removing two kinds of redundancy that prior compression overlooks: temporal redundancy across sequential actions and spatial redundancy in visual input. An action-aware scheduler routes intuitive steps to a lightweight generator and deliberative ones to the full VLA model, while a spatio-semantic dual-aware token pruner keeps only the most informative tokens. Together they achieve 1.5× lossless speedup on LIBERO and 2.4× on SimplerEnv, with up to 6% average performance gain."
venue: 'International Conference on Learning Representations 2026 (<strong>ICLR 2026</strong>)'
paperurl: 'https://openreview.net/forum?id=RwdGIIjPlC'
code: 'https://github.com/ChildTang/SP-VLA'
citation: 'Ye Li, Yuan Meng, Zewen Sun, Kangye Ji, Chen Tang, Jiajun Fan, Xinzhu Ma, Shu-Tao Xia, Zhi Wang, Wenwu Zhu. &quot;SP-VLA: A Joint Model Scheduling and Token Pruning Approach for VLA Model Acceleration.&quot; ICLR 2026.'
bibtex: |
  @article{li2025sp,
    title={Sp-vla: A joint model scheduling and token pruning approach for vla model acceleration},
    author={Li, Ye and Meng, Yuan and Sun, Zewen and Ji, Kangye and Tang, Chen and Fan, Jiajun and Ma, Xinzhu and Xia, Shutao and Wang, Zhi and Zhu, Wenwu},
    journal={arXiv preprint arXiv:2506.12723},
    year={2025}
  }
---

Vision-Language-Action (VLA) models have attracted increasing attention for their strong control capabilities, but their high computational cost and low execution frequency hinder real-time tasks such as robotic manipulation and autonomous navigation. Existing VLA acceleration methods focus on structural optimization while overlooking that these models operate in sequential decision-making environments, leaving **temporal redundancy** (in sequential action generation) and **spatial redundancy** (in visual input) unaddressed.

We propose **SP-VLA**, a unified framework that accelerates VLA models by jointly **scheduling models** and **pruning tokens**:

- **Action-aware model scheduling.** Inspired by human motion — focusing on key decision points while relying on intuition elsewhere — we categorize VLA actions into *deliberative* and *intuitive*, assigning the former to the VLA model and the latter to a lightweight generator, enabling frequency-adaptive execution.
- **Spatio-semantic dual-aware token pruning.** Tokens are classified into *spatial* and *semantic* types and pruned by their dual-aware importance (object contours via the Canny operator + accumulated attention), with a speed-adaptive threshold.

Together these guide the VLA to focus on critical actions and salient visual information, achieving effective acceleration while maintaining accuracy. Extensive experiments show **1.5× lossless acceleration on LIBERO and 2.4× on SimplerEnv, with up to 6% average performance gain**; inference frequency and latency improve by **2.2× on SimplerEnv and 1.4× on LIBERO**.

