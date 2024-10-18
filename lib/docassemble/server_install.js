#!/usr/bin/env node

const session_vars = require('../utils/session_vars');
const Log = require('../utils/log');
const fg = require('fast-glob');

const context = `server_install`;

const server_install = async () => {
  /** For packages we are installing on a temporary GitHub docassemble server.
   *
   *  - Store that the package is being installed globally on a server as
   *    opposed to on a specific author's account (their Playground).
   *  - In the repo, find and store the path to directory that stores the
   *    package itself instead of the whole repo. For example, EvictionDefense
   *    in the docassemble-EvictionDefense repo.
   * */
  session_vars.save_install_method(`server`);

  // Get path to folders inside repo main "docassemble" folder
  let current_dir = process.cwd();
  let path = `${ current_dir }/docassemble/*`;
  let dirs = fg.sync(
    [ path ],
    {
      suppressErrors: true,
      onlyDirectories: true
    }
  );

  let folders = dirs.map(function (dir) { return dir.split('/').pop(); })

  // Get names of all folders in repo "docassemble" folder
  let chosen_folder = folders[0];
  if ( folders.length === 0 ) {
    let msg = `ALKiln cannot find the package's files. There are 0 folders at "${ path }". Stopping tests.`;
    log.throw({ code: `ALK0044`, context,
      error: new ReferenceError( msg )  // no logs
    });
  }

  if ( folders.length > 1 ) {
    log.warn({ code: `ALK0045`, context, },
      `There are ${ folders.length } folders at "${ path }": "${ folders.join('", "') }". ALKiln chose to use the folder "${ chosen_folder }".`
    );
  } else {
    log.info({ code: `ALK0218`, context, },
      `ALKiln found the package folder at "${ chosen_folder }".`
    );
  }
  
  session_vars.save_repo_folder_name( chosen_folder );
};  // Ends server_install();

// 1. session_vars - make sure all the required env vars exist
session_vars.validateEnvironment();

// 2. Prepare logs
// Local devs: This will be separate from your test paths
// unless you pass a `path` argument into the cucumber run command
const argv = require(`minimist`)(process.argv.slice(2));
const log = new Log({ path: argv.path, context, });

// 3. run
server_install();
