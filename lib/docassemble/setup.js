#!/usr/bin/env node

// TODO: Rename to playground_install?

const child_process = require(`child_process`);

const log = require(`../utils/log`);
const session_vars = require(`../utils/session_vars` );

const setup = async () => {
  /** In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, create a new Project,
  *   pull code into that project, and, if needed, wait for the
  *   server to reload.
  */
  
  // Make and save project name
  let project_name = session_vars.get_project_base_name().replace(/[^A-Za-z0-9]/g, '') + `${Date.now()}`;
  session_vars.save_project_name( project_name );

  log.info({ type: `setup`, code: `ALK0046`, pre: `Starting to upload this package to `
    + `a new Project called ${project_name} in the Playground `
    + `of your server's testing account. It may take a couple of minutes.` });

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
    { stdio: 'inherit', }
  );

  // 403 is invalid API key, but I'm not sure how to output
  // the response to find out the error code

  if ( result.status !== 0 ) {
    log.error({
      type: `setup`,
      code: `ALK0047`,
      pre: `Status code ${ result.status }. Could not dainstall this package on your server. See above for more details.`
    });
    throw(result.stderr);
  }

  log.success({
    type: `setup`,
    code: `ALK0048`,
    pre: `ALKiln created a Project in your Playground named "${ project_name }"!`
  });
};  // Ends setup();


// Before everything, make sure all the required env vars exist
session_vars.validateEnvironment();
setup();
