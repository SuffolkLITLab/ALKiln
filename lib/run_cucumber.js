#!/usr/bin/env node

const fs = require('fs');
const path = require(`path`);
const cucumber_api = require('@cucumber/cucumber/api');

const Log = require('./utils/log');
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
  // Joining and splitting handles both tags surrounded with `""` or those without `""`
  let tags = command_args[`_`].join(` `).split(` `);
  // If there was no tag expression, `tags` is ['']. Remove that item.
  tags = tags.filter(function(entry) { return entry !== ""; })
  if ( tags.length > 0 ) {
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


async function main() {
  /** Create the cucumber config, run the tests, create and
  *   manipluate the output. */

  const environment = { cwd: process.cwd() };
  log.info({ code: `ALK0049`, context: `pre_run environment` },
    environment
  );

  // We'll use the user info to construct the possible paths to /sources
  let id = session_vars.get_user_id();
  // `project` is the name in the server docassemble "Project" page
  let project = session_vars.get_user_project_name();

  // process.argv is a list of strings of commands and args.
  // If using `npm run cucumber` (as opposed to the bin commands),
  // use `--` before `--sources=./foo`
  const argv = require(`minimist`)( process.argv.slice(2), {
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
    log.throw({ code: `ALK0050`, context: `pre_run`,
      error: new ReferenceError(
        `ALKiln can't find your "sources" folder(s). See above for details.`
      ),
    });
  }
  
  const { runConfiguration } = await cucumber_api.loadConfiguration({
    provided: build_config( argv ),
  }, environment);
  log.info({ code: `ALK0051`, context: `pre_run config`, },
    runConfiguration
  );

  const codeDir = path.dirname(require.main.filename);
  log.info({ code: `ALK0052`, context: `pre_run directory`, },
    codeDir, `\n\n`
  );
  const support = await cucumber_api.loadSupport({ support: {
    requireModules: [ `${ codeDir }/index.js` ],
    requirePaths: [ `${ codeDir }/index.js` ],
    importPaths: [],
  }, sources: {paths: []}}, environment);

  // ====================
  /** Run */
  // ====================
  const { success } = await cucumber_api.runCucumber({...runConfiguration, support});
  // ====================

  /** Write to files.
   *
   * Note: Don't add to the purely report-focused files. Those are files where
   *    authors can focus on the info we give them, which they often miss in
   *    the GitHub action.
   */

  if ( success ) {
    log.success({ code: `ALK0054`, context: `post_run`, },
      `Tests succeeded!`
    );
  } else {
    // Don't want to throw error here, so don't pass error object
    log.warn({ code: `ALK0055`, context: `post_run`, },
      `The tests ran into something unexpected. Look above for more details.`
    );
  }
  // Custom exit code. May overlap with other systems.
  // Best info I've found via stack overflow: https://tldp.org/LDP/abs/html/exitcodes.html
  const exitCode = success ? 0 : 50;
  process.exitCode = exitCode;

  // This is hardcoded information from `provide_config` above.
  // This code isn't used for anything other than detecting and removing color codes.
  let summary_file_name = SUMMARY_FILENAME;
  fs.readFile(summary_file_name, 'utf8', (read_error, text) => {
    if ( read_error ) {
      // Something else will probably show an error that's more relevant
      log.warn({ code: `ALK0056`, context: `post_run error`, },
        `Failed to read cucumber report`, read_error
      );
      return;
    }

    // Replace terminal color codes, if present
    // https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode
    text = text.replace(/\x1b\[[0-9][0-9]?[0-9]?m/g, '');

    try {
      // Add to the debug and non-passed test output files
      if ( exitCode === 50 ) {
        // Save only non-passing test output to cut out cruft.
        // Our reports save only non-passing tests to this file.
        log.debug({ code: `ALK0216`, context: `post_run`, level: `warn` },
          `\n\n`, text
        );
      } else {
        log.debug({ code: `ALK0225`, context: `post_run`, },
          `\n\n`, text
        );
      }

      // Include debug info at the bottom of the unexpected results file if needed
      let debug_unexpected_content = ``;
      try {
        debug_unexpected_content = fs.readFileSync(`${ log.path }/${ log.debug_unexpected_filename }`);
      } catch ( error_reading_debug_unexpected ) {
        // It's ok if this file doesn't exist
      }
      if ( debug_unexpected_content !== `` ) {
        fs.appendFileSync(
          `${ log.path }/${ log.unexpected_filename }`,
          `\n\n\n\n\n\n\n\n
≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
🐛        Full DEBUG info (some repeated content)        🐛
≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n\n`
        );
        fs.appendFileSync(`${ log.path }/${ log.unexpected_filename }`, debug_unexpected_content );
      }

    } catch ( writing_cucumber_error ) {
      let code = `ALK0182`;
      let context = `post_run error`
      let msg = `Something probably went wrong earlier. Look above for more details. Skipped writing to ${ log.path }/${ log.debug_log_filename }.`;
      try {
        log.warn({ code, context, }, msg, writing_cucumber_error );
      } catch ( all_writing_error ) {
        console.warn( `🔎 ${ code } ${ context } WARNING ${ Date.now() }: ${ msg }` );
        console.warn( writing_cucumber_error );
        console.warn( all_writing_error );
      }

    }  // ends try writing to debug files

    return;
  });
}


// 1. session_vars - make sure all the required env vars exist
session_vars.validateEnvironment();

// 2. Prepare logs
// process.argv is a list of strings of commands and args.
// If using `npm run cucumber` (as opposed to the bin commands),
// use `--` before `--sources=./foo`
const argv = require(`minimist`)( process.argv.slice(2) );
// The artifacts folder might be getting created for the first
// time right here. The tests themselves should avoid creating
// their own file.
const log = new Log({ path: argv.path, context: `run` });

// 3. run
main();
