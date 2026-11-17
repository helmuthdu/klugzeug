---
name: docs
description: Write or audit project documentation against the code — Diátaxis guides (tutorial, how-to, reference, explanation), JSDoc for public APIs, README, migration notes, and runnable examples — verifying every claim against source. Use when asked to document, write or fix docs, update a README, add an example or recipe, improve JSDoc, or check documentation accuracy.
argument-hint: '<scope path> [quadrant | page | jsdoc | audit] [focus]'
---

# docs

Read `~/.agents/klugzeug/contract.md` and the profile. Source decides what the docs may claim; Diátaxis decides where each claim lives. Audit requests are read-only.

## Classify before writing

Each page belongs to exactly one quadrant. Content that serves two purposes is split, not labelled twice.

Test a doubtful page with the compass: is the content about action or cognition, and does the reader want acquisition or application? Tutorial is action + acquisition; how-to is action + application; reference is cognition + application; explanation is cognition + acquisition.

| Quadrant     | Reader is                                  | Title form               | Contains                                     |
| ------------ | ------------------------------------------ | ------------------------ | -------------------------------------------- |
| Tutorial     | learning; needs a guaranteed first success | "First …" lesson         | one ordered path, no choices                 |
| How-to guide | knows the goal; needs the steps            | "How to …" or imperative | steps for one task; branches allowed         |
| Reference    | looking a fact up while working            | noun "… options"         | facts, signatures, defaults; no steps        |
| Explanation  | wants to understand why                    | topic "About …"          | reasons, context, trade-offs; no procedures  |

A fact taken from a procedure belongs in reference. A reason belongs in explanation. State each fact once in reference and link to it from everywhere else. When **Doc templates** is set, those templates win; otherwise use `references/diataxis.md`.

## Flow

1. Read the page or example, and the source that controls each claim: exports, signatures, defaults, errors, and emitted events.
2. Verify each claim. Anything you cannot verify is `[VERIFY]`, not written as fact.
3. **JSDoc** on each public export: a one-sentence summary; parameters and return value when they are not obvious; thrown errors; one short example for a non-trivial API. Do not restate the type.
4. For an API change, update reference first, then the pages that describe it, then the examples.
5. Run tutorials end to end; they must work for every reader. A tutorial you cannot run is `[VERIFY]`. Run other examples when the profile names a command for them, or type-check them when **Typecheck** is set. Otherwise mark them `[VERIFY]`.
6. When a page is added, removed, or renamed, update navigation and indexes.
7. Run the **Docs** key's validators and build once, after all doc edits.

## Rules

- Do not document behaviour the source does not guarantee.
- Write how-tos from the user's goal, not from the tool's controls. Titles say exactly what the guide shows.
- Reference mirrors the structure of the code and includes an example where it clarifies usage.
- No marketing language, emoji, or performance claims you have not measured.
- Keep the README short: what it is, how to install it, a minimal usage example, and links to deeper docs.
- Every breaking change gets migration notes, linked from the changelog or change entry as the profile requires.
- Never hand-edit generated sections. Change their source and regenerate.

## Output

- Changed pages, each with its quadrant.
- Claims marked `[VERIFY]`.
- Validators and builds run, with results.
- `[DEFERRED]` for pages outside the scope.
