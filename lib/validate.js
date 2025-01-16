#!/usr/bin/env node

const fs = require(`fs`);
const fast_glob = require(`fast-glob`);

const Log = require(`./utils/Log`);
const set_sources_paths = require(`./utils/set_sources_paths`);
const get_Gherkin_AST = require(`./utils/get_Gherkin_AST`);
const get_error_stacks = require(`./utils/get_error_stacks`);


/**
 * TODO: Document that generator files need to have valid Gherkin syntax
 * TODO: Document how to read Gherkin syntax errors. E.g.
 *     (3:1): expected: #EOF, #Language, #TagLine, #FeatureLine, #Comment, #Empty, got 'Scenario: bar'
 *     (6:1): expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ExamplesLine, #ScenarioLine, #RuleLine, #Comment, #Empty, got 'Feature: zoo'
 * */


// process.argv is a list of strings of commands and args.
// If using `npm run cucumber` (as opposed to the bin commands),
// use `--` before `--sources=./foo`
const argv = require(`minimist`)( process.argv.slice(2) );
// The artifacts folder will be getting created for the first
// time right here. The tests themselves should avoid creating
// their own file.
const log = new Log({ path: argv.path, context: `validating files` });
// Run script
validate_Gherkin_files();


function validate_Gherkin_files() {
  /** Accumulates syntax errors for all `.feature`` test files, including
   *    generator files. If there are any, it logs those errors and then finally
   *    throws an error. Uses the values in command line arguments.
   * */

  let sources_paths = set_sources_paths({ log });

  let all_errors = [];
  for ( let sources_path of sources_paths ) {
    let { errors: files_errors } = parse_all_feature_files_in({ sources_path });
    all_errors.push( ...files_errors );
  }

  // Discuss: If an author has only some files with syntax errors, should we try
  //    to still run the tests for the files that had valid syntax?
  if ( all_errors.length > 0 ) {
    log.throw({ code: `ALK0224`, context: `validating files`,
      error: new Error( `ALKiln ran into Gherkin syntax error(s) when parsing your test feature files. See warnings and errors above.` )
    });
  };
}


function parse_all_feature_files_in({ sources_path }) {
  /** Returns accumulated list of Gherkin errors from all files in the
   *    docassemble "sources" folder (or an empty list).
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.sources_path - Path to the docassemble "sources" folder
   * 
   * @returns {{errors: [Error]}} Obj with an `error` prop that is a list of
   *    Error instances. Follows the format of other functions that return
   *    accumulated errors.
   * */
  let all_AST_errors = [];
  let feature_file_paths = fast_glob.sync( `${ sources_path }/**/*.feature` );

  for ( let feature_path of feature_file_paths ) {

    let file_text = fs.readFileSync( feature_path, { encoding: `utf8` });
    let { AST, errors: these_AST_errors } = get_Gherkin_AST({ file_text });

    if ( these_AST_errors.length > 0 ) {
      all_AST_errors.push( ...these_AST_errors );
      log.warn({ code: `ALK0223`, context: `validating files`, },
        `There was a Gherkin syntax error(s) in "${ feature_path }"`,
        ...get_error_stacks({ errors: these_AST_errors })
      );
    }

  }  // ends for each file path

  return { errors: all_AST_errors };
}
