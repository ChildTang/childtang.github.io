# GDI

We extend the the Generalized Policy Iteration (GPI) into a more generalized version called  Generalized Data Distribution Iteration (GDI). We see massive RL algorithms and techniques can be unified into the GDI paradigm. We provide theoretical proof of why GDI is better than GPI and how it works. Empirical experiments prove our state-of-the-art (SOTA) performance on Arcade Learning Environment (ALE), wherein our algorithm has achieved 9620.98% mean human normalized score (HNS), 1146.39% median HNS and 22 human world record breakthroughs (HWRB) using only 200 training frames. Our work aims to lead the RL research to step into the journey of conquering the human world records and seek real superhuman agents on both performance and efficiency.

# Review

The Arcade Learning Environment (ALE) is proposed as an evaluation platform for empirically assessing the generality of agents across dozens of Atari 2600 games. In this paper, we first review the current evaluation metrics in the Atari benchmarks and then reveal that the current evaluation criteria of achieving superhuman performance are inappropriate, which underestimated the human performance relative to what is possible. Furthermore, we summarize the state-of-the-art (SOTA) methods in Atari benchmarks and provide benchmark results over new evaluation metrics based on human world records.

# Critic PI2

In this paper, we present a novel model-based reinforcement learning frameworks called Critic PI2, which combines the benefits from trajectory optimization, deep actor-critic learning, and model-based reinforcement learning. Our method is evaluated for inverted pendulum models with applicability to many continuous control systems. Extensive experiments demonstrate that Critic PI2 achieved a new state of the art in a range of challenging continuous domains. Furthermore, we show that planning with a critic significantly increases the sample efficiency and real-time performance. Our work opens a new direction toward learning the components of a model-based planning system and how to use them.

# CASA-B

Building on the breakthrough of reinforcement learning, this paper introduces a unified framework of model-free reinforcement learning, CASA-B, Critic AS an Actor with Bandits Vote Algorithm. CASA-B is an actor-critic framework that estimates state-value, state-action-value and policy. An expectation-correct Doubly Robust Trace is introduced to learn state-value and state-action-value, whose convergence properties are guaranteed.

# Entropy

 In this paper, we propose an entropy regularization free mechanism that is designed for policy-based methods, which achieves Closed-form Diversity, Objective-invariant Exploration and Adaptive Trade-off. Our experiments show that our mechanism is super sample-efficient for policy-based methods and boosts a policy-based baseline to a new State-Of-The-Art on Arcade Learning Environment.

