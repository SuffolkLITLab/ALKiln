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
  let task_id = await dai.loop_to_pull();
  if ( task_id ) {
    await dai.wait_for_server_to_restart( task_id );
  }

  log.info({ pre: `Success! Test setup has finished successfully.` });
};  // Ends setup();

const create_project = async function () {
/* Create a project on the da server's account with a unique name then
*   store it locally for later deleting the project. */
  let project_name = await dai.loop_to_create_project();
  // Once the name is created, save that name to a local file.
  session_vars.save_project_name( project_name );
};  // Ends create_project()

const takedown = async () => {
  /* In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, delete the
  *   Project created for this test.
  *   For local development, clean up project name file. */
  await dai.delete_project();
  session_vars.delete_project_name();
  log.info({ pre: `Success! Test takedown has finished successfully.` });
};


module.exports = {setup, takedown};
