const fs = require('fs');
const fg = require(`fast-glob`);

const globals = require(`../globals`);
const session_vars = require('../utils/session_vars');
const get_Gherkin_AST = require(`./get_Gherkin_AST`);
const get_error_stacks = require(`../utils/get_error_stacks`);

/**
 * TODO: We might give various levels of categories for warnings. For example,
 *     severe warnings (like "will skip the random test") vs. slight warnings
 *     (like "missing number in constraints random test")
 * TODO: Post-MVP, don't repeat tests that the author has already created
 * TODO: Post-MVP, write Steps that warn about fore-Steps and constraints Steps
 *     when they appear in a regular test. It probably means someone named the
 *     file incorrectly.
 * Discuss: Require author to use "Generator Scenario:" as they keyword (Also
 *     "Generator Scenario Outline:") (or "Scenario Generator", maybe harder to
 *     scan) for 2 reasons. 1. Gets the vocab of "generator" in early (though
 *     that doesn't match "constraints" Step, which is a whole other language
 *     problem we haven't solved yet.) 2. Saying "MAX_RANDOM_TESTS_PER_SCENARIO"
 *     is confusing when "Scenario" means different things - a generator
 *     Scenario and a regular Scenario.
 * Discuss: Now that Log is less fragile and duplicated, shall we create a new
 *     Log instance in here?
 * Discuss: consider debug types that are for authors. Sort of like warnings,
 *     but less loud.
 * Discuss: Log.error that just returns a string formatted like an error with
 *     the right icon, etc, without logging it to the console. We can _sort_ of
 *     do that now, but without the icon.
 * Discuss: If/when we allow multiple Scenarios, research how we find the end
 *     of a Scenario that ends in an `Example`.
 * */

let log = null;
const FOLDER_NAME = globals.generated_files_folder_name;

module.exports = class TestGenerator {
  constructor() {
    this.all_Scenarios_bodies_map = {};  // map for O^1 adding operation
  }

  create({ sources_path, logger }) {
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
     * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
     *
     * Details:
     * - Copy sections of text from the old file
     * - Use the Gherkin parser's AST of the constraints Step in each Scenario
     *   to generate Story Tables
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
        `ALKiln is trying to generate the constrained random answers tests for "${ generator_path }"`
      );

      let { new_contents, errors: parse_errors } = this.parse_file({
        file_text,
        generator_path
      });
      all_errors.push( ...parse_errors );

      if ( new_contents ) {
        new_files_strings.push( new_contents );
      }
    }

    log.debug({ code: `ALK0265`, context: `generating files`, }, `Constrained random answers tests:`, new_files_strings );

    let tests_path = `${ sources_path }/${ FOLDER_NAME }`;
    let artifacts_path = `${ session_vars.get_artifacts_path_name() }/${ FOLDER_NAME }`;
    save_files({ tests_path, artifacts_path, file_strings: new_files_strings });

    log.info({ code: `ALK0269`, context: `generating files`, }, `Tried to save generated files to ${ artifacts_path }` );

    return { new_strings: new_files_strings, errors: all_errors };
  }

  parse_file({ file_text, generator_path, logger }) {
    /** Parse and return one file's contents
     *
     * Discuss: If there's a Gherkin parser error, log something more clear
     *    before re-throwing it?
     * 
     * Note: The generator file should be valid by the time it gets here.
     * 
     * @param {string} file_text - Full text of a generator feature file
     *
     * @returns {object} rtn - Named return values
     * @returns {null|str} rtn.new_contents - `null` or string for the new file
     * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
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

    let { new_contents, errors: generating_errors } = this.get_new_file_contents({ doc_AST, file_text, generator_path });
    if ( generating_errors.length > 0 ) {
      return { new_contents: null, errors: generating_errors };
    }

    let { errors: generated_parsing_errors } = validate_syntax({ file_text: new_contents, generator_path });
    if ( generated_parsing_errors.length > 0 ) {
      let syntax_error = log.error({ code: `ALK0264`, context: `generating files`, before: `\n\n`, },
        `The .feature file ALKiln generated from "${ generator_path }" had Gherkin syntax error(s) ALKiln did not anticipate. If you have a moment, we would love you to send us your debug.txt.\n`,
        ...get_error_stacks({ errors: generated_parsing_errors })
      );
      return { new_contents, errors: [new Error( syntax_error )] };
    }

    return { new_contents, errors };
  }


  get_new_file_contents({ doc_AST={}, file_text=``, generator_path }) {
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
     * @returns {null|string} - The text (Feature, Scenarios, etc) for the new
     *     file
     * 
     * @returns {object} rtn - Named return values
     * @returns {null|str} rtn.new_contents - `null` or string for new file
     * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
     * */

    // `doc_AST.feature.children` seem to always be defined by here
    let scenario_objs = doc_AST.feature.children;
    if ( !scenario_objs[0] ) {
      let syntax_error = log.error({ code: `ALK0235`, context: `generating files`, before: `\n\n`, },
        `The author's generator .feature file at "${ generator_path }" may be missing its Scenarios.`
      );
      return { new_contents: null, errors: [new Error( syntax_error )]};
    }
    // `scenario_objs[0].scenario` seems to always be defined by here

    if ( scenario_objs.length > 1 ) {
      let too_many_scenarios = log.error({ code: `ALK0277`, context: `generating files`, },
        `A generator file can only have 1 generator Scenario. This one has ${ scenario_objs.length }.`
      );
      return { new_contents: ``, errors: [new Error( too_many_scenarios )] };
    }

    let generation_errors = [];

    let generator_lines = file_text.split(`\n`);

    let feature_text = get_Feature_text({ feature: doc_AST.feature, generator_lines });

    let { scenarios_strings, errors: scenarios_errors } = this.get_new_Scenarios_strs({
      scenario_objs,
      generator_lines
    });
    generation_errors.push( ...scenarios_errors );


    let count_msg = `ALKiln generated ${ scenarios_strings.length } Scenario or Scenarios`;

    if ( scenarios_strings.length === 0 ) {
      let error = log.error({ code: `ALK0261`, context: `generating files`, }, count_msg );
      generation_errors.push( new Error( error ));
      return { new_contents: null, errors: generation_errors };
    }

    log.info({ code: `ALK0262`, context: `generating files`, }, count_msg );

    let scenarios_combined = scenarios_strings.join(`\n\n`);
    let new_file_contents = [ feature_text, scenarios_combined ].join(`\n`);

    if ( !new_file_contents ) {
      // Fallback. Haven't been able to trigger this
     let msg = `Unable to generate a constrained random answers file from "${ generator_path }". See above for warnings and errors.`;
     let error = log.error({ code: `ALK0263`, context: `generating files`, }, msg );
     return { new_contents: null, errors: [ new Error( error )] }; 
    }

    return { new_contents: new_file_contents, errors: generation_errors };
  }


  get_new_Scenarios_strs({ scenario_objs, generator_lines }) {
    /** Return all the strings of the generated Scenarios and any Errors we ran
     *     into.
     * 
     * @param {object} obj - Named arguments
     * @param {object} obj.scenario_objs - 0 or more Gherkin Scenario objects
     *     (which are generators)
     * @param {[str]} obj.generator_lines - List of lines in the generator file
     * 
     * Starting here, functions' return values should now include lists of
     *     warning messages. If a Scenario gets any warnings, we will add a
     *     "warnings" Step to that Scenario or to the file. Implement over time.
     * 
     * We only allow one Scenario per file now, but in future we can allow more.
     * 
     * @returns {object} rtn - Named return values
     * @returns {[str]} rtn.scenarios - 0 or more Scenario strings
     * @returns {[str]} rtn.warnings - 0 or more warning messages
     * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
     * */
    let errs_n_warns = new Misbehaviors();

    let strs_for_all_new_Scenarios = [];
    // Soon we want to be able to handle multiple generator Scenarios per file
    for ( let scenario_obj_i = 0; scenario_obj_i < scenario_objs.length; scenario_obj_i++ ) {

      errs_n_warns.reset_warnings();
      /** Start returning warnings here. */
      let generator_Scenario = scenario_objs[ scenario_obj_i ].scenario;

      let description = scenario_description_for_logs({ scenario: generator_Scenario });
      log.info({ code: `ALK0236`, context: `generating files`, },
        `Generating files for Scenario at ${ description }`
      );

      let {
        num_to_make,
        file_lines_to_delete
      } = errs_n_warns.add(
        get_fore_Steps({ scenario: generator_Scenario })
      );
      if ( errs_n_warns.errors.length > 0 ) { continue; }

      let { new_Scenarios_text } = errs_n_warns.add(
        this.get_1_text_block_of_all_new_Scenarios_from_1_generator_Scenario({
          scenario: generator_Scenario,
          generator_lines: generator_lines,
          file_lines_to_delete,
          num_to_make
        })
      );
      if ( errs_n_warns.errors.length > 0 ) { continue; }

      if ( errs_n_warns.warnings.length > 0 ) {
        new_Scenarios_text = add_warnings_Scenario({
          scenarios_str: new_Scenarios_text, warnings: errs_n_warns.warnings
        });
      }
      log.debug({ code: `ALK0260`, context: `generating files`, }, `new_Scenarios_text WITH warnings:\n`, new_Scenarios_text );

      strs_for_all_new_Scenarios.push( new_Scenarios_text );
    }  // ends for every scenario_container

    return { scenarios_strings: strs_for_all_new_Scenarios, ...errs_n_warns };
  }


  get_1_text_block_of_all_new_Scenarios_from_1_generator_Scenario({
    scenario,
    generator_lines,
    file_lines_to_delete,
    num_to_make,
  }) {
    /** Return a list of 0 or more strings of tests generated from 1 generator
     *     Scenario Gherkin object.
     * 
     * @param {object} obj - Named arguments
     * @param {object} obj.scenario - Gherkin Scenario object
     * @param {[str]} obj.generator_lines - Lines in the generator file
     * @param {object} obj.file_lines_to_delete - Lines to avoid adding to the
     *     new file
     * @param {object} obj.num_to_make - Number of tests to make
     * 
     * @returns {object} rtn - Named return values
     * @returns {string} rtn.new_Scenarios_text - Single string containing all
     *     the newly generated Scenarios
     * @returns {[str]} rtn.warnings - 0 or more warning messages.
     * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
     * */
    let misfits = new Misbehaviors();

    let indexes_to_delete = file_lines_to_delete;

    let new_test_bodies = [];
    let actual_test_num = 1;
    for ( let test_num_attempt = 1; test_num_attempt <= num_to_make; test_num_attempt++ ) {
      misfits.reset_warnings();

      // Example of unique text: "(1 of 2)"
      let { unqiue_Scenario_lines } = misfits.add(
        get_definitely_unqiue_Scenario_lines({
          scenario,
          generator_lines,
          test_num: actual_test_num,
          indexes_to_delete
        })
      );

      if ( scenario.steps.length === 0 ) { break; }  // Discuss: Can this happen here?

      let { middle_lines, final_significant_Step_index } = misfits.add(
        this.try_to_get_one_unique_middle({
          scenario, generator_lines, indexes_to_delete,
        })
      );
      if ( misfits.errors.length > 0 ) { break; }
      if ( middle_lines.length === 0 ) { continue; }

      let { final_lines } = misfits.add(
        get_final_lines({
          generator_lines, final_significant_Step_index, indexes_to_delete
        })
      );
      if ( misfits.errors.length > 0 ) { break; }

      new_test_bodies.push( put_together_new_test_text({
        starting_lines: unqiue_Scenario_lines,
        middle_lines,
        final_lines,
        warnings: misfits.warnings
      }) );

      actual_test_num++;
      // Discuss: Break if a test was skipped

    }  // End for desired num_tests

    if ( misfits.errors.length > 0 ) {
      return { new_Scenarios_text: ``, ...misfits };
    }

    let got_fewer_tests_than_desired = new_test_bodies.length < num_to_make;
    if ( got_fewer_tests_than_desired ) {
      let warn_too_few = log.warn({ code: `ALK0258`, context: `generating files generator-scenario-level`, },
        `ALKiln could only make ${ new_test_bodies.length } unique tests out of the ${ num_to_make } the author wanted for this Scenario:\n      ${ scenario_description_for_logs({ scenario }) }`,
      )
      // Discuss: Should we add more structure to Misbehaviors to give them
      //     context levels (Feature, generator Scenario, generated Scenario)
      misfits.add({ warnings: [ warn_too_few ] });
    }

    let new_Scenarios_text = new_test_bodies.join(`\n\n`);
    new_Scenarios_text = add_total_tests({
      scenario_group_str: new_Scenarios_text, num_tests: new_test_bodies.length
    });

    log.debug({ code: `ALK0259`, context: `generating files`, }, `new_Scenarios_text without warnings:\n`, new_Scenarios_text );

    return { new_Scenarios_text, ...misfits };
  }

  try_to_get_one_unique_middle({
    scenario,
    generator_lines,
    indexes_to_delete
  }) {
    /** Return data for new lines that should be a unique new test body.
     * 
     * @param {object} obj - Named arguments
     * @param {object} obj.scenario - Gherkin Scenario object
     * @param {[str]} obj.generator_lines - Lines in the generator file
     * @param {[int]} obj.indexes_to_delete - Lines to avoid adding to the new
     *     file
     * 
     * @returns {object} rtn - Named return values
     * @returns {[str]} rtn.middle_lines - 0 or more strings for the new test
     * @returns {int} rtn.final_significant_Step_index - Generator file index
     *     for the final found significant Step
     * @returns {[str]} rtn.warnings - 0 or more warning messages.
     * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
     * */
    let misfits = new Misbehaviors();

    log.debug({ code: `ALK0248`, context: `generating files`, }, `Trying to get unique middle` );

    let keyword_index = get_keyword_index({ scenario });

    // Try to make one unique test
    // Accumulators and state trackers we'll use later
    let attempt_lines = [];
    let prev_significant_Step_index = keyword_index;
    function clear_inner_state() {
      /** Reset scope variables to build new unique test or clear out values */
      attempt_lines = [];
      prev_significant_Step_index = keyword_index;
    };

    // Loop management
    let attempts = { count: 0, max: 10 };
    let is_unique = false;
    while ( !is_unique && attempts.count < attempts.max ) {

      attempts.count++;
      misfits.reset_warnings();

      ({ attempt_lines, prev_significant_Step_index } = misfits.add(
        get_possibly_unique_lines_data({
          scenario,
          generator_lines,
          indexes_to_delete
        })
      ));

      if ( misfits.errors.length > 0 ) {
        clear_inner_state();  // Clear data before leaving loop
        break;
      }

      let one_test_body = attempt_lines.join(`\n`);
      log.debug({ code: `ALK0255`, context: `generating files` }, `Generated test:\n${ one_test_body }` );

      let is_duplicate = this.all_Scenarios_bodies_map[ one_test_body ];
      if ( is_duplicate ) {
        log.debug({ code: `ALK0256`, context: `generating files` }, `Test is a duplicate on attempt ${ attempts.count }.` );
        if ( attempts.count >= attempts.max ) { clear_inner_state(); }
        continue;
      }

      // Otherwise, add to the global map and finish
      log.debug({ code: `ALK0257`, context: `generating files` }, `This test is unique on attempt number ${ attempts.count }.` );
      is_unique = true;
      this.all_Scenarios_bodies_map[ one_test_body ] = true;

    }  // ends while generated scenario is not unique or pass max attempts

    return {
      middle_lines: attempt_lines,
      final_significant_Step_index: prev_significant_Step_index,
      ...misfits
    };
  };

};  // Ends TestGenerator {}


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
    let syntax_error = log.error({ code: `ALK0232`, context: `generating files`, before: `\n\n`, },
      `The author's generator .feature file at "${ generator_path }" has Gherkin syntax error(s). You might see more warnings above or below this one.\n`,
      ...get_error_stacks({ errors: generator_errors })
    );
    return { doc_AST: null, errors: [new Error( syntax_error )] };
  }

  // We have never been able to trigger `!doc_AST`

  if ( !doc_AST.feature ) {
    let feature_error = log.error({ code: `ALK0233`, context: `generating files`, before: `\n\n`, },
      `The author's generator .feature file at "${ generator_path }" needs to include the \`Feature\` keyword.`
    );
    return { doc_AST: null, errors: [new Error( feature_error )] };
  }

  // Should not get here
  let unknown_error = log.error({ code: `ALK0234`, context: `generating files`, before: `\n\n`, },
    `The author's generator .feature file at "${ generator_path }" ran into an unanticipated error when ALKiln tried to parse it. If you have a moment, we would love for you to send us your debug.txt.`
  );
  return { doc_AST, errors: [new Error( unknown_error )] };
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


function add_Feature_randomization_indicators({ feature={}, generator_lines=`` }) {
  /** Mutate `generator_lines`, modify the tag and name of the Feature section.
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


function get_Scenario_start_line_num({ scenario }) {
  /** Returns the Gherkin line number where the Scenario really starts. That
   *     could be where the tags are or where the Scenario keyword is.
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


function get_fore_Steps({ scenario }) {
  /** Get Steps that must come in the first section of any kind of Scenario that
   *     ALKiln manipulates before running the cucumber tests. Does this really
   *     need to be abstracted for possible future "first Step"s already?
   * 
   * Discuss: If a "first" Step appears multiple times, should that be an error
   *     or a warning?
   * 
   * This code may be premature. We currently only have one type of fore-Step,
   *     though the author is allowed to make multiple of that kind without
   *     causing an error.
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - Gherkin AST `scenario` object
   * 
   * @returns {object} rtn - Named return values
   * @returns {int} rtn.num_to_make - Number of tests to generate
   * @returns {[int]} rtn.file_lines_to_delete - Which lines in the file to
   *     exclude when creating the new Scenario
   * @returns {[str]} rtn.warnings - 0 or more warning messages.
   * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
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
    let { num_to_make } = misfits.add(
      get_number_of_Scenarios_to_generate2({
        step,
        prev_num_to_make: first_vals.num_to_make
      })
    );
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

  let there_were_no_fore_Steps = last_valid_fore_step_index === -1;
  let description = scenario_description_for_logs({ scenario });
  if ( there_were_no_fore_Steps ) {
    misfits.add({ errors: [
      new Error( log.error({ code: `ALK0241`, context: `generating files`, },
        `A generator Scenario's first Step must say how many constrained random answers tests to make. The generator Scenario on line ${ scenario.location.line } is missing that Step. The Scenario's description is:\n${ description }`
      ) )
    ] });
  } else {
    log.debug({ code: `ALK0242`, context: `generating files` },
      `The final "first Step" Gherkin index was ${ last_valid_fore_step_index }. The final file index of that Step was ${ as_index(steps[ last_valid_fore_step_index ].location.line) }. The Scenario description:\n${ description }`
    );
  }

  if ( first_vals.num_to_make ) {
    log.debug({ code: `ALK0243`, context: `generating files` },
      `Will try to make ${ first_vals.num_to_make } tests.`
    );
  }

  return {
    num_to_make: first_vals.num_to_make,
    file_lines_to_delete,
    ...misfits
  };
}


const ALKILN_REGEX = /ALKiln/i;
const CONSTRAIN_REGEX = /constrain/i;  // constrained/constraint/constraints
const RAND_REGEX = /rand/i;  // random/randomness/randomized
const GENERAT_REGEX = /generat|create/i;  // generate/generates/generated/generating/create/creates
const MAKE_REGEX = /make|made/i;  // make/makes/made/making
const CAPTURE_NUMBERS_REGEX = /(\d+)/g;
function get_number_of_Scenarios_to_generate2({ step, prev_num_to_make }) {
  /** Return null or a constraints Step.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.step - A valid constraints Step Gherkin object
   * @param {int|undefined} obj.prev_num_to_make - A previously found number
   *     if there was one, or `undefined`
   *
   * @returns {null|object} `null` or a constraints Step
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
      log.warn({ code: `ALK0237`, context: `generating files`, },
        `A generator Scenario has too many Steps that set the number of tests to make. ALKiln will use the final number Step it finds or calculates. The current Step:\n      ${ text }`
      )
    );
  }

  let number_matcher = text.match( CAPTURE_NUMBERS_REGEX );

  /** Missing number */
  if ( number_matcher === null ) {
    warnings.push( 
      log.warn({ code: `ALK0238`, context: `generating files`, },
        `A generator Scenario is missing the number of tests to make. ALKiln will now make 1 constrained random answers test. The current Step:\n      ${ text }`
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
      log.warn({ code: `ALK0239`, context: `generating files`, },
        `This constrained random answers Step is ambiguous because it has more than 1 number. ALKiln will now use the last number in the Step (${ user_num }). The Step:\n      ${ text }`,
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
      log.warn({ code: `ALK0240`, context: `generating files`, },
        `The author asked to make ${ user_num } tests, but maximum allowed is ${ num_to_make }. ALKiln will now make ${ num_to_make } tests. If you want to increase the maximum, use the MAX_TESTS_PER_GENERATOR_SCENARIO environment variable. Read more about environment variables at https://assemblyline.suffolklitlab.org/docs/alkiln/writing/#env-vars.`
      )
    );
  }

  return { num_to_make, warnings, errors };
}


function get_definitely_unqiue_Scenario_lines({
  scenario,
  generator_lines,
  test_num,
  indexes_to_delete
}) {
  /** Return the lines in the Scenario that will definitely be unique - they
   *     have counters and such.
   * 
   * Example of unique text: `(1 of 2)`
   * 
   * @param {object} obj - Named arguments
   * @param {Gherkin object} obj.scenario - Gherkin AST scenario object
   * @param {[str]} obj.generator_lines - Full list of strings from the
   *     generator file.
   * @param {int} obj.test_num - What number test this is out of all the tests
   *     we need to generate for this scenario
   * @param {[int]} obj.indexes_to_delete - Lines to avoid adding to the new
   *     file
   * 
   * @returns {object} rtn - Named return values
   * @returns {[str]} rtn.unqiue_Scenario_lines - As the name says
   * @returns {[str]} rtn.warnings - 0 or more warning messages.
   * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
   * */
  let misfits = new Misbehaviors();

  let unqiue_Scenario_lines = [];

  log.debug({ code: `ALK0244`, context: `generating files`, },
    `Trying to get get_definitely_unqiue_Scenario_lines`
  );

  let tags_index = get_tag_index({ scenario });
  unqiue_Scenario_lines.push( get_tag_text({
    generator_lines, tags_index, test_num
  }) );

  let keyword_index = get_keyword_index({ scenario });
  let keyword_text = get_keyword_text({
    generator_lines, keyword_index, test_num
  });
  
  let tags_tweens = [];
  if ( tags_index !== null ) {
    let { tweens } = misfits.add(
      get_tweens({
        end_index_of_prev: tags_index,
        start_index_of_next: keyword_index,
        generator_lines: generator_lines,
        indexes_to_delete
      })
    );
    tags_tweens = tweens;
  }

  unqiue_Scenario_lines.push( ...tags_tweens, keyword_text );

  log.debug({ code: `ALK0247`, context: `generating files`, },
    `Unique lines:`, unqiue_Scenario_lines
  );

  return { unqiue_Scenario_lines, ...misfits };
};


function get_tag_index({ scenario }) {
  /** Return the generator file index of the Scenario's tag line or null if the
   *     tag line is non-existent
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - Gherkin Scenario object
   * 
   * @returns {null|int} - null or tag line index
   * */
  if ( scenario.tags.length > 0 ) {
    return as_index( scenario.tags[0].location.line );
  }
  return null;
}


const TOTAL_TESTS_FOR_THIS_SCENARIO_PLACEHOLDER = `ALKILN_TOTAL_TESTS_PLACEHOLDER`;
const TOTAL_TESTS_REGEX = new RegExp( TOTAL_TESTS_FOR_THIS_SCENARIO_PLACEHOLDER, `g` );
const WARNING_TAG_PLACEHOLDER = `ALKILN_MAYBE_WARNING_TAG_PLACEHOLDER`;
function get_tag_text({ generator_lines=[], tags_index=null, test_num=1 }) {
  /** Edit or create the tag line of the new Scenario to include test-specific
   *     information
   * 
   * @param {object} obj - Named arguments
   * @param {[str]} obj.generator_lines - Full list of strings from the
   *     generator file.
   * @param {int} obj.tags_index - Index of the keyword line
   * @param {int} obj.test_num - Which iteration of the test this is
   * 
   * @returns {str} - New text for the tag line of the new Scenario
   * */
  let tags = [];
  if ( tags_index !== null ) {
    let tags_as_the_author_wrote_them = generator_lines[ tags_index ];
    tags.push( tags_as_the_author_wrote_them );
  }

  tags.push([ `@scenario${ test_num }_of_${ TOTAL_TESTS_FOR_THIS_SCENARIO_PLACEHOLDER }${ WARNING_TAG_PLACEHOLDER }` ]);
  return tags.join(` `);
}


// Note: `get_keyword_index()` is used repeatedly and thus is at the bottom


function get_keyword_text({ generator_lines=[], keyword_index=null, test_num=1 }) {
  /** Edit the text in the keyword line to include test-specific information.
   * 
   * @param {object} obj - Named arguments
   * @param {[str]} obj.generator_lines - Full list of strings from the
   *     generator file.
   * @param {int} obj.keyword_index - Index of the keyword line
   * @param {int} obj.test_num - Which iteration of the test this is
   * 
   * @returns {str} - New text for the keyword line
   * */
  let keyword_text = `${ generator_lines[ keyword_index ] } (${ test_num } of ${ TOTAL_TESTS_FOR_THIS_SCENARIO_PLACEHOLDER })`;
  return keyword_text;
}


function get_possibly_unique_lines_data({
  scenario,
  generator_lines,
  indexes_to_delete
}) {
  /** Return a list of lines and other data for one randomized test.
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - Gherkin Scenario object
   * @param {[str]} obj.generator_lines - Lines in the generator file
   * @param {[int]} obj.indexes_to_delete - Lines to avoid adding to the new
   *     file
   * 
   * @returns {object} rtn - Named return values
   * @returns {[str]} rtn.attempt_lines - 0 or more possibly unique lines for
   *     the new test
   * @returns {int} rtn.final_significant_Step_index - Generator file index for
   *     the final found significant Step
   * @returns {[str]} rtn.warnings - 0 or more warning messages.
   * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
   * */
  let misfits = new Misbehaviors();

  let attempt_lines = [];
  let prev_significant_Step_index = get_keyword_index({ scenario });
  let found_at_least_1_significant_step = false;
  for ( let step of scenario.steps ) {

    let is_significant = is_constraints_Step({ step });
    if ( !is_significant ) {
      continue;
    }

    found_at_least_1_significant_step = true;

    // Get the lines since the last line we got (comments/blanks/etc)
    let significant_Step_start_index = as_index( step.location.line );
    let { tweens } = misfits.steal_misbehaviors(
      get_tweens({
        end_index_of_prev: prev_significant_Step_index,
        start_index_of_next: significant_Step_start_index,
        generator_lines,
        indexes_to_delete
      })
    );  // If error, keep gathering errors

    let { table: story_table_str } = misfits.add(
      get_random_Story_Table({ step, generator_lines })
    );

    if ( misfits.errors.length > 0 ) { break; }
    attempt_lines.push( ...tweens, story_table_str );

    prev_significant_Step_index = get_final_file_index_of_constraints_or_fore_Step({ step });
  }  // Ends loop for every step

  if ( !found_at_least_1_significant_step ) {
    let error = log.error({ code: `ALK0254`, context: `generating files`, },
      `ALKiln found 0 valid constraints Steps for the Scenario at line ${ scenario.location.line }: "${ scenario_description_for_logs({ scenario }) }". Check the Step docs at https://assemblyline.suffolklitlab.org/docs/alkiln/writing#constrained-random-answers for the correct language and syntax.`
    );
    misfits.add({ errors: [new Error( error )] });
  }

  return {
    attempt_lines,
    prev_significant_Step_index,
    ...misfits
  }
}


const GET_TO_REGEX = /get|gets|end|reach|stop/i;
const WITH_REGEX = /with|when/i;
const PICK_REGEX = /pick|choose/i;
function is_constraints_Step({ step }) {
  /** Return `true` if the Step is a constraints Step, otherwise return `false`.
   *
   * @param {object} obj - Named arguments
   * @param {Gherkin object} obj.step - A valid constraints Step Gherkin object
   *
   * @returns {bool} `true` if it's a constraints Step, otherwise false
   * */
  // Use `.test()` without `g` flag. See
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
  let matches_constraints_Step = ALKILN_REGEX.test( step.text )
                                 && (
                                      GET_TO_REGEX.test( step.text )
                                      || PICK_REGEX.test( step.text )
                                 );
  return matches_constraints_Step;
}


function get_random_Story_Table({
  step, generator_lines, indexes_to_delete
}) {
  /** Return a randomized Story Table string.
   * 
   * TODO: Abstract this further
   *
   * @param {object} obj - Named arguments
   * @param {string} obj.ids - The ids this Story Table can reach
   * @param {object} obj.step - Gherkin AST of a Step
   * @param {[str]} obj.generator_lines - List of lines from the generator file
   * 
   * @returns {object} rtn - Named return values
   * @returns {string} rtn.table - String of the whole Story Table Step
   * @returns {[str]} rtn.warnings - 0 or more warning messages.
   * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
   * */
  let misfits = new Misbehaviors();
  let story_table_parts = [];

  let { ids } = misfits.add(
    get_final_ids({ step_text: step.text })
  );
  if ( misfits.errors.length > 0 ) { return { table: null, ...misfits }; }

  if ( !step.dataTable ) {
    let error = log.error({ code: `ALK0250`, context: `generating files`, },
      `The table is missing for the constrained random answers Step at line ${ step.location.line }. The Step:`,
      get_flatter_table_Step({ step })
    );
    misfits.add({ errors: [ new Error( error ) ] });

  } else if ( step.dataTable.rows.length === 1 ) {
    let error = log.error({ code: `ALK0251`, context: `generating files`, },
      `The body of the table is missing for the table of the constrained random answers Step at line ${ step.location.line }. There is only a header row. The Step:`,
      get_flatter_table_Step({ step })  );
    misfits.add({ errors: [new Error( error )] });

  }
  if ( misfits.errors.length > 0 ) { return { table: null, ...misfits }; }

  let step_indent = get_authors_indent({ located: step });
  let table_start = `${ step_indent }And I get to any of the question ids [${ ids.join(`, `) }] with this data:`;
  story_table_parts.push( table_start );

  let step_bottom_index = as_index( step.location.line );
  let previous_significant_index = step_bottom_index;
  for ( let row_i = 0; row_i < step.dataTable.rows.length; row_i++ ) {

    let row = step.dataTable.rows[ row_i ];

    let row_file_index = as_index( row.location.line )
    let { tweens, errors } = misfits.add(
      get_tweens({
        end_index_of_prev: previous_significant_index,
        start_index_of_next: row_file_index,
        generator_lines: generator_lines,
        indexes_to_delete: []
      })
    );
    if ( misfits.errors.length > 0 ) { break; }
    story_table_parts.push( ...tweens );

    if ( row_i === 0 ) {
      story_table_parts.push( get_table_header({ row }) );
    } else {
      story_table_parts.push( get_random_table_row({ row }) );
    }

    previous_significant_index = row_file_index;
  }

  let table = story_table_parts.join(`\n`);
  log.debug({ code: `ALK0253`, context: `generating files`, }, `Table:`, table );
  return { table, ...misfits };
}


let CAPTURE_QUESTION_IDS_REGEX = /("[^"]+")/g;
function get_final_ids({ step_text }) {
  /** Return a list of docassemble question block ids (in double quotes) that
   *     are in an ALKiln constraints Step. Every generated Story Table Step
   *     must reach one of these ids.
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
   * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
   * */
  let errors = [];
  let warnings = [];

  let ids = step_text.match( CAPTURE_QUESTION_IDS_REGEX );

  if ( ids === null ) {
    let missing_ids_msg = `The constrained random answers Step is missing its question ids. ALKiln is unable to create random tests for this generator Scenario. The Step:\n${ step_text }`;
    let error = log.error({ code: `ALK0249`, context: `generating files`, }, missing_ids_msg );
    errors.push(new Error( error ));
  }

  return { ids, warnings, errors };
}


function get_flatter_table_Step({ step }) {
  /** Given a Gherkin `step` object, returns an object that is a less nested
   *     version of the `step` object. If the Step doesn't have a table, return
   *     the Step's text
   *
   * Yes, this is annoying to test, but it's a fairly simple way to show enough
   *     info about the Step to be useful.
   *
   * Discuss: Should this go in the Log class?
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.step - Valid Gherkin `step` object
   *
   * @returns {{ text, rows: [[str1, str2], ...] }} - Flatter version of `step`
   * */
  let simple = { text: step.text, rows: [] };

  if ( !step.dataTable ) { return simple; }

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
   *     allowed.
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


function pick_random_answer({ answers_str=`` }) {
  /** Return one of the answers from the given string of possible answers.
   *
   * @param {object} obj - Named arguments
   * @param {str} obj.answers_str - A string representing one or more possible
   *     answers. The possible answers are separated by this character
   *     combination: `;;`
   *
   * Example:
   * pick_random_answer({ answers_str: `yes;; no;; maybe` });
   * // `no`
   * 
   * TODO: Add a warning in the docs that Gherkin ignores whitespace at the
   *     start and end of columns in a table.
   * 
   * Discuss: let authors wrap content in backticks or some other delimiter.
   *
   * @returns {string} - One of the possible answers
   * */
  let choices = answers_str.replace(`;; `, `;;`).split(`;;`);
  if ( choices.includes(``) ) {
    // Discuss: Should we get rid of silent log warnings? They could help us
    //    help authors troubleshoot their tests while not disturbing the author
    //    with problems that may not exist. We can always make the warnings
    //    louder later. Should we make them loud instead? And suggest the author
    //    should put the empty one in the middle?
    log.debug({ code: `ALK0252`, context: `generating files` },
      `**Quiet warning** - One of the constrained random answer choices in a row in this table is "". It could be on purpose or it could be a misplaced separator (";;"). The choices: "${ answers_str }"`
    );
  }
  let choice_index = Math.floor( Math.random() * choices.length );
  return choices[ choice_index ];
}


function get_final_file_index_of_constraints_or_fore_Step({ step }) {
  /** Returns the index of the last possible item in a Gherkin Step object. That
   *     includes the file index of the last row in a `dataTable`.
   * 
   * Research: How to get the final row of a Step with a multi-line string?
   * Answer: Maybe it's how to look for the end of any Step. Look for the
   *     starting line of the next Step. Look above that to the first line that
   *     isn't a comment or blank line (though the other way around).
   * 
   * Research: How do find the line of the end of a Scenario considering a final
   *     Step could be a multi-line quote or an examples table.
   * 
   * Research: How to get the final row of an `Examples` table?
   * Answer: `scenario.examples` then `.tableHeader.cells` or `.tableBody.cells`
   *     Maybe we need to go back to just parsing strings. That would make the
   *     explanation easier too... On the other hand, we have to account for
   *     other details, like empty lines or comment lines or who knows what else
   * 
   * Research: When there's a repeated line in the Story Table, do we use the
   *     first line we find or the last one? Then make the behavior in here
   *     match that behavior. Or just leave it to its own devices.
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.step - Gherkin AST `step` object
   * 
   * @returns {int} - Index of the final line as an index in the generator file
   * */
  if ( !step.dataTable ) { return as_index( step.location.line ); }
  let rows = step.dataTable.rows;
  return as_index(rows[ rows.length - 1 ].location.line);
}


function get_final_lines({
  generator_lines,
  final_significant_Step_index,
  indexes_to_delete
}) {
  /** Return the rest of the lines till the end of the file
   * 
   * Discuss: Alternatively, get all the remaining lines until the next Scenario
   *     that are before comments and blank lines. Maybe that's not possible
   *     given descriptions and docstrings (That might have the word "Scenario:"
   *     in it). Still, may be able to combine Gherkin AST and parsing. to
   *     achieve the result we want.
   * 
   * @param {object} obj - Named arguments
   * @param {[str]} obj.generator_lines - List of lines from the generator file
   * @param {int} rtn.final_significant_Step_index - Generator file index for
   *     the final found significant Step
   *
   * @returns {[str]} - 0 or more lines for the new file.
   * */

  let { tweens, errors, warnings } = get_tweens({
    end_index_of_prev: final_significant_Step_index,
    start_index_of_next: generator_lines.length,
    generator_lines,
    indexes_to_delete
  });

  return { final_lines: tweens, errors, warnings };
}


function put_together_new_test_text({
  starting_lines, middle_lines, final_lines, warnings
}) {
  /** Return the combined text with its final modifications
   * 
   * @param {object} obj - Named arguments
   * @param {[str]} obj.starting_lines - 0 or more lines to start the new test
   * @param {[str]} obj.middle_lines - 0 or more middle lines of the new test
   * @param {[str]} obj.final_lines - 0 or more lines to end the new test
   * @param {[str]} obj.warnings - 0 or more warning messages
   *
   * @returns {str} - Block of text of the new test
   * */
  let one_new_test_text = [
    ...starting_lines, ...middle_lines, ...final_lines,
  ].join(`\n`);
  
  let edited_for_warnings = edit_for_warning_tag({
    new_text: one_new_test_text,
    has_warnings: warnings.length > 0
  });

  return edited_for_warnings;
}


function edit_for_warning_tag({ new_text, has_warnings }) {
  /** Paste in a warning tag if needed, otherwise remove the placeholder text.
   * 
   * @param {object} obj - Named arguments
   * @param {str} obj.new_text - The text to edit
   * @param {boolean} obj.has_warnings - Whether this Scenario has warning
   *     messages
   *
   * @returns {str} - The edited text
   * */
  if ( has_warnings ) {
    new_text = add_warning_tag({ new_text });
  } else {
    new_text = remove_warning_tag_placeholder({ new_text });
  }
  return new_text;
}


const ALKILN_WARNING_TAG = `@alkiln_generator_warning`;
function add_warning_tag({ new_text }) {
  /** Paste in the warning tag wherever the placeholders are
   * 
   * @param {object} obj - Named arguments
   * @param {str} obj.new_text - The text to edit
   * 
   * @returns {str} - Text with the warning tag added
   * */
  return new_text.replace( WARNING_TAG_PLACEHOLDER, ` ${ ALKILN_WARNING_TAG }` );
}


function remove_warning_tag_placeholder({ new_text }) {
  /** Remove the text of the warning tag placeholder to keep things purty.
   * 
   * @param {object} obj - Named arguments
   * @param {str} obj.new_text - The text to clean up
   * 
   * @returns {str} - The cleaned text
   * */
  return new_text.replace( WARNING_TAG_PLACEHOLDER, `` );
}


function add_total_tests({ scenario_group_str, num_tests }) {
  /** Paste in the total number of tests generated for this generator Scenario.
   * 
   * @param {object} obj - Named arguments
   * @param {str} obj.scenario_group_str - The combined string of all the
   *     Scenarios for this particular generator
   * @param {[str]} obj.num_tests - Number of tests that ALKiln created
   * 
   * @returns {str} - The updated string
   * */
  let with_num_total_tests = scenario_group_str.replaceAll(
    TOTAL_TESTS_REGEX, num_tests
  );
  return with_num_total_tests;
}


function add_warnings_Scenario({ scenarios_str, warnings }) {
  /** Add the given warnings as a new Scenario before all the generated
   *     Scenarios. Basically, a whole-generator-scope warning.
   * 
   * Discuss: Add a pre-group Scenario for every group of generated Scenarios
   *     identifying the generator Scenario of the subsequent new Scenarios.
   *     That is, even when there is no warning to give.
   * 
   * TODO: If/when we allow multiple generator Scenarios, use the ID here too
   * 
   * @param {object} obj - Named arguments
   * @param {str} obj.scenarios_str - The str of the already existing Scenarios
   * @param {[str]} obj.warnings - 0 or more warning messages
   * 
   * @returns {str} - The text of the combined Scenarios.
   * */
  let tags = `@alkiln_extra_intro ${ ALKILN_WARNING_TAG }`;
  let keyword_line = `Scenario: ALKiln humbly begs the author's forgiveness. The next tests might be flawed.`;
  let step_text = get_goofy_warnings_Step_text();

  let warnings_lines = warnings_as_list_of_lines({ warnings });
  let warnings_str = get_warnings_docstring({ warnings_lines, indent: 2 });

  let new_Scenario_str = [
    tags,
    keyword_line,
    step_text,
    warnings_str,
  ].join(`\n`);

  let original_str = scenarios_str;
  let all_Scenarios_str = [ new_Scenario_str, original_str ].join(`\n\n`);

  // Discuss: Clarity of `join()` expression. Alternatives.
  // `${new_Scenario_str}\n\n${original_str}`
  // new_Scenario_str + `\n\n` + original_str
  // `join()` gets the delimiter out of the way of the items being joined.

  return all_Scenarios_str;
}


function get_goofy_warnings_Step_text() {
  /** Return the text of the "warnings" Step. It's only a bit goofy. We need
   *     more goofs in the world. 0 arguments needed.
   * 
   * Discuss: A global for the goofy strings would help to keep tests aligned.
   * 
   * @returns {str} - The text of the "warnings" Step.
   * */
  let fun_ones = [
    `hiccup`, `snafu`, `bumble`, `stumble`, `fumble`, `slip`, `goof`, `flub`
  ];
  let fun_one = fun_ones[ Math.floor( Math.random() * fun_ones.length ) ];
  let step_text = `  Then ALKiln warns the author about a generator ${ fun_one }:`;
  return step_text;
};


function get_warnings_docstring({ warnings_lines, indent }) {
  /** Return the docstring for the warnings Step, including delimiters (`"""`)
   * 
   * @param {object} obj - Named arguments
   * @param {[str]} obj.warnings - 0 or more strings
   * @param {int} obj.indent - How indentation levels to start each line. Note:
   *     Each indentation level currently gets 2 spaces
   * 
   * @returns {str} - docstring for the warnings Step
   * */
  let doc_str_lines = [
    `"""`,
    `━━━━━ Generator file warning or warnings ━━━━━`,
    ...warnings_lines,
    `━━━━━`,
    `"""`,
  ];

  let indented_lines = [];
  for ( let line of doc_str_lines ) {
    indented_lines.push( `  `.repeat( indent ) + line );
  }

  return indented_lines.join(`\n`);
}


function warnings_as_list_of_lines({ warnings }) {
  /** Flatten the list of single- or multi-line warnings into single lines.
   * 
   * @param {object} obj - Named arguments
   * @param {[str]} obj.warnings - 0 or more single- or multi-line strings
   * 
   * @returns {[str]} - 0 or more single-line strings
   * */
  let all_lines = [];
  for ( let warning of warnings ) {
    all_lines.push( ...warning.split(`\n`) );
  }
  return all_lines;
}


function validate_syntax({ file_text }) {
  /** Return any errors we get from running the text through the Gherkin parser
   * 
   * @param {object} obj - Named arguments
   * @param {str} obj.file_text - Text of the Gherkin file
   * 
   * @returns {object} rtn - Named return values
   * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
   *  */
  let { errors: generated_parsing_errors } = get_Gherkin_AST({ file_text });
  return { errors: generated_parsing_errors || [] };
}


function save_files({ tests_path, artifacts_path, file_strings }) {
  /** Save each test file string to an artifacts folder and a folder that
   *     cucumber will use to run tests.
   * 
   * @param {object} obj - Named arguments
   * @param {str} tests_path - Path where cucumberjs will find these files
   * @param {str} artifacts_path - Artifacts folder path
   * @param {[str]} file_strings - Each string will be a test file
   * 
   * @returns {undefined}
   * */
  // Delete the old files no matter what
  delete_previous_tests_from_sources_folders_for_ALKiln_developers({ tests_path });

  if ( file_strings.length === 0 ) { return; }

  // Implementation note: This has no error if the folder already exists
  fs.mkdirSync( tests_path, { recursive: true });
  fs.mkdirSync( artifacts_path, { recursive: true });

  log.debug({ code: `ALK0267`, context: `generating files`, },
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

  log.debug({ code: `ALK0268`, context: `generating files`, },
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
   * 
   * @param {object} obj - Named arguments
   * @param {str} tests_path - Path where cucumberjs will find these files
   * 
   * @returns {undefined}
   * */
  if ( !fs.existsSync( tests_path )) { return; }
  log.debug({ code: `ALK0266`, context: `generating files`, },
    `Deleting previously generated files:`, fs.readdirSync( tests_path )
  );
  fs.rmSync( tests_path, { recursive: true, force: true });
}


/**
 * ====================
 * Shared functions
 * _In order of first runtime call appearance_
 * ====================
 * */

function as_index( line_num ) {
  /** Given a Gherkin line number, return the file-lines-list index for that
   *    line number. This is here mostly as a name that helps clarify what the
   *    code is doing.
   *
   * Each Gherkin line number matches a line in the file and therefore an item
   *    in the `generator_lines` list. The Gherkin line numbers are 1-indexed.
   *    That means the location of `{line: 1}` in the AST refers to
   *    `generator_lines[0]`.
   *
   * @param {int} line_num - A 1-indexed Gherkin line number
   *
   * @returns {int} - The corresponding index in the list of lines in the
   *    generator file
   * */
  return line_num - 1;
}


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
   *   for ( let item of generator_lines ) {
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

  add({ errors=[], warnings=[], ...return_vals }) {
    /** Adds errors and/or warnings to their list. Returns the same values.
     * 
     * @param {obj} obj - Named arguments
     * @param {[str]} obj.warnings - (Optional) 0 or more warning messages
     * @param {[Error]} obj.errors - (Optional) 0 or more Errors
     * @param {Any} obj...return_vals - (Optional) Any other values
     * 
     * @returns {any} - The values it was given
     * */
    if ( this.errors ) { this.errors.push( ...errors ); }
    if ( this.warnings ) { this.warnings.push( ...warnings ); }
    return { errors, warnings, ...return_vals };
  }

  steal_misbehaviors() {
    return this.add( ...arguments );
  }
}


function scenario_description_for_logs({ scenario }) {
  /** Combines metadata to return a fuller description of the Scenario.
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - Gherkin AST `scenario` object
   * 
   * @returns {string} - Description of the Scenario
   * */
  let description = `line ${ scenario.location.line }: "${ scenario.name }"`;
  if ( scenario.tags.length > 0 ) {
    let tag_names = scenario.tags.map((tag)=>{ return tag.name; });
    description += `, ${ tag_names.join(' ') }`;
  }

  return description;
}


function get_keyword_index({ scenario }) {
  /** Return the generator file index of the Scenario's keyword line.
   * 
   * @param {object} obj - Named arguments
   * @param {object} obj.scenario - Gherkin Scenario object
   * 
   * @returns {int} - Keyword line index
   * */
  return as_index( scenario.location.line );
}


function get_tweens({
  end_index_of_prev=0,
  start_index_of_next=0,
  generator_lines=[],
  indexes_to_delete=[]
}) {
  /** Return a list of strings of the lines in between start and end index,
   *     EXCLUSIVE OF BOTH. If `generator_lines` does not have enough lines for
   *     `start_index_of_next`, it will return values until the end of the list.
   *     This is intended to get comments, blank lines, descriptions, and Steps
   *     that the generator will leave alone.
   * 
   * IMPORTANT: Remember it excludes both the starting line and the final line
   * 
   * @Example
   * let tweens = get_tweens({ end_index_of_prev: 3, start_index_of_next: 6,
   *   [
   *     `Feature: I go the store`, ``, `Scenario: I get apples`,
   *     `  Given ALKiln makes 5 random tests`, `And I start the interview at go.yml`,
   *     `  And I set "groceries" to True`, `  Alkiln can get to "end" with:`
   *   ]
   * });
   * // console.log( tweens );
   * // { tweens: [
   * //   `And I start the interview at go.yml`, `  And I set "groceries" to True`,
   * // ]}
   * 
   * @param {object} obj - Named arguments
   * @param {int} obj.end_index_of_prev - The line that ended the previous
   *     significant file lines (like a fore-Step)
   * @param {int} obj.start_index_of_next - The line that will start the next
   *     significant file line (like a constraints Step)
   * @param {[Any]} obj.generator_lines - List of generator_lines
   * @param {[int|undefined]} obj.indexes_to_delete - 0 or more indexes of
   *     generator_lines to delete from the list
   *
   * @returns {obj} rtn - Named return values
   * @returns {[str]} - 0 or more lines in between the given lines (exclusive)
   * @returns {[str]} rtn.warnings - 0 or more warning messages
   * @returns {[Error|str]} rtn.errors - 0 or more strings or Errors
   * */
  let errors = [];
  let warnings = [];
  let tweens = [];
  try {
    let start = end_index_of_prev + 1;  // exclude previous significant line
    for ( let line_i = start; line_i < start_index_of_next; line_i++ ) {
      if ( indexes_to_delete.includes( line_i )) { continue; }
      tweens.push( generator_lines[ line_i ]);
    }

    log.debug({ code: `ALK0245`, context: `generating files`, },
      `Got tween lines. Starting line (excluded):`, generator_lines[ end_index_of_prev ],
      `\nTweens:`, tweens,
      `\nEnding line (excluded):`, generator_lines[ start_index_of_next ]
    );
  } catch ( tween_error ) {
    errors.push( new Error( log.error({ code: `ALK0246`, context: `generating files`, },
      `ALKiln got an error it is unfamiliar with when generating lines in between other lines starting on Gherkin AST line ${ start }. We would love to see your debug.txt`
    )));
    errors.push( tween_error );
  }

  return { tweens, errors, warnings };
}


function get_authors_indent({ located }) {
  /** Return a whitespace string representing the indentation for a given
   *     Gherkin location object.
   *
   * @param {object} obj - Named arguments
   * @param {object} obj.located - Gherkin AST object with a location property
   *
   * @returns {string} - A whitespace string representing the indentation for a
   *     given Gherkin location object.
   * */
  if ( typeof located !== `object` || !located.location ) {
    log.debug({ code: `ALK0276`, context: `generating files`, }
      `Skipped get_authors_indent. Given argument:\n`,
      located
    );
    return ``;
  }
  return ` `.repeat( located.location.column - 1 );
}
