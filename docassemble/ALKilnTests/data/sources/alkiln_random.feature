@random_tests @success
Feature: I generate successful random tests

This line does not get parsed as a Scenario despite the Scenario: keyword
This line doesn't get added either

## TODO: Double or triple up on some of these tests if possible. Adds a lot of
##    time to tests to visit a new interview each time, which is unavoidable
##    with only one constraints Step allowed in each Scenario

## Tests to add:
## 1 invalid constraints Scenario doesn't stop us from creating tests after that

## Regex tests to add:
## TODO: Test answers that have extra whitespace in them preserve the
##    whitespace. Except for extra whitespace at the start and end of the cell
##    value. Gherkin removes that automatically.

### Done: Both unit and integration tests
@temp_constrained
Scenario: simplest random input Steps
  Given I start the interview at "test_kickout"
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

### Done: Just unit
###Scenario: random answer choices have no extra whitespace
###  Given I start the interview at "test_kickout"
###  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
###    | var | possible_values |
###    | user_choice | correct;;wrong |
###
### Done: Just unit
###  @random_scenario_tag   @rs_2
###Scenario: tag starts a random input data Scenario
###  Given I start the interview at "test_kickout"
###  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
###    | var | possible_values |
###    | user_choice | correct;; wrong |
###
### DONE: Just unit
###Scenario: 3-column random answer table
###  Given I start the interview at "test_kickout"
###  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
###    | var | possible_values | column 3 becomes "target" |
###    | user_choice | correct;; wrong | user_choice |
###
##### DONE: Just unit
###Scenario: 4-column random answer table
###  Given I start the interview at "test_kickout"
###  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
###    | var | possible_values | column 3 becomes "target" | column 4 is ignored |
###    | user_choice | correct;; wrong | user_choice | is_ignored |

## Discuss: Should empty var columns have warnings? They're valid table rows. If
##    not, are these tests necessary?
## TODO: unit too
Scenario: random answers table is missing a var name
  Given the final Scenario status should be "failed"
  And the max seconds for each Step is 5 seconds
  And I start the interview at "test_kickout"
  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
    | var | possible_values |
    |  | correct;; wrong |

## TODO: unit too
Scenario: random answers table is missing values
  Given the final Scenario status should be "failed"
  And the max seconds for each Step is 5 seconds
  And I start the interview at "test_kickout"
  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
    | var | possible_values |
    | user_choice |  |

## TODO: unit too
Scenario: random answers table rows are empty
  Given the final Scenario status should be "failed"
  And the max seconds for each Step is 5 seconds
  And I start the interview at "test_kickout"
  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
    | var | possible_values |
    |  |  |

## TODO: Possibly test an empty 3rd and/or 4th column (no warnings for sure)

### Done: unit
###Scenario: line at end of random input data
###  Given I start the interview at "test_kickout"
###  And I generate 1 constrained random test that gets to any of "kickout screen" or "success screen" with:
###    | var | possible_values |
###    | user_choice | correct;; wrong |
###  Then I wait .01 seconds
###
###Done: unit
###Scenario: comment has Step text
###  Given I start the interview at "test_kickout"
###  # And I generate 1 constrained random test that gets to ["kickout screen", "success screen"] when I pick from these possible answers:
###  And I generate 1 constrained random test that gets to any of ["kickout screen", "success screen"] when I pick from these possible answers:
###    | var | possible_values |
###    | user_choice | correct;; wrong |
###
### Done: unit
###Scenario: unindented random input data
###Given I start the interview at "test_kickout"
###And I generate 1 constrained random test that gets to any of ["kickout screen", "success screen"] when I pick from these possible answers:
###| var | possible_values |
###| user_choice | correct;; wrong |
###
### Done: Just unit
###Scenario: Comments and empty rows in random input data options table
###  Given I start the interview at "test_kickout"
###  And I generate 1 constrained random test that gets to any of ["kickout screen", "success screen"] when I pick from these possible answers:
###    # comment in table 1
###    | var | possible_values |
###    # comment in table 2
###
###    | user_choice | correct;; wrong |

## =====================
## Warnings
## Both unit and integration tests tests
## =====================

## Done: Both unit and integration tests
Scenario: I'm warned with missing number in random answers generator
  Given I start the interview at "test_kickout"
  And I generate not a number random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

## Done: Both unit and integration tests
Scenario: I'm warned when I ask for too many unique tests
  Given I start the interview at "test_kickout"
  And I generate 3 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

