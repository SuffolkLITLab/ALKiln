#!/usr/bin/env node

const child_process = require(`child_process`);

const Log = require(`../utils/log`);
const session_vars = require(`../utils/session_vars` );
const files = require(`../utils/files` );
const time = require(`../utils/time` );

const setup = async () => {
  /** In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, create a new Project,
  *   pull code into that project, and, if needed, wait for the
  *   server to reload.
  */
  
  // Make and save project name
  let project_name = session_vars.get_project_base_name().replace(/[^A-Za-z0-9]/g, '') + `${Date.now()}`;
  session_vars.save_project_name( project_name );

  const starting_msg = `Starting to upload this package to `
    + `a new Project called ${project_name} in the Playground `
    + `of your server's testing account. It may take a couple of minutes.`;
  log.info({ code: `ALK0046`, context: `setup` },
    starting_msg
  );

  // TODO: 1. Start listening to the normal console here (for debug logging)

  // dainstall . --apiurl https://site.org --apikey $API_KEY --playground --project=name
  // I think this won't run on windows? Why do I think this? Where on the
  // internet did I find this. Some command here or in dainstall doesn't
  // work on windows.
  let result = child_process.spawnSync(
    `dainstall`,
    [
      `.`, `--apiurl`, session_vars.get_da_server_url(),
      `--apikey`, session_vars.get_dev_api_key(),  // validates api key
      `--playground`, `--project=${ project_name }`
    ],
    // Prints messages from the process to the console while it's running
    // result.stderr, result.stdout, etc. will be `null`
    { stdio: 'inherit', }
  );

  // TODO: 2. Stop listening to the normal console here

  // 403 is invalid API key, but I'm not sure how to output
  // the response to find out the error code. stderr is `null`.
  if ( result.status !== 0 ) {
    const install_err_msg = `Status code ${ result.status }. Could not `
      + `dainstall this package on your server. See above for more details.`;
    log.throw({ code: `ALK0047`, context: `setup`,
      before: `☝️ ☝️ ☝️  Error data ☝️ ☝️ ☝️\n`,
      error: `Error while installing project` },
      install_err_msg
    );
  }

  log.success({ code: `ALK0048`, context: `setup`, },
    `ALKiln created a Project in your Playground named "${ project_name }"!`
  );
};  // Ends setup();

// 1. session_vars - make sure all the required env vars exist
session_vars.validateEnvironment();

// 2. Prepare logs
// Local devs: This will be separate from your test paths
// unless you pass a `path` argument into the cucumber run command
const argv = require(`minimist`)(process.argv.slice(2));
const log = new Log({ path: argv.path, context: `setup` });

// 3. run in a wrapper
log.with_cleanup({ todo: setup });
