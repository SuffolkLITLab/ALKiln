#!/usr/bin/env node

const session_vars = require('../utils/session_vars');
const log = require('../utils/log');
const fg = require('fast-glob');

const server_install = async () => {
  session_vars.save_install_method(`server`);

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

  let chosen_folder = folders[0];
  if ( folders.length === 0 ) {
    let msg = `There are 0 folders at ${path}. Tests won't run.`;
    log.error({ type: `setup`, data: msg })
    throw new ReferenceError( msg );
  }

  if ( folders.length > 1 ) {
    log.warn({
      type: `setup`,
      data: `There are ${folders.length} folders at ${path}: "${folders.join('", "')}". ALKiln chose to use the folder "${chosen_folder}".`
    })
  }

  console.log(`\n===========\nchosen_folder: ${chosen_folder}\n===========\n`);
  session_vars.save_repo_folder_name( chosen_folder );
};  // Ends server_install();

server_install();