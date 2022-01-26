const session_vars = require( './session_vars' );

let log = {};
module.exports = log;

let create_msg_start = function ( types, pre='' ) {
  let start = `ALKiln`;
  for ( let type of types ) {
    if ( type ) { start += ` ${ type }`; }
  }
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

log.debug = function ({ type='', pre='', data='', post='' }) {
  /* If debugging is turned on, log a message that includes `ALKiln` and `debug` */
  if ( session_vars.get_debug() ) {
    let start = create_msg_start([ type, 'debug' ], pre );
    // Log them each on a separate line
    console.log( `ALKiln ${ type } debug: ${ pre }` );
    if ( data ) { console.log( data ); }
    if ( post ) { console.log( post ); }
  }
};
