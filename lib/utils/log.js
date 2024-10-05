const fs = require(`fs`);
const util = require(`node:util`);
const session_vars = require( `./session_vars` );
const time = require(`./time`);
const files = require(`./files`);

// ? 🌈 💡 🔎 🤕 🐛
// Alternatives: 🩹 ❤️‍🩹 🚑
// TODO: return full message so it can be passed to manually
// thrown errors if needed.

/**
 * TODO:
 * - [ ] Discuss: If we prohibit errors from non-throwing logs, this can
 *       probably be a lot more simple.
 * - [x] Store log filename in runtime_config
 * - [x] `types` -> `context`
 * - [x] Remove "cosmetic"/"plain" logs and just work that beauty into the logs themselves
 * - [ ] Save logs from GitHub actions as well
 * - [ ] Capture cucumber ProgressFormatter logs instead of making them ourselves?
 * - [ ] Write user errors and warnings (sent to .console()) to unexpected results file
 * - [ ] Write debug errors and warnings to unexpected results file?
 * - [ ] write tests...?
 * - [ ] Edit the decision doc? Too many individual decisions? Use separate docs instead?
 *    - streams vs. formatter vs. fs.appendFileSync
 *    - general architecture?
 *    - keeping report separate for now
 *    - try/catching everything + collecting errors
 *    - ~~`throw` (non-standard) (throw errors in logs? (bad stack trace) 2 lines everywhere instead?)~~
 *    - `success` (non-standard)
 *    - `before` option and no others? (others can be included in message, but no way to log before the code otherwise.)
 *    - Name "debug" meaning change instead of "verbose"
 *    - Types of errors (design doc?)
 * */
//

class Log {
  /** Handles logging to the console, saving to files and reports,
   *  and throwing errors.
   *
   * Use this to:
   * - Log to the console
   * - Save to the debug log
   * - Throw errors with log codes and other info
   * - Log without new lines
   *
   * What are the different log files:
   * - report is a pretty file that is only complete at the end of all tests
   * - report_log is not pretty, but has the same info as the report in case tests end early
   * - debug_log is very ugly and has notes for developers
   *
   * TODO:
   * - Save to the report and report log
   *
   * @params
   * options { object }
   * options.path { str } - Optional. The path where the final logs
   *  should be stored.
   * options.context { str } - Optional. Info about what's creating
   *  this Log.
   *
   * We're not using console.Console or write streams because we can't
   * control their life cycle in steps.js. We can't tell when to
   * properly flush and end the stream in the case of a sudden failure.
   * */

  /** Architecture(?) notes:
   *
   * Scope: this is a logger of output for the authors and for debugging
   *  for us or for the authors. If the authors' test fails in a way that
   *  we have not yet anticipated and do not yet handle, these logs
   *  might give internal devs enough information to identify how the
   *  tests failed. We can then adjust this framework and the author
   *  can adjust their interview. Same for plain old bugs.
   *
   * Errors in here:
   * Errors - log.throw(): log.throw() errors are for infrastructure
   *  that supports the testing framework. Things like setup and
   *  takedown. Avoid using log.throw() for the tests themselves
   * Errors - informational: This is not really an error. It is
   *  possible to pass an expected Error object into a log without
   *  throwing the error. For example, directly
   *  to `log.debug()`. This is for debugging in case we want to track
   *  down specific info about the error afterwards.
   * Errors - log.debug with level of 'error': We are still considering
   *  using this to visually indicate an error that is relevant to the
   *  user that still doesn't throw anything. For example, when a full
   *  test run has at least one error and thus fails.
   *
   * Errors elsewhere:
   * Errors - test failures: A Log doesn't handle test failures. In
   *  those cases, our framework intentionally throws errors to cause
   *  a cucumber test failure during running tests. Our framework first
   *  tells the Reports object, which saves the output to a file, and
   *  then the framework throws the error for cucumber.
   * Errors - unintentional: When this framework itself unexpectedly
   *  errors, that is a bug. Cucumber or node throws it. If cucumber
   *  throws it, it will incorrectly look like a test failure.
   *
   * How many logs do we instantiate in what context: One script file
   *  only has one log. Different logs might write to the same files.
   *  This is because sometimes different operations sometimes have to
   *  each use a different log object. For example, run_cucumber can't
   *  pass its log instance to the actual cucumber test
   *  runner, so they each need separate logs of their own.
   *
   * File lock: We're not going to worry about file locks. That is,
   *  we're not going to worry about different threads writing to the
   *  same file. JS is single-threaded, though I'm not sure how it chunks
   *  operations. The cucumber runner uses different node processes for
   *  parallel tests (https://github.com/cucumber/cucumber-js/tree/main/docs).
   *  We don't implement parallel tests yet. When we do, we'll figure out
   *  a different abstraction. In the mean time, we hope saving to a
   *  file synchronously will avoid having different threads writing
   *  to the same file. Also, though, these processes should be
   *  happening separately synchronously one after the other
   *  so that should help too.
   *
   *
   * */

  // Filenames
  debug_log_filename = `debug_log.txt`;  // Should always exist
  unexpected_filename = `unexpected_results.txt`;  // Only created if needed
  report_filename = `report.txt`;  // Not fully implemented, but used
  report_log_filename = `report_log.txt`;  // Not fully implemented, but used

  // Error placeholders/defaults
  // TODO: Code smell. Find a useful way to describe these.
  wrong_error = `ALKiln was unable to parse this into an error`;
  // Should never get logged if you use the class as intended, but can be logged
  non_error = `ALK no error given`;

  constructor({ path, context } = {}) {
    // this.id = uuid();

    /** Set or make a directory and tell the user what that path is.
     *  Does not create the files. Some may end up not existing. */
    // Make sure folder exists
    if ( path ) { files.make_artifacts_folder( path ); }
    // In local development and ALKilnInThePlayground, this will
    // mostly be called by the `run` command.
    else { path = files.make_artifacts_folder(); }

    this.path = path;
    session_vars.save_artifacts_path_name( this.path );

    // Add `log` to the context. A Log object is the only thing
    // that should use a `log` context.
    if ( context ) { context = context + ` log`; }
    else { context = `log`; }
    this.info({ code: `ALK0214`, context, },
      `Saving files to "${ this.path }"`
    );
  }

  console( console_opts = {}, ...logs ) {
    /** Log the logs to the console at the right level and with the metadata.
     * Return the start of the message - the part without the logs.
     *
     * Note: `logs` will always be a list this way.
     *
     * Questions:
     * - Allow `logs` to be a string?
     * - Allow `context` to be a space-separated string?
     * - Throw errors? Need to manipulate call stack.
     * - Turn logs that are non-strings into `JSON.stringify`d strings?
     * - Should every log be able to have an error? To keep the
     *   signature consistent.
     *
     * @examples:
     * Log = require('./lib/utils/log.js');
     * log = new Log('_alkiln-');
     *
     * log.console();
     * // * ALK000c LOG [2024-08-16 00:30:39UTC]:
     *
     * log.console({
     *   level: 'info',
     *   icon: '&',
     *   code: 'ALK00t1',
     *   context: 'a test',
     * }, 'test info log');
     *
     * try {
     *   let czar = zoo + 5;
     * } catch ( error ) {
     *   log.console({
     *     level: 'error',
     *     before: '===\n===\n',
     *     icon: 'X'
     *     code: 'ALK00t2'
     *     context: 'err_test'
     *     error: new Error('This is an error'),
     *   }, 'error test log 1', 'error test log 2')
     * }
     * */

    // It's not any skin off our nose if these values are undefined and
    // I think a warning for that would be too much noise. We will
    // be able to figure out what these mean and correct if needed.
    let {  // Defaults
      level = `log`,  // usually defined by the caller, e.g. `.warn()`
      before =  ``,  // sometimes undefined
      icon = `*`,  // usually defined by the caller, e.g. `.warn()`
      code = `ALK000c`,  // usually defined by the caller, e.g. `.warn()`
      context = ``,  // sometimes undefined

      error = this.non_error,  // sometimes undefined. More than just metadata
      do_throw = false,  // sometimes undefined. More than just metadata
    } = console_opts;

    // Should not be able to throw errors
    let formatted = this.debug({ level, before, icon, code, context, error, do_throw }, ...logs );
    let metadata_str = this._format_metadata({ level, icon, code, context });
    error = this._get_Errorable({ maybe_error: error, do_throw, });

    // Throw whatever we can throw
    if ( do_throw ) {
      // WARNING: If someone catches the error we throw, the console
      // logs will be confusing. Don't catch this error.
      try {
        if ( logs && logs.length > 0 ) {
          console.error( before + metadata_str, ...logs );
        } else {
          console.error( before + metadata_str );
        }
      } catch ( pre_throw_error ) {
        this.debug({ code: `ALK0215`, level: `warn`, error: pre_throw_error },
          `Skipped logging metadata before throwing the error`
        );
      }
      if ( error instanceof Error ) {
        throw error;
      } else {
        // non-error messages will get in here if do_throw is `true`
        // Ensure the call stack gets created at this point.
        // TODO: Should we throw the metadata when we throw in here
        // since we don't need to preserve a stack trace?
        throw new Error( error );
      }
    }

    // Avoid using custom-formatted logs and error here.
    // Let the console show them as it wants.
    try {
      // log at the given level if console has that method (`log` by default)
      // If a non-standard level was passed in, like `success`, use `info` by default

      level = `info`;

      // Combine error as the last log if it exists
      let with_error = this._combined_list_of_logs_and_possible_error({ logs, maybe_error: error, do_throw, });
      console[ level ]( before + metadata_str, ...with_error );

    } catch ( console_log_error ) {
      // Fail silently
      this.debug({
        level: `warn`, icon: `🔎`, code: `ALK0211`,
        context: `internal`,
        error: console_log_error,
      }, `Skipped saving a ${ level } message to the debug log`);
    } finally {
      return formatted;
    }
  }

  debug( debug_opts = {}, ...logs ) {
    /** Save in the debug log file and return a string version
     *  of the log. If there are errors, just log them too.
     *  Keep as much info from the caller as possible. Avoid throwing
     *  errors if at all possible while giving the max info possible.
     *  Avoid logging to the visible console.
     *
     * Discuss: Log warning with stack trace?
     * function stackTrace() { return (new Error()).stack; }
     * and
     * https://stackoverflow.com/a/41820537/14144258
     * var mystring=require('util').inspect(error_object);
     *
     * @Examples:
     * Log = require('./lib/utils/log.js')
     * log = new Log({ path: '_alkiln-' })
     * log.debug()
     * // 🐛 ALK000d DEBUG [2024-08-16 00:38:49UTC]:
     *
     * @returns { str } Everything formatted into one string
     * */
    let {
      level=`debug`,
      before = ``,
      icon = `🐛`,
      code = `ALK000d`,
      context = ``,
      error = this.non_error,
      do_throw = false,
    } = debug_opts;

    let formatted = `Formatted log string placeholder`;
    try {
      let logging_errors = [];

      // Should not be able to throw an error
      let metadata_str = this._format_metadata({ level, icon, code, context });
      // Include error as the last log if it exists
      error = this._get_Errorable({ maybe_error: error, do_throw, });
      let with_error = this._combined_list_of_logs_and_possible_error({ logs, maybe_error: error, do_throw, });

      // Get the whole formatted log message
      formatted = `${ metadata_str }No formatted log.`;
      try {
        let stringified = this._stringify_logs({ logs: with_error });
        formatted = `${ before }${ metadata_str }${ stringified }`;
      } catch ( formatted_log_error ) {
        // Consider using `util.inspect()` for the error
        logging_errors.push(`🔎 ALK0212 internal WARNING: Skipped creating full debug log\n${ formatted_log_error.stack }`);
      }

      let fs_append_failed = false;
      try {
        fs.appendFileSync( `${ this.path }/${ this.debug_log_filename }`, `\n` + formatted );
        if ( `warn error`.includes( level ) || error instanceof Error || error !== this.non_error ) {
          this._save_to_unexpected({ text: formatted });
        }
      } catch ( fs_append_error ) {
        fs_append_failed = true;
        // Consider using `util.inspect()` for the error
        logging_errors.push(`🔎 ALK0213 internal WARNING: Could not append to debug log file\n${ fs_append_error.stack }`);
      }

      // Record any errors in the most unobtrusive way possible
      if ( logging_errors.length > 0 ) {
        for ( let logging_error of logging_errors ) {
          if ( fs_append_failed ) {
            console.warn( logging_error );  // Need a spy to test this
          } else {
            fs.appendFileSync( `${ this.path }/${ this.debug_log_filename }`, `\n` + logging_error );
            this._save_to_unexpected({ text: logging_error });
          }
        }
      }
    } catch ( debug_error ) {
      formatted = `🔎 ALK0217 internal debug WARNING: Could not append create a debug log\n${ debug_error.stack }`;
    }

    return formatted;
  }

  _format_metadata( metadata_opts = {} ) {
    /** Format and return the log metadata.
     *  Example: "💡 ALK#### internal INFO [10:24:40 pm UTC]: "
     *
     *  Avoid throwing ANY errors.
     * */
    let {
      level=`log`,
      icon = `?`,
      code = `ALK000m`,
      context = ``,
    } = metadata_opts;

    let metadata_str = `? ALK000m unspecified: `;
    try {
      // For elapsed time, see https://nodejs.org/api/console.html#consoletimelabel
      // Should this metadata use a raw timestamp?

      // Transform the level name if necessary
      let metadata_level = level;
      if ( level === `warn` ) { metadata_level = `warning`; }
      let level_caps = metadata_level.toUpperCase();
      // Ignore items that are empty strings before combining everything
      let metadata_list = [];
      for ( let item of [ icon, code, context, level_caps, `[${ time.log_date() }]` ]) {
        if ( item !== `` ) { metadata_list.push(item); }
      }
      metadata_str = metadata_list.join(` `) + `: `;

    } catch ( metadata_error ) {
      let msg = `Skipped creating metadata`;
      code = `ALK0219`;
      icon = `🔎`;
      context = `internal logs metadata`;
      try {
        this.debug({ icon, level: `warn`, code, context, error: metadata_error }, msg );
      } catch ( metadata_debug_error ) {
        try {
          console.warn( `${ icon } ${ code } ${ context } WARNING [${ Date.now() }]: ${ msg }`, metadata_error.stack, `\n`, metadata_debug_error.stack );
        } catch (ignore_error) {}
      }
    }
    return metadata_str;
  }

  _stringify_logs(str_log_opts = {}) {
    /** Return a string - a formatted version of the list
     *  of logs by stringifying non-strings. An empty list
     *  or no argument is valid. If we get an error, this
     *  should show the whole error, not just its message. */
    // TODO: test if empty string is correctly formatted (included) by _stringify_logs
    // and null, and the other types

    let { logs = [] } = str_log_opts;

    let stringified_logs = ``;
    let prev_line_type = null;

    try {
      for ( let log of logs ) {
        // TODO: Try/catch each of these?
        if ( log === null || [`string`, `number`, `undefined`, `boolean`].includes( typeof(log) )) {

          stringified_logs += this._stringify_inline({ prev_line_type, log });
          prev_line_type = `inline`;

        } else {
          // For objects and errors
          stringified_logs += this._stringify_object({ obj: log });
          prev_line_type = `block`;
        }  // ends typeof log
      }  // Ends for logs
    } catch ( stringify_error ) {
      try {
        // TODO: Should `stringify_error` get recorded even when util.inspect works?
        stringified_logs = util.inspect( logs, { depth: 8, maxArrayLength: null, maxStringLength: null, });
      } catch ( util_error ) {

        if ( stringified_logs ) {
          stringified_logs += `Unable to stringify logs. Got:\n${ stringified_logs }\n${ util_error.stack }\n${ stringify_error.stack }`;
        } else {
          stringified_logs = `Unable to stringify logs.\n${ util_error.stack }\n${ stringify_error.stack }`;
        }
      }

    }

    return stringified_logs;
  }  // Ends Log._stringify_logs()

  _stringify_inline({ prev_line_type, log }) {
    /** Format an inline log. Mostly involves fiddling with
     *  the start of the string. */
    // An inline log's string starts with nothing if it's the first string...
    let start = ``;
    // ...starts after a space if its next to an inline string...
    if ( prev_line_type === `inline` ) { start = ` `; }
    // ...or starts on a new line if it's after a block of text,
    // like an error or object.
    else if ( prev_line_type === `block` ) { start = `\n`; }
    return `${ start }${ log }`;
  }

  _stringify_object({ obj }) {
    /** Try to stringify an object a few different ways. Works for
     *  errors too. */
    try {
      // A block of text (the object) always starts on a new line
      // Try to stringify the object.
      return `\n${ util.inspect( obj, { depth: 8, maxArrayLength: null, maxStringLength: null, } )}`;
    } catch ( outer_error ) {
      // If that fails, see if it has its own way of stringifying
      // TODO: record these errors?
      try {
        return `\n${ obj }`;
      } catch ( inner_error ) {
        // Lastly, give at least some information
        return `\nUnable to log this ${ typeof obj }`;
      }  // ends inner try
    }  // ends outer try
  }

  _combined_list_of_logs_and_possible_error({ logs=[], maybe_error, do_throw }) {
    /** Return a list combining values to be logged if appropriate */
    try {
      // Think of the opposite cases.
      // If we're supposed to throw, keep going no matter what.
      // If maybe_error is not the default value, it should also
      // be included in the logs.
      if ( !do_throw && maybe_error == this.non_error ) {
        return logs;
      }

      let with_error = [...logs];
      if ( maybe_error instanceof Error ) {
        with_error.push( maybe_error.stack );
      } else {
        with_error.push( new Error( maybe_error ).stack );
      }
      return with_error;
    } catch ( combining_error ) {
      return [ ...logs, `Skipped combining logs list with error`, combining_error.stack ];
    }
  }

  _get_Errorable({ maybe_error, do_throw=false }) {
    /** Return either something that can be savely turned into an
     *  error logged if needed. If unable to return anything else,
     *  return a message that the value could not be handled. */

    // Think of the opposite cases.
    // If we're supposed to throw, keep going no matter what.
    // If maybe_error is not the default value, it should also
    // be made safe so it can be logged.
    if ( !do_throw && maybe_error === this.non_error ) { return maybe_error; }

    let error_or_null = maybe_error;
    try {
      if ( maybe_error === undefined ) {
        maybe_error = this.wrong_error;
      } else {

        if ( maybe_error instanceof Error ) {
          error_or_null = maybe_error;
        } else {
          // Deal with circular reference
          try {
            // Possibly trigger a circular reference error
            // (new Error() doesn't get caught)
            let boo = JSON.stringify( maybe_error );
            // If no circular reference, safe to create an error
            error_or_null = maybe_error;

          } catch ( maybe_error_stringify_error ) {

            this.debug({ level: `warn`, code: `ALK221`, context: `internal log`,
              error: maybe_error_stringify_error
            }, `Skipped JSON.stringify()` );

            try {
              let inspected = util.inspect( maybe_error, { depth: 8, maxArrayLength: null, maxStringLength: null, });
              error_or_null = inspected;
            } catch ( maybe_error_inspect_error ) {

              this.debug({ level: `warn`, code: `ALK222`, context: `internal log`,
                error: get_Error_or_null_error
              }, `Skipped inspect` );
              error_or_null = this.wrong_error;

            }  // ends try inspect
          }  // ends try stringify
        }  // ends if is Error

      }  // ends if maybe_error is undefined
    } catch ( get_Error_or_null_error ) {
      this.debug({ level: `warn`, code: `ALK223`, context: `internal log`,
        error: get_Error_or_null_error
      }, `Skipped all normalizing processes` );
      error_or_null = this.wrong_error;
    }

    return error_or_null;
  }

  /** Console logs like those below only happen with setup,
   *  takedown, and run_cucumber, or a few exceptions, like
   *  unexpected behavior that gets in here that we cannot
   *  record any other way. */

  success( success_opts = {}, ...logs ) {
    /** Console log success - log level with success icon. Used
     *  to show a successful run of all tests. Supplement to the
     *  cucumber report. */
    // Discuss: do we want to log some successes as "💡 ... SUCCESS: "?
    // Should we allow callers to override levels and icons?
    let {
      code = `ALK000s`, before = ``, context = ``
    } = success_opts;
    return this.console({
      level: `success`, icon: `🌈`,
      before, code, context,
    }, ...logs);
  }

  info( info_opts = {}, ...logs ) {
    /** Console log info. Used by infrastructure like setup, takedown,
     *  and API interaction for those operations. */
    let {
      code = `ALK000i`, before = ``, context = ``,
    } = info_opts;
    return this.console({
      level: `info`, icon: `💡`,
      before, code, context,
    }, ...logs);
  }

  warn( warning_opts = {}, ...logs ) {
    /** Console log any kind of warning from the framework in operations
     *  before and after running tests. */
    let {
      code = `ALK000w`, before = ``, context = ``
    } = warning_opts;
    return this.console({
      level: `warn`, icon: `🔎`,
      before, code, context,
    }, ...logs);
  }

  throw( throw_opts = {}, ...logs ){
    /** Console log and throw error (not in a test run, but in
     *  the associated actions, like setup, API calls, etc.).
     *  The `error` option is required. */
    let {
      code = `ALK000t`, before = ``, context = ``,
      do_throw = true, error,
    } = throw_opts;

    this.console({
      level: `error`, icon: `🤕`,
      before, code, context, error, do_throw
    }, ...logs);
  }

  // TODO: Add _save_to_debug?

  unexpected() {
    this._save_to_unexpected( arguments );
  }

  _save_to_unexpected({ text = `` } = {}) {
    /** Save to the unexpected results file. Intended for errors and warnings. */
    fs.appendFileSync(`${ this.path }/${ this.unexpected_filename }`, `\n${ text }` );
  }

  /** `stdout` is currently for test progress summary and reports. */

  stdout(stdout_opts = {}, ...logs) {
    /** Prints in the console inline and saves to the debug log
     *  and the report log. Used for progress summary during test runs
     *  and for reports.
     *
     * @params
     * options { obj }
     * options.records_only { bool } - Whether to only save logs
     *   without printing them to the console. E.g. progress
     *   summary characters like those that cucumber is already
     *   printing to the console.
     * logs { strings } - Each argument is a string
     * */
    let {
      records_only = false,
    } = stdout_opts;
    let whole_log = logs.join(` `);

    // Write to the debug and report files
    this._record_stdout(...logs);

    if ( !records_only ) {
      process.stdout.write( whole_log );
    }

    return whole_log;
  }

  _record_stdout(...logs) {
    /** Save stdout output to various debug and report files.
     *
     * @params
     * logs {strings} - Strings to log sent as individual arguments
     * */
    this.debug({ code: `ALK0220`, context: `stdout` }, ...logs);
    let whole_log = logs.join(` `);
    // TODO: ensure this is after the report heading (datetime of test, etc.)
    fs.appendFileSync( `${ this.path }/${ this.report_log_filename }`, whole_log );
    return whole_log;
  }

  clear() {
    /** Empty all files possible without deleting them. */
    try { fs.writeFileSync( `${ this.path }/${ this.debug_log_filename }`, `` ); }
    catch (error) { /* Fail without throwing. Nice to have, not crucial. */ }
    try { fs.writeFileSync( `${ this.path }/${ this.report_log_filename }`, `` ); }
    catch (error) { /* Fail without throwing. Nice to have, not crucial. */ }
    try { fs.writeFileSync( `${ this.path }/${ this.report_filename }`, `` ); }
    catch (error) { /* Fail without throwing. Nice to have, not crucial. */ }
    try { fs.writeFileSync( `${ this.path }/${ this.unexpected_filename }`, `` ); }
    catch (error) { /* Fail without throwing. Nice to have, not crucial. */ }
  }

}  // Ends Log{}

module.exports = Log;
