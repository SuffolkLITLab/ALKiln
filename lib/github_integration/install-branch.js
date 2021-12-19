// const puppeteerutils = require('./puppeteer-utils');

// const env_vars = require('../utils/env_vars');
const session = require('../utils/session');
const da = require('../utils/docassemble_api.js');

const setup = async () => {
  try {
    console.log( `ALKiln setup: Trying to create a docassemble project.` );
    await create_project();
    console.log( `ALKiln setup: Trying to pull code from the "${ session.get_branch_name() }" branch.` );  
  } catch ( error ) {
    throw error;
  }
  
  // let task_id = da.pull();
  // await wait_for_server_to_restart( task_id, page );
};

const takedown = async () => {
  // let {page, browser} = await puppeteerutils.login();
  try {
    // await puppeteerutils.deleteProject(page);
    // await da.delete_project();
  }
  catch ( error ) {
    throw( error );
  }
  finally {
    browser.close();
  }
};

const create_project = async function () {
/* Create a project on the da server's account with a unique name.
*    Should we make sure a project name doesn't already exist?
*    Make local development easier? */
  let project_name = null;
  let max_tries = 3;
  let name_incrementor = 0;

  let result = 'Invalid project';
  let response = null;

  // Try to create a project. If the project name is already taken, increment and loop again.
  // No result means the name was created successfully...?
  while ( result && result.includes( `Invalid project` ) && name_incrementor <= max_tries ) {
    name_incrementor++;
    try {

     project_name = session.get_project_base_name() + name_incrementor;
     console.log( `ALKiln setup: Trying to create the project with the name ${ project_name }` );
     response = await da.create_project( project_name );
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
      + `projects with the base name ${ session.get_project_base_name() }. `
      + `File an issue at https://github.com/SuffolkLITLab/ALKiln/issues.`;
    throw too_many_project_names_msg;
  }

  // Once the name is created, save that name to a local file.
  session.save_project_name( project_name );
  return true;
};  // Ends create_project()


const wait_for_server_to_restart = async ( task_id, page ) => {
  /* Wait for the server to finish restarting in case a module needs to load. */
  const wait_time = 5;  // seconds
  const max_tries = 15;
  let num_tries = 0;
  let done_restarting = false;

  console.log( `ALKiln setup: Checking to see if server has finished restarting after pulling code.` );

  // How many tries/time do we give this? Do we allow customization of that time?
  while ( !done_restarting && num_tries < max_tries ) {
    num_tries++;

    done_restarting = await da.is_package_done_updating( task_id );
    if ( done_restarting ) {
      console.log( `ALKiln setup: Success! Package has been pulled and server has finishsed restarting.` );
      break;
    } else {
      if ( num_tries < max_tries ) {
        console.log(`ALKiln setup: Attempt ${ num_tries } of ${ max_tries }. Will try again in ${ wait_time } seconds.`);
        await setTimeout( function() {}, 1000 );
      } else {
        // This is our last round, let's wrap it up
        throw( `ALKiln setup: It seems like the server didn't finish restarting after ${ max_tries * wait_time } seconds. Some things you can try: check your server, try re-running the test, and check pulling the interview manually. See docs at https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/.` );
      }
    }  // ends if done_restarting
  }  // ends while
};  // Ends wait_for_server_to_restart()


module.exports = {setup, takedown};
