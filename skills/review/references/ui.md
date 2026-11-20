# UI lens (visual design and design-system fidelity)

Judge whether the interface looks coherent and finished, and whether it uses the project's design system as intended. Use it for web interfaces, including responsive layouts and themes. It does not cover native mobile apps.

A style preference alone is never a finding. Every finding names the reference it departs from. Task flow and usability are the `ux` lens. Contrast ratios, focus visibility, and motion requirements are the `a11y` lens; point to the SC there and do not restate it. Rendering cost is the `perf` lens.

## Reference, strongest first

Before judging, name the product's purpose, audience, and design language, taken from the README, the profile, or the screens themselves, and judge the design against that. Recommend a different colour, font, layout, or animation only when the current one conflicts with one of these references.

1. **The project's design system**: design tokens, the component library, and any design guidelines named by **Design system**. A departure from these is a finding at its full severity.
2. **The reviewed screens' own patterns**: when **Design system** is `none`, compare against what the screens in scope already repeat (the spacing steps, type sizes, colours, and components used most). Name the repeated pattern and where it appears.
3. **General visual-design principles**: only when neither of the above settles it. Report as `Low` when source-backed, otherwise `[VERIFY]`. Do not impose an outside design system.

## Evidence

- Prefer a rendered observation (`references/browser-verification.md` next to this SKILL.md): each claimed state at 375px and 1280px, and in each theme the project ships, with the screenshot described. Most visual problems cannot be seen from source.
- Source alone is enough for a value that bypasses a token or a component the system provides. Cite the line and the token or component that should have been used.
- A judgment about how a screen reads (too dense, unclear emphasis) without a rendered observation is `[VERIFY]`.

## Design-system fidelity

- Literal values where a token exists: colours, spacing, font sizes and weights, radii, shadows, z-index, durations, and breakpoints.
- A one-off component, or a restyled copy of a library component, where the library already provides it or a variant of it.
- Overrides that fight the component: forced styles, `!important`, or selectors reaching into a component's internals.
- A variant or size used against the system's guidance, such as two primary-style buttons in one group.
- Icons from more than one set, or at sizes and stroke weights the system does not use.

## Hierarchy and layout

- The most important element on each screen carries the most visual weight, through size, weight, colour, or position. Nothing secondary competes with it.
- Related items are grouped by proximity, and unrelated ones separated. Spacing between groups is larger than spacing within them.
- Elements align to a shared grid or edge. Misalignment that is visible at either width is a finding; sub-pixel differences are not.
- Density suits the content: no wall of equal-weight items, and no large empty regions with no purpose.

## Typography

- Sizes and weights come from the type scale, with few enough steps that each one signals a level.
- Body text line length stays readable at 1280px (roughly 45 to 90 characters), and line height suits the size.
- Long words, long names, and translated strings wrap or truncate deliberately, with the full text reachable when truncated.

## Colour and theming

- Colour has a consistent meaning: one colour for primary actions, one for danger, one for success, used the same way across screens.
- Every theme the project ships (light, dark, high-contrast) renders each state. Look for hard-coded colours that ignore the theme, invisible borders, and images or icons that disappear on one background. Contrast ratios are the `a11y` lens (SC 1.4.3, 1.4.11).

## Component states

- Hover, focus, active, selected, disabled, and loading states exist and are visually distinct from each other and from the resting state. Focus visibility is the `a11y` lens (SC 2.4.7).
- The same state looks the same on every component that has it.
- Loading placeholders match the size and shape of the content they stand in for.

## Motion

- Transitions use the system's durations and easing, and the same kind of change animates the same way everywhere.
- Motion explains a change (where something came from or went). Decorative motion that delays the user is a finding. Reduced-motion handling is the `a11y` lens.

## Severity

Map to the contract scale by the effect on how the interface reads and on the design system's integrity.

- **Critical**: content or controls are invisible or unreadable in a shipped theme or width.
- **High**: the visual hierarchy points the user at the wrong element, or a pattern repeats a design-system departure across many screens.
- **Medium**: a visible inconsistency or token bypass with bounded reach.
- **Low**: a source-backed polish item, or a general-principle finding.

## Output

One finding per line in the contract's format. State, in the problem part: the screen, the state, the width or theme, and the reference the finding departs from. Put the recommended change last. Then end with `## Top UI Improvements`: the 3 to 7 changes with the most effect on how the interface reads, ranked by impact relative to effort. Each names the screen, the change, and the finding it resolves.
