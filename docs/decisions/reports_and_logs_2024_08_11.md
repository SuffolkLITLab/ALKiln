# Shape and behavior of the report and log objects

## Context and scope

We have reports and logs we show to the user in the console and as artifacts. We have logs we use for development. cucumber also has logs we want to include in the above until we are confident we are handling all cases ourselves.

Right now, the system for logging is fractured and scattered - reports log to the console and save completely separately from other logs. Logs that are not from the report don't get saved anywhere. Some logs only get shown in debug mode, which can be frustrating and unhelpful.

## Goals

Overview:

- Unify the logging and report systems
- Clarify their flow
- Make log information more visible

Details:

- Log objects have statuses, icons, log codes (e.g. ALK0105), contextual info (e.g. `setup`, `takedown`, `invalid answer`), timestamps, descriptive text, and data (like full error traces).
- These are the broad purposes of various logs:
1. Setup and takedown messages.
2. Test progress (a compact way to see what's happening/happened in each test):
    Test1: .............F--
    Test 2: ..
3. A pretty report at the end with details about each test. It has sections, like "failed" and "passed", headings, etc.
4. cucumber's various console logs
5. Lots of other informational logs for internal development and debugging purposes.
I want to do different things with different logs:
- During the tests, always log items 1, 2, 3, and 4 to the console.
- During the tests, save items 2, 3, and 4 to a log as they come with all the info in the log objects - `report_log.txt` maybe. If we have to stop the tests early because of an infinite loop or something, this will at least show some information.
- At the end of the tests, format items 2, 3, and 4, often with only part of the log object info, in a file called `report.txt`.
- During the tests, save all of the items to a `verbose_log.txt` as they happen.
- In debug mode, log all that stuff to the console while the tests are running.
Right now, a few of the logs, like for the test progress (item 2), are printed with `stdout` inline while all others are logged with `console.log`.
- Logs should accept multiple arguments to match console.log/etc. behavior.

Note: The progress logs printed to the console have color codes. We also may want a plain text version without any colors to save in the report log and show in the Playground[^1] "console" and/or a version converted to HTML that does have styles. The latter may be for something easier to digest in a browser and/or to show visually in the Playground version of the tests.

Questions:
- Should `log` throw errors? Otherwise everywhere we need to error, we need to use `log` and `throw`, but I am unable to find a way to remove the current function from an error stack/trace.
- How do we capture "errors" that are more subtle? Keep the word "error" in the "context"/"types" list? For example, expected errors:
  - Invalid answers on the form that are then assessed as valid behavior?
  - `AbortError`s of promises that should indeed have been aborted.
- Should we allow "in-between"s for all parts of the log? All together: pre-everything (new lines, dividers, etc), icon/context/etc., pre-logs, logs (the actual messages to print), pre-data, data, post-data? We can default to nothing for all of those.
- How do we differentiate between methods that log to the console vs. methods that just store data?

[^1]: Don't go down this rabbit hole. Broadly - with the "Playground" version, users see the results as a web page instead of in the GitHub job console or in the artifacts. The users run the tests on their own server. This has to do with the platform we built ALKiln for - [docassemble](https://docassemble.org/). It gives users a faster iteration cycle.

## Non/anti-goals

- Spend a month on this
- Create a complex and heavy system to try to abstract absolutely everything

## The actual design

This design still seems a little complex and potentially too coupled with reports.

### System-context diagram

```
logic code -> logger -> report -----------> console
              ^     |-> console         |-> stdout/progress
  cucumber ---|     |-> running report  |-> final report.txt
                    |-> verbose log
```

```
logic code -> logger ------> report ------> final report.txt
              ^     |-> console
  cucumber ---|     |-> stdout/inline/progress
                    |-> running report
                    |-> verbose log
```

```
              |------------------------------------<|
              v                                     |
logic code -> logger -> report -----------> format prettily
              ^     |-> console
  cucumber ---|     |-> running report
                    |-> verbose log
                    |-> stdout/progress
                    |-> final report.txt
```

### APIs

Everything saves to the "verbose"/"debug" log. Aside from that:

`log.info/warning/success/error` methods log to console. This includes, e.g, setup, takedown which show up in GitHub workflow job logs.

`log.report` saves to the running report then uses a report obj focused on cosmetics that has `.heading/table/header/error/etc` methods. Maybe a `.stdout/inlne` method, which then prints to the console immediately.

`log.verbose/debug` (name?) - Only save to verbose/debug log with log codes, etc.

### Data storage

- `report.txt` - final pretty output for the user with headings, etc.
- Each Scenario's `report.txt` - pretty output in each test's folder.
- `running_report_log.txt` (name?) - ugly, but still sparse, giving the user some info about what happened without overwhelming them.
- `verbose.txt` (name?) - very ugly and full of all the information from everywhere else and more. Useful for internal development and troubleshooting.

### Code and pseudo-code

N/A

### Degree of constraint

I think this can basically be greenfield (designed from scratch). We do have a current system, but I think we can easily convert our existing code to a new system.

## Alternatives considered

- The `report` object saves to the running report and then sends that same information to the `log` object. Also prints the final report. This includes `stdout` logs. `log` remains otherwise the same as described above.
- `log` handles `stdout` logs and leaves them out of the report.
- For report content, `log` would call to `report`, which would do pretty formatting and then hand the format text back to `log` to be saved and/or printed to the console. I'm not sure how `log` could then know what to do with the output - leave out the codes/etc. when it logs to the console and/or saves to the final report.txt.

## Cross-cutting concerns

_Security, privacy, observability, etc._

N/A
