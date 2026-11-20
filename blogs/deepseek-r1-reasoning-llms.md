---
title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning"
date: 2026-10-20
author: Moniruzzaman Rishad
summary: "A technical breakdown of DeepSeek-R1 and DeepSeek-R1-Zero: how Group Relative Policy Optimization (GRPO) and rule-based RL unlock emergent chain-of-thought reasoning without heavy SFT."
tags: ["DeepSeek-R1", "Reinforcement Learning", "LLM", "Research Paper"]
readTime: 6 min read
image: "https://media.licdn.com/dms/image/v2/D5622AQGq7y8CrbABmw/feedshare-shrink_1280/B56aHp4pqBG4AI-/0/1794925304738?e=1796860800&v=beta&t=IUVqUc8j9uCM__BpLrXvy60m2k6gmdiyhH9FJrgfY6Q"
---

# DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning

Published in January 2025, the **DeepSeek-R1** research paper challenged a core assumption of post-training large language models: that complex multi-step reasoning requires massive human-curated supervised fine-tuning (SFT) datasets or expensive neural process reward models (PRMs).

DeepSeek demonstrated that **pure reinforcement learning (RL)** driven by simple rule-based outcome verifiers can naturally elicit sophisticated chain-of-thought (CoT) reasoning, self-verification, and backtracking.

---

## 1. DeepSeek-R1-Zero: Pure RL Without SFT

To test whether reasoning emerges from RL alone, the authors bypassed SFT entirely and trained **DeepSeek-R1-Zero** directly from the DeepSeek-V3 base model using **Group Relative Policy Optimization (GRPO)**:

- **No Critic Model Overhead:** Unlike PPO, which requires a value/critic network matching the policy size, GRPO estimates the baseline directly from a group of sampled outputs $\{o_1, o_2, \dots, o_G\}$ for the same prompt.
- **Rule-Based Rewards Only:** Rather than training neural reward models (which are vulnerable to reward hacking), DeepSeek relied strictly on two deterministic signals:
  1. **Accuracy Rewards:** Automated verification for math answers (`\boxed{...}`) and unit-test execution for code.
  2. **Format Rewards:** Enforcing structured `<think>...</think>` reasoning blocks before the final answer.

### The "Aha Moment"
Without any demonstration of how to verify its own work, the model learned during RL to allocate **more test-time thinking tokens** to harder problems—exhibiting spontaneous self-reflection (*"Wait, let me double-check that step..."*) and alternative strategy exploration.

However, DeepSeek-R1-Zero exhibited two practical drawbacks: poor human readability and language mixing inside reasoning traces.

---

## 2. DeepSeek-R1: The 4-Stage Production Pipeline

To achieve frontier reasoning **and** clean, aligned output formatting, **DeepSeek-R1** introduced a structured multi-stage pipeline:

1. **Cold-Start Fine-Tuning:** A small, high-quality curated dataset (thousands of long-CoT examples) stabilizes output format and readability before RL begins.
2. **Reasoning-Oriented RL:** Large-scale GRPO training with accuracy, format, and **language-consistency rewards** prevents mid-thought language switching.
3. **Rejection Sampling & SFT:** The RL checkpoint generates ~600k verified reasoning trajectories alongside ~200k general-purpose (writing, QA, self-cognition) samples to retrain the base model cleanly.
4. **All-Scenario RL Alignment:** A final RL pass optimizes helpfulness, harmlessness, and reasoning clarity across general prompts.

---

## 3. Distillation Beats Small-Scale RL

One of the paper's most actionable engineering findings is the **distillation vs. direct RL** comparison:

- Distilling DeepSeek-R1's reasoning traces directly into smaller dense models (**1.5B to 70B** Qwen and Llama backbones) significantly outperformed running pure RL directly on those smaller base models.
- This unlocked frontier-grade math and coding reasoning (`AIME 2024`, `MATH-500`, `Codeforces`, `GPQA Diamond`) on single-GPU local deployments.

---

## Key Takeaway for ML Engineers

DeepSeek-R1 proved that verifiable environments + lightweight policy optimization (GRPO) + open distillation can democratize test-time compute scaling—turning reasoning into an accessible open-weights engineering primitive.
