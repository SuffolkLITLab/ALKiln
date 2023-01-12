#!/usr/bin/env node

const fs = require('fs');
const log = require('./utils/log');
const session_vars = require('./utils/session_vars');

// import {loadConfiguration, loadSupport, runCucumber } from '@cucumber/cucumber/api';
const cucumber_api = require('@cucumber/cucumber/api');

(async function main() {
  let argv = process.argv;

  let just_args = argv.slice(2);

  const environment = { cwd: process.cwd() };
  const provided_config = {
    "publishQuiet": true,
    "require": "./lib/index.js", 
    "format": ["progress", "summary:cucumber-report.txt"],
    "paths": ["docassemble/*/data/sources/*.feature"],
    "retry": 1,
  }
  if (just_args.length > 0) {
    // Cucumber expects tags in boolean expressions, like (@a0 or @a1) and @random.
    // If we get a list of only tags, then "or" them all together
    if (just_args.every((val) => val.startsWith("@"))) {
      provided_config.tags = just_args.join(' or ');
    }
    // If we get a list of seemingly no tags, assume they meant to use tags
    else if (just_args.every((val) => !val.startsWith("@"))) {
      provided_config.tags = just_args.map((val) => "@" + val).join(' or ');
    }
    // If it's a mix of tags and no tags, it's probably a boolean expression!
    else {
      provided_config.tags = just_args.join(' ');
    }
  }
  const { runConfiguration } = await cucumber_api.loadConfiguration({
    provided: provided_config
  }, environment);
  var path = require('path');
  var codeDir = path.dirname(require.main.filename);
  const support = await cucumber_api.loadSupport({ support: {
    requireModules: [`${ codeDir }/index.js`],
    requirePaths: [ `${ codeDir }/index.js`],
    importPaths: [],
  }, sources: {paths: []}}, environment);

  const { success } = await cucumber_api.runCucumber({...runConfiguration, support});
  console.log("%o", success);
  const exitCode = success ? 0 : 1;
  process.exitCode = exitCode;

  // This is hardcoded information from `cucumber.js`. Now we on cucumber 8, we should
  // change that the cucumber.json and actually parse the info from it.
  // This code isn't used for anything other than detecting and removing color codes 
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
    fs.appendFileSync( `${ artifacts_path}/${ log.debug_log_file }`, data);
  });
})();