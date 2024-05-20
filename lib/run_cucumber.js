#!/usr/bin/env node

const fs = require('fs');
const cucumber_api = require('@cucumber/cucumber/api');

const log = require('./utils/log');  // These always log in the console
const session_vars = require('./utils/session_vars');

const SUMMARY_FILENAME = `cucumber-report.txt`;

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
    format: [`progress`, `summary:${ SUMMARY_FILENAME }`],
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
  log.info({ type: `run`, code: `ALK0049`, pre: `environment`, data: environment });

  // We'll use the user info to construct the possible paths to /sources
  let id = session_vars.get_user_id();
  // `project` is the name in the server docassemble "Project" page
  let project = session_vars.get_user_project_name();

  // process.argv is a list of strings of commands and args.
  // If using `npm run cucumber`, use `--` before `--sources=./foo`
  let argv = require(`minimist`)( process.argv.slice(2), {
    default: {
      sources: [
        `./docassemble/*/data/sources`,  // In GitHub folder
        `/usr/share/docassemble/files/playgroundsources/${id}/${project}/*.feature`, // From playground without S3
        `/tmp/playgroundsources/${id}/${project}/*.feature` // From playground with S3
      ],
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
    let msg = `ALKiln can't find your "sources" folder(s). See above for details.`;
    let code = `ALK0050`
    log.error({ type: `run`, code: code, pre: msg });
    throw new ReferenceError(`🤕 ${ code } run ERROR: ${ msg }`);
  }
  
  const { runConfiguration } = await cucumber_api.loadConfiguration({
    provided: build_config( argv ),
  }, environment);

  log.info({ type: `run`, code: `ALK0051`, pre: `runConfiguration`, data: runConfiguration });

  var path = require(`path`);
  var codeDir = path.dirname(require.main.filename);
  log.info({ type: `run`, code: `ALK0052`, pre: `working directory`, data: codeDir });
  const support = await cucumber_api.loadSupport({ support: {
    requireModules: [ `${ codeDir }/index.js` ],
    requirePaths: [ `${ codeDir }/index.js` ],
    importPaths: [],
  }, sources: {paths: []}}, environment);

  log.info({ type: `run`, code: `ALK0053`, pre: `working directory`, data: codeDir });
  log.info({ type: `plain`, pre: `\n\n` });

  const { success } = await cucumber_api.runCucumber({...runConfiguration, support});
  if ( success ) {
    log.success({ type: `run`, code: `ALK0054`, pre: `Tests succeeded!` });
  } else {
    log.error({ type: `run`, code: `ALK0055`, pre: `One or more tests got unexpected results` });
  }
  // Code is our custom code for proper completion with failed tests
  const exitCode = success ? 0 : 2;
  process.exitCode = exitCode;

  // This is hardcoded information from `provide_config` above.
  // This code isn't used for anything other than detecting and removing color codes.
  let summary_file_name = SUMMARY_FILENAME;
  fs.readFile(summary_file_name, 'utf8', (err, text) => {
    if (err) {
      log.error({ type: `internal run`, code: `ALK0056`, pre: `Failed to read cucumber report`, data: err });
      return;
    }

    // Replace terminal color codes, if present
    // https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode
    text = text.replace(/\x1b\[[0-9][0-9]?[0-9]?m/g, '');

    // Put it in the correct file in the correct folder
    let artifacts_path = session_vars.get_artifacts_path_name();
    fs.appendFileSync( `${ artifacts_path }/${ log.debug_log_file }`, `\n\n${text}`);
    // Errors here shouldn't bother the user. Put in debug log instead.
    try {
      // Add to a unexpected results file (that should exist already) if needed
      if ( exitCode === 2 ) {
        fs.appendFileSync(
          `${ artifacts_path }/${ log.unexpected_filename }`,
          `\n\n${ text }`
        );
      }
    } catch ( error ) {
      log.error({ type: `internal run`, code: `ALK0181`, pre: `Failed to read ${ log.unexpected_filename }`, data: error });
    }
  });
})();
