#!/usr/bin/env node

const fs = require('fs');

// This is hardcoded information from `cucumber.js`. Once we move to cucumber 8, we should
// change that the cucumber.json and actually parse the info from it. 
let summary_file_name = 'cucumber-report.txt';
fs.readFile(summary_file_name, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // Replace terminal color codes, if present
  // https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode
  data = data.replace(/\x1b\[[0-9][0-9]?[0-9]?m/g, '');
  const files = fs.readdirSync('.');
  const kiln_report_str = 'alkiln_report_';
  let latest_kiln_report_file = files[0];
  for (let filename of files) {
    if (filename.startsWith(kiln_report_str)) {
      if (filename > latest_kiln_report_file) {
        latest_kiln_report_file = filename;
      }
    }
  }
  fs.appendFile(latest_kiln_report_file, data, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
});