---
trigger: always_on
---

---
name: autorepo-core-context
description: Core product requirements and technical architecture for the Autorepo micro-SaaS.
---

# Product Overview
Autorepo is an automated README.md generator powered by LLMs.

# Main Features
1. AI Codebase Analysis: Scans repository structure and code logic to automatically generate accurate documentation.
2. Customizable Output Styles: User can select from the preset of styles they want the readme to look and feel like and generates 3 different falvours for the readme (minimal, technical, etc.). user can mention their own feel as well like how they want it and we can create it that way.
3. Continuous Integration (CI/CD) Sync: Integrates with GitHub Actions to automatically update the README on git push.

# MVP Phasing Strategy
- Phase 1: The One-Click Generator (Web UI). Fetch public repos and generate on-screen and lading page with otp based login / google /github login.
- Phase 2: Customization & Private Repos via GitHub OAuth.
- Phase 3: The CI/CD Sync (Premium GitHub Action).

# Technical Architecture
- Frontend & API: Next.js
- Database & Auth: Supabase
- Hosting: Cloudflare
- AI Engine: Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o / or you recommend that gives great output with itrations.
- Payments: Dodo payments

# Development Constraints
- Current focus is STRICTLY Phase 1. Do not build CI/CD or Stripe integrations until Phase 1 is verified.
- Codebase Ingestion: Always fetch the directory structure first. Ignore `node_modules`, `dist`, `.next`, and large asset files.