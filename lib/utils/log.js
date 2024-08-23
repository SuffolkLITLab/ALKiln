const fs = require(`fs`);
const util = require(`node:util`);
const session_vars = require( `./session_vars` );
const time = require(`./time`);
const files = require(`./files`);

// ? 🌈 💡 🔎 🤕 🐛
// Alternatives: 🩹 ❤️‍🩹 🚑
// TODO: return full message so it can be passed to manually
// thrown errors if needed.

/** TODO:
 * - Store log filename in runtime_config
 * - `types` -> `context`
 * - Remove "cosmetic"/"plain" logs and just work that beauty into the logs themselves
 * To note:
 * - report is pretty
 * - report_log is not pretty, but has the same info as the report
 * - verbose_log is very ugly
 *
 * Main question: What does the log interface look like? How do I capture these different pieces of information?
 *
 * More questions:
 * - Should error logs also throw the errors? Otherwise you have to do
 * that in 2 lines everywhere you throw an error. (There are ways to
 * capture the stack to point to the relevant lines instead of the line
 * that throws the error.)
 * - How do we capture the logs from our GitHub composite actions in
 * the same file as the other verbose logs (and also log them to the
 * console, of course)?
 * - How do we capture the running logs (e.g. `.`s) from cucumber? (We
 * already know how to get the final results logs.)
 * - Should we allow "in-between"s for all parts of the log? All together:
 * pre-everything, icon/types/etc., pre-logs, logs (the actual messages to print),
 * pre-data, data, post-data? We can default to nothing for all of those. No,
 * the `logs` arg can take care of most of that.
 * - Should we add a timestamp to each log?
 * - How do we differentiate between methods that log to the console
 * vs. methods that just store data?
 *
 * */

let log = {};
module.exports = log;

let create_msg_start = function ( types, pre='', code=`? ALK0000` ) {
  // ? - unknown (fallback)
  let types_str = types.join(` `);
  if ( types_str.includes(`plain`) ) {
    return pre;
  } else {
    return `${ code } ${ types_str }: ${ pre }`;
  }
};

// Where is this used?
log.success = function ({ type='', pre='', data='', post='', code=`ALK0000` }) {
  /** Log success msg with the given information and strings, prepended with `ALKiln`.
   *  `type` is often something like 'setup', 'takedown', etc. */
  // √ - info (fallback)
  let start = create_msg_start([ type, `SUCCESS` ], pre, `🌈 ${code}` );
  // Log them each on a separate line
  console.info( `${ start }` );
  if ( data ) { console.info( data ); }
  if ( post ) { console.info( post ); }
};

// Where is this used?
log.info = function ({ type='', pre='', data='', post='', code=`ALK0000` }) {
  /** Log info msg with the given information and strings, prepended with `ALKiln`.
   *  `type` is often something like 'setup', 'takedown', etc. */
  // & - info (fallback)
  let start = create_msg_start([ type, `INFO` ], pre, `💡 ${code}` );

  // // Log them each on a separate line
  // console.info( `${ start }` );
  // if ( data ) { console.info( data ); }
  // if ( post ) { console.info( post ); }
};

// Where is this used?
log.warn = function ({ type='', pre='', data='', post='', code=`ALK0000` }) {
  /** Log warning msg with the given information and strings, prepended with `ALKiln`.
   *  `type` is often something like 'setup', 'takedown', etc. */
  // ! - warning (fallback)
  let start = create_msg_start([ type, `WARNING` ], pre, `🔎 ${code}` );
  // Log them each on a separate line
  console.warn( `${ start }` );
  if ( data ) { console.warn( data ); }
  if ( post ) { console.warn( post ); }
};

// Where is this used?
log.error = function ({ type='', pre='', data='', post='', code=`ALK0000` }) {
  /** Log error msg with the given information and strings, prepended with `ALKiln`.
   *  `type` is often something like 'setup', 'takedown', etc. */
  // X - error (fallback)
  let start = create_msg_start([ type, `ERROR` ], pre, `🤕 ${code}` );
  // Log them each on a separate line with extra new lines around the whole thing
  console.error( `\n${ start }` );
  if ( data ) { console.error( data ); }
  if ( post ) { console.error( post, `\n` ); }
};

log.debug = function ({ type='', pre='', data='', post='', verbose=false, code=`ALK0000` }) {
  /** If debugging is turned on, log a message that includes `ALKiln` and `debug` */
  // @ - debug (fallback)
  let start = create_msg_start([ type, `DEBUG` ], pre, `🐛 ${ code }` );
  let full = `\n${ start }`;
  if ( data ) { full += `\n${ data }`; }
  if ( post ) { full += `\n${ post }`; }

  // // TODO: Make a verbose log instead of adding to the debug one and always add to it
  // if ( verbose ) {
  //   log.add_to_debug_log( full );
  // }

  // if ( session_vars.get_debug() ) {
  //   // Log them each on a separate line
  //   console.log( `\n${ start }` );
  //   console.log( data );
  //   console.log( post );
  // }
};

// log.add_to_debug_log = function(value) {
//   fs.appendFileSync(log.debug_log_file, value);
// };

// function stripAnsi(string) {
//   // This regex matches common ANSI escape sequences
//   const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
//   return string.replace(ansiRegex, '');
// }
// const output = [];

log.debug_log_file = `debug_log.txt`;
log.verbose_log_file = `verbose_log.txt`;
log.unexpected_filename = `unexpected_results.txt`;

class Log {
  /** Handles logging to the console and saving to files and reports.
   *  Required argument `{ path }` - the path where the final logs
   *  should be stored.
   *
   * Keeps track of its own time differences if we need multiple
   * loggers. It's a bit premature. This might not need to be a class. */

  report_filename = `report.txt`;
  report_log_filename = `report_log.txt`;
  debug_log_filename = `debug_log.txt`;
  unexpected_filename = `unexpected_results.txt`;

  constructor({ path }) {//, filename }) {
    // this.id = uuid();
    // For elapsed time, see https://nodejs.org/api/console.html#consoletimelabel

    // Make sure folder exists
    if ( path ) { files.make_artifacts_folder( path ); }
    // For local development
    else { path = files.make_artifacts_folder(); }

    this.path = path;
    session_vars.save_artifacts_path_name( this.path );

    this.add_consoles({ path: this.path });
    this.info({
      code: `ALK0215`, contexts: [ `log` ],
      logs: [ `Logs will get saved at ${ this.path }` ],
    });

    // if no given folder, make folder
    // else if given folder doesn't exist, make folder
    // if this name not in runtime_config, save name. Except we
    // can't use `session_vars` because of circular reference.
    // Maybe that should move to `files`
    // Is this the right place for it? Is there a better one?
    // Someplace that can use both log and session vars?
    // `files`? Then we have saving to config in session_vars
    // and `files`...

    // So send path in or create path here? This will, according
    // to current plans, be the second thing after session_vars to
    // be created every time a process starts.


    // // Report
    // this.report_path = `${ this.path }/${ this.report_filename }`;
    // this.report = new Report();
    // Indentation? https://nodejs.org/docs/latest-v18.x/api/console.html#consolegrouplabel
  }

  add_consoles({ path }) {
    /** Note: These consoles add new lines after each write.
     *  See https://nodejs.org/docs/latest-v18.x/api/console.html#new-consoleoptions */
    // This might go in the report obj itself.
    const report_log_stream = fs.createWriteStream(
      // Open stream in "append" mode
      `${ path }/${ this.report_log_filename }`, { flags: `a` }
    );

    this.report_console = new console.Console({
      stdout: report_log_stream, stderr: report_log_stream,
    });
    // debug log
    // console.log(`${ path }/${ this.debug_log_filename }`);
    const debug_log_stream = this.debug_log_stream = fs.createWriteStream(
      // Open stream in "append" mode
      `${ path }/${ this.debug_log_filename }`, { flags: `a` }
    );
    this.debug_console = new console.Console({
      stdout: debug_log_stream, stderr: debug_log_stream,
    });
    debug_log_stream.on('error', (err) => {
      console.error('🌈🌈🌈🌈🌈🌈\nFailed to write log\n🌈🌈🌈🌈🌈\n', err);
    });
    debug_log_stream.on('end', () => {
      console.log('🌈🌈🌈🌈🌈🌈=====\nAll logs flushed.\n🌈🌈🌈🌈🌈🌈=====\n');
    });
    debug_log_stream.write('🌈🌈🌈🌈🌈🌈Log message\n', (err) => {
      if (err) {
        console.error('🌈🌈🌈🌈🌈🌈Failed to write log:', err);
      }
    });
    process.on('exit', (code) => {
      // Attempt to flush and close the stream
      debug_log_stream.end(() => {
        console.log('🌈🌈🌈🌈🌈🌈Debug log stream flushed and closed.🌈🌈🌈🌈🌈🌈');
      });
      // Exit with the given code
      process.exit(...args);
    });
  }

  console( console_opts = {} ) {
    /** Log the logs to the console at the right level and with the metadata.
     * Return the start of the message - the part without the logs
     *
     * Questions:
     * - Allow `logs` to be a string?
     * - Allow `contexts` to be a space-separated string?
     * - Throw errors? Need to manipulate call stack.
     * - Turn logs that are non-strings into `JSON.stringify`d strings?
     *
     * Example:
     *
     * Log = require('./lib/utils/log.js')
     * log = new Log('_alkiln-')
     *
     * log.console();
     * // ? ALK000c console LOG [2024-08-16 00:30:39UTC]:
     *
        log.console({
          level: `info`,
          icon: `&&&`,
          code: `ALK00t1`,
          contexts: [ `a test` ],
          logs: [ `test info log` ]
        });

        try {
          let czar = zoo + 5;
        } catch ( error ) {
          log.console({
            level: `error`,
            before: `===\n===\n`,
            icon: `X`
            code: `ALK00t2`
            contexts: [ `err_test` ]
            logs: [ `error test log 1`, `error test log 2` ]
            error,
          })
        }
     *
     * */
    // // TODO: new signature
    // let [ console_opts, ...logs ] = arguments;
    // // And make contexts a string?
    let {  // Defaults
      level = `log`,
      before =  ``,  // name? above? start_decorator?
      icon = `?`,
      code = `ALK000c`,
      contexts = [ `console` ],
      logs = [],
      error = null
    } = console_opts;

    let formatted_log = this.debug({ level, before, icon, code, contexts, logs, error });

    // Shame to do this in .debug too, but haven't found a
    // better way to return consistent values otherwise.
    const metadata = this.format_metadata({ level, icon, code, contexts });

    // Throw an 'error' error
    if ( level === `error` && error !== null ) {
      console.log( before );  // Log before error
      let custom_msg = this.stringify_logs({ logs: [ metadata, ...logs ] });
      console.log(custom_msg);
      // this.debug_log_stream.end(`\n\n\n\n\nEnding debug log stream\n\n\n\n\n`);
      throw new Error( custom_msg, { cause: error });
    }

    try {
      // Otherwise, log at the given level if console has that method (`log` by default)
      if ( console[ level ]) {
        // Potentially: console[ level ].apply(this, before + metadata, ...logs );
        console[ level ]( before + metadata, ...logs );
      } else {
        // If a non-standard level was passed in, like `success`, use `info` by default
        console.info( before + metadata, ...logs );
      } catch ( console_log_error ) {
      // Fail silently for now
      this.debug({
        level: `error`, icon: `🤕`, code: `ALK0211`,
        contexts: [`internal`],
        logs: [`Tried to console.${ level } the message above`],
        error: console_log_error
      });
    } finally {
      return formatted_log;
    }

  }

  debug( debug_opts = {} ) {
    /** Save in the debug log file and return a string version
     *  of the log. If there are errors, just log them too.
     *  Keep as much info from the caller as possible.
     *
     * Example:
     *
     * Log = require('./lib/utils/log.js')
     * log = new Log('_alkiln-')
     * log.debug()
     * // 🐛 ALK000v debug DEBUG [2024-08-16 00:38:49UTC]:
     * */
    let {
      level=`debug`,
      before = ``,
      icon = `🐛`,
      code = `ALK000v`,
      contexts = [ `` ],
      logs = [],
      error = null,
    } = debug_opts;

    let final_debug_error = null;
    let metadata = ``;
    let with_error = [...logs];
    if ( error ) {
      with_error.push( error );
    }

    try {
      metadata = this.format_metadata({ level, icon, code, contexts });
      if ( console[ level ]) {  // `debug` if no argument
        this.debug_console[ level ]( before + metadata, ...with_error );
      } else {
        this.debug_console.info( before + metadata, ...with_error );
      }

    } catch ( internal_debug_error1 ) {
      console.warn( `🔎 ALK0212 internal WARNING: Unexpected behavior with log.debug_console`, internal_debug_error1 );
    }

    try {
      // Should we break this out into its own error?
      const formatted_log = `${ before }${ metadata }\n`
        + `${ this.stringify_logs({ logs: with_error }) }`;
      return formatted_log;

    } catch ( internal_debug_error2 ) {
      console.warn( `🔎 ALK0213 internal WARNING: Unexpected behavior formatting log in log.debug`, internal_debug_error2 );
      return this.try_to_return_something({
        level, before, icon, code, contexts, logs, error
      });
    }
  }

  format_metadata( metadata_opts = {} ) {
    /** Format and return the log metadata.
     *  Example: 💡 ALK### internal INFO [10:24:40 pm UTC] something:
     * */
    let {
      level=`log`,
      icon = `?`,
      code = `ALK000m`,
      contexts = [ `metadata` ],
    } = metadata_opts;

    let metadata_level = level;
    if ( level === `warn` ) { metadata_level = `warning`; }
    let level_caps = metadata_level.toUpperCase();
    // For elapsed time, see https://nodejs.org/api/console.html#consoletimelabel
    // Should this really be a pretty date, or should it be a raw timestamp?
    let metadata_list = [ icon, code, ...contexts, level_caps, `[${ time.log_date() }]` ];
    let metadata = metadata_list.join(` `) + `:`;
    return metadata;
  }

  stringify_logs(str_log_opts) {
    /** Return a string - a formatted version of the list
     *  of logs by stringifying non-strings. */

    let { logs = [] } = str_log_opts;

    let stringified_logs = ``;
    let prev_line_type = null;

    for ( let log of logs ) {
      if ( log === null || [`string`, `number`, `undefined`, `boolean`].includes( typeof(log) )) {

        stringified_logs += this.stringify_inline({ prev_line_type, log });
        prev_line_type = `inline`;

      } else if ( log instanceof Error ) {
        // A block of text (the error stack) always starts on a new line.
        // Node error stack seems to have all the necessary info.
        stringified_logs += `\n${ log.stack }`;
        prev_line_type = `block`;

      } else {
        stringified_logs += this.stringify_object({ obj: log });
        prev_line_type = `block`;
      }  // ends typeof log
    }  // Ends for logs

    return stringified_logs;
  }

  try_to_return_something({
    level, before, icon, code, contexts, logs, error,
  }) {
    /** Logging had an error. Try building simpler and simpler
     *  output in the hope of returning anything useful. At worst,
     *  return a final error and return something generic. */
    let final_error = '';

    // One by one, try returning whatever it's possible to return
    try {
      // Something wrong with the logic of the code before this?
      let data = [ level, before, icon, code, contexts, logs, error ];
      return this.if_succeed_log_final_error({ data, final_error });
    } catch ( internal_try_to_return_error2 ) {
      final_error = internal_try_to_return_error2;
    }

    try {
      // Something wrong with the `error` object?
      let data = [ level, before, icon, code, contexts, logs ];
      return this.if_succeed_log_final_error({ data, final_error });
    } catch ( internal_try_to_return_error3 ) {
      final_error = internal_try_to_return_error3;
    }

    try {
      // Something wrong with the `logs` object?
      let data = [ level, before, icon, code, contexts, error ];
      return this.if_succeed_log_final_error({ data, final_error });
    } catch ( internal_try_to_return_error4 ) {
      final_error = internal_try_to_return_error4;
    }

    try {
      // Something wrong with both?
      let data = [ level, before, icon, code, contexts ];
      return this.if_succeed_log_final_error({ data, final_error });
    } catch ( internal_try_to_return_error5 ) {
      final_error = internal_try_to_return_error5;
    }

    try {
      // These should all be strings.
      let data = [ level, before, icon, code ];
      return this.if_succeed_log_final_error({ data, final_error });
    } catch ( internal_try_to_return_error6 ) {
      final_error = internal_try_to_return_error6;
    }

    // Still throwing errors? We did the best we could
    console.warn( final_error );
    return `🔎 ALK0214 internal WARNING: Unable to return any logs. Error: ${ final_error }`;
  }

  if_succeed_log_final_error({ data, final_error }) {
    /** There was a problem. If we can stringify this data,
     *  we found the problem - it was the last thing we tried -
     *  so log what broke and return what works. Otherwise,
     *  there is still a problem and this will error correctly. */
    // util.inspect can handle circular references
    let working_stringified_value = util.inspect( data, { depth: 8, });
    // If stringifying failed, we won't get here. If it succeeded,
    // we're done, so we can return a useful error.
    console.warn( final_error );
    return working_stringified_value;
  }

  stringify_inline({ prev_line_type, log }) {
    /** Format an inline log. Mostly involves fiddling with
     *  the start of the string. */
    // An inline log's string starts with nothing if it's the first string...
    let start = ``;
    // ...starts after a space if its next to an inline string...
    if ( prev_line_type === `inline` ) { start = ` `; }
    // ...or starts on a new line if it's after a block of text,
    // like an error or object.
    else if ( prev_line_type === `block` ) { start = `\n`; }
    return `${start}${log}`;
  }

  stringify_object({ obj }) {
    /** Try to stringify an object a few different ways.
     *  TODO: discuss using https://nodejs.org/docs/latest-v18.x/api/util.html#utilinspectobject-options. */
    try {
      // A block of text (the object) always starts on a new line
      // Try to stringify the object.
      return `\n${ JSON.stringify( obj ) }`;
    } catch ( outer_error ) {
      // If that fails, see if it has its own way of stringifying
      try {
        return `${ obj }`;
      } catch ( inner_error ) {
        // Lastly, give at least some information
        return `\nUnable to log this ${ typeof obj }`;
      }  // ends inner try
    }  // ends outer try
  }

  success( success_opts = {} ) {
    /** Console log success - log level with success icon. */
    let {
      code = `ALK000s`,
      before = ``, contexts = [], logs = [],
    } = success_opts;

    return this.console({
      level: `success`, icon: `🌈`,
      before, code, contexts, logs,
    });
  }

  info( info_opts = {} ) {
    /** Console log info. */
    let {
      code = `ALK000i`,
      before = ``, contexts = [], logs = [],
    } = info_opts;

    return this.console({
      level: `info`, icon: `💡`,
      before, code, contexts, logs,
    });
  }

  warn( warning_opts = {} ) {
    /** Console log warning. */
    let {
      code = `ALK000w`,
      before = ``, contexts = [], logs = []
    } = warning_opts;

    return this.console({
      level: `warn`, icon: `🔎`,
      before, code, contexts, logs,
    });
  }

  error( error_opts = {} ) {
    /** Console log and throw error. */
    let {
      code = `ALK000e`,
      before = ``, contexts = [], logs = [],
      error
    } = error_opts;

    return this.console({
      level: `error`, icon: `🤕`,
      before, code, contexts, logs, error
    });
  }

  stdout({ log }) {
    /** Prints in the console inline. */
    process.stdout.write( log );
    // Also write it to the report and the debug log
    return log;
  }

}  // Ends Log{}

module.exports = Log;
