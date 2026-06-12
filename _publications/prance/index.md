---
title: "PRANCE: Joint Token-Optimization and Structural Channel-Pruning for Adaptive ViT Inference"
collection: publications
permalink: /publication/2025-01-02-PRANCE-TPAMI
date: 2025-01-02
selected: true
first_author: true
venue_short: TPAMI
venue_label: "TPAMI 2026"
badge: journal
thumbnail: "/publications/prance/framework.png"
authors: "<strong>Y. Li*</strong>, C. Tang*, Y. Meng, J. Fan, Z. Chai, X. Ma, Z. Wang, W. Zhu"
description: "PRANCE performs per-input joint optimization of computational redundancy from both the data and the model perspectives — co-reducing tokens and pruning channels — to push ViT acceleration to the extreme."
highlight: "⚡ ~50% FLOPs reduction · keeps ~10% of tokens · lossless Top-1 accuracy"
abstract: "Vision Transformers are costly due to model size and quadratic token complexity, yet existing compression is static and single-domain — fixing a sparsity ratio or treating architecture and token selection separately — causing sharp accuracy drops under aggressive rates. PRANCE jointly optimizes activated channels and token count per input: a weight-sharing meta-network supports arbitrary channel widths for attention/MLP layers, and a lightweight PPO selector navigates the huge (~10^14) decision space, trained via a 'Result-to-Go' mechanism that casts ViT inference as a Markov decision process. PRANCE cuts FLOPs by ~50% while retaining only ~10% of tokens at lossless Top-1 accuracy, and is compatible with pruning, merging, and sequential pruning-merging."
venue: 'IEEE Transactions on Pattern Analysis and Machine Intelligence (<strong>TPAMI</strong>), 2026'
paperurl: 'https://arxiv.org/abs/2407.05010'
code: 'https://github.com/ChildTang/PRANCE'
citation: 'Ye Li, Chen Tang, Yuan Meng, Jiajun Fan, Zenghao Chai, Xinzhu Ma, Zhi Wang, Wenwu Zhu. &quot;PRANCE: Joint Token-Optimization and Structural Channel-Pruning for Adaptive ViT Inference.&quot; TPAMI 2026.'
bibtex: |
  @article{li2025prance,
    title={Prance: Joint token-optimization and structural channel-pruning for adaptive vit inference},
    author={Li, Ye and Tang, Chen and Meng, Yuan and Fan, Jiajun and Chai, Zenghao and Ma, Xinzhu and Wang, Zhi and Zhu, Wenwu},
    journal={IEEE Transactions on Pattern Analysis and Machine Intelligence},
    year={2025},
    publisher={IEEE}
  }
---

Vision Transformers (ViTs) are held back by their model size and the quadratic cost in the number of tokens. Existing acceleration is either **static** (a fixed sparsity ratio) or **single-domain** (optimizing architecture or token selection in isolation), so it fails to exploit redundancy across both axes and degrades sharply under aggressive compression.

**PRANCE** jointly optimizes the **activated channels** and the **token count** based on each input:

- **Weight-sharing meta-network.** ViTs natively support variable tokens but not variable channels; PRANCE introduces a meta-network that supports arbitrary channel widths for the Multi-Head Self-Attention and MLP layers, serving as the backbone for architectural decisions.
- **PPO selector + "Result-to-Go" training.** Jointly choosing structure and tokens is a combinatorial problem with a ~10^14 decision space. A lightweight selector trained with Proximal Policy Optimization makes the decisions, and a "Result-to-Go" mechanism models ViT inference as a Markov decision process to shrink the action space and mitigate delayed rewards.

PRANCE reduces **FLOPs by ~50%** while keeping only **~10% of tokens** at **lossless Top-1 accuracy**, and is compatible with pruning, merging, and sequential pruning-merging. Code: [github.com/ChildTang/PRANCE](https://github.com/ChildTang/PRANCE).

