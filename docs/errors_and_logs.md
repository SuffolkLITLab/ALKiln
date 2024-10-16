# Errors

An `Error` instance can mean a lot of different things in the context of this testing framework. They're not all for an author's test failures.

Authors can see all of ALKiln's outputs. We want to give them the best signal we can about their tests. Messages about test failures should be formatted to get the author's attention. Messages for internal problems that do not impact the tests should be silent and should look nonthreatening. For example, when we have internal non-critical errors, we will avoid the `error` level. For example, failures to save to log files or failures to delete interview sessions. Instead, we will use, at most, the level `warn`. In those messages, we will also avoid using the word "error" (or similar phrases) if possible. For example, instead of "Error when writing to the debug file" we would use "Skipped writing to the debug file".

## Types of `Error`s

1. **Interview bugs**: For example, the interview says ALKiln's answer is invalid. The author expected that answer to be valid. ALKiln saves an error message to the report and throws an error to tell cucumber to mark the test as failed. Currently, these logs errors come with the 🤕 icon. When all the tests are done, the test suite will show as failing in the console, the report, and the various logs. In future, ALKiln will use a method like `report.throw()` to save to the various log files with the `error` level and then throw the error to let cucumber know the test failed.
1. **Interview expected errors**: For example, the interview says ALKiln's answer is invalid. The author was testing their interview's field validation rules. The test passes.
1. **Test file syntax error**: For example, a row in a table in a test file has too many columns. cucumberjs throws an error and no tests are run. ALKiln should show the tests as failed. ALKiln is unable to get the output of that error into a log, but there should be an error in the console.
1. **Test Step typo**: For example, `And I tap to contcontinue`. cucumberjs will cause this test to fail, giving an "undefined" Step as the reason. The test suite will show as failing in the console, the report, and the various logs.
1. **Test bugs**: For example, a test has old values that need to be updated. The test fails. This will look like an interview bug, as this document describes.
1. **ALKiln un-handled bugs**: For example, we have forgotten to define a variable and none of our tests has yet triggered that code. To an author that runs into that error, it looks like their test has failed, but the fault is ours and we need to troubleshoot it.
1. **ALKiln silent bugs**: For example, a debug log has an object that causes an error when ALKiln tries to turn it into a string. The write to the file fails silently and the error gets written to the file instead or, if necessary, a message gets written to the console. Both would use a level of `warn`. The `Error` instance passed in as a `log` here is just for our own information, not to throw. We've worked hard to make sure non-critical Errors thrown by ALKiln's code get caught so authors' tests don't look like they're failing when ALKiln itself is failing in a non-critical way. We can troubleshoot those if we see them and add new internal tests. They should use a level of `warn` at worst. See future docs on when to use which kind of log level.
1. **ALKiln expected errors**: For example, one promise won a race, so ALKiln aborted the other promises. That causes those aborted promises to error. ALKiln saves the "informational" Error to the debug files and it has a level of `info` or `debug`.

<!-- Incomplete. Move the below into a file about logs. -->

<!-- 1. **Wrapper expected errors:** Processes that run before and after tests, like setup, the run handler, and takedown, can fail and throw errors. For example, the author has a typo in their docassemble testing account's authorization for GitHub tests. ALKiln will try to give the author as much information as possible and throw the Error. These will happen before or after the tests have run. It can be hard for authors to tell the difference between these failures and tests failures. We need to find ways to make these situations more clear.
1. **Wrapper ALKiln bugs:** Processes that run before and after tests, like setup, the run handler, and takedown, can also have bugs. Some of those might throw an error either before the tests start or after the tests end. It can be hard for authors to tell the difference between these failures and tests failures. We need to find ways to make these situations more clear. -->

## The `Log` class

`Log` instances need to throw some errors. Others are more informational.

In the Log class:
Errors - log.throw(): log.throw() errors are for infrastructure that supports the testing framework. Things like setup and takedown. Avoid using log.throw() for during tests themselves.

"Errors" - informational: Any `Log` method that takes a list of logs can handle an instance of Error in that list. We can use this data to debug or trace behavior of authors' tests or of ALKiln itself.

Errors - directly using `log.debug` with level of `error`: We are still considering using this to visually indicate an error that is relevant to the user that still doesn't throw anything. For example, when a full test run has at least one error and thus fails.

Errors elsewhere:
Errors - test failures: A Log doesn't handle test failures. In future, the report will. Right now, our framework intentionally throws errors to cause a cucumber test failure during running tests. Our framework first tells the Reports object, which saves the output to a file, and then the framework throws the error for cucumber.
