#!/usr/bin/env node

const dai = require('./docassemble_api_interface');
const log = require('../utils/log');
const session_vars = require('../utils/session_vars' );

const takedown = async () => {
  /* In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, delete the
  *   Project created for this test.
  *   For local development, clean up project name file. */
  await dai.delete_project();
  session_vars.delete_project_name();
  log.info({ pre: `Success! Test takedown has finished successfully.` });
};

takedown();
