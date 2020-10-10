const install_branch = require('./tests/install-branch.js');
const steps = require('./tests/features/support/steps.js');

let setup = install_branch.setup;
let takedown = install_branch.takedown;


module.exports = { setup, takedown, steps };
