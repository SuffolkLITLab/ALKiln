const fs = require(`fs`);
const util = require(`node:util`);
const session_vars = require( `./session_vars` );
const time = require(`./time`);
const files = require(`./files`);

// ? 🌈 💡 🔎 🤕 🐛 🖊️
// Alternatives: 🩹 ❤️‍🩹 🚑

/**
 * Future issues:
 * - [ ] Save logs from GitHub actions as well? Users can download them
 *   themselves, but this might not be clear to them
 * - [ ] Capture cucumber ProgressFormatter logs instead of making them
 *   ourselves?
 * - [ ] keeping report separate for now (can just be an issue to integrate)
 * - [ ] Discuss: instead of logging above an error, manipulate the error
 *   message to prepend the accompanying log code, etc (all except the `before`
 *   prop). Before this, do UX research to see if the current format is as
 *   confusing to authors as it seems from this end.
 * - [ ] Discuss: Put artifacts path name getting, setting, deleting, in here so
 *   we can avoid importing session_vars and then use Log in session_vars.js
 * - [ ] Discuss: Should `.error()` return an Error?
 * */

/**
 * Quick examples:
 * 
log.debug({ code: `ALK0%%%`, context: `unspecified context`,},
  `The message`,
  some_val
);

log.success({ code: `ALK0%%%`, context: `unspecified context`,},
  `The message`,
  some_val
);
log.info({ code: `ALK0%%%`, context: `unspecified context`,},
  `The message`,
  some_val
);
log.warn({ code: `ALK0%%%`, context: `unspecified context`,},
  `The message`,
  some_val
);
log.error({ code: `ALK0%%%`, context: `unspecified context`,},
  `The message`,
  some_val
);
log.throw({ code: `ALK0%%%`, context: `unspecified context`,
  error: new Error(
    `Error message`
  ),}
);
log.throw({ code: `ALK0%%%`, context: `unspecified context`,
  error: new Error(
    `Error message`
  ),},
  `Additional message`
);
 * */

class Log {
  /** This class includes methods to save meaningful messages with additional
   *   metadata to the debug files while tests run. Most of the rest of `Log`'s
   *   methods similarly save to the debug files and also log to the console. We
   *   use them only during processes that wrap the core framework code[^1],
   *   like setup and takedown. All these outputs let both us and authors debug
   *   their interviews, their tests, and this framework's code.
   *
   * Errors: For functionality that wraps core code[^1], `Log` also has a
   *   `.throw()` method, which is like a regular log method and then also
   *   throws an error. `.throw()` isn't for test failures, though. Meanwhile,
   *   `Log` tries to avoid throwing its own errors. That way, authors don't
   *   have to deal with this non-critical functionality. We save those errors
   *   to the debug files. See the docs about errors.
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
   *
   * Discuss: pros and cons of integrating saving other kinds of files using
   *   `Log`, like screenshots, downloaded files, etc.
   *
   * The tests have the most detailed examples.
   *
   * [^1]: Core code is code that handles the Steps that authors write in their
   *   `.feature` files.
   * */

  /** Debug filenames. */
  debug_log_filename = `debug_log.txt`;  // Should always exist
  // This is only here so we can add it to the final unexpected results file
  temp_unexpected_debug_log_filename = `temp_unexpected_results_debug_log.txt`;  // Only created if needed

  /** Report filenames. Reports aren't integrated yet. This is a good central
   *  location for all this information and for future development. */
  report_log_filename = `report_log.txt`;  // Not integrated, but used
  // Regular report filename
  report_filename = `report.txt`;  // Not integrated, but used

  /** Will have all unexpected results - from report and debug logs. */
  unexpected_filename = `unexpected_results.txt`;  // Only created if needed

  constructor({ path, context=`` } = {}) {
    /** Makes sure the right directory exists and instantiates class properties.
     *  GitHub actions will pass in a path that may already exist. Other
     *  processes, like ALKilnInThePlayground, don't have a path yet.
     *
     * ALKiln runs in multiple different environments that use a different order
     *    of operations to run the tests. See the documentation about ALKiln's 4
     *    environments. ALKiln's current GitHub composite action must be able to
     *    force a specific path for the artifacts folder so that the GitHb
     *    setup, run, and takedown process' `Log`s all store their logs in the
     *    same directory. This is the GitHub composite action flow:
     *
     * 1. Make a path name.
     * 2. Pass the path to the setup script, which makes a `Log` for the first
     *    time using that path name. `Log`, in here creates the folder.
     * 3. Pass the path to the run script, which makes a `Log` using that path
     *    name. The folder already exists, so `Log` uses that folder. The run
     *    script makes sure the ALKiln core code knows what folder to use.
     * 4. Pass the path to the takedown script, which makes a `Log` using that
     *    path name. The `Log` uses that same folder.
     *
     * ALKiln's other environments only use the run script for each test run.
     *    The run process tells the core code what directory to use.
     *
     * The tests can only run sequentially right now, not in parallel, so there
     *    is no need to worry about locking the file and creating queues for
     *    logs from different tests to keep them from getting mixed together.
     *
     * @param { Object } options
     * @param { string } options.path - Optional. The directory where it should
     *    store the final logs. We currently only use this argument with GitHub
     *    actions.
     * @param { string } options.context - Optional. Info about what is creating
     *    this Log. For example, "setup".
     *
     * @example
     * const Log = require("./lib/utils/Log.js");
     * const log = new Log({ path: "_alkiln-123", context: "setup" });
     * */

    // These records help internal tests check for correct behavior
    this.internal_tests_records = [];

    let dir = path;  // eventually, convert to this.dir instead of this.path

    let is_new_folder = this._is_new_folder({ dir }).is_new;
    this.path = this._make_or_get_folder({ dir }).dir;
    // Discuss: Should making/saving the artifacts folder be hidden in here? If
    //    not, where should it be? `make_artifacts_folder` maybe...
    session_vars.save_artifacts_path_name( this.path );

    // Make sure `log` is in the logged context
    if ( context ) { context = context + ` log`; }
    else { context = `log`; }
    let files_msg = `ALKiln will save test results files at "${ this.path }"`;
    if ( is_new_folder ) {
      this.info({ code: `ALK0214`, context, }, files_msg );
    }  else {
      this.debug({ code: `ALK0275`, context, }, files_msg );
    }

    // Has this `Log` ever failed to append to the debug file?
    this.fs_append_to_debug_file_failed = false;

  }

  _is_new_folder({ dir }) {
    /** Check if the artifacts folder is a new folder.
     * 
     * @param {object} obj - Named arguments
     * @param {undefined | str} obj.dir - A folder path or undefined
     * 
     * @returns {{ is_new: bool, errors: [] | [Error] }} - Whether the folder
     *     previously existed (if yes, true) and a list of any Errors that
     *     happened
     * */
    let is_new = true;
    try {

      if ( dir ) {
        if ( fs.existsSync( dir )) { is_new = false; }
      } else if ( session_vars.get_artifacts_path_name() ) {
        is_new = false;
      }
      return { is_new, errors: [] };

    } catch ( folder_check_error ) {
      return { is_new, errors: [ folder_check_error ]}
    }
  }

  _make_or_get_folder({ dir }) {
    /** Make a new folder for artifacts or get one that already exists.
     * 
     * The chosen directory will be, in order of precedence, the `dir` value,
     *     an existing folder, or a completely new folder.
     * 
     * @param {object} obj - Named arguments
     * @param {undefined | str} obj.dir - Optional. Desired path to the
     *     artifacts folder.
     * 
     * @returns { {dir: str, errors: [Error]} } Object with the given directory
     *     name and a list of 0 or more Error instances.
     * */
    try {

      // GitHub actions pass in a dir, but other processes, like
      //    ALKilnInThePlayground, don't have a path
      if ( !dir ) {
        if ( session_vars.get_artifacts_path_name() ) {
          dir = session_vars.get_artifacts_path_name();
        } else {
          dir = files.make_artifacts_folder();
        }
      }

      if ( !fs.existsSync( dir )) {
        files.make_artifacts_folder( dir );
      }

      return { dir, errors: [] };

    } catch ( error_making_dir ) {
      return { dir, errors: [ error_making_dir ]};
    }
    
  }

  _console( console_opts = {}, ...logs ) {
  /** `_console` should be called internally by other methods of Log. We use it
   *  in functionality that wraps around test runs, specifically setup,
   *  takedown, run_cucumber (before and after running the tests), and API calls
   *  that interact with the server at those times. It writes to the console at
   *  different levels and throws errors. If it's not throwing a given error, it
   *  returns the combined metadata and the logs as a formatted string. Only
   *  internal code should call this method.
   *
   * The `_console` method will:
   *  1. Save the data to files with `log.debug()`
   *  2. If `do_throw` is true, write data to the console and throw the error
   *  3. Otherwise, write data to the console at the right level
   *  4. Return a formatted string of the metadata and the given data
   *
   * Flow summary:
   * .debug() ─► write to the console ─► throw or return
   *
   * Complex flow diagram:
   *                  ┌───────────────────────────────────────┐
   *                  │             ._console()               │
   *                  ├───────────────────────────────────────┤
   * all below ─┐     │                                       │
   *            ├────► .debug() (formatted logs str)          │
   *            └────► get metadata string (all)              │
   * then...          │                                       │
   *                  │                                       │
   * .throw()   ──┐   │                                       │
   *              ├────► get safe Error                       │
   *              ├────► console.error() with extra info      │
   *              └────► throw Error                          │
   * .success() ──┐   │                                       │
   *              │   │                                       │
   * .info()    ──╘════► console.info() logs ════════════╗    │
   *                  │                                  ║    │
   * .warn()    ───────► console.warn() logs───────┐     ║    │
   *                  │                            │     ║    │
   * .error()   ───────► console.error() logs───┐  │     ║    │
   *                  │                         ▼  ▼     ║    │
   *                  │  return formatted logs string ◄══╝    │
   *                  └───────────────────────────────────────┘
   *
   * @param { Object } console_opts - Required. Metadata and functional flags
   *     and data.
   * @param { "success"|"info"|"warn"|"error" } console_opts.level - Required.
   *     The log level. Functional and metadata. Defined by the internal caller.
   * @param { string } console_opts.before - Optional. Text to add before the
   *     metadata of the log. Metadata. Default "".
   * @param { string } console_opts.icon - Required. Unicode char put at the
   *     start of metadata. Makes the level more easy to see quickly. Defined by
   *     the internal caller.
   * @param { string } console_opts.code - Required. Unique consecutive log id
   *     with the format ALK####. Defined by the original caller.
   * @param { string } console_opts.context - Optional. Info about the context
   *     where the log was called. Metadata. Examples: "setup", "run",
   *     "takedown". Default "". Defined by the original caller.
   * @param { Error|any } console_opts.error - Optional. The error or data to
   *     eventually throw if `do_throw` is `true`, like with `.throw()`.
   *     Otherwise, just another log. It will keep its original stack trace.
   *     Default is `undefined`. Defined by the original caller.
   * @param { boolean } console_opts.do_throw - Optional. If `true` caller wants
   *     to throw an error. Default `false`. Defined by the internal caller.
   * @param { ...any } logs - Optional. The logs to write to the console. Joined
   *     by " " or "\n" depending on the type of the log. Default becomes `[]`.
   *     Defined by the original caller.
   *
   * @returns { string } Formatted metadata, logs, and, if given, the error.
   *
   * @example
   * log._console();
   * // * ALK000c LOG [2024-08-16 00:30:39UTC]:
   *
   * @example
   * log._console({
   *   level: "info",
   *   icon: "&",
   *   code: "ALK00d1",
   *   context: "demo",
   * }, "demo log", "demo log 2");
   * // & ALK00d1 demo INFO [2024-08-16 00:30:39UTC]: demo log demo log 2
   *
   * @example
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
    // a warning for that would be too much noise. Internal developers should
    // have enough information to be able to figure out what these mean and
    // correct problems if needed.
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
    logs = logs || [];

    if ( do_throw || error !== undefined ) {
      error = this._get_Error_safely({ maybe_error: error });
    }

    let formatted_str_to_return = this.debug({
      level, before, icon, code, context, error, do_throw,
    }, ...logs );

    let metadata_str = this._format_metadata({ level, icon, code, context });

    // Throw whatever we can throw
    if ( do_throw ) {
      // WARNING: If someone catches the error we throw, these logs will still
      // show. The final resulting logs may become confusing.
      try {
        console.error( `\n\n\n${before}${metadata_str}:`, ...logs );
      } catch ( pre_throw_error ) {
        this.debug({
          icon: `🖊️`, code: `ALK0215`, context: `internal log`, level: `note`,
        }, `Skipped logging metadata before throwing the error`, pre_throw_error );
      }

      // Readers will see this text in the console, so give a clarifying name
      let error_from_alkiln = error;
      // ALKiln threw an error when preparing, cleaning up, or running the tests
      throw error_from_alkiln;
    }

    // Avoid using custom-formatted logs and error here.
    // Let the console show them as it wants.
    try {

      let combined = this._combined_logs_and_error({ logs, error, do_throw });
      // log at the given level if console has that method (`log` by default
      // from ._console). If a non-standard level, like `success`, was passed in
      // use `info` by default.
      if ( !console[ level ]) { level = `info`; }
      console[ level ]( `${before}${metadata_str}:`, ...combined );

    } catch ( console_log_error ) {
      // Fail silently
      this.debug({
        icon: `🖊️`, code: `ALK0211`, context: `internal log`, level: `note`,
      }, `Skipped saving a ${ level } message to the debug log`, console_log_error );
    } finally {
      return formatted_str_to_return;
    }
  }

  debug( debug_opts = {}, ...logs ) {
    /** Saves metadata and any logs in the debug file. When appropriate, also
     *  saves to the unexpected results file. Includes an Error if needed.
     *  Returns a formatted string version of the log with its metadata. Avoids
     *  throwing internal errors while giving the max info possible. Avoids
     *  writing to the visible console. Every log should come through here.
     *  External code can call this method.
     *
     * Tries to make saved logs look as similar as possible to console logs.
     *
     * @param { Object } console_opts - Required. Metadata and functional flags
     *     and data.
     * @param { "success"|"info"|"warn"|"error" } console_opts.level - Required.
     *     The log level. Functional and metadata. Defined by the internal
     *     caller.
     * @param { string } console_opts.before - Optional. Text to add before the
     *     metadata of the log. Metadata. Default "".
     * @param { string } console_opts.icon - Required. Unicode char put at the
     *     start of metadata. Makes the level more easy to see quickly. Defined
     *     by the internal caller.
     * @param { string } console_opts.code - Required. Unique consecutive log id
     *     with the format ALK####. Defined by the original caller.
     * @param { string } console_opts.context - Optional. Info about the context
     *     where the log was called. Metadata. Examples: "setup", "run",
     *     "takedown". Default "". Defined by the original caller.
     * @param { ...any } logs - Optional. The logs to write to the console.
     *     Joined by " " or "\n" depending on the type of the log. Default
     *     becomes `[]`. Defined by the original caller.
     *
     * @returns { string } Same as `._console()`
     *
     * Discuss: Log warnings with stack trace? function stackTrace() { return
     * (new Error()).stack; } and https://stackoverflow.com/a/41820537/14144258
     * var mystring=require("util").inspect(error_object);
     *
     * Flow:
     * get metadata
     * get formatted logs as string (maybe with error)
     * combine those
     * save those to debug log
     * maybe save those to unexpected results log
     * return the formatted string
     *
     * @example
     * log.debug()
     * // 🐛 ALK000d DEBUG [2024-08-16 00:38:49UTC]:
     * */

    let {
      level= `debug`,
      before = ``,
      icon = `🐛`,
      code = `ALK000d`,
      context = ``,
      error,
      do_throw = false,
    } = debug_opts;
    logs = logs || [];

    this.internal_tests_records.push({ opts: debug_opts, logs });

    // "warning" level and icon for for internal devs we use to avoid disrupting
    // the info authors are looking for
    if ( level === `note` ) { icon = `🖊️`; }

    let formatted = `Skipped formatting all logs.`;
    try {

      let metadata_str = this._format_metadata({ level, icon, code, context });

      // Get the whole formatted log message
      formatted = `${ metadata_str }: Skipped formatting logs.`;
      let logging_errors_msgs = [];
      try {

        let combined = this._combined_logs_and_error({ logs, error, do_throw });

        let stringified = this._stringify_logs( ...combined );
        // Question: Does `formatted` double log the error in the console?
        // Answer: `._console` doesn't use `formatted`, just returns it.
        formatted = `${ before }${ metadata_str }: ${ stringified }`;

      } catch ( formatted_log_error ) {
        formatted = `🖊️ ALK0212 internal debug NOTE [${ Date.now() }]: Skipped formatting debug logs.`;
        this._save_to_debug_safely({ unexpected: true, text: formatted });
        this._save_to_debug_safely({ unexpected: true, text: formatted_log_error.stack });
      }

      let unexpected = `warn error note`.includes( level );
      this._save_to_debug_safely({ unexpected, text: formatted });

    } catch ( debug_error ) {
      formatted = `🖊️ ALK0217 internal debug NOTE [${ Date.now() }]: Skipped log.debug()\n${ debug_error.stack }`;
      this._save_to_debug_safely({ unexpected: true, text: formatted });
      this._save_to_debug_safely({ unexpected: true, text: debug_error.stack });
    }

    return formatted;
  }

  _format_metadata( metadata_opts = {} ) {
    /** Formats and returns the log's metadata. Catch ANY error.
     *
     * @param { Object } metadata_opts - Required. Custom options for metadata
     * @param { string } metadata_opts.level - Required. Level of the log (info,
     *     warn, etc).
     * @param { string } metadata_opts.icon - Required. Icon that makes the
     *     level of the log more visible.
     * @param { string } metadata_opts.code - Required. The unique id of the
     *     log.
     * @param { string } metadata_opts.context - Optional. Default is `""`. More
     *     context about the caller. For example, "setup" or "takedown".
     *
     * @returns { string } The log's metadata.
     *
     * @example
     * log._format_metadata({
     *   level: "fax",
     *   icon: "%",
     *   code: "ALK00d7",
     *   context: "demo"
     * });
     * // % ALK00d7 demo FAX [2024-08-16 00:30:39UTC]
     * */
    let {
      level = `log`,
      icon = `?`,
      code = `ALK000m`,
      context = ``,
    } = metadata_opts;

    let metadata_str = `Formatted log string placeholder: `;
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
      metadata_str = metadata_list.join(` `);

    } catch ( metadata_error ) {
      this._save_to_debug_safely({ unexpected: true, text: `🖊️ ALK0219 internal log metadata NOTE [${ Date.now() }]: Skipped creating metadata.` });
      this._save_to_debug_safely({ unexpected: true, text: metadata_error.stack });
    }
    return metadata_str;
  }

  _stringify_logs(...logs) {
    /** Returns a string of the combined and formatted version of the list of
     *  logs by stringifying non-strings and joining all lots with separators.
     *  An error will show its full stack. A bit different than `console.log()`.
     *
     * @param { ...string } - Optional. Default is `""`. Logs to combine.
     *
     * @returns { string } Combined and formatted logs.
     *
     * @example
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

        if ( log === null || typeof log !== `object` ) {
          stringified_logs += this._stringify_inline({ prev_line_type, inline_log: log });
          prev_line_type = `inline`;

        } else {
          // Objects, including errors
          stringified_logs += this._stringify_object({ prev_line_type, obj_log: log });
          prev_line_type = `block`;
        }  // ends typeof log
      }  // Ends for logs
    } catch ( stringify_error ) {

      try {
        // Discuss: Should the above `stringify_error` get recorded even when
        // `this._inspect()` works?
        stringified_logs = this._inspect({ value: logs });
      } catch ( util_error ) {
        if ( stringified_logs.length > 0 ) {
          stringified_logs += `Skipped stringifying logs. Got:\n${ stringified_logs }\n${ util_error.stack }\n${ stringify_error.stack }`;
        } else {
          stringified_logs = `Skipped stringifying logs.\n${ util_error.stack }\n${ stringify_error.stack }`;
        }
      }

    }

    return stringified_logs;
  }  // Ends Log._stringify_logs()

  _stringify_inline({ prev_line_type, inline_log }) {
    /** Formats the start of an inline log based on the previous log and returns
     *  that combined string.
     *
     * @param { "inline"|"block"|null } prev_line_type - Required. The type of
     *     the previous log.
     * @param { null|non-obj } inline_log - Required. The log.
     *
     * @returns { string } The formatted log.
     *
     * @example
     * // Backticks are to make the surrounding white space more clear
     * log._stringify_inline({ prev_line_type: null, inline_log: "apple" });
     * // `apple`
     * log._stringify_inline({ prev_line_type: 'inline', inline_log: "apple" });
     * // ` apple`
     * log._stringify_inline({ prev_line_type: 'block', inline_log: "apple" });
     * // `
     * // apple`
     * */
    // An inline log's string starts with nothing if it's the first string...
    let start = ``;
    // ...starts after a space if its next to an inline string...
    if ( prev_line_type === `inline` ) { start = ` `; }
    // ...or starts on a new line if it's after a block of text, like an error
    // or object.
    else if ( prev_line_type === `block` ) { start = `\n`; }
    return `${ start }${ inline_log }`;
  }

  _stringify_object({ prev_line_type, obj_log }) {
    /** Return a string - either the object as a string or a default value with
     *  a "block"-type separator at the start. Can handle circular references.
     *  Catch ANY error.
     *
     * @param { Object } obj_log - Required. The object to format.
     *
     * @returns { string } The obj as a string plus a separator
     *
     * @example
     * // Quotes are to make the surrounding white space more clear
     * log._stringify_object({ obj_log: { fruit: "bananas" } });
     * //
     * // { fruit: 'bananas' }
     * */
    let start = ``;
    if ( prev_line_type === `inline` || prev_line_type === `block` ) {
      start = `\n`;
    }

    try {
      // Try to stringify the object.
      return `${ start }${ this._inspect({ value: obj_log }) }`;

    // Discuss: record these errors?
    } catch ( outer_error ) {
      // If that fails, see if it has its own way of stringifying
      try {
        return `${ start }${ obj_log }`;
      } catch ( inner_error ) {
        // If everything else fails, give at least some information
        return `${ start }Skipped logging this ${ typeof obj_log } which is an instance of ${ obj_log.constructor.name }`;
      }  // ends inner try
    }  // ends outer try
  }

  _combined_logs_and_error({ logs=[], error, do_throw=false }) {
    /** Return a list of the given logs combined with the given error, if it
     *     exists, ensuring the error is an Error.
     * 
     * @param { ...any } logs - Optional. The logs to write to the console.
     *     Joined by " " or "\n" depending on the type of the log. Default
     *     becomes `[]`. Defined by the original caller.
     * @param { Error|any } console_opts.error - Optional. Any. Default is
     *     `undefined`. Defined by the original caller.
     * @param { boolean } console_opts.do_throw - Optional. If `true` caller wants
     *     to throw an error. Default `false`. Defined by the internal caller.
     * 
     * @return [ any ] - List of logs, potentially with an added error
     * 
     * */
    if ( do_throw || error !== undefined ) {
      error = this._get_Error_safely({ maybe_error: error });
    }
    let logs_maybe_with_error = [ ...logs ];
    if ( error !== undefined ) { logs_maybe_with_error.push( error ); }

    return logs_maybe_with_error;
  }

  _get_Error_safely({ maybe_error }) {
    /** Given anything, return an Error. Avoid throwing any errors.
     *
     * @param { Object } opts
     * @param { * } opts.maybe_error - Optional. Can be anything.
     *
     * @returns { Error|undefined }
     * */
    try {

      if ( maybe_error instanceof Error ) {
        return maybe_error;
      } else if ( maybe_error ) {

        if ( this._json_does_error( maybe_error )) {
          maybe_error = this._get_inspected_val_safely( maybe_error );
        }

        let error_from_alkiln = maybe_error;  // clearer name

        // The stack trace `new Error()` creates here will be less helpful, but
        // it's all we can do if the caller hasn't already created the error.
        return new Error( error_from_alkiln );

      }
    } catch ( get_safe_error_error ) {
      this._save_to_debug_safely({ unexpected: true, text: `🖊️ ALK0226 internal debug NOTE [${ Date.now() }]: Skipped combining the logs.` });
      this._save_to_debug_safely({ unexpected: true, text: get_safe_error_error.stack });
    }
  }

  _json_does_error( risky_value ) {
    try {

      // Possibly trigger an error (e.g. circular reference error) (new Error()
      // with a circular reference can't be caught, it seems)
      JSON.stringify( risky_value );
      return false;  // Did not trigger an error

    } catch ( maybe_error_stringify_error ) {
      this._save_to_debug_safely({ unexpected: true, text: `🖊️ ALK0224 internal log NOTE [${ Date.now() }]: Skipped JSON.stringify().` });
      this._save_to_debug_safely({ unexpected: true, text: maybe_error_stringify_error.stack });
      return true;  // Triggered an error
    }
  }

  _get_inspected_val_safely( risky_value ) {

    let safe_val = `Skipped safe val.`;
    try {
      // If stringifying did create an error, try modifying it to make it
      // safe. Not as good as the original, but better than nothing.
      let inspected = this._inspect({ value: risky_value });
      safe_val = inspected;

    } catch ( risky_val_inspect_error ) {
      this._save_to_debug_safely({ unexpected: true, text: `🖊️ ALK0222 internal log NOTE [${ Date.now() }]: Skipped inspecting risky value.` });
      this._save_to_debug_safely({ unexpected: true, text: risky_val_inspect_error.stack });
      // If even that failed, we can only return a vague message
      safe_val = `ALKiln was unable to parse the value of \`error\`. Skipped parsing it.`;

    }  // ends try inspect

    return safe_val;
  }

  _inspect({ value }) {
    try {
      return util.inspect( value, { depth: 8, maxArrayLength: null, maxStringLength: null, });
    } catch ( direct_inspect_err ) {
      return `🖊️ ALK0228 inspect log NOTE [${ Date.now() }]: Skipped util.inspect. ${ direct_inspect_err.stack }`;
    }
  }

  /** Note: Functions that call `._console()` like those below only get used by
   *  setup, takedown, and run_cucumber, or a few exceptions, like unexpected
   *  behavior that gets in here that we cannot record any other way. */

  success( success_opts = {}, ...logs ) {
    /** Log a major successful operation to the console using additional
     *  metadata and the given logs. Use it sparingly. Use it in test suite
     *  wrapper functionality, like setup and takedown.
     *
     * @param success_opts { Object }
     * @param success_opts.code { string } - Required. Unique log id of the
     *     format "ALK####", where "#" is a digit.
     * @param success_opts.before { string } - Optional. Default is `""`.
     *     Decoration to log before the metadata.
     * @param success_opts.context { string } - Optional. Default is `""`. Info
     *     about the origin of the logs.
     * @param logs { ...string } - Optional. Default is `undefined`. Explanation
     *     of what happened.
     *
     * @returns { string } Formatted metadata and logs.
     *
     * @example
     * log.warn({
     *   before: "~~~",
     *   code: "ALK00d3",
     *   context: "demo",
     * }, "demo log");
     * // ~~~🌈 ALK00d3 demo SUCCESS [2024-08-16 00:30:39UTC]: demo log
     * */
    // Discuss: do we want to log some successes as "💡 ... SUCCESS: " for
    // smaller successful operations along the way?
    return this._console({
      code: `ALK000s`,
      ...success_opts,
      level: `success`, icon: `🌈`, do_throw: false,
    }, ...logs );
  }

  info( info_opts = {}, ...logs ) {
    /** Log informational messages to the console using additional metadata and
     *  the given logs. Use it in test suite wrapper functionality, like setup
     *  and takedown.
     *
     * @param info_opts { Object }
     * @param info_opts.code { string } - Required. Unique log id of the format
     *     "ALK####", where "#" is a digit.
     * @param info_opts.before { string } - Optional. Default is `""`.
     *     Decoration to log before the metadata.
     * @param info_opts.context { string } - Optional. Default is `""`. Info
     *     about the origin of the logs.
     * @param logs { ...string } - Optional. Default is `undefined`. Explanation
     *     of what happened.
     *
     * @returns { string } Formatted metadata and logs.
     *
     * @example
     * log.warn({
     *   before: "~~~",
     *   code: "ALK00d4",
     *   context: "demo",
     * }, "demo log");
     * // ~~~💡 ALK00d4 demo INFO [2024-08-16 00:30:39UTC]: demo log
     * */
    return this._console({
      code: `ALK000i`,
      ...info_opts,
      level: `info`, icon: `💡`, do_throw: false,
    }, ...logs );
  }

  warn( warning_opts = {}, ...logs ) {
    /** Log warnings to the console using additional metadata and the given
     *  logs. Use it in test suite wrapper functionality, like setup and
     *  takedown.
     *
     * @param warning_opts { Object }
     * @param warning_opts.code { string } - Required. Unique log id of the
     *     format "ALK####", where "#" is a digit.
     * @param warning_opts.before { string } - Optional. Default is `""`.
     *     Decoration to log before the metadata.
     * @param warning_opts.context { string } - Optional. Default is `""`. Info
     *     about the origin of the logs.
     * @param logs { ...string } - Optional. Default is `undefined`. Explanation
     *     of what happened.
     *
     * @returns { string } Formatted metadata and logs.
     *
     * @example
     * log.warn({
     *   before: "~~~",
     *   code: "ALK00d5",
     *   context: "demo",
     * }, "demo log");
     * // ~~~🔎 ALK00d5 demo WARNING [2024-08-16 00:30:39UTC]: demo log
     * */
    return this._console({
      code: `ALK000w`,
      ...warning_opts,
      level: `warn`, icon: `🔎`, do_throw: false,
    }, ...logs );
  }

  error( error_opts = {}, ...logs ) {
    /** Log errors (messages with the error icon) to the console using
     *      additional metadata and the given logs. Use it in ALKlin test suite
     *      wrapper functionality, like setup and takedown.
     *
     * @param { Object } error_opts
     * @param { string } error_opts.code - Required. Unique log id of the
     *     format "ALK####", where "#" is a digit.
     * @param { string } error_opts.before - Optional. Default is `""`.
     *     Decoration to log before the metadata.
     * @param { string } error_opts.context - Optional. Default is `""`. Info
     *     about the origin of the logs.
     * @param { ...string } logs - Optional. Default is `undefined`. Explanation
     *     of what happened.
     * @param { Error|any } error_opts.error - Default is `undefined`.
     *     `.error()` treats this like an item in `logs` since `.error()`
     *     doesn't throw.
     *
     * @returns { string } Formatted metadata, logs, and, if given, the error.
     *
     * @example
     * log.warn({
     *   before: "~~~",
     *   code: "ALK00d5",
     *   context: "demo",
     *   error: 
     * }, "demo log");
     * // ~~~🤕 ALK00d5 demo WARNING [2024-08-16 00:30:39UTC]: demo log
     * */
    return this._console({
      code: `ALK000e`,
      ...error_opts,
      level: `error`, icon: `🤕`, do_throw: false,
    }, ...logs );
  }

  throw( throw_opts = {}, ...logs ){
    /** Throw the given error option after writing metadata and logs to the
     *    console. Use it in test suite wrapper functionality, like setup and
     *    takedown. Helps us give more meaningful error messages and logs.
     *
     * @param throw_opts { Object }
     * @param throw_opts.code { string } - Required. Unique log id of the format
     *     "ALK####", where "#" is a digit.
     * @param throw_opts.before { string } - Optional. Default is `""`.
     *     Decoration to log before the metadata.
     * @param throw_opts.context { string } - Optional. Default is `""`. Info
     *     about the origin of the logs.
     * @param throw_opts.error { Error|any } - Required. Ideally, an `Error`. An
     *     `Error` keeps the stack trace from the line where the code created
     *     it, so the error message will be more clear. If this value is not an
     *     `Error`, `Log` will turn it into an `Error` before throwing it, which
     *     will make the stack trace harder to read.
     * @param logs { ...string } - Optional. Default is `undefined`. Explanation
     *     of what happened.
     *
     * @returns { None } Throws an error, no return value.
     *
     * @example
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
    this._console({
      code: `ALK000t`, error: new Error(`ALKiln default error`),
      ...throw_opts,
      do_throw: true, level: `error`, icon: `🤕`,
    }, ...logs );
  }

  _save_to_debug_safely( save_debug_opts = {} ) {
    /** Save to the debug file.
     *
     * @param { Object } save_debug_opts
     * @param { string } save_debug_opts.text - Optional. Default is `""`. Str
     *     to save to the debug file.
     * @param { boolean } save_debug_opts.unexpected - Optional. Default is
     *     false. Whether or not to save to the unexpected results file.
     *
     * @returns { string } The same value as given.
     * */
    let { text = ``, unexpected = false } = save_debug_opts;

    // If we have ever failed to append to the debug log in the past, avoid
    // doing so again and avoid logging an error message about it again.
    try {
      if ( this.fs_append_to_debug_file_failed ) {
        console.info( text );
        return text;
      }
    } catch ( console_log_failed_error ) {
      this._warn_unable_to_log( console_log_failed_error );
      return text;
    }

    try {
      fs.appendFileSync( `${ this.path }/${ this.debug_log_filename }`, text + `\n` );
    } catch ( fs_append_error ) {
      // If this is our first time failing to write to the debug log, console
      // warn about it.
      this.fs_append_to_debug_file_failed = true;
      console.warn(`🖊️ ALK0213 internal debug NOTE [${ Date.now() }]: Skipped appending to debug file.`);
      console.warn( fs_append_error );
    }

    try {
      if ( unexpected ) {
        this._save_to_temp_unexpected_file({ text });
      }
    } catch ( error_sending_to_unexpected ) {
      // Do nothing. These values will be in the debug log
    }

    return text;
  }

  _warn_unable_to_log( final_error ) {
    /** The last ditch effort to leave a clue that something went horribly
     *  wrong.
     *
     * @param { any } final_error - Anything that can be logged to the console.
     * */
    try {
      console.warn(
        `🖊️ ALK0229 internal debug NOTE [${ Date.now() }]:`,
        `Skipped logging data to console.`,
        final_error
      );
    } catch ( not_even_console_can_handle_it ) {
      // Nothing to do about it
    }
  }

  _save_to_temp_unexpected_file({ text = `` } = {}) {
    /** Save to the unexpected results file. Intended for errors and warnings.
     *  Catch ANY error.
     *
     * @param { Object } options
     * @param { string } options.text - Optional. Default is `""`. Str to save
     *     to the unexpected results file.
     *
     * @returns { string } The same value as given.
     * */
    try {
      fs.appendFileSync(`${ this.path }/${ this.temp_unexpected_debug_log_filename }`, `${ text }\n` );
    } catch ( error_saving_to_unexpected_results_file ) {
      // Do nothing. At worst, we'll get the data in the debug file or console .
    }
    return text;
  }

  /** `stdout` is currently for test progress summary and reports. */

  stdout(stdout_opts = {}, ...logs) {
    /** Prints in the console inline and saves to the debug log and, in future
     *  the report log. Use for progress summary during test runs and for
     *  reports. Logs are joined with no separator.
     *
     * @param { Object } stdout_opts
     * @param { boolean } stdout_opts.records_only - Optional. Default is
     *     `false`. Whether to only save logs without printing them to the
     *     console. E.g. progress summary characters like those that cucumber is
     *     already printing to the console. logs { ...string } - Optional. Each
     *     argument must be a string.
     * @param logs { ...string } - Optional. Default is `undefined`. Text to
     *     print.
     *
     * @returns { string } String of combined strings.
     *
     * @example
     * log.stdout({ records_only: false }, ".", "." );
     * // ..
     * */
    let {
      records_only = false,
    } = stdout_opts;
    let whole_log = logs.join(``);

    try {

      // Write to the console
      if ( !records_only ) {
        process.stdout.write( whole_log );
      }
      // Write to the debug and report files
      this._record_stdout( whole_log );
    } catch ( stdout_error ) {
      this._save_to_debug_safely({ unexpected: true, text: `🖊️ ALK0227 internal stdout NOTE [${ Date.now() }]: Skipped stdout.`});
      this._save_to_debug_safely({ unexpected: true, text: stdout_error.stack });
    };

    return whole_log;
  }

  _record_stdout(...logs) {
    /** Save stdout output to various debug and report files.
     *
     * @param { ...string } logs - Optional. Default is `undefined`. Strings to
     *     write to debug files.
     *
     * @returns { string } String of combined strings.
     *
     * @example
     * log._record_stdout( ".", "." );
     * // ..
     * */
    // Discuss: Return `log.debug()` value?
    this.debug({ code: `ALK0220`, context: `stdout` }, ...logs);
    let whole_log = logs.join(``);
    // TODO: add this after the report heading (datetime of test, etc.)
    fs.appendFileSync( `${ this.path }/${ this.report_log_filename }`, whole_log );
    return whole_log;
  }

  clear() {
    /** Empty all files possible without deleting them. Never throw. This is
     *     nice to have, but not crucial.
     *
     * @returns { Log } Self.
     * */
    try { fs.writeFileSync( `${ this.path }/${ this.debug_log_filename }`, `` ); }
    catch (error) {}
    try { fs.writeFileSync( `${ this.path }/${ this.report_log_filename }`, `` ); }
    catch (error) {}
    try { fs.writeFileSync( `${ this.path }/${ this.report_filename }`, `` ); }
    catch (error) {}
    try { fs.writeFileSync( `${ this.path }/${ this.unexpected_filename }`, `` ); }
    catch (error) {}
    return this;
  }

}  // Ends Log{}

module.exports = Log;
