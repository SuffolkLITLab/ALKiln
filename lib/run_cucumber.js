#!/usr/bin/env node

const fs = require('fs');
const log = require('./utils/log');
const session_vars = require('./utils/session_vars');

const cucumber_api = require('@cucumber/cucumber/api');

(async function main() {
  let argv = process.argv;

  const environment = { cwd: process.cwd() };
  console.log("alkiln-run: environment: %o", environment);
  const provided_config = {
    "publishQuiet": true,
    "require": "./lib/index.js",
    "format": ["progress", "summary:cucumber-report.txt"],
    "paths": ["docassemble/*/data/sources/*.feature"],
    "retry": 1,
  }


  // If they're running it from an interview on their server instead of from GitHub
  if ( session_vars.get_origin() === `playground` ) {
    provided_config.paths.push(`/usr/share/docassemble/files/playgroundsources/${session_vars.get_user_id()}/${session_vars.get_user_project_name()}/*.feature`);
    // For S3
    provided_config.paths.push(`/tmp/playgroundsources/${session_vars.get_user_id()}/${session_vars.get_user_project_name()}/*.feature`);
  }

  let tags = argv.slice(2);
  if ( session_vars.get_origin() === `playground` ) {
    tags = session_vars.get_tags();
  }

  if (tags.length > 0) {
    // Cucumber expects tags in boolean expressions, like (@a0 or @a1) and @random.
    // If we get a list of only tags, then "or" them all together
    if (tags.every((val) => val.startsWith("@"))) {
      provided_config.tags = tags.join(' or ');
    }
    // If we get a list of seemingly no tags, assume they meant to use tags
    else if (tags.every((val) => !val.startsWith("@"))) {
      provided_config.tags = tags.map((val) => "@" + val).join(' or ');
    }
    // If it's a mix of tags and no tags, it's probably a boolean expression!
    else {
      provided_config.tags = tags.join(' ');
    }
  }

  const { runConfiguration } = await cucumber_api.loadConfiguration({
    provided: provided_config
  }, environment);
  console.log("alkiln-run: runConfiguration: %o", runConfiguration);
  var path = require('path');
  var codeDir = path.dirname(require.main.filename);
  const support = await cucumber_api.loadSupport({ support: {
    requireModules: [`${ codeDir }/index.js`],
    requirePaths: [ `${ codeDir }/index.js`],
    importPaths: [],
  }, sources: {paths: []}}, environment);

  console.log("alkiln-run: working directory: %o", codeDir);

  const { success } = await cucumber_api.runCucumber({...runConfiguration, support});
  console.log("alkiln-run: success: %b", success);
  const exitCode = success ? 0 : 1;
  process.exitCode = exitCode;

  // This is hardcoded information from `provide_config` above.
  // This code isn't used for anything other than detecting and removing color codes.
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
