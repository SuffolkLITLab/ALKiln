# Which log levels to pick

## Context and Problem Statement

Both authors and internal ALKiln developers see and use console logs and logs in debug files to track down bugs and understand how the tests and ALKiln are working.

<!-- TODO: Should this be about `Log` or about log levels?

`Log` uses the standard log levels `info`, `warn`, `error`, and `log`. It sometimes uses them differently than nodejs's `console` object would. For example, `Log` has a `.throw()` instead of a `.error()`, which stores the error information in the debug files and then throws the error.

`Log` saves and prints these logs with metadata, like icons and date stamps. For example, `Log`'s `.success()` uses the console log level `info` and includes a rainbow icon.

When we need to, we skip using the `Log` class and write straight to the console. -->

We want to give the internal development team descriptive information. We also want to give authors the best signal we can about their tests. How do we balance these? For example, if we show an error icon whenever there's an "informational" error about an aborted promise - an expected event that we cause whenever we use `Promise.race()` - an author could waste a lot of time trying to track down a problem that doesn't exist. Using `Log`'s `.success()` too much could also be confusing - successfully deleting a Project from a server shouldn't look like a passing test.

When picking the log level for a log, how do we know which level to choose?

## Considered Options

- Stay as true to technical behavior as possible and be very literal - throw all errors, log anything successfully completed action with `.success()`.
- Stay as clear to authors as possible - use levels that will help authors pay attention to what affects them.

Example options for `success`:

- Use whenever anything completes successfully.
- Only use for success of major operations.
- Use in the summary report for every test success.
- Use in the summary report for success of the whole test suite.

Example options for `error`:

- Always use `error` when any kind of error happens.
- Use `error` when an unexpected error happens.
- Only use `error` for author-relevant errors.

(See the architecture design document about errors.)


## Decision Outcome

Distract the author as little as possible everywhere.

"success" icon:

- Only actually log to the console and debug files with `log.success()` once for success of all tests.
- Include the success icon at the top of the Scenario "Passed" section of the report.
- Include the success icon in individual Scenario reports for Scenarios that passed.

Throwing an error[^1]:

- Throw an error for a test that fails. cucumberjs will use this error to mark the test as failed.
- Throw an error when ALKiln has to unexpectedly abort a test.
- Throw an error when ALKiln's code has to unexpectedly abort one of its own runtime processes. This includes processes like setup and takedown.

"error" log level:

- Only use the "error" level with errors that the test author should investigate[^1].

"info" log level:

- Log expected errors (errors that are purely informational) with the "info" level. For example, when we wait for navigation, we use a `Promise.race()`. When one promise wins the race, the correct thing to do is to abort the other promises. That causes errors that we catch. We log that *information*[^1] as data about which promise won during that test.

"warn" log level[^1]:

- Use the "warn" log level in the console for messages the test author should investigate.
- Use the "warn" log level in the debug log for messages that could give ALKiln devs clues about a potential problem.
- Use the "warn" log level for messages for internal problems that do not impact the tests (non-critical errors). For example, errors that happen when ALKiln tries to save to log files or errors when ALKiln tries to delete finished interview sessions. These messages should be silent and should look nonthreatening. Do try to be clear about what happened, but also try to avoid using the word "error" if possible. E.g. use "Skipped creating metadata for the logs" instead of "Error while creating metadata for the logs". Include the error along with that log message, but avoid throwing it. ALKiln should only write the message and `Error` to the console if no other output is possible.

[^1]: Read more about this in the documentation about errors.
