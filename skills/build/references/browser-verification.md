# Browser verification

Use this procedure when a change alters rendered UI, client-side behaviour, or an interaction that tests cannot observe. Skip it for logic covered by tests.

1. **Start**: run **Dev command** for the target the task names (one command per target when the profile lists several) and wait until the URL responds. If it is `none`, mark `[VERIFY]` and stop.
2. **Target**: choose the route or story the task named. List the states to exercise: loading, empty, error, populated, and any state the change adds.
3. **Tool**: use the browser tooling available in this session. If none is available, use **Browser-test command**. If neither exists, mark `[VERIFY]` and list what a person should check.
4. **Checks per state**:
   - renders with no console errors and no uncaught exceptions;
   - no failed requests and no unexpected 4xx or 5xx responses for the flow;
   - works at 375px and 1280px widths;
   - keyboard: Tab reaches each control in a sensible order, focus is visible, Enter and Space activate, Escape closes dialogs;
   - screenshot each state you claim to have checked, and describe what you saw.
5. **Interact through the UI** (clicks, typing, keyboard), not by calling internal functions.
6. **Performance** (when the change can affect loading, rendering, interaction cost, or memory): measure a production build served locally, not the dev server, using the **Build** output. Use the same throttling and page for every run, take at least three runs, and report the median. Record the metrics the `perf` lens names: LCP and CLS from the browser tooling or **Performance measurement command**, and the response time of each interaction you exercised. Retained memory is the heap after repeating the action several times, with the first run discarded. If the tooling cannot record a metric, or the numbers come from the dev server, mark them `[VERIFY]`.
7. **Clean up**: stop the dev server you started. Never run this procedure against a production URL without approval.
8. **Report**: states covered, console and network results, widths tested, performance numbers with their tool, page, throttling, and run count (when measured), and `[VERIFY]` gaps.
