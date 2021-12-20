const axios = require('axios');
const qs = require('qs');

const session = require('../utils/session');
const log = require('../utils/log');

// Requests to make to the developer's docassemble server
// Should functions in here already know what the project name is,
// or should developers have to hand it in? Same with github url.

/* Notes:
*   - We are not using `.create()` because we want to get
*   the environment variables fresh every time. */

// Temp notes:
// Where should we throw errors?
// Where should we log what?
// Do we need to respond if the dev api key expires in the middle of everything?
// General: How/when do we check if server is busy? Just on error? What about
//    all kinds of race conditions?
// response has data and status. error has repsonse

let da = {};
module.exports = da;

// node -e 'require("./lib/utils/docassemble_api.js").is_api_key_working()'
da.is_valid_api_key = function ( timeout=2000 ) {
  /* Make sure the api key is working */
  // 'Access denied'
};  // Ends is_valid_api_key()


// node -e 'require("./lib/utils/docassemble_api.js").is_server_responding()'
da.is_server_responding = async function ( timeout=5000 ) {
  /* Make an arbitrary request to the server to see if it's responding. */
  // What is response when server isn't ready? Undefined?
  try {
    let id = await da.get_dev_id( timeout );
    if ( typeof id != 'string' ) { throw id; }
    log.debug({ pre: `Server responded!` });
    return true;

  } catch ( error ) {
    // Timeout means the server hasn't responded yet
    if ( error.message && error.message.includes(`timeout`) ) {
      return false;  // https://github.com/axios/axios/issues/1543#issuecomment-558166483 (2019)
      // Also check https://github.com/axios/axios/issues/1174#issuecomment-349014752 (2017)
    }
    // Not sure what to do foor other errors
    log.error( error, `Tried to ping the server, but ran into an error.` );
    return false;
  }
};  // Ends is_server_responding()


// node -e 'require("./lib/utils/docassemble_api.js").get_dev_id()'
da.get_dev_id = async function ( timeout=2000 ) {
  /* Get docassemble developer id. Also used to check if
  *    the server is up and available. */
  let options = {
    method: 'GET',
    url: `${ session.get_da_server_url() }/api/user`,
    params: { key: session.get_dev_api_key(), },
    timeout: timeout,
  };

  try {

    let response = await axios.request(options);
    log.debug({ pre: `User id: ${ response.data.id }` });
    return response.data.id;

  } catch (error) {
    log.debug({ pre: `https://docassemble.org/docs/api.html#user`, data: error });
    throw error;

  }
};  // Ends da.get_dev_id()


// node -e 'require("./lib/utils/docassemble_api.js").create_project( "create1" )'
da.create_project = async function ( project_name, timeout=2000 ) {
  /* Create a new project on the user's da server.
  *    Should this also hanldle the loop of looking for a unique name? */
  if ( !project_name ) { throw `To create a project on the docassemble server, we need a name for the project. The project name you gave was "${ project_name }"`; }

  let options = {
    method: 'POST',
    url: `${ session.get_da_server_url() }/api/playground/project`,
    data: qs.stringify({
      key: session.get_dev_api_key(),
      project: project_name,
    }),
    timeout: timeout,
  };

  try {

    let response = await axios.request(options);
    return response;

  } catch (error) {
    // Where should we handle this error?
    // log.error( error, `https://docassemble.org/docs/api.html#playground_post_project` );
    log.debug({ pre: `See https://docassemble.org/docs/api.html#playground_post_project` });
    throw error;
    // // Not all errors need to throw. Should this be handled in here?
    // if ( error.response && error.response.data ) {
    //   log.debug({ data: error, post: `https://docassemble.org/docs/api.html#playground_post_project` });
    //   if ( error.response.data === 'Invalid project' ) {
    //     // A non-unique project name shouldn't throw an error
    //     return error.response;
    //   } else {
    //     // Other errors should be thrown
    //     throw `${ error.response.status }: ${ error.response.data } See https://docassemble.org/docs/api.html#playground_post_project for more details.`;
    //   }
    // } else {
    //   throw error;
    // }
  }  // Ends try
};  // Ends da.create_project()


// node -e 'require("./lib/utils/docassemble_api.js").pull()'
da.pull = async function ( timeout=30000 ) {
  /* Pull github code into an existing Project. */

  let options = {
    method: 'POST',
    url: `${ session.get_da_server_url() }/api/playground_pull`,
    data: qs.stringify({
      key: session.get_dev_api_key(),
      project: session.get_project_name(),
      github_url: session.get_repo_url(),
      branch: session.get_branch_name(),
    }),
    timeout: timeout,
  };

  try {

    let response = await axios.request( options );

    // If server didn't need to restart
    if ( response && response.status === 204 ) {
      log.debug({ pre: `Status 204 on pull:` });
      // What would be useful to return? Non-task_id...
      return null;
    }

    // If server needed to restart (only other success)
    if ( response && response.status === 200 ) {
      if ( session.get_debug() ) {
        log.debug({ pre: `Pull task id: ${ response.data.task_id }` });
        let done = await da.has_server_restarted( response.data.task_id, timeout );
        log.debug({ pre: `Is package done being pulled? ${ done }` });
      }
      return response.data.task_id;
    }

  } catch (error) {
    // Pulling should not error
    log.debug({ pre: `https://docassemble.org/docs/api.html#playground_pull` });
    throw error;
  }
};  // Ends da.pull()


// node -e 'require("./lib/utils/docassemble_api.js").has_server_restarted()'
da.has_server_restarted = async function ( task_id, timeout=2000 ) {
  /* Check task status if it exists. If not, return true as task did
  *    not require a server restart. See da.pull() */

  // If server didn't need to restart.
  if ( typeof task_id !== `string` ) { return true; }

  let options = {
    method: 'GET',
    url: `${ session.get_da_server_url() }/api/restart_status`,
    params: {
      key: session.get_dev_api_key(),
      task_id: task_id,
    },
    timeout: timeout,
  };

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
    let response = await axios.request(options);
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
    // Timeout means the server hasn't responded yet. Give it more time.
    // Catching axios timeout:
    // https://github.com/axios/axios/issues/1543#issuecomment-558166483 (2019)
    // Also https://github.com/axios/axios/issues/1174#issuecomment-349014752 (2017)
    if ( error.message && error.message.includes(`timeout`) ) {
      return false;  
    }

    // Not sure what to do for other errors. Throw?
    log.info({ pre: `Tried to check for server restart, but ran into an error.` });
    throw error;
  }  // ends try to check for server done restarting

};  // Ends da.has_server_restarted()


// Delete the Project
// node -e 'require("./lib/utils/docassemble_api.js").delete_project( "create1" )'
da.delete_project = async function ( timeout=2000 ) {
  /* Delete a project on the user's da server. */
  let project_name = session.get_project_name()
  log.info({ pre: `Trying to delete Project ${ project_name }`, type: `takedown` });

  let options = {
    method: 'DELETE',
    url: `${ session.get_da_server_url() }/api/playground/project`,
    params: {
      key: session.get_dev_api_key(),
      project: project_name,
    },
    timeout: timeout,
  };

  try {

    let response = await axios.request(options);
    log.info({ pre: `Deleted Project ${ project_name }`, type: `takedown` });
    return response.data;

  } catch (error) {
    // Should we throw in here?
    if ( session.get_debug() ) { log.error( error, `https://docassemble.org/docs/api.html#playground_delete_project` ); }
    log.info({ pre: `Ran into an error when deleting Project ${ project_name }`, type: `takedown` });
    throw error;
  }

};  // Ends da.delete_project()


da.__delete_projects_starting_with = async function ( base_name, starting_num=1, ending_num=50 ) {
  /* Useful for development with accidental infinite loops. */
  let name_incrementor = parseInt( starting_num );
  let final_num = parseInt( ending_num );
  while ( name_incrementor <= final_num ) {
    try {
      let project_name = base_name + name_incrementor;
      log.debug({ pre: `Deleting Project ${ project_name }` });
      await da.delete_project( project_name );  
    } catch ( error ) {
      console.log( error )
    }
    name_incrementor++;
  }
};  // Ends da.delete_projects_starting_with()
