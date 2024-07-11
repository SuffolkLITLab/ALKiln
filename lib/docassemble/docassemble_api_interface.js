const _da_REST = require('./docassemble_api_REST');
const log = require('../utils/log');
const session_vars = require('../utils/session_vars' );
const time = require('../utils/time');

// Temp notes:
// Do we need to respond if the dev api key expires in the middle of
//    everything? [Answer: the docs don't give an expiration date, so that would
//    only happen if they deleted it in the middle. Which we shouldn't handle?]
// General: How/when do we check if server is busy? Just on error? What about
//    all kinds of race conditions? Probably not something we can overcome. Just
//    do it before trying to load a page.

// TODO: How can we test busy server stuff properly? Especially down
// to specific functions, which can run in a very small
// window.

// TODO: Move get_dev_id() and such into here instead of in
// docassemble_REST - args should be the same vals as the request expects

/** Notes:
* - Checking for a busy server is vulnerable to race conditions, but
*    there's nothing we can do about that.
*
* Axios response structures:
* 
* 204 for creating project)
* {
*   status: 204,
*   statusText: 'NO CONTENT',
*   data: '',
* }
* 
* 200 working on it)
* {
*   status: 200,
*   statusText: 'OK',
*   data: { status: 'working'/'completed' }
* }
* 
* 
* Axios error structures:
* 
* response timeout server request)
* {
*   code = 'ECONNABORTED'
*   response: undefined,
*   isAxiosError: true,
* }
* 
* access denied
* {
*   response: {
*     status: 403,
*     statusText: 'FORBIDDEN',
*     data: 'Access denied.',
*   }
* }
*/

let da_i = {};
module.exports = da_i;


// Constants
const DEFAULT_MAX_REQUEST_MS = session_vars.get_setup_timeout_ms();


let is_timeout_error = function( error ) {
  /** Return whether the error is an axios timeout error.
  * See:
  *    Check on https://github.com/axios/axios/issues/1543#issuecomment-558166483 (2019)
  *    and https://github.com/axios/axios/issues/1174#issuecomment-349014752 (2017)
  */
  if ( error.message && error.message.includes( `timeout` ) ) {
    return true;
  }
  return false;
};


// node -e 'require("./lib/docassemble/docassemble_api_interface.js").throw_an_error_if_server_is_not_responding()'
da_i.throw_an_error_if_server_is_not_responding = async function ( options ) {
  /** Make a request to the server to see if it's responding.
  *    It doesn't matter what the request is, as long as it doesn't
  *    cause a server restart.
  *    This is currently meant for puppeteer tests, not for here.
  *
  *    If we do add a loop to poll the server, we can add it in here:
  * let { time_per_loop, max_loops } = options || { time_per_loop: 5 * 1000, max_loops: 15 };
  */

  // Defaults
  let { timeout } = options || { timeout: DEFAULT_MAX_REQUEST_MS };
  log.info({ type: `da api`, code: `ALK0166`, pre: `Waiting for the docassemble server to respond. Will wait for ${ timeout/1000 } seconds at most.` });
  
  try {
    let start_time = Date.now()
    // Axios + server will poll until server is ready or timeout is over
    let response = await _da_REST.get_dev_id( timeout );
    let end_time = Date.now()
    if ( response && response.data && response.data.id ) {
      log.info({ type: `da api`, code: `ALK0167`, pre: `The docassemble server responded after ${ (end_time - start_time)/1000 } seconds.` });
      return false;
    }

  } catch ( error ) {
    // Timeout means the server is busy.
    if ( is_timeout_error( error ) ) {
      // Anything that's waiting for the server to not be busy does not want
      // to move forward without a free server.
      log.info({ type: `da api`, code: `ALK0168`, pre: `The docassemble server was still busy after ${ timeout/1000 } seconds.` });
    } else {
      // Not sure what to do for other errors. It could be a server
      // error, like an 'Access Denied' error, which should be handled.
      log.error({
        type: `da api`,
        code: `ALK0169`,
        pre: `Tried to check if the docassemble server was busy, but `
        + `ran into an unexpected error. The error didn't indicate a busy server, though. Error message:\n`
        + error
      });
    }

    throw error;
  }
};  // Ends da_i.throw_an_error_if_server_is_not_responding()

// node -e 'require("./lib/docassemble/docassemble_api_interface.js").is_server_responding()'
da_i.is_server_responding = async function ( dev_id_options ) {
  /** For non-playground interviews, use _da_REST.get_dev_id() to
  *    return if server is up. Otherwise, return true.
  *    See https://docassemble.org/docs/api.html#user. */

  // Playground interview will itself timeout. No way to detect that.
  if ( session_vars.get_origin() === 'playground' ) {
    return true;
  }

  // Default timeouts
  let { timeout } = dev_id_options ||  { timeout: DEFAULT_MAX_REQUEST_MS };
  try {
    let response = await _da_REST.get_dev_id( timeout );
    if ( response && response.data && response.data.id ) {
      return true;
    } else {
      return false;
    }
  } catch ( error ) {
    return false;
  }
};  // Ends da_i.is_server_responding();

// node -e 'require("./lib/docassemble/docassemble_api_interface.js").get_dev_id()'
da_i.get_dev_id = async function ( dev_id_options ) {
  /** Get user id, either from the server or from env vars (for Playground runs).
  *    See https://docassemble.org/docs/api.html#user.
  * 
  * @param dev_id_options {obj} Options for getting dev_id
  * @param dev_id_options.timeout {int} Required if options is defined. Max MS
  *    to allow for server request.
  */

  let dev_id = null;

  // For tests running in the dev Playground, use the appropriate env var
  if ( session_vars.get_origin() === 'playground' ) {
    dev_id = session_vars.get_user_id();

  } else {
    // Default timeouts
    let { timeout } = dev_id_options ||  { timeout: DEFAULT_MAX_REQUEST_MS };
    let response = await _da_REST.get_dev_id( timeout );
    dev_id = response.data.id;
  }
  
  return dev_id;
};  // Ends da_i.get_dev_id();

da_i.get_api_key_access_status = async function ({ timeout = null, api_key = null }) {
  /** Check if the API key has minimal authorization on the server.
  *    See https://docassemble.org/docs/api.html#api_user_api_get.
  *
  * @param options {obj} Options for getting authorization of the API key
  * @param options.api_key {str | null} Required. The API key to test.
  * @param options.timeout {int | null} Optional. Max MS
  *    to allow for server request.
  */

  let auth_data = {
    codes: [ 1 ],
    has_auth: null,
    messages: [`API key authorization is not yet determined.`],
    error: null
  }

  // Skip this for tests run from ALKilnInThePlayground
  if ( session_vars.get_origin() === 'playground' ) {
    auth_data.codes.push( 2 );
    auth_data.messages.push( `API keys are unnecessary for tests run in the Playground.` );
  }

  if ( typeof api_key !== `string` ) {
    auth_data.codes.push( 3 );
    auth_data.messages.push( `The given API key is not a string. Type: ${ typeof api_key }`);
  }

  if ( auth_data.codes.length === 1 ) {
    // Default timeouts
    timeout = timeout || DEFAULT_MAX_REQUEST_MS;
    try {
      let response = await _da_REST.get_api_key_info( timeout, {
        api_key,
        server_url: session_vars.get_da_server_url(),
      });
      auth_data.has_auth = true;
      auth_data.codes = [ 6 ];
      auth_data.messages = [ `This API key has at least basic authorization on this server.` ];

    } catch ( error ) {
      auth_data.error = error;
      if ( error.status === 403 ) {
        auth_data.has_auth = false;
        auth_data.codes = [ 4 ];
        auth_data.messages = [ `This API is unverified on this server. It is probably missing or has been deleted.` ];
      } else {
        // Note on 404, non-existent key: 404 == 403 - Since we're using the
        // key itself to get its own info, if it doesn't exist, we'll get 403
        auth_data.codes = [ 5 ];
        auth_data.messages = [ `This API key threw a non-403 error.` ];
      }  // ends error status
    }  // ends try
  }  // ends auth_data.codes only has the first code

  log.debug({ type: `da api info`, code: `ALK0202`,
    pre: `API key authentication info`, data: auth_data });

  return auth_data;
};  // Ends da_i.get_api_key_access_status()

// node -e 'require("./lib/docassemble/docassemble_api_interface.js").delete_project( "create1" )'
da_i.delete_project = async function ( delete_options ) {
  /** Delete a project on the user's da server. Do we need to watch
  *   for a timeout? */

  // Defaults
  let { timeout } = delete_options || { timeout: DEFAULT_MAX_REQUEST_MS };

  let project_name = session_vars.get_project_name()
  log.info({ type: `da api`, code: `ALK0170`, pre: `Trying to delete Project ${ project_name }` });

  try {
    let response = await _da_REST.delete_project( timeout );
    log.info({ type: `da api`, code: `ALK0171`, pre: `Deleted Project "${ project_name }"` });
  } catch ( error ) {
    let msg = `Ran into an error when deleting Project "${ project_name }". See https://docassemble.org/docs/api.html#playground_delete_project.`
    log.error({ type: `da api`, code: `ALK0172`, pre: msg });
    log.debug({ type: `da api`, code: `ALK0173`, pre: msg });
    throw error;
  }

};  // Ends da_i.delete_project()

// node -e 'require("./lib/docassemble/docassemble_api_interface.js").quietly_try_to_delete_interviews(...)'
da_i.quietly_try_to_delete_interviews = async function ({ interviews = {}, api_keys = [], options = {} }) {
  /** Try to delete the given interviews. Fail silently. Example failure: the test
   *    did not log in any users and the testing account's role prevents
   *    access to other user's interviews. Do we need to watch for a timeout? */

  // Defaults
  let { timeout } = options || { timeout: DEFAULT_MAX_REQUEST_MS };

  let responses = [];
  for ( let id in interviews ) {
    let interview = interviews[ id ];
    if ( interview && interview.uid ) {
      let sub_responses = await da_i.quietly_delete_one_interview( timeout, {
        interview,
        api_keys
      });
      responses.push( sub_responses );
    } else {
      log.debug({ type: `da api info`, code: `ALK0191`, pre: `There is no interview to delete.` });
    }
  }
  return responses;
};  // Ends da_i.quietly_try_to_delete_interviews()

// node -e 'require("./lib/docassemble/docassemble_api_interface.js").quietly_delete_one_interview(...)'
da_i.quietly_delete_one_interview = async function ( timeout, { interview = {}, api_keys = [] }) {
  /** Try to delete an interview using all available API keys. Fail silently.
   *    Example failure: the test did not log in any users and the testing
   *    account's role prevents access to other user's interviews. */

  let responses = [];
  for ( let api_key of api_keys ) {
    try {
      log.debug({ type: `da api info`, code: `ALK0188`,
        pre: `Trying to delete the interview with the id ${ interview.uid } and an API key.`
      });

      // Actual work:
      let response = await _da_REST.delete_interview( timeout, {
        session: interview.uid,
        api_key
      });
      responses.push( response );

      log.debug({ type: `da api info`, code: `ALK0189`,
        pre: `No error when trying to delete interview ${ interview.uid } at ${ interview.i }.`
      });
    } catch ( error ) {
      error.interview = interview;
      let msg = `Error when deleting the interview. See https://docassemble.org/docs/api.html#session_delete.`
      log.debug({ type: `da api info`, code: `ALK0190`, pre: msg, data: error });
    }
  }  // ends for api keys
  return responses;
};  // Ends da_i.quietly_delete_one_interview()

// node -e 'require("./lib/docassemble/docassemble_api_interface.js").get_interviews(...)'
da_i.get_interviews = async function ({ interviews = {}, api_keys = [], options = {} }) {
  /** Return an object of interviews that exist on the server
   *    that match the given interviews. Keys are the session ids. */

  let fetched_interviews = {};
  if ( interviews ) {
    for ( let id in interviews ) {
      let interview = interviews[ id ];
      let fetched = await da_i.get_interview({ interview, api_keys, options });
      if ( fetched && fetched.session ) {
        fetched_interviews[ fetched.session ] = fetched;
      }
    }
  }  // ends if interviews

  return fetched_interviews;
};  // Ends da_i.get_interviews()

// node -e 'require("./lib/docassemble/docassemble_api_interface.js").get_interview(...)'
da_i.get_interview = async function ({ interview = {}, api_keys = [], options = {} }) {
  /** Try to get an interview from the server that matches the given interview data. */

  // Defaults
  let { timeout } = options || { timeout: DEFAULT_MAX_REQUEST_MS };

  if ( interview && interview.uid ) {
    for ( let api_key of api_keys ) {
      try {
        log.debug({ type: `da api info`, code: `ALK0192`, pre: `Trying to get the interview with the id ${ interview.uid } and an API key.` });

        // Actual work:
        let response = await _da_REST.get_interview( timeout, {
          session: interview.uid,
          api_key
        });

        if ( response && response.data && response.data.items && response.data.items[0] && response.data.items[0].session ) {
          log.debug({ type: `da api info`, code: `ALK0193`, pre: `Status ${ response.status }. Got ${ response.data.items[0].session }.`});
          return response.data.items[0];
        } else {
          log.debug({ type: `da api info`, code: `ALK0194`, pre: `Status ${ response.status }. Cannot find ${ interview.uid }`});
        }

      } catch ( error ) {
        error.interview = interview;
        let msg = `${ error.status || `No error.status.` } ${ error.statusText || error.data || `No error.statusText.` } Ran into an error when getting the interview ${ interview.uid }. See https://docassemble.org/docs/api.html#interviews.`
        log.debug({ type: `da api info`, code: `ALK0195`, pre: msg, data: error });
      }
    }  // ends for api_keys
  } else {
    log.debug({ type: `da api info`, code: `ALK0196`, pre: `There is no interview to get.` });
  }

  return null;
};  // Ends da_i.get_interview()
