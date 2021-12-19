let session = require( './session' );

let log = {};
module.exports = log;

log.error = function ( error='', docs_url='' ) {
  if ( typeof error === 'object' && error.response && error.response.status ) {
    console.log( `Docassemble API error log ${ error.response.status }: ${ error.response.data } See ${ docs_url } for more details.` );
  } else {
    console.log( `ALKiln experienced an error:` );
    console.log( error );
  }
};  // Ends log.error()

log.debug = function ({ type='', pre='', data='', post='' }) {
  /* If debugging is turned on, log a message that includes `ALKiln` and `debug` */
  if ( session.get_debug() ) { console.log( `ALKiln ${ type } debug: ${ pre }`, data, post ); }
}

log.info = function ({ type='', pre='', data='', post='' }) {
  /* Log info with the given information and strings, prepended with `ALKiln`. */
  console.info( `ALKiln ${ type }: ${ pre }`, data, post );
}
