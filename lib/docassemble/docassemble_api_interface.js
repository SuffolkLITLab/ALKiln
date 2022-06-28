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
// to specific functions, like `.pull()` which run in a very small
// window.

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
  log.info({ pre: `Waiting for the docassemble server to respond. Will wait for ${ timeout/1000 } seconds at most.` });
  
  try {
    let start_time = Date.now()
    // Axios + server will poll until server is ready or timeout is over
    let response = await _da_REST.get_dev_id( timeout );
    let end_time = Date.now()
    if ( response && response.data && response.data.id ) {
      log.info({ pre: `The docassemble server responded after ${ (end_time - start_time)/1000 } seconds.` });
      return false;
    }

  } catch ( error ) {
    // Timeout means the server is busy.
    if ( is_timeout_error( error ) ) {
      // Anything that's waiting for the server to not be busy does not want
      // to move forward without a free server.
      log.info({ pre: `The docassemble server was still busy after ${ timeout/1000 } seconds.` });
    } else {
      // Not sure what to do for other errors. It could be a server
      // error, like an 'Access Denied' error, which should be handled.
      log.error({
        pre: `Tried to check if the docassemble server was busy, but `
        + `ran into an unexpected error. The error didn't indicate a busy server, though.`
      });
    }

    throw error;
  }
};  // Ends da_i.throw_an_error_if_server_is_not_responding()

// node -e 'require("./lib/docassemble/docassemble_api_interface.js").is_server_responding()'
da_i.is_server_responding = async function ( dev_id_options ) {
  /** Use _da_REST.get_dev_id() to test if server is up.
  *    See https://docassemble.org/docs/api.html#user. */

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
  /** For consistency, wrap _da_REST.get_dev_id().
  *    See https://docassemble.org/docs/api.html#user. */

  // Default timeouts
  let { timeout } = dev_id_options ||  { timeout: DEFAULT_MAX_REQUEST_MS };
  let response = await _da_REST.get_dev_id( timeout );
  return response.data.id;
};  // Ends da_i.get_dev_id();


// node -e 'require("./lib/docassemble/docassemble_api_interface.js").validate_api_key()'
da_i.validate_api_key = async function ( api_key_options ) {
  /** Make sure the api key is the right one for this server.
  *   See https://docassemble.org/docs/api.html#user. */

  log.info({ pre: `Checking the testing account's API key.` });

  // Default timeouts
  api_key_options = api_key_options ||  { timeout: DEFAULT_MAX_REQUEST_MS };

  try {

    // There's only one possible success result
    // As long as this succeeds, we're good
    await _da_REST.get_dev_id( api_key_options.timeout );
    log.info({ pre: `Your testing account's API key is perfectly valid on this server.` });
    return true;

  } catch ( error ) {
    // There's only one possible sever response error
    if ( error.response && error.response.status === 403 ) {
      // Throw in here, or at the caller?
      log.error({
        pre: `The API key in the GitHub secret DOCASSEMBLE_DEVELOPER_API_KEY `
        + `failed on this server with "Access Denied". Are you sure your `
        + `DOCASSEMBLE_DEVELOPER_API_KEY secret is set to the API key for `
        + `the docassemble account that runs the tests on this server? `
        + `Are you sure your SERVER_URL GitHub secret is set to the server `
        + `address on which this testing account exists?`
        + `To update your GitHub secrets, either set this repository's `
        + `secrets at ${ session_vars.get_repo_url() }/settings/secrets `
        + `or ask your GitHub organization admin to set the `
        + `organization's secrets.`
      });
    }  // ends 403 message
    throw error;
  }  // ends try to get dev_id
};  // Ends da_i.validate_api_key()


// node -e 'require("./lib/docassemble/docassemble_api_interface.js").loop_to_create_project()'
da_i.loop_to_create_project = async function( creation_options ) {
  /** Create a docassemble Project on the docassemble server's account.
  *    Loop through potential project names until we find one that
  *    isn't already taken and then use that name to create the Project. */

  // Defaults
  creation_options = creation_options || {};
  let timeout = creation_options.timeout || DEFAULT_MAX_REQUEST_MS;
  let max_tries = creation_options.max_tries || 15;
  let wait_seconds = creation_options.wait_seconds || 5;

  let project_name = null;
  let name_incrementor = 0;

  // Try to create a project. If the project name is already taken, increment and loop again.
  while ( name_incrementor <= max_tries ) {
    name_incrementor++;
    try {

      // Try next name that could be unique. Must remove all non-valid characters
      // TODO: This sanitization is already done in session_vars, so remove it from here
      project_name = session_vars.get_project_base_name().replace(/[^A-Za-z0-9]/g, '') + name_incrementor;
      log.info({ pre: `Trying to create a docassemble Project with the name ${ project_name }` });
      let response = await _da_REST.create_project( project_name, timeout );
      log.info({ pre: `The docassemble server is ready. Created a Project named ${ project_name }` });
      // If succeeded in creating project, return the name that worked
      return project_name;

    } catch ( error ) {
      // TODO: Make a `normalize_ajax_responses_and_errors()`?
      let response = error.response;

      if ( response && response.data ) {
        if ( response.data.includes( `Invalid project` ) ) {
          if ( name_incrementor < max_tries ) {
            // A non-unique project name. Try the next project name.
            continue;

          } else {
            // On the last loop, failed because there were too many project
            // names already taken
            log.error({
              pre: `There were already ${ max_tries } projects with the base `
              + `name ${ session_vars.get_project_base_name() }. If you need to allow `
              + `more, file an issue at https://github.com/SuffolkLITLab/ALKiln/issues.`
            });
            throw( error );
          }

        // ends "Invalid project" error
        } else {
          // Other response errors should be thrown with link to docs
          log.error({
            type: `docassemble ${ response.status } "${ response.data }"`,
            pre: `See https://docassemble.org/docs/api.html#playground_post_project.`
          });
          throw ( error );
        }

      // ends if error.response
      } else {

        // If it's a timeout error, server is busy. Try again after waiting.
        // Why are we using `max_tries` for timeout error as well?
        if ( is_timeout_error( error ) && name_incrementor < max_tries ) {
          log.info({ pre: `The docassemble server was busy when we tried to `
            + `create the Project. Attempt ${ name_incrementor } of `
            + `${ max_tries }. Will try again in ${ wait_seconds } seconds.` });
          name_incrementor--;  // Try this name again next time
          await time.waitForTimeout( wait_seconds * 1000 );
          continue;

        // A non-timeout, non-server error should just be thrown
        } else {
          log.error({ pre: `Ran into unexpected error when trying to create the Project.` });
          throw error;

        }  // ends type of non-response error
      }  // ends type of response error
    }  // ends try
  }  // ends while
};  // Ends da_i.loop_to_create_project()


// node -e 'require("./lib/docassemble/docassemble_api_interface.js").pull()'
da_i.pull = async function ( pull_options ) {
  /** Pull github code into an existing Project. */

  log.info({ pre: `Trying to pull code from the "${ session_vars.get_branch_name() }" branch.` });

  // Default timeouts
  let { timeout } = pull_options ||  { timeout: DEFAULT_MAX_REQUEST_MS };

  try {

    let response = await _da_REST.pull( timeout );

    // If server didn't need to restart
    if ( response && response.status === 204 ) {
      log.info({ pre: `Your Docassemble server finished pulling the package's code.` });
      return null;
    }

    // If server needed to restart because of the pulled code
    if ( response && response.status === 200 ) {
      log.debug({ pre: `Pull task id: ${ response.data.task_id }` });
      return response.data.task_id;
    }

  } catch ( error ) {
    // Pulling should not error
    log.error({ pre: `Pulling into the docassemble Project ran into an unexpected error.` });
    log.debug({ pre: `See https://docassemble.org/docs/api.html#playground_pull.` });
    throw error;
  }
};  // Ends da_i.pull()


// node -e 'require("./lib/docassemble/docassemble_api_interface.js").has_task_finished()'
da_i.has_task_finished = async function ( task_id, options ) {
  /** Check task status if it exists. If not, return true as task did
  *    not require a server restart. See da_i.pull().
  *    See https://docassemble.org/docs/api.html#restart_status. */

  // Defaults
  let { timeout } = options ||  { timeout: DEFAULT_MAX_REQUEST_MS };

  try {

    // If server did need to restart, check if it's done.
    let response = await _da_REST.has_task_finished( task_id, timeout );
    log.debug({ pre: `Task status: ${ response.status }. Docassemble status text: ${ response.data.status }. Task id: ${ task_id }` });
    
    if ( response.data.status === 'completed' ) {
      return true;
    
    } else if ( response.data.status === 'working' ) {
      log.info({ pre: `The docassemble server is uploading the package.` });
      return false;

    } else if ( response.data.status === 'unknown' ) {
      // Server is working, but status 'unknown'? We shouldn't even
      // get here according to the API docs, but it feels weird to have
      // no default behavior. What to return? Throw?
      log.info({
        pre: `\`task_id\` "${ task_id }" has expired. If it's been `
          + `less than 1 hour since the task started, the task is `
          + `complete. See https://docassemble.org/docs/api.html#restart_status.`,
        data: response,
      });
      return null;
    }  // ends status type

  } catch ( error ) {
    // Timeout means the server is busy.
    if ( is_timeout_error( error ) ) {
      log.info({ pre: `The docassemble server is still uploading the package.` });
      return false;
    }

    log.error({ pre: `Tried to check that the package was uploaded, but ran into an unexpected error.` });
    throw error;
  }  // ends try to check for server done restarting

};  // Ends da_i.has_task_finished()


da_i.wait_for_server_to_restart = async ( task_id, options ) => {
  /** Wait for the server to finish restarting in case a module needs to load.
  *     This is a polling function because things may be returned
  *     that aren't equivalent to the server being done with a task. */
  log.info({ pre: `Docassemble is pulling this package. The task_id is `
    + `"${ task_id }". A task_id is usually created for a package `
    + `with a module. It can take a few minutes to finish uploading.` });

  // Base default
  options = options || {};
  // Default timeout
  let timeout = options.timeout || DEFAULT_MAX_REQUEST_MS;
  // Other defaults
  let default_wait_between_loops = 4 * 1000;
  let default_wait_for_response = 1 * 1000;
  let default_max_loops = timeout/( default_wait_between_loops + default_wait_for_response );
  // Actual values
  let wait_between_loops = options.wait_between_loops || default_wait_between_loops;
  let wait_for_response = options.wait_for_response || default_wait_for_response;
  let max_loops = options.max_loops || default_max_loops;

  // Flags for stopping the `while` loop
  let num_tries = 0;
  let done_restarting = false;

  // Why loop instead of one long timeout? Because it might not just hang.
  // We might get a return value that's just `waiting`, meaning the
  // task is not done.
  while ( !done_restarting && num_tries <= max_loops ) {
    num_tries++;
    // Wait only a short time for the task to finish, not the full default timeout
    done_restarting = await da_i.has_task_finished( task_id, { timeout: wait_for_response } );
    if ( !done_restarting ) {
      if ( num_tries < max_loops ) {
        // Show a slightly different message after a number of tries to reassure
        // users we're still paying attention
        let msg_start = `Not yet complete`;
        if ( num_tries > 3 ) { msg_start = `Still not complete`; }

        // When the server is busy, the task timeout causes this loop to actually
        // take 5 seconds to complete, but this only waits for 4. I'm not sure how
        // to make that clear
        log.info({ pre: `${ msg_start }. Check ${ num_tries } of ${ max_loops }. `
          + `Will check again in ${( wait_between_loops + wait_for_response )/1000 } seconds.`
        });
        await time.waitForTimeout( wait_between_loops );

      } else {
        // This is our last round, let's wrap it up
        let server_msg = `ALKiln setup: It seems like the docassemble server `
          + `didn't finish uploading the code after ${ timeout/1000 } `
          + `seconds. Some things you can try: check your server is up, try `
          + `re-running the test, and try pulling the package manually `
          + `into the playground.`;
          // Add link to docs once the docs are more comprehensive
        throw( server_msg );
      }  // ends if ran out of tries
    }  // ends if done_restarting
  }  // ends while not done restarting

  log.info({ pre: `The docassemble server has uploaded your package.` });
};  // Ends da_i.wait_for_server_to_restart()


// Delete the Project
// node -e 'require("./lib/docassemble/docassemble_api_interface.js").delete_project( "create1" )'
da_i.delete_project = async function ( delete_options ) {
  /** Delete a project on the user's da server. */

  // Defaults
  let { timeout } = delete_options ||  { timeout: DEFAULT_MAX_REQUEST_MS };

  let project_name = session_vars.get_project_name()
  log.info({ pre: `Trying to delete Project ${ project_name }` });

  try {

    let response = await _da_REST.delete_project( timeout );
    log.info({ pre: `Deleted Project "${ project_name }"` });

  } catch ( error ) {
    // Status 400
    log.error({ pre: `Ran into an error when deleting Project "${ project_name }"` });
    log.debug({ pre: `See https://docassemble.org/docs/api.html#playground_delete_project.` });
    throw error;
  }

};  // Ends da_i.delete_project()
