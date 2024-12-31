/** Actual and expected values for constrained random answer tests. */

// const GENERATOR_STEP_STANDARD = `And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:`
const GO_TO = `Given I start the interview at "test_kickout"`;
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


module.exports = fixts = {};

fixts.RANDOM_TABLE_PLACEHOLDER = `@@@ ALK_RANDOM_TABLE_BODY_PLACEHOLDER @@@`;

/**
 * ===========
 * Simplest test
 * =========== */
fixts.simple = simple = {};
// Research: Why does this work both with and without a new line at the end?
simple.arg =
`@random_unit_tests
Feature: I generate random tests

Scenario: simplest random answers
  Given I start the interview at "test_kickout"
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |`;
// ======= ENDS ARG ======= //
simple.expected =
`@random_unit_tests @alkiln_randomized
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
`@random_unit_tests    @keep_spacing_1
Feature: I generate random tests

Line 1 after Feature that includes Scenario: keyword

  @tag_keep    @keep_spacing_2
Scenario: generate complex 1
  # Comment 1 keep and repeat
  Given I start the interview at "test_kickout"
# Comment 2 keep and repeat
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    # Comment 3 remove
    | var | possible_values |
# Comment 4 remove
    | user_choice | correct;; wrong |
    # Comment 5 keep and repeat
  And I wait 0.1 second

# Comment 6 keep and repeat

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
`@random_unit_tests    @keep_spacing_1 @alkiln_randomized
Feature: I generate random tests with ALKiln randomization

Line 1 after Feature that includes Scenario: keyword

  @tag_keep    @keep_spacing_2 @alkiln_randomized_generator1_scenario1_of_2
Scenario: generate complex 1 ALKiln random test generator1_scenario1_of_2
  # Comment 1 keep and repeat
  Given I start the interview at "test_kickout"
# Comment 2 keep and repeat
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
    # Comment 5 keep and repeat
  And I wait 0.1 second

# Comment 6 keep and repeat

  @tag_keep    @keep_spacing_2 @alkiln_randomized_generator1_scenario2_of_2
Scenario: generate complex 1 ALKiln random test generator1_scenario2_of_2
  # Comment 1 keep and repeat
  Given I start the interview at "test_kickout"
# Comment 2 keep and repeat
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
    # Comment 5 keep and repeat
  And I wait 0.1 second

# Comment 6 keep and repeat

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

/**
 * TODO:
 * - Get all the different combos to match generator Step text (constraint, random, etc.)
 * - Test a row with one choice always chooses that choice? Unnecessary?
 * */
