#!/usr/bin/env node

const da_i = require('./docassemble_api_interface');
const log = require('../utils/log');
const session_vars = require('../utils/session_vars' );

const takedown = async () => {
  /* In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, delete the
  *   Project created for this test.
  *   For local development, clean up project name file. */
  log.info({ type: `takedown`, pre: `Trying to remove the docassemble Project from the testing account.` });
  // Explicit try-catch prevents "Unhandled promise rejection error"
  // avoids showing confusing node errors to users that they shouldn't have to fix
  try {
    await da_i.delete_project();
    session_vars.delete_project_name();
    log.info({ type: `takedown`, pre: `Success! Test takedown has finished successfully.` });
  } catch (error) {
    log.error({type: `takedown`, pre: `could not delete project`, data: JSON.stringify(error, null, 4)})
    // we don't re-throw the exception, so make sure to exit with 1 to let Github Actions know the script failed
    process.exitCode = 1;
  }
};

takedown();
