#!/usr/bin/env node

const fs = require('fs');
const fg = require(`fast-glob`);
const cucumber_api = require('@cucumber/cucumber/api');

const log = require('./utils/log');  // These always log in the console
const session_vars = require('./utils/session_vars');

const SUMMARY_FILENAME = `cucumber-report.txt`;


function build_config( command_args ) {
  // Turn all the paths to the sources folders into paths to the feature files
  let sources_paths = session_vars.get_sources_paths();
  let feature_paths = [];

  // Get all the paths for the right feature files (for cucumber to use)
  for ( let source of sources_paths ) {
    const generators_prefix = `alkiln_random_`;
    generate_random_input_files({ generators_prefix, sources_path: source });
    // Ignore feature files that we parsed ourselves
    let glob = fg.sync(`${ source }/*.feature`, { ignore: [`${ source }/${ generators_prefix }*.feature`] });
    feature_paths.push( ...glob );
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


function generate_random_input_files({ generators_prefix, sources_path }) {
  // Get the contents of the source files that we need to parse to generate
  // random input tests
  let generator_paths = fg.sync(`${ sources_path }/${ generators_prefix }*.feature`);
  save_random_input_test_files({ generator_paths, sources_path });
};  // Ends generate_random_input_files()


function save_random_input_test_files({ generator_paths, sources_path }) {
  let files = [];
  for ( let generator_path of generator_paths ) {
    let original = fs.readFileSync( generator_path, {encoding: `utf8`});
    let file_str = generate_random_input_file_str( original );
    // let new_file_path = `${ sources_path }/_alkiln_generated_${ Date.now() }.feature`;
    // fs.appendFileSync( new_file_path, file_str );
  }
  return files;
};  // Ends save_random_input_test_files()


function generate_random_input_file_str( generator_file_contents ) {
  /** Returns the text for one file with all the requested random tests.
   *
   * TODO: consider importing one of cucumber's own parsers.
   * TODO: Maybe use second half of file name to add to Feature or Scenario
   *    description.
   *
   * TODO: Don't include comments
   * TODO: Break out each Scenario
   * */
  // // Get scenario parts
  // // Single scenario line and body:
  // ((Scenario:.*\n)((?:.|\n)*))(?:\n{2,})

  /**
   * 1. Get each constraints table in the file
   * 2. Replace each with a unique string
   * 3. Make an object with those strings as keys that match the appropriate table
   * 4. For each constraints table, generate random story tables
   *
   * Then what? Make a file where we duplicate each Scenario for as many random
   * instances as there need to be? What if there are multiple constraints
   * tables? If the author wants 2 random tests for the first and 2 random tests
   * for the second, do we end up with 4 random tests? There _are_ some tests
   * for which that would be appropriate.
   *
   * Opt 1: Author can only specify the interview and then the constraints
   * table, nothing else. That can generate however many random tests they want.
   *
   * Opt 2: Author can create individual tables that will only be run once, but
   * the field answers will be random for every constraints table ALKiln sees.
   * That is, no file generation, just answering with random answers. Current
   * Story Tables could possibly do that with the right syntax.
   * */

  /**
   * 1. Copy each line of the file into a string until we get to a Scenario.
   *    That will be the top of every file? The top of the single random input
   *    tests file?
   * 1. Add a comment and 2 new lines to add where to read more in the docs.
   * 1. Copy the lines of the Scenario until we get to the next Scenario or the
   *    end. That will generate one set of random tests.
   * 1. Do that for every Scenario.
   * 1. Turn each Scenario into a set of Scenarios using the Scenario
   *    description plus an incrementing number.
   * 1. And those strings to the one file.
   * */

  let { top, scenarios } = get_feature_file_parts({ generator_file_contents });
  for ( let scenario of scenarios ) {
    // let { scenario_top, constraints_steps, scenario_bottom } = get_scenario_parts({ scenario });
    if ( scenario ) {
      try {
        let scenario_data = get_scenario_parts({ scenario });
        console.log(`scenario_data:`, scenario_data);
        let {
          description,
          top: scenario_top,
          constraints,
          bottom: scenario_bottom,
          skip
        } = scenario_data;
      } catch ( scenario_parsing_error ) {
        console.log(`ALK0000 Error while reading scenario in "${ "file name" }"`, scenario_parsing_error );
      }
    }

  }

  return ``;
};  // Ends generate_random_input_file_str()


function get_feature_file_parts({ generator_file_contents }) {
  /** Given some text, return the parts of a .feature file
   *
   * TODO: Capture tags of Scenarios
   *
   * @returns {{}} parts Parts of the .feature file
   * @returns {str} parts.top Text before any Scenarios
   * @returns {[str]} parts.scenarios The text of each Scenario
   * */
  let generator_lines = generator_file_contents.split(`\n`);
  let top = ``, current_scenario = ``, scenarios = [];
  let found_a_scenario = false;
  // TODO: definition of variable in outer scope from inner scope?
  for ( let line_i = 0; line_i < generator_lines.length; line_i++ ) {
    let line = generator_lines[ line_i ];
    if ( /^\s*Scenario:/.test( line ) ) {  // Allow (only) whitespace at start
      found_a_scenario = true;
      scenarios.push( current_scenario );  // Empty string is fine
      // Start a Scenario from scratch
      current_scenario = `${ line }\n`;
      continue;
    }

    if ( !found_a_scenario ) { top += `${ line }\n`; }
    else { current_scenario += `${ line }\n`; }

    if ( is_last_item( generator_lines, line_i )) {
      scenarios.push( current_scenario );
    }
  } // ends for each generator line

  if ( !found_a_scenario ) {
    // TODO:
    console.log( `ALK0000 warn found no Scenarios in "${ "file name here" }"` );
  }

  // console.log(`top:`, top);
  // console.log(`scenarios:`, scenarios);

  return { top, scenarios };
};  // Ends get_feature_file_parts()


function is_last_item( list_or_string, index ) {
  return index === list_or_string.length - 1;
}


function get_scenario_parts({ scenario }) {
  /** Given the text of a Scenario, return the description of the Scenario, the
   *    text until the constraints Steps, an object of the constraints, and the
   *    text under those strings.
   *
   * WARNING: MUST only have one constraints section
   *
   * @returns {{}} parts
   * @returns {str} parts.description The Scenario description
   * @returns {str} parts.top Text before the constraint Steps
   * @returns {{}} parts.constraints The constraint values
   * @returns {str} parts.bottom Text after the constraint Steps
   * */

  /**
   * Constraints table is in separate lines :P
   *
   * Alternative:
   * - Collect and replace every line of constraints steps with a distinct
   *   symbol.
   * - Get text before and after multiple or single instance of symbol.
   * - Parse constraints separately.
   *
   * Alternative:
   *
   * When we find a constraints table, parse line by line until we don't find a
   *    line matching either only whitespace, a comment, or a table row pattern.
   *    Possible table row pattern from Gherkin?
   * */
  let skip = false;

  // Empty description is fine
  let description = scenario.match(/Scenario:(.*)/)[1];

  let scenario_lines = scenario.split(`\n`);
  let scenario_top = ``, options = ``, placeholder = ``, scenario_bottom = ``;
  let constraints = {};  //{ missing: [ `num`, `ids`, `url`, `options` ] };
  let found_constraints_section = false;
  let in_constraints_table = false;
  let got_all_constraints_keys = false;
  for ( let line_i = 0; line_i < scenario_lines.length; line_i++ ) {
    let line = scenario_lines[ line_i ];

    if ( line.trim() === `` ) { continue; }

    let possible_constraint = get_constraint_or_null({ text: line });
    if ( possible_constraint !== null ) {
      found_constraints_section = true;
      // constraints.missing.pop( constraints.missing.indexOf( Object.keys( possible_constraint )[0] ));
      warn_about_duplicate_key({ old_obj: constraints, new_obj: possible_constraint });
      if ( possible_constraint.options !== undefined ) {
        in_constraints_table = true;
      }
      constraints = { ...constraints, ...possible_constraint };
      // console.log(`combined constraints:`, constraints);
      // console.log(`possible_constraint.options:`, possible_constraint.options);
      const cots = constraints;
      if ( cots.number && cots.url && cots.ids && cots.options !== undefined ) {
        got_all_constraints_keys = true;
      }
      continue;
    }

    if ( !found_constraints_section ) {
      scenario_top += `${ line }\n`;
      continue;
    }
    if ( in_constraints_table ) {
      if ( is_valid_table_row({ line }) ) {
        constraints.options += `${ line }\n`;
        continue;
      } else {
        in_constraints_table = false;
      }
    }
    if ( !in_constraints_table && got_all_constraints_keys ) {
      scenario_bottom += `${ line }\n`;
      continue;
    }
  } // ends for each scenario line

  // Make sure we have all the constraints we need
  // TODO: Check that number is a number
  // console.log(`missing constraints:`, constraints.missing );
  if ( !constraints.number ) {
    console.log(`ALK0000 WARN: random test is missing the number of tests to create. ALKiln will skip this test:\n`, scenario);
  }
  if ( !constraints.options ) {
    console.log(`ALK0000 WARN: random test is missing the values section for the random tests. ALKiln will skip this test:\n`, scenario);
  }
  const cots = constraints;
  if ( !cots.number || !cots.ids || !cots.urls || !cots.options ) {
    skip = true;
  }

  // TODO: Allow "Then the question id should be" to include multiple ids
  // Then we don't have to include that in the constraints

  // console.log(`-- scenario parts --`);
  // console.log(`description:`, description);
  // console.log(`scenario_top:`, scenario_top);
  // console.log(`constraints:`, constraints);
  // console.log(`scenario_bottom:`, scenario_bottom);

  return {
    description,
    top: scenario_top,
    constraints,
    bottom: scenario_bottom,
    skip
  };
};  // Ends get_scenario_parts()


function get_constraint_or_null({ text }) {
  /** Return `null` if there's no constraints in the text or an object if there
   *    is.
   *
   * @returns {null | { key: value }} If a constraint string is found, returns
   *    an object with the key/value pair of that constraint. Otherwise returns
   *    `null`.
   * */
  let constraint = null;
  // console.log(`text:`, text);
  let possible_match = text.match(/^[^#]*(number|url|ids|options):\s*(.*)/);
  // console.log(`possible_match:`, possible_match);
  if ( possible_match !== null ) {
    constraint = {};
    constraint[ possible_match[1] ] = possible_match[2];
  }

  // console.log(`constraint:`, constraint);

  return constraint;

  // let num_tests = scenario.match(/number: (.*)/)[1];
  // let url = scenario.match(/url: (.*)/)[1];
  // let ids = scenario.match(/ids: (.*)/)[1];
  // let opts = scenario.match(/options:\n((.|\n)*)/)[1];
}

function warn_about_duplicate_key({ old_obj={}, new_obj={} }) {
  /** Warn the author if they have written duplicate keys.
   *
   * @param {{}} old_obj - object with any keys
   * @param {{}} new_obj - object assumed to have 1 key
   *
   * @returns {undefined}
   * */
  let existing_keys = Object.keys( old_obj );
  let new_key = Object.keys( new_obj )[0];
  if ( existing_keys.includes( new_key )) {
    console.log(`ALK0000 warn duplicate key "${ new_key }". Previous value was ${ old_obj[ new_key ] }. The new value is ${ new_obj[ new_key ] }. Will use the new value.`);
    return true;
  }
  return false;
}

let table_row_syntax = /^\s*\|.*\|/
function is_valid_table_row({ line }) {
  /** Returns true if one line of text is a valid table row. Otherwise returns
   *    false.
   *
   * @returns {boolean}
   * */
  if (line.trim().startsWith(`#`)) { return true; }
  if (line.trim() === ``) { return true; }
  if ( /^\s*\|.*\|/.test( line ) ) { return true; }
  return false;
}


function parse_random_input_table({ scenario }) {

}


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
    log.error({ type: `run`, code: `ALK0055`, pre: `The test run ran into something unexpected. Look above for more details.` });
  }
  // Custom exit code. May overlap with other systems.
  // Best info I've found via stack overflow: https://tldp.org/LDP/abs/html/exitcodes.html
  const exitCode = success ? 0 : 50;
  process.exitCode = exitCode;

  /** TODO:
   * randomly generated test file cleanup
   * 1. copy the randomly generated files into the artifacts folder
   * 2. post MVP: let the author keep the randomly generated tests
   * 3. otherwise, delete the original randomly generated files
   * */

  // This is hardcoded information from `provide_config` above.
  // This code isn't used for anything other than detecting and removing color codes.
  let summary_file_name = SUMMARY_FILENAME;
  fs.readFile(summary_file_name, 'utf8', (err, text) => {
    if (err) {
      // Something else will probably show an error that's more relevant
      log.info({ type: `run`, code: `ALK0056`, pre: `Failed to read cucumber report`, data: err });
      return;
    }

    // Replace terminal color codes, if present
    // https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode
    text = text.replace(/\x1b\[[0-9][0-9]?[0-9]?m/g, '');

    // Put it in the correct file in the correct folder
    let artifacts_path = session_vars.get_artifacts_path_name();
    try {
      fs.appendFileSync( `${ artifacts_path }/${ log.debug_log_file }`, `\n\n${text}`);
    } catch ( error ) {
      log.info({ type: `run`, code: `ALK0182`, pre: `Something probably went wrong earlier. Look above for more details, but here is more information just in case: ALKiln was unable to write to ${ artifacts_path }/${ log.debug_log_file }.`, data: error });
    }
    try {
      // Add to a unexpected results file when tests themselves fail
      if ( exitCode === 50 ) {
        fs.appendFileSync( `${ artifacts_path }/${ log.unexpected_filename }`, `\n\n${ text }` );
      }
    } catch ( error ) {
      log.info({ type: `run`, code: `ALK0181`, pre: `Something probably went wrong earlier. Look above for more details, but here is more information just in case: ALKiln was unable to write to ${ artifacts_path }/${ log.unexpected_filename }.`, data: error });
    }
  });
})();
