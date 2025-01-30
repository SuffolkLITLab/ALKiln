#!/usr/bin/env node

const session_vars = require(`../utils/session_vars`);

session_vars.delete_artifacts_path_name();
// Leave the config Project name value as it is. Local developers find it
//    useful to re-use that value.
