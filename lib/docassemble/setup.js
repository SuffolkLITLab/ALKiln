#!/usr/bin/env node

const da_i = require('./docassemble_api_interface');
const log = require('../utils/log');
const session_vars = require('../utils/session_vars' );
const files = require('../utils/files' );


const setup = async () => {
  /* In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, create a new Project,
  *   pull code into that project, and, if needed, wait for the
  *   server to restart. */
  log.info({ type: `setup`, pre: `Starting to upload this package to `
    + `a new Project in the server's testing account.` });

  // Check that API key is valid. Will error if it is invalid.
  // Should the error be thrown here?
  await da_i.validate_api_key();

  // Create a project on the da server's account with a unique name then
  // store it locally for later deleting the project. 
  let project_name = null;
  // Explicit try-catch prevents "Unhandled promise rejection error"
  // avoids showing confusing node errors to users that they shouldn't have to fix
  try {
    project_name = await da_i.loop_to_create_project();
  } catch (error) {
    log.error({type: `setup`, pre: `an unexpected error occurred while trying to create a docassemble project in the user's account`, data: JSON.stringify(error, null, 4)})
    // we don't re-throw the exception, so make sure to exit with 1 to let Github Actions know the script failed
    process.exitCode = 1;
    return;
  }
  // Once the name is created, save that name to a local file.
  session_vars.save_project_name( project_name );

  // Pull code and wait for server restart to finish if needed
  let task_id = await da_i.pull();
  // Task id will be null if server did not need to restart
  if ( task_id ) {
    await da_i.wait_for_server_to_restart( task_id );
  }

  // Finish
  log.info({ type: `setup`, pre: `Success! Test setup has finished successfully.` });
};  // Ends setup();


setup();
