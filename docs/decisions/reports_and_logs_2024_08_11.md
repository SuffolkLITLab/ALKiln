# Shape and behavior of the report and log objects

<!-- TODO: turn this into a architecture design doc? -->
<!-- TODO: Rename to just "logs" -->

## Context and scope

We show logs to the user in the console and as test suite artifacts. We have logs we use for development. cucumberjs also has logs we want to include in the above until we are confident we are handling all cases ourselves.

Right now, the system for logging is fractured, scattered, and duplicated. Logs that are not from the report don't get saved anywhere. Some logs only get shown in debug mode in the console, which can be frustrating and unhelpful. We lack verbose output information for tests that authors run in the wild.

This document excludes discussion of report architecture, but it is useful to note that at the moment they are completely separate from logs and yet save to some of the same files, so they influence our current choices.

## Goals

- Make log information persistent and visible
- Add additional meaningful information to logs (e.g. metadata)
- Make sure logs are clear without needing to read the surrounding code
- Unify and clarify log flow
- Make log behavior consistent

## Non/anti-goals

- Disrupt the signals we're giving authors about their tests with the noise of internal ALKiln details
- Create a complex and heavy system to try to abstract absolutely everything
- Let the complexity of the relationship with report behavior too heavily influencing our log design goals

## The actual design

### `Log` internal errors

Logs are informational and not related to the behavior of authors' tests. Because of that, these logs should avoid adding noise to what an author sees. That is, internal warnings or errors should look different than authors' test errors. To help with this:

- All log methods` arguments have default values.
- We use try/catch very aggressively in the `Log` class.

Read more of the thoughts behind this choice in the decision doc on which log level to pick and the design doc on types of errors.

### Purposes of methods

Some of these notes have to do with reports because logs and reports are using some of the same files at the moment and yet are not integrated. We'll write a doc for reports when we integrate reports more fully with logs.

1. `Log`: Messages or errors from wrapping functionality, like setup and takedown messages.
2. `Log`: Test progress (a compact way to see what's happening/happened in each test):

   Test1: .............F--.

   Test 2: ....
3. Report: A pretty report at the end with details about each test. It has sections, like "failed" and "passed", headings, etc.
4. Report: cucumberjs's various console logs.
5. `Log`: Lots of other informational logs for internal development and debugging purposes.

Different logs belong in different places:

- ALKiln always logs items 1, 2, 3, and 4 to the console.
- Ideally save all items in a verbose debug file sequentially as the tests run.
- During the tests, save items 2, 3, and 4 to a running report file sequentially as they come. Include metadata. Suggested filenames: `report_log.txt`/`running_report.txt`/`report_run.txt`. If we have to stop the tests early because of an infinite loop or something, this will at least show the test author some information.
- At the end of the tests, format items 1, 2, 3, and 4 nicely in a file called `report.txt`. This will mostly exclude the metadata.
- When there is a warning-level or error-level log, save 1, 3, 4, and 5 in an unexpected results file too.
- In future, discuss the usefulness of having a debug mode where ALKiln logs all items to the console while the tests are running.

We may also want copies of various files that have different formats for different environments (see docs on the different environments in which ALKiln runs).

- Console logs with colors.
- Plain text versions that exclude those color codes.
- HTML versions to show with, for example ALKilnInThePlayground. Maybe in GitHub as well in the future.

### Anatomy and behavior of logging methods

Most of a `Log`'s logging methods add additional metadata to a log:

1. The level of the log (success, info, warning, error, and custom values)
2. An icon showing the level of a log
3. A log code, like (e.g. ALK0105)
4. Contextual info about where the log originated (e.g. "setup", "takedown", "invalid answer")
9. A timestamp

To be able to show that metadata, most methods will accept custom values for parts of that metadata. Most methods offer:

- Log code
- Contextual info
- The error throwing information

For the debug method, everything other than the timestamp can be customized.

Callers can influence the content and formatting of most parts of the log message. For example, they can call `.warn` to show a warning icon and level metadata. The one exception would usually be the part before the metadata. Customizing that could be useful for things like creating a visual separator before ALKiln starts evaluating the fields of a web page. For that reason, the caller can add a `before` property to the metadata that a `Log` object will add before the metadata.

A `Log` object should be able to throw errors so that it can log metadata and any additional styling and context along with the error. It can also make sure that the error will be an actual `Error` object (as opposed to a string or other object). Otherwise everywhere we needed to throw an error, we would need duplicate handling bad data (like objects with circular references), using `Log` to save to files (etc.), throwing the error, and other possible complications. For that, `Logs` also need to accept this additional information:

- Whether to throw an error
- The error to throw

Those methods should also accept multiple individual log arguments the same way `console.log()` does. This lets the caller include strings separately from objects they want to log, including `Error` objects, so that a `Log` object can handle them safely and style them consistently. We could have required a list of logs instead, but the extra syntax was frustrating.

Right now, the only way we differentiate methods that just store data vs. methods that also log to the console is with documentation. This seems less than ideal. Using the name `record` could be confusing because developers might think they need to log to the console separately from saving the information to debug files.

## APIs

Proposed external methods: `success`, `info`, `warn`, `throw`, `stdout`, `debug`. See the `Log` class and its tests for the most up-to-date API.

<!-- Discuss: better name for `stdout`? -->

## Data storage

- `report.txt` - final pretty output for the user with headings, etc.
- Each Scenario's `report.txt` - pretty output in each test's folder.
- `report_log.txt` (name?) - ugly, but still sparse, giving the user some info about what happened during the tests without overwhelming them.
- `debug_log.txt` (name? `debug`?) - very ugly and full of all the information from everywhere else and more. Useful for internal development and troubleshooting. Includes setup, takedown, etc.
- `temp_unexpected_results_debug_log.txt` - A file containing messages about unexpected behavior, like test warnings and errors, as well as internal ALKiln warnings. We don't output this in our GitHub actions - the file itself is temporary, we just add its contents to the final unexpected results file. All its information exists in the debug file too.
- `unexpected_results.txt` - Logs for failures and other unexpected behavior. It has information about test warnings and errors, as well as internal ALKiln warnings. At first we only save report information there. When the tests finish, we add the contents of the specific debug file that contains only unexpected results.

## Degree of constraint

- Right now we're a bit limited by report functionality staying separate. Other than that, we can design as we want. We should avoid the current behavior of reports substantially influencing our design decisions here. We do have to keep in mind how reports might integrate with this in the future, but we will also need to change the design of the report behavior significantly in the future, so we should keep an open mind.
- We have not yet approached saving logs from GitHub actions, though this should be fairly simple. It may add some complication.
- We have not yet solved getting all logs from the console (e.g. cucumberjs logs).

## Alternatives considered

- Avoid the complexity of storing setup and takedown output in the verbose/debug file. In GitHub, they're in the GitHub console. Locally, we see the results immediately. On the other hand, storing them ourselves lets us look for information in just one place.
- Include GitHub action output in the debug files. Out of scope for the current iteration.
- Catch cucumberjs's actual console output. Out of scope for the current iteration.

### System-context diagram

Current design before integration of reports, GitHub action logs, and other non-ALKiln console logs.

```
## `Log`

console methods -> ._console() -> .debug() -> log to the console
.stdout() -> .debug() -> sometimes write to stdout

.debug() -> debug_log.txt with metadata
         -> sometimes temp_unexpected_results_debug_log.txt with metadata

## `Report`
report and its methods -> report_log.txt (plain text)
                       -> debug_log.txt (plain text)
                       -> sometimes unexpected_results.txt (plain text)
                       -> report summary at end of tests
                          -> final report.txt (plain text summary)
                          -> final console log (summary with console colors)
                       -> individual Scenario reports at end of tests
                          -> final individual report summary file in each Scenario's folder

## takedown
Add temp_unexpected_results_debug_log.txt to the end of  unexpected_results.txt
```

## Cross-cutting concerns

_Security, privacy, observability, etc._

Code that calls `Log` methods should avoid passing sensitive information. A `Log` object doesn't protect against exposing information.

## Related documentation

Decision doc about which log level to use.
Architecture design doc about types of unexpected and expected "errors".
Decision doc about getting and storing logs.
