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
    "paths": ["docassemble/*/data/sources/*.feature",
              // // "1" is the user id. We also need to get the Project name, etc.
              // "/usr/share/docassemble/files/playgroundsources/1/test.feature"
    ],
    "retry": 1,
  }

  console.log(1);

  // If they're running it from an interview on their server instead of from GitHub
  if ( session_vars.get_origin() === `interview` ) {
    provided_config.paths.push(`/usr/share/docassemble/files/playgroundsources/${session_vars.get_user_id()}/${session_vars.get_user_project_name()}/*.feature`);
  }

  console.log(2, provided_config.paths);

  let tag_vals = just_args;
  if ( session_vars.get_origin() === `interview` ) {
    // Should tags be given as a string or a list? String would give option to
    // give a boolean expression. TODO: offer a dropdown with available tags.
    tag_vals = session_vars.get_tags();
  }

  console.log(3, tag_vals);

  if (tag_vals.length > 0) {
    // Cucumber expects tags in boolean expressions, like (@a0 or @a1) and @random.
    // If we get a list of only tags, then "or" them all together
    if (tag_vals.every((val) => val.startsWith(`@`))) {
      provided_config.tags = tag_vals.join(` or `);
    }
    // If we get a list of seemingly no tags, assume they meant to use tags
    else if (tag_vals.every((val) => !val.startsWith(`@`))) {
      provided_config.tags = tag_vals.map((val) => `@${ val }`).join(` or `);
    }
    // If it's a mix of tags and no tags, it's probably a boolean expression!
    else {
      provided_config.tags = tag_vals.join(` `);
    }
  }

  console.log(4, provided_config.tags);

  const { runConfiguration } = await cucumber_api.loadConfiguration({
    provided: provided_config
  }, environment);
  console.log(5);
  var path = require('path');
  console.log(6);
  var codeDir = path.dirname(require.main.filename);
  console.log(7);
  const support = await cucumber_api.loadSupport({ support: {
    requireModules: [`${ codeDir }/index.js`],
    requirePaths: [ `${ codeDir }/index.js`],
    importPaths: [],
  }, sources: {paths: []}}, environment);
  
  // TODO: Maybe only log these for debug?
  console.log(`ALKiln run_cucumber.js configuration:`);
  console.log(`%o`, runConfiguration);

  const { success } = await cucumber_api.runCucumber({...runConfiguration, support});
  console.log(`ALKiln run_cucumber.js succeeded:`);
  console.log(`%o`, success);
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
