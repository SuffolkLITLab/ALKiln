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
  await da_i.delete_project();
  session_vars.delete_project_name();
  log.info({ type: `takedown`, pre: `Success! Test takedown has finished successfully.` });
};

takedown();
