const fs = require(`fs`);
const util = require(`node:util`);
const session_vars = require( `./session_vars` );
const time = require(`./time`);
const files = require(`./files`);

// ? 🌈 💡 🔎 🤕 🐛
// Alternatives: 🩹 ❤️‍🩹 🚑

/**
 * TODO:
 * - [x] Discuss: If we prohibit errors from non-throwing logs, this can
 *   probably be a lot more simple.
 * - [x] Store log filename in runtime_config
 * - [x] `types` -> `context`
 * - [x] Remove "cosmetic"/"plain" logs and just work that beauty into the logs themselves
 * - [x] Write user errors and warnings (sent to ._console()) to unexpected results file
 * - [x] Write debug errors and warnings to unexpected results file?
 * - [x] write tests
 * - [ ] Edit the decision doc? Too many individual decisions? Use separate docs instead?
 *    - [ ] console/file streams vs. cucumber formatter vs. fs.appendFileSync
 *    - [ ] general architecture?
 *    - [ ] keeping report separate for now (can just be an issue to integrate)
 *    - [ ] try/catching everything + collecting errors
 *    - [ ] `throw` (non-standard) (throws errors in logs? ~~(bad stack trace)~~ 2 lines everywhere instead? <- what did this mean?)
 *      The stack trace is created where the Error is created, so it's up to the
 *      caller. It's true there is no `console.throw()`. Explain why it exists.
 *    - [ ] `success` (non-standard)
 *    - [ ] Name "debug" meaning change instead of switching to "verbose"
 *    - [ ] Types of errors (design doc?)
 *
 * Future issues:
 * - [ ] Save logs from GitHub actions as well? Users can download them themselves, but this
 *    might not be clear to them
 * - [ ] Capture cucumber ProgressFormatter logs instead of making them ourselves?
 *
 * Rejected (decision doc?):
 * - [-] Discuss: ~~Insert periods between inline logs?~~ Would prefer they have
 *   their own punctuation.
 * Rejected (no doc needed):
 * - [-] ~~Explain why there's only a `before` option and no others? (others can
 *   be included in message, but no way to log before the code otherwise.)~~
 *   Don't think anyone will really ask this. If they do, we can add this doc.
 *
 *
 * TODO: In console/file streams doc, document that we're not
 *  using console.Console or write streams because we can't
 *  control their life cycle in steps.js. We can't tell when to
 *  properly flush and end the stream in the case of a sudden failure.
 * */

class Log {
  /** This class includes methods to save meaningful messages with additional
   *   metadata to the debug files. Some methods show these messages to a test's
   *   author. The Log class includes `. throw()`, for throwing errors with
   *   meaningful information. These outputs let both us and authors debug their
   *   interviews, their tests, and this framework's code.
   *
   * Log tries to catch and just save any of its own errors to avoid throwing
   *   them. That way, authors don't have to deal with them. See the docs about
   *   errors.
   *
   * In preparation for integrating with the test report outputs, it also logs
   *   to the console without new lines (process.write).
   *
   * The different log files:
   * - debug_log.txt contains detailed info for internal debugging.
   * - unexpected_results.txt contains detailed messages only about warnings and
   *   failures. It will only exist if an unexpected result happens.
   * - To integrate:
   *    - report.txt is a pretty file that is only complete at the end of all
   *      tests.
   *    - report_log.txt is not formatted nicely. It saves the same info as the
   *      report while tests are running in case tests end early.
   *    - TODO: Consider a separate report file for just report error messages.
   *
   * TODO: integrate reports
   * */

  /** Architecture(?) notes:
   *
   * Flow for logs to the console (during setup/takedown/etc):
   * .info/success -> ._console -> .debug saves to debug log -> ._console logs to the console. Returns string of logs.
   * .warn -> ._console -> .debug saves to debug and unexpected results logs -> ._console logs to the console. Returns string of logs.
   * .throw -> ._console -> .debug saves to debug and unexpected results logs -> ._console throws the error, no return value
   * Flow for debug logs during full test run and during setup/takedown/etc:
   * .debug with no log level -> saves to debug log. Returns string of logs.
   * .debug with warn or error level -> saves to debug and unexpected results logs. Returns string of logs.
   * .stdout -> .stdout sometimes logs to the console (with no new line) -> .debug saves to debug log. .stdout returns the combined string of the logs it was given.
   *
   * Scope: this is a logger of output for the authors and for debugging for us
   *  or for the authors. If the authors' test fails in a way that we have not
   *  yet anticipated and do not yet handle, these logs might give internal devs
   *  enough information to identify how the tests failed. We can then adjust
   *  this framework and the author can adjust their interview. Same for plain
   *  old bugs.
   *  1. Log (to the console) info during proccesses that wrap test runs - setup
   *     takedown, etc., for the authors and our team. Also, throw relevant
   *     errors. These can be .success, .info, .warn, .throw.
   *  √ 2. All of them: Save debugging information from start to finish for us
   *     to
   *     help authors and discover our own bugs. We can give them levels too,
   *     like `warning`. We assume authors will look at this too, so we try to
   *     use levels that will be useful to them as well. For example, we only
   *     use the `error` level in debug when the failure is something that the
   *     authors can affect. For example , we will avoid `error` for failures to
   *     save to log files or failures to delete interview sessions. Instead, we
   *     will use `warn`.
   *  √ 3. In future , integrated with report and report log, that shows
   *     information to the user about their test run.
   *  √ 4. Avoid throwing Log's own errors. Those should be stored in debug
   *     files.
   *
   * Where should these things go?
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

  // Debug filenames
  debug_log_filename = `debug_log.txt`;  // Should always exist
  unexpected_filename = `unexpected_results.txt`;  // Only created if needed
  report_log_filename = `report_log.txt`;  // Not fully implemented, but used
  // Regular report filename
  report_filename = `report.txt`;  // Not fully implemented, but used

  constructor({ path, context } = {}) {
    /** Set or make a directory for logs. Does not create any files and some,
     *  like unexpected_results.txt, may end up not existing.
     *
     *
     * @param { object } options
     * @param { str } options.path - Optional. The directory where it should
     *    store the final logs.
     * @param { str } options.context - Optional. Info about what's creating
     *    this Log. For example, "setup"
     *
     * @returns { Log }
     *
     * @Examples:
     * Log = require("./lib/utils/log.js");
     * log = new Log({ path: "_alkiln-123", context: "setup" });
     * */

    // Make sure folder exists
    // GitHub actions will pass in a path
    if ( path ) { files.make_artifacts_folder( path ); }
    // ALKilnInThePlayground will be starting from scratch
    else { path = files.make_artifacts_folder(); }

    this.path = path;
    session_vars.save_artifacts_path_name( this.path );

    // Add `log` to the context and tell the author what the path is
    if ( context ) { context = context + ` log`; }
    else { context = `log`; }
    this.info({ code: `ALK0214`, context, },
      `Saving files to "${ this.path }"`
    );
  }

  _console( console_opts = {}, ...logs ) {
  /** `_console` should be called internally by other methods of Log. We use it
   *  in functionality that wraps around test runs, specifically setup,
   *  takedown, run_cucumber (before and after running the tests), and API calls
   *  that interact with the server at those times. It writes to the console at
   *  different levels and throws errors. If it's not throwing a given error, it
   *  returns the combined metadata and the logs as a formatted string.
   *
   * The `_console` method will:
   *  1. Save the data to files with `log.debug()`
   *  2. If `do_throw` is true, write data to the console and throw the error
   *  3. Otherwise, write data to the console at the right level
   *  4. Return a formatted string of the metadata and the given data
   *
   * Summary: debug(), throw (sometimes), write, return
   *
   * @param { obj } console_opts - Required. Metadata and functional flags and
   *     data
   * @param { success|info|warn|error } console_opts.level - Required. The log
   *     level. Functional and metadata. Defined by the internal caller.
   * @param { str } console_opts.before - Optional. Text to add before the
   *     metadata of the log. Metadata. Default "".
   * @param { str } console_opts.icon - Required. Unicode char put at the start
   *     of metadata. Makes the level more easy to see quickly. Defined by the
   *     internal caller.
   * @param { str } console_opts.code - Required. Unique consecutive log id with
   *     the format ALK####. Defined by the original caller.
   * @param { str } console_opts.context - Optional. Info about the context
   *     where the log was called. Metadata. Examples: "setup", "run",
   *     "takedown". Default "". Defined by the original caller.
   * @param { Error|any } console_opts.error - Optional. Only include if
   *     `do_throw`  is true. Otherwise, `error` must be `undefined`. The error
   *     or data to throw if `do_throw` is `true`. Before that throw, `_console`
   *     will write the before, metadata, and logs. Try to use an actual
   *     instance of  Error. Otherwise, the stack trace will include this
   *     function, which is confusing. Avoid that. Default `undefined`. Defined
   *     by the original caller.
   * @param { bool } console_opts.do_throw - Optional. If `true` caller wants to
   *     throw an error error. Default `false`. Defined by the original caller.
   * @param { ...any } logs - Optional. The logs to write to the console. Joined
   *     by " " or "\n" depending on the type of the log. Default `undefined`.
   *     Defined by the original caller.
   *
   * @returns { str } Formatted metadata, logs, and, if given, the error.
   *
   * @Examples
   * // The examples use invalid log codes to make log code checking easier.
   *
   * log._console();
   * // * ALK000c LOG [2024-08-16 00:30:39UTC]:
   *
   * log._console({
   *   level: "info",
   *   icon: "&",
   *   code: "ALK00d1",
   *   context: "demo",
   * }, "demo log", "demo log 2");
   * // & ALK00d1 demo INFO [2024-08-16 00:30:39UTC]: demo log demo log 2
   *
   * // Logged in the console, but not returned
   * try {
   *   let causes_error = undefined_value + 5;
   * } catch ( demo_error ) {
   *   log._console({
   *     level: "error",
   *     before: "===\n===\n",
   *     icon: "X"
   *     code: "ALK00d2"
   *     context: "err_demo"
   *     error: new Error("This is an error"),
   *     do_throw: true,
   *   }, "error demo log", { demo: "obj" } );
   * }
   * // ===
   * // ===
   * // X ALK00d2 err_demo ERROR [2024-08-16 00:30:39UTC]: error demo log
   * // {
   * //   demo: "obj"
   * // }
   * // Error: This is an error
   * // <the stack trace>
   *
   * For more examples, see the tests.
   * */

    // It's not any skin off our nose if these values are undefined and I think
    // a warning for that would be too much noise. We will be able to figure out
    // what these mean and correct if needed.
    let {  // Defaults
      // Metadata
      level = `log`,  // Usually defined by the internal caller, e.g. `.warn()`
      before =  ``,  // Sometimes undefined
      icon = `*`,  // Usually defined by the internal caller, e.g. `.warn()`
      code = `ALK000c`,  // Usually defined by the original caller
      context = ``,  // Sometimes undefined
      // Error functionality
      error,  // Sometimes undefined
      do_throw = false,  // Sometimes undefined
    } = console_opts;

    // Should not be able to throw errors
    let formatted = this.debug({ level, before, icon, code, context, error, do_throw }, ...logs );
    let metadata_str = this._format_metadata({ level, icon, code, context });
    error = this._get_Errorable({ maybe_error: error, do_throw, });

    // Throw whatever we can throw
    if ( do_throw ) {
      // WARNING: If someone catches the error we throw, the console logs that
      // get logged here before catching will be confusing.
      try {
        if ( logs && logs.length > 0 ) {
          console.error( before + metadata_str, ...logs );
        } else {
          console.error( before + metadata_str );
        }
      } catch ( pre_throw_error ) {
        this.debug({
          code: `ALK0215`, level: `warn`, context: `internal log`,
        }, `Skipped logging metadata before throwing the error`, pre_throw_error );
      }
      if ( error instanceof Error ) {
        throw error;
      } else {
        // non-error messages will get in here if do_throw is `true` Ensure the
        // call stack gets created at this point.
        // TODO: Should we throw the metadata when we throw in here since we
        // don't need to preserve a stack trace?
        throw new Error( error );
      }
    }

    // Avoid using custom-formatted logs and error here.
    // Let the console show them as it wants.
    try {
      // log at the given level if console has that method (`log` by default).
      // If a non-standard level was passed in, like `success`, use `info` by
      // default.
      if ( !console[ level ]) { level = `info`; }
      // Discuss: nothing tries to make these logs safe (in case of circular
      // reference). Is saving with `.debug()` sufficient to get us the info we
      // crave?
      console[ level ]( before + metadata_str, ...logs );

    } catch ( console_log_error ) {
      // Fail silently
      this.debug({
        level: `warn`, icon: `🔎`, code: `ALK0211`, context: `internal log`,
      }, `Skipped saving a ${ level } message to the debug log`, console_log_error );
    } finally {
      return formatted;
    }
  }

  debug( debug_opts = {}, ...logs ) {
    /** Saves metadata, error, and logs in the debug and unexpected results
     *  files and returns a formatted string version of the log. Every log
     *  should come through here. Avoids throwing internal errors while giving
     *  the max info possible. Avoids writing to
     *  the visible console.
     *
     * Always includes the log's metadata. Always saves on a new line. Tries to
     *  look as similar as possible to what would get written to the console.
     *
     * Basically, has the same signature as `_console()`, but saves to files
     *  instead of writing to the console.
     *
     * @params - Similar to `._console()`, except we expect to use `.debug()`
     *     directly as well as internally, while we expect to only use
     *     `._console()` internally.
     * @returns { str } Same as `._console()`
     *
     * Discuss: Log warnings with stack trace? function stackTrace() { return
     * (new Error()).stack; } and https://stackoverflow.com/a/41820537/14144258
     * var mystring=require("util").inspect(error_object);
     *
     * @Examples
     * Log = require("./lib/utils/log.js")
     * log = new Log({ path: "_alkiln-" })
     * log.debug()
     * // 🐛 ALK000d DEBUG [2024-08-16 00:38:49UTC]:
     * */
    let {
      level= `debug`,
      before = ``,
      icon = `🐛`,
      code = `ALK000d`,
      context = ``,
      error,  // Sometimes undefined
      do_throw = false,
    } = debug_opts;

    let formatted = `Formatted log string placeholder`;
    try {

      if ( !do_throw && error !== undefined ) {
        this.debug({
          code: `ALK0223`, level: `warn`, context: `internal log`,
        }, `Only logs that throw should give a value to \`error\`. Logs will ignore the value` );
      }

      let logging_errors_msgs = [];

      let metadata_str = this._format_metadata({ level, icon, code, context });

      // Include error as the last log if it exists
      error = this._get_Errorable({ maybe_error: error, do_throw, });
      let with_error = this._combine_logs_and_possible_error({ logs, maybe_error: error, do_throw, });

      // Get the whole formatted log message
      formatted = `${ metadata_str }No formatted log.`;
      try {
        let stringified = this._stringify_logs( ...with_error );
        // Question: Does this double log the error in the console?
        // Answer: an actual error will be thrown, but with `logs` logged to the
        // console. `formatted` won't be logged there, just returned. We can't
        // test this without a spy
        formatted = `${ before }${ metadata_str }${ stringified }`;
      } catch ( formatted_log_error ) {
        logging_errors_msgs.push(`🔎 ALK0212 internal WARNING [${ Date.now() }]: Skipped formatting debug logs`);
        logging_errors_msgs.push( formatted_log_error.stack );
      }

      let fs_append_failed = false;
      try {
        fs.appendFileSync( `${ this.path }/${ this.debug_log_filename }`, `\n` + formatted );
        if ( `warn error`.includes( level ) || error instanceof Error ) {
          this._save_to_unexpected({ text: formatted });
        }
      } catch ( fs_append_error ) {
        fs_append_failed = true;
        logging_errors_msgs.push(`🔎 ALK0213 internal WARNING [${ Date.now() }]: Skipped appending to debug files`);
        logging_errors_msgs.push( fs_append_error.stack );
      }

      // Record any errors in the most unobtrusive way possible
      if ( logging_errors_msgs.length > 0 ) {
        for ( let logging_error_msg of logging_errors_msgs ) {
          if ( fs_append_failed ) {
            console.warn( logging_error_msg );  // TODO: Need a spy to test this
          } else {
            fs.appendFileSync( `${ this.path }/${ this.debug_log_filename }`, `\n` + logging_error_msg );
            this._save_to_unexpected({ text: logging_error_msg });
          }
        }
      }
    } catch ( debug_error ) {
      formatted = `🔎 ALK0217 internal debug WARNING [${ Date.now() }]: Skipped log.debug()\n${ debug_error.stack }`;
    }

    return formatted;
  }

  _format_metadata( metadata_opts = {} ) {
    /** Formats and returns the log's metadata. Catch ANY error.
     *
     * @param { obj } metadata_opts - Required. Custom options for metadata
     * @param { str } metadata_opts.level - Required. Level of the log (info,
     *     warn, etc).
     * @param { str } metadata_opts.icon - Required. Icon that makes the level
     *     of the log more visible.
     * @param { str } metadata_opts.code - Required. The unique id of the log.
     * @param { str } metadata_opts.context - Optional. Default is `""`. More
     *     context about the caller. For example, "setup" or "takedown".
     *
     * @returns { str } The log's metadata.
     *
     * @Examples
     * // Quotes are to make the surrounding white space more clear
     * log._format_metadata({
     *   level: "fax",
     *   icon: "%",
     *   code: "ALK00d7",
     *   context: "demo"
     * });
     * // "% ALK00d7 demo FAX [2024-08-16 00:30:39UTC]: "
     * */
    let {
      level = `log`,
      icon = `?`,
      code = `ALK000m`,
      context = ``,
    } = metadata_opts;

    let metadata_str = `? ALK000m unspecified: `;
    try {
      // For elapsed time, see
      // https://nodejs.org/api/console.html#consoletimelabel
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
      context = `internal log metadata`;
      try {
        this.debug({
          icon, level: `warn`, code, context,
        }, msg, metadata_error );
      } catch ( metadata_debug_error ) {
        try {
          console.warn( `${ icon } ${ code } ${ context } WARNING [${ Date.now() }]: ${ msg }`, metadata_error.stack, `\n`, metadata_debug_error.stack );
        } catch (ignore_error) {}
      }
    }
    return metadata_str;
  }

  _stringify_logs(...logs) {
    /** Returns a string of the combined and formatted version of the list of
     *  logs by stringifying non-strings and joining all lots with separators.
     *  An error will show its full stack. A bit different than `console.log()`.
     *
     * @param { ...str } - Optional. Default is `""`. Logs to combine.
     *
     * @returns { str } Combined and formatted logs.
     *
     * @Examples
     * log._stringify_logs("apples", "oranges", { obj_log: "bananas" }, "bears");
     * // apples oranges
     * // { obj_log: 'bananas' }
     * // bears
     * */

    let stringified_logs = ``;
    let prev_line_type = null;

    try {
      for ( let log of logs ) {
        // Consider refactor:
        // let start = _start_of_stringified_log({ prev_type, log })
        // stringified_logs = start + inspect(...) or start + _get_safe_val() or ???

        // null and non-objects
        if ( log === null || [`string`, `number`, `undefined`, `boolean`].includes( typeof(log) )) {
        // if ( log === null || typeof log !== "object" ) {

          stringified_logs += this._stringify_inline({ prev_line_type, log });
          prev_line_type = `inline`;

        } else {
          // Objects, including errors
          stringified_logs += this._stringify_object({ obj: log });
          prev_line_type = `block`;
        }  // ends typeof log
      }  // Ends for logs
    } catch ( stringify_error ) {

      try {
        // Discuss: Should `stringify_error` get recorded even when util.inspect works?
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
    /** Formats the start of an inline log based on the previous log and returns
     *  that combined string.
     *
     * @param { "inline"|"block"|any } prev_line_type - Required. The type of
     *     the previous log.
     * @param { null|non-obj } log - Required. The log.
     *
     * @returns { str } The formatted log.
     *
     * @Examples
     * // Quotes are to make the surrounding white space more clear
     * log._stringify_inline({ prev_line_type: null, log: "apples" });
     * // "apples"
     * log._stringify_inline({ prev_line_type: 'inline', log: "apples" });
     * // " apples"
     * log._stringify_inline({ prev_line_type: 'block', log: "apples" });
     * //
     * // apples
     * */
    // An inline log's string starts with nothing if it's the first string...
    let start = ``;
    // ...starts after a space if its next to an inline string...
    if ( prev_line_type === `inline` ) { start = ` `; }
    // ...or starts on a new line if it's after a block of text, like an error
    // or object.
    else if ( prev_line_type === `block` ) { start = `\n`; }
    return `${ start }${ log }`;
  }

  _stringify_object({ obj }) {
    /** Return a string - either the object as a string or a default value with
     *  a "block"-type separator at the start. Can handle circular references.
     *  Catch ANY error.
     *
     * @param { obj } - Required. The object to format.
     *
     * @returns { obj } The obj as a string plus a separator
     *
     * @Examples
     * // Quotes are to make the surrounding white space more clear
     * log._stringify_object({ obj: { obj_log: "bananas" } });
     * //
     * // { obj_log: 'bananas' }
     * */
    try {
      // Try to stringify the object.
      return `\n${ util.inspect( obj, { depth: 8, maxArrayLength: null, maxStringLength: null, } )}`;

    // Discuss: record these errors?
    } catch ( outer_error ) {
      // If that fails, see if it has its own way of stringifying
      try {
        return `\n${ obj }`;
      } catch ( inner_error ) {
        // If everything else fails, give at least some information
        return `\nUnable to log this ${ typeof obj }`;
      }  // ends inner try
    }  // ends outer try
  }

  /** Note: Why both `_combine_logs_and_possible_error` and `_get_Errorable`:
   *
   * We are trying to keep our stack trace for errors _we_ have to create as
   *    short as possible in `._console()`. This means potentially making a new
   *    Error in 2 separate places. In `._console()`, we want it in the method
   *    itself. The stack from `.debug()` is not as important so we can break it
   *    out. We use `._combine_...` for `.debug()`. On the other hand,
   *    `_get_Errorable()` just makes sure a value will be safe if it needs to
   *    be called in `new Error()`. Both `._console()` and `.debug()` use it so
   *    that `._console()` doesn't have to do it inline in the same place that
   *    it throws the error.
   *
   * TODO: This is Error business is confusing. Consider splitting off a
   * function that just ensures the error for `.debug()`. That might be more
   * clear. Or maybe use WET code to do separate things for `._console()` and
   * `.debug()`. Or some other abstraction !!!
   * - Include or exclude `error`
   * - Make safe or undefined
   * - Ensure instance of Error
   *  */

  _combine_logs_and_possible_error({ logs=[], do_throw=false, maybe_error }) {
    /** Returns a list of combined values to be logged or a default value. If
     *  `maybe_error` needs to be an error, ensure it is. `undefined` is a valid
     *  value. Catch ANY internal errors.
     *
     * @param { array } logs - Required. List of logs.
     * @param { bool } do_throw - Optional. Default is `false`. If `true` caller
     *     wants to throw an error.
     * @param { Error|undefined } maybe_error - Optional. Default is
     *     `undefined`. A value that might be. turned into an Error and is
     *     definitely _safe_ to turn into an Error. For example, no circular
     *     references.
     *
     * @returns { array } List of all values that should be logged.
     * */
    try {

      // If we're not supposed to throw, we already gave a warning that there
      // should be no value for error. Here, we make sure it gets no value.
      if ( !do_throw ) { return logs; }

      let with_error = [...logs];
      if ( maybe_error instanceof Error ) {
        with_error.push( maybe_error );
      } else {
        // The stack trace will be less helpful, but it's all we can do if the
        // caller hasn't already created the error.
        with_error.push( new Error( maybe_error ));
      }
      return with_error;

    } catch ( combining_error ) {
      return [ ...logs, `Skipped adding the error`, combining_error ];
    }
  }

  _get_Errorable({ do_throw=false , maybe_error }) {
    /** If the caller wants to throw an error, try to return something that
     *  won't itself throw an error (for example, an obj with a circular
     *  reference). Otherwise, return `undefined`.
     *
     * @param { bool } do_throw - Optional. Default is `false`. Whether the
     *     caller wants to throw an error.
     * @param { any } maybe_error - Required. Any value.
     *
     * @returns { any|undefined } A value that is an error or can be made into
     *     an error.
     * */

    // If we're not supposed to throw, we already gave a warning that there
    // should be no value for error. Here, we make sure it gets no value.
    if ( !do_throw ) { return; }

    if ( maybe_error instanceof Error ) {
      return maybe_error;
    } else {
      // TODO: Consider refactor:
      // if ( _json_does_error ) { _get_safe_val({val: maybe_error})/_get_inspected_val() }
      return this._get_safe_val( maybe_error );
    }
  }

  _get_safe_val( risky_value ) {
    /** Return a value that is not, e.g., a circular reference regardless of
     *  what came in.
     *
     * @param { any } risky_value - A value that may itself cause an error
     *    in some situations, like when used in `new Error()`.
     *
     * @returns { any } A value that will definitely not cause an error.
     * */
    let safe_val;

    try {

      // Possibly trigger an error (e.g. circular reference error) (new Error()
      // doesn't get caught)
      let will_cause_error_if_its_a_circular_reference = JSON.stringify( risky_value );
      // If no error got triggered, this value will be safe to use to create an
      // error and we can return it as is
      safe_val = risky_value;

    } catch ( maybe_error_stringify_error ) {

      this.debug({
        level: `warn`, code: `ALK0224`, context: `internal log`,
      }, `Skipped JSON.stringify()`, maybe_error_stringify_error );

      try {
        // If stringifying did create an error, try modifying it to make it
        // safe. Not as good as the original, but better than nothing.
        let inspected = util.inspect( risky_value, { depth: 8, maxArrayLength: null, maxStringLength: null, });
        safe_val = inspected;

      } catch ( maybe_error_inspect_error ) {

        this.debug({
          level: `warn`, code: `ALK0222`, context: `internal log`,
        }, `Skipped inspect`, maybe_error_inspect_error );
        // If even that failed, we can only return a vague message
        safe_val = `ALKiln was unable to parse the value of \`error\``;

      }  // ends try inspect
    }  // ends try stringify

    return safe_val;
  }

  /** Note: Functions that call `._console()` like those below only get used by
   *  setup, takedown, and run_cucumber, or a few exceptions, like unexpected
   *  behavior that gets in here that we cannot record any other way. */

  success( success_opts = {}, ...logs ) {
    /** Log a major successful operation to the console using additional
     *  metadata and the given logs. Use it sparingly. Use it in test suite
     *  wrapper functionality, like setup and takedown.
     *
     * @param success_opts { obj }
     * @param success_opts.code { str } - Required. Unique log id of the format
     *     "ALK####", where "#" is a digit.
     * @param success_opts.before { str } - Optional. Default is `""`.
     *     Decoration to log before the metadata.
     * @param success_opts.context { str } - Optional. Default is `""`. Info
     *     about the origin of the logs.
     * @param logs { ...str } - Optional. Default is `undefined`. Explanation of
     *     what happened.
     *
     * @returns { str } Formatted metadata, logs, and, if given, the error.
     *
     * @Examples
     * log.warn({
     *   before: "~~~",
     *   code: "ALK00d3",
     *   context: "demo",
     * }, "demo log");
     * // ~~~🌈 ALK00d3 demo SUCCESS [2024-08-16 00:30:39UTC]: demo log
     * */
    // Discuss: do we want to log some successes as "💡 ... SUCCESS: "?
    // Should we allow callers to override levels and icons?
    let {
      code = `ALK000s`, before = ``, context = ``
    } = success_opts;
    return this._console({
      level: `success`, icon: `🌈`,
      before, code, context,
    }, ...logs);
  }

  info( info_opts = {}, ...logs ) {
    /** Log informational messages to the console using additional metadata and
     *  the given logs. Use it in test suite wrapper functionality, like setup
     *  and takedown.
     *
     * @param info_opts { obj }
     * @param info_opts.code { str } - Required. Unique log id of the format
     *     "ALK####", where "#" is a digit.
     * @param info_opts.before { str } - Optional. Default is `""`.
     *     Decoration to log before the metadata.
     * @param info_opts.context { str } - Optional. Default is `""`. Info
     *     about the origin of the logs.
     * @param logs { ...str } - Optional. Default is `undefined`. Explanation of
     *     what happened.
     *
     * @returns { str } Formatted metadata, logs, and, if given, the error.
     *
     * @Examples
     * log.warn({
     *   before: "~~~",
     *   code: "ALK00d4",
     *   context: "demo",
     * }, "demo log");
     * // ~~~💡 ALK00d4 demo INFO [2024-08-16 00:30:39UTC]: demo log
     * */
    let {
      code = `ALK000i`, before = ``, context = ``,
    } = info_opts;
    return this._console({
      level: `info`, icon: `💡`,
      before, code, context,
    }, ...logs);
  }

  warn( warning_opts = {}, ...logs ) {
    /** Log warnings to the console using additional metadata and the given
     *  logs. Use it in test suite wrapper functionality, like setup and
     *  takedown.
     *
     * @param warning_opts { obj }
     * @param warning_opts.code { str } - Required. Unique log id of the format
     *     "ALK####", where "#" is a digit.
     * @param warning_opts.before { str } - Optional. Default is `""`.
     *     Decoration to log before the metadata.
     * @param warning_opts.context { str } - Optional. Default is `""`. Info
     *     about the origin of the logs.
     * @param logs { ...str } - Optional. Default is `undefined`. Explanation of
     *     what happened.
     *
     * @returns { str } Formatted metadata, logs, and, if given, the error.
     *
     * @Examples
     * log.warn({
     *   before: "~~~",
     *   code: "ALK00d5",
     *   context: "demo",
     * }, "demo log");
     * // ~~~🔎 ALK00d5 demo WARNING [2024-08-16 00:30:39UTC]: demo log
     * */
    let {
      code = `ALK000w`, before = ``, context = ``
    } = warning_opts;
    return this._console({
      level: `warn`, icon: `🔎`,
      before, code, context,
    }, ...logs);
  }

  throw( throw_opts = {}, ...logs ){
    /** Throw the given error option after writing metadata and logs to the
     *  console. Use it in test suite wrapper functionality, like setup and
     *  takedown.
     *
     * @param throw_opts { obj }
     * @param throw_opts.code { str } - Required. Unique log id of the format
     *     "ALK####", where "#" is a digit.
     * @param throw_opts.before { str } - Optional. Default is `""`.
     *     Decoration to log before the metadata.
     * @param throw_opts.context { str } - Optional. Default is `""`. Info
     *     about the origin of the logs.
     * @param throw_opts.error { any } - Required. Ideally, an Error, but can be
     *     anything to throw as an Error.
     * @param logs { ...str } - Optional. Default is `undefined`. Explanation of
     *     what happened.
     *
     * @returns { None } Throws an error, no return value.
     *
     * @Examples
     * try {
     *   let causes_error = undefined_value + 5;
     * } catch ( demo_error ) {
     *   log.throw({
     *     code: "ALK00d6"
     *     context: "err_demo"
     *     error: demo_error,
     *   }, "error demo log" );
     * }
     * // Logged in the console, but not returned
     * // 🤕 ALK00d6 err_demo ERROR [2024-08-16 00:30:39UTC]: error demo log
     * // Uncaught ReferenceError: undefined_value is not defined
     * // <the stack trace>
     * */
    let {
      code = `ALK000t`, before = ``, context = ``, error = `ALKiln default error`,
    } = throw_opts;

    this._console({
      level: `error`, icon: `🤕`, do_throw: true,
      before, code, context, error,
    }, ...logs);
  }

  // TODO: Add _save_to_debug?

  _save_to_unexpected({ text = `` } = {}) {
    /** Save to the unexpected results file. Intended for errors and warnings.
     *
     * TODO: Put in try/catch
     *
     * @param { obj } options
     * @param { str } options.text - Optional. Default is `""`. Str to save to
     *     the unexpected results file.
     *
     * @returns { str } The same text is was given.
     * */
    fs.appendFileSync(`${ this.path }/${ this.unexpected_filename }`, `\n${ text }` );
    return text;
  }

  /** `stdout` is currently for test progress summary and reports. */

  stdout(stdout_opts = {}, ...logs) {
    /** Prints in the console inline and saves to the debug log and, in future
     *  the report log. Use for progress summary during test runs and for
     *  reports. Logs are joined with no separator.
     *
     * @param { obj } stdout_opts
     * @param { bool } stdout_opts.records_only - Optional. Default is `false`.
     *     Whether to only save logs without printing them to the console. E.g.
     *     progress summary characters like those that cucumber is already
     *     printing to the console. logs { ...str } - Optional. Each argument
     *     must be a string.
     * @param logs { ...str } - Optional. Default is `undefined`. Text to print.
     *
     * @returns { str } String of combined strings.
     *
     * @Examples
     * log.stdout({ records_only: false }, ".", "." );
     * // ..
     * */
    let {
      records_only = false,
    } = stdout_opts;
    let whole_log = logs.join(``);

    // Write to the debug and report files
    this._record_stdout( whole_log );
    // Write to the console
    if ( !records_only ) {
      process.stdout.write( whole_log );
    }

    return whole_log;
  }

  _record_stdout(...logs) {
    /** Save stdout output to various debug and report files.
     *
     * @param { ...str } logs - Optional. Default is `undefined`. Strings to
     *     write to debug files.
     *
     * @returns { str } String of combined strings.
     *
     * @Examples
     * log._record_stdout( ".", "." );
     * // ..
     * */
    this.debug({ code: `ALK0220`, context: `stdout` }, ...logs);
    let whole_log = logs.join(``);
    // TODO: ensure this is after the report heading (datetime of test, etc.)
    fs.appendFileSync( `${ this.path }/${ this.report_log_filename }`, whole_log );
    return whole_log;
  }

  clear() {
    /** Empty all files possible without deleting them.
     *
     * @returns { Log } Self.
     * */
    try { fs.writeFileSync( `${ this.path }/${ this.debug_log_filename }`, `` ); }
    catch (error) { /* Fail without throwing. Nice to have, not crucial. */ }
    try { fs.writeFileSync( `${ this.path }/${ this.report_log_filename }`, `` ); }
    catch (error) { /* Fail without throwing. Nice to have, not crucial. */ }
    try { fs.writeFileSync( `${ this.path }/${ this.report_filename }`, `` ); }
    catch (error) { /* Fail without throwing. Nice to have, not crucial. */ }
    try { fs.writeFileSync( `${ this.path }/${ this.unexpected_filename }`, `` ); }
    catch (error) { /* Fail without throwing. Nice to have, not crucial. */ }
    return this;
  }

}  // Ends Log{}

module.exports = Log;
