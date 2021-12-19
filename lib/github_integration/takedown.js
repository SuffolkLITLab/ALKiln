#!/usr/bin/env node

const install_branch = require('./install-branch.js');
try {
  install_branch.takedown();
} catch ( error ) {
  throw error;
}
