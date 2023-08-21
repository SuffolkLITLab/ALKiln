#!/usr/bin/env node

const session_vars = require('../utils/session_vars');

const server_install = async () => {
  session_vars.save_install_type("server");
};  // Ends server_install();

server_install();
