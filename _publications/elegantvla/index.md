---
title: "ElegantVLA: Learning When to Think for Efficient Vision-Language-Action Models"
collection: publications
permalink: /publications/elegantvla/
date: 2026-05-28
selected: true
first_author: true
venue_short: Preprint
venue_label: "Preprint"
badge: arxiv
thumbnail: "/publications/elegantvla/framework.png"
authors: "<strong>Y. Li*</strong>, H. Liu, K. Ji, Y. Meng, J. Fan, Y. Wang, S. Qin, C. Wu, S.-T. Xia, Z. Wang"
description: "ElegantVLA accelerates the full VLA pipeline end to end: by analyzing redundancy in both high-level semantics and action generation, it adaptively schedules computation across every module — the vision encoder, LLM, and action head — for extreme speedups."
highlight: "⚡ up to 2.55× (GR00T) · 3.77× (CogACT) · real-world (Franka) 13.8→26.3 Hz"
abstract: "Vision-Language-Action (VLA) models are powerful for generalist robotic control but slow, since large vision-language backbones and iterative action heads run at every control step, and prior acceleration uses fixed rules that ignore the non-uniform reasoning demands of sequential control. Inspired by human motor control — where resources concentrate on goal-sensitive stages — ElegantVLA learns when to think. It is a training-free, plug-in phase-adaptive framework whose lightweight scheduler watches temporal representation similarity, robot-motion cues, and episode progress to jointly allocate compute across the vision encoder, LLM, and action head: a five-level Vision–LLM mode (full recomputation to multi-step temporal reuse) and a three-level denoising mode (reuse during stable motion, full refinement at goal-sensitive stages). On GR00T it reaches up to 2.55× speedup, on CogACT 3.77×, and in real-world GR00T tasks it cuts computation 2.18× while raising control frequency from 13.8 to 26.3 Hz — preserving or improving task success."
venue: 'arXiv preprint, 2026'
paperurl: 'https://arxiv.org/abs/2605.29438'
projectpage: 'https://anonymous.4open.science/w/elegantvla/'
citation: 'Ye Li, Huanan Liu, Kangye Ji, Yuan Meng, Jiajun Fan, Yuansong Wang, Shiyu Qin, Chenglei Wu, Shu-Tao Xia, Zhi Wang. &quot;ElegantVLA: Learning When to Think for Efficient Vision-Language-Action Models.&quot; arXiv:2605.29438, 2026.'
bibtex: |
  @article{li2026elegantvla,
    title={ElegantVLA: Learning When to Think for Efficient Vision-Language-Action Models},
    author={Li, Ye and Liu, Huanan and Ji, Kangye and Meng, Yuan and Fan, Jiajun and Wang, Yuansong and Qin, Shiyu and Wu, Chenglei and Xia, Shu-Tao and Wang, Zhi},
    journal={arXiv preprint arXiv:2605.29438},
    year={2026}
  }
---

Vision-Language-Action (VLA) models are a powerful paradigm for generalist robotic control, but their high computational cost and limited control frequency hinder real-time manipulation — large vision-language backbones and iterative action heads are executed at **every** control step. Existing acceleration optimizes individual components or relies on fixed rules, treating every step with largely fixed computation and overlooking the **non-uniform reasoning demands** of sequential embodied control.

Inspired by human motor control — where cognitive and feedback resources concentrate on goal-sensitive stages — **ElegantVLA** learns **when to invest full computation and when to reuse prior computation**. It is a training-free, plug-in, phase-adaptive inference framework that performs intra-model dynamic compute scheduling:

- **Lightweight scheduler.** Observes temporal representation similarity, robot-motion cues, and episode progress to jointly allocate computation across the vision encoder, LLM, and action head.
- **Five-level Vision–LLM mode.** From full recomputation to multi-step temporal reuse, chosen by visual-language representation stability.
- **Three-level denoising mode.** Reuses intermediate denoising states during stable motion while preserving full refinement at goal-sensitive stages.

Because it neither modifies nor retrains the base model, ElegantVLA is a general accelerator for modern VLA pipelines with explicit action-generation modules. On **GR00T** it achieves up to **2.55× average speedup**, on **CogACT** **3.77×**, and in real-world GR00T experiments across six tasks it reduces computation by **2.18×** and raises control frequency from **13.8 Hz to 26.3 Hz**, preserving or improving task success.
