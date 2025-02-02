#!/usr/bin/env node

const session_vars = require(`../utils/session_vars`);
const files = require(`../utils/files`);
const Log = require(`../setup/artifacts.js`);

// Reset artifacts path
session_vars.delete_artifacts_path_name();
let artifacts_path = files.make_artifacts_folder();
session_vars.save_artifacts_path_name( artifacts_path );

// Leave the config Project name value as it is. Local developers find it
//    useful to re-use that value.

/**
 * To get the folder path, look in stdout for `ALK0214` or `ALK0257` and between
 *    double quotes ("").
 * */
