# Concise output (adopted)

Klugzeug uses **concise STE-inspired prose** by default for agent chat and skill **Report** sections. Rules live in [`shared/ste-output.md`](../shared/ste-output.md); the contract requires reading them unless the profile opts out.

## Profile key **Output language**

| Value | Use when |
| --- | --- |
| (omit) or `ste-reports` | Standard — reports, findings, handoff chat |
| `ste-plan` | Also shorten plan **Assessment**, **What**, and **Why** |
| `ste-artifacts` | Also shorten `kz-deliver` commit messages and PR bodies |
| `ste-all` | Also shorten `kz-docs` page body (not package READMEs or tutorial tone) |
| `verbose` | Disable concise rules |

## What we do not apply

- Plan templates, markers, severity prefixes, code citations
- Diátaxis structure, JSDoc types, generated docs
- User-facing package documentation unless **Output language** is `ste-all` and the page is agent-authored reference material

The STE experiment transcripts remain in [`ste-experiment-scorecard.md`](ste-experiment-scorecard.md) for history.