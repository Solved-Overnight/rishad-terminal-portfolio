---
title: "Attention Is All You Need: Inside the Transformer Architecture"
date: 2026-09-15
author: Moniruzzaman Rishad
summary: "Revisiting Vaswani et al. (2017): why dispensing with recurrence for scaled dot-product multi-head self-attention reshaped sequence modeling, parallelism, and modern LLMs."
tags: ["Transformers", "Deep Learning", "Attention", "Research Paper"]
readTime: 6 min read
image: "https://media.licdn.com/dms/image/v2/D5622AQGG5MQ395lg2A/feedshare-shrink_800/B56aHfVEV9G0Ag-/0/1794748204717?e=1796860800&v=beta&t=eN-UWegtLFcRBbaX8BKC2GhtCijBM3c6jyTFMecT--k"
---

# Attention Is All You Need: Inside the Transformer Architecture

Few papers in computer science have reshaped an entire discipline as decisively as **"Attention Is All You Need"** (Vaswani et al., 2017). Before the **Transformer**, state-of-the-art sequence transduction relied on sequential Recurrent Neural Networks (LSTMs/GRUs) or Convolutional encoders paired with attention—architectures fundamentally bottlenecked by step-by-step recurrence.

By removing recurrence and convolution altogether, the Transformer achieved massive GPU parallelization across sequence positions and created the blueprint for nearly every modern LLM.

---

## 1. The Bottleneck of Recurrence

In an RNN/LSTM, hidden state $h_t$ depends sequentially on $h_{t-1}$:

- **No Intra-Sequence Parallelism:** Training cannot parallelize token computation within a single sequence.
- **Long-Range Path Length:** Signals between distant tokens separated by $n$ steps must traverse $O(n)$ sequential operations, leading to vanishing gradients and diluted context.

Self-attention collapses the maximum path length between **any two tokens** in a sequence to **$O(1)$**.

---

## 2. Scaled Dot-Product & Multi-Head Attention

The heart of the Transformer maps every token into three learned projections: **Query ($Q$)**, **Key ($K$)**, and **Value ($V$)**:

```text
Attention(Q, K, V) = softmax( (Q · K^T) / sqrt(d_k) ) · V
```

Why scale by $\frac{1}{\sqrt{d_k}}$? For large key dimensions $d_k$, dot products grow large in magnitude, pushing the softmax function into regions with vanishingly small gradients. Scaling preserves unit variance before softmax normalization.

### Multi-Head Attention
Instead of computing one attention map across the full embedding dimension $d_{\text{model}} = 512$, the paper projects $Q, K, V$ into **$h = 8$ parallel attention heads** ($d_k = d_v = 64$ each):

- Different heads simultaneously specialize in syntactic dependencies, coreference resolution, and positional proximity.
- All heads are computed in parallel, concatenated, and projected back via $W^O$.

---

## 3. Core Architectural Pillars

Beyond self-attention, four design choices made the 6-layer Encoder–Decoder stack stable and trainable:

1. **Sinusoidal Positional Encodings:** Without recurrence, attention is permutation-equivariant. Adding sine/cosine waves of varying frequencies injects absolute and linear-transformable relative token order.
2. **Causal Masking in the Decoder:** Setting upper-triangular future positions to $-\infty$ before softmax prevents autoregressive leakage during training.
3. **Residual Connections + Layer Normalization:** `LayerNorm(x + Sublayer(x))` stabilizes gradient flow across deep stacks.
4. **Position-Wise Feed-Forward Networks:** Two linear transformations with ReLU activation expand dimensionality ($512 \rightarrow 2048 \rightarrow 512$) identically at each token position.

---

## Conclusion

What began as an architecture beating WMT14 English-to-German/French translation benchmarks in a fraction of the training FLOPs became the universal substrate for GPT, Gemini, Claude, ViTs, and multimodal foundation models. Understanding scaled dot-product attention remains essential for every ML engineer.
