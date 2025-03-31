/** Actual and expected values for INvalid constrained random answer tests. */

module.exports = fixts = {};

/** Research notes
 * 
 * Valid: A feature is valid without a description
 * Valid: A scenario is valid without a description
 * 
 * TODO
 * Research: Can we get back null or undefined without syntax errors? (unlikely)
 * Research: Can feature.children[0] exist without a `.scenario` prop? (unlikely)
 * */

fixts.generator_missing_contents = {};
fixts.generator_missing_contents.arg = ``;
fixts.generator_missing_contents.expected = null;
fixts.generator_missing_contents.error_codes = [ `ALK0254` ];
fixts.generator_missing_contents.log_codes = [ `ALK0254` ];

fixts.generator_missing_Feature = {};
fixts.generator_missing_Feature.arg = `Scenario: Invalid feature file`;
fixts.generator_missing_Feature.expected = null;
fixts.generator_missing_Feature.error_codes = [ `ALK0236` ];
fixts.generator_missing_Feature.log_codes = [ `ALK0236` ];

fixts.generator_0_Scenarios = {};
fixts.generator_0_Scenarios.arg = `Feature: No scenarios`;
fixts.generator_0_Scenarios.expected = null;
fixts.generator_0_Scenarios.error_codes = [ `ALK0256` ];
fixts.generator_0_Scenarios.log_codes = [ `ALK0256` ];


// fixts.multiple_constraints_Steps = {};
// fixts.multiple_constraints_Steps.arg =
// `Feature: I generate constrained random tests

// Scenario: I fail with 2 generator Steps in 1 Scenario
//   Given ALKiln makes 2 constrained answers tests
//   Given I start the interview at "test_kickout"
//   And I generate 2 constrained random tests that get to "end" when I pick from:
//     | var | possible_values |
//     | other_var | val1;; val2;; val3 |
//   And I generate 1 constrained random test that gets to "end" when I pick from:
//     | var | possible_values |
//     | user_choice | correct;; wrong |
// `;
// // ======= ENDS ARG ======= //
// fixts.multiple_constraints_Steps.expected = null;
// fixts.multiple_constraints_Steps.error_codes = [ `ALK0240`, `ALK0246` ];
// fixts.multiple_constraints_Steps.log_codes = [ `ALK0240`, `ALK0246` ];


fixts.no_constraints_Step = {};
fixts.no_constraints_Step.arg =
`Feature: I generate constrained random tests

Scenario: I fail with missing constrained random input Step
  Given ALKiln makes 2 constrained random answers tests
  Given the final Scenario status should be "failed"
  Given I start the interview at "test_kickout"
`;
fixts.no_constraints_Step.expected = null;
fixts.no_constraints_Step.error_codes = [ `ALK0241`, `ALK0246` ];
fixts.no_constraints_Step.log_codes = [ `ALK0241`, `ALK0246` ];


/**
 * Missing fore_Step keywords
 * Missing constraints Step keywords
 * */

fixts.missing_fore_Step_keywords = {};
fixts.missing_fore_Step_keywords.arg =
`Feature: I generate constrained random tests

Scenario: I fail with missing keywords for a constraints Step
  Given ALKiln makes 2
  Given the final Scenario status should be "failed"
  Given I start the interview at "test_kickout"
  And ALKiln tests get to "end" with:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
fixts.missing_fore_Step_keywords.expected = null;
fixts.missing_fore_Step_keywords.error_codes = [ `ALK0241`, `ALK0246` ];
fixts.missing_fore_Step_keywords.log_codes = [ `ALK0241`, `ALK0246` ];


fixts.missing_constraints_Step_keywords = {};
fixts.missing_constraints_Step_keywords.arg =
`Feature: I generate constrained random tests

Scenario: I fail with missing keywords for a constraints Step
  Given ALKiln makes 2 constrained random answers tests
  Given the final Scenario status should be "failed"
  Given I start the interview at "test_kickout"
  And tests get to "end" with:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
fixts.missing_constraints_Step_keywords.expected = null;
fixts.missing_constraints_Step_keywords.error_codes = [ `ALK0241`, `ALK0246` ];
fixts.missing_constraints_Step_keywords.log_codes = [ `ALK0241`, `ALK0246` ];


fixts.missing_table = {};
fixts.missing_table.arg =
`Feature: I generate constrained random tests

Scenario: I fail with a missing table
  Given ALKiln makes 2 constrained random answers tests
  Given the final Scenario status should be "failed"
  Given I start the interview at "test_kickout"
  And ALKiln tests get to "end" with:
`;
// ======= ENDS ARG ======= //
fixts.missing_table.expected = null;
fixts.missing_table.error_codes = [ `ALK0239`, `ALK0246` ];
fixts.missing_table.log_codes = [ `ALK0239`, `ALK0246` ];


fixts.too_many_Steps_with_2_missing_tables = {};
fixts.too_many_Steps_with_2_missing_tables.arg =
`Feature: I generate constrained random tests

Scenario: I fail with 2 constraints Steps in 1 Scenario
  Given ALKiln makes 2 constrained random answers tests
  Given the final Scenario status should be "failed"
  Given I start the interview at "test_kickout"
  And ALKiln tests get to "end" with:
  And ALKiln tests get to "end" with:
  And ALKiln tests get to "end" with:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
// ======= ENDS ARG ======= //
fixts.too_many_Steps_with_2_missing_tables.expected = null;
fixts.too_many_Steps_with_2_missing_tables.error_codes = [ `ALK0239`, `ALK0239`, `ALK0240`, `ALK0246` ];
fixts.too_many_Steps_with_2_missing_tables.log_codes = [ `ALK0239`, `ALK0239`, `ALK0240`, `ALK0246` ];


fixts.missing_ids = {};
fixts.missing_ids.arg =
`Feature: I generate constrained random tests

Scenario: I fail with missing quoted ids in constrained random answers
  Given ALKiln makes 2 constrained random answers tests
  Given the final Scenario status should be "failed"
  Given I start the interview at "test_kickout"
  And ALKiln will get to end with:
    | var | possible_values |
    | user_choice | correct;; wrong |
`;
// ======= ENDS ARG ======= //
fixts.missing_ids.expected = null;
fixts.missing_ids.error_codes = [ `ALK0245`, `ALK0246` ];
fixts.missing_ids.log_codes = [ `ALK0245`, `ALK0246` ];


// A valid generator Scenario, but an erroring test when run in cucumber, so it
// will error here instead
fixts.only_row_is_header = {};
fixts.only_row_is_header.arg =
`Feature: I generate constrained random tests

Scenario: Non-table row after table header
  Given ALKiln makes 2 constrained random answers tests
  Given the final Scenario status should be "failed"
  Given I start the interview at "test_kickout"
  And ALKiln will get to "end" with:
    | var | possible_values |
    Then non-table line
    | user_choice | correct;; wrong |
`;
fixts.only_row_is_header.expected = null;
fixts.only_row_is_header.error_codes = [`ALK0242`, `ALK0246`];
fixts.only_row_is_header.log_codes = [`ALK0242`, `ALK0246`];

/**
 * No test for a table interrupted in the middle of regular rows (the parser
 * can't detect it)
 * */

