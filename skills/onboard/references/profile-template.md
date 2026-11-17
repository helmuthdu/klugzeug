# Project profile template

Copy this structure into `AGENTS.md`. Every key in the tables is required: write a value, or `none` when the project has no such thing. Mark unconfirmed values `[VERIFY]`. Key names must match `shared/contract.md` → **Profile keys** exactly.

```md
## Project profile

- **Stack**: <language, framework, UI library, state/data library, test runners, bundler>
- **Workflow skills**: plan, build, test, review, docs, deliver, pipeline, onboard (klugzeug, installed globally)

### Commands

| Key | Value |
| --- | ----- |
| Install | `<install>` |
| Dev command | `<dev>` (or one line per target) |
| Browser-test command | `<command>` or none |
| Test (all) | `<test>` |
| Test (one file) | `<test one file>` |
| Lint | `<lint>` |
| Lint fix | `<lint --fix>` |
| Typecheck | `<typecheck>` or none |
| Build | `<build>` |
| E2E | `<e2e>` or none |
| Docs | `<docs validate and build>` or none |
| Analyse command | `<bundle report>` or none |
| Audit command | `<audit>` or none |
| Performance measurement command | `<lab tool>` or none |
| Packed-package check | `<command>` or none |
| Change-file command | `<command and granularity>` or none |

### Testing

| Key | Value |
| --- | ----- |
| Test layers | unit, component, integration, e2e, visual: list those that exist |
| Query helper | `<name>` (role-first) or none |
| Interaction helper | `<name>` or none |
| Network helper | `<name>` or none |
| Visual baseline | `<workflow>` or none |

### Conventions

| Key | Value |
| --- | ----- |
| Reactivity model | <how state reaches the UI> |
| Translation mechanism | `<name>` or none |
| Error types | `<Error base class>` in `<path>` |
| Return-shape convention | <values, nullable, or result objects> |
| Query key convention | <key format> or none |
| Large-list approach | <virtualization or pagination, and the size where it starts> or none |
| Commit convention | <for example conventional commits> |
| PR template | `<path>` or none |

### Design, accessibility, and budgets

| Key | Value |
| --- | ----- |
| Design system | `<path>` or none |
| Accessibility target | <standard and level> or unset (WCAG 2.2 Level A and AA) |
| Bundle budget | <limits per entry or route> or none |
| Security checklist | `<path>` or none |
| Doc templates | `<path>` or none |

### Repository

| Key | Value |
| --- | ----- |
| Runtime and package manager | <runtime version, package manager, workspace layout> |
| Plan file | `<path>/.plan.md`; gitignored: yes or no; committed: yes or no |
| Protected branches | <names> or unset |
| Protected paths | `<path>`: <why, and what approval it needs> |
| Public API entry points | `<path>`; errors in `<path>` |

### Validation gates by changed surface

| Surface | Gate |
| ------- | ---- |
| Source | `<focused tests>`, `<lint>`, `<build>` |
| Public API | source gates plus `<docs validator>` |
| UI behaviour | source gates plus browser verification (`~/.agents/klugzeug/browser-verification.md`) |
| Tests only | focused tests; lint when config changes |
| Config or tooling | `<tool tests>`, smoke run of the changed script |
| Docs | `<docs validator>`, `<docs build>` |

### Project rules that always apply

- <rule that differs from common practice, one line each>
```
