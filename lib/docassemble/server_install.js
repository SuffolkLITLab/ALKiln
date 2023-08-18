#!/usr/bin/env node

//const da_i = require('./docassemble_api_interface');
const session_vars = require('../utils/session_vars');

const server_install = async () => {
  // let task_id = await da_i.install_on_server();
  // if (task_id) {
  //   console.log("Waiting...")
  //   await da_i.wait_for_package_to_restart(task_id);
  // }
  // console.log("Done!")

  session_vars.save_install_type("server");

};  // Ends server_install();

server_install();
