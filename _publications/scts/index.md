---
title: "A DDPG-based Solution for Optimal Consensus of Continuous-time Linear Multi-agent Systems"
collection: publications
permalink: /publications/scts/
date: 2023-08-01
selected: true
first_author: true
venue_short: SCTS
venue_label: "SCTS 2023"
badge: journal
tags: [Control]
thumbnail: "/publications/scts/framework.png"
authors: "<strong>Y. Li*</strong>, Z. Liu, G. Lan, M. Sader, Z. Chen"
description: "A data-driven, model-free optimal controller based on DDPG for continuous-time leader-following multi-agent consensus — it learns optimal control online from observations alone, removing the need for an accurate system model or any initial admissible policy."
highlight: "🤖 DDPG-based optimal consensus for multi-agent systems"
abstract: "Modeling engineering systems is costly because parameters drift with temperature, component aging, etc. This work proposes a data-driven, model-free optimal controller based on Deep Deterministic Policy Gradient (DDPG) for continuous-time leader-following multi-agent consensus. Two neural networks fit the state and action spaces to avoid the dimensional explosion of time-consuming state iteration; the controller reaches consensus from only the consensus error, requires no initial admissible policy, and self-learns in real time as system parameters change, with minimal energy consumption. Convergence and stability are proven and verified in simulation."
venue: 'Science China Technological Sciences (<strong>SCTS</strong>), 2023'
paperurl: 'https://link.springer.com/article/10.1007/s11431-022-2216-9'
citation: 'Ye Li, Zhongxin Liu, Ge Lan, Malika Sader, Zengqiang Chen. &quot;A DDPG-based Solution for Optimal Consensus of Continuous-time Linear Multi-agent Systems.&quot; Science China Technological Sciences, 2023.'
bibtex: |
  @article{li2023ddpg,
    title={A DDPG-based solution for optimal consensus of continuous-time linear multi-agent systems},
    author={Li, Ye and Liu, ZhongXin and Lan, Ge and Sader, Malika and Chen, ZengQiang},
    journal={Science China Technological Sciences},
    volume={66},
    number={8},
    pages={2441--2453},
    year={2023},
    publisher={Springer}
  }
---

Modeling engineering systems is time-consuming and labor-intensive, since system parameters drift with temperature, component aging, and other factors. We propose a **data-driven, model-free optimal controller** based on **Deep Deterministic Policy Gradient (DDPG)** for **continuous-time leader-following multi-agent consensus**:

- **No system model required.** The controller reaches consensus using only the consensus error, without any initial admissible policy.
- **Neural function approximation.** Two neural networks fit the state and action spaces, avoiding the dimensional explosion of the time-consuming state-iteration process.
- **Self-learning & energy-efficient.** It adapts in real time as system parameters change, achieving consensus with minimal energy consumption.

Convergence and stability are proven theoretically and verified through simulation experiments.

