const fs = require('fs');
const fg = require(`fast-glob`);

const session_vars = require('./session_vars');


module.exports = function make_random_input_files({ generators_prefix, sources_path }) {
  /** Given files with a certain prefix, use the text in them to generate a
   *    feature file or files. A file generates one file with multiple
   *    Scenarios.
   *
   * */
  // Get the paths of the source files that we need to parse
  let generator_paths = fg.sync(`${ sources_path }/${ generators_prefix }*.feature`);
  // // TODO: Should we add a folder for all randomly generated files?
  // // TODO: Save file in the author's package or just in the artifacts folder?
  // // let artifacts_path = session_vars.get_artifacts_path_name();
  for ( let generator_path of generator_paths ) {
    let file_contents = fs.readFileSync( generator_path, {encoding: `utf8`});
    let file_str = get_random_input_file_str({ file_contents, generator_path });
    // // Save the file
    // // let new_file_path = `${ session_vars.get_artifacts_path_name() }/_alkiln_generated_${ Date.now() }.feature`;
    // // fs.appendFileSync( new_file_path, file_str );
  }
};  // Ends make_random_input_files()


function get_random_input_file_str({ file_contents=``, generator_path=`` }) {
  /** Return the text for one file with all the requested random tests.
   *
   * TODO: consider importing one of cucumber's own parsers.
   *
   * Keep Feature description
   * Keep and add to Scenario description
   *
   * TODO: Don't parse comments, just leave them
   * TODO: Create new Steps to put errors in the report for failed file or
   *    Scenario parsing
   * TODO: In the Scenario text itself, add the name of the path where we will
   *    save the file in a way that will be visible in the console/report output
   * */

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

  let { top, scenarios } = get_feature_file_parts({ file_contents });
  if ( scenarios.length === 0 ) {
    console.log( `🤕 ALK0000 error Found no Scenarios in "${ generator_path }"` );
  }

  for ( let scenario of scenarios ) {
    if ( scenario ) {  // maybe empty string
      try {
        let scenario_data = get_scenario_parts({ scenario });
        console.log(`scenario_data:`, scenario_data);
        let {
          skip,
          description,
          scenario_top,
          constraints,
          scenario_bottom
        } = scenario_data;

        if ( skip ) { continue; }
      } catch ( scenario_parsing_error ) {
        if ( !/`ALK\d\d\d\d`/.test( scenario_parsing_error )) {
          // Unexpected error
          console.log(`🔎 ALK0000 WARNING: Contact us. Internal error reading scenario in "${ generator_path }"`, scenario_parsing_error );
        } else {
          console.log(`🤕 ALK0000 Error while reading scenario in "${ "file name" }"`, scenario_parsing_error );
        }
      }
    }
  }  // ends for each scenario

  // Add the top to the new file str
  // Add the Scenarios

  return ``;
};  // Ends get_random_input_file_str()


function get_feature_file_parts({ file_contents }) {
  /** Given some text, return the parts of a .feature file
   *
   * TODO: Capture tags of Scenarios
   *
   * @returns {{}} parts Parts of the .feature file
   * @returns {str} parts.top Text before any Scenarios
   * @returns {[str]} parts.scenarios The text of each Scenario
   * */
  let generator_lines = file_contents.split(`\n`);
  let top = ``, current_scenario = ``, scenarios = [];
  let found_a_scenario = false;
  // TODO: dud definition of variable in outer scope from inner scope?
  for ( let line_i = 0; line_i < generator_lines.length; line_i++ ) {
    let line = generator_lines[ line_i ];
    // TODO: should this be next non-empty line? Pass the remaining lines?
    let next_line = generator_lines[ line_i + 1 ];

    if ( starts_a_Scenario({ line, next_line }) ) {
      found_a_scenario = true;
      // Push the current Scenario before starting the next one.
      if ( current_scenario !== `` ) { scenarios.push( current_scenario ); }
      // Start the next Scenario from scratch
      current_scenario = `${ line }\n`;
      continue;
    }

    if ( !found_a_scenario ) { top += `${ line }\n`; }
    else { current_scenario += `${ line }\n`; }

    // At the very end
    if ( is_last_item( generator_lines, line_i )) {
      scenarios.push( current_scenario );
    }
  }  // ends for each generator line

  return { top, scenarios };
};  // Ends get_feature_file_parts()


function starts_a_Scenario({ line=``, next_line=`` }) {
  let does_start_Scenario = false;
  // TODO: detect tag
  // if ( line && is_tag({ line }) && next_line && is_Scenario({ line: next_line }) ) {
  //   does_start_Scenario = true;
  // } else
  if ( is_Scenario({ line }) ) {
    does_start_Scenario = true;
  }
  return does_start_Scenario;
};


function is_tag({ line=`` }) {
  // Allow (only) whitespace at start
  return /^\s*@./.test( line );
}


function is_Scenario({ line=`` }) {
  // Allow (only) whitespace at start
  return /^\s*Scenario:/.test( line );
}


function is_last_item( list_or_string, index ) {
  return index === list_or_string.length - 1;
}


function get_scenario_parts({ scenario }) {
  /** Given the text of a Scenario, return the description of the Scenario, the
   *    text until the constraints Steps, an object of the constraints, and the
   *    text under those strings.
   *
   * There are 3 sections to a generator file: top, constraints, bottom. The
   *    Scenario MUST only have one constraints section. It MUST have a section
   *    before the constraints that goes to the interview.
   *
   * TODO: Add a Step to check for the presence of one of multiple possible
   *    question ids. Can re-use the current "question id" Step.
   *
   * Constraints can come in any order at the moment. We will change that by
   *    changing how we ask authors to write these steps. E.g. `I make <number>
   *    random tests based on these options:`
   *
   * @returns {{}} parts
   * @returns {str} parts.description The Scenario description
   * @returns {str} parts.top Text before the constraint Steps
   * @returns {{}} parts.constraints The constraint values
   * @returns {int} parts.constraints.number How many Scenarios to generate
   * @returns {[{}]} parts.constraints.options Table of possible value choices
   * @returns {str} ...options[i].var The name of the variable to set
   * @returns {str} ...options[i].possible_values The possible values for that
   *     variable
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
  // Empty description is fine
  let description = scenario.match(/Scenario:(.*)/)[1];

  let scenario_lines = scenario.split(`\n`);
  let scenario_top = ``, constraints = {}, scenario_bottom = ``;
  let stage = `before constraints`;  // `constraints`, `all constraint keys exist`
  let in_constraints_table = false;
  for ( let line_i = 0; line_i < scenario_lines.length; line_i++ ) {
    let line = scenario_lines[ line_i ];

    // No contents
    if ( line.trim() === `` ) { continue; }

    let maybe_constraint = get_constraint_or_null({ text: line });
    if ( maybe_constraint !== null ) {
      stage = `constraints`;
      in_constraints_table = maybe_constraint.options !== undefined;
      warn_if_duplicate_key({ old_obj: constraints, new_obj: maybe_constraint });
      constraints = { ...constraints, ...maybe_constraint };
      const cons = constraints;
      if ( cons.number && cons.url && cons.ids && cons.options !== undefined) {
        stage = `all constraint keys exist`;
      }
      continue;
    }

    if ( stage === `before constraints` ) {
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
    if ( stage === `all constraint keys exist` && !in_constraints_table ) {
      scenario_bottom += `${ line }\n`;
      continue;
    }
  } // ends for each scenario line

  // Make sure we have all the constraints we need
  if ( !constraints.number ) {
    console.log(`🔎 ALK0000 warn: constrained random input test is missing the number of tests to create. ALKiln will create 1 test. The Scenario:\n`, scenario);
    constraints.number = 1;
  }
  if ( isNaN( parseInt( constraints.number )) ) {
    console.log(`🔎 ALK0000 warn: The value for the number of random tests to generate must be an integer. Instead, it was "${ constraints.number }". Instead, ALKiln will create 1 random test. The Scenario:\n`, scenario);
    constraints.number = 1;
  }
  if ( !constraints.options ) {
    console.log(`🤕 ALK0000 error: random test is missing the table of options. ALKiln will skip this test. The Scenario:\n`, scenario);
  }

  const cons = constraints;
  skip = !cons.ids || !cons.urls || !cons.options;

  return {
    skip,
    description,
    top: scenario_top,
    constraints,
    bottom: scenario_bottom,
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
  let possible_match = text.match(/^[^#]*(number|url|ids|options):\s*(.*)/);
  if ( possible_match !== null ) {
    constraint = {};
    constraint[ possible_match[1] ] = possible_match[2];
  }

  return constraint;
}

function warn_if_duplicate_key({ old_obj={}, new_obj={} }) {
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
    console.log(`🔎 ALK0000 warn duplicate key "${ new_key }". Previous value was ${ old_obj[ new_key ] }. The new value is ${ new_obj[ new_key ] }. Will use the new value.`);
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

