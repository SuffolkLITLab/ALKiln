@random_tests @failure
Feature: I generate erroring random tests

## =====================
## Errors? (The Gherkin parser won't catch these)
## =====================
## Check for log code (and no file?)

Scenario: I fail with missing constrained random input Step
  Given I start the interview at "test_kickout"

Scenario: I fail with missing Step start in random input data
  Given I start the interview at "test_kickout"
    | var | possible_values |
    | user_choice | correct;; wrong |

Scenario: I fail with missing options table in random input data
  Given I start the interview at "test_kickout"
  And I generate 1 random test and I get to any of ["kickout screen", "success screen"] when I pick from these constraints:
  And no options table

Scenario: I fail with missing ids in random input data
  Given I start the interview at "test_kickout"
  And I generate 1 random test and I get to any of [] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
