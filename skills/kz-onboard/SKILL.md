---
name: kz-onboard
description: Detect a repository's stack, commands, validation gates, and conventions, then write or refresh the "## Project profile" section of its AGENTS.md, which the other klugzeug skills read. Use when setting up klugzeug in a repository, or when the profile is missing, stale, or its commands or conventions changed.
argument-hint: '[repo path]'
---

# kz-onboard

Read `references/contract.md` next to this SKILL.md, and `references/profile-template.md`, the canonical list of profile keys. Onboarding reads the repository and writes exactly one section: `## Project profile` in `AGENTS.md`. It runs no installs, builds, or tests.

## 1. Detect (read-only)

1. **Runtime and workspaces**: lockfile, package manager and its version pin, workspace layout, runtime version.
2. **Commands**: manifest and task-runner scripts (`package.json`, `Makefile`, `justfile`, `pyproject.toml`, `Cargo.toml`, or the stack's equivalent), at the root and per package in a monorepo. Map each template command to a script; never invent a missing one. For typed languages, check whether the typecheck covers test files, and list a separate test typecheck when it does not.
3. **Tooling**: test runners, linters, type checker, frontend framework and bundler, server framework, database and migration tooling, browser test tooling. Record them in **Stack**, writing `none` for a frontend, backend, or data part the repository lacks.
4. **Conventions**: `AGENTS.md`, `CONTRIBUTING*`, `CHANGELOG*`, change-file tooling, and the PR template (search case-insensitively for `pull_request_template.md` and a `.github/PULL_REQUEST_TEMPLATE/` directory, in the repository and, for a nested package, at `git rev-parse --show-toplevel`). For the commit convention, prefer a documented policy or an enforced hook; recent subjects show style, not a rule, so record an inferred convention with its source.
5. **Boundaries**: CI workflows, generated folders, committed build output, "do not edit" notes, protected branches, issue tracker identity (from `AGENTS.md`, `CONTRIBUTING*`, PR or issue templates, or git remote when unambiguous; mark unconfirmed keys `[VERIFY]`), and where `.plan.md` would live and whether git ignores it.
6. **Remaining keys**: detect a value for every other key in the template, or write `none`. Link a file only when it exists. Never leave a key blank.

## 2. Draft

Fill `references/profile-template.md`. Every command comes from a script or config you read, runs from the directory its script implies, and names one script per invocation (some runners treat a second word as an argument). To settle uncertainty, run only bounded, read-only checks whose effects you know. Values you cannot confirm are `[VERIFY]`. Keep rules that apply only sometimes in the files the profile links, not in the profile.

## 3. Write

The onboarding request authorises writing the profile section. Replace the existing `## Project profile` section, or append it after the first heading, and leave every other line untouched. Stop with `[BLOCKED]` and show the diff first only when the write would remove or rewrite hand-written rules, or change lines outside the section.

## 4. Refresh

When a profile exists, re-detect each key and change only those that differ. Keep hand-written rules. A command that no longer resolves becomes `[VERIFY]`, not a guess. Check the profile's cited paths and cross-references, including directional ones such as "above"; fix a stale one or mark it `[VERIFY]`.

## 5. Report

- Profile: created, refreshed (with the changed keys as a diff), or unchanged.
- Keys marked `[VERIFY]`, each with the reason.
- Keys set to `none`, so the user knows what klugzeug will not check.
- Optional, never written here: when a traced task (one at the root, one in a nested package) misses an applicable ancestor `AGENTS.md` or follows stale guidance, name the task, the path, the missed guidance, and the smallest navigation fix.
