#!/usr/bin/env node

const fs = require('fs');
const log = require('./utils/log');
const session_vars = require('./utils/session_vars');

const cucumber_api = require('@cucumber/cucumber/api');

function build_config( command_args ) {
  // Turn all the paths to the sources folders into paths to the feature files
  let sources_paths = session_vars.get_sources_paths();
  let feature_paths = [];
  for ( let source of sources_paths ) {
    feature_paths.push( `${ source }/*.feature` );
  }

  const config = {
    publishQuiet: true,
    require: `./lib/index.js`,
    format: [`progress`, `summary:cucumber-report.txt`],
    paths: feature_paths,
    retry: 1,
  }

  // Normalize tag expressions, if there are any
  let tags = command_args[`_`];
  if (tags.length > 0) {
    let joined_tags = '';
    // Cucumber expects tags in boolean expressions, like (@a0 or @a1) and @random.
    // If we get a list of only tags, then "or" them all together
    if (tags.every((val) => val.startsWith(`@`))) {
      joined_tags = tags.join(` or `);
    }
    // If we get a list of seemingly no tags, assume they meant to use tags
    else if (tags.every((val) => !val.startsWith(`@`))) {
      joined_tags = tags.map((val) => `@` + val).join(` or `);
    }
    // If it's a mix of tags and no tags, it's probably a boolean expression!
    else {
      joined_tags = tags.join(` `);
    }

    config.tags = joined_tags;
  }

  return config;
};  // Ends build_config()


(async function main() {
  /** Create the cucumber config, run the tests, create and
  *   manipluate the output. */
  const environment = { cwd: process.cwd() };
  console.log("alkiln-run: environment: %o", environment);

  // process.argv is a list of strings of commands and args.
  // If using `npm run cucumber`, use `--` before `--sources=./foo`
  let argv = require(`minimist`)( process.argv.slice(2), {
    default: {
      // Testing from GitHub. TODO: Do we want to allow multiple sources paths?
      sources: [ `./docassemble/*/data/sources` ],
      // From playground: `/usr/share/docassemble/files/playgroundsources/<user_id>/<project>/*.feature`
      // From playground with S3: `/tmp/playgroundsources/<user_id>/<project>/*.feature`
    }
  });
  
  // Make sure `sources` is always a list
  let sources_list = argv.sources;
  if ( typeof argv.sources === `string` ) {
    sources_list = [ argv.sources ];
  }

  let one_dir_exists = session_vars.set_sources_paths( sources_list );
  if ( !one_dir_exists ) {
    // If we don't throw, it'll be more confusing when no tests run
    throw new ReferenceError( `ALKiln ERROR: ALKiln can't find your "sources" folder(s). See above for details.`);
  }
  
  const { runConfiguration } = await cucumber_api.loadConfiguration({
    provided: build_config( argv ),
  }, environment);

  console.log("alkiln-run: runConfiguration: %o", runConfiguration);

  var path = require('path');
  var codeDir = path.dirname(require.main.filename);
  console.log("alkiln-run: working directory: %o", codeDir);
  const support = await cucumber_api.loadSupport({ support: {
    requireModules: [ `${ codeDir }/index.js` ],
    requirePaths: [ `${ codeDir }/index.js` ],
    importPaths: [],
  }, sources: {paths: []}}, environment);

  console.log(`\n\n`);

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
    fs.appendFileSync( `${ artifacts_path }/${ log.debug_log_file }`, data);
  });
})();
