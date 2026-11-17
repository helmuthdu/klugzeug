# Frontend testing reference

Behaviour-first rules for component and DOM tests. The **Query helper**, **Interaction helper**, and **Network helper** keys name the APIs. Use those APIs. This file does not name a library.

## Query priority

Prefer lookups that match what a user can perceive:

1. Role and accessible name.
2. The label of a form control.
3. Visible text.
4. A test id or selector only when nothing accessible identifies the element. Say why.

A failed role lookup often means the element has no accessible name. That is a finding for `review a11y`, not a reason to default to test ids.

When the UI uses shadow DOM or slots, use the helpers named by **Query helper** and **Interaction helper** for crossing those boundaries. Stay inside the component's root; do not query the whole document when a scoped root exists.

## Interaction

- Drive the behaviour the way a user would: the full activation the assertion depends on, not a single synthetic event that skips it.
- A helper that only dispatches one event does not prove click, focus, or form behaviour. Use the project's user-level interaction when that is what the test claims.
- Keyboard: after Tab, Enter, Space, and Escape, assert focus, including `document.activeElement`.
- Dialogs: focus moves in on open and returns to the trigger on close.

## Async

- Wait on a condition or an assertion. No fixed sleeps.
- For loading, assert the indicator, then the success or error that follows a real cause (a failed request, a rejected mock). Do not force internal state.

## Network

- Mock at the HTTP boundary that **Network helper** names, so the real client code runs.
- Reset handlers between tests. Cover the empty, error, and populated responses for each request the UI uses.

## Anti-patterns

- Asserting on private state or framework internals, or on internal function calls.
- Large snapshots that hide what changed.
- Mocking the module under test.
- Asserting styles or class names instead of behaviour.
- Several unrelated expectations in one test.
