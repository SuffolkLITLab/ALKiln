#!/usr/bin/env node

const fs = require('fs');
const log = require('./utils/log');
const session_vars = require('./utils/session_vars');

const cucumber_api = require('@cucumber/cucumber/api');

function build_config(argv) {
  // The default provided config
  const provided_config = {
    publishQuiet: true,
    require: `./lib/index.js`,
    format: [`progress`, `summary:cucumber-report.txt`],
    paths: [`${ argv.sources }/*.feature`],
    retry: 1,
  }

  let tags = argv[`_`];
  if ( session_vars.get_origin() === `playground` ) {
    tags = session_vars.get_tags();
  }

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

    provided_config.tags = joined_tags;
  }  // end if there are tags

  // argv["tags"];
  // for (let source_folder of argv["source"]) {
  //   sources_folder = just_args[idx + 1];
  //   provided_config.paths.push(sources_folder + "/*.feature");
  //   session_vars.set_sources_folder(sources_folder);
  // }

  return provided_config;
};  // Ends build_config()


(async function main() {
  /** Create the cucumber config, run the tests, create and
  *   manipluate the output. */
  const environment = { cwd: process.cwd() };
  console.log("alkiln-run: environment: %o", environment);

  // process.argv is a list of strings of commands and args.
  let argv = require(`minimist`)( process.argv.slice(2), {
    default: {
      // Testing from GitHub. TODO: Do we want to allow multiple sources paths?
      sources: `./docassemble/*/data/sources`,
      // From playground: `/usr/share/docassemble/files/playgroundsources/<user_id>/<project>/*.feature`
      // From playground with S3: `/tmp/playgroundsources/<user_id>/<project>/*.feature`

      // // Installed in a user Playground
      // url: `<server>/interview?new_session=1&i=docassemble.playground<user_id><project>%3A`,
      // // server install: `<server>/interview?new_session=1&i=docassemble.<package>%3Adata/questions/`
    }
  });

  let dir_exists = session_vars.set_sources_path( argv.sources );
  if ( !dir_exists ) {
    // If we don't throw, it'll be more confusing when no tests run
    throw new ReferenceError( `No folder exists at "${ argv.sources }", where ALKiln looks for your \`.feature\` files.`)
  }

  const provided_config = build_config( argv );

  const { runConfiguration } = await cucumber_api.loadConfiguration({
    provided: provided_config
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
