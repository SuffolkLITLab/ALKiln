const axios = require('axios');
const qs = require('qs');

const session_vars = require('../utils/session_vars' );

/* Requests to make to the developer's docassemble server.
*   As close to plain requests as we can get so we don't have
*   to think about this file again.
* Notes:
*   - We are not using `.create()` because we want to get
*   the environment variables fresh every time. */

let da = {};
module.exports = da;


// node -e 'require("./lib/docassemble/docassemble_api_REST.js").get_dev_id()'
da.get_dev_id = async function ( timeout ) {
  /* Get docassemble developer id. */
  let options = {
    method: 'GET',
    headers: {'X-API-Key': session_vars.get_dev_api_key()},
    url: `${ session_vars.get_da_server_url() }/api/user`,
    timeout: timeout,
  };

  try {
    return await axios.request( options );
  } catch (error) {
    let response = error.response || {data: null}
    throw {...error.toJSON(), data: response.data};
  }
};  // Ends da.get_dev_id()


// node -e 'require("./lib/docassemble/docassemble_api_REST.js").create_project( "create1" )'
da.create_project = async function ( project_name, timeout ) {
  /* Create a new project on the user's da server. */
  let options = {
    method: 'POST',
    headers: {'X-API-Key': session_vars.get_dev_api_key()},
    url: `${ session_vars.get_da_server_url() }/api/playground/project`,
    data: qs.stringify({
      project: project_name,
    }),
    timeout: timeout,
  };

  try {
    return await axios.request( options );
  } catch (error) {
    let response = error.response || {data: null}
    throw {...error.toJSON(), data: response.data};
  }
};  // Ends da.create_project()


// node -e 'require("./lib/docassemble/docassemble_api_REST.js").pull()'
da.pull = async function ( timeout ) {
  /* Pull github code into an existing Project. */
  let options = {
    method: 'POST',
    headers: {'X-API-Key': session_vars.get_dev_api_key()},
    url: `${ session_vars.get_da_server_url() }/api/playground_pull`,
    data: qs.stringify({
      project: session_vars.get_project_name(),
      github_url: session_vars.get_repo_url(),
      branch: session_vars.get_branch_name(),
    }),
    timeout: timeout,
  };

  try {
    return await axios.request( options );
  } catch (error) {
    let response = error.response || {data: null}
    throw {...error.toJSON(), data: response.data};
  }
};  // Ends da.pull()


// node -e 'require("./lib/docassemble/docassemble_api_REST.js").has_task_finished()'
da.has_task_finished = async function ( task_id, timeout ) {
  /* Check task status based on `task_id`. */
  let options = {
    method: 'GET',
    headers: {'X-API-Key': session_vars.get_dev_api_key()},
    url: `${ session_vars.get_da_server_url() }/api/restart_status`,
    params: {
      task_id: task_id,
    },
    timeout: timeout,
  };

  try {
    return await axios.request( options );
  } catch (error) {
    let response = error.response || {data: null}
    throw {...error.toJSON(), data: response.data};
  }
};  // Ends da.has_task_finished()


// node -e 'require("./lib/docassemble/docassemble_api_REST.js").delete_project( "create1" )'
da.delete_project = async function ( timeout ) {
  /* Delete a project on the user's da server. */
  let options = {
    method: 'DELETE',
    headers: {'X-API-Key': session_vars.get_dev_api_key()},
    url: `${ session_vars.get_da_server_url() }/api/playground/project`,
    params: {
      project: session_vars.get_project_name(),
    },
    timeout: timeout,
  };

  try {
    return await axios.request( options );
  } catch (error) {
    let response = error.response || {data: null}
    throw {...error.toJSON(), data: response.data};
  }
};  // Ends da.delete_project()


// node -e 'require("./lib/docassemble/docassemble_api_REST.js").__delete_projects_starting_with( "testingdocassembleALAutomatedTestingTestsmain", 1, 1 )'
da.__delete_projects_starting_with = async function ( base_name, starting_num=1, ending_num ) {
  /** FOR DEVELOPMENT ONLY. Deletes a set of Projects that start with a shared
  *    prefix. Useful for Projects created by an infinite loop. */
  let name_incrementor = parseInt( starting_num );
  ending_num = ending_num || starting_num;  // Default to just delete one
  let final_num = parseInt( ending_num );
  while ( name_incrementor <= final_num ) {
    try {
      let project_name = base_name + name_incrementor;
      console.log( `Deleting Project ${ project_name }` );

      let options = {
        method: 'DELETE',
        headers: {'X-API-Key': session_vars.get_dev_api_key()},
        url: `${ session_vars.get_da_server_url() }/api/playground/project`,
        params: {
          project: project_name,
        },
        timeout: 30 * 1000,
      };

      await axios.request( options );
    } catch ( error ) {
      let response = error.response || {data: null}
      console.log( {...error.toJSON(), data: response.data});
    }
    name_incrementor++;
  }
}; // Ends da_i.__delete_projects_starting_with()
