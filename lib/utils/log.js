const fs = require('fs');
const session_vars = require( './session_vars' );

// ? 🌈 💡 🔎 😞 🐞

let log = {};
module.exports = log;

let create_msg_start = function ( types, pre='', code=`? ALK0000` ) {
  // ? - unknown (fallback)
  let start = types.join(` `);
  return `${ code } ${ start }: ${ pre }`;
};

log.console = function (to_log) {
  /** Just plain log to the console (in future, to debug log as well).
   *  Usually used for style or cosmetic clarity. */
  console.log(to_log);
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
  // Log them each on a separate line
  console.info( `${ start }` );
  if ( data ) { console.info( data ); }
  if ( post ) { console.info( post ); }
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
  let start = create_msg_start([ type, `ERROR` ], pre, `😞 ${code}` );
  // Log them each on a separate line with extra new lines around the whole thing
  console.error( `\n${ start }` );
  if ( data ) { console.error( data ); }
  if ( post ) { console.error( post, `\n` ); }
};

log.debug = function ({ type='', pre='', data='', post='', verbose=false, code=`ALK0000` }) {
  /** If debugging is turned on, log a message that includes `ALKiln` and `debug` */
  // @ - debug (fallback)
  let start = create_msg_start([ type, 'DEBUG' ], pre, `🐞 ${code}` );
  let full = `\n${ start }`;
  if ( data ) { full += `\n${ data }`; }
  if ( post ) { full += `\n${ post }`; }

  // TODO: Make a verbose log instead of adding to the debug one and always add to it
  if ( verbose ) {
    log.add_to_debug_log( full );
  }

  if ( session_vars.get_debug() ) {
    // Log them each on a separate line
    console.log( `\n${ start }` );
    console.log( data );
    console.log( post );
  }
};

log.add_to_debug_log = function(value) {
  fs.appendFileSync(log.debug_log_file, value);
};

log.debug_log_file = 'debug_log.txt'
