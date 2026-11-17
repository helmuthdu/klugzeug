# Browser verification

Use this procedure when a change alters rendered UI, client-side behaviour, or an interaction that tests cannot observe. Skip it for logic covered by tests.

1. **Start**: run the dev command from the project profile and wait until the URL responds. If the profile declares no dev command, mark `[VERIFY]` and stop.
2. **Target**: choose the route or story the task named. List the states to exercise: loading, empty, error, populated, and any state the change adds.
3. **Tool**: use the browser tooling available in this session. If none is available, use a Playwright command declared in the profile. If neither exists, mark `[VERIFY]` and list what a person should check.
4. **Checks per state**:
   - renders with no console errors and no uncaught exceptions;
   - no failed requests and no unexpected 4xx or 5xx responses for the flow;
   - works at 375px and 1280px widths;
   - keyboard: Tab reaches each control in a sensible order, focus is visible, Enter and Space activate, Escape closes dialogs;
   - screenshot each state you claim to have checked, and describe what you saw.
5. **Interact through the UI** (clicks, typing, keyboard), not by calling internal functions.
6. **Clean up**: stop the dev server you started. Never run this procedure against a production URL without approval.
7. **Report**: states covered, console and network results, widths tested, and `[VERIFY]` gaps.
