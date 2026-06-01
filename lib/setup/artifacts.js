#!/usr/bin/env node

const session_vars = require(`../utils/session_vars`);
const files = require(`../utils/files`);
const Log = require(`../utils/Log.js`);

/**
 * Reset and refresh artifacts path name. Use this at the start of every test
 * run for that run's unique results.
 * */

session_vars.delete_artifacts_path_name();

// process.argv is a list of strings of commands and args.
// If using `npm run artifacts` (as opposed to the bin commands),
// use `--` before, for example, `--sources=./foo`
// Envs like action.yml reuse their own .path when return vals are hard to get
const forced_path = require(`minimist`)( process.argv.slice(2) )?.path;
const artifacts_path = files.make_artifacts_folder( forced_path );
session_vars.save_artifacts_path_name( artifacts_path );

const log = new Log({ path: artifacts_path, context: `artifacts` });
log.info({ code: `ALK0278`, context: `artifacts`,},
  `Created the artifacts folder at "${ artifacts_path }"`
);
