---
title: "Ran a shared BuildKit fleet so container builds stop fighting for CI runners"
summary: "Moved image builds off per-job Docker daemons onto a pooled BuildKit fleet with a shared cache."
period: "2026"
org: "Mercari"
role: "Platform engineer"
featured: true
order: 1
outcome:
  metric: "p50 image build time"
  before: "REPLACE (e.g. 14 min)"
  after: "REPLACE (e.g. 4 min)"
stack: ["BuildKit", "Docker", "Kubernetes", "GitHub Actions", "Shell"]
links:
  - label: "Repo"
    href: "https://github.com/anirudh-y-M/docker-buildkit-fleet"
draft: true
reviewed: false
---

## Context

Every CI job built its images inside its own Docker daemon. Nothing was shared, so identical layers were rebuilt hundreds of times a day.

## Constraint

Runner minutes were the bottleneck, not developer time. Any fix had to work without changing how teams wrote their Dockerfiles.

## Decision

Run a pool of long-lived BuildKit daemons on Kubernetes, front them with a shared registry-backed cache, and point the existing `docker build` step at the fleet with a two-line change in the CI template.

## Outcome

REPLACE with the measured before and after. Say how you measured it and over what window.

## Retro

REPLACE with one thing you would do differently, in one or two sentences.
