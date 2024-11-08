# Kinds of Errors

An error, or even an `Error` instance, can mean a lot of different things in the context of this testing framework. Throwing errors for failing tests is what we are most familiar with, but it is just one kind of error.

## Interview `Error`s

1. **Interview bugs**: For example, the interview says ALKiln's answer is invalid. The author expected that answer to be valid. ALKiln saves an error message to the report and throws an error to tell cucumber to mark the test as failed. Currently, these logs errors come with the 🤕 icon. When all the tests are done, the test suite will show as failing in the console, the report, and the various logs. In future, ALKiln will use a method like `report.throw()` to save to the various log files with the `error` level and then throw the error to let cucumber know the test failed.
1. **Interview expected errors**: For example, the interview says ALKiln's answer is invalid. The author was testing their interview's field validation rules. The test passes.

## Test file `Error`s

1. **Test file syntax error**: For example, a row in a table in a test file has too many columns. cucumberjs throws an error and no tests are run. ALKiln should show the tests as failed. ALKiln is unable to get the output of that error into a log, but there should be an error in the console.
1. **Test Step typo**: For example, `And I ta p to contcontinue`. cucumberjs will cause this test to fail, giving an "undefined" Step as the reason. The test suite will show as failing in the console, the report, and the various logs.
1. **Test bugs**: For example, a test has old values that need to be updated. The test fails. This will look like an interview bug, as this document describes.

## ALKiln `Error`s

1. **ALKiln un-handled bugs**: For example, we have forgotten to define a variable and none of our tests has yet triggered that code. These are unexpected errors that force processes to abort or force individual tests to fail in uninformative ways. To an author that runs into that error, it looks like their test has failed, but the fault is ours and we need to troubleshoot it. We should make that clear.
1. **ALKiln silent bugs**: For example, a debug log has an object that causes an error when ALKiln tries to turn it into a string. ALKiln should record the failure somewhere, but should avoid throwing it. We can troubleshoot those if we see them and add new internal tests. See decisions docs on when to use which kind of log level.
1. **ALKiln expected errors**: For example, one promise won a `Promise.race()`, so ALKiln aborted the other promises. That causes those aborted promises to error. That is why ALKiln saves the "informational" Error to the debug files and it has a level of "info" or "debug".

## ALKiln's internal tests

1. **ALKiln internal success-handling test failures**: For example, the test fails to fill out radio buttons correctly.
1. **ALKiln internal failure-handling test successes**: For example, we test that the summary report shows a specific log code when an interview fails to load and the log code shows up correctly. The "test" fails - the interview fails to load - but *our* test passes - the right log code was in the summary report.
1. **ALKiln internal failure-handling test failures**: For example, we test that the report shows a specific log code when an interview fails to load, but the log code is missing. The "test" fails and *our* test fails.
