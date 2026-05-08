#!/usr/bin/env node

const session_vars = require(`../utils/session_vars`);
const files = require(`../utils/files`);
const Log = require(`../utils/Log.js`);

/**
 * Reset and refresh artifacts path name. Use this at the start of every test
 * run for that run's unique results.
 * */

session_vars.delete_artifacts_path_name();

const artifacts_path = files.make_artifacts_folder();
session_vars.save_artifacts_path_name( artifacts_path );

const log = new Log({ path: artifacts_path, context: `artifacts` });
log.info({ code: `ALK0278`, context: `artifacts`,},
  `Created the artifacts folder at "${ artifacts_path }"`
);
