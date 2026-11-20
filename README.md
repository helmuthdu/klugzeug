# klugzeug

A stack-agnostic set of eight agent skills for frontend and backend engineering: plan, build, test, review, docs, deliver, pipeline, and onboard. Project specifics live in each repository's `AGENTS.md`, in a `## Project profile` section, not in the skills.

## Skills

| Skill      | Use it for                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------- |
| `onboard`  | Writing or refreshing a repository's `## Project profile`                                    |
| `plan`     | Audits, feature specs, bug triage, and new-module designs in `<scope>/.plan.md`              |
| `build`    | Implementing, fixing (test first), refactoring, migrating, and upgrading dependencies        |
| `test`     | Coverage gaps, behaviour-focused tests, flaky-test removal                                   |
| `review`   | Code, PR, and greenfield reviews; `reliability`, `security`, `a11y`, `perf`, `ux`, and `ui` lenses |
| `docs`     | Diátaxis guides, JSDoc, README, verified against source                                      |
| `deliver`  | Commits, branches, PR bodies, change files; only the named action                            |
| `pipeline` | One run per independent task: ordered stages, approval gates, and one validation            |

Ownership: `review` finds problems and never edits; `build` edits; `deliver` only ships. `plan` writes only `.plan.md`.

## Shared files

- `shared/contract.md`: approval gates, markers, severity, finding format, validation rules, plan file format. Every skill reads it.
- `shared/browser-verification.md`: the procedure for checking UI in a real browser. Used by `build` and `review`.

Each skill carries the shared files it needs as regular copies under `references/` so it can be installed independently. Update the copies when their source changes; `check-skills` verifies they match.

## Install

From a clone, link the skills into your agent folders. This is the install to keep when you are changing klugzeug. `npx skills add -g` may replace these links with a copy of the published branch.

```sh
./install.sh --dry-run                       # show what would be linked
./install.sh                                 # link into ~/.agents/skills and ~/.agents/klugzeug
./install.sh --client ~/.claude/skills       # also link each skill into another client folder
./install.sh --uninstall                     # remove links that point into this repository
```

The installer first runs `scripts/check-skills.mjs` and refuses to link a broken set. It never overwrites a path that is not a link into this repository; it reports the collision.

On a machine that does not have the clone, install the published branch. The skills call each other under `~/.agents/skills`, so select all eight skills and the agents you use. Before installing, check for existing skills with the same names in those agents and back up or resolve any collisions: the CLI can overwrite them without asking.

```sh
npx skills add helmuthdu/klugzeug -g
npx skills update -g plan build test review docs deliver pipeline onboard
npx skills remove helmuthdu/klugzeug -g
```

`update` matches installed skill names, not repository names; check that those names belong to klugzeug before updating. `npx skills update -g` with no names refreshes every global skill on the machine, including ones that are not klugzeug. Removal uses the repo recorded as the source in the lock.

Before relying on a client, confirm that it reads the folder you linked. Cursor reads `~/.agents/skills` directly; Claude Code needs `--client ~/.claude/skills`; other clients are `[VERIFY]`. Clients that discover skills only inside the repository, such as Copilot, need a file inside the repo and will not see the global install.

## Project profile

`onboard` writes a `## Project profile` section into `AGENTS.md` using the canonical **Profile keys** from `shared/contract.md` (commands, test helpers, validation gates, conventions). Each key is a value or `none`. The template is `skills/onboard/references/profile-template.md`; `check-skills` fails when the template omits a key.

Resolution order: the user's request, then the profile (walk up until an `AGENTS.md` contains `## Project profile`), then linked files, then detection from `package.json` and config files, then a question to the user. Subtree rules in nearer `AGENTS.md` files bind their directories. A command that is only guessed is marked `[VERIFY]` and never reported as run.

## Design rules

- One canonical shared contract, with checked copies for installation.
- Each `SKILL.md` is under 110 lines. Checklists and templates live in `references/` and load only when used.
- Descriptions name the trigger words, and skills do not overlap. Reliability, security, accessibility, performance, UX, and UI are lenses of `review`, not separate skills.
- Skills never widen the scope the request sets.
- The contract's smallest-change rule applies to every skill.

## Check

```sh
node scripts/check-skills.mjs
node --test scripts/check-skills.test.mjs
```

Checks frontmatter, name-to-directory match, line budget, and that every referenced file exists.
