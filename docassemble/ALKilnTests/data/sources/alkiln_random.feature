@random_tests @success
Feature: I generate successful random tests

This line does not get parsed as a Scenario despite the Scenario: keyword
This line doesn't get added either

## TODO: Double or triple up on some of these tests if possible. Adds a lot of
##    time to tests to visit a new interview each time, which is unavoidable
##    with only one constraints Step allowed in each Scenario

## Tests to add:
## Table row is missing var name
## Table row is missing value choices
## Table row only has pipes
## Table row has 3 columns with a target var in the 3rd column and we add the
##    3rd column correctly
## Table row has more than 3 columns (and gets warning? nothing?)
## 1 invalid constraints test doesn't stop us from creating other tests

## Regex tests to add:
## TODO: handle "test" and "tests"
## TODO: Test answers that have extra whitespace in them preserve the
##    whitespace. Except for extra whitespace at the start and end of the cell
##    value. Gherkin removes that automatically.

Scenario: simplest random input Steps
  Given I start the interview at "test_kickout"
  And I generate 2 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

Scenario: I ask for too many unique tests
  Given I start the interview at "test_kickout"
  And I generate 3 random tests that get to any of ["kickout screen", "success screen"] when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

  @random_scenario_tag @rs_2
Scenario: tag starts a random input data Scenario
  Given I start the interview at "test_kickout"
  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

Scenario: line at end of random input data
  Given I start the interview at "test_kickout"
  And I generate 1 constrained random test that get to any of "kickout screen" or "success screen" with:
    | var | possible_values |
    | user_choice | correct;; wrong |
  Then I wait .01 seconds

Scenario: comment has Step text
  Given I start the interview at "test_kickout"
  # And I generate 1 constrained random test that get to ["kickout screen", "success screen"] when I pick from these possible answers:
  And I generate 1 constrained random test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
    | var | possible_values |
    | user_choice | correct;; wrong |

Scenario: unindented random input data
Given I start the interview at "test_kickout"
And I generate 1 constrained random test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
| var | possible_values |
| user_choice | correct;; wrong |

Scenario: Comments and empty rows in random input data options table
  Given I start the interview at "test_kickout"
  And I generate 1 constrained random test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
    # comment in table 1
    | var | possible_values |
    # comment in table 2

    | user_choice | correct;; wrong |

## TODO: As users: Behavior? In this case just let the test fail during the test
##  run?
Scenario: Non-table row in random input data options table
  Given I start the interview at "test_kickout"
  And I generate 1 constrained random test that get to any of ["kickout screen", "success screen"] when I pick from these possible answers:
    | var | possible_values |
    Then Non-table text
    | user_choice | correct;; wrong |

## =====================
## Warnings
## =====================

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

## TODO: Test no spaces between options

