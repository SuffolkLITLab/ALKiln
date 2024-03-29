const fs = require('fs');
const session_vars = require( './session_vars' );

let log = {};
module.exports = log;

let create_msg_start = function ( types, pre='' ) {
  let parts = [ `ALKiln`, ...types ];
  let start = parts.join(` `);
  return `${ start }: ${ pre }`;
};

log.info = function ({ type='', pre='', data='', post='' }) {
  /* Log info msg with the given information and strings, prepended with `ALKiln`.
  *    `type` is often something like 'setup', 'takedown', etc. */
  let start = create_msg_start([ type ], pre );
  // Log them each on a separate line
  console.info( `${ start }` );
  if ( data ) { console.info( data ); }
  if ( post ) { console.info( post ); }
};

log.warn = function ({ type='', pre='', data='', post='' }) {
  /* Log warning msg with the given information and strings, prepended with `ALKiln`.
  *    `type` is often something like 'setup', 'takedown', etc. */
  let start = create_msg_start([ type, `WARNING` ], pre );
  // Log them each on a separate line
  console.warn( `${ start }` );
  if ( data ) { console.warn( data ); }
  if ( post ) { console.warn( post ); }
};

log.error = function ({ type='', pre='', data='', post='' }) {
  /* Log error msg with the given information and strings, prepended with `ALKiln`.
  *    `type` is often something like 'setup', 'takedown', etc. */
  let start = create_msg_start([ type, `ERROR` ], pre );
  // Log them each on a separate line with extra new lines around the whole thing
  console.error( `\n${ start }` );
  if ( data ) { console.error( data ); }
  if ( post ) { console.error( post, `\n` ); }
};

log.debug = function ({ type='', pre='', data='', post='', verbose=false }) {
  /* If debugging is turned on, log a message that includes `ALKiln` and `debug` */
  if ( session_vars.get_debug() || verbose ) {
    let start = create_msg_start([ type, 'debug' ], pre );
    let full = `\n${ start }`;
    // Log them each on a separate line
    console.log( `\n${ start }` );
    if ( data ) {
      full += `\n${ data }`;
      console.log( data );
    }
    if ( post ) {
      full += `\n${ post }`;
      console.log( post );
    }
    // TODO: Make a verbose log instead of adding to the debug one and always add to it
    if ( verbose ) {
      log.add_to_debug_log( full );
    }
  }
};

log.add_to_debug_log = function(value) {
  fs.appendFileSync(log.debug_log_file, value);
};

log.debug_log_file = 'debug_log.txt'
