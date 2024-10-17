#!/usr/bin/env node

const da_i = require('./docassemble_api_interface');
const session_vars = require('../utils/session_vars');
const Log = require('../utils/log');

const context = `takedown`;

const takedown = async () => {
  /** In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, delete the
  *   Project created for this test.
  *   For local development, clean up project name file. */
  log.info({ code: `ALK0177`, context, },
    `Trying to remove the docassemble Project from the testing account.`
  );
  // Explicit try-catch prevents "Unhandled promise rejection error"
  // avoids showing confusing node errors to users that they shouldn't have to fix
  try {
    await da_i.delete_project();
    session_vars.delete_project_name();
    log.info({ code: `ALK0178`, context, },
      `Test takedown finished successfully!`
    );
  } catch (error) {
    log.throw({ code: `ALK0179`, context, error: error },
      `Unable to delete project`,
    );
    // we don't re-throw the exception, so make sure to exit
    // with 1 to let GitHub Actions know the script failed
    process.exitCode = 1;
  }

  // TODO: ? Build the final setup, run, & takedown verbose log
  // file in here. Add to it in the GitHub action ?
};

// 1. session_vars - make sure all the required env vars exist
session_vars.validateEnvironment();

// 2. Prepare logs
// Local devs: This will be separate from your test artifacts paths
// unless you pass a `path` argument into the `cucumber` run command
const argv = require(`minimist`)( process.argv.slice(2) );
const log = new Log({ path: argv.path, context, });

// 3. run
takedown();
