---
title: "RoboStream: Weaving Spatio-Temporal Reasoning with Memory in Vision-Language Models for Robotics"
collection: publications
permalink: /publications/robostream/
date: 2026-03-16
selected: false
first_author: false
venue_short: Preprint
venue_label: "Preprint"
badge: arxiv
thumbnail: "/publications/robostream/overview.png"
authors: "Y. Huang, J. Wu, W. Bu, Z. Xiong, G. Jiang, <strong>Y. Li</strong>, K. Ji, S. Xie, Y. Huang, C. Wu, J. Jiang, Z. Wang"
description: "RoboStream is a training-free framework that equips VLM planners with persistent spatio-temporal reasoning and memory — via Spatio-Temporal Fusion Tokens and a Causal Spatio-Temporal Graph — for robust long-horizon robotic manipulation."
highlight: "🧠 spatio-temporal memory · training-free · long-horizon manipulation"
abstract: "Vision-Language Models (VLMs) are increasingly used as high-level planners for robotic manipulation, but they struggle on long-horizon tasks that demand persistent spatial understanding and temporal memory across many steps. RoboStream is a training-free framework that augments VLM planners with explicit spatio-temporal reasoning and memory: Spatio-Temporal Fusion Tokens compress and carry historical visual-spatial context across the rollout, while a Causal Spatio-Temporal Graph models how scene entities and actions evolve over time, enabling consistent, memory-aware planning. Without any additional training, RoboStream improves robustness and success on long-horizon robotic manipulation."
venue: 'arXiv 2026'
paperurl: 'https://arxiv.org/abs/2603.12939'
projectpage: 'https://robostream123.github.io/'
citation: 'Yuzhi Huang, Jie Wu, Weijue Bu, Ziyi Xiong, Gaoyang Jiang, Ye Li, Kangye Ji, Shuzhao Xie, Yue Huang, Chenglei Wu, Jingyan Jiang, Zhi Wang. &quot;RoboStream: Weaving Spatio-Temporal Reasoning with Memory in Vision-Language Models for Robotics.&quot; arXiv:2603.12939, 2026.'
bibtex: |
  @article{huang2026robostream,
    title={RoboStream: Weaving Spatio-Temporal Reasoning with Memory in Vision-Language Models for Robotics},
    author={Huang, Yuzhi and Wu, Jie and Bu, Weijue and Xiong, Ziyi and Jiang, Gaoyang and Li, Ye and Ji, Kangye and Xie, Shuzhao and Huang, Yue and Wu, Chenglei and others},
    journal={arXiv preprint arXiv:2603.12939},
    year={2026}
  }
---

RoboStream is a training-free framework for long-horizon robotic manipulation that adds persistent spatio-temporal reasoning and memory to VLM planners via Spatio-Temporal Fusion Tokens and a Causal Spatio-Temporal Graph.
