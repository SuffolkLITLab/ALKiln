# Which log levels to pick

## Context and Problem Statement

The log levels we're giving access to in Log are `success` (`info` with a special icon), `info`, `warn`, and `throw` (`error` and throw the error). Sometimes, like in the log file itself, we hard-code the icons and such. Those places have access to other levels, like `error`.

We want to avoid distracting our users by logging errors everywhere, even when an error is what triggered the log. Does that hold true in the debug log? Successes can also be misleading about whether tests have passed or not.

When picking the log level for a log, how do we know which level to choose?

## Considered Options

- Stay as true to technical behavior as possible.
- Stay as clear to users as possible - use levels that will help users pay attention to what affects them.

For example:

`success`:
  - Use whenever anything completes successfully.
  - Only use for success of major operations.
  - Use for every test success.
  - Use for success of all the tests.
`error`:
- Always use `error` when an error happens.
- Use `error` when an unexpected error happens.
- Only use `error` for user-relevant errors.


## Decision Outcome

Distract the user as little as possible everywhere.

`success`:
  - Only log success once for success of all tests.
  - Include the `success` icon in the Scenario "Passed" section of the report.
`throw`:
  - Use this level to throw errors for the user's tests (or our own internal tests).
  - Use this if ALKiln itself needs to abort a test or the test suite.
`error`:
  - Avoid using `error` explicitly. Only the debug logs should use the `error` level, and only to record critical errors that come in with `throw`.
`info`:
  - Log expected errors as `info`. For example, the aborted promises when awaiting navigation.
`warn`:
  - Avoid using the word "error" in warnings if possible.
  - Use `warn` in the console for messages the user should investigate.
  - Use `warn` in the debug log for messages ALKiln devs might investigate if necessary. If the warning comes from non-critical unexpected behavior, do try to be clear about what happened, but also try to avoid using the word "error" if possible. E.g. "Skipped creating metadata for the logs" instead of "Error while creating metadata for the logs".
