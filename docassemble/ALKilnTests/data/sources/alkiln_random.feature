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

### Done: Both unit and integrated
@temp_constrained
Scenario: simplest random input Steps
  Given I start the interview at "test_kickout"
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

## TODO: Just unit
Scenario: random answer choices have no extra whitespace
  Given I start the interview at "test_kickout"
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;;wrong |

###  @random_scenario_tag   @rs_2
###Scenario: tag starts a random input data Scenario
###  Given I start the interview at "test_kickout"
###  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
###    | var | possible_values |
###    | user_choice | correct;; wrong |

## TODO: Just unit
Scenario: 3-column random answer table
  Given I start the interview at "test_kickout"And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
    | var | possible_values | column 3 becomes "target" |
    | user_choice | correct;; wrong | user_choice |

## TODO: Just unit
Scenario: 4-column random answer table
  Given I start the interview at "test_kickout"And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
    | var | possible_values | column 3 becomes "target" | column 4 is ignored |
    | user_choice | correct;; wrong | user_choice | is_ignored |

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

###Scenario: line at end of random input data
###  Given I start the interview at "test_kickout"
###  And I generate 1 constrained random test that get to any of "kickout screen" or "success screen" with:
###    | var | possible_values |
###    | user_choice | correct;; wrong |
###  Then I wait .01 seconds
###
###Scenario: comment has Step text
###  Given I start the interview at "test_kickout"
###  # And I generate 1 constrained random test that get to ["kickout screen", "success screen"] when I pick from these possible answers:
###  And I generate 1 constrained random test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
###    | var | possible_values |
###    | user_choice | correct;; wrong |
###
###Scenario: unindented random input data
###Given I start the interview at "test_kickout"
###And I generate 1 constrained random test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
###| var | possible_values |
###| user_choice | correct;; wrong |

## TODO: Just unit
Scenario: Comments and empty rows in random input data options table
  Given I start the interview at "test_kickout"
  And I generate 1 constrained random test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
    # comment in table 1
    | var | possible_values |
    # comment in table 2

    | user_choice | correct;; wrong |

## TODO: As users: Behavior? In this case just let the test fail during the test
##  run?
## This might cause a failure from "undefined"
## TODO: Both unit and integrated
Scenario: Non-table row in random input data options table
  Given the final Scenario status should be "undefined"
  Given I start the interview at "test_kickout"
  And I generate 1 constrained random test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
    | var | possible_values |
    Then Non-table text
    | user_choice | correct;; wrong |

## =====================
## Warnings
## TODO: Both unit and integrated
## =====================

Scenario: I ask for too many unique tests
  Given I start the interview at "test_kickout"
  And I generate 3 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

## Not sure what to do in this case. Delete incorrect instances of Step?
Scenario: I'm warned with multiple random answers Steps
  Given I start the interview at "test_kickout"
  And I generate 2 constrained random answer test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
    | var | possible_values |
    | other_var | val1;; val2;; val3 |
  And I generate 1 constrained random test that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

Scenario: I'm warned with number is not a number in random input tests
  Given I start the interview at "test_kickout"
  And I generate not a number random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

## Check that this file was indeed created
## Check that it created 1 constrained random test even if it used the word "tests".
## Alternative behavior: make diferent # of tests based on grammar: 1 (internal) test for "test" and 2 tests for "tests".
Scenario: I'm warned with missing number in random input data
  Given I start the interview at "test_kickout"
  And I generate random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

Scenario: I'm warned with too many numbers in random input data
  Given I start the interview at "test_kickout"
  And I generate 4 1 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

