const fs = require('fs');
const fg = require(`fast-glob`);

const globals = require(`../globals`);
const session_vars = require('./session_vars');
const get_Gherkin_AST = require(`./get_Gherkin_AST`);
const get_error_stacks = require(`./get_error_stacks`);

/**
 * TODO: We might give various levels of categories for warnings. For example,
 *    severe warnings (like "will skip the random test") vs. slight warnings
 *    (like "missing number in constraints random test")
 * TODO: Save the warnings until the tests actually run so they can show up
 *    where other warnings show up. Does that mean making a "message to author"
 *    internal Step of some kind?
 * TODO: Post-MVP, don't repeat tests that the author has already created
 * Discuss: Now that Log is less fragile, shall we create a new one in here?
 * */


/** Note: Keeping this file non-executable so we can test it more easily. */


module.exports = constrained_random_tests = {};

let log = null;

const ARTIFACTS_FOLDER = `_alkiln_generated`;
constrained_random_tests.create = function({
  sources_path,
  logger
}) {
  /** Given files with a certain prefix, use the text in them to generate a
   *    feature file or files. A file generates one file with multiple
   *    Scenarios.
   *
   * @param {object} obj - Named arguments
   * @param {string} obj.sources_path - Path to the docassemble Sources folder
   * 
   * @returns {object} rtn - Named return values
   * @returns {[str]} rtn.new_strings - 0 or more strings that each created a
   *     new file.
   * @returns {[Error]} rtn.errors - 0 or more Errors.
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
@random_tests @alkiln_randomized
Feature: I generate successful random tests with ALKiln randomization

--- Part 2a - Scenario text before the constraints Step plus identifying info
@tag1   @tag2 @alkiln_randomized_generator1_scenario1_of_2
Scenario: simplest random input Steps ALKiln random test generator1_scenario1_of_2
  Given I start the interview at "test_kickout"
--- Part 3a - the 1st generated Story Table Step
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct |
--- Part 4a - Scenario text after the constraints Step
  Then I wait .2 seconds

--- Part 2b - Scenario text before the constraints Step plus identifying info
@tag1   @tag2 @alkiln_randomized_generator1_scenario2_of_2
Scenario: simplest random input Steps ALKiln random test generator1_scenario2_of_2
  Given I start the interview at "test_kickout"
--- Part 3b - the 2st generated Story Table Step
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | wrong |
--- Part 4b - Scenario text after the constraints Step
  Then I wait .2 seconds

--- Part 5 - top of the next Scenario
@alkiln_randomized_generator2_scenario1_of_1
Scenario: Some other scenario ALKiln random test generator2_scenario1_of_1
  Given I start the interview at "other_file"
  ...etc
--- End
   *
   *
   * Output in a new file:
@random_tests @alkiln_randomized
Feature: I generate successful random tests with ALKiln randomization

@tag1   @tag2 @alkiln_randomized_generator1_scenario1_of_2
Scenario: simplest random input Steps ALKiln random test generator1_scenario1_of_2
  Given I start the interview at "test_kickout"
  And I get to any of ["kickout screen", "success screen"] with this data:
    | var | possible_values |
    | user_choice | correct |
  Then I wait .2 seconds

@tag1   @tag2 @alkiln_randomized_generator1_scenario2_of_2
Scenario: simplest random input Steps ALKiln random test generator1_scenario2_of_2
  Given I start the interview at "test_kickout"
  And I get to any of ["kickout screen", "success screen"] with this data:
    | var | possible_values |
    | user_choice | wrong |
  Then I wait .2 seconds

@alkiln_randomized_generator2_scenario1_of_1
Scenario: Some other scenario ALKiln random test generator2_scenario1_of_1
  Given I start the interview at "other_file"
  ...etc
   *
   * */
  log = logger;

  let new_files_strings = [];
  let all_errors = [];

  // Get the paths of the source files that we need to parse
  let generator_paths = fg.sync(`${ sources_path }/${ globals.generators_prefix }*.feature`);
  for ( let generator_path of generator_paths ) {

    let file_text = fs.readFileSync( generator_path, {encoding: `utf8`});

    log.info({ code: `ALK0252`, context: `generating files`, },
      `Now generating the constrained random answers tests for "${ generator_path }"`
    );
    let { new_contents, errors: parse_errors } = constrained_random_tests.parse_file({
      file_text,
      generator_path
    });
    all_errors.push( ...parse_errors );

    if ( new_contents ) {
      new_files_strings.push( new_contents );
    }
  }

  // if ( all_errors.length > 0 ) {
  //   log.throw({ code: `ALxK0252`, context: `generating files`,
  //     error: new Error(`Trouble while generating constrained random answers .feature files. See above for warnings and errors.`)
  //   });
  // }

  let tests_path =  `${ sources_path }/${ ARTIFACTS_FOLDER }`;
  let artifacts_path = `${ session_vars.get_artifacts_path_name() }/_alkiln_generated`;

  // Personal note:
  //    `save_files` doesn't build the paths. It doesn't worry about choosing
  //    any particular organization scheme. Just sticks to saving.
  save_files({ tests_path, artifacts_path, file_strings: new_files_strings });

  return { new_strings: new_files_strings, errors: all_errors };
};  // Ends make_random_input_files()


constrained_random_tests.parse_file = function({ file_text, generator_path, logger }) {
  /** Parse and return one file's contents
   *
   * TODO: If there's a Gherkin parser error, log something more clear before
   *    re-throwing it?
   * 
   * Note: The generator file should be valid by the time it gets here.
   * 
   * @param {string} file_text - Full text of a generator feature file
   *
   * @returns {object} rtn - Named return values
   * @returns {null | str} rtn.new_contents - `null` or string for the new file
   * @returns {[Error]} rtn.errors - 0 or more Errors.
   *  */
  if ( logger ) {
    log = logger;  // For unit tests. They call this in isolation.
  }

  let errors = [];

  let { AST: doc_AST, errors: generator_parsing_errors } = get_Gherkin_AST({ file_text });

  if ( generator_parsing_errors.length > 0 || !doc_AST || !doc_AST.feature ) {
    logs.warn({ code: `ALK0231`, context: `generating files`, },
      `The author's generator .feature file "${ generator_path }" had Gherkin syntax error(s).`,
      ...get_error_stacks({ generator_parsing_errors })
    );
    return { new_contents: null, errors: generator_parsing_errors };
  }

  let { new_contents, errors: generating_errors } = get_new_file_contents({ doc_AST, file_text });
  if ( generating_errors.length > 0 ) {
    return { new_contents, errors: generating_errors };
  }

  if ( !new_contents ) {
    let msg = `Unable to generate a constrained random answers file from "${ generator_path }". See above for warnings and errors.`;
    logs.warn({ code: `ALK0251`, context: `generating files`, }, msg );
    return { new_contents, errors: [ new Error( msg )] };
  }

  let { errors: generated_parsing_errors } = validate_syntax({ file_text: new_contents });
  if ( generated_parsing_errors.length > 0 ) {
    logs.warn({ code: `ALK0236`, context: `generating files`, },
      `The .feature file ALKiln generated from "${ generator_path }" had Gherkin syntax error(s)`,
      ...get_error_stacks({ errors: generated_parsing_errors })
    );
    return { new_contents, errors: generated_parsing_errors };
  }

  return { new_contents, errors };
}


function validate_syntax({ file_text }) {
  /** Return any errors we get from running the text through the Gherkin parser
   * 
   * @param {object} obj - Named arguments
   * @param {str} obj.file_text - Text of the Gherkin file
   * 
   * @returns {[Error]} - 0 or more Error objects
   *  */
  let { errors: generated_parsing_errors } = get_Gherkin_AST({ file_text });
  return { errors: generated_parsing_errors || [] };
}


function save_files({ tests_path, artifacts_path, file_strings }) {
  /** Save each test file string to an artifacts folder and a folder that
   *     cucumber will use to run tests.
   * 
   * @param { object } obj - Named arguments
   * @param { str } tests_path - Path where cucumberjs will find these files
   * @param { str } artifacts_path - Artifacts folder path
   * @param { [str] } file_strings - Each string will be a test file
   * 
   * @returns { undefined }
   * */
  delete_previous_tests_from_sources_folders_for_ALKiln_developers({ tests_path });

  if ( file_strings.length === 0 ) { return; }

  // Implementation note: This has no error if the folder already exists
  fs.mkdirSync( tests_path, { recursive: true });
  fs.mkdirSync( artifacts_path, { recursive: true });

  // TODO: For internal testing, create a separate GitHub workflow to test the
  //    number of files that were generated
  log.debug({ code: `ALK0237`, context: `generating files`, },
    `Saving ${ file_strings.length } newly generated files`
  );

  let count = 1;
  for ( let file_str of file_strings ) {
    let filename = `${ count }_${ Date.now() }.feature`;
    count++;
    // Implementation note: If the files don't exist, this creates them
    fs.appendFileSync( `${ tests_path }/${ filename }`, file_str );
    fs.appendFileSync( `${ artifacts_path }/${ filename }`, file_str );
  }

  log.debug({ code: `ALK0238`, context: `generating files`, },
    `Created new generated files:`, fs.readdirSync( tests_path )
  );

}


function delete_previous_tests_from_sources_folders_for_ALKiln_developers({ tests_path }) {
  /** Delete previously generated files from this folder if they exist because
   *    otherwise those tests will run again too (like for ALKiln devs).
   * 
   * Note: All the relevant tests that cucumber will run will be on the paths
   *    that come in here, so all *relevant* old files will get deleted, even if
   *    there are previous files hanging around somewhere else.
   * 
   * Research: How will this folder behave on the Playground? Do we need to
   *    clean up at the end too?
   * */
  if ( !fs.existsSync( tests_path )) { return; }
  log.debug({ code: `ALK0250`, context: `generating files`, },
    `Deleting previously generated files:`, fs.readdirSync( tests_path )
  );
  fs.rmSync( tests_path, { recursive: true, force: true });
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
   * @returns {null | string} - The text (Feature, Scenarios, etc) for the new
   *     file
   * 
   * @returns {object} rtn - Named return values
   * @returns {null | str} rtn.new_contents - `null` or string for the new file
   * @returns {[Error]} rtn.errors - 0 or more Errors.
   * */
  let generation_errors = [];

  let feature = doc_AST.feature;
  let scenario_objs = feature.children;
  if ( !scenario_objs || !scenario_objs[0].scenario ) {
    // Research: Would the Gherkin parser error before we get in here?
    return { new_contents: null, errors: generation_errors };
  }

  let generator_lines = file_text.split(`\n`);

  // Missing feature text would fail in the Gherkin parser
  let feature_text = get_Feature_text({ feature, generator_lines });

  // TODO: Abstract getting all Scenario strings
  let all_generated_Scenarios_strings = [];

  for ( let scenario_obj_i = 0; scenario_obj_i < scenario_objs.length; scenario_obj_i++ ) {
    /**
     * Starting here, functions' return values should now include lists of
     *     warning messages. If a Scenario gets any warnings, we will add a
     *     "warnings" Step to that Scenario. Implement over time.
     * */
    let scenario_warnings = [];
    function add_errs_n_warnings({ warnings = [], errors = [] }) {
      /**
       * Docstring? Rly?
       * */
      scenario_warnings.push( ...warnings );
      generation_errors.push( ...errors );
    };

    // Get all randomized Scenarios from one generator Scenario
    let generator_Scenario = scenario_objs[ scenario_obj_i ].scenario;

    let {
      constraints_Step,
      warnings: constraints_warnings,
      errors: constraints_errors
    } = get_constraints_Step({ generator_Scenario });
    add_errs_n_warnings({ warnings: constraints_warnings, errors: constraints_errors });
    if ( generation_errors.length > 0 ) { continue; }
    
    // The Scenario top and bottom will wrap every generated Story Table for
    //    this generator Scenario
    let all_scenarios_top = get_pre_constraints({
      generator_Scenario,
      constraints_Step,
      generator_lines
    });
    let all_scenarios_bottom = get_post_constraints({
      next_Scenario: (scenario_objs[ scenario_obj_i + 1 ] || {}).scenario,
      constraints_Step,
      generator_lines
    });

    // Examples of constraints Steps
    // And I generate 34 tests that get to any of ["end"] when I pick from these constraints:
    // And I make 1 constrained random test that get to "end1", "end 2", or "end-3" with:
    let {
      num_to_generate,
      warnings: num_warnings,
      errors: num_errors
    } = get_number_of_Scenarios_to_generate({ step_text: constraints_Step.text });
    add_errs_n_warnings({ warnings: num_warnings, errors: num_errors });

    let {
      ids: final_page_ids,
      warning: ids_warnings,
      errors: ids_errors
    } = get_final_ids({ step_text: constraints_Step.text });
    add_errs_n_warnings({ warnings: ids_warnings, errors: ids_errors });
    if ( final_page_ids === null ) { continue; }

    let {
      story_tables: generated_story_tables_strs,
      warnings: story_tables_warnings,
      errors: story_tables_errors
    } = get_unique_Story_Tables_strings({
      num_to_generate,
      ids: final_page_ids,
      step: constraints_Step
    });
    add_errs_n_warnings({ warnings: story_tables_warnings, errors: story_tables_errors });

    /** Stop returning warnings here. */
    let { warnings_Step, errors: warning_step_errors } = get_warnings_Step({
      warnings: scenario_warnings,
      step_text: constraints_Step.text
    });
    add_errs_n_warnings({ warnings: [], errors: warning_step_errors });

    let generated_Scenarios_str = get_generated_Scenarios_str({
      all_scenarios_top,
      warnings_Step,
      generator_id: scenario_obj_i,
      story_tables: generated_story_tables_strs,
      all_scenarios_bottom
    });

    all_generated_Scenarios_strings.push( generated_Scenarios_str );
  }  // ends for every scenario_container

  let count_msg = `ALKiln generated ${ all_generated_Scenarios_strings.length } Scenarios`;
  if ( all_generated_Scenarios_strings.length === 0 ) {
    log.warn({ code: `ALK0248`, context: `generating files`, }, count_msg );
    generation_errors.push( new Error( count_msg ));
  } else {
    log.info({ code: `ALK0249`, context: `generating files`, }, count_msg );
  }

  let scenarios_combined = all_generated_Scenarios_strings.join(`\n`);

  let new_file_contents = [ feature_text, scenarios_combined ].join(`\n`);

  return { new_contents: new_file_contents, errors: generation_errors };
}


function get_Feature_text({ feature, generator_lines }) {
  /** Return text of Feature section to put at the top of the new file
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.feature - Gherkin AST `feature` object
   * @param {[string]} obj.generator_lines - Text of the generator file as a list
   *
   * @returns {string} - Text of the new file's Feature section
   * */
  add_Feature_randomization_indicators({ generator_lines, feature });

  let first_scenario = feature.children[0].scenario;
  let first_Scenario_line = get_Scenario_start_line_num({ scenario: first_scenario });
  let first_Scenario_index = as_index( first_Scenario_line );
  let index_of_last_line = first_Scenario_index - 1;

  let feature_text = generator_lines.slice(
    0, index_of_last_line + 1  // `slice` excludes the last index
  ).join(`\n`);

  return feature_text;
}


function add_Feature_randomization_indicators({ generator_lines=``, feature={} }) {
  /** Mutates `generator_lines`. Modifies the tag and name of the Feature section.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.feature - Gherkin AST `feature` object
   * @param {[string]} obj.generator_lines - Text of the generator file as a list
   *
   * @returns {undefined}
   * */
  let feature_index = as_index( feature.location.line );

  let tag_indicator = `@alkiln_randomized`;
  let name_indicator = `with ALKiln randomization`;
  let new_f_name_line = ``;

  if ( feature.tags.length > 0 ) {
    // Modify existing tags
    let tags_index = as_index( feature.tags[0].location.line );
    let tags_starter = generator_lines[ tags_index ];

    generator_lines[ tags_index ] = `${ tags_starter } ${ tag_indicator }`;
    new_f_name_line = generator_lines[ feature_index ];

  } else {
    // If no existing tags, add new tag line
    new_f_name_line = `${ tag_indicator }\n${ generator_lines[ feature_index ] }`;
  }

  generator_lines[ feature_index ] = `${ new_f_name_line } ${ name_indicator }`;
}


function get_constraints_Step({ generator_Scenario }) {
  /** Return all the constraint Steps objects in a generator Scenario. Give
   *    warnings if needed. There should only be 1, but we all make mistakes. If
   *    there is an error, return the ALKiln error object.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.generator_Scenario - A valid Gherkin AST object of one Scenario
   *
   * @returns {object} rtn - Named return values
   * @returns {[object]} rtn.constraintsSteps - 0 or more constraints Steps in
   *     this Scenario.
   * @returns {[str]} rtn.warnings - 0 or more warning messages.
   * @returns {[Error]} rtn.errors - 0 or more Errors.
   * */
  let constraints_Steps = [];
  let errors = [];
  let warnings = [];

  for ( let step of generator_Scenario.steps ) {
    let possible_constraints_Step = get_if_is_constraints_Step({ step });
    if ( possible_constraints_Step === null ) { continue; }

    constraints_Steps.push( possible_constraints_Step );

    if ( !possible_constraints_Step.dataTable ) {
      let msg = `The **table** of the constrained random answers Step is missing in the Scenario at line ${ generator_Scenario.location.line } - "${ generator_Scenario.name }"`;
      errors.push( new Error( msg ));
      log.warn({ code: `ALK0239`, context: `generating files`, }, msg );
    }

  }  // ends for every step

  let num_Steps_found = constraints_Steps.length;

  // TODO: Change tests to test for warnings (unit and integrated)
  if ( num_Steps_found > 1 ) {
    let msg = `A generator Scenario can only have 1 constraints Step. The Scenario at line ${ generator_Scenario.location.line } has ${ num_Steps_found }. The Scenario description: "${ generator_Scenario.name }"`
    log.warn({ code: `ALK0240`, context: `generating files`, }, msg );
    return { constraints_Step: null, errors: [ ...errors, new Error( msg )] };
  }

  if ( num_Steps_found === 0 ) {
    let msg = `The generator Scenario is missing a constrained random answers Step. The Scenario starts at line ${ generator_Scenario.location.line } - "${ generator_Scenario.name }"`;
    log.warn({ code: `ALK0241`, context: `generating files`, }, msg );
    return { constraints_Step: null, errors: [ ...errors, new Error( msg )] };
  }

  return { constraints_Step: constraints_Steps[0], warnings, errors };
}


// Tests to find the step
const CONSTRAIN_REGEX = /constrain/i;  // constrained/constraint/constraints
const RAND_REGEX = /rand/i;
const GENERATE_REGEX = /generate/i;
function get_if_is_constraints_Step({ step }) {
  /** Return null or a constraints Step.
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
  }

  return null;
}


function get_unique_Story_Tables_strings({ num_to_generate, ids, step }) {
  /** Return all the necessary randomized Story Tables as strings. Make sure
   *    they are unique.
   *
   * @param {object} obj - Named arguments
   * @param {int} obj.num_to_generate Number of Story tables to generate
   * @param {[string]} obj.ids The question ids that any of the Story Tables can
   *     reach
   * @parm {object} obj.step A valid constraints Step Gherkin object
   * 
   * @returns {object} rtn - Named return values
   * @returns {[str]} rtn.constraintsSteps - 0 or more Story Tables (see docs).
   * @returns {[str]} rtn.warnings - 0 or more warning messages.
   * @returns {[Error]} rtn.errors - 0 or more Errors.
   *  */
  let story_tables = [];
  let warnings = [];
  let errors = [];

  // Each new Story Table Step starts the same way
  let step_indent = get_authors_indent({ located: step });
  let table_start = `${ step_indent }And I get to any of the question ids [${ ids.join(`, `) }] with this data:`;

  for ( let table_i = 0; table_i < num_to_generate; table_i++ ) {

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

  // // Discuss: Warn of missing table?
  // if ( story_tables.length === 0 ) {}

  if ( story_tables.length < num_to_generate ) {
    // Discuss: Debug log or warning to developer? If the latter, need to make it pretty
    warnings.push(
      log.warn({ code: `ALK0243`, context: `generating files`, },
        `ALKiln only managed to make ${ story_tables.length } unique tests out of the ${ num_to_generate } asked for given the options:`,
        get_flatter_Step({ step })
      )
    );
  }

  return { story_tables, warnings, errors };
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
   * Discuss: Should this go in the Log class?
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.step - Valid Gherkin `step` object
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
   * Discuss: Warn about wrong number of columns?
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
  if ( answer === `` ) {
    let row_str = get_row_as_string({ row });
    // TODO: Is this necessary or can we let this go?
    console.log(`ALK0244 WARNING: One of the the constrained random answer choices in a row in this table is "". Is that a typo? The row: "${ row_str }"`)
  }

  let row_str = `${ indent }| ${ cells[0].value } | ${ answer } |`;
  if ( cells.length >= 3 ) { row_str += ` ${ cells[2].value } |`; }
  return row_str;
};


// Make a placeholder where we will make the scenario unique
let ID_PLACEHOLDER = `ALKILN_SCENARIO_RANDOM_ID_PLACEHOLDER`;
function get_generated_Scenarios_str({
  all_scenarios_top,
  warnings_Step = null,
  generator_id,
  story_tables,
  all_scenarios_bottom
}) {
  /** Return the string for the combined Scenarios.
   *
   * @param {object} obj - Named arguments
   * @param {string} obj.all_scenarios_top - Scenario text that comes before the
   *     constraints Step
   * @param {string} obj.warnings_Step - Optional. Default is `null`. Step to
   *     show the author a warning message.
   * @param {int | string} obj.generator_id - ID of the generating Scenario
   * @param {[string]} obj.story_tables - Story Table text for every Scenario
   *     that we need to generate
   * @param {string} obj.all_scenarios_bottom - Scenario text that comes after the
   *     constraints Step
   *
   * @returns {[string]} - List of complete Scenario strings
   * */
  let scenarios = [];
  for ( let table_i = 0; table_i < story_tables.length; table_i++ ) {

    let scenario_id = `generator${ generator_id + 1 }_scenario${ table_i + 1 }_of_${ story_tables.length }`;
    let random_top = all_scenarios_top.replaceAll( ID_PLACEHOLDER, scenario_id );

    let story_table = story_tables[ table_i ];

    let scenario_items = [ random_top ];
    if ( warnings_Step ) { scenario_items.push( warnings_Step ); }
    scenario_items.push( story_table, all_scenarios_bottom );

    let scenario_str = scenario_items.join(`\n`);
    scenarios.push( scenario_str );
  }

  let this_Scenarios_strings = scenarios.join(`\n`);
  return this_Scenarios_strings;
};


function get_pre_constraints({ generator_Scenario, constraints_Step, generator_lines }) {
  /** Return the Scenario text that comes before the first constraints Step.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.generator_Scenario - AST of the Scenario
   * @param {object} obj.constraints_Step - AST of the constraints Step
   *     Step
   * @param {[string]} obj.generator_lines - List of lines from the generator
   *     file
   *
   * @returns {string} - Scenario text that comes before the first constraints
   *     Step
   * */
  // Use a shorter name as there are a lot of long lines of code
  let lines = generator_lines;

  let keyword_index = as_index( generator_Scenario.location.line );
  let new_starter = lines[ keyword_index ];

  // If find tags, append randomness indicator to tag line
  if ( generator_Scenario.tags.length > 0 ) {
    let tags_index = as_index( generator_Scenario.tags[0].location.line );
    lines[ tags_index ] = `${ lines[ tags_index ] } @alkiln_randomized_${ ID_PLACEHOLDER }`;
  } else {
    new_starter = `@alkiln_randomized_${ ID_PLACEHOLDER }\n${ new_starter }`;
  }
  lines[ keyword_index ] = `${ new_starter } ALKiln random test ${ ID_PLACEHOLDER }`;

  // Get the line number that matches the index of the file contents list
  // where that line is in the file itself.
  let start_line_num = get_Scenario_start_line_num({ scenario: generator_Scenario });
  let top_start_index = as_index( start_line_num );

  let top_end_index = get_index_before({ line_num: constraints_Step.location.line });

  // Re-build the string of the pre-constraints section of the Scenario
  let scenario_top_text = lines.slice(
    top_start_index,
    top_end_index + 1  // `slice` excludes the terminal number
  ).join(`\n`);

  return scenario_top_text;
};


function get_post_constraints({ next_Scenario, constraints_Step, generator_lines }) {
  /** Return the Scenario text that comes after the last constraints Step.
   *
   * @param {object} obj - Named arguments
   * @param {object | undefined} obj.next_Scenario - AST of the Scenario after this Scenario
   * @param {object} obj.constraints_Step - AST of the last constraints Step
   * @param {[string]} obj.generator_lines - List of lines from the generator file
   *
   * @returns {string} - Scenario text that comes after the last constraints
   *     Step
   * */
  let rows = constraints_Step.dataTable.rows;
  let constraints_end_index = as_index( rows[ rows.length - 1].location.line );
  let bottom_start_index = constraints_end_index + 1;

  if ( !next_Scenario ) {
    // Get lines till the end of the file
    let scenario_bottom_text = generator_lines.slice(
      bottom_start_index
    ).join(`\n`);
    return scenario_bottom_text;
  }

  // Get lines till the start of the next Scenario
  let next_Scenario_start_line = get_Scenario_start_line_num({ scenario: next_Scenario });
  let bottom_end_index = get_index_before({ line_num: next_Scenario_start_line });

  let scenario_bottom_text = generator_lines.slice(
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
   *    in the file and therefore an item in the `generator_lines` list. The line
   *    numbers are 1-indexed. That means the location of `{line: 1}` in the AST
   *    refers to `generator_lines[0]`.
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
function get_number_of_Scenarios_to_generate({ step_text }) {
  /** Return the number of random constraints tests to generate with a minimum
   *    of 1 test.
   * 
   * Gives warnings instead of errors, defaulting to returning `1`.
   *
   * @param {object} obj - Named arguments
   * @param {string} obj.step_text - The text of a constraints Step
   * 
   * @returns {object} rtn - Named return values
   * @returns {int} rtn.num_to_generate - Number of tests to generate. Min is 1.
   * @returns {[str]} rtn.warnings - 0 or more warning messages.
   * @returns {[Error]} rtn.errors - 0 or more Errors.
   * */
  let num_to_generate = null;
  let warnings = [];
  let errors = [];
  let number_matcher = step_text.match( CAPTURE_NUMBERS_REGEX );

  /** No numbers */
  if ( number_matcher === null ) {
    warnings.push(
      log.warn({ code: `ALK0245`, context: `generating files`, },
        `A constrained random answers Step is missing the number of tests to generate. ALKiln will create 1 test. The Step: "${ step_text }"`
      )
    );
    num_to_generate = 1;
  }

  /** Too many numbers */
  if ( number_matcher && number_matcher.length > 1 ) {
    // Some feedback indicated using the last number makes more sense to people
    let msg = 
    warnings.push(
      log.warn({ code: `ALK0246`, context: `generating files`, },
        `This constrained random answers Step is ambiguous because it contains more than 1 number. ALKiln will use the last number the author gave. The Step:`,
        `\n${ step_text }`
      )
    );
    num_to_generate = parseInt( number_matcher[ number_matcher.length - 1 ]);
  }

  // TODO: Add env.MAX_RANDOM_TESTS_FOR_ONE_SCENARIO

  /** Happy path */
  if ( number_matcher && !num_to_generate ) {
    num_to_generate = parseInt( number_matcher[ 0 ]);
  }

  return { num_to_generate, warnings, errors };
}


function get_warnings_Step({ warnings = [], step_text }) {
  /** Returns the text for any warnings that need to be added to the Scenario
   * 
   * @param {object} obj - Named arguments
   * @param {[string]} obj.warnings - 0 or more warning messages
   * @param {string} obj.step_text - Text of the constraints Step
   * 
   * @returns {object} rtn - Named return values
   * @returns {str} rtn.warnings_Step - cucumberjs Step to show author a warning
   * @returns {[Error]} rtn.errors - 0 or more Errors.
   * */
  let errors = [];

  if ( warnings.length === 0 ) { return { warnings_Step: null, errors }; }

  let indent_match = step_text.match(/$\s*/);
  let indent = ( indent_match && indent_match[ 0 ]) || `  `;

  let new_warnings_lines = [];
  new_warnings_lines.push(`${ indent }And ALKiln warns the author about a generator problem with:`);
  new_warnings_lines.push(`${ indent }  """`);

  for ( let warning of warnings ) {
    let warning_lines = warning.split(`\n`);
    for ( let warning_line of warning_lines ) {
      new_warnings_lines.push(`${ indent }  ${ warning_line }`);
    }
  }

  new_warnings_lines.push(`${ indent }  """`);

  let warnings_Step = new_warnings_lines.join(`\n`);

  return { warnings_Step, errors };
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
   * @returns {object} rtn - Named return values
   * @returns {["str"]} rtn.ids - 0 or more double-quoted docassemble question
   *     block ids. Each generated Story Table Step must end at one of these
   *     ids. this Scenario.
   * @returns {[str]} rtn.warnings - 0 or more warning messages.
   * @returns {[Error]} rtn.errors - 0 or more Errors.
   * */
  let errors = [];
  let warnings = [];
  
  let ids = step_text.match( CAPTURE_QUESTION_IDS_REGEX );

  if ( ids === null ) {
    let missing_ids_msg = `The constrained random answers Step is missing its question ids. ALKiln is unable to create random tests for this generator Scenario. The Step:\n${ step_text }`;
    log.warn({ code: `ALK0247`, context: `generating files`, },
      missing_ids_msg
    );
    errors.push( missing_ids_msg );
  }

  return { ids, errors, warnings };
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


function get_row_as_string({ row }) {
  /** Return the given Gherkin row as a single markdown table row */
  let cells = row.cells;
  let values = cells.map(( cell ) => { return cell.value; });
  let row_str = `| ${ values.join( ` | ` ) } |`;
  return row_str;
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
  if ( scenario.tags.length > 0 ) {
    return scenario.tags[0].location.line;
  } else {
    return scenario.location.line;
  }
}


function as_index( line_num ) {
  /** Given a Gherkin line number, return the file-lines-list index for that
   *    line number. This is here mostly as a name that helps clarify what the
   *    code is doing.
   *
   * Each Gherkin line number matches a line in the file and therefore an item
   *    in the `generator_lines` list. The Gherkin line numbers are 1-indexed. That
   *    means the location of `{line: 1}` in the AST refers to `generator_lines[0]`.
   *
   * @param {int} line_num - A 1-indexed Gherkin line number
   *
   * @returns {int} - The corresponding index in the list of lines in the
   *    generator file
   * */
  return line_num - 1;
}
