#!/usr/bin/env node

// TODO: Rename to playground_install?
const child_process = require(`child_process`);
// const util = require(`util`);

// const da_i = require(`./docassemble_api_interface`);
const log = require(`../utils/log`);
const session_vars = require(`../utils/session_vars` );

// const execPromise = util.promisify(exec);

const setup = async () => {
  /* In the docassemble testing account identified by the
  *   DOCASSEMBLE_DEVELOPER_API_KEY secret, create a new Project,
  *   pull code into that project, and, if needed, wait for the
  *   server to restart. */
  
  let project_name = session_vars.get_project_base_name().replace(/[^A-Za-z0-9]/g, '') + `${Date.now()}`;
  session_vars.save_project_name( project_name );

  log.info({ type: `setup`, pre: `Starting to upload this package to `
    + `a new Project called ${project_name} in the Playground `
    + `of your server's testing account.` });

  // dainstall . --apiurl https://apps-dev.suffolklitlab.org --apikey $API_KEY --playground --project=name
  // I think this won't run on windows?
  // Also, should we use `--noconfig`?
  let result = child_process.spawnSync(
    `dainstall`,
    [
      `.`, `--apiurl`, session_vars.get_da_server_url(),
      `--apikey`, session_vars.get_dev_api_key(),
      `--playground`, `--project=${ project_name }`
    ],
    // Prints messages from the process to the console while it's running
    { stdio: 'inherit', }
  );

  if ( result.status !== 0 ) {
    log.error({
      type: `setup`,
      pre: `Error: Status code ${ result.status }. Could not dainstall this package to your server. Server response:`,
      data: result
    });
    throw(result.stderr);
  }

  log.info({
    type: `setup`,
    pre: `Success! ALKiln created a Project in your Playground named "${ project_name }"` 
  });

  // const subprocess = spawn('bad_command');

  // subprocess.on('error', (err) => {
  //   console.error('Failed to start subprocess.');
  // });

  // Will be validated on creation of the project
  // // Check that API key is valid. Will error if it is invalid.
  // // Should the error be thrown here?
  // await da_i.validate_api_key();

  // Make and save project name

  // // Create a project on the da server's account with a unique name then
  // // store it locally for later deleting the project. 
  // let project_name = null;
  // // Explicit try-catch prevents "Unhandled promise rejection error"
  // // avoids showing confusing node errors to users that they shouldn't have to fix
  // try {
  //   project_name = await da_i.loop_to_create_project();
  //   log.info({type: `setup`, pre: `Created a Project named ${ project_name }`});
  // } catch (error) {
  //   log.error({type: `setup`, pre: `an unexpected error occurred while trying to create a docassemble project in the user's account`, data: JSON.stringify(error, null, 4)})
  //   // we don't re-throw the exception, so make sure to exit with 1 to let Github Actions know the script failed
  //   process.exitCode = 1;
  //   return;
  // }
  // // Once the name is created, save that name to a local file.
  // session_vars.save_project_name( project_name );

  // Do in github
  // // Use bash to install the project in the server's playground
  // try {
  //   let { stdout, stderr } = await execPromise(`pip3 install docassemblecli`);
  //   console.log(stdout);
  // } catch (error) {
  //   console.error(error);
  // }

  // let project_name = session_vars.get_project_base_name().replace(/[^A-Za-z0-9]/g, '') + `${Date.now()}`;
  // // This may not be able to give a stream of output
  // let { stdout, stderr } = await execPromise(`dainstall . --apiurl https://apps-dev.suffolklitlab.org --apikey $DA_ADMIN_API_KEY --playground --project=${project_name}`);
  // console.log( `Success: ${ stdout }` );
  // console.log( `Error: ${ stderr }` );
  // // save project name

  // let counter = 0;
  // let msg = `ALKiln setup: `
  // // TODO: Change to 15 tries
  // while ( counter < 5 ) {
  //   // For now, just in case
  //   counter++;
  //   console.log( `${msg} Try number ${ counter }` );

    // let { stdout, stderr } = await execPromise(`dainstall . --apiurl https://apps-dev.suffolklitlab.org --apikey $DA_ADMIN_API_KEY --playground --project=${project_name}`);
    // if ( stdout.includes( `200` )) {
    //   msg += `Success!`;
    //   break;
    // } else if ( stdout.includes( `400` )) {
    //   // counter++;
    //   `Trying again`
    // } else if ( stdout.includes( `403` )) {
    //   // Unauthorized
    //   `Invalid API key`
    //   throw;
    // } else {
    //   msg += `Failed to create new project`;
    //   throw new Error(stderr)
    // }
    
  // }

  // Timeout?

  // // Pull code and wait for server restart to finish if needed
  // let task_id = await da_i.pull();
  // // Task id will be null if server did not need to restart
  // if ( task_id ) {
  //   await da_i.wait_for_playground_to_restart( task_id );
  // }

  // Finish
  // log.info({ type: `setup`, pre: `Success! Test setup has finished successfully.` });
  // log.info({ type: `setup`, pre: `Finished trying.` });
};  // Ends setup();


setup();
