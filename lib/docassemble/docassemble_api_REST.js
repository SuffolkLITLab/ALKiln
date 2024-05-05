const axios = require('axios');

// Ours
const session_vars = require('../utils/session_vars' );

/* Requests to make to the developer's docassemble server.
*   As close to plain requests as we can get so we don't have
*   to think about this file again.
*/

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
      console.log( `🐞 ALKiln internal debug 1: Deleting Project ${ project_name }` );

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
      console.log({...error.toJSON(), data: response.data, alkiln_code: `🐞 ALKiln internal debug 2`});
    }
    name_incrementor++;
  }
}; // Ends da.__delete_projects_starting_with()
