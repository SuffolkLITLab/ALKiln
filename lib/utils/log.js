const fs = require('fs');
const session_vars = require( './session_vars' );
const time = require(`./time`);

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

  if ( session_vars.get_debug() ) {
    // Log them each on a separate line
    console.log( `\n${ start }` );
    console.log( data );
    console.log( post );
  }
};

// log.add_to_debug_log = function(value) {
//   fs.appendFileSync(log.debug_log_file, value);
// };

log.debug_log_file = `debug_log.txt`;
log.verbose_log_file = `verbose_log.txt`;
log.unexpected_filename = `unexpected_results.txt`;

class Log {
  /** Handles logging to the console and saving to files and reports.
   *
   * Keeps track of its own time differences if we need multiple
   * loggers. It's a bit premature. This might not need to be a class. */

  report_filename = `report.txt`;
  report_log_filename = `report_log.txt`;
  verbose_log_filename = `verbose_log.txt`;

  constructor( logs_path ) {
    // this.id = uuid();
    // For elapsed time, see https://nodejs.org/api/console.html#consoletimelabel

    // Make sure files exist
    this.path = logs_path;
    this.report_path = `${ logs_path }/${ this.report_filename }`;
    this.add_consoles({ path: logs_path });

    // // Report
    // this.report = new Report();
    // Indentation? https://nodejs.org/docs/latest-v18.x/api/console.html#consolegrouplabel
  }

  add_consoles({ path }) {
    /** Note: These consoles add new lines after each write.
     *  See https://nodejs.org/docs/latest-v18.x/api/console.html#new-consoleoptions */
    // This might go in the report obj itself.
    const report_log_stream = fs.createWriteStream(`${ path }/${ this.report_log_filename }`);
    this.report_console = new console.Console({
      stdout: report_log_stream, stderr: report_log_stream,
    });
    // Verbose verbose log
    const verbose_log_stream = fs.createWriteStream(`${ path }/${ this.verbose_log_filename }`);
    this.verbose_console = new console.Console({
      stdout: verbose_log_stream, stderr: verbose_log_stream,
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
     * let log = new Log(`.`);
        log.console({
          level: `info`,
          icon: `&&&`,
          code: `ALK0111`,
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
            code: `ALK0222`
            contexts: [ `err_test` ]
            logs: [ `error test log 1`, `error test log 2` ]
            error,

          })
        }
     *
     *  */
    let {
      level=`log`,
      before= ``,  // name? above? start_decorator?
      icon=`?`,
      code=`ALK0000`,
      contexts=[ `internal` ],
      logs=[],
      error=null
    } = console_opts;

    // If nothing else, write the log to the verbose file
    const console_string = this.verbose({ before, code, contexts, logs, error });

    // log data or throw the error
    const metadata = this.format_metadata({ level, icon, code, contexts });  // shame to do this in multiple places
    if ( level === `error` && error !== null ) {
      let custom_msg = this.stringify_logs({ logs: [ before + metadata, ...logs ] });
      throw new Error( custom_msg, { cause: error });
    } else {
      console[level]( before + metadata, ...logs );
    }

    return console_string;
  }

  // log.verbose.info
  verbose( verbose_opts = {} ) {
    /** Save in the verbose log file. If there are errors only
     *  log them, avoid throwing them.
     * */
    let {
      before = ``,
      code = `ALK0000`,
      contexts = [ `internal` ],
      logs = [],
      error = null,
    } = verbose_opts;

    console.log( code );
    const icon = `🐛`;  // add other icons?
    const metadata = this.format_metadata({ level: `debug`, icon, code, contexts });

    let with_error = [...logs];
    if ( error ) { with_error.push( error ); }

    console.log( Object.keys( this ));

    this.verbose_console.log( before + metadata, ...with_error );
    const formatted_log = `${ before }${ metadata }\n`
      + `${ this.stringify_logs({ logs: with_error }) }`;
    return formatted_log;
  }

  format_metadata( metadata_opts = {} ) {
    /** Format and return the log metadata.
     *  Example: 💡 ALK### internal INFO [10:24:40 pm UTC] something:
     * */
    let {
      level=`log`,
      icon = `?`,
      code = `ALK0000`,
      contexts = [ `internal` ],
    } = metadata_opts;

    let type_caps = level.toUpperCase();
    // For elapsed time, see https://nodejs.org/api/console.html#consoletimelabel
    // Should this really be a pretty date, or should it be a raw timestamp?
    let metadata_list = [ icon, code, ...contexts, type_caps, `[${ time.log_date() }]` ];
    let metadata = metadata_list.join(` `) + `:`;
    return metadata;
  }

  stringify_logs({ logs=[] }) {
    /** Return a string - a formatted version of the list
     *  of logs where non-strings are stringified. */

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
    /** Try to stringify an object a few different ways. */
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

  success() {
    /** Console log success - log level with success icon. */
    `🌈`
  }

  info() {
    /** Console log info. */
    `💡`
  }

  warning() {
    /** Console log warning. */
    `🔎`
  }

  error() {
    /** Console log error and throw. */
    `🤕`
  }

  stdout({ log }) {
    /** Prints in the console inline. */
    process.stdout.write( log );
    // Also write it to the report and the dev log
    return log;
  }

}  // Ends Log{}

module.exports = Log;
