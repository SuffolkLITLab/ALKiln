#!/usr/bin/env node

const fs = require('fs');
const log = require('./log');
const session_vars = require('./session_vars');

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
  fs.appendFile( `${ artifacts_path }/${ log.debug_log_file }`, data, err => {
    if (err) {
      console.error(err);
      return;
    }
  });  // Ends appendFileSync
});