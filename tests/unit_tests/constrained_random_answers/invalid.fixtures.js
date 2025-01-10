/** Actual and expected values for INvalid constrained random answer tests. */

module.exports = fixts = {};

fixts.RANDOM_TABLE_PLACEHOLDER = `@@@ ALK_RANDOM_TABLE_BODY_PLACEHOLDER @@@`;

/**
 * ===========
 * Simplest test
 * =========== */
fixts.multiple_generator_Steps = {};
fixts.multiple_generator_Steps.arg =
`Feature: I generate random tests

Scenario: I fail with 2 generator Steps in 1 Scenario
  Given I start the interview at "form_entrypoint_file_name"
  And I generate 2 constrained random tests that get to ["kickout screen", "success screen"] when I pick from:
    | var | possible_values |
    | other_var | val1;; val2;; val3 |
  And I generate 1 constrained random test that gets to ["kickout screen", "success screen"] when I pick from:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
// ======= ENDS ARG ======= //
fixts.multiple_generator_Steps.expected = null;
// TODO: implement below
fixts.multiple_generator_Steps.includes = 
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_invalid_randomized_generator_scenario
Scenario: I fail with 2 generator Steps in 1 Scenario ALKiln random test invalid_randomized_generator_scenario
  Given my random generator Scenario was invalid with this message: 
`;
// ======= ENDS EXPECTED ======= //
fixts.multiple_generator_Steps.codes = [``];






// A valid generator Scenario, but an erroring test when run in cucumber
// TODO: Generate a warning? Inconsistent behavior confusing? And yet
//    a generator is also confusing and they may think the generator is making
//    a mistake.
fixts.only_row_is_header = {};
fixts.only_row_is_header.arg =
`Feature: I generate random tests

Scenario: Non-table row after table header
  Given the final Scenario status should be "failed"
  Given I start the interview at "test_kickout"
  And I generate 1 constrained random test that gets to ["kickout screen", "success screen"] when I pick from:
    | var | possible_values |
    Then non-table line
    | user_choice | correct;; wrong |
`;
fixts.only_row_is_header.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_1
Scenario: Non-table row after table header ALKiln random test generator1_scenario1_of_1
  Given the final Scenario status should be "failed"
  Given I start the interview at "test_kickout"
  And I get to any of the question ids ["kickout screen", "success screen"] with this data:
    | var | value |
    Then non-table line
    | user_choice | correct;; wrong |
`;
fixts.only_row_is_header.codes = [``];

// No test for a table interrupted in the middle (the generator can't detect it)

fixts.warnings.too_many_requested = {};
fixts.warnings.too_many_requested.arg =
`Feature: I generate random tests

Scenario: Too many tests requested to keep them unique
  Given I start the interview at "file.yml"
  And I generate 3 constrained random tests that get to "end" when I pick from:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
fixts.warnings.too_many_requested.expected =
`@alkiln_randomized
Feature: I generate random tests with ALKiln randomization

@alkiln_randomized_generator1_scenario1_of_3
Scenario: Too many tests requested to keep them unique ALKiln random test generator1_scenario1_of_3
  Given I start the interview at "file.yml"
  And I get to any of the question ids ["end"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }

@alkiln_randomized_generator1_scenario2_of_3
Scenario: Too many tests requested to keep them unique ALKiln random test generator1_scenario2_of_3
  Given I start the interview at "file.yml"
  And I get to any of the question ids ["end"] with this data:
    | var | value |
${ fixts.RANDOM_TABLE_PLACEHOLDER }
`;
fixts.warnings.too_many_requested.find_2 = [`correct`, `wrong`];
fixts.warnings.too_many_requested.codes = [``];
