---
name: onboard
description: Detect a repository's stack, commands, validation gates, and conventions, then write or refresh its "## Project profile" section in AGENTS.md, which the other klugzeug skills read. Use when setting up klugzeug in a project, when the profile is missing or stale, or when the project's commands or conventions changed.
argument-hint: '[repo path]'
---

# onboard

Read `~/.agents/klugzeug/contract.md`. Onboarding reads the repository and writes exactly one section: `## Project profile` in `AGENTS.md`. It runs no installs, builds, or tests.

## 1. Detect (read-only)

1. **Package manager and workspaces**: lockfile, `packageManager` field, `workspaces`, `engines`.
2. **Commands**: `package.json` scripts (and the root's, in a monorepo) for install, dev, test, single-file test, lint, lint-fix, typecheck, build, e2e, docs, and any validation script. Map each to a command; never invent a missing one.
3. **Tooling**: test runner config (vitest, jest, playwright), lint (biome, eslint), TypeScript config, framework and bundler from dependencies, browser test tooling.
4. **Conventions**: `AGENTS.md`, `CONTRIBUTING*`, `.agents/`, `.github/pull_request_template.md`, `CHANGELOG*`, change-file tooling, release docs, and protected branch names.
5. **Boundaries**: CI workflow directories, generated folders, committed build output, and any "do not edit" notes.
6. **Plan file**: where `.plan.md` would live, whether `.gitignore` covers it, and whether plans are committed.
7. **References the other skills read**, linking a file only when it exists: design system or tokens, security checklist, doc or README templates, test helpers (query, interaction, network), and an accessibility target when the project states one. The a11y lens defaults to WCAG 2.2 Level A and AA.

## 2. Draft

Use `references/profile-template.md`. Every command must come from a script or config you read. Fields you cannot confirm are `[VERIFY]`. Link to convention files only if they exist. Keep the section short (about 60 lines); move rules that apply only sometimes into the files it links.

## 3. Write (after approval)

1. Show the drafted section in chat, with a summary of what is new or changed.
2. Get approval. Writing the profile changes how every future session works in this repo, so this is a `[BLOCKED]` gate unless the request already approved the write.
3. Replace the existing `## Project profile` section, or append it after the first heading. Leave every other line untouched.

## 4. Refresh

When the profile exists: re-detect each field, and show only the fields that changed, as a diff. Keep hand-written rules. A field whose command no longer resolves becomes `[VERIFY]`, not a guess.

## 5. Report

- Profile: created, refreshed, or unchanged.
- Fields marked `[VERIFY]`, with the reason for each.
- Lookups that found nothing (for example, no e2e script), so the user knows what klugzeug will not check.
