---
title: 'The Exploration-Exploitation Dilemma in RLHF for Generative Models'
date: 2025-10-20
permalink: /posts/2025/10/diversity-collapse-rlhf/
tags:
  - reinforcement learning
  - RLHF
  - generative models
  - flow matching
excerpt: "A deep dive into why fixed regularization in RLHF leads to diversity collapse, and how adaptive sample-level control resolves the exploration-exploitation dilemma."
header:
  og_image: "/images/profile.jpg"
---

> RLHF fine-tuning of generative models faces a fundamental tension: you want to maximize reward (make outputs better), but doing so aggressively destroys the diversity of what the model can produce. This post explains why this happens, why it's hard to fix with a single hyperparameter, and how advantage-based adaptive regularization provides a principled solution.

## Table of Contents
{: .no_toc}

- TOC
{:toc}

---

## Background: The RLHF Objective

Suppose you have a pre-trained generative model \\(\pi_{\text{ref}}\\) — a text-to-image model like Stable Diffusion 3, or a language model like Qwen. You want to fine-tune it so that its outputs score higher on some reward function \\(R(x, c)\\), where \\(x\\) is the generated output and \\(c\\) is the conditioning context (e.g., a text prompt).

The standard approach formulates this as a regularized optimization problem:

$$J(\theta) = \underbrace{\mathbb{E}_{x \sim \pi_\theta, c \sim p(c)}[R(x, c)]}_{\text{maximize reward}} - \underbrace{\beta \cdot D(\pi_\theta, \pi_{\text{ref}})}_{\text{stay close to pre-trained model}}$$

The first term says "produce high-reward outputs." The second term says "don't stray too far from the original model." The coefficient \\(\beta\\) controls this trade-off, and \\(D\\) is some divergence measure — KL divergence for language models, Wasserstein-2 (W2) distance for flow matching models.

This is clean and intuitive. But in practice, getting \\(\beta\\) right is surprisingly hard — and the consequences of getting it wrong are severe.

## The Diversity Collapse Problem

### What happens without regularization

Let's start with the extreme case: \\(\beta = 0\\), no regularization at all. The model is free to do whatever maximizes reward.

In online RL, the model generates samples, gets rewards, and updates itself. Without any constraint:

1. Early in training, the model discovers a few high-reward outputs
2. It shifts probability mass toward those outputs
3. Now it generates similar outputs more often → they get reinforced further
4. This positive feedback loop concentrates all probability mass on a narrow region

The equilibrium is a **delta distribution**: the model always generates the same output for a given prompt, regardless of the diversity of valid responses.

$$\pi^*_{\beta=0}(x|c) \to \delta(x - x^*_c), \quad \text{where } x^*_c = \arg\max_x R(x, c)$$

In image generation, this means every prompt produces essentially the same "optimal" image — perhaps technically high-scoring but boring and unusable. In language, the model repeats the same phrasing over and over.

This is **mode collapse** (or **diversity collapse**), and it's the central failure mode of unconstrained RLHF.

<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:1.5em 0">
<figure style="margin:0;text-align:center">
<img src="/images/blog/mnist_collapse.png" style="width:100%;border-radius:8px;border:1px solid #e0e8f0" />
<figcaption style="font-size:0.82em;color:#666;margin-top:6px"><b>Mode collapse (α=0)</b>: model generates identical digits, maximizing reward but destroying diversity.</figcaption>
</figure>
<figure style="margin:0;text-align:center">
<img src="/images/blog/mnist_balanced.png" style="width:100%;border-radius:8px;border:1px solid #e0e8f0" />
<figcaption style="font-size:0.82em;color:#666;margin-top:6px"><b>Balanced (α=0.3)</b>: with proper regularization, the model improves quality while preserving digit variety.</figcaption>
</figure>
</div>

### Why diversity matters

One might ask: if the goal is to maximize reward, who cares about diversity? Several reasons:

1. **Reward functions are imperfect proxies.** They approximate human preferences, not capture them fully. A collapsed model that exploits quirks in the reward function (reward hacking) produces outputs that score high but look terrible to humans.

2. **Generalization.** A diverse model handles novel prompts gracefully. A collapsed model performs well only on prompts similar to its training distribution.

3. **Downstream utility.** In creative applications (art, writing, brainstorming), diversity is itself valuable. A model that always gives the same answer is useless for creative tasks.

4. **Training stability.** Once the model concentrates on a narrow manifold, gradient signals become noisy and training destabilizes.

### The standard fix: fixed regularization

The conventional solution is to set \\(\beta > 0\\). For flow matching models, we typically use a W2 regularization term:

$$\mathcal{L}_{\text{ORW-CFM-W2}} = \underbrace{\mathcal{L}_{\text{ORW}}(\theta)}_{\text{reward-weighted flow matching}} + \beta \cdot \underbrace{\mathbb{E}_{c,t,x_t}\left[\|\mathbf{v}_\theta(x_t, t, c) - \mathbf{v}_{\text{ref}}(x_t, t, c)\|^2\right]}_{\text{W2 regularization}}$$

For language models with GRPO:

$$\mathcal{L}_{\text{GRPO}} = \mathcal{L}_{\text{PG}}(\theta) + \beta \cdot D_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}})$$

This works — to a point. But it creates a fundamental dilemma.

## The Fixed-β Dilemma

Here's the core problem: **different samples need different levels of regularization.**

Consider two samples generated during training for the same prompt:

| | Sample A (high reward) | Sample B (low reward) |
|:---|:---|:---|
| **Advantage** | \\(A > 0\\) (better than average) | \\(A < 0\\) (worse than average) |
| **What we want** | Exploit: push further in this direction | Explore cautiously: pull back toward reference |
| **Ideal \\(\beta\\)** | Low (give freedom to optimize) | High (enforce stability) |
| **What fixed \\(\beta\\) does** | Same constraint as bad sample | Same constraint as good sample |

Fixed \\(\beta\\) applies the same regularization pressure to every sample regardless of quality. If \\(\beta\\) is high enough to prevent collapse on bad samples, it also unnecessarily constrains good samples. If \\(\beta\\) is low enough to exploit good samples, it fails to stabilize bad samples.

This is not a tuning problem — no single value of \\(\beta\\) is optimal for all samples simultaneously.

<figure style="margin:1.5em 0">
<img src="/images/blog/adrpo_reward_diversity.png" style="width:100%;border-radius:10px;border:1px solid #e0e8f0" />
<figcaption style="font-size:0.82em;color:#666;margin-top:8px;text-align:center"><b>Fig 1.</b> Reward vs. diversity Pareto front on SD3 text-to-image. Adaptive regularization (ADRPO) achieves a dominant frontier — higher reward at every diversity level compared to fixed-β methods like DPO and ORW-CFM-W2.</figcaption>
</figure>

## Adaptive Divergence Regularized Policy Optimization (ADRPO)

### Core idea

The insight is simple: **make regularization strength a function of sample quality.** High-quality samples get less regularization (exploit); low-quality samples get more (explore safely).

The general ADRPO objective:

$$\boxed{\mathcal{L}_{\text{ADRPO}}(\theta) = \mathcal{L}_{\text{RL}}(\theta) + (\beta_0 - A) \cdot \mathcal{L}_D(\theta)}$$

where \\(A\\) is the advantage estimate for the current sample, \\(\beta_0\\) is a baseline coefficient, and \\(\mathcal{L}_D\\) is the divergence regularization loss.

The effective regularization coefficient becomes:

$$\beta_{\text{eff}} = \beta_0 - A$$

| Sample quality | Advantage \\(A\\) | Effective \\(\beta\\) | Effect |
|:---|:---|:---|:---|
| High reward | \\(A > 0\\) | \\(\beta_0 - A\\) ↓ | Less regularization → exploit |
| Average | \\(A \approx 0\\) | \\(\approx \beta_0\\) | Standard regularization |
| Low reward | \\(A < 0\\) | \\(\beta_0 - A\\) ↑ | More regularization → stabilize |

This is a one-line modification to existing RLHF objectives. No new networks, no complex architecture changes.

### For flow matching models

For flow matching models like SD3, ADRPO combines advantage-weighted flow matching with adaptive W2 regularization:

$$\mathcal{L}_{\text{ADRPO-FM}}(\theta) = \underbrace{\mathbb{E}\left[A(x_1,c) \cdot \|\mathbf{v}_\theta(x_t, t, c) - \mathbf{u}_t\|^2\right]}_{\text{advantage-weighted flow matching}} + \underbrace{(\beta_0 - A(x_1,c)) \cdot \mathbb{E}\left[\|\mathbf{v}_\theta - \mathbf{v}_{\text{ref}}\|^2\right]}_{\text{adaptive W2 regularization}}$$

Notice that \\(A\\) appears in *both* terms. In the first term, the advantage provides *bidirectional* learning signals:

- \\(A > 0\\): gradient encourages matching the target velocity (strengthen good generation)
- \\(A < 0\\): gradient *reverses*, actively pushing the model *away* from bad generation

This is fundamentally different from reward-weighting (ORW-CFM-W2), which can only down-weight bad samples with non-negative weights but never actively suppress them. In high-dimensional spaces like image generation, where bad regions vastly outnumber good ones, this difference is critical.

The advantage is estimated simply as:

$$A(x_1, c) = R(x_1, c) - V(c), \quad \text{where } V(c) = \frac{1}{|\mathcal{B}|}\sum_{x \in \mathcal{B}} R(x, c)$$

i.e., the reward minus the batch-average reward for the same prompt.

### For language models

For LLMs, ADRPO integrates with GRPO by making the KL coefficient advantage-dependent:

$$\mathcal{L}_{\text{ADRPO-GRPO}}(\theta) = \mathcal{L}_{\text{PG}}(\theta) + (\beta_0 - A_{\text{GRPO}}) \cdot D_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}})$$

where \\(A_{\text{GRPO}}\\) is the group-level advantage from GRPO (reward minus group mean, normalized).

<figure style="margin:1.5em 0">
<img src="/images/blog/adrpo_reward_kl.png" style="width:100%;border-radius:10px;border:1px solid #e0e8f0" />
<figcaption style="font-size:0.82em;color:#666;margin-top:8px;text-align:center"><b>Fig 2.</b> Reward vs. KL divergence on SD3. ADRPO reaches the same reward level at lower KL divergence — more efficient policy improvement.</figcaption>
</figure>

## What Emerges in Practice

### Smaller models outperform larger ones

With ADRPO, a **2B parameter SD3** model outperforms **FLUX.1-Dev (12B)** and **SANA-1.5 (4.8B)** in attribute binding, semantic consistency, and compositional control. The adaptive regularization extracts more from each parameter by allocating exploration budget where it matters most.

### Emergent exploration in LLMs

When applied to LLM fine-tuning, ADRPO exhibits an unexpected emergent behavior: **the ability to escape local optima.**

<figure style="margin:1.5em 0">
<img src="/images/blog/adrpo_llm_entropy.png" style="width:100%;border-radius:10px;border:1px solid #e0e8f0" />
<figcaption style="font-size:0.82em;color:#666;margin-top:8px;text-align:center"><b>Fig 3.</b> Reward vs. entropy on LLM fine-tuning (Qwen2). ADRPO achieves higher reward while maintaining generation diversity. The adaptive mechanism allows the model to escape local optima that trap fixed-β methods.</figcaption>
</figure>

When the model is stuck in a poor solution (all advantages near zero or negative), the adaptive coefficient \\(\beta_0 - A\\) increases globally, pulling the model back toward the pre-trained distribution — effectively "resetting" exploration. When it finds a promising direction (high advantages), regularization drops, allowing rapid exploitation. This creates a natural curriculum that no fixed coefficient can replicate.

### Cross-domain generality

ADRPO is not limited to one modality or one divergence measure. It has been validated across:

- **Flow matching** (SD3) with W2 regularization
- **Text LLMs** (Qwen2, Qwen3) with KL divergence
- **Audio reasoning LLMs** with GRPO

The same principle — advantage-based adaptive regularization — provides consistent improvement regardless of the underlying architecture.

## Summary

The exploration-exploitation dilemma in RLHF is fundamental: **no single regularization coefficient is optimal for all samples.** ADRPO resolves this by making \\(\beta\\) a function of advantage:

$$\beta_{\text{eff}} = \beta_0 - A$$

One line of math; dramatic practical consequences. For details, see [the paper (NeurIPS 2025)](https://openreview.net/forum?id=aXO0xg0ttW).

## References

[1] Fan et al. "Adaptive Divergence Regularized Policy Optimization for Fine-tuning Generative Models." NeurIPS 2025. [Paper](https://openreview.net/forum?id=aXO0xg0ttW)

[2] Fan et al. "Online Reward-Weighted Fine-Tuning of Flow Matching with Wasserstein Regularization." ICLR 2025. [Paper](https://openreview.net/forum?id=2IoFFexvuw)

[3] Shao et al. "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models." 2024. (GRPO)

[4] Esser et al. "Scaling Rectified Flow Transformers for High-Resolution Image Synthesis." ICML 2024. (Stable Diffusion 3)

[5] Rafailov et al. "Direct Preference Optimization: Your Language Model is Secretly a Reward Model." NeurIPS 2023. (DPO)

---

*Cited as:*

```
Fan, Jiajun. "The Exploration-Exploitation Dilemma in RLHF for Generative Models."
jiajunfan.com (2025).
```
