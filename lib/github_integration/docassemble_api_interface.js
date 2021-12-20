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

// How can we test busy server stuff properly? Especially down
// to specific functions, like `.pull()` which run in a very small
// window.

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
dai.server_is_busy = async function ( options ) {
  /* Make an arbitrary request to the server to see if it's responding. */

  let { timeout } = options ||  { timeout: 5000 };
  try {
    let response = await da.get_dev_id( timeout );
    if ( response && response.data && response.data.id ) {
      log.debug({ pre: `Server responded.` });
      return false;
    }

  } catch ( error ) {
    // Timeout means the server is busy.
    if ( is_timeout_error( error ) ) {
      log.info({ pre: `Server is busy.` });
      return true;
    }
    // Not sure what to do for other errors
    if ( session_vars.get_debug() ) { log.error( error, `Tried to ping the server, but ran into an unexpected error.` ); }
    return true;
  }
};  // Ends server_is_busy()


// For timeout type functionality, can we just wait for a longer timeout?
// Doesn't that ping the server repeatedly?
dai.loop_func_on_server_timeout = async function ( callback, options ) {
  /* If server is busy, call same async function again? Some number of times?  */
  let default_opts = { timeout: 5000, max_tries: 15, wait_seconds: 5 };
  let { timeout, max_tries, wait_seconds } = options || default_opts;

  let num_tries = 0;
  let is_busy = true;
  let result = null;

  while ( is_busy && num_tries <= max_tries ) {
    num_tries = num_tries + 1;

    is_busy = await dai.server_is_busy( timeout );
    if ( is_busy ) {
      // Try again after waiting
      await time.waitForTimeout( wait_seconds * 1000 );
      continue;
    } else {
      try {
        result = await callback();
        break;

      } catch ( error ) {

        // If it's a timeout error and we still have loops left to try, loop
        if ( is_timeout_error( error ) && num_tries < max_tries ) {
          log.info({ pre: `Server is busy.` });
          continue;
        // If it's not a timeout error, or we're not allowed to keep looping, throw
        } else { throw error; }

      }  // ends try/catch
    }  // ends if busy
  }  // ends while

  // If possible, return the result of the desired function
  return result;
};  // Ends loop_func_on_server_timeout();


// // node -e 'require("./lib/github_integration/docassemble_api_interface.js").is_api_key_working()'
// dai.is_valid_api_key = function ( options ) {
//   /* Make sure the api key is working */
//   let { timeout } = options ||  { timeout: 3000 };
//   // 'Access denied'
// };  // Ends is_valid_api_key()


// // node -e 'require("./lib/github_integration/docassemble_api_interface.js").loop_to_get_dev_id()'
// dai.loop_to_get_dev_id = async function ( options ) {
//   /* Get docassemble developer id. Also used to check if
//   *    the server is up and available. */
//   let { timeout } = options ||  { timeout: 3000 };
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
// dai.create_project = async function ( project_name, options ) {
//   /* Create a new project on the user's da server.
//   *    Should this also hanldle the loop of looking for a unique name? */
//   let { timeout } = options ||  { timeout: 3000 };
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
dai.loop_to_create_project = async function( options ) {
/* Create a project on the da server's account with a unique name. */
  let default_opts = { timeout: 3000, max_tries: 5, wait_seconds: 5 };
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
          log.info({ pre: `Server was busy when trying to create project. `
            + `Attempt ${ name_incrementor } of ${ max_tries }. Will try again `
            + `after ${ wait_seconds } seconds.` });
          await time.waitForTimeout( wait_seconds * 1000 );
          continue;

        // A non-timeout, non-server error should just be thrown
        } else {
          log.info({ pre: `Ran into unexpected error when trying to create project.` });
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
dai.pull = async function ( options ) {
  /* Pull github code into an existing Project. */
  let { timeout } = options ||  { timeout: 30000 };

  try {

    let response = await da.pull( timeout );

    // If server didn't need to restart
    if ( response && response.status === 204 ) {
      log.debug({ pre: `Status 204 on pull. Did not need a server restart.` });
      return null;
    }

    // If server needed to restart because of the pulled code
    if ( response && response.status === 200 ) {
      log.debug({ pre: `Pull task id: ${ response.data.task_id }` });
      return response.data.task_id;
    }

  } catch (error) {
    // Pulling should not error
    log.debug({ pre: `Pulling to the docassemble Project ran into an unexpected error. See https://docassemble.org/docs/api.html#playground_pull` });
    throw error;
  }
};  // Ends dai.pull()


dai.loop_to_pull = async function ( pull_options, loop_options ) {
  /* Try to pull when server isn't busy.
  *    TODO: Should this timeout be customizable? Different servers
  *    might have very different wait times for module restarts. */
  pull_options = pull_options ||  { timeout: 30000 };

  // If a pull attempt times out, it didn't actually pull
  return await dai.loop_func_on_server_timeout(async () => {
    let task_id = await dai.pull( pull_options );
    console.log( task_id );
    return task_id;
  }, loop_options );  // Leave default loop options alone
};

// node -e 'require("./lib/github_integration/docassemble_api_interface.js").has_task_finished()'
dai.has_task_finished = async function ( task_id, options ) {
  /* Check task status if it exists. If not, return true as task did
  *    not require a server restart. See dai.pull().
  *    See https://docassemble.org/docs/api.html#restart_status. */
  let { timeout } = options ||  { timeout: 3000 };

  try {

    // If server did need to restart, check if it's done.
    let response = await da.has_task_finished( task_id, timeout );
    log.debug({ pre: `Task status: ${ response.status }. Server status: ${ response.data.status }. Task id: ${ task_id }` });
    
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

      // Server is working, but status unexpected? What to return? Throw?
      // We shouldn't even get here, but it feels weird to have no default behavior
      return null;
    }  // ends status type

  } catch (error) {
    // Timeout means the server is busy.
    if ( is_timeout_error( error ) ) {
      log.info({ pre: `Server is busy.` });
      return false;
    }

    log.info({ type: `setup`, pre: `Tried to check for server restart, but ran into an unexpected error.` });
    throw error;
  }  // ends try to check for server done restarting

};  // Ends dai.has_task_finished()


dai.wait_for_server_to_restart = async ( task_id ) => {
  /* Wait for the server to finish restarting in case a module needs to load. */
  log.info({ type: `setup`, pre: `Waiting for server to restart after pulling code with task_id "${ task_id }".` });

  const wait_time = 5;  // seconds
  const max_tries = 15;
  let num_tries = 0;
  let done_restarting = false;

  // Why loop instead of one long timeout? Because it might not just hang.
  // We might get a return value that's just `waiting`.
  // - [ ] How many tries/time do we give this? Do we allow customization of those values?
  while ( !done_restarting && num_tries <= max_tries ) {
    num_tries++;

    done_restarting = await dai.has_task_finished( task_id );
    if ( !done_restarting ) {
      if ( num_tries < max_tries ) {
        log.info({
          type: `setup`,
          pre: `Attempt ${ num_tries } of ${ max_tries } did not succeed. `
            + `Will try again in ${ wait_time } seconds.`
        });
        await time.waitForTimeout( wait_time * 1000 );

      } else {
        // This is our last round, let's wrap it up
        let server_msg = `ALKiln setup: It seems like the server `
          + `didn't finish restarting after ${ max_tries * wait_time } `
          + `seconds. Some things you can try: check your server, try `
          + `re-running the test, and check pulling the interview `
          + `manually. See docs at https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/.`;
        throw( server_msg );
      }  // ends if ran out of tries
    }  // ends if done_restarting
  }  // ends while not done restarting

  log.info({ pre: `Package has been pulled and server has finished restarting.` });
};  // Ends dai.wait_for_server_to_restart()


// Delete the Project
// node -e 'require("./lib/github_integration/docassemble_api_interface.js").delete_project( "create1" )'
dai.delete_project = async function ( options ) {
  /* Delete a project on the user's da server. */
  let { timeout } = options ||  { timeout: 3000 };
  let project_name = session_vars.get_project_name()
  log.info({ pre: `Trying to delete Project ${ project_name }`, type: `takedown` });

  try {

    let response = await da.delete_project( timeout );
    log.info({ pre: `Deleted Project "${ project_name }"`, type: `takedown` });
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
};  // Ends dai.__delete_projects_starting_with()
