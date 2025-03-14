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
 * Discuss: Require author to use "Generator Scenario:" as they keyword (Also
 *    "Generator Scenario Outline:") (or "Scenario Generator", maybe harder to
 *    scan) for 2 reasons. 1. Gets the vocab of "generator" in early (though
 *    that doesn't match "constraints" Step, which is a whole other language
 *    problem we haven't solved yet.) 2. Saying "MAX_RANDOM_TESTS_PER_SCENARIO"
 *    is confusing when "Scenario" means different things - a generator Scenario
 *    and a regular Scenario.
 * Discuss: Now that Log is less fragile and duplicated, shall we create a new
 *    Log instance in here?
 * Discuss: consider debug types that are for authors. Sort of like warnings,
 *    but less loud.
 * Discuss: Log.error that just returns a string formatted like an error with
 *    the right icon, etc, without logging it to the console. We can _sort_ of
 *    do that now, but without the icon.
 * */


/** Note: Keep this file non-executable so we can test it more easily. */


module.exports = constrained_random_tests = {};

let log = null;

const FOLDER_NAME = globals.generated_files_folder_name;
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
   * For examples, see tests.
   *
   * */
  log = logger;

  let new_files_strings = [];
  let all_errors = [];

  // Get the paths of the source files that we need to parse
  let generator_paths = fg.sync(`${ sources_path }/${ globals.generators_prefix }*.feature`);
  for ( let generator_path of generator_paths ) {

    let file_text = fs.readFileSync( generator_path, {encoding: `utf8`});

    log.info({ code: `ALK0231`, context: `generating files`, },
      `Starting to generate the constrained random answers tests for "${ generator_path }"`
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

  let tests_path = `${ sources_path }/${ FOLDER_NAME }`;
  let artifacts_path = `${ session_vars.get_artifacts_path_name() }/${ FOLDER_NAME }`;
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
  // Unit tests call the parser alone, so they need to create their own logger.
  if ( logger ) {
    log = logger;
  }

  let errors = [];

  let { doc_AST, errors: generator_Gherkin_errors } = get_generator_AST({ file_text, generator_path });
  if ( generator_Gherkin_errors.length > 0 ) {
    return { new_contents: null, errors: generator_Gherkin_errors };
  }

  let { new_contents, errors: generating_errors } = get_new_file_contents({ doc_AST, file_text, generator_path });
  if ( generating_errors.length > 0 ) {
    return { new_contents: null, errors: generating_errors };
  }

  let { errors: generated_parsing_errors } = validate_syntax({ file_text: new_contents, generator_path });
  if ( generated_parsing_errors.length > 0 ) {
    let syntax_error = log.error({ code: `ALK0249`, context: `generating files`, before: `\n\n`, },
      `The .feature file ALKiln generated from "${ generator_path }" had Gherkin syntax error(s)\n`,
      ...get_error_stacks({ errors: generated_parsing_errors })
    );
    return { new_contents, errors: [ new Error( syntax_error )] };
  }

  return { new_contents, errors };
}


function get_generator_AST({ file_text, generator_path }) {
  /** Return any errors created when Gherkin tries to parse the generator file.
   *     If there are any errors, throw a list of all the errors.
   * 
   * @param {object} obj - Named arguments
   * @param {string} obj.file_text - Text of the Gherkin file
   * @param {string} obj.generator_path - Path to the generator file
   * 
   * @returns {object} rtn - Named return values
   * @returns {object} rtn.doc_AST - Gherkin AST of a .feature file
   * */
  let { AST: doc_AST, errors: generator_errors } = get_Gherkin_AST({ file_text });

  if ( generator_errors.length <= 0 && doc_AST.feature ) {
    return { doc_AST, errors: [] };
  }

  /** Error handling */
  if ( generator_errors.length > 0 ) {
    let syntax_error = log.error({ code: `ALK0236`, context: `generating files`, before: `\n\n`, },
      `The author's generator .feature file at "${ generator_path }" Gherkin syntax error(s). You might see more warnings above or below this one.\n`,
      ...get_error_stacks({ errors: generator_errors })
    );
    return { doc_AST: null, errors: [ new Error( syntax_error )] };
  }

  // We have never been able to trigger `!doc_AST`

  if ( !doc_AST.feature ) {
    let feature_error = log.error({ code: `ALK0254`, context: `generating files`, before: `\n\n`, },
      `The author's generator .feature file at "${ generator_path }" needs to include the \`Feature\` keyword.\n`
    );
    return { doc_AST: null, errors: [ new Error( feature_error )] };
  }

  // Should not get here
  let unknown_error = log.debug({ code: `ALK0255`, context: `generating files`, before: `\n\n`, },
    `The author's generator .feature file at "${ generator_path }" ran into an unknown error when ALKiln tried to parse it.\n`
  );
  return { doc_AST, errors: [ new Error( unknown_error )] };
}


function validate_syntax({ file_text }) {
  /** Return any errors we get from running the text through the Gherkin parser
   * 
   * @param {object} obj - Named arguments
   * @param {str} obj.file_text - Text of the Gherkin file
   * 
   * @returns {object} rtn - Named return values
   * @returns {[Error]} rtn.errors - 0 or more Errors.
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
  // Delete the old files no matter what
  delete_previous_tests_from_sources_folders_for_ALKiln_developers({ tests_path });

  if ( file_strings.length === 0 ) { return; }

  // Implementation note: This has no error if the folder already exists
  fs.mkdirSync( tests_path, { recursive: true });
  fs.mkdirSync( artifacts_path, { recursive: true });

  // TODO: For internal testing, create a separate GitHub workflow to test the
  //    number of files that were generated
  log.debug({ code: `ALK0250`, context: `generating files`, },
    `Saving ${ file_strings.length } newly generated files in "${ tests_path }"`
  );

  let count = 1;
  for ( let file_str of file_strings ) {
    let filename = `${ count }_${ Date.now() }.feature`;
    count++;
    // Implementation note: If the files don't exist, this creates them
    fs.appendFileSync( `${ tests_path }/${ filename }`, file_str );
    fs.appendFileSync( `${ artifacts_path }/${ filename }`, file_str );
  }

  log.debug({ code: `ALK0252`, context: `generating files`, },
    `Saved new generated files:`, fs.readdirSync( tests_path )
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
  log.debug({ code: `ALK0251`, context: `generating files`, },
    `Deleting previously generated files:`, fs.readdirSync( tests_path )
  );
  fs.rmSync( tests_path, { recursive: true, force: true });
}


function get_new_file_contents({ doc_AST={}, file_text=``, generator_path }) {
  /** Return the text for one new file with tests based on one generator file.
   *
   * Note: Right now it is out of scope to save comments in constraints Steps.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.doc_AST - Gherkin-parsed abstract syntax tree of
   *    generator file
   * @param {string} obj.file_text - String of the whole generator file
   * @param {string} obj.generator_path - Path to the generator file
   *
   * @returns {null | string} - The text (Feature, Scenarios, etc) for the new
   *     file
   * 
   * @returns {object} rtn - Named return values
   * @returns {null | str} rtn.new_contents - `null` or string for the new file
   * @returns {[Error]} rtn.errors - 0 or more Errors.
   * */

  // `doc_AST.feature.children` seem to always be defined by here
  let scenario_objs = doc_AST.feature.children;
  if ( !scenario_objs[0] ) {
    let syntax_error = log.error({ code: `ALK0256`, context: `generating files`, before: `\n\n`, },
      `The author's generator .feature file at "${ generator_path }" may be missing its Scenarios.\n`
    );
    return { new_contents: null, errors: [ new Error( syntax_error ) ]};
  }
  // `scenario_objs[0].scenario` seems to always be defined by here


  let generation_errors = [];

  let generator_lines = file_text.split(`\n`);

  let feature_text = get_Feature_text({ feature: doc_AST.feature, generator_lines });

  let { scenarios_strings, errors: scenarios_errors } = get_new_Scenarios({
    scenario_objs,
    generator_lines
  });
  generation_errors.push( ...scenarios_errors );


  let count_msg = `ALKiln generated ${ scenarios_strings.length } Scenarios`;

  if ( scenarios_strings.length === 0 ) {
    let error = log.error({ code: `ALK0246`, context: `generating files`, }, count_msg );
    generation_errors.push( new Error( error ));
    return { new_contents: null, errors: generation_errors };
  }

  log.info({ code: `ALK0247`, context: `generating files`, }, count_msg );

  let scenarios_combined = scenarios_strings.join(`\n\n`);
  let new_file_contents = [ feature_text, scenarios_combined ].join(`\n\n`);

  if ( !new_file_contents ) {
   let msg = `Unable to generate a constrained random answers file from "${ generator_path }". See above for warnings and errors.`;
   let error = log.error({ code: `ALK0248`, context: `generating files`, }, msg );
   return { new_contents: null, errors: [ new Error( error )] }; 
  }

  return { new_contents: new_file_contents, errors: generation_errors };
}


function get_Feature_text({ feature, generator_lines }) {
  /** Return text of Feature section to put at the top of the new file
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.feature - Gherkin AST `feature` object
   * @param {[string]} obj.generator_lines - Text of the generator file as a
   *     list
   *
   * @returns {string} - Text of the new file's Feature section
   * */
  add_Feature_randomization_indicators({ generator_lines, feature });

  let first_scenario = feature.children[0].scenario;
  let first_Scenario_line = get_Scenario_start_line_num({ scenario: first_scenario });
  let first_Scenario_file_index = as_index( first_Scenario_line );
  let index_of_last_line = first_Scenario_file_index - 1;

  let feature_text = generator_lines.slice(
    0, index_of_last_line + 1  // `slice` excludes the last index
  ).join(`\n`);

  return feature_text;
}


function get_new_Scenarios({ scenario_objs, generator_lines }) {
  /** Return all the strings of the generated Scenarios and any Errors we ran
   *    into.
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario_objs - 0 or more Gherkin Scenario objects
   *     (which are generators)
   * @param {[str]} obj.generator_lines - List of lines in the generator file
   * 
   * Starting here, functions' return values should now include lists of warning
   *     messages. If a Scenario gets any warnings, we will add a "warnings"
   *     Step to that Scenario. Implement over time.
   * 
   * @returns {object} rtn - Named return values
   * @returns {[str]} rtn.scenarios - 0 or more Scenario strings
   * @returns {[Error]} rtn.errors - 0 or more Error objects
   * */
  let errs_n_warns = new Misbehaviors();

  let strs_for_all_new_Scenarios = [];
  // TODO: We should only have one Scenario here now (maybe)
  for ( let scenario_obj_i = 0; scenario_obj_i < scenario_objs.length; scenario_obj_i++ ) {

    errs_n_warns.reset_warnings();
    /** Start returning warnings here. */
    let generator_Scenario = scenario_objs[ scenario_obj_i ].scenario;

    let description = scenario_description_for_logs({ scenario: generator_Scenario });
    log.info({ code: `ALK0260`, context: `generating files`, },
      `Generating files for Scenario at ${ description }`
    );

    // I need to get text between the Scenario name the fore Steps (comments, description, blank lines)

    // Get the values for the various Steps that have to come before any other
    //     Steps. Right now, that's only num_to_generate. Discuss: premature?
    let {
      gherkin_index_of_the_final_fore_Step,
      num_to_make,
      file_lines_to_delete,  // TODO: Delete these lines
      warnings: fore_Steps_warnings, errors: fore_Steps_errors
    } = get_fore_Steps({ scenario: generator_Scenario });
    errs_n_warns.add({
      warnings: fore_Steps_warnings, errors: fore_Steps_errors
    });
    if ( errs_n_warns.errors.length > 0 ) { continue; }

    // scenario_after_fore_Steps = { ...generator_Scenario };
    // scenario_after_fore_Steps.steps = generator_Scenario.steps.slice( gherkin_index_of_the_final_fore_Step + 1 );

    /**
     * "Notes" of what we'll need need to do with each type of line
     * @a_tag (modify) (scenario_top_part_1) (future new file) (origin is file line 12)
     * # comment???? (copy)
     * Scenario: boo (modify) (scenario_top_part_2) (future new file) (origin is file line 14)
     * Some description (copy) (file line? Location is not given in AST)
     * # comment here (copy)
     *   Given num to make (delete)
     *   And other stuff (copy)
     *   (until the first constraints Step)
     *   When constraints Step
     *    | ... | ... |
     * */

    // let {
    //   strs: strs_from_the_Scenario,
    //   warnings: steps_warnings, errors: steps_errors
    // } = get_strs_from_1_Scenario({
    //   scenario: generator_Scenario,
    //   generator_lines: generator_lines,
    //   file_lines_to_delete,  // TODO: Add to the function signature
    //   num_to_make,
    //   gherkin_index_of_the_final_fore_Step,
    // });
    // errs_n_warns.add({ warnings: steps_warnings, errors: steps_errors });
    // if ( errs_n_warns.errors.length > 0 ) { continue; }

    // strs_for_all_new_Scenarios.push( strs_from_the_Scenario );


    // // Examples of constraints Steps
    // // And ALKiln tests can get to ["end"] when I pick from:
    // // And the ALKiln test can get to one of "end1", "end 2", or "end-3" with:
    // let {
    //   constraints_Step,
    //   warnings: constraints_warnings,
    //   errors: constraints_errors
    // } = get_constraints_Step({ generator_Scenario });
    // errs_n_warns.add({ warnings: constraints_warnings, errors: constraints_errors });
    // if ( errs_n_warns.errors.length > 0 ) { continue; }

    // // let {
    // //   num_to_generate,
    // //   warnings: num_warnings,
    // //   errors: num_errors
    // // } = get_number_of_Scenarios_to_generate({ step_text: constraints_Step.text });
    // // errs_n_warns.add({ warnings: num_warnings, errors: num_errors });

    // let {
    //   ids: final_page_ids,
    //   warning: ids_warnings,
    //   errors: ids_errors
    // } = get_final_ids({ step_text: constraints_Step.text });
    // errs_n_warns.add({ warnings: ids_warnings, errors: ids_errors });
    // if ( final_page_ids === null ) { continue; }

    // let {
    //   story_tables: generated_story_tables_strs,
    //   warnings: story_tables_warnings,
    //   errors: story_tables_errors
    // } = get_unique_Story_Tables_strings({
    //   num_to_generate,
    //   ids: final_page_ids,
    //   step: constraints_Step
    // });
    // errs_n_warns.add({ warnings: story_tables_warnings, errors: story_tables_errors });

    // /** Stop returning warnings here. */

    // let { warnings_Step, errors: warning_step_errors } = get_warnings_Step({
    //   warnings: errs_n_warns.warnings,
    //   step_text: constraints_Step.text
    // });
    // errs_n_warns.add({ errors: warning_step_errors });
    
    // // The Scenario top and bottom will wrap every generated Story Table for
    // //    this generator Scenario
    // let all_scenarios_top = get_pre_constraints({
    //   generator_Scenario,
    //   constraints_Step,
    //   generator_lines,
    //   has_warnings: errs_n_warns.warnings.length > 0
    // });
    // let all_scenarios_bottom = get_post_constraints({
    //   next_Scenario: (scenario_objs[ scenario_obj_i + 1 ] || {}).scenario,
    //   constraints_Step,
    //   generator_lines
    // });

    // let generated_Scenarios_str = get_generated_Scenarios_str({
    //   all_scenarios_top,
    //   warnings_Step,
    //   generator_id: scenario_obj_i,
    //   story_tables: generated_story_tables_strs,
    //   all_scenarios_bottom
    // });
  }  // ends for every scenario_container

  // return { scenarios_strings: one_Scenarios_bodies, errors: errs_n_warns.errors }
  return { scenarios_strings: [`Scenario: placeholder\n`], ...errs_n_warns };
}  // Ends get_new_Scenarios()


class Misbehaviors {
  /** Accumulates and manages errors and warnings lists. This lets you
   *    accumulate errors for a whole function. A loop in that function, though,
   *    can build up warnings just for that loop, after which you can reset the
   *    warnings list for the next loop. Each loop can add up its own warnings.
   * 
   * Example:
   * 
   * function do_important_things() {
   *   let misfits = new Misbehaviors();
   *   
   *   let { result, errors } = func();
   *   misfits.add({ errors });
   * 
   *   for ( let item of items ) {
   * 
   *     misfits.reset_warnings();
   * 
   *     let { foo, warnings1, errors1 } = func1( item );
   *     misfits.add({ warnings: warnings1, errors: errors1 });
   * 
   *     let { bar, warnings2, errors2 } = func2( item );
   *     misfits.add({ warnings: warnings2, errors: errors2 });
   * 
   *     console.log( misfits.warnings );
   *     // Loop 1: [ "oops", "darn" ]
   *     // Loop 2: [ "shoot", "zoinks" ]
   *   }
   * 
   *   console.log( misfits.errors );
   *   // [ "ahh!", "gorramit", "that's done it" ]
   * }
   * */
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  reset_warnings() {
    /** Sets warnings to an empty list. This is useful inside a loop that still
     *    needs to keep 
     * 
     * @returns {undefined}
     * */
    this.warnings = [];
  }

  add({ errors=[], warnings=[] }) {
    /** Adds errors and/or warnings to their list
     * 
     * @param {obj} obj - Named arguments
     * @param {[str]} obj.warnings - (Optional) 0 or more warning messages
     * @param {[Error]} obj.errors - (Optional) 0 or more Error objects
     * 
     * @returns {undefined}
     * */
    if ( this.errors ) { this.errors.push( ...errors ); }
    if ( this.warnings ) { this.warnings.push( ...warnings ); }
  }
}


function get_fore_Steps({ scenario }) {
  /** Get Steps that must come in the first section of any kind of Scenario that
   *     ALKiln manipulates before running the cucumber tests. Does this really
   *     need to be abstracted for possible future "first Step"s already?
   * 
   * Discuss: If a "first" Step appears multiple times, should that be an error
   *     or a warning?
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - Gherkin AST `scenario` object
   * 
   * @returns {string} - Description of the Scenario
   * */
  let misfits = new Misbehaviors();
  let steps = scenario.steps;

  let first_vals = {
    num_to_make: null,
  };

  let last_valid_fore_step_index = -1;
  let file_lines_to_delete = [];

  for ( let step_i = 0; step_i < steps.length; step_i++ ) {
    let step = steps[ step_i ];

    let all_results = [];

    /** Number of tests to generate */
    let { num_to_make, ...num_results } = get_number_of_Scenarios_to_generate2({
      step,
      prev_num_to_make: first_vals.num_to_make
    });
    misfits.add({ ...num_results });
    first_vals.num_to_make = num_to_make || first_vals.num_to_make;
    if ( num_to_make !== null ) {
      file_lines_to_delete.push(as_index( step.location.line ));
    }

    /** Other possible fore Steps */
    // TBS

    /** Possibly the end */
    // If none of the "first Step" values were satisfied, stop here
    if ( [ num_to_make ].every(function ( item ) { return item === null; }) ) {
      break;
    }

    last_valid_fore_step_index = step_i;
  }

  log.debug({ code: `ALK0262`, context: `generating files` },
    `The final "first Step" Gherkin index was ${ last_valid_fore_step_index }. The final file index of that Step was ${ as_index(steps[ last_valid_fore_step_index ].location.line) }.`
  );

  // TODO: Write test for error for missing fore-Steps
  let there_were_no_fore_Steps = last_valid_fore_step_index === -1;
  if ( there_were_no_fore_Steps ) {
    let description = scenario_description_for_logs({ scenario });
    misfits.add({ errors:
      [ log.error({ code: `ALK0263`, context: `generating files` },
        `A generator Scenario's first Step must say how many constrained random answers tests to make. This generator Scenario is missing that Step. Scenario description:\n${ description }`
      ) ]
    });
  }

  return {
    gherkin_index_of_the_final_fore_Step: last_valid_fore_step_index,
    num_to_make: first_vals.num_to_make,
    file_lines_to_delete,
    warnings: misfits.warnings,
    errors: misfits.errors
  };
}


// TODO: Consider adding "pick" and "choose" as alternatives for "constrain"
const ALKILN_REGEX = /ALKiln/i;
const CONSTRAIN_REGEX = /constrain/i;  // constrained/constraint/constraints
const RAND_REGEX = /rand/i;  // random/randomness/randomized
const GENERAT_REGEX = /generat/i;  // generate/generates/generated/generating
const MAKE_REGEX = /make|made/i;  // make/makes/made/making
const CAPTURE_NUMBERS_REGEX = /(\d+)/g;
function get_number_of_Scenarios_to_generate2({ step, prev_num_to_make }) {
  /** Return null or a constraints Step.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.step - A valid constraints Step Gherkin object
   * @param {int | undefined} obj.prev_num_to_make - A previously found number
   *     if there was one, or `undefined`
   *
   * @returns {null | object} `null` or a constraints Step
   * */
  // Given ALKiln should make 10 constrained random tests
  let warnings = [];
  let errors = [];
  let text = step.text;
  let user_num = null;

  // Use `.test()` without `g` flag. See
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
  let is_num_Step = ALKILN_REGEX.test( text )
                        &&  CONSTRAIN_REGEX.test( text )
                            && ( RAND_REGEX.test( text )
                                 || GENERAT_REGEX.test( text )
                                 || MAKE_REGEX.test( text )
                               );

  /** Not a numbers Step, which errors elsewhere if needed */
  if ( !is_num_Step ) {
    return { num_to_make: null, warnings, errors };
  }

  /** Conflicts with previous number Step */
  if ( prev_num_to_make ) {
    // Discuss: If there are multiple number Steps, the author ends up seeing
    //     multiple messages about what ALKiln will use to set the number and
    //     also possibly repeat this message. Can we do something about that in
    //     a way that is also maintainable?
    warnings.push( 
      log.warn({ code: `ALK0238`, context: `generating files`, },
        `A generator Scenario has too many Steps that set the number of tests to make. ALKiln will use the final number Step it finds or calculates. The current Step:\n${ text }`
      )
    );
  }

  let number_matcher = text.match( CAPTURE_NUMBERS_REGEX );

  /** Missing number */
  if ( number_matcher === null ) {
    warnings.push( 
      log.warn({ code: `ALK0261`, context: `generating files`, },
        `A generator Scenario is missing the number of tests to make. ALKiln will now make 1 constrained random answers test. The current Step:\n${ text }`
      )
    );
    return { num_to_make: 1, warnings, errors };
  }

  /** Too many numbers */
  if ( number_matcher && number_matcher.length > 1 ) {
    // Some feedback indicated using the last number makes more sense to people
    //    than the first
    user_num = parseInt( number_matcher[ number_matcher.length - 1 ]);
    warnings.push(
      log.warn({ code: `ALK0237`, context: `generating files`, },
        `This constrained random answers Step is ambiguous because it has more than 1 number. ALKiln will now use the last number in the Step (${ user_num }). The Step:\n${ text }`,
      )
    );
  }

  /** Happy path */
  if ( number_matcher && !user_num ) {
    user_num = parseInt( number_matcher[ 0 ]);
  }

  let num_to_make = Math.min(
    session_vars.get_max_tests_per_generator_scenario(),
    user_num
  );

  if ( num_to_make !== user_num ) {
    warnings.push(
      log.warn({ code: `ALK0253`, context: `generating files`, },
        `The author asked to make ${ user_num } tests, but maximum allowed is ${ num_to_make }. ALKiln will now make ${ num_to_make } tests. If you want to increase the maximum, use the MAX_TESTS_PER_GENERATOR_SCENARIO environment variable. Read more about environment variables at https://assemblyline.suffolklitlab.org/docs/alkiln/writing/#env-vars.`
      )
    );
  }

  return { num_to_make, warnings, errors };
}


let all_Scenario_bodies_map = {};  // map for O^1 adding operation
function get_strs_from_1_Scenario({
  // scenario,
  // generator_lines,
  // num_to_make,
  // scenario_top,
  // gherkin_index_of_the_final_fore_Step

  scenario,
  generator_lines,
  file_lines_to_delete,  // TODO: Add to the function signature
  num_to_make,
  gherkin_index_of_the_final_fore_Step,
}) {
  /**
   * 
   * 
   * */

  let generated_lines = [];

  for ( let a_num of num_to_make ) {

    let unqiue_scenario_lines = [];

    let scenario_first_line_index = scenario.tags[0].location.line;
    let modified_tags = generator_lines[ scenario_first_line_index ] + `sdkfjlsd`;
    unqiue_scenario_lines.push( modified_tags );  // or not
    let keyword_line_index = scenario.location.line;  // i.e. `Scenario:` or `Scenario Outline:`
    for ( let tween_line of lines_between_tags_and_keyword ) {
      unqiue_scenario_lines.push( generator_lines[ tween_index ] );
    }
    unqiue_scenario_lines.push( keyword_line_text + `mods` );

    // Description and comments and blank lines
    let first_step_index = scenario.steps[0].location.line; // as_index()
    for ( let tween_line of lines_between_keyword_and_first_step ) {
      unqiue_scenario_lines.push( generator_lines[ tween_index ] );
    }

    let text = null;
    let last_unsaved_file_line_index = first_step_index;
    let possibly_not_unique_lines = [];
    while ( not_unique && tries < max_attempts ) {
      // Own loop? (Avoid pulling out all non-unique lines)
      for ( let step of steps ) {

        if ( !is_constraints_step ) { continue; }

        let constr_start_index = step.location.line;
        for ( let tween of lines_between_last_unsaved_line_and_this_one_including_last_unsaved_line ) {
          if ( file_lines_to_delete.includes( tween_index ) ) { continue; }
          possibly_not_unique_lines.push( generator_lines[ tween_index ] );
        }

        // Modify constraints step and copy it over along with comment lines in a similar way
        get_random_table({});

        last_unsaved_file_line_index = last_table_row_line_index;
      }  // Ends loop for all steps

      text = possibly_not_unique_lines.join(`\n`);
      if ( !all_Scenario_bodies_map[ text ] ) {
        is_unique = true;
        all_Scenario_bodies_map[ text ] = true;
      }
    }  // ends while generated scenario is not unique

    /** Get the lines after the end of the final constraints Step  */
    let final_lines = [];
    let last_index = generator_lines.length - 1;
    for ( let tween of last_unsaved_file_line_index ) {
      if ( file_lines_to_delete.includes( tween_index ) ) { continue; }
      final_lines.push( generator_lines[ tween_index ] );
    }

    // If text is valid
    text = [ ...unqiue_scenario_lines, ...possibly_not_unique_lines, ...final_lines ].join(`\n`);
    generated_lines.push( text );
  }

  return {
    generated_Scenarios_text: generated_lines.join(`\n\n`),
    // and other stuff
  };







  // let misfits = new Misbehaviors();

  // let strs_from_this_Scenario = [];
  // for ( let test_num = 1; test_num <= num_to_make; test_num++ ) {

  //   // Try to make one unique test
  //   let num_attempts = 0;
  //   let max_attempts = 10;
  //   let is_unique = false;
  //   while ( !is_unique && num_attempts < max_attempts ) {

  //     num_attempts++;

  //     let {
  //       body: one_test_body,  // -> text_of_Steps
  //       warnings: body_warnings, errors: body_errors
  //     } = get_Scenario_body_str({
  //       scenario,
  //       file_lines,
  //       gherkin_index_of_the_final_fore_Step
  //     });
  //     misfits.add({ warnings: body_warnings, errors: body_errors });
  //     if ( misfits.errors.length > 0 ) { continue; }  // May be row-specific

  //     // Check for uniqueness and add to map
  //     if ( all_Scenario_bodies_map[ one_test_body ] ) { continue; }
  //     is_unique = true;
  //     all_Scenario_bodies_map[ one_test_body ] = true;

  //     // Add Scenario top to body
  //     let test_str = [ scenario_top, one_test_body ].join(`\n`);

  //     strs_from_this_Scenario.push( test_str );

  //   }

  //   if ( num_attempts >= max_attempts ) {
  //     // log the message we have elsewhere
  //     break;
  //   }

  // }

  // return { strs: strs_from_this_Scenario, ...misfits };

}


function try_to_get_one_unique_test({}) {}


function get_Scenario_body_str({
  scenario,
  file_lines,
  gherkin_index_of_the_final_fore_Step
}) {
  /** Return the string for the body of one test for the given Scenario.
   * 
   * The body doesn't include the keyword or description of the Scenario.
   * 
   * start_index = index of first line after the "fore-Steps" index
   * */
  let misfits = new Misbehaviors();  // -> misbehaviors

  /**
   * normal step (1)
   * normal step (2)
   * constraints step (3) (step text + 3 rows)
   * normal step (4)
   * constraints step (5)
   * normal step (6)
   * normal step (7)
   * 
   * xxx
   * get strings until constraints step 1 that make 1 string
   * string 1:
   *  normal step (1)
   *  normal step (2)
   * 
   * generate using constraints step 1
   * string 2:
   *  generated step (3) (step text + 3 rows) (keep index of the last line of this
   *  step?)
   * xxx
   * 
   * ## Most basic abstraction
   * 
   * file lines:
   * 0
   * 1
   * 2
   * 
   * Gherkin object steps:
   * { line: 1 }
   * { line: 2 }
   * { line: 3 }
   * 
   * Generated lines from original file lines
   * generated test 1
   * 0 copy
   * 1 copy
   * 2 copy
   * 
   * generated test 2
   * 0 copy
   * 1 copy
   * 2 copy
   * 
   * ## Add constraints Steps
   * 
   * file lines list (file lines index):
   * 0
   * 1
   * 2 And ALKiln makes tests with:
   * 3 | x | y |
   * 4 | z | w;; q;; r |
   * 5 | a | b;; c;; |
   * 
   * Gherkin object steps ;ost (Gherkin line number (correspond to file lines, off by 1)):
   * { line: 1 }
   * { line: 2 }
   * { line: 3, table_rows: [ { line: 4 }, { line: 5 }, { line: 6 } ]}
   * 
   * Generated lines from original file lines
   * generated test 1
   * 0 copy
   * 1 copy
   * 2 modified And I get to the end with:
   * 3 modified | x | y |
   * 4 modified | z | q |
   * 5 modified | a | b |
   * 
   * generated test 2
   * 0 copy
   * 1 copy
   * 2 modified And I get to the end with:
   * 3 modified | x | y |
   * 4 modified | z | w |
   * 5 modified | a | b |
   * 
   * ## Add fore Steps
   * 
   * file lines:
   * 0 Scenario: blah
   * 1 And ALKiln makes 5 tests
   * 2 And ALKiln makes tests with:
   * 3 | x | y |
   * 4 | z | w;; q;; r |
   * 5 | a | b;; c;; |
   * 
   * Gherkin object steps:
   * { line: 1 }
   * { line: 2 }
   * { line: 3, table_rows: [ { line: 4 }, { line: 5 }, { line: 6 } ]}
   * 
   * Generated lines from original file lines
   * generated test 1
   * 0 Scenario: blah
   * 2 modified And I get to the end with:
   * 3 modified | x | y |
   * 4 modified | z | q |
   * 5 modified | a | b |
   * 
   * generated test 2
   * 0 Scenario: blah
   * 2 modified And I get to the end with:
   * 3 modified | x | y |
   * 4 modified | z | w |
   * 5 modified | a | b |
   * 
   * final actual file:
   * 0 Scenario: blah (1/1)
   * 1 modified And I get to the end with:
   * 2 modified | x | y |
   * 3 modified | z | q |
   * 4 modified | a | b |
   * 5
   * 6 Scenario: blah (2/2)
   * 7 modified And I get to the end with:
   * 8 modified | x | y |
   * 9 modified | z | w |
   * 10 modified | a | b |
   * 
   * ## additional stuff
   * 
   * Additional lines, like empty lines, comments, etc. can be in between other
   *     lines, but will not be in the list of Gherkin scenario.steps
   * 
   * We don't care what line numbers things are on in the next file
   * */

  /** 
   * ## process:
   * 
   * - (`Feature` section not included here)
   * - *start of Scenario*
   * - get file line index after fore steps
   *   - get file line index of last "first Step" and add 1 ("1 And ALKiln makes
   *     5 tests" above)
   * - get file line index of first constraints Step from the Gherkin "step"
   * - copy the file lines between them into new file (inclusive of first,
   *   exclusive of last)
   * - *reached first constraints Step*
   * - generate a randomized Story Table Step. All comments and empty lines in
   *   that table are lost.
   * - *reached end of first constraints Step* Now how to get the next group of
   *   normal _lines_?
   * - get file index of last row in _constraints_ Step table from the Gherkin
   *   "row". It doesn't matter if the generated Step is the same number of
   *   lines as the constraints Step or not. We're just looking at what happens
   *   after the constraints Step.
   * - get to next constraints Step or end
   *   - ensure that end includes any potential table rows in the last Step
   *   - WHAT THE HECK DOES AN `Examples` OBJECT LOOK LIKE IN GHERIN AST? IS IT
   *     JUST ANOTHER STEP?
   * - *end of Scenario*
   * - get all file lines until next Scenario
   * - *next Scenario*
   * */

  

  // let first_normal_lines = file_lines.slice( scenario.steps[0].location.line );

  // let steps_strs = [ ...first_normal_lines ];
  // let previous_significant_starting_file_index = get_final_file_index_of_Step({ step });  // includes rows

  // We know that the fore-Steps are and so we know what to look for to find their final line
  let final_fore_Step = scenario.steps[ gherkin_index_of_the_final_fore_Step ];
  let file_index_of_the_final_fore_Step = get_file_index_of_next_line({ location_obj: final_fore_Step });
  // names: previous_copy_start_index
  let previous_significant_starting_file_index = file_index_of_the_final_fore_Step;
  `Maybe save step that wasn't turned into a string`
  for ( let step_i = 0; step_i < scenario.steps.length; step_i++ ) {

    let step = scenario.steps[ step_i ];

    // ==== v3 ===
    `end of prev significant step till start of current significant step`

    // ==== v2 ====
    if ( !constraints_Step ) { continue; }

    let final_copy_end_index = get_file_index_of_next_line({ location_obj: step });


    // let {
    //   constraints_Step,
    //   warnings: constraints_warnings,
    //   errors: constraints_errors
    // } = get_constraints_Step2({ step, scenario });
    // misfits.add({ warnings: constraints_warnings, errors: constraints_errors });
    // if ( misfits.errors.length > 0 ) { break; }

    // if ( constraints_Step === null ) {
    //   let step_str = get_normal_Step_str({
    //     steps: scenario.steps,
    //     current_step_index: step_i,
    //     file_lines
    //   });
    //   console.log( `step_str`, step_str );
    //   steps_strs.push( step_str );
    // }

    // ==== v1 ====

    // let {
    //   ids: final_page_ids,
    //   warning: ids_warnings,
    //   errors: ids_errors
    // } = get_final_ids({ step_text: constraints_Step.text });
    // misfits.add({ warnings: ids_warnings, errors: ids_errors });
    // if ( final_page_ids === null ) { continue; }

    // let {
    //   story_tables: generated_story_tables_strs,
    //   warnings: story_tables_warnings,
    //   errors: story_tables_errors
    // } = get_unique_Story_Tables_strings({
    //   num_to_generate,
    //   ids: final_page_ids,
    //   step: constraints_Step
    // });
    // misfits.add({ warnings: story_tables_warnings, errors: story_tables_errors });

    // /** Stop returning warnings here. */

    // let { warnings_Step, errors: warning_step_errors } = get_warnings_Step({
    //   warnings: misfits.warnings,
    //   step_text: constraints_Step.text
    // });
    // misfits.add({ errors: warning_step_errors });
    
    // // The Scenario top and bottom will wrap every generated Story Table for
    // //    this generator Scenario
    // let all_scenarios_top = get_pre_constraints({
    //   generator_Scenario,
    //   constraints_Step,
    //   generator_lines,
    //   has_warnings: misfits.warnings.length > 0
    // });
    // let all_scenarios_bottom = get_post_constraints({
    //   next_Scenario: (scenario_objs[ scenario_obj_i + 1 ] || {}).scenario,
    //   constraints_Step,
    //   generator_lines
    // });

    // let generated_Scenarios_str = get_generated_Scenarios_str({
    //   all_scenarios_top,
    //   warnings_Step,
    //   generator_id: scenario_obj_i,
    //   story_tables: generated_story_tables_strs,
    //   all_scenarios_bottom
    // });
  }

}


function get_constraints_Step2({ step }) {

  // Examples of constraints Steps
  // And ALKiln tests can get to ["end"] when I pick from:
  // And the ALKiln test can get to one of "end1", "end 2", or "end-3" with:

  return {
    constraints_Step: null,
    warnings: [],
    errors: []
  };
}


function get_normal_Step_str({ steps, current_step_index, file_lines }) {
  /** Return a normal Step from the generator file
   * 
   * */
  console.log( `step index:`, current_step_index, `num steps:`, steps.length );
  let step_start_file_index = as_index( steps[ current_step_index ].location.line );
  let next_step_file_index = as_index( steps[ current_step_index + 1 ].location.line );

  let step_text_file_lines = file_lines.slice( step_start_file_index, next_step_file_index );
  let step_str = step_text_file_lines.join(`\n`);

  return step_str;
}


function get_file_index_of_next_line({ location_obj }) {
  /** Returns the file index of the line that comes after a Gherkin object with
   *     a `location`. A file index is the index in the generator file. */
  return location_obj.location.line;
}


function get_final_file_index_of_constraints_or_fore_Step({ step }) {
  /** Returns the index of the last possible item in a Gherkin Step object. That
   *     includes the file index of the last row in a `dataTable`.
   * 
   * Research: How to get the final row of a Step with a multi-line string?
   * 
   * Answer: You can't. You'd have to find the next line in all the items in the
   *     AST. Maybe loop through whole AST and find the next `line` value that
   *     appears after the Step value. Unless there's a dataTable with rows.
   * 
   * Research: How to get the final row of an `Examples` block?
   * Answer: `scenario.examples` then `.tableHeader.cells` or `.tableBody.cells`
   *     Maybe we need to go back to just parsing strings. That would make the
   *     explanation easier too... On the other hand, we have to account for
   *     other details, like empty lines or comment lines or who knows what else
   * 
   * Research: When there's a repeated line in the Story Table, do we use the
   *     first line we find or the last one? Then make the behavior in here
   *     match that behavior.
   * 
   * Research: How do find the line of the end of a Scenario considering a final
   *     Step could be a multi-line quote or an examples table.
   * */
  if ( !step.dataTable ) { return as_index( step.location.line ); }
  let rows = step.dataTable.rows;
  return as_index(rows[ rows.length - 1 ]);
}


function scenario_description_for_logs({ scenario }) {
  /** Combines metadata to return a fuller description of the Scenario
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - Gherkin AST `scenario` object
   * 
   * @returns {string} - Description of the Scenario
   * */
  let description = `line ${ scenario.location.line }: "${ scenario.name }"`;
  if ( scenario.tags.length > 0 ) {
    description += `, ${ scenario.tags.join(` `) }`;
  }

  return description;
}


function add_Feature_randomization_indicators({ feature={}, generator_lines=`` }) {
  /** Mutates `generator_lines`. Modifies the tag and name of the Feature section.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.feature - Gherkin AST `feature` object
   * @param {[string]} obj.generator_lines - Text of the generator file as a
   *     list
   *
   * @returns {undefined}
   * */
  let feature_index = as_index( feature.location.line );
 
  let tag_indicator = `@alkiln @generated @randomized @constraints`;
  let name_indicator = `(generated by ALKiln)`;
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
   * @returns {[object]} rtn.constraints_Steps - 0 or more constraints Steps in
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
      let error = log.error({ code: `ALK0239`, context: `generating files`, }, msg );
      errors.push( new Error( error ));

    } else if ( possible_constraints_Step.dataTable.rows.length === 1 ) {

      let msg = `There is only a header row in the **table** of the constrained random answers Step in the Scenario at line ${ generator_Scenario.location.line } - "${ generator_Scenario.name }"`;
      let error = log.error({ code: `ALK0242`, context: `generating files`, }, msg );
      errors.push( new Error( error ));

    }

  }  // ends for every step

  let num_Steps_found = constraints_Steps.length;

  if ( num_Steps_found > 1 ) {
    let msg = `A generator Scenario can only have 1 constraints Step. The Scenario at line ${ generator_Scenario.location.line } has ${ num_Steps_found } constraints Steps. The Scenario description: "${ generator_Scenario.name }"`
    let error = log.error({ code: `ALK0240`, context: `generating files`, }, msg );
    return { constraints_Step: null, errors: [ ...errors, new Error( error )] };
  }

  if ( num_Steps_found === 0 ) {
    // TODO: link to docs for the right syntax
    let msg = `The generator Scenario is missing a constrained random answers Step. Is there a typo in the Step? The Scenario starts at line ${ generator_Scenario.location.line } - "${ generator_Scenario.name }"`;
    let error = log.error({ code: `ALK0241`, context: `generating files`, }, msg );
    return { constraints_Step: null, errors: [ ...errors, new Error( error )] };
  }

  return { constraints_Step: constraints_Steps[0], warnings, errors };
}


// // Tests to find the step
// // TODO: Consider adding "pick" and "choose" as alternatives for "constrain"
// const CONSTRAIN_REGEX = /constrain/i;  // constrained/constraint/constraints
// const RAND_REGEX = /rand/i;
// const GENERAT_REGEX = /generat/i;  // generate/generates/generated/generating
// const MAKE_REGEX = /mak|mad/i;  // make/makes/made/making
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
                                 || GENERAT_REGEX.test( step.text )
                                 || MAKE_REGEX.test( step.text )
                            );
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
   * @returns {[str]} rtn.constraints_Steps - 0 or more Story Tables (see docs).
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

    let generator_num = generator_id + 1;
    let scenario_num = table_i + 1;
    let total_scenarios = story_tables.length;
    let scenario_tag = `generator${ generator_num }_scenario${ scenario_num }_of_${ total_scenarios }`;
    let with_tag = all_scenarios_top.replaceAll( ID_PLACEHOLDER, scenario_tag );
    let random_top = with_tag.replaceAll( SCENARIO_COUNT_PLACEHOLDER, `${ scenario_num } of ${ total_scenarios }` );

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


let SCENARIO_COUNT_PLACEHOLDER = `ALKILN_GENEREATED_SCENARIO_COUNT_PLACEHOLDER`;
function get_pre_constraints({
  generator_Scenario,
  constraints_Step,
  generator_lines,
  has_warnings
}) {
  /** Return the Scenario text that comes before the first constraints Step.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.generator_Scenario - AST of the Scenario
   * @param {object} obj.constraints_Step - AST of the constraints Step
   *     Step
   * @param {[string]} obj.generator_lines - List of lines from the generator
   *     file
   * @param {boolean} obj.has_warnings - `true` if generating the Scenario
   *     created warnings
   *
   * @returns {string} - Scenario text that comes before the first constraints
   *     Step
   * */
  // Use a shorter name as there are a lot of long lines of code
  let lines = generator_lines;
  set_tags_and_description({ scenario: generator_Scenario, lines, has_warnings });
  let start_line_num = get_Scenario_start_line_num({ scenario: generator_Scenario });
  let top_start_index = as_index( start_line_num );

  let top_end_index = get_index_before({ line_num: constraints_Step.location.line });

  // Turn the list of lines for the pre-constraints section of the Scenario into
  //    a text block
  let scenario_top_text = lines.slice(
    top_start_index,
    top_end_index + 1  // `slice` excludes the terminal number
  ).join(`\n`);

  return scenario_top_text;
};


function set_tags_and_description({ scenario, lines, has_warnings }) {
  /** Mutate the file lines to add placeholders for scenario text that will
   *    show it is a generated test and give it unique identifiers.
   * 
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - AST of a Gherkin scenario
   * @param {object} obj.lines - File text lines to mutate with the new text
   * @param {object} obj.has_warnings - `true` if the Scenario creation caused
   *     warning messages
   * 
   * @returns {undefined}
   * */

  /**
   * Add ALKiln tags by mutating the tag line if it exists. If not, mutate the
   *     keyword/description line by adding ALKiln's tags above the existing
   *     text.
   * */
  let pre_description = ``;

  let alkiln_tags = [ `@${ ID_PLACEHOLDER }` ];
  if ( has_warnings ) { alkiln_tags.push(`@alkiln_warning`); }

  if ( scenario.tags.length > 0 ) {
    // Mutate the tags line to add new tags
    let tags_index = as_index( scenario.tags[0].location.line );
    let new_tags = [ lines[ tags_index ], ...alkiln_tags ];
    lines[ tags_index ] = new_tags.join(` `);

  } else {
    // Add an artificial new line with alkiln's tags
    pre_description = `${ alkiln_tags.join(" ")}\n`;
  }

  let description_index = as_index( scenario.location.line );
  let new_description = `${ lines[ description_index ] } (${ SCENARIO_COUNT_PLACEHOLDER })`;
  // Potentially mutate the new_description line
  lines[ description_index ] = `${ pre_description }${ new_description }`;
};


function get_post_constraints({ next_Scenario, constraints_Step, generator_lines }) {
  /** Return the Scenario text that comes after the last constraints Step.
   *
   * @param {object} obj - Named arguments
   * @param {object | undefined} obj.next_Scenario - AST of the Scenario after this Scenario
   * @param {object} obj.constraints_Step - AST of the constraints Step
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


// const CAPTURE_NUMBERS_REGEX = /(\d+)/g;
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
  let user_num = null;
  let warnings = [];
  let errors = [];
  let number_matcher = step_text.match( CAPTURE_NUMBERS_REGEX );

  /** No numbers */
  if ( number_matcher === null ) {
    warnings.push(
      log.warn({ code: `ALK0237`, context: `generating files`, },
        `A constrained random answers Step is missing the number of tests to generate. ALKiln will create 1 test. The Step:\n${ step_text }`
      )
    );
    user_num = 1;
  }

  /** Too many numbers */
  if ( number_matcher && number_matcher.length > 1 ) {
    // Some feedback indicated using the last number makes more sense to people
    //    than the first
    user_num = parseInt( number_matcher[ number_matcher.length - 1 ]);
    warnings.push(
      log.warn({ code: `ALK0238`, context: `generating files`, },
        `This constrained random answers Step is ambiguous because it has more than 1 number. ALKiln will use the last number the author gave ("${ user_num }"). The Step:\n${ step_text }`,
      )
    );
    
  }

  /** Happy path */
  if ( number_matcher && !user_num ) {
    user_num = parseInt( number_matcher[ 0 ]);
  }

  let num_to_generate = Math.min(
    session_vars.get_max_tests_per_generator_scenario(),
    user_num
  );

  if ( num_to_generate !== user_num ) {
    warnings.push(
      log.warn({ code: `ALK0253`, context: `generating files`, },
        `The author asked to generate ${ user_num } tests, but maximum allowed is ${ num_to_generate }. If you want to increase the maximum, use the MAX_TESTS_PER_GENERATOR_SCENARIO environment variable. Read more about environment variables at https://assemblyline.suffolklitlab.org/docs/alkiln/writing/#env-vars.`
      )
    );
  }

  return { num_to_generate, warnings, errors };
}


function get_warnings_Step({ warnings = [], step_text }) {
  /** Returns the text for any warnings that need to be added to the Scenario
   * 
   * @param {object} obj - Named arguments
   * @param {[string]} obj.warnings - 0 or more warning messages
   * @param {string} obj.step_text - Constraints Step text (to match indent)
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
  new_warnings_lines.push(`${ indent }Then ALKiln warns the author about a generator problem with:`);
  new_warnings_lines.push(`${ indent }  """`, `${ indent }  ----- Generator file warning -----`);

  for ( let warning of warnings ) {
    let warning_lines = warning.split(`\n`);
    for ( let warning_line of warning_lines ) {
      new_warnings_lines.push(`${ indent }  ${ warning_line }`);
    }
  }

  new_warnings_lines.push(`${ indent }  -----`, `${ indent }  """`);

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
    let error = log.error({ code: `ALK0245`, context: `generating files`, },
      missing_ids_msg
    );
    errors.push( new Error( error ));
  }

  return { ids, warnings, errors };
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
   * TODO: Add a warning in the docs that Gherkin ignores whitespace at the
   *    start and end of columns in a table. Discuss letting authors wrap
   *    content in backticks or some other delimiter.
   *
   * @returns {string} - One of the possible answers
   * */
  let choices = answers_str.replace(`;; `, `;;`).split(`;;`);
  if ( choices.includes(``) ) {
    log.debug({ code: `ALK0244`, context: `generating files`, level: `warn` },
      `**Quiet warning** - One of the constrained random answer choices in a row in this table is "". It could be on purpose or it could be a misplaced separator (";;"). The choices: "${ answers_str }"`
    );
  }
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
