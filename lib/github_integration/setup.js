#!/usr/bin/env node

const install_branch = require('./install-branch.js');
// How do we handle an UnhandledPromiseRejection error
install_branch.setup().catch(function (error) {
  throw error;
});
