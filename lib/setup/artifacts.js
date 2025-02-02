#!/usr/bin/env node

const session_vars = require(`../utils/session_vars`);
const files = require(`../utils/files`);
const Log = require(`../setup/artifacts.js`);

/** Reset and refresh artifacts path name */

session_vars.delete_artifacts_path_name();

// process.argv is a list of strings of commands and args.
// If using `npm run cucumber` (as opposed to the bin commands),
// use `--` before `--sources=./foo`
const argv = require(`minimist`)( process.argv.slice(2) );
const artifacts_path = files.make_artifacts_folder( argv.path );

session_vars.save_artifacts_path_name( artifacts_path );

// Leave the config Project name value as it is. Local developers find it
//    useful to re-use that value.
