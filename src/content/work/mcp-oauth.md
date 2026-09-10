---
title: "Added OAuth to a central MCP server so internal tools could be shared safely"
summary: "A Go MCP server with an OAuth flow, built to learn how agent tooling should authenticate inside a company."
period: "2025 – 2026"
org: "Personal"
role: "Author"
featured: true
order: 3
stack: ["Go", "OAuth 2.0", "MCP"]
links:
  - label: "Repo"
    href: "https://github.com/anirudh-y-M/mcp-oauth"
draft: true
reviewed: false
---

## Context

Model Context Protocol servers were being run as unauthenticated local processes. Sharing one across a team meant sharing credentials.

## Constraint

Clients vary in how much of the OAuth spec they implement, so the server had to degrade gracefully.

## Decision

Implement the authorization-code flow with PKCE in Go, keep the server stateless, and store tokens in the client rather than the server.

## Outcome

REPLACE.

## Retro

REPLACE.
