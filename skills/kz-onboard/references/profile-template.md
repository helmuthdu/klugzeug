# Project profile template

This template is the canonical list of profile keys. Copy its structure into `AGENTS.md`. Every key row is required: write a value, or `none` when the project has no such thing. Mark unconfirmed values `[VERIFY]`. Skills read the key names verbatim; never rename them.

```md
## Project profile

- **Stack**: <language, frontend framework and UI library or none, state/data library, backend framework or none, database and migration tooling or none, test runners, bundler>

### Commands

| Key | Value |
| --- | ----- |
| Install | `<install>` |
| Dev command | `<starts the app for browser checks>`, one line per target in a multi-app repo, or none |
| Browser-test command | `<runs browser tests against a running app>` or none |
| Test (all) | `<full test run>` |
| Test (one file) | `<single test file>` |
| Coverage command | `<reports test coverage>` or none |
| Lint | `<lint>` |
| Lint fix | `<lint and apply fixes>` |
| Typecheck | `<implementation typecheck>`; plus `<test typecheck>` when tests need a separate check; or none |
| Build | `<build>` |
| E2E | `<browser end-to-end run>` or none |
| Docs | `<docs validators and docs build>` or none |
| Analyse command | `<reports bundle or chunk sizes>` or none |
| Audit command | `<dependency vulnerability audit>` or none |
| Performance measurement command | `<lab tool for Core Web Vitals, such as Lighthouse>` or none |
| Packed-package check | `<verifies a release artifact before publishing>` or none |
| Change-file command | `<records a pending release note>`, with its granularity, or none |

### Testing

| Key | Value |
| --- | ----- |
| Test layers | unit, component, integration, e2e, visual: list those that exist |
| Query helper | `<role-first DOM query API>` or none |
| Interaction helper | `<user-level interaction API>` or none |
| Network helper | `<HTTP-boundary mocking API>` or none |
| Visual baseline | `<visual regression workflow>` or none |

### Conventions

| Key | Value |
| --- | ----- |
| Reactivity model | <how state updates reach the UI> or none |
| Translation mechanism | `<how user-facing strings are translated>` or none |
| Error types | `<error base class>` in `<path>` |
| Return-shape convention | <values, nullable, or result objects> |
| Query key convention | <how data-cache keys are built> or none |
| Output language | `ste-reports` (standard; omit the key for the same) \| `ste-plan` \| `ste-artifacts` \| `ste-all` \| `verbose` |
| Large-list approach | <virtualization or pagination, and the size where it starts> or none |
| Commit convention | <format, with its source: documented policy, enforced hook, or inferred from history> |
| PR template | `<path>` or none |

### Design, accessibility, and budgets

| Key | Value |
| --- | ----- |
| Design system | `<tokens, component library, and guidelines>` or none |
| Accessibility target | <standard and level>; default WCAG 2.2 AA |
| Bundle budget | <size limits per entry or route> or none |
| Security checklist | `<path>` or none |
| Doc templates | `<path>` or none |

### Repository

| Key | Value |
| --- | ----- |
| Runtime and package manager | <runtime version, package manager, workspace layout> |
| Plan file | `<path>/.plan.md`; gitignored: yes or no; committed: yes or no |
| Issue tracker | <provider (jira, github, gitlab, linear) and project/team key or owner/repo> or none |
| Protected branches | <branches no skill may commit to>; default main, master |
| Protected paths | `<path>`: <why, and what approval it needs>, or none |
| Public API entry points | `<files that define public exports>` or none |

### Validation gates by changed surface

| Surface | Gate |
| ------- | ---- |
| Source | `<focused tests>`, `<typecheck>`, `<lint>`, `<build>` |
| Public API | source gates plus `<docs validator>` |
| UI behaviour | source gates plus browser verification |
| Tests only | focused tests, plus the test typecheck when the runner does not type-check |
| Config or tooling | `<tool tests>`, smoke run of the changed script |
| Docs | `<docs validator>`, `<docs build>` |

### Project rules that always apply

- <rule that differs from common practice, one line each>
```
