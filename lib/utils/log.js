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

  report_filename = `report.txt`;
  report_log_filename = `report_log.txt`;
  debug_log_filename = `debug_log.txt`;
  unexpected_filename = `unexpected_results.txt`;

  constructor({ path, context } = {}) {
    // this.id = uuid();

    // Make sure folder exists
    if ( path ) { files.make_artifacts_folder( path ); }
    // In local development and ALKilnInThePlayground, this will
    // mostly be called by the `run` command.
    else { path = files.make_artifacts_folder(); }

    this.path = path;
    session_vars.save_artifacts_path_name( this.path );

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

    let {  // Defaults
      level = `log`,
      before =  ``,
      icon = `*`,
      code = `ALK000c`,
      context = ``,
      error = null,  // More than just metadata
      do_throw = false,  // More than just metadata
    } = console_opts;

    // Should not be able to throw errors
    let formatted = this.debug({ level, before, icon, code, context, error, do_throw }, ...logs );
    let metadata_str = this._format_metadata({ level, icon, code, context });
    error = this._get_Error_or_null({ maybe_error: error, do_throw });

    // Throw whatever we can throw
    if ( do_throw ) {
      // WARNING: If someone catches this error, the console logs will be confusing
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
      throw error;
    }

    // Avoid using custom-formatted logs and error here.
    // Let the console show them as it wants.
    try {
      // log at the given level if console has that method (`log` by default)
      // If a non-standard level was passed in, like `success`, use `info` by default

      // if ( !console[ level ]) { level = `info`; }
      level = `info`;

      // Combine error as the last log if it exists
      let with_error = this._combined_list_of_logs_and_possible_error({ logs, maybe_error: error });
      console[ level ]( before + metadata_str, ...with_error );

    } catch ( console_log_error ) {
      // Fail silently
      this.debug({
        level: `warn`, icon: `🔎`, code: `ALK0211`,
        context: `internal`,
        error: console_log_error
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
     * TODO: Log warning with stack trace?
     * function stackTrace() { return (new Error()).stack; }
     * and
     * https://stackoverflow.com/a/41820537/14144258
     * var mystring=require('util').inspect(error_object);
     *
     * @examples:
     *
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
      error = null,
      do_throw = false,
    } = debug_opts;

    let formatted = `Formatted log string placeholder`;
    try {
      let logging_errors = [];

      // Should not be able to throw an error
      let metadata_str = this._format_metadata({ level, icon, code, context });
      // Include error as the last log if it exists
      error = this._get_Error_or_null({ maybe_error: error, do_throw });
      let with_error = this._combined_list_of_logs_and_possible_error({ logs, maybe_error: error });

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
        if ( `warn error`.includes( level ) || error instanceof Error ) {
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
     *  Avoid ALL errors.
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
      } catch {
        try {
          console.warn( `${ icon } ${ code } ${ context } WARNING [${ Date.now() }]: ${ msg }`, metadata_error );
        } catch (ignore_error) {}
      }
    }
    return metadata_str;
  }

  _stringify_logs(str_log_opts = {}) {
    /** Return a string - a formatted version of the list
     *  of logs by stringifying non-strings. An empty list
     *  or no argument is valid. */
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

  _combined_list_of_logs_and_possible_error({ logs=[], maybe_error=null }) {
    /** Return a list combining those objects if appropriate */
    try {
      let with_error = [...logs];
      if ( maybe_error !== null && maybe_error !== undefined ) {
        with_error.push( maybe_error );
      }
      return with_error;
    } catch ( combining_error ) {
      return [ ...logs, `Could not combine logs list with error`, combining_error.stack ];
    }
  }

  _get_Error_or_null({ maybe_error=null, do_throw=false }) {
    /** Return either an instance of Error or null. */
    try {
      if ( do_throw || ( maybe_error !== null && maybe_error !== undefined )) {
        if ( maybe_error instanceof Error ) {
          return maybe_error;
        } else {
          return new Error( maybe_error );
        }
      } else {
        return null;
      }
    } catch ( get_Error_or_null_error ) {
      // How do we show this error?
      return maybe_error;
    }
  }

  success( success_opts = {}, ...logs ) {
    /** Console log success - log level with success icon. */
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
    /** Console log info. */
    let {
      code = `ALK000i`, before = ``, context = ``,
    } = info_opts;
    return this.console({
      level: `info`, icon: `💡`,
      before, code, context,
    }, ...logs);
  }

  warn( warning_opts = {}, ...logs ) {
    /** Console log warning. */
    let {
      code = `ALK000w`, before = ``, context = ``
    } = warning_opts;
    return this.console({
      level: `warn`, icon: `🔎`,
      before, code, context,
    }, ...logs);
  }

  throw( throw_opts = {}, ...logs ){
    /** Console log and throw error.
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

  _save_to_unexpected({ text = `` } = {}) {
    /** Save to the unexpected results file. Intended for errors and warnings. */
    fs.appendFileSync(`${ this.path }/${ this.unexpected_filename }`, `\n${ text }` );
  }

  stdout(stdout_opts = {}, ...logs) {
    /** Prints in the console inline and saves to the debug log
     *  and the report log.
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
