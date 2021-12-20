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


// node -e 'require("./lib/docassemble/docassemble_api.js").get_dev_id()'
da.get_dev_id = async function ( timeout ) {
  /* Get docassemble developer id. */
  let options = {
    method: 'GET',
    url: `${ session_vars.get_da_server_url() }/api/user`,
    params: { key: session_vars.get_dev_api_key(), },
    timeout: timeout,
  };

  return await axios.request( options );
};  // Ends da.get_dev_id()


// node -e 'require("./lib/docassemble/docassemble_api.js").create_project( "create1" )'
da.create_project = async function ( project_name, timeout ) {
  /* Create a new project on the user's da server. */
  let options = {
    method: 'POST',
    url: `${ session_vars.get_da_server_url() }/api/playground/project`,
    data: qs.stringify({
      key: session_vars.get_dev_api_key(),
      project: project_name,
    }),
    timeout: timeout,
  };

  return await axios.request( options );

};  // Ends da.create_project()


// node -e 'require("./lib/docassemble/docassemble_api.js").pull()'
da.pull = async function ( timeout ) {
  /* Pull github code into an existing Project. */
  let options = {
    method: 'POST',
    url: `${ session_vars.get_da_server_url() }/api/playground_pull`,
    data: qs.stringify({
      key: session_vars.get_dev_api_key(),
      project: session_vars.get_project_name(),
      github_url: session_vars.get_repo_url(),
      branch: session_vars.get_branch_name(),
    }),
    timeout: timeout,
  };

  return await axios.request( options );
};  // Ends da.pull()


// node -e 'require("./lib/docassemble/docassemble_api.js").has_task_finished()'
da.has_task_finished = async function ( task_id, timeout ) {
  /* Check task status based on `task_id`. */
  let options = {
    method: 'GET',
    url: `${ session_vars.get_da_server_url() }/api/restart_status`,
    params: {
      key: session_vars.get_dev_api_key(),
      task_id: task_id,
    },
    timeout: timeout,
  };

  return await axios.request( options );
};  // Ends da.has_task_finished()


// node -e 'require("./lib/docassemble/docassemble_api.js").delete_project( "create1" )'
da.delete_project = async function ( timeout ) {
  /* Delete a project on the user's da server. */
  let options = {
    method: 'DELETE',
    url: `${ session_vars.get_da_server_url() }/api/playground/project`,
    params: {
      key: session_vars.get_dev_api_key(),
      project: session_vars.get_project_name(),
    },
    timeout: timeout,
  };

  return await axios.request( options );
};  // Ends da.delete_project()
