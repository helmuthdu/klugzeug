# Project profile template

Copy this structure into `AGENTS.md`. Delete any field that does not apply; mark unconfirmed values `[VERIFY]`.

```md
## Project profile

- **Stack**: <language, framework, UI library, state/data library, test runners, bundler>
- **Runtime and package manager**: <Node/Bun version, package manager, workspace layout>
- **Workflow skills**: plan, build, test, review, docs, deliver, pipeline (klugzeug, installed globally)

### Commands

| Purpose         | Command                                                          |
| --------------- | ---------------------------------------------------------------- |
| Install         | `<install>`                                                      |
| Dev server      | `<dev>`                                                          |
| Test (all)      | `<test>`                                                         |
| Test (one file) | `<test one file>`                                                |
| Lint            | `<lint>`                                                         |
| Lint fix        | `<lint --fix>`                                                   |
| Typecheck       | `<typecheck>`                                                    |
| Build           | `<build>`                                                        |
| E2E             | `<e2e>` or none                                                  |
| Docs            | `<docs build / validate>` or none                                |

### Validation gates by changed surface

| Surface                | Gate                                                      |
| ---------------------- | --------------------------------------------------------- |
| Source                 | `<focused tests>`, `<lint>`, `<build>`                   |
| Public API             | source gates plus `<docs validator>`                     |
| UI behaviour           | source gates plus browser verification (`shared/browser-verification.md`) |
| Tests only             | focused tests; lint when config changes                  |
| Config or tooling      | `<tool tests>`, smoke run of the changed script           |
| Docs                   | `<docs validator>`, `<docs build>`                       |

### Conventions and references

- `<path>`: <what it governs, when to load it>
- Public API entry points: `<path>`; errors in `<path>`
- Plan file: `<path>/.plan.md` (gitignored: yes | no `[VERIFY]`)

### Project rules that always apply

- <rule that differs from common practice, one line each>

### Protected paths

- `<path>`: <why, and what approval it needs>

### Release and delivery

- Commits: <convention, for example conventional commits>
- Change files or changelog: <command, one call per package>
- PR template: `<path>` or none
```
