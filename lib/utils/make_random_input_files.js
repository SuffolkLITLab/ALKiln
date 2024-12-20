const fs = require('fs');
const fg = require(`fast-glob`);

const session_vars = require('./session_vars');

/**
 * TODO: get the logger into here.
 * TODO: Change filename to "constrained" or make this a broader purpose file
 * TODO: We might give various levels of categories for warnings. For example,
 *    severe warnings (like "will skip the random test") vs. slight warnings
 *    (like "missing number in constraints random test")
 * */

const Gherkin = require("@cucumber/gherkin");
const Messages = require("@cucumber/messages");



module.exports = function make_random_input_files({ generators_prefix, sources_path }) {
  /** Given files with a certain prefix, use the text in them to generate a
   *    feature file or files. A file generates one file with multiple
   *    Scenarios.
   *
   * @param {object} obj - Named arguments
   * @param {string} obj.generators_prefix - File name prefix ALKiln can use to
   *    identify random answer generator files
   * @param {string} obj.sources_path - Path to the docassemble Sources folder
   *
   * @returns {undefined}
   *
   * Details:
   * - Copy sections of text from the old file
   * - Use the Gherkin parser's AST of the constraints Step in each Scenario to
   *   generate Story Tables
   * - Combine various sections with the Story Tables
   * - Make a new file with that content
   *
   * We're trying to find the least complex, yet sufficiently robust, system
   *
   * Goal:
   * Stay as true to the author's syntax as possible so they can get useful
   *    errors from cucumber itself.
   *
   * Anti-goals:
   * - Be cucumber
   * - Render the whole AST ourselves
   *
   * Example of the process:
   *
   * Input:
@random_tests
Feature: I generate successful random tests

Scenario: I generate the most straightforward constrained random answer tests
  Given I start the interview at "test_kickout"
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
  Then I wait .2 seconds

Scenario: Some other scenario
  Given I start the interview at "other_file"
  ...etc
   *
   *
   * Processing step 1:
--- Part 1 - Feature till the first Scenario
@random_tests
Feature: I generate successful random tests

--- Part 2 - Scenario text before the constraints Step
@tag1   @tag2
Scenario: simplest random input Steps
  Given I start the interview at "test_kickout"
--- Part 3 - the constrained random answer Step
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
--- Part 4 - Scenario text after the constraints Step
  Then I wait .2 seconds

--- Part 5 - top of the next Scenario
Scenario: Some other scenario
  Given I start the interview at "other_file"
  ...etc
--- End
   *
   *
   * Processing step 2:
--- Part 1 - Feature till the first Scenario
@random_tests @alk_randomized
Feature: I generate successful random tests

--- Part 2a - Scenario text before the constraints Step plus identifying info
@tag1   @tag2 @alk_randomized_generator1_scenario1_of_2
Scenario: simplest random input Steps ALKiln random test generator1_scenario1_of_2
  Given I start the interview at "test_kickout"
--- Part 3a - the 1st generated Story Table Step
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct |
--- Part 4a - Scenario text after the constraints Step
  Then I wait .2 seconds

--- Part 2b - Scenario text before the constraints Step plus identifying info
@tag1   @tag2 @alk_randomized_generator1_scenario2_of_2
Scenario: simplest random input Steps ALKiln random test generator1_scenario2_of_2
  Given I start the interview at "test_kickout"
--- Part 3b - the 2st generated Story Table Step
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | wrong |
--- Part 4b - Scenario text after the constraints Step
  Then I wait .2 seconds

--- Part 5 - top of the next Scenario
@alk_randomized_generator2_scenario1_of_1
Scenario: Some other scenario ALKiln random test generator2_scenario1_of_1
  Given I start the interview at "other_file"
  ...etc
--- End
   *
   *
   * Output:
@random_tests @alk_randomized
Feature: I generate successful random tests

@tag1   @tag2 @alk_randomized_generator1_scenario1_of_2
Scenario: simplest random input Steps ALKiln random test generator1_scenario1_of_2
  Given I start the interview at "test_kickout"
  And I get to any of ["kickout screen", "success screen"] with this data:
    | var | possible_values |
    | user_choice | correct |
  Then I wait .2 seconds

@tag1   @tag2 @alk_randomized_generator1_scenario2_of_2
Scenario: simplest random input Steps ALKiln random test generator1_scenario2_of_2
  Given I start the interview at "test_kickout"
  And I get to any of ["kickout screen", "success screen"] with this data:
    | var | possible_values |
    | user_choice | wrong |
  Then I wait .2 seconds

@alk_randomized_generator2_scenario1_of_1
Scenario: Some other scenario ALKiln random test generator2_scenario1_of_1
  Given I start the interview at "other_file"
  ...etc
   *
   * */

  // Get the paths of the source files that we need to parse
  let generator_paths = fg.sync(`${ sources_path }/${ generators_prefix }*.feature`);
  // // TODO: Should we add a folder for all randomly generated files?
  // // TODO: Save file in the author's package or just in the artifacts folder?
  // // let artifacts_path = session_vars.get_artifacts_path_name();
  for ( let generator_path of generator_paths ) {

    let file_text = fs.readFileSync( generator_path, {encoding: `utf8`});
    let doc_AST = get_Whole_Feature_AST({ file_text});

    if ( !doc_AST || !doc_AST.feature ) {
      // Research: Would the Gherkin parser error before we get in here?
      return null;
    }

    let new_contents = get_new_file_contents({
      doc_AST,
      file_text
    });

    console.log( new_contents );

    // let file_str = get_random_input_file_str({ file_text, generator_path });
    // // Save the file
    // // let new_file_path = `${ session_vars.get_artifacts_path_name() }/_alkiln_generated_${ Date.now() }.feature`;
    // // fs.appendFileSync( new_file_path, file_str );
  }
};  // Ends make_random_input_files()


function get_Whole_Feature_AST({ file_text }) {
  /** Return Gherkin parser's abstract syntax tree of the given generator file
   *
   * @param {object} obj - Named arguments
   * @param {string} file_text - The generator file's text contents
   *
   * @returns {object} - Gherkin parser's AST of the given generator file
   * */
  let uuidFn = Messages.IdGenerator.uuid();
  let builder = new Gherkin.AstBuilder(uuidFn);
  let matcher = new Gherkin.GherkinClassicTokenMatcher(); // or Gherkin.GherkinInMarkdownTokenMatcher()

  let parser = new Gherkin.Parser(builder, matcher);
  return parser.parse( file_text );
}


function get_new_file_contents({ doc_AST={}, file_text=`` }) {
  /** Return the text for one new file with tests based on one generator file.
   *
   * Note: Right now it is out of scope to save comments in constraints Steps.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.doc_AST - Gherkin-parsed abstract syntax tree of
   *    generator file
   * @param {string} obj.file_text - String of the whole generator file
   *
   * @returns {string} - The text (Feature, Scenarios, etc) for the new file
   * */
  let feature = doc_AST.feature;
  let scenario_objs = feature.children;
  if ( !scenario_objs || !scenario_objs[0].scenario ) {
    // Research: Would the Gherkin parser error before we get in here?
    return null;
  }

  let file_lines = file_text.split(`\n`);

  let feature_text = get_Feature_text({ feature, file_lines });

  // TODO: Abstract getting all Scenario strings
  let all_Scenarios_strings = [];

  for ( let scenario_obj_i = 0; scenario_obj_i < scenario_objs.length; scenario_obj_i++ ) {

    let scenario = scenario_objs[ scenario_obj_i ].scenario;

    let { constraints_Steps, error: constraints_Step_error } = get_constraints_Step({ scenario });
    if ( constraints_Step_error ) {
      console.log( constraints_Step_error );
      continue;
    }
    let constraints_Step = constraints_Steps[ constraints_Steps.length - 1 ];

    // TODO: names -> before/after
    // The Scenario top and bottom will wrap every generated Story Table
    let scenario_top = get_pre_constraints({
      scenario,
      first_constraints_Step: constraints_Steps[0],
      file_lines
    });
    let scenario_bottom = get_post_constraints({
      next_Scenario: (scenario_objs[ scenario_obj_i + 1 ] || {}).scenario,
      constraints_Step, file_lines
    });

    // Examples of constraints Steps
    // And I generate 34 tests that get to any of ["end"] when I pick from these constraints:
    // And I make 1 constrained random test that get to "end1", "end 2", or "end-3" with:
    let num_tests = get_number_of_tests({ step_text: constraints_Step.text });

    let final_page_ids = get_final_ids({ step_text: constraints_Step.text });
    if ( final_page_ids === null ) { continue; }

    let story_tables_strs = get_unique_Story_Tables_strings({ num_tests, ids: final_page_ids, step: constraints_Step });

    let scenarios_string = get_Scenarios_str({
      scenario_top,
      generator_id: scenario_obj_i,
      story_tables: story_tables_strs,
      scenario_bottom
    });

    all_Scenarios_strings.push( scenarios_string );
  }  // ends for every scenario_container

  if ( !feature_text || !all_Scenarios_strings.length > 0 ) {
    // Research: Would the Gherkin parser error before we get in here?
    console.log(`ALK0000 error? Feature file is incorrect.`);
    return null;
  }

  let scenarios_combined = all_Scenarios_strings.join(`\n`);

  let new_file_contents = [ feature_text, scenarios_combined ].join(`\n`);
  return new_file_contents;
}


function get_Feature_text({ feature, file_lines }) {
  /** Return text of Feature section to put at the top of the new file
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.feature - Gherkin AST `feature` object
   * @param {[string]} obj.file_lines - Text of the generator file as a list
   *
   * @returns {string} - Text of the new file's Feature section
   * */
  add_Feature_randomization_indicators({ file_lines, feature });

  let first_scenario = feature.children[0].scenario;
  let first_Scenario_line = get_Scenario_start_line_num({ scenario: first_scenario });
  let first_Scenario_index = as_index( first_Scenario_line );
  let index_of_last_line = first_Scenario_index - 1;

  let feature_text = file_lines.slice(
    0, index_of_last_line + 1  // `slice` excludes the last index
  ).join(`\n`);

  return feature_text;
}


function add_Feature_randomization_indicators({ file_lines=``, feature={} }) {
  /** Mutates `file_lines`. Modifies the tag and name of the Feature section.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.feature - Gherkin AST `feature` object
   * @param {[string]} obj.file_lines - Text of the generator file as a list
   *
   * @returns {undefined}
   * */
  let feature_index = as_index( feature.location.line );
  let new_starter = file_lines[ feature_index ];

  let tag_indicator = `@alk_randomized`;
  let name_indicator = `random tests`;

  if ( feature.tags.length > 0 ) {
    // Modify existing tags
    let tags_index = as_index( feature.tags[0].location.line );
    let tags_starter = file_lines[ tags_index ];

    file_lines[ tags_index ] = `${ tags_starter } ${ tag_indicator }`;

  } else {
    // If no existing tags, add new tag line
    new_starter = `@alk_randomized\n${ new_starter }`;
  }

  file_lines[ feature_index ] = `${ new_starter } ${ name_indicator }`;
}


function get_constraints_Step({ scenario }) {
  /** Return all the constraint Steps objects in a generator Scenario. Give
   *    warnings if needed. There should only be 1, but we all make mistakes.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - A valid Gherkin AST object of one Scenario
   *
   * @returns {[object]} All constraints Steps in this generator Scenario
   * */
  let constraints_Steps = [];
  let error = null;
  for ( let step of scenario.steps ) {
    let possible_constraints_Step = get_if_constraint_Step({ step });
    if ( possible_constraints_Step !== null ) {
      constraints_Steps.push( possible_constraints_Step );
    }
  }

  // Errors
  let num_Steps_found = constraints_Steps.length;
  if ( num_Steps_found === 0 ) {
    error = `🔎🤕 ALK0000 (Warning or error?) error: The constrained random input Step is missing. Scenario: TODO: Scenario description and tags`;
    return { constraints_Steps, error };
  }

  // Discuss: potentially get the last constraints Step with a dataTable
  let last_constraints_Step = constraints_Steps[ num_Steps_found - 1 ];
  if ( !last_constraints_Step.dataTable ) {
    error = `🔎🤕 ALK0000 (Warning or error?) error: The constrained random input Step answers table is missing. Scenario: TODO: Scenario description and tags (the Step itself may not help much as they're all pretty similar)`;
    return { constraints_Steps, error };
  }

  // Warnings
  if ( num_Steps_found > 1 ) {
    console.log(`🔎 ALK0000 warn: A Scenario can only have 1 constrained random input Step. This Scenario had ${ num_Steps_found }. ALKiln will use the last constraints Step. It will also delete everything it found between the first constraints Step it found and the last one, as well as that first constraints Step. Scenario: TODO: Scenario description and tags (the Step itself may not help much as they're all pretty similar)`);
  }
  // Discuss: Warn about table with just a header row? Or just let that play
  // out?

  return { constraints_Steps, error };
}


// Tests to find the step
const CONSTRAIN_REGEX = /constrain/i;  // constrained/constraint/constraints
const RAND_REGEX = /rand/i;
const GENERATE_REGEX = /generate/i;
function get_if_constraint_Step({ step }) {
  /** Return null or a constraints Steps.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.step - A valid constraints Step Gherkin object
   *
   * @returns {null | object} `null` or a constraints Step
   * */
  // Use `.test()` without `g` flag. See
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
  let is_constraints_step = CONSTRAIN_REGEX.test( step.text )
                            && ( RAND_REGEX.test( step.text )
                                 || GENERATE_REGEX.test( step.text ));
  // Example: And I generate 34 tests that get to any of ["end"] when I pick from these constraints:
  // Example: And I make 1 constrained random test that get to "end1", "end 2", or "end-3" with:
  if ( is_constraints_step ) {
    return step;
    // Continue looping to get the last possible constraints Step. If there
    // are multiple constraint Steps we use the last one.
  }

  return null;
}


function get_unique_Story_Tables_strings({ num_tests, ids, step }) {
  /** Return all the necessary randomized Story Tables as strings. Make sure
   *    they are unique.
   *
   * @param {object} obj - Named arguments
   * @param {int} obj.num_tests Number of Story tables to generate
   * @param {[string]} obj.ids The question ids that any of the Story Tables can
   *     reach
   * @parm {object} obj.step A valid constraints Step Gherkin object
   *
   * @returns {[string]} The strings of the Story Tables
   *  */
  let story_tables = [];

  // Each new Story Table Step starts the same way
  let step_indent = get_authors_indent({ located: step });
  let table_start = `${ step_indent }And I get to any of the question ids [${ ids.join(`, `) }] with this data:`;

  for ( let table_i = 0; table_i < num_tests; table_i++ ) {

    let num_attempts = 0;
    let max_attempts = 10;
    let is_unique = false;

    while ( !is_unique && num_attempts < max_attempts ) {

      let story_table = get_random_Story_Table({
        table_start,
        rows: step.dataTable.rows
      });

      if ( story_tables.includes( story_table )) {
        num_attempts += 1;
        continue;
      }

      is_unique = true;
      story_tables.push( story_table );

    }  // ends while table is not unique
  }  // ends for number of tests

  if ( story_tables.length < num_tests ) {
    // Discuss: Debug log or warning to developer? If the latter, need to make it pretty
    console.log(`🐞 ALK debug: could not make more than ${ story_tables.length } (out of ${ num_tests } desired) unique tests for the rows in this constraints Step:`, get_flatter_Step({ step }) );
  }

  return story_tables;
};


function get_random_Story_Table({ table_start, rows }) {
  /** Return a randomized Story Table string
   *
   * @param {object} obj - Named arguments
   * @param {string} obj.table_start - The start of the Story Table Step
   * @param {object} obj.rows - Gherkin AST of a `.dataTable.rows`
   *
   * @returns {string} - String of the whole Story Table Step
   * */
  let story_table_parts = [ table_start ];

  for ( let row_i = 0; row_i < rows.length; row_i++ ) {

    let row = rows[ row_i ];

    if ( row_i === 0 ) {
      story_table_parts.push( get_table_header({ row }) );
      continue;
    }

    story_table_parts.push( get_random_table_row({ row }) );

  }

  let story_table = story_table_parts.join(`\n`);
  return story_table;
}


function get_flatter_Step({ step }) {
  /** Given a Gherkin `step` object, returns an object that is a less nested
   *    version of the `step` object.
   *
   * Yes, this is annoying to test, but it's a fairly simple way to show enough
   *    info about the Step to be useful.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.step - Gherkin `step` object
   *
   * @returns {{ text, rows: [[str1, str2], ...] }} - Flatter version of `step`
   * */
  let simple = { text: step.text, rows: [] };
  for ( let row of step.dataTable.rows ) {
    let cells = [];
    for ( let cell of row.cells ) {
      cells.push( cell.value );
    }
    simple.rows.push( cells );
  }
  return simple;
}


function get_table_header({ row }) {
  /** Return the string for the Story Table header row. 2 or 3 column tables are
   *    allowed.
   *
   * TODO: Warn about wrong number of columns?
   * Discuss: Where should new lines be added?
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.row Valid Gherkin dataTable.row object
   *
   * @returns {string} A markdown table row with 2 or 3 columns
   * */
  let indent = get_authors_indent({ located: row });
  let num_cols = row.cells.length;
  let header = `${ indent }| var | value |`;
  if ( num_cols >= 3 ) { header += ` trigger |`; }
  return header;
};


function get_random_table_row({ row }) {
  /** Return the string of one Story Table row with a randomly chosen answer.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.row - Valid Gherkin dataTable.row object
   *
   * @returns {string} A markdown table row with 2 or 3 columns
   * */
  let indent = get_authors_indent({ located: row });
  let cells = row.cells;
  let num_cols = cells.length;

  let answer = pick_random_answer({ answers_str: cells[1].value });
  let row_str = `${ indent }| ${ cells[0].value } | ${ answer } |`;
  if ( cells.length >= 3 ) { row_str += ` ${ cells[2].value } |`; }
  return row_str;
};


// Make a placeholder where we will make the scenario unique
let ID_PLACEHOLDER = `ALKILN_SCENARIO_RANDOM_ID_PLACEHOLDER`;
function get_Scenarios_str({ scenario_top, generator_id, story_tables, scenario_bottom }) {
  /** Return the string for the combined Scenarios.
   *
   * @param {object} obj - Named arguments
   * @param {string} obj.scenario_top - Scenario text that comes before the
   *     constraints Step
   * @param {int | string} obj.generator_id - ID of the generating Scenario
   * @param {[string]} obj.story_tables - Story Table text for every Scenario
   *     that we need to generate
   * @param {string} obj.scenario_bottom - Scenario text that comes after the
   *     constraints Step
   *
   * @returns {[string]} - List of complete Scenario strings
   * */
  let scenarios = [];
  for ( let table_i = 0; table_i < story_tables.length; table_i++ ) {

    let scenario_id = `generator${ generator_id + 1 }_scenario${ table_i + 1 }_of_${ story_tables.length }`;
    random_top = scenario_top.replaceAll( ID_PLACEHOLDER, scenario_id );

    let story_table = story_tables[ table_i ];

    let scenario_str = [
      random_top, story_table, scenario_bottom
    ].join(`\n`);
    scenarios.push( scenario_str );
  }

  let this_Scenarios_strings = scenarios.join(`\n`);
  return this_Scenarios_strings;
};


function get_pre_constraints({ scenario, first_constraints_Step, file_lines }) {
  /** Return the Scenario text that comes before the first constraints Step.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - AST of the Scenario
   * @param {object} obj.first_constraints_Step - AST of the first constraints
   *     Step
   * @param {[string]} obj.file_lines - List of lines from the generator file
   *
   * @returns {string} - Scenario text that comes before the first constraints
   *     Step
   * */
  // Use a shorter name as there are a lot of long lines of code
  let lines = file_lines;

  let keyword_index = as_index( scenario.location.line );
  let new_starter = lines[ keyword_index ];

  // If find tags, append randomness indicator to tag line
  if ( scenario.tags.length > 0 ) {
    let tags_index = as_index( scenario.tags[0].location.line );
    lines[ tags_index ] = `${ lines[ tags_index ] } @alk_randomized_${ ID_PLACEHOLDER }`;
  } else {
    new_starter = `@alk_randomized_${ ID_PLACEHOLDER }\n${ new_starter }`;
  }
  lines[ keyword_index ] = `${ new_starter } ALKiln random test ${ ID_PLACEHOLDER }`;

  // Get the line number that matches the index of the file contents list
  // where that line is in the file itself.
  let start_line_num = get_Scenario_start_line_num({ scenario });
  let top_start_index = as_index( start_line_num );

  let top_end_index = get_index_before({ line_num: first_constraints_Step.location.line });

  // Re-build the string of the pre-constraints section of the Scenario
  let scenario_top_text = lines.slice(
    top_start_index,
    top_end_index + 1  // `slice` excludes the terminal number
  ).join(`\n`);

  return scenario_top_text;
};


function get_post_constraints({ next_Scenario, constraints_Step, file_lines }) {
  /** Return the Scenario text that comes after the last constraints Step.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.next_Scenario - AST of the Scenario after this Scenario
   * @param {object} obj.constraints_Step - AST of the last constraints Step
   * @param {[string]} obj.file_lines - List of lines from the generator file
   *
   * @returns {string} - Scenario text that comes after the last constraints
   *     Step
   * */
  let rows = constraints_Step.dataTable.rows;
  let constraints_end_index = as_index( rows[ rows.length - 1].location.line );
  let bottom_start_index = constraints_end_index + 1;

  if ( !next_Scenario ) {
    // Get lines till the end of the file
    let scenario_bottom_text = file_lines.slice(
      bottom_start_index
    ).join(`\n`);
    return scenario_bottom_text;
  }

  // Get lines till the start of the next Scenario
  let next_Scenario_start_line = get_Scenario_start_line_num({ scenario: next_Scenario });
  let bottom_end_index = get_index_before({ line_num: next_Scenario_start_line });

  let scenario_bottom_text = file_lines.slice(
    bottom_start_index,
    bottom_end_index + 1  // `slice` excludes the terminal number
  ).join(`\n`);

  return scenario_bottom_text;
};


function get_index_before({ line_num }) {
  /** Return the index in the file line list that corresponds to the given
   *    Gherkin 1-indexed line number. This is mostly here as a name that
   *    clarifies what the code is doing and hides a little bit of the
   *    complexity.
   *
   * Discuss: is get_index_before() worth abstracting?
   *
   * Each object in the Gherkin AST will have a `location` object that includes
   *    the item's line number (`{line: 1}`). Each line number represents a line
   *    in the file and therefore an item in the `file_lines` list. The line
   *    numbers are 1-indexed. That means the location of `{line: 1}` in the AST
   *    refers to `file_lines[0]`.
   *
   * @param {object} obj - Named arguments
   * @param {int} obj.line_num - Integer of a Gherkin 1-indexed line number
   *
   * @returns {int} - File-line-list index that corresponds to the Gherkin line
   *     number
   * */
  let line_as_index = as_index( line_num );
  return line_as_index - 1;
};


// function get_index_after({ line_num }) {};


function get_authors_indent({ located }) {
  /** Return a whitespace string representing the indentation for a given
   *    Gherkin location object.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.located - Gherkin AST object with a location property
   *
   * @returns {string} - A whitespace string representing the indentation for a
   *    given Gherkin location object.
   * */
  if ( typeof located !== 'object' || !located.location ) {
    return ``;
  }
  return ` `.repeat( located.location.column - 1 );
};


let CAPTURE_NUMBERS_REGEX = /(\d+)/g;
function get_number_of_tests({ step_text }) {
  /** Return the number of random constraints tests to generate with a minimum
   *    of 1 test.
   *
   * @param {object} obj - Named arguments
   * @param {string} obj.step_text - The text of a constraints Step
   *
   * @returns {int} - Number of tests to generate. Minimum is 1.
   * */
  let num_tests = 1;
  let num_tests_matcher = step_text.match( CAPTURE_NUMBERS_REGEX );

  // No numbers
  if ( num_tests_matcher === null ) {
    console.log(`🔎 ALK0000 warn: constrained random input test is missing the number of tests to create. ALKiln will create 1 test. The Step:\n`, step_text);
    return num_tests;
  }

  // Too many numbers
  if ( num_tests_matcher.length > 1 ) {
    /** TODO: use first number or last number? */
    console.log(`🔎 ALK0000 warn: constrained random input test Step has too many number values. ALKiln will use the last number. The Step:\n`, step_text);
    return parseInt( num_tests_matcher[ num_tests_matcher.length - 1 ]);
  }

  num_tests = parseInt( num_tests_matcher[ 0 ]);

  return num_tests;
}


let CAPTURE_QUESTION_IDS_REGEX = /("[^"]+")/g;
function get_final_ids({ step_text }) {
  /** Return a list of docassemble question block ids (in double quotes) that
   *    are in an ALKiln constraints Step. Every generated Story Table Step must
   *    reach one of these ids.
   *
   * @param {object} obj - Named arguments
   * @param {string} obj.step_text - The text of a constraints Step
   *
   * Example:
   * get_final_ids({ step_text: `And I make 1 constrained random test that gets to "end1" or "end 2" with:` });
   * // [`"end1"`, `"end2"`]
   *
   * @returns {[string]} - List of double-quoted docassemble question block ids.
   *     Every generated Story Table Step must reach one of these ids.
   * */
  let ids = step_text.match( CAPTURE_QUESTION_IDS_REGEX );
  if ( ids === null ) {
    console.log(`🔎🤕 ALK0000 (Warning or error?) warn: constrained random input test is missing the final question ids. ALKiln is unable to create random tests. The Step:\n`, step_text);
  }
  return ids;
}


function pick_random_answer({ answers_str=`` }) {
  /** Return one of the answers from the given string of possible answers.
   *
   * @param {object} obj - Named arguments
   * @param {str} obj.answers_str - A string representing one or more possible
   *    answers. The possible answers are separated by this character
   *    combination: `;;`
   *
   * Example:
   * pick_random_answer({ answers_str: `yes;; no;; maybe` });
   * // `no`
   *
   * @returns {string} - One of the possible answers
   * */
  let choices = answers_str.replace(`;; `, `;;`).split(`;;`);
  let choice_index = Math.floor( Math.random() * choices.length );
  return choices[ choice_index ];
}


function get_Scenario_start_line_num({ scenario }) {
  /** Returns the Gherkin line number where the Scenario really starts. That
   *    could be where the tags are or where the Scenario keyword is.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - The Gherkin AST for a Scenario
   *
   * @returns {int} - Gherkin line number where the Scenario starts
   * */
  if ( scenario.tags.length === 0 ) {
    return scenario.location.line;
  } else {
    return scenario.tags[0].location.line;
  }
}


// TODO: name? get_file_line_index/get_file_index/get_index_in_file
function as_index( line_num ) {
  /** Given a Gherkin line number, return the file-lines-list index for that
   *    line number. This is here mostly as a name that helps clarify what the
   *    code is doing.
   *
   * Each Gherkin line number matches a line in the file and therefore an item
   *    in the `file_lines` list. The Gherkin line numbers are 1-indexed. That
   *    means the location of `{line: 1}` in the AST refers to `file_lines[0]`.
   *
   * @param {int} line_num - A 1-indexed Gherkin line number
   *
   * @returns {int} - The corresponding index in the list of lines in the
   *    generator file
   * */
  return line_num - 1;
}
