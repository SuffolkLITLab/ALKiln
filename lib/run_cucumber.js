#!/usr/bin/env node

const fs = require('fs');
const log = require('./utils/log');
const session_vars = require('./utils/session_vars');
const verror = require("verror");
const cucumber_cli = require('@cucumber/cucumber/lib/cli');

import {loadConfiguration, loadSupport, runCucumber } from '@cucumber/cucumber/api';

(async function main() {

  // This call sets `process.exitCode`, which means that if any of the tests
  // fail, this process will still fail.
  const cwd = process.cwd();
  let argv = process.argv;

  let just_args = null;
  if (argv.length == 1 && argv[0].endsWith("run_cucumber.js")) {
    just_args = argv.slice(1);
    argv = argv.slice(0, 1);
  }
  if (argv.length == 2 && (argv[0].endsWith("node.exe") || argv[0].endsWith("node")) && argv[1].endsWith("run_cucumber.js")) {
    just_args = argv.slice(2);
    argv = argv.slice(0, 2);
  }
  if (just_args) {
    just_args.unshift("--");
    just_args.push("docassemble/*/data/sources/*.feature", "--retry", "1");
    argv = argv.concat(just_args);
  }

  const { runConfiguration } = await loadConfiguration({provided: {
    "publishQuiet": true,
    "require": "./lib/index.js", 
    "format": ["progress", "summary:cucumber-report.txt"]
  }});

  const { success } = await runCucumber(runConfiguration);
  console.log("%o", success);
  const exitCode = result.success ? 0 : 1;
  process.exitCode = exitCode;

  //const cli = new cucumber_cli.default({
  //    argv: argv,
  //    cwd,
  //    stdout: process.stdout,
  //});
  //try {
  //  result = await cli.run();
 // }
 // catch (error) {
  //  console.error(error);
   // process.exit(1);
  //}

  //const exitCode = result.success ? 0 : 1;
  //process.exitCode = exitCode;

  // This is hardcoded information from `cucumber.js`. Once we move to cucumber 8, we should
  // change that the cucumber.json and actually parse the info from it.
  // The file won't be used for anything other than detecting and removing color codes 
  let summary_file_name = 'cucumber-report.txt';
  fs.readFile(summary_file_name, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Replace terminal color codes, if present
    // https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode
    data = data.replace(/\x1b\[[0-9][0-9]?[0-9]?m/g, '');

    // Put it in the correct file in the correct folder
    let artifacts_path = session_vars.get_artifacts_path_name();
    fs.appendFileSync( `${ artifacts_path }/${ log.debug_log_file }`, data, err => {
      console.log(err);
      if (err) {
        console.error(err);
        return;
      }
    });  // Ends appendFileSync
  });
})();