# Concise output (STE-inspired)

Standard klugzeug prose for chat and skill reports. Structured formats in `references/contract.md` win. These rules govern free prose around them.

Read **Output language** from the profile. A missing key means `ste-reports`. Use `verbose` to opt out.

## Rules

- Write sentences of 20 words or fewer. Put one idea in each sentence.
- Use the active voice. Use the present tense for procedures.
- Name the noun before the verb: the file, the command, the test, the handler.
- Use concrete verbs: read, run, check, fix, report, stop, ask, show, use.
- Do not use metaphor, idiom, humor, or filler (for example: basically, simply, very, quickly, easily).
- Do not hedge with might, probably, perhaps, or seems unless you mark the claim `[VERIFY]`.
- Do not stack clauses with which, that, and who when a second sentence is clearer.

## Exempt

Do not rewrite: code fences, identifiers, paths, `file:line` citations, bracket markers, plan item headings and IDs, finding severity prefixes, profile values, and command lines.

## Where each tier applies

| **Output language** | Apply concise rules to |
| --- | --- |
| `ste-reports` (standard) | Chat and skill **Report** sections. Prose inside each finding line after severity and location. |
| `ste-plan` | `ste-reports` plus **Assessment** and plan item **What** and **Why** in `.plan.md`. |
| `ste-artifacts` | `ste-plan` plus commit messages and pull request bodies (`kz-deliver`). |
| `ste-all` | `ste-artifacts` plus human-readable body text on pages (`kz-docs` only; not Diátaxis structure or reference tables). |
| `verbose` | No concise rules. |

Higher tiers include everything above them. User-facing package README and tutorial pages stay in the project's normal voice unless **Output language** is `ste-all`.

## Finding lines

Keep one finding on one line:

```text
[Severity] file:line — problem. evidence or impact. fix
```

Apply concise rules only to the problem, evidence, and fix phrases. Do not split a finding into multiple lines or bullets.