/** Actual and expected values for valid constrained random answer tests. */

// const GENERATOR_STEP_STANDARD = `And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:`
// const GO_TO = `Given I start the interview at "test_kickout"`;
// const STORY_TABLE_STEP = `And I get to any of the question ids ["kickout screen", "success screen"] with this data:`;
// const STORY_TABLE_HEADER = `| var | value |`;
// const F_TAG = `alkiln_randomized`;
// const S_TAG_START = `${ F_TAG }_generator`;
// const F_INSERT = `with ALKiln randomization`;
// const S_INSERT_START = `ALKiln random test generator`;
// const SIMPLE_FEATURE_START_ARG =
// `@random_unit_tests
// Feature: I generate random tests\n\n`;
// const SIMPLE_FEATURE_START_EXPECTED =
// `@random_unit_tests @${ F_TAG }
// Feature: I generate random tests ${ F_INSERT }\n\n`;

/**
 * TODO:
 * - Get all the different combos to match generator Step text ("constrain", "random", etc.)
 * - Test a row with only one choice always chooses that choice? Unnecessary?
 * */


module.exports = fixts = {};

fixts.RANDOM_TABLE_PLACEHOLDER = `@@@ ALK_RANDOM_TABLE_BODY_PLACEHOLDER @@@`;

/**
 * ===========
 * Simplest test
 * =========== */
fixts.simple = simple = {};
// Research: Why does this work both with and without a new line at the end?
simple.arg =
`Feature: I generate random tests

Scenario: simplest random answers
  Given I start the interview at "test_kickout"
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
    | row_2 | answer1;; answer2;; answer3 |`;
// ======= ENDS ARG ======= //
simple.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_2
Scenario: simplest random answers ALKiln random test generator1_scenario1_of_2
  Given I start the interview at "test_kickout"
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }

@alkiln_randomized_generator1_scenario2_of_2
Scenario: simplest random answers ALKiln random test generator1_scenario2_of_2
  Given I start the interview at "test_kickout"
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;
// ======= ENDS EXPECTED ======= //


/**
 * ===========
 * Complex:
 * - 3 Scenarios with extra "Scenario:" keyword not counted (from 2 generator Scenarios)
 *   - Able to generate just one Scenario
 * - Text under Feature
 * - Inconsistent tag spacing
 * - Inconsistent table indentation
 * - A Step after the table
 * - Comments in between Scenarios repeat for each generated Scenario
 * - Comments in the Scenario repeats
 * - Comments in the table
 * - Comment has generator Step text and it doesn't get changed
 * =========== */
fixts.complex = complex = {};
complex.arg =
`Feature: I generate random tests

Line 1 after Feature that includes Scenario: keyword

Scenario: generate complex 1
  # Comment 1 keep and repeat
  Given I start the interview at "test_kickout"
# Comment 2 keep and repeat
  And I generate 2 random tests that get to any of "kickout screen", "success screen" when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
  And I wait 0.1 second

Scenario: generate complex 2
  # Comment 7 keep
  Given I start the interview at "interview_2"
  # And I generate 1 random test that gets to any of "end" when I pick from these constraints:
  And I generate 1 random test that gets to any of "end" when I pick from these constraints:
  | var | possible_values |
  | question_1 | opt1;; opt2;; opt3 |
  | question_2 | optA;; optB;; optC |
`;
// ======= ENDS ARG ======= //
complex.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

Line 1 after Feature that includes Scenario: keyword

@alkiln_randomized_generator1_scenario1_of_2
Scenario: generate complex 1 ALKiln random test generator1_scenario1_of_2
  # Comment 1 keep and repeat
  Given I start the interview at "test_kickout"
# Comment 2 keep and repeat
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
  And I wait 0.1 second

@alkiln_randomized_generator1_scenario2_of_2
Scenario: generate complex 1 ALKiln random test generator1_scenario2_of_2
  # Comment 1 keep and repeat
  Given I start the interview at "test_kickout"
# Comment 2 keep and repeat
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
  And I wait 0.1 second

@alkiln_randomized_generator2_scenario1_of_1
Scenario: generate complex 2 ALKiln random test generator2_scenario1_of_1
  # Comment 7 keep
  Given I start the interview at "interview_2"
  # And I generate 1 random test that gets to any of "end" when I pick from these constraints:
  And I get to any of the question ids ["end"] with this data:
  | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;
// ======= ENDS EXPECTED ======= //

/** Existing Feature and Scenario tags are preserved */
fixts.tags = tags = {};
tags.arg =
`@feature_tag1 @feature_tag2
Feature: I generate random tests

@scenario_tag1 @scenario_tag2
Scenario: simplest random answers
  Given I start the interview at "test_kickout"
  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |`;
// ======= ENDS ARG ======= //
tags.expected =
`@feature_tag1 @feature_tag2 @alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@scenario_tag1 @scenario_tag2 @alkiln_randomized_generator1_scenario1_of_1
Scenario: simplest random answers ALKiln random test generator1_scenario1_of_1
  Given I start the interview at "test_kickout"
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;


/**
 * WEIRD SPACING
 * - [x] Feature tags have extra spaces and are indented
 * - [x] Scenario tags have extra spaces and are indented
 * - [x] Weird indention, including table
 * - [x] No space between choices (no expected value)
 * */

fixts.weird_spacing = {};

/** Weird spacing is preserved in all tag types */
fixts.weird_spacing.tags = {};
fixts.weird_spacing.tags.arg =
`  @feature_tag    @spacing       
Feature: I generate random tests

    @scenario_tag    @spacing    
Scenario: a scenario
  Given I start the interview at "test_kickout"
  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
// ======= ENDS ARG ======= //
fixts.weird_spacing.tags.expected =
`  @feature_tag    @spacing        @alkiln_randomized
Feature: I generate random tests with ALKiln randomization

    @scenario_tag    @spacing     @alkiln_randomized_generator1_scenario1_of_1
Scenario: a scenario ALKiln random test generator1_scenario1_of_1
  Given I start the interview at "test_kickout"
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;
// ======= ENDS EXPECTED ======= //


/** Weird spacing is preserved in all tag types */
fixts.weird_spacing.tags_line_2 = {};
fixts.weird_spacing.tags_line_2.arg =
`
@line_2_tag
Feature: I generate random tests

Scenario: a scenario
  Given I start the interview at "test_kickout"
  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
// ======= ENDS ARG ======= //
fixts.weird_spacing.tags_line_2.expected =
`
@line_2_tag @alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_1
Scenario: a scenario ALKiln random test generator1_scenario1_of_1
  Given I start the interview at "test_kickout"
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;
// ======= ENDS EXPECTED ======= //


/** Various lines are not indented the usual way */
fixts.weird_spacing.indents = {};
fixts.weird_spacing.indents.arg =
`    Feature: I generate random tests

 Scenario: a scenario
# Comment line
   Given I start the interview at "interview_2"
  And I generate 1 random test that gets to any of "end" when I pick from these constraints:
| var | possible_values |
  | question_1 | opt1;; opt2;; opt3 |
  | question_2 | optA;; optB;; optC |
`;
// ======= ENDS ARG ======= //
fixts.weird_spacing.indents.expected =
`@alkiln_randomized
    Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_1
 Scenario: a scenario ALKiln random test generator1_scenario1_of_1
# Comment line
   Given I start the interview at "interview_2"
  And I get to any of the question ids ["end"] with this data:
| var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;
// ======= ENDS EXPECTED ======= //


/** No spacing between choices (No `.expected` val. Different kind of test) */
fixts.weird_spacing.choices = {};
fixts.weird_spacing.choices.arg =
`Feature: I generate random tests

Scenario: a scenario
  Given I start the interview at "test_kickout"
  And I generate 1 constrained random test that gets to "end" when I pick from:
    | var | possible_values |
    | user_choice | correct;;wrong |
`;
// ======= ENDS ARG ======= //
fixts.weird_spacing.choices.expected = `Not appropriate to use use expected value for this test.`;
// ======= ENDS EXPECTED ======= //
fixts.weird_spacing.choices.find_1 = /(?:correct)|(?:wrong)/;
// ======= ENDS OPTIONS TO FIND ONE OF ======= //


/**
 * ===========
 * Column shenanigans
 * =========== */
fixts.columns_3 = {};
// Research: Why does this work both with and without a new line at the end?
fixts.columns_3.arg =
`Feature: I generate random tests

Scenario: 3 columns
  Given I start the interview at "file.yml"
  And I generate 1 constrained random test that gets to "end" when I pick from:
    | var | possible_values | column 3 becomes "trigger" |
    | users[0].has_bear | True | users[0].name.first |`;
// ======= ENDS ARG ======= //
fixts.columns_3.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_1
Scenario: 3 columns ALKiln random test generator1_scenario1_of_1
  Given I start the interview at "file.yml"
  And I get to any of the question ids ["end"] with this data:
    | var | value | trigger |
    | users[0].has_bear | True | users[0].name.first |
`;
// ======= ENDS EXPECTED ======= //


fixts.columns_4 = {};
// Research: Why does this work both with and without a new line at the end?
fixts.columns_4.arg =
`Feature: I generate random tests

Scenario: 4 columns
  Given I start the interview at "file.yml"
  And I generate 1 constrained random test that gets to "end" when I pick from:
    | var | possible_values | column 3 becomes "target" | column 4 is ignored |
    | users[0].has_bear | True | users[0].name.first | is_ignored |`;
// ======= ENDS ARG ======= //
fixts.columns_4.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_1
Scenario: 4 columns ALKiln random test generator1_scenario1_of_1
  Given I start the interview at "file.yml"
  And I get to any of the question ids ["end"] with this data:
    | var | value | trigger |
    | users[0].has_bear | True | users[0].name.first |
`;
// ======= ENDS EXPECTED ======= //


/**
 * ===========
 * Row shenanigans
 * =========== */
fixts.rows_comments = {};
fixts.rows_comments.arg =
`Feature: I generate random tests

Scenario: Comment before and in table
  Given I start the interview at "file.yml"
  And I generate 1 constrained random tests that get to "end" when I pick from:
    # Comment 1 remove
    | var | possible_values |
# Comment 2 remove
    | user_choice | correct;; wrong |
`;
fixts.rows_comments.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_1
Scenario: Comment before and in table ALKiln random test generator1_scenario1_of_1
  Given I start the interview at "file.yml"
  And I get to any of the question ids ["end"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;


fixts.comment_after_last_row = {};
fixts.comment_after_last_row.arg =
`Feature: I generate random tests

Scenario: Comment after table
  Given I start the interview at "file.yml"
  And I generate 2 constrained random tests that get to "end" when I pick from:
    | var | possible_values |
    | user_choice | correct;; wrong |
    # Comment 1 keep and repeat

# Comment 2 keep and repeat
`;
fixts.comment_after_last_row.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_2
Scenario: Comment after table ALKiln random test generator1_scenario1_of_2
  Given I start the interview at "file.yml"
  And I get to any of the question ids ["end"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
    # Comment 1 keep and repeat

# Comment 2 keep and repeat

@alkiln_randomized_generator1_scenario2_of_2
Scenario: Comment after table ALKiln random test generator1_scenario2_of_2
  Given I start the interview at "file.yml"
  And I get to any of the question ids ["end"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
    # Comment 1 keep and repeat

# Comment 2 keep and repeat
`;


fixts.rows_empty = {};
fixts.rows_empty.arg =
`Feature: I generate random tests

Scenario: Empty rows before and in table
  Given I start the interview at "file.yml"
  And I generate 1 constrained random tests that get to "end" when I pick from:

    | var | possible_values |

    | user_choice | correct;; wrong |
`;
fixts.rows_empty.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_1
Scenario: Empty rows before and in table ALKiln random test generator1_scenario1_of_1
  Given I start the interview at "file.yml"
  And I get to any of the question ids ["end"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;


/**
 * ===========
 * Warnings
 * =========== */
fixts.warnings = {};


// Why error?
// TODO: add warning to output
// Discuss: add a "strict mode" to fail on warnings?
fixts.warnings.no_number = {};
fixts.warnings.no_number.arg =
`Feature: I generate random tests

Scenario: I'm warned with missing number in random answers generator
  Given I start the interview at "test_kickout"
  And I generate not a number constrained random tests that get to "end" when I pick from:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
fixts.warnings.no_number.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_1
Scenario: I'm warned with missing number in random answers generator ALKiln random test generator1_scenario1_of_1
  Given I start the interview at "test_kickout"
  And I get to any of the question ids ["end"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;
fixts.warnings.no_number.codes = [``];


// More appropriate for an error
// TODO: add warning to output
fixts.warnings.multiple_numbers = {};
fixts.warnings.multiple_numbers.arg =
`Feature: I generate random tests

Scenario: I'm warned with too many numbers in random input data
  Given I start the interview at "test_kickout"
  And I generate 4 2 constrained random tests that get to "end" when I pick from:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
fixts.warnings.multiple_numbers.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_2
Scenario: I'm warned with too many numbers in random input data ALKiln random test generator1_scenario1_of_2
  Given I start the interview at "test_kickout"
  And I get to any of the question ids ["end"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }

@alkiln_randomized_generator1_scenario2_of_2
Scenario: I'm warned with too many numbers in random input data ALKiln random test generator1_scenario2_of_2
  Given I start the interview at "test_kickout"
  And I get to any of the question ids ["end"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;
fixts.warnings.multiple_numbers.codes = [``];
