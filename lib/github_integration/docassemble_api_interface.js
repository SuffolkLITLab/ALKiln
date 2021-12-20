const da = require('../utils/docassemble_api');
const log = require('../utils/log');
const session_vars = require('../utils/session_vars' );
const time = require('../utils/time');

// Temp notes:
// Where should we throw errors?
// Where should we log what?
// Do we need to respond if the dev api key expires in the middle of everything?
// General: How/when do we check if server is busy? Just on error? What about
//    all kinds of race conditions?
// response has data and status. error has repsonse

let dai = {};
module.exports = dai;


let is_timeout_error = function( error ) {
  /* Return whether the error is an axios timeout error.
  *    Check on https://github.com/axios/axios/issues/1543#issuecomment-558166483 (2019)
  *    and https://github.com/axios/axios/issues/1174#issuecomment-349014752 (2017)*/
  if ( error.message && error.message.includes( `timeout` ) ) {
    return true;
  }
  return false;
};


// node -e 'require("./lib/github_integration/docassemble_api_interface.js").server_is_busy()'
dai.server_is_busy = async function ( timeout=5000 ) {
  /* Make an arbitrary request to the server to see if it's responding. */
  // What is response when server isn't ready? Undefined?
  try {
    let id = await da.get_dev_id( timeout );
    if ( typeof id != 'string' ) { throw id; }
    log.debug({ pre: `Server responded!` });
    return false;

  } catch ( error ) {
    // Timeout means the server is busy.
    if ( is_timeout_error( error ) ) {
      log.info({ pre: `Server is busy.` });
      return true;
    }
    // Not sure what to do foor other errors
    if ( session_vars.get_debug() ) { log.error( error, `Tried to ping the server, but ran into an error.` ); }
    return true;
  }
};  // Ends server_is_busy()


// // For timeout type functionality, can we just wait for a longer timeout?
// // Doesn't that ping the server repeatedly?
// dai.loop_func_on_server_timeout = async function ( callback, options ) {
//   /* If server is busy, call same async function again? Some number of times? */
//   let default_opts = { timeout: 5000, max_tries: 15, wait_seconds: 5 };
//   let { timeout, max_tries, wait_seconds } = options || default_opts;

//   let num_tries = 0;
//   let is_busy = true;
//   let result = null;

//   while ( is_busy && num_tries <= max_tries ) {
//     num_tries = num_tries + 1;

//     is_busy = await dai.server_is_busy( timeout );
//     if ( is_busy ) {

//       // Try again after waiting
//       await time.waitForTimeout( wait_seconds * 1000 );
//       try {
//         result = await callback();
//       } catch ( error ) {

//         // If it's a timeout error and we still have loops left to try, loop
//         if ( is_timeout_error( error ) && num_tries < max_tries ) {
//           log.info({ pre: `Server is busy.` });
//           continue;
//         // If it's not a timeout error, or we're not allowed to keep looping, throw
//         } else { throw error; }

//       }  // ends try/catch
//     }  // ends if busy
//   }  // ends while

//   // If possible, return the result of the desired function
//   return result;
// };  // Ends loop_func_on_server_timeout();


// // node -e 'require("./lib/github_integration/docassemble_api_interface.js").is_api_key_working()'
// dai.is_valid_api_key = function ( timeout=3000 ) {
//   /* Make sure the api key is working */
//   // 'Access denied'
// };  // Ends is_valid_api_key()


// // node -e 'require("./lib/github_integration/docassemble_api_interface.js").loop_to_get_dev_id()'
// dai.loop_to_get_dev_id = async function ( timeout=3000 ) {
//   /* Get docassemble developer id. Also used to check if
//   *    the server is up and available. */
//   try {

//     let response = await dai.loop_func_on_server_timeout(()=>{
//       return await da.get_dev_id( timeout );
//     });
//     log.debug({ pre: `User id: ${ response.data.id }` });
//     return response.data.id;

//   } catch (error) {
//     log.debug({ pre: `https://docassemble.org/docs/api.html#user`, data: error });
//     throw error;
//   }
// };  // Ends dai.loop_to_get_dev_id()


// // node -e 'require("./lib/github_integration/docassemble_api_interface.js").create_project( "create1" )'
// dai.create_project = async function ( project_name, timeout=3000 ) {
//   /* Create a new project on the user's da server.
//   *    Should this also hanldle the loop of looking for a unique name? */
//   if ( !project_name ) { throw `To create a project on the docassemble server, we need a name for the project. The project name you gave was "${ project_name }"`; }

//   try {

//     let response = await da.create_project( project_name, timeout );
//     return response;

//   } catch (error) {
//     // Where should we handle this error?
//     // log.error( error, `https://docassemble.org/docs/api.html#playground_post_project` );
//     log.debug({ pre: `See https://docassemble.org/docs/api.html#playground_post_project` });
//     throw error;
//     // // Not all errors need to throw. Should this be handled in here?
//     // if ( error.response && error.response.data ) {
//     //   log.debug({ data: error, post: `https://docassemble.org/docs/api.html#playground_post_project` });
//     //   if ( error.response.data === 'Invalid project' ) {
//     //     // A non-unique project name shouldn't throw an error
//     //     return error.response;
//     //   } else {
//     //     // Other errors should be thrown
//     //     throw `${ error.response.status }: ${ error.response.data } See https://docassemble.org/docs/api.html#playground_post_project for more details.`;
//     //   }
//     // } else {
//     //   throw error;
//     // }
//   }  // Ends try
// };  // Ends dai.create_project()


// TODO: Change max_tries to 20 when done with development
dai.loop_to_create_project = async function(options) {
/* Create a project on the da server's account with a unique name. */
  let default_opts = { timeout: 3000, max_tries: 3, wait_seconds: 5 };
  let { timeout, max_tries, wait_seconds } = options || default_opts;

  let project_name = null;
  let name_incrementor = 0;

  // Try to create a project. If the project name is already taken, increment and loop again.
  while ( name_incrementor <= max_tries ) {
    name_incrementor++;
    try {

      // Try next name that could be unique
      project_name = session_vars.get_project_base_name() + name_incrementor;
      log.info({ type: `setup`, pre: `Trying to create a Project with the name ${ project_name }` });
      let response = await da.create_project( project_name, timeout );
      log.info({ type: `setup`, pre: `Created a Project named ${ project_name }` });
      // If succeeded in creating project, return the name that worked
      return project_name;

    } catch ( error ) {
      if ( error.response && error.response.data ) {
        if ( error.response.data.includes( `Invalid project` ) ) {
          // A non-unique project name should just cause another loop
          continue;

        } else {
          // Other response errors should be thrown with link to docs
          throw `${ error.response.status }: ${ error.response.data } See https://docassemble.org/docs/api.html#playground_post_project for more details.`;
        }

      } else {

        // If it's a timeout error, server is busy. Try again after waiting.
        if ( is_timeout_error( error ) && name_incrementor < max_tries ) {
          await time.waitForTimeout( wait_seconds * 1000 );
          continue;

        // A non-timeout, non-server error should just be thrown
        } else {
          throw error;

        }  // ends type of non-response error
      }  // ends type of reponse error
    }  // ends try
  }  // ends while

  // Failed because there were too many project names already taken
  if ( result && result.includes( `Invalid project` ) && name_incrementor > max_tries) {
    let too_many_project_names_msg = `ALKiln setup: There were already ${ max_tries } `
      + `projects with the base name ${ session_vars.get_project_base_name() }. `
      + `File an issue at https://github.com/SuffolkLITLab/ALKiln/issues.`;
    throw too_many_project_names_msg;
  }
};  // Ends dai.loop_to_create_project()


// node -e 'require("./lib/github_integration/docassemble_api_interface.js").pull()'
dai.pull = async function ( timeout=30000 ) {
  /* Pull github code into an existing Project. */
  try {

    let response = await da.pull( timeout );

    // If server didn't need to restart
    if ( response && response.status === 204 ) {
      log.debug({ pre: `Status 204 on pull:` });
      // What would be useful to return? Non-task_id...
      return null;
    }

    // If server needed to restart (only other success)
    if ( response && response.status === 200 ) {
      if ( session_vars.get_debug() ) {
        log.debug({ pre: `Pull task id: ${ response.data.task_id }` });
        let done = await dai.has_server_restarted( response.data.task_id, timeout );
        log.debug({ pre: `Is package done being pulled? ${ done }` });
      }
      return response.data.task_id;
    }

  } catch (error) {
    // Pulling should not error
    log.debug({ pre: `https://docassemble.org/docs/api.html#playground_pull` });
    throw error;
  }
};  // Ends dai.pull()


// node -e 'require("./lib/github_integration/docassemble_api_interface.js").has_server_restarted()'
dai.has_server_restarted = async function ( task_id, timeout=3000 ) {
  /* Check task status if it exists. If not, return true as task did
  *    not require a server restart. See dai.pull() */
  try {
    /* From API docs:
    status: If this is 'working', the package update process is still proceeding.
        If it is 'completed', then the package update process is done, and other
        information will be provided. If it is 'unknown', then the task_id has
        expired. The task_id will expire one hour after being issued, or 30 seconds
        after the first 'completed' is returned, whichever is sooner.
    ok: This is provided when the status is 'completed'. It is set to true or
        false depending on whether pip return an error code.
    log: if status is 'completed' and ok is true, the log will contain information
        from the output of pip.
    error_message: if status is 'completed' and ok is false, the error_message will
        contain a pip log or other error message that may explain why the package
        update process did not succeed.
    */

    // If server did need to restart, check if it's done.
    let response = await da.has_server_restarted( task_id, timeout );
    log.debug({ pre: `Task status: ${ response.status }. Server status: ${ response.data.status }. Task id: ${ task_id }` });
    
    if ( response && response.data && response.data.status ) {
      if ( response.data.status === 'completed' ) {
        log.info({ pre: `Server restarted successfully.` });
        return true;
      
      } else if ( response.data.status === 'working' ) {
        log.info({ pre: `Server is still working on it.` });
        return false;

      } else if ( response.data.status === 'unknown' ) {
        log.info({
          type: `pulling package`,
          pre: `\`task_id\` "${ task_id }" has expired. If it's been `
            + `less than 1 hour since the task started, the task is `
            + `complete. See https://docassemble.org/docs/api.html#restart_status.`,
          data: response,
        });

        // Server is working, but task unknown? What to return? Throw?
        return true;
      }  // ends status type

    } else {
      log.info({ pre: `Unexpected response while pulling code.` });
      throw response;  // What to do?
    }  // ends if ( response has stuff )

  } catch (error) {
    // Timeout means the server is busy.
    if ( is_timeout_error( error ) ) {
      log.info({ pre: `Server is busy.` });
      return false;
    }

    // Not sure what to do for other errors. Throw?
    log.info({ pre: `Tried to check for server restart, but ran into an error.` });
    throw error;
  }  // ends try to check for server done restarting

};  // Ends dai.has_server_restarted()


// Delete the Project
// node -e 'require("./lib/github_integration/docassemble_api_interface.js").delete_project( "create1" )'
dai.delete_project = async function ( timeout=3000 ) {
  /* Delete a project on the user's da server. */
  let project_name = session_vars.get_project_name()
  log.info({ pre: `Trying to delete Project ${ project_name }`, type: `takedown` });

  try {

    let response = await da.delete_project( timeout );
    log.info({ pre: `Deleted Project ${ project_name }`, type: `takedown` });
    return response.data;

  } catch (error) {
    // Should we throw in here?
    if ( session_vars.get_debug() ) { log.error( error, `https://docassemble.org/docs/api.html#playground_delete_project` ); }
    log.info({ pre: `Ran into an error when deleting Project ${ project_name }`, type: `takedown` });
    throw error;
  }

};  // Ends dai.delete_project()


// node -e 'require("./lib/github_integration/docassemble_api_interface.js").__delete_projects_starting_with( "testingdocassembleALAutomatedTestingTestsmain", 1, 1 )'
dai.__delete_projects_starting_with = async function ( base_name, starting_num=1, ending_num=50 ) {
  /* Useful for development with accidental infinite loops. */
  let name_incrementor = parseInt( starting_num );
  let final_num = parseInt( ending_num );
  while ( name_incrementor <= final_num ) {
    try {
      let project_name = base_name + name_incrementor;
      log.debug({ pre: `Deleting Project ${ project_name }` });
      await dai.delete_project( project_name );  
    } catch ( error ) {
      console.log( error )
    }
    name_incrementor++;
  }
};  // Ends dai.delete_projects_starting_with()
