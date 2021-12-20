const dai = require('./docassemble_api_interface');
const log = require('../utils/log');
const session_vars = require('../utils/session_vars' );
const time = require('../utils/time');

const setup = async () => {
  /* In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, create a new Project,
  *   pull code into that project, and, if needed, wait for the
  *   server to restart. */
  // TODO: Check that API key is valid
  log.info({ type: `setup`, pre: `Trying to create a docassemble project.` });
  await create_project();
  log.info({ type: `setup`, pre: `Trying to pull code from the "${ session_vars.get_branch_name() }" branch.` });
  let task_id = await dai.pull();
  await wait_for_server_to_restart( task_id );
  
  return true;
};

const takedown = async () => {
  /* In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, delete the
  *   Project created for this test.
  *   For local development, clean up project name file. */
  await dai.delete_project();
  session_vars.delete_project_name();
};

const create_project = async function () {
/* Create a project on the da server's account with a unique name.
*    Should we make sure a project name doesn't already exist?
*    Make local development easier? */
  let project_name = null;
  let max_tries = 3;
  let name_incrementor = 0;

  let result = 'Invalid project.';
  let response = null;

  // Try to create a project. If the project name is already taken, increment and loop again.
  // No result means the name was created successfully...?
  while ( result && result.includes( `Invalid project` ) && name_incrementor <= max_tries ) {
    name_incrementor++;
    try {

      project_name = session_vars.get_project_base_name() + name_incrementor;
      log.info({ type: `setup`, pre: `Trying to create the project with the name ${ project_name }` });
      response = await dai.create_project( project_name );
      result = response.data;

    } catch ( error ) {

      if ( error.response && error.response.data ) {
        if ( error.response.data.includes( `Invalid project` ) ) {
          // A non-unique project name should just cause another loop
          result = error.response.data;
          continue;

        } else {
          // Other errors should be thrown with a cleaner printout
          throw `${ error.response.status }: ${ error.response.data } See https://docassemble.org/docs/api.html#playground_post_project for more details.`;
        }

      } else {
        // A non-server error should just be thrown
        throw error;
      }
    }  // Ends try
  }  // Ends while

  // There were too many project names already taken
  if ( result && result === 'Invalid project' && name_incrementor > max_tries) {
    let too_many_project_names_msg = `ALKiln setup: There were ${ max_tries } `
      + `projects with the base name ${ session_vars.get_project_base_name() }. `
      + `File an issue at https://github.com/SuffolkLITLab/ALKiln/issues.`;
    throw too_many_project_names_msg;
  }

  // Once the name is created, save that name to a local file.
  session_vars.save_project_name( project_name );
  return true;
};  // Ends create_project()


const wait_for_server_to_restart = async ( task_id ) => {
  /* Wait for the server to finish restarting in case a module needs to load. */
  log.info({ type: `setup`, pre: `Waiting for server to restart after pulling code.` });

  const wait_time = 5;  // seconds
  const max_tries = 15;
  let num_tries = 0;
  let done_restarting = false;

  // How many tries/time do we give this? Do we allow customization of those values?
  while ( !done_restarting && num_tries <= max_tries ) {
    num_tries++;

    try {
      done_restarting = await dai.has_server_restarted( task_id );
    } catch ( error ) {
      log.debug({ pre: `Errored while trying to see if the server restarted.` });
      console.log( error );
    }
    

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

  log.info({ pre: `Success! Package has been pulled and server has finished restarting.` });
};  // Ends wait_for_server_to_restart()


module.exports = {setup, takedown};
