# Frontend testing reference

## Query priority

Use the first query that works for the element:

1. `getByRole` with an accessible name (`{ name: /save/i }`)
2. `getByLabelText` for form fields
3. `getByText` for non-interactive content
4. `getByTestId` only when none of the above can identify the element

If a role query fails, the element is often unlabelled. That is a finding for `review a11y`, not a reason to switch to test IDs.

## Interaction

- Prefer `userEvent` over `fireEvent`: it fires the full sequence of events a browser fires.
- For keyboard behaviour, use `userEvent.keyboard('{Enter}')` and `userEvent.tab()`, and assert on `document.activeElement`.
- For dialogs, assert focus moves in on open and returns to the trigger on close.

## Async

- Use `findBy*` (or `waitFor` with an assertion inside) for content that appears later. Do not sleep for a fixed time.
- For a loading state, assert the loading indicator, then assert its replacement. Assert the error state by making the mock fail, not by forcing component state.

## Network

- Mock HTTP at the network boundary (MSW or the project's equivalent) so the real query and cache code runs.
- Reset handlers between tests. Assert on the request when the behaviour depends on it (method, query parameters, body).
- Cover the empty, error, and populated responses for each query the component uses.

## Anti-patterns

- Asserting on component state, hook return values, or internal function calls.
- Snapshots of large trees, which hide what changed.
- Mocking the module that the component is meant to exercise.
- Testing styles or class names instead of behaviour.
- Several unrelated expectations in one `it`.
