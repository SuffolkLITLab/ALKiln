#!/usr/bin/env node

const dai = require('./docassemble_api_interface');
const log = require('../utils/log');
const session_vars = require('../utils/session_vars' );


const setup = async () => {
  /* In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, create a new Project,
  *   pull code into that project, and, if needed, wait for the
  *   server to restart. */
  log.info({ type: `setup`, pre: `Trying to create a docassemble Project `
    + `in the server testing account and pull this repository's code into `
    + `that Project.` });

  // Check that API key is valid. Will error if it is invalid.
  // Should the error be thrown here?
  await dai.try_api_key();

  // Create a project on the da server's account with a unique name then
  // store it locally for later deleting the project. 
  let project_name = await dai.loop_to_create_project();
  // Once the name is created, save that name to a local file.
  session_vars.save_project_name( project_name );

  // Pull code and wait for server restart to finish if needed
  let task_id = await dai.pull();
  // Task id will be null if server did not need to restart
  if ( task_id ) {
    await dai.wait_for_server_to_restart( task_id );
  }

  // Finish
  log.info({ type: `setup`, pre: `Success! Test setup has finished successfully.` });
};  // Ends setup();


setup();
