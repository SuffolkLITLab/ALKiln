const fs = require('fs');
const session_vars = require( './session_vars' );

// ? 🌈 💡 🔎 🤕 🐞
// Alternatives: 🩹 ❤️‍🩹 🚑
// TODO: return full message so it can be passed to manually
// thrown errors if needed.

/** TODO:
 * - Don't log to the console for anything?
 * - How do reports factor in?
 * - Store log filename in runtime_config
 * - Everything should log to verbose
 * - Take log file saving out of reports!
 * - Add: Where we save the report, we do log.report() and log in here
 * - Add: log.progress() for the Scenario progress
 * - Capture what prints only in the console? In addition? No infinite loop! Or maybe that's the verbose log
 * - What will log in the console?
 *    - DEBUG will cause headful mode and printing verbose logs to the console? Too coupled?
 *    - debug_log -> reports_log (change action output)
 *    - verbose_log -> debug_log
 *    - There will be no verbose log?
 *
 * - Clarification: 'errors' are not internal ALKiln errors. Internal
 *   errors throw and therefore get logged by cucumber. For a user, these
 *   might look the same. 'errors' in here are feedback to the users in
 *   the report and other associated log files.
 * - Report just prints visually at the right time. Saved in object and,
 *   at the end, saved in file and printed to the console.
 * - Progress printed immediately
 * - Downside
 *
 * - report is pretty
 * - report_log is not pretty, but has the same info as the report
 * - verbose_log is very ugly
 *
 * Reports: scenarios progress, warnings, errors, report output,
 * Regular output is "info"?
 * 3 functionalities:
 * 1. Report:
 * - progress during the run
 * - report saved to a file at the end:
 *   - rows of various kinds
 *   - warnings
 *   - errors
 *   - success
 *   - cucumber errors
 *
 * 2. Saved: "report running log": file built up as the tests go
 * - progress
 * - real-time saved
 *   - rows
 *   - warnings
 *   - errors
 *
 * 3. Different state: Everything logs to the console
 *
 * log.report({ types, code, value })
 *
 * `report.js` can have info, success, warning, error
 * `log.js` can have all that and debug
 * So in the current conception there's log.report({ types: `warning` })
 * Also, there's log.info({ types: `internal setup ...` })
 * Different grammar in the code.
 * Maybe `report` is a type? log.info({ types: `setup report`, ... })
 *
 * or
 *
 * Logs that go into the report vs. logs that only get debugged?
 *
 * program (ALKiln)
 * test (users)
 * execution of test (users) (4 below (shows info))
 *
 * log.unexpected_test_success
 * ~log.unexpected_test_error~
 * ~log.expected_test_success~
 * log.execution.error
 *
 * 1. ALKiln starts running
 * 2. Goes to user's feature files
 * 3. Goes to specified interview
 * Output:
 * 4. Shows user and debugging general info about what happened (see 6 & 7 too)
 *    1. To show to user immediately
 *    2. To show the user later
 *    3. Save in report_log immediately
 *    4. Save in verbose_log immediately
 * Final states of a test:
 * 5. Shows success or failure of user's test's assertions
 *    1. Interview errors expectedly (interview error (debug_log info), user test success (debug_log & report result) (there's a moment when got an error and send to debug, then later assert success and save in report)
 *    2. Interview succeeds expectedly (interview success (debug_log info), user test success, ALKiln report result)
 *    3. Interview errors unexpectedly  (interview error (debug_log info), user test error, ALKiln report)
 *    4. Interview succeeds unexpectedly  (interview success (debug_log info), user test error, ALKiln report)
 * 6. At any time, ALKiln itself may fail unexpectedly (ALKiln error)
 * 7. At any time, ALKiln itself may fail expectedly (ALKiln success)
 * 8. There is context about the display of the text (a row, outcome, heading, etc.)
 * 9. There is context about the context of the message (setup, takedown, cucumber, etc.)
 *
 * Options for keeping context of the type of un-evaluated or expected failures:
 * Have some `type`s that override other `type`s. `info` would
 * override any other type and the other types that are present
 * (`warning`, `error`) would be included in the context (types)
 * list as text, but would not get an icon and would not get all caps.
 * Also/instead, the message may contain that info.
 * or
 * log.info({ types: `error` });
 * Then... log.report.info({ types: `row`/`page_id`/`heading` })?
 * log.report.table(), log.report.heading()  // so cosmetic
 * log.debug.info({ context: `error setup` }), log.debug.warning()
 *
 * Some things always log to the console, others don't.
 *
 * 1. Where to log/save things? (always console, sometimes console, verbose_log, object)
 *     (always always verbose log if possible)
 *       always always console when debugging (everything)
 *     always console
 *     report (and report log) and console at various times (progress while running, full report at end)
 *     just verbose log
 * 2. What to do visually?
 *     indent (report)
 *     lines for e.g. headings (report)
 *     with/without code (report mixed, always in verbose, always in console)
 *     with/without icon (cross? report mixed, always in verbose, always in console)
 *     visual spacer/cosmetic
 *
 * log.info/warning/success/error (console) (with context)
 * log.verbose? debug? debug_info (info, but no console) (with context)
 * log.cosmetic
 * log.report.heading/row/table/page_id/scenario/header/section/warning/error/success
 *   (gather warnings and errors into one list for the end? How to wrap lines?)
 *
 * How to handle indentation?
 *
 * Currently identified wants:
 * Log to the console always: setup or takedown, for github actions and for local tests
 * Log to the console always with stdout to intermingle with cucumber stdout logs: test progress "summary" as each test runs:
 *   Test 1: .............
 *   Test 2: ..
 * - Note: we don't completely control those. Some of those `.`s are logged to the console by a 3rd-party lib, cucumber. Not sure how to capture those at the right points.
 * Log to the console always: the pretty report for all the tests at the end of the test run. It has headings, sections, tables, etc. It should also have different levels of indentation.
 * Log to the console always: (for now) cucumberjs final test results.
 * Save to a `report.txt` file: The test progress, the pretty report, the cucumber results. Maybe the setup and takedown.
 * Save to a '.txt' file always: A running log of the above console output into a .txt file so that if tests stop early, there's still evidence of what happened. Not sure what file name is clear.
 * Save to a '.txt' file always: all logs, including the above as well as many more (usually informational) logs, to a verbose_log.txt as the tests run.
 * Sometimes log absolutely everything to the console. (Remembering that some things are already being logged to the console with stdout and by cucumber and we don't want to double log them)
 * Some of our own logs will just be cosmetic - line separators, spacing, etc. (even for the verbose log)
 * Our own non-cosmetic logs will have an associated log code (e.g. ALK0105). Pretty reports shouldn't have those codes. Other log/printing should make those visible.
 * Our own non-cosmetic logs will have associated icons and status - INFO, SUCCESS, WARNING, ERROR. Different ones can be relevant for different types of logs - console logs and verbose logs probably care about all of them. Reports only sometimes make those visible.
 * Some logs have extra context like 'setup', 'takedown', 'cucumber', 'internal'.
 * Progress "summary" is all on one line for each test. That means logging to stdout and also saving to a file on one line. That's different than the other type of logging.
 *
 * Main question: What does the log interface look like? How do I capture these different pieces of information?
 *
 * More questions:
 * Should error logs also throw the errors? Otherwise you have to do that in 2 lines everywhere you throw an error. (There are ways to capture the stack to point to the relevant lines instead of the line that throws the error.)
 * How do we capture the logs from our GitHub composite actions in the same file as the other verbose logs (and also log them to the console, of course)?
 * How do we capture the running logs (e.g. `.`s) from cucumber? (We already know how to get the final results logs.)
 *
 * Think we have to get rid of cosmetic prints and just work them in. Maybe
 * "pre" comes before the icon/log code bit. `pre, predata, postdata, post`? Hmmm.
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
  let start = create_msg_start([ type, `DEBUG` ], pre, `🐞 ${ code }` );
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
