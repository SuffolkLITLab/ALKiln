const fs = require('fs');
const fg = require(`fast-glob`);

const session_vars = require('./session_vars');

/**
 * TODO: get the logger into here.
 * TODO: Change filename to "constrained" or make this a broader purpose file
 * TODO: Warnings categories might have severe warnings (like "will skip the
 *    random test") vs. slight warnings (like "missing number in constraints
 *    random test")
 * */

const Gherkin = require("@cucumber/gherkin");
const Messages = require("@cucumber/messages");



module.exports = function make_random_input_files({ generators_prefix, sources_path }) {
  /** Given files with a certain prefix, use the text in them to generate a
   *    feature file or files. A file generates one file with multiple
   *    Scenarios.
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
  And I generate 2 random tests and I get to any of ["kickout screen", "success screen"] when I pick from these constraints:
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
  And I generate 2 random tests and I get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
--- Part 4 - Scenario after the constraints Step
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
@random_tests
Feature: I generate successful random tests

--- Part 2a - Scenario text before the constraints Step plus identifying info
@tag1   @tag2 @randomized_1
Scenario: simplest random input Steps random test 1
  Given I start the interview at "test_kickout"
--- Part 3a - the 1st generated Story Table Step
  And I generate 2 random tests and I get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct |
--- Part 4a - Scenario after the constraints Step
  Then I wait .2 seconds

--- Part 2b - Scenario text before the constraints Step plus identifying info
@tag1   @tag2 @randomized_2
Scenario: simplest random input Steps random test 2
  Given I start the interview at "test_kickout"
--- Part 3b - the 2st generated Story Table Step
  And I generate 2 random tests and I get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | wrong |
--- Part 4b - Scenario after the constraints Step
  Then I wait .2 seconds

--- Part 5 - top of the next Scenario
Scenario: Some other scenario
  Given I start the interview at "other_file"
  ...etc
--- End
   *
   *
   * Output:
@random_tests
Feature: I generate successful random tests

@tag1   @tag2 @randomized_1
Scenario: simplest random input Steps random test 1
  Given I start the interview at "test_kickout"
  And I get to any of ["kickout screen", "success screen"] with this data:
    | var | possible_values |
    | user_choice | correct |
  Then I wait .2 seconds

@tag1   @tag2 @randomized_2
Scenario: simplest random input Steps random test 2
  Given I start the interview at "test_kickout"
  And I get to any of ["kickout screen", "success screen"] with this data:
    | var | possible_values |
    | user_choice | wrong |
  Then I wait .2 seconds

Scenario: Some other scenario
  Given I start the interview at "other_file"
  ...etc
   * */

  // Get the paths of the source files that we need to parse
  let generator_paths = fg.sync(`${ sources_path }/${ generators_prefix }*.feature`);
  // // TODO: Should we add a folder for all randomly generated files?
  // // TODO: Save file in the author's package or just in the artifacts folder?
  // // let artifacts_path = session_vars.get_artifacts_path_name();
  for ( let generator_path of generator_paths ) {

    let file_contents = fs.readFileSync( generator_path, {encoding: `utf8`});
    let uuidFn = Messages.IdGenerator.uuid();

    let doc_AST = get_Whole_Feature_AST({ file_contents, uuidFn });
    /** TODO: Get the part of the file before the first Scenario by finding the
     * line number of the first Scenario and getting all the text before that
     * line straight from the file_contents. */

    // // Pickles don't have locations
    // let pickles = get_Scenarios_pickles({ doc_AST, generator_path, uuidFn });

    // console.log(`doc:`, JSON.stringify(doc_AST, null, 2));
    // console.log(`pickles:`, JSON.stringify(pickles, null, 2));
    // console.log(`tags:`, JSON.stringify(doc_AST.feature.tags));

    // console.log(`doc:`, doc_AST);
    // console.log(`pickles:`, pickles);

    let new_contents = get_new_file_contents({
      scenario_objs: doc_AST.feature.children,
      file_contents
    });


    // build_file_str({ documentAST: doc_AST, uri: `/docassemble/ALKilnTests/data/sources/alkiln_random.feature` });

    // let file_str = get_random_input_file_str({ file_contents, generator_path });
    // // Save the file
    // // let new_file_path = `${ session_vars.get_artifacts_path_name() }/_alkiln_generated_${ Date.now() }.feature`;
    // // fs.appendFileSync( new_file_path, file_str );
  }
};  // Ends make_random_input_files()

function get_Whole_Feature_AST({ file_contents, uuidFn }) {
  let builder = new Gherkin.AstBuilder(uuidFn);
  let matcher = new Gherkin.GherkinClassicTokenMatcher(); // or Gherkin.GherkinInMarkdownTokenMatcher()

  let parser = new Gherkin.Parser(builder, matcher);
  return parser.parse( file_contents );
}


// function get_Scenarios_pickles({ doc_AST, generator_path, uuidFn }) {
//   let pickles = Gherkin.compile(
//     doc_AST,
//     generator_path, // Metadata for the parsed objects
//     uuidFn
//   );
// }


function get_new_file_contents({ scenario_objs, file_contents }) {
  /**
   * - Find the line that starts the Scenario (which could be tags)
   * - Store the first part of the Scenario before the constraints Step
   * - Find a constraints table Step or line
   * - For each random test build the string for the constraints (line by line)
   * - Find the first line of the Steps after the constraints table
   * - Find the last line of the last Step after the constraints table
   * - Save the text (from the original file) that are on those lines
   * I'm not sure if it's worth saving the comments unfortunately.
   * We can use column values for indentations, but I'm not sure it's worth it
   *    either
   * This all seems a bit fragile.
   * */
  if ( !scenario_objs[0].scenario ) { return null; }  // TODO: Warning? Error?

  let file_lines = file_contents.split(`\n`);

  let feature_text = get_Feature_text({
    first_scenario: scenario_objs[0].scenario,
    file_lines
  });

  /** Get every unique scenario with its randomly generated Story Table */
  let all_scenarios_strings = [];

  for ( let scenario_obj_i = 0; scenario_obj_i < scenario_objs.length; scenario_obj_i++ ) {
    /** Generate all the random Scenarios for this one Scenario-generating
    *    Scenario. We need to get the part of the text before the constraint
    *    Step text starts and the parts after the constraint Step text ends.
    * TODO: Add to description text (.name) */

    let scenario = scenario_objs[ scenario_obj_i ].scenario;

    let { constraints_Steps, error: constraints_Step_error } = get_constraint_Steps({ scenario });
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

    /** Parse the constraints Step */
    // Example: And I generate 34 tests and I get to any of ["end"] when I pick from these constraints:
    // Example: And I make 1 constrained random test and I get to "end1", "end 2", or "end-3" with:
    let num_tests = get_number_of_tests({ step_text: constraints_Step.text });

    let final_page_ids = get_final_ids({ step_text: constraints_Step.text });
    if ( final_page_ids === null ) { continue; }

    let story_table_strs = get_random_Story_Tables_strings({ num_tests, ids: final_page_ids, step: constraints_Step });

    // TODO: modify Scenario descriptions
    let scenarios_string = get_Scenarios_str({
      scenario_top,
      generator_id: scenario_obj_i,
      story_tables: story_table_strs,
      scenario_bottom
    });

    all_scenarios_strings.push( scenarios_string );
  }  // ends for every scenario_container

  let scenarios_combined = all_scenarios_strings.join(`\n`);
  console.log( scenarios_combined );

}


function get_Feature_text({ first_scenario, file_lines }) {
  /** Get text of feature to put at the top of the new file */
  let first_Scenario_line = get_Scenario_start_line_num({ scenario: first_scenario });
  let first_Scenario_index = as_index( first_Scenario_line );
  let index_of_last_line = first_Scenario_index - 1;

  let feature_text = file_lines.slice(
    0, index_of_last_line + 1  // `slice` excludes the last index
  ).join(`\n`);

  return feature_text;
}


function get_constraint_Steps({ scenario }) {
  /** Return all the constraint Steps in a Scenario. Give warnings if needed.
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
  // TODO: Warn about table with just a header row? Or just let that play out?

  return { constraints_Steps, error };
}


// Tests to find the step
let random_regex = /rand/i;
let generate_regex = /generate/i;
let constrain_regex = /constrain/i;  // constrained/constraint/constraints
function get_if_constraint_Step({ step }) {
  /** Return null or a constraints Step */
  // Use `.test()` without `g` flag. See
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
  let is_constraints_step = constrain_regex.test( step.text )
                            && ( random_regex.test( step.text )
                                 || generate_regex.test( step.text ));
  // Example: And I generate 34 tests and I get to any of ["end"] when I pick from these constraints:
  // Example: And I make 1 constrained random test and I get to "end1", "end 2", or "end-3" with:
  if ( is_constraints_step ) {
    // TODO: If multiple constraint Steps, delete text of previous
    //    constraint Steps somehow. Alternatively, make a Step that matches
    //    these kinds of constraint steps and ignore it.
    return step;
    // Continue looping to get the last possible constraints Step. If there
    // are multiple constraint Steps we use the last one.
  }

  return null;
}


function get_random_Story_Tables_strings({ num_tests, ids, step }) {
  /** Return all the necessary randomized Story Tables as strings.
   *
   * TODO: Ensure each table is unique (as much as is reasonable anyway)
   *
   * @param {object} obj Contains the named arguments
   * @param {int} obj.num_tests Number of Story tables to generate
   * @param {[string]} obj.ids The question ids that any of the Story Tables can
   *     reach
   * @parm {object} obj.step A valid constraints Step Gherkin object
   *
   * @returns {[string]} The strings of the Story Tables
   *  */
  let story_tables = [];
  // Each new Story Table Step starts the same way
  // TODO: Get the whitespace for this using the author's indentation
  let step_indent = get_authors_indent({ located: step });
  let table_start = `${ step_indent }And I get to any of the question ids [${ ids.join(`, `) }] with this data:`;

  // The constraints tables
  for ( let table_i = 0; table_i < num_tests; table_i++ ) {

    let story_table_rows = [ table_start ];
    let is_first_row = true;
    for ( let row of step.dataTable.rows ) {
      if ( is_first_row ) {
        is_first_row = false;
        story_table_rows.push( table_header({ row }) );
        continue;
      }
      // Otherwise
      story_table_rows.push( table_row({ row }) );

    }  // ends for every row
    let story_table = story_table_rows.join(`\n`);

    story_tables.push( story_table );
  }  // ends for number of tests

  return story_tables;
};


function table_header({ row }) {
  /** Return the string for the Story Table header row. 2 or 3 column tables are
   *    allowed.
   *
   * TODO: Warn about wrong number of columns?
   * Discuss: Where should new lines be added?
   *
   * @param {object} obj Contains the named arguments
   * @param {object} obj.row Gherkin dataTable.row object
   *
   * @returns {str} A markdown table row with 2 or 3 columns
   * */
  let indent = get_authors_indent({ located: row });
  let num_cols = row.cells.length;
  let header = `${ indent }| var | value |`;
  if ( num_cols >= 3 ) { header += ` trigger |`; }
  return header;
};


function table_row({ row }) {
  /** Return the string of one Story Table row with a randomly chosen answer.
   *
   * @param {object} obj Contains the named arguments
   * @param {object} obj.row Gherkin dataTable.row object
   *
   * @returns {str} A markdown table row with 2 or 3 columns
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
// TODO: make them unique in the file by using generating Scenario num as well
//    as randomization num.
let ID_PLACEHOLDER = `ALKILN_SCENARIO_RANDOM_ID_PLACEHOLDER`;
function get_Scenarios_str({ scenario_top, generator_id, story_tables, scenario_bottom }) {
  /** Return the string for the combined Scenarios. */
  let scenarios = [];
  for ( let table_i = 0; table_i < story_tables.length; table_i++ ) {

    let scenario_id = `generator${ generator_id + 1 }_scenario${ table_i + 1 }_of_${ story_tables.length }`;
    random_top = scenario_top.replaceAll( ID_PLACEHOLDER, scenario_id );

    let story_table = story_tables[ table_i ];

    let scenario_str = [
      random_top, story_table, scenario_bottom
    ].join(`\n`);
    console.log( scenario_str );
    scenarios.push( scenario_str );
  }
  let all_scenarios_strings = scenarios.join(`\n`);
  return all_scenarios_strings;
};


function get_pre_constraints({ scenario, first_constraints_Step, file_lines }) {
  /** Return the Scenario text that comes before the first constraints Step.
   *
   * @param {object} obj - Named arguments object
   * @param {object} obj.scenario - AST of the Scenario
   * @param {object} obj.first_constraints_Step - AST of the first constraints
   *     Step
   * @param {array} obj.file_lines - List of lines from the generator file
   *
   * Each object in the AST will have a `location` object that includes the
   *    item's line number (`{line: 1}`). Each line number represents a line in
   *    the file and therefore an item in the `file_lines` list. The line
   *    numbers are 1-indexed. That means the location of `{line: 1}` in the AST
   *    refers to `file_lines[0]`.
   * */
  // Use a shorter name as there are a lot of long lines of code
  let lines = file_lines;

  let keyword_index = as_index( scenario.location.line );
  let new_starter = lines[ keyword_index ];

  // If find tags, append to tag line, otherwise wait
  if ( scenario.tags.length > 0 ) {
    let tags_index = as_index( scenario.tags[0].location.line );
    lines[ tags_index ] = `${ lines[ tags_index ] } @randomized_${ ID_PLACEHOLDER }`;
  } else {
    new_starter = `@randomized_${ ID_PLACEHOLDER }\n${ new_starter }`;
  }
  lines[ keyword_index ] = `${ new_starter } random test ${ ID_PLACEHOLDER }`;

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
   * @param {object} obj - Named arguments object
   * @param {object} obj.next_Scenario - AST of the Scenario after this Scenario
   * @param {object} obj.constraints_Step - AST of the last constraints Step
   * @param {array} obj.file_lines - List of lines from the generator file
   *
   * Each object in the AST will have a `location` object that includes the
   *    item's line number (`{line: 1}`). Each line number represents a line in
   *    the file and therefore an item in the `file_lines` list. The line
   *    numbers are 1-indexed. That means the location of `{line: 1}` in the AST
   *    refers to `file_lines[0]`.
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
  let line_as_index = as_index( line_num );
  return line_as_index - 1;
};


// function get_index_after({ line_num }) {};


function get_authors_indent({ located }) {
  /** Return a string that is the indentation of the given object that has a
   *    Gherkin location property.
   * */
  if ( typeof located !== 'object' || !located.location ) {
    return ``;
  }
  return ` `.repeat( located.location.column - 1 );
};


let capture_numbers_regex = /(\d+)/g;
function get_number_of_tests({ step_text }) {
  /** Return the number of random constraint tests to generate. */
  let num_tests = 1;
  let num_tests_matcher = step_text.match( capture_numbers_regex );

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
  // console.log(`debugging num_tests:`, num_tests);

  return num_tests;
}


let capture_question_ids_regex = /("[^"]+")/g;
function get_final_ids({ step_text }) {
  /** Return the list of ids (in double quotes) that the Story Table Steps
   *    should reach. */
  let ids = step_text.match( capture_question_ids_regex );
  // console.log( `debugging ids:`, ids );
  if ( ids === null ) {
    console.log(`🔎🤕 ALK0000 (Warning or error?) warn: constrained random input test is missing the final question ids. ALKiln is unable to create random tests. The Step:\n`, step_text);
  }
  return ids;
}


function pick_random_answer({ answers_str=`` }) {
  /** Return one of the values from the given `;;` delimited answer choices.
   *
   * @param {{str}} answers_str `;;` delimited list of possible answers.
   * */
  let choices = answers_str.replace(`;; `, `;;`).split(`;;`);
  let choice_index = Math.floor( Math.random() * choices.length );
  return choices[ choice_index ];
}


function get_Scenario_start_line_num({ scenario }) {
  /** @returns int */
  // console.log(`scenario 1:`, scenario);
  if ( scenario.tags.length === 0 ) {
    return scenario.location.line;
  } else {
    return scenario.tags[0].location.line;
  }
}


// TODO: name? get_file_line_index/get_file_index/get_index_in_file
function as_index( line_num ) {
  /**
   * Gherkin is 1-indexed, but when we get text from our file we'll be using js,
   *    which is 0-indexed. We need to convert the Gherkin line number to an
   *    js index value.
   * */
  return line_num - 1;
}



// function build_file_str({ documentAST={}, uri=`ALK_NOTHING.feature` }) {

//   let lines = put_lines_together_in_order({ documentAST, uri });

//   // for ( let linei = 0; linei < lines.length; linei++ ) {
//   //   let line = lines[ linei ];
//   //   // To start, we'll make sure we're not creating undefined lines
//   //   if ( line === undefined ) {
//   //     throw new Error(`\`undefined\` at line number ${ linei + 1 } if "${ uri }"`);
//   //   }
//   // }

//   return lines.join(`\n`);
// }


// const DELETE_PLACEHOLDER = `ALKILN_DELETE_LINE`;

// function put_lines_together_in_order({ documentAST={}, uri=`ALK_NOTHING.feature` }) {
//   let line_list = [];
//   let feature = documentAST.feature;
//   let comments = documentAST.comments;



//   // Keep hold of those empty items to delete them from the list later or
//   // add new lines with special placeholders and later delete lines with that
//   // placeholder
//   // Get the text prior to that line and prepend it to the file later
//   // All the other undefined lines get to be plain new lines

//   // let feature_lines = add_Feature_lines({ feature, line_list });

//   // for ( let comment of comments ) {
//   //   add_line_with_location({ line_with_location: comment, line_list });
//   // }

//   // let scenario_objs = feature.children;
//   // add_Feature_lines_placeholders({ scenario_objs, line_list });

//   // console.log( line_list );

//   return line_list;
// }


// function add_Feature_lines({ feature={}, line_list=[] }) {
//   /** Mutates `line_list` */
//   // `tags` will always be a list, even empty
//   for ( let tag of feature.tags ) {
//     add_line_with_location({ line_with_location: tag, line_list });
//   }

//   let faux_feature = {
//     location: feature.location,
//     text: `Feature: ${ feature.name }`
//   }
//   add_line_with_location({ line_with_location: faux_feature, line_list });
// }


// function add_line_with_location({ line_with_location, line_list=[] }) {
//   /** Mutates `line_list` */
//   let line_index = as_index( line_with_location.location.line );
//   let current_value = line_list[ line_index ];

//   if ( current_value === undefined ) {
//     line_list[ line_index ] = line_with_location.text || line_with_location.name;
//   } else {
//     line_list[ line_index ] += ` ${ line_with_location.text || line_with_location.name }`
//   }
// }


// function add_Feature_lines_placeholders({ scenario_objs, line_list }) {
//   /** Mutates `line_list` */
//   // Get the line at which the feature ends
//   let first_scenario = scenario_objs[0].scenario;
//   console.log(`first_scenario:`, first_scenario);
//   let first_Scenario_line_num;
//   if ( first_scenario ) {
//     first_Scenario_line_num = get_Scenario_start_line_num( first_scenario );
//   }
//   // Add a placeholder for each of those lines
//   for ( let linei = 0; linei < first_Scenario_line_num; linei++ ) {
//     line_list[ linei ] = DELETE_PLACEHOLDER;
//   }
// }


// function get_regular_line_text({ line_obj={}} = {}) {
//   let spaces = line_obj.location.column;
//   let combined = add_n_spaces_at_start_of_x( spaces, line_obj.text );
//   return combined;
// }


// function add_n_spaces_at_start_of_x(num_spaces, text) {
//   return `${ ` `.repeat( num_spaces - 1 )}${ text }`;
// }


// function build_constrained_random_input_Step() {}


// function get_random_input_file_str({ file_contents=``, generator_path=`` }) {
//   /** Return the text for one file with all the requested random tests.
//    *
//    * TODO: consider importing one of cucumber's own parsers.
//    *
//    * Keep Feature description
//    * Keep and add to Scenario description
//    *
//    * TODO: Don't parse comments, just leave them
//    * TODO: Create new Steps to put errors in the report for failed file or
//    *    Scenario parsing
//    * TODO: In the Scenario text itself, add the name of the path where we will
//    *    save the file in a way that will be visible in the console/report output
//    * */

//   /**
//    * 1. Get each constraints table in the file
//    * 2. Replace each with a unique string
//    * 3. Make an object with those strings as keys that match the appropriate table
//    * 4. For each constraints table, generate random story tables
//    *
//    * Then what? Make a file where we duplicate each Scenario for as many random
//    * instances as there need to be? What if there are multiple constraints
//    * tables? If the author wants 2 random tests for the first and 2 random tests
//    * for the second, do we end up with 4 random tests? There _are_ some tests
//    * for which that would be appropriate.
//    *
//    * Opt 1: Author can only specify the interview and then the constraints
//    * table, nothing else. That can generate however many random tests they want.
//    *
//    * Opt 2: Author can create individual tables that will only be run once, but
//    * the field answers will be random for every constraints table ALKiln sees.
//    * That is, no file generation, just answering with random answers. Current
//    * Story Tables could possibly do that with the right syntax.
//    * */

//   /**
//    * 1. Copy each line of the file into a string until we get to a Scenario.
//    *    That will be the top of every file? The top of the single random input
//    *    tests file?
//    * 1. Add a comment and 2 new lines to add where to read more in the docs.
//    * 1. Copy the lines of the Scenario until we get to the next Scenario or the
//    *    end. That will generate one set of random tests.
//    * 1. Do that for every Scenario.
//    * 1. Turn each Scenario into a set of Scenarios using the Scenario
//    *    description plus an incrementing number.
//    * 1. And those strings to the one file.
//    * */

//   let { top, scenarios } = get_feature_file_parts({ file_contents });
//   if ( scenarios.length === 0 ) {
//     console.log( `🤕 ALK0000 error Found no Scenarios in "${ generator_path }"` );
//   }

//   for ( let scenario of scenarios ) {
//     if ( scenario ) {  // maybe empty string
//       try {
//         let scenario_data = get_scenario_parts({ scenario });
//         console.log(`scenario_data:`, scenario_data);
//         let {
//           skip,
//           description,
//           scenario_top,
//           constraints,
//           scenario_bottom
//         } = scenario_data;

//         if ( skip ) { continue; }
//       } catch ( scenario_parsing_error ) {
//         if ( !/`ALK\d\d\d\d`/.test( scenario_parsing_error )) {
//           // Unexpected error
//           console.log(`🔎 ALK0000 WARNING: Contact us. Internal error reading scenario in "${ generator_path }"`, scenario_parsing_error );
//         } else {
//           console.log(`🤕 ALK0000 Error while reading scenario in "${ "file name" }"`, scenario_parsing_error );
//         }
//       }
//     }
//   }  // ends for each scenario

//   // Add the top to the new file str
//   // Add the Scenarios

//   return ``;
// };  // Ends get_random_input_file_str()


// function get_feature_file_parts({ file_contents }) {
//   /** Given some text, return the parts of a .feature file
//    *
//    * TODO: Capture tags of Scenarios
//    *
//    * @returns {{}} parts Parts of the .feature file
//    * @returns {str} parts.top Text before any Scenarios
//    * @returns {[str]} parts.scenarios The text of each Scenario
//    * */
//   let generator_lines = file_contents.split(`\n`);
//   let top = ``, current_scenario = ``, scenarios = [];
//   let found_a_scenario = false;
//   let found_tags = false;
//   // TODO: dud definition of variable in outer scope from inner scope?
//   for ( let line_i = 0; line_i < generator_lines.length; line_i++ ) {
//     let line = generator_lines[ line_i ];
//     // TODO: should this be next non-empty line? Pass the remaining lines?
//     let next_line = generator_lines[ line_i + 1 ];

//     /*
//     if ( is_tags() && starts_a_Scenario({ line, next_line }) ) {
//       found_tags = true;
//       found_a_scenario = true;
//       // Start collecting the Scenario
//     }
//     */

//     if ( starts_a_Scenario({ line, next_line }) ) {
//       found_a_scenario = true;
//       // Push the current Scenario before starting the next one.
//       if ( current_scenario !== `` ) { scenarios.push( current_scenario ); }
//       // Start the next Scenario from scratch
//       current_scenario = `${ line }\n`;
//       continue;
//     }

//     if ( !found_a_scenario ) { top += `${ line }\n`; }
//     else { current_scenario += `${ line }\n`; }

//     // At the very end
//     if ( is_last_item( generator_lines, line_i )) {
//       scenarios.push( current_scenario );
//     }
//   }  // ends for each generator line

//   return { top, scenarios };
// };  // Ends get_feature_file_parts()


// function starts_a_Scenario({ line=``, next_line=`` }) {
//   // Maybe just check that `Feature` isn't below the tags
//   let does_start_Scenario = false;
//   // TODO: detect tag
//   // if ( line && is_tag({ line }) && next_line && is_Scenario({ line: next_line }) ) {
//   //   does_start_Scenario = true;
//   // } else
//   if ( is_Scenario({ line }) ) {
//     does_start_Scenario = true;
//   }
//   return does_start_Scenario;
// };


// function is_tag({ line=`` }) {
//   // Allow (only) whitespace at start
//   return /^\s*@./.test( line );
// }


// function is_Scenario({ line=`` }) {
//   // Allow (only) whitespace at start
//   return /^\s*Scenario:/.test( line );
// }


// function is_last_item( list_or_string, index ) {
//   return index === list_or_string.length - 1;
// }


// function indent_by( indentation_level=0, text=`` ) {
//   /** Adds spaces to the start of the given string that are equal to 2 times the
//    *    given indentation level.
//    * */
//   text = text.trimStart();
//   let spaces = ``;
//   while ( indentation_level > 0 ) {
//     spaces += `  `
//     indentation_level -= 1;
//   }
//   return spaces + text;
// }


// const STORY_TABLE_HEADERS = indent_by(2, `| var | value |`);
// function get_scenario_parts({ scenario }) {
//   /** Given the text of a Scenario, return the description of the Scenario, the
//    *    text until the constraints Steps, an object of the constraints, and the
//    *    text under those strings.
//    *
//    * There are 3 sections to a generator file: top, constraints, bottom. The
//    *    Scenario MUST only have one constraints section. It MUST have a section
//    *    before the constraints that goes to the interview.
//    *
//    * TODO: Add a Step to check for the presence of one of multiple possible
//    *    question ids. Can re-use the current "question id" Step.
//    * TODO: look up how Gherkin parses a table.
//    * TODO: Instead of trimming lines, should we instead use the same indentation
//    *    that the author used?
//    *
//    * Constraints can come in any order at the moment. We will change that by
//    *    changing how we ask authors to write one Step. E.g. `I generate 5
//    *    random tests and I get to any of [“id 1”, “id 2”] with these options:`
//    *    We need ids so that the Story Table will be able to stop.
//    *
//    * @returns {{}} parts
//    * @returns {str} parts.description The Scenario description
//    * @returns {str} parts.top Text before the constraint Steps
//    * @returns {{}} parts.constraints The constraint values
//    * @returns {int} parts.constraints.number How many Scenarios to generate
//    * @returns {[{}]} parts.constraints.options Table of possible value choices
//    * @returns {str} ...options[i].var The name of the variable to set
//    * @returns {str} ...options[i].possible_values The possible values for that
//    *     variable
//    * @returns {str} parts.bottom Text after the constraint Steps
//    * */

//   // Empty description is fine
//   let description = scenario.match(/Scenario:(.*)/)[1];

//   let scenario_lines = scenario.split(`\n`);
//   let scenario_top = ``, constraints = {}, scenario_bottom = ``;
//   let stage = `before constraints`;  // `constraints`, `all constraint keys exist`
//   let in_constraints_table = false;
//   for ( let line_i = 0; line_i < scenario_lines.length; line_i++ ) {
//     let line = scenario_lines[ line_i ];

//     let maybe_constraint = get_constraint_or_null({ text: line });
//     if ( maybe_constraint !== null ) {
//       stage = `constraints`;
//       in_constraints_table = maybe_constraint.options !== undefined;
//       warn_if_duplicate_key({ old_obj: constraints, new_obj: maybe_constraint });
//       constraints = { ...constraints, ...maybe_constraint };
//       const cons = constraints;
//       if ( cons.number && cons.url && cons.ids && cons.options !== undefined) {
//         stage = `all constraint keys exist`;
//       }
//       continue;
//     }

//     if ( stage === `before constraints` ) {
//       scenario_top += `${ line }\n`;
//       continue;
//     }

//     if ( in_constraints_table ) {
//       // TODO: How to abstract the below?
//       if ( is_valid_table_row({ line }) ) {
//         // Discuss whether it is safe to assume an author will never use these
//         // values
//         if ( /^\s*\|\s*var\s*\|\s*possible_values\s*\|\s*$/.test( line )) {
//           line = `${ STORY_TABLE_HEADERS }`;
//         } else if ( is_active_table_row({ line }) ) {
//           line = get_story_table_row({ row_str: line });
//         }

//         constraints.options += `${ line }\n`;
//         continue;
//       } else {
//         in_constraints_table = false;
//       }
//     }
//     if ( stage === `all constraint keys exist` && !in_constraints_table ) {
//       scenario_bottom += `${ line }\n`;
//       continue;
//     }
//   } // ends for each scenario line

//   // Make sure we have all the constraints we need
//   if ( !constraints.number ) {
//     console.log(`🔎 ALK0000 warn: constrained random input test is missing the number of tests to create. ALKiln will create 1 test. The Scenario:\n`, scenario);
//     constraints.number = 1;
//   }
//   if ( isNaN( parseInt( constraints.number )) ) {
//     console.log(`🔎 ALK0000 warn: The value for the number of random tests to generate must be an integer. Instead, it was "${ constraints.number }". Instead, ALKiln will create 1 random test. The Scenario:\n`, scenario);
//     constraints.number = 1;
//   }
//   if ( !constraints.options ) {
//     console.log(`🤕 ALK0000 error: random test is missing the table of input choices. ALKiln will skip this test. The Scenario:\n`, scenario);
//   }

//   const cons = constraints;
//   skip = !cons.ids || !cons.urls || !cons.options;

//   return {
//     skip,
//     description,
//     top: scenario_top,
//     constraints,
//     bottom: scenario_bottom,
//   };
// };  // Ends get_scenario_parts()


// function get_constraint_or_null({ text }) {
//   /** Return `null` if there's no constraints in the text or an object if there
//    *    is.
//    *
//    * @returns {null | { key: value }} If a constraint string is found, returns
//    *    an object with the key/value pair of that constraint. Otherwise returns
//    *    `null`.
//    * */
//   let constraint = null;
//   let possible_match = text.match(/^[^#]*(number|url|ids|options):\s*(.*)/);
//   if ( possible_match !== null ) {
//     constraint = {};
//     constraint[ possible_match[1] ] = possible_match[2];
//   }

//   return constraint;
// }

// function warn_if_duplicate_key({ old_obj={}, new_obj={} }) {
//   /** Warn the author if they have written duplicate keys.
//    *
//    * @param {{}} old_obj - object with any keys
//    * @param {{}} new_obj - object assumed to have 1 key
//    *
//    * @returns {undefined}
//    * */
//   let existing_keys = Object.keys( old_obj );
//   let new_key = Object.keys( new_obj )[0];
//   if ( existing_keys.includes( new_key )) {
//     // TODO: How do we print something more informative? Like the Scenario text
//     // or description and/or the rows in question. Definitely save these in the
//     // debug file.
//     console.log(`🔎 ALK0000 warn duplicate key "${ new_key }". Previous value was ${ old_obj[ new_key ] }. The new value is ${ new_obj[ new_key ] }. Will use the new value.`);
//     return true;
//   }
//   return false;
// }

// let table_row_syntax = /^\s*\|.*\|/
// function is_valid_table_row({ line=`` }) {
//   /** Returns true if one line of text is a valid table row. Otherwise returns
//    *    false.
//    *
//    * @param {str} line One line of text in a Scenario
//    *
//    * @returns {boolean}
//    * */
//   if (line.trim().startsWith(`#`)) { return true; }
//   if (line.trim() === ``) { return true; }
//   return is_active_table_row({ line });
// }

// function is_active_table_row({ line=`` }) {
//   if ( /^\s*\|.*\|/.test( line ) ) { return true; }
//   return false;
// }

// function get_story_table_row({ row_str=`` }) {
//   /** Given a markdown table row, return a 2-column markdown table row with the
//    *    given variable name and one of the value answer choices.
//    *
//    * @param {str} row_str A markdown table row
//    *
//    * @returns {str} 2-column markdown table row
//    * */
//   // What other invalid input do we need to catch?
//   let given_var_and_choices = get_columns({ row_str });
//   let [ var_name, answers_str ] = get_normalized_values({ original: given_var_and_choices });
//   let choice = pick_random_answer({ answers_str });
//   new_row_str = indent_by( 2, `| ${ var_name } | ${ choice } |`);
//   return new_row_str;
// }

// function get_columns({ row_str=`` }) {
//   /** Given markdown table row, return a list of the string in each column.
//    *
//    * @param {str} row_str A markdown table row
//    *
//    * @returns {[str]} A list of the string in each column
//    * */
//   // Discuss: Remove all surrounding whitespace? In ALKiln core code, match that
//   // by trimming the whitespace of all values on the page?
//   let pipes_ends_trimmed = row_str.replace( /^\s*\|\s*/, ``).replace( /\s*\|\s*$/, ``);
//   let var_and_choices = pipes_ends_trimmed.split( /\s*\|\s*/ );

//   // Warnings
//   let num_cols = var_and_choices.length;
//   if ( num_cols !== 2 ) {
//     // TODO: For docs? 'The "|" character makes new columns'
//     let wrong_num_cols_msg = `🔎 ALK0000 WARNING: There should be 2 columns in a random test generator row, but there are ${ num_cols } column(s) in this row.`;
//     if ( num_cols > 2 ) {
//       wrong_num_cols_msg += ` ALKiln will use the first 2 columns.`;
//     } else {
//       // Missing columns will get the "placeholder" warning later
//     }
//     wrong_num_cols_msg += ` The row:\n${ row_str }`;
//     console.log( wrong_num_cols_msg );
//   }
//   return var_and_choices;
// }

// function get_normalized_values({ original=[] }) {
//   /** Given a list of 0 or more strings, return a list of at least 2 strings
//    *    followed by any remaining strings. If any of the 1st 2 values are
//    *    missing use placeholder values.
//    *
//    * @param {[str | undefined]} original List of 0 or more strings
//    *
//    * @returns {[str, str, any | undefined]} List of 2 or more strings
//    * */

//   let [ var_name, answers_str, ...other_columns ] = original;
//   var_name = var_name || ``;
//   if ( !var_name ) {
//     console.log(`🔎 ALK0000 WARNING: Missing the variable name in this random Scenario generator table row. ALKiln is putting in its own placeholder, "ALKILN_NO_VARIABLE_NAME_GIVEN"`);
//     var_name = `ALKILN_NO_VARIABLE_NAME_GIVEN`;
//   }

//   answers_str = answers_str || ``;
//   if ( !answers_str ) {
//     console.log(`🔎 ALK0000 WARNING: Missing the value choices in this random Scenario generator table row. ALKiln is putting in its own placeholder, "ALKILN_NO_VALUE_CHOICES_GIVEN"`);
//     answers_str = `ALKILN_NO_VALUE_CHOICES_GIVEN`;
//   }

//   return [ var_name, answers_str, ...other_columns ];
// }
