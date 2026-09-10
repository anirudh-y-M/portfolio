---
title: "Wrote the reference service that got Datadog tracing right the first time"
summary: "A small Go service on Kubernetes showing traces, metrics, and logs wired the way the platform expects."
period: "2026"
org: "Personal / Mercari"
role: "Author"
featured: true
order: 2
stack: ["Go", "Datadog", "Kubernetes", "OpenTelemetry"]
links:
  - label: "Repo"
    href: "https://github.com/anirudh-y-M/datadog-proj"
draft: true
reviewed: false
---

## Context

New services kept shipping with half-configured observability: traces without service tags, logs not correlated to traces.

## Constraint

Documentation alone was not being read. The fix had to be something people could clone and diff against.

## Decision

Build one deliberately boring service that does everything correctly, with comments explaining each choice, and link it from the onboarding checklist.

## Outcome

REPLACE with adoption evidence: how many teams used it, or how support questions changed.

## Retro

REPLACE.
