#!/usr/bin/env node

const fs = require('fs');

let summary_file_name = '';
// We want to get the text of the cucumber summary, which should be in a file set in `cucumber.json`.
try {
  const summary_str = 'summary:'
  const data = JSON.parse(fs.readFileSync('cucumber.json', 'utf8'));
  for (format of data.default.format) {
    if (format.startsWith(summary_str)) {
      summary_file_name = format.substring(summary_str.length)
      break;
    }
  }
} catch (err) {
  console.error("Couldn't find 'cucumber.json' file?");
}

if (!summary_file_name) {
  process.exit(1);
}

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