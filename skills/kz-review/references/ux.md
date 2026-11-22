# UX lens (usability)

Judge whether a person can complete their task, quickly and without confusion, in the reviewed UI. Use it for web interfaces, including responsive layouts and touch input. It does not cover native mobile apps.

Prioritise by effect on the user's task. Do not report visual nitpicks (spacing, shade, or radius differences that do not change comprehension or action). Visual design and design-system fidelity are the `ui` lens. Accessibility is covered by the `a11y` lens; report it here only where it breaks the task flow (for example, no visible feedback after an action), and point to `a11y` for a full WCAG pass.

## Evidence

- Name the user, the task, and the screen state for each finding. "The settings page is confusing" is not a finding; "a first-time user cannot tell which of two Save buttons applies" is.
- Prefer a rendered observation (`references/browser-verification.md` next to this SKILL.md): the state at 375px and 1280px widths, with a screenshot described. Otherwise cite the source that produces the state.
- A claim about how real users behave (what they expect, what confuses them) cannot be proven from source. Mark it `[VERIFY]` and say what test or observation would settle it.
- Consistency means consistency with the project: its design tokens, component library, and copy conventions, as **Design system** and **Translation mechanism** name them. Without those, compare only the screens inside the reviewed scope, and do not impose outside conventions.

## Task flow and hierarchy

- The primary action on each screen is obvious, and there is at most one primary action per view.
- The number of steps, fields, and decisions is the minimum for the task. Flag steps that ask for information the system already has or could default.
- Content order follows the order of the user's decisions. What matters most is the most prominent.
- No dead ends: every state offers a way forward or back, including after an error or a completed task.
- The user can tell where they are: the current location is marked in the navigation, and the page title matches the link that led there. Navigation is no deeper than the content needs.
- Terms for the same thing are the same across screens, and they use the user's vocabulary rather than the system's.

## States

Check each state the screen can reach, not only the populated one.

- Loading (does the layout jump when data arrives; is a long wait explained), empty (does it say why and what to do next), error (what failed, what the user can do), partial, success, disabled (is the reason visible).
- Content extremes: very long text, very large lists, a single item, missing optional data.
- Slow or lost network, and a repeated action while one is already pending.

## Interaction and feedback

- Clickable things look clickable, and non-clickable things do not.
- Every action gives visible feedback, close to where the user acted, within a moment of acting.
- Destructive or irreversible actions are confirmed or undoable, and the confirmation names what will be affected. Routine actions are not slowed by confirmations. The narrower rule for legal, financial, or stored-data submissions is the `a11y` lens (SC 3.3.4).
- Hover, focus, active, and disabled states are visually distinct; that check is the `ui` lens.
- User input survives errors, navigation back, and reloads where losing it would cost the user effort.

## Forms and input

- Validation tells the user what to change, next to the field, and does not fire before the user has had a chance to type.
- Input types and on-screen keyboards match the data. Declaring input purpose with `autocomplete` on personal-data fields is the `a11y` lens (SC 1.3.5); do not restate it.
- Defaults and remembered choices remove work that repeats. Asking again for something the user already gave in the same process is the `a11y` lens (SC 3.3.7).

## Responsiveness and input modes

- Layout holds at 375px, a tablet width, and 1280px: no clipped content, no horizontal scroll, no controls hidden with no alternative. Reflow at 320px and at 200% zoom is the `a11y` lens (SC 1.4.10, 1.4.4); do not restate it.
- Primary actions are easy to hit with a finger, comfortably above the minimum. The 24 CSS pixel minimum and its exceptions (spacing, an equivalent control, inline text, a user-agent control, or an essential size) are the `a11y` lens (SC 2.5.8); do not restate them.
- A touch path matches the pointer path. Nothing essential depends on hover, and a drag or multi-point gesture has a visible alternative. Those conformance checks are the `a11y` lens (SC 1.4.13, 2.5.1, 2.5.7).

## Content and wording

- Labels and buttons name the outcome ("Save changes"), not the mechanism ("Submit").
- Error messages say what happened and what to do, with no codes or internal terms alone. Identifying the error in text and offering a known correction are the `a11y` lens (SC 3.3.1, 3.3.3).
- Text is short enough to scan. Instructions appear where they apply, not on a separate help screen.
- Wording is consistent in tone, case, and punctuation. User-facing text goes through the project's translation mechanism, when it has one.

## Different users

- A first-time user can finish the main task without prior knowledge or documentation.
- A frequent user is not slowed by it: shortcuts, bulk actions, remembered filters, and keyboard paths exist for repeated work.
- Features used rarely are reachable but do not compete with the main task.

## Severity

Map to the contract scale by the effect on the user's task.

- **Critical**: the task cannot be completed, or user data is lost without warning.
- **High**: many users fail or are misled, or a primary flow needs a workaround.
- **Medium**: the task succeeds with friction, confusion, or extra effort.
- **Low**: a limited improvement. Report only if it is cheap and source-backed.

## Output

One finding per line in the contract's format. State, in the problem part: the screen and state, the user task it affects, and the impact. Put the recommended change last. Then end with `## Top UX Improvements`: the 3 to 7 changes with the most effect on the task, ranked by impact relative to effort. Each names the screen, the change, and the finding it resolves.
