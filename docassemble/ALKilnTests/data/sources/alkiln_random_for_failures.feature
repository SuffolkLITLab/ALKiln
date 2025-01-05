@random_tests @failure
Feature: I generate erroring random tests

## =====================
## Errors? (The Gherkin parser won't catch these)
## =====================
## Check for log code (and no file?)

## TODO: Both unit and integration
Scenario: I fail with 2 generator Steps in one Scenario
  Given I start the interview at "test_kickout"
  And I generate 2 constrained random answer test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
    | var | possible_values |
    | other_var | val1;; val2;; val3 |
  And I generate 1 constrained random test that gets to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

## TODO: Both unit and integration
Scenario: I fail with missing constrained random input Step
  Given I start the interview at "test_kickout"

## TODO: Both unit and integration
Scenario: I fail with missing Step start in random input data
  Given I start the interview at "test_kickout"
    | var | possible_values |
    | user_choice | correct;; wrong |

## TODO: Both unit and integration
Scenario: I fail with missing options table in random input data
  Given I start the interview at "test_kickout"
  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
  And no options table

## TODO: Both unit and integration
Scenario: I fail with missing ids in random input data
  Given I start the interview at "test_kickout"
  And I generate 1 random test that get to any of [] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
