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
