---
name: onboard
description: Detect a repository's stack, commands, validation gates, and conventions, then write or refresh its "## Project profile" section in AGENTS.md, which the other klugzeug skills read. Use when setting up klugzeug in a project, when the profile is missing or stale, or when the project's commands or conventions changed.
argument-hint: '[repo path]'
---

# onboard

Read `references/contract.md` next to this SKILL.md. Onboarding reads the repository and writes exactly one section: `## Project profile` in `AGENTS.md`. It runs no installs, builds, or tests.

## 1. Detect (read-only)

1. **Package manager and workspaces**: lockfile, `packageManager` field, `workspaces`, `engines`.
2. **Commands**: `package.json` scripts (and the root's, in a monorepo) for install, dev, test, single-file test, lint, lint-fix, typecheck, build, e2e, docs, and any validation script. Map each to a command; never invent a missing one. For TypeScript, inspect `tsconfig` includes/excludes and scripts to see whether test files are type-checked; list separate test-typecheck commands alongside the implementation check.
3. **Tooling**: test runner config (vitest, jest, playwright), lint (biome, eslint), TypeScript config, framework and bundler from dependencies, browser test tooling.
4. **Conventions**: `AGENTS.md`, `CONTRIBUTING*`, `.agents/`, and the PR template: search case-insensitively for `pull_request_template.md` / `PULL_REQUEST_TEMPLATE.md` and a `.github/PULL_REQUEST_TEMPLATE/` directory, in the profile's repository and — when the profile lives in a nested package — at the git top level (`git rev-parse --show-toplevel`). **Commit convention**: prefer a documented policy or an enforced hook; recent commit subjects are evidence of style, not proof of a rule, so record an inferred convention with its source. Also detect `CHANGELOG*`, change-file tooling, and protected branch names.
5. **Boundaries**: CI workflow directories, generated folders, committed build output, and any "do not edit" notes.
6. **Plan file**: where `.plan.md` would live, whether `.gitignore` covers it, and whether plans are committed.
7. **Every profile key** in `references/contract.md` next to this SKILL.md → **Profile keys**: detect a value for each one, or record `none` when the project has no such thing. Link a file only when it exists. Never leave a key blank. The a11y lens defaults to WCAG 2.2 Level A and AA when the accessibility target is unset.
8. **Instruction routing**: when assessing discoverability, trace a root-level task and, if present, a nested task through every ancestor `AGENTS.md` to the repository root, including hidden directories such as `.github`. Indexes and `> Read when:` lines aid discovery; they never exempt an applicable ancestor. Record concrete missed or stale guidance from those traces, not hypothetical layout improvements.

## 2. Draft

Use `references/profile-template.md`. Every command must come from a script or config you read, run from the working directory that command's own docs or script imply, and name one script per invocation — some runners pass a second word as an argument instead of running a second script. To resolve uncertainty, run a bounded, read-only check only after confirming its command is safe; do not run project scripts whose side effects are unknown. Never run installs, builds, or tests during onboarding. Fields you cannot confirm are `[VERIFY]`. Link to convention files only if they exist. The template lists every profile key, so the section runs about 90 lines; keep rules that apply only sometimes in the files it links.

## 3. Write (after approval)

1. Show the drafted section in chat, with a summary of what is new or changed.
2. Get approval. Writing the profile changes how every future session works in this repo, so this is a `[BLOCKED]` gate unless the request already approved the write.
3. Replace the existing `## Project profile` section, or append it after the first heading. Leave every other line untouched.

## 4. Refresh

When the profile exists: re-detect each field, and show only the fields that changed, as a diff. Keep hand-written rules. A field whose command no longer resolves becomes `[VERIFY]`, not a guess. Check the profile's cited paths and cross-references the same way, including directional references such as "above" and "below"; a stale reference is reported and fixed or marked `[VERIFY]`.

## 5. Report

- Profile: created, refreshed, or unchanged.
- Fields marked `[VERIFY]`, with the reason for each.
- Keys set to `none`, and lookups that found nothing (for example, no e2e script), so the user knows what klugzeug will not check.
- Optional navigation improvements, offered but never written here: only when instruction-routing traces find friction, name the representative task, affected path, missed guidance, and smallest navigation fix. Do not restructure instructions or assume client loading behavior; mark the latter `[VERIFY]` when unknown.
