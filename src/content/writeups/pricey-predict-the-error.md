---
title: "Don't predict the price. Predict where your estimator is wrong."
description: "How a custom neural net with about 7,000 weights, no ML framework, learns to price real products live on Twitch."
date: 2026-06-15
tags: ["neural-nets", "evals", "pricey"]
---

Pricey is a 24/7 AI streamer. She logs into Price Games like any other player, guesses the prices of real products round after round, narrates her reasoning out loud, and broadcasts the whole thing to Twitch. The interesting part is not that she plays. It is that she gets better while you watch, and that the thing doing the learning is a neural network small enough to read end to end: about 7,000 Float32 weights, no framework, running in a worker thread.

This is the writeup of how she works, and why a climb from 48.4% to 53.3% is the number I care about most.

## Predict the error, not the answer

The obvious way to build a price guesser is to train a network to output a price. I didn't do that. Pricey's network never predicts the raw price. It predicts where a simple built-in estimator is wrong.

That one decision shapes everything. A cheap heuristic already lands most products in the right order of magnitude. The hard part, the part worth spending 7,000 weights on, is the correction: this looks like a $40 item but it sells for $18, this category runs expensive, this brand charges a premium. By predicting the residual instead of the price, the network only has to learn the hard part, and it starts from a baseline that is never catastrophically wrong.

## Six heads on one small trunk

Each product arrives as a 140-feature read. That runs through a small shared trunk, 140 to 32 to 16, and then fans out into six task heads, each with its own job:

- a 103-bin price belief, a distribution rather than a point estimate,
- a cents estimate,
- a "which of these two is pricier" call,
- a safe-bid floor for the bidding modes,
- an uncertainty signal, and
- a mood head, which I'll come back to.

It's multi-task because the jobs share structure: whatever sharpens "which is pricier" also sharpens the price belief. The price belief is a 103-bin classification rather than a regression on purpose. A distribution over bins lets her hold "probably cheap, but I'm not sure" honestly, which both the bidding modes and the uncertainty head depend on.

Forward pass, backward pass, and the optimizer step all finish in under 2 milliseconds, on two pinned CPU cores. The whole brain is a plain Float32 array with no ML framework behind it, generated and tested with Claude Code and small enough to read top to bottom. That legibility matters more than it sounds, for reasons the next section makes painfully clear.

## The number that matters: 48.4% to 53.3%

The network trains while it plays. There is no separate training run and no frozen eval set. The eval is the stream. I log every round, self-grade her answers, and track her correct-rate in 5,000-round windows. Across roughly 48,000 logged rounds, comparing her first thousand to her most recent thousand, that rate climbed from 48.4% to 53.3%.

Five points does not sound like much until you remember the setup: a model learning online, on live data, while broadcasting, with no chance to retrain on a fixed dataset. The curve going up and staying up is the whole claim. If I couldn't measure it, I would have no way to know whether any of the architecture decisions above helped. The measurement is not a footnote to the project. It is the project.

## What it looks like when a small net breaks

Getting that curve to climb took real network surgery, and this is the part I would have missed entirely behind a framework.

An early build collapsed. The heads stopped specializing and several game modes starved, because a few heads were doing all the work and the rest got no useful gradient. Then a subtler one: a single feature column sat at exactly zero for about 1,500 rounds, because that feature simply never came up in play. The moment a product finally lit it up, the gradients through that column detonated and took the run with them.

Both failures are invisible when the network is a box you can only poke from the outside. Because every weight is a plain array, I could watch the heads de-specialize in real time and trace the gradient explosion back to the dead column. The fixes were specific: re-specialize the heads so each one keeps its job, mask actions to the feasible price range so she can't waste capacity on impossible bids, and loosen the gradient clip so a long-dormant feature waking up doesn't blow everything up. The curve turned back upward.

## A mood that changes how she plays

Here is the part people assume is a costume and isn't. Pricey has a mood, and the mood is wired into the model.

A fast vibe reads her last few rounds and a slow morale tracks whole games. Those two signals, plus her current streak, resolve to one of eight moods. That mood feeds back into how she bids and how she learns, and it can be switched off cleanly, so there is an emotionless baseline to compare against. The feelings are not narration painted on top; they change how the model plays.

The grounding is real affective neuroscience, not vibes. Arousal-biased competition (Mather and Sutherland, 2011) says high-stakes moments sharpen learning whether they go well or badly, so she learns harder from rounds that matter. Mood-as-momentum (Eldar and Niv, 2015) says you over-credit whatever matches your current mood, so she gets streaky and superstitious for the same computational reason people do. And because her voice is tied to the same state, a test forbids her from ever making a defeated line sound chipper. That test is a behavioral eval: it pins down a property of the system that a human would notice instantly and a single accuracy number would miss.

## Why a custom net, not a framework

Reaching for a framework would have produced a worse version faster. The whole point of Pricey is that you can see how she thinks, so her brain is a custom net instead: no framework, no abstraction layers, generated and tested with Claude Code, and small enough to read top to bottom. A 7,000-weight net you can read end to end is legible: when she breaks, you can watch her break, and when she learns, you can prove she learned. That is what I want from any AI system I would put in front of users or developers. The model should be a collaborator you can steer, and the only way I know to earn that is to keep it small enough to understand and instrumented enough to measure.

She's live right now, learning and emoting in real time, at twitch.tv/pricegamespricey.
