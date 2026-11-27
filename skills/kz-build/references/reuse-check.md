# Reuse check

Run this before you add an export, helper, wrapper, or a second way of doing something the repository may already do. Skip it for edits that only change existing code.

1. **Name the concern** in one phrase, for example "map HTTP errors" or "build query keys".
2. **Search** for it: `rg -n` for the likely names, the error type or call it wraps, and the same request or persistence path. Read the nearest sibling modules of the same kind. Siblings share a parent directory or a role, such as two API clients. Reuse evidence already gathered in this task.
3. **Compare the contract**, not names: inputs, return shape, and how errors surface. The same contract means the same job, even when details differ (retry count, message text); list those differences. A different contract, such as one throws and one returns null, is a different job on purpose: reuse the one that matches what you need and say so in the report. If you cannot tell, mark it `[VERIFY]`.
4. **Choose** by the same-job implementations the search found:

| Found | Action |
| --- | --- |
| Nothing | Write the new one in the style of the nearest sibling. |
| One | Reuse it. |
| Two or more, and one is used by at least twice as many sibling modules as the other | Follow that one. Record the other as `[DEFERRED]`. Do not refactor it unless the request says so. |
| Two or more, with no 2:1 split | Stop: `[BLOCKED] choose the canonical <concern>: <A> (<where>) vs <B> (<where>)`. |

5. **After a tie**, end the `[BLOCKED]` message with one line the user can paste under "Project rules that always apply" in AGENTS.md, for example: `- **<Concern>**: use <A>; do not add <B>.` Never write AGENTS.md yourself.
6. **Report** one line per concern: `Reuse check: <concern> — reused <X> | new because <Y> | blocked`.

Do not report formatting or anything the linter handles.
