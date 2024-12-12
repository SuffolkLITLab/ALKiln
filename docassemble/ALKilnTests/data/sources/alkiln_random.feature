@random_tests @success
Feature: I generate successful random tests

This line does not get parsed as a Scenario despite the Scenario: keyword

## TODO: can probably remove url and let dev do that as a first Step
## TODO: Warn if Feature is missing? Maybe just let the test fail?
## TODO: Make sure folks don't put semicolons on the end of answer
## choices/variations when they don't mean to. Maybe warn about that, though
##   still use the value.

## tests to add:
## TODO: Table row is missing var name
## TODO: Table row is missing value choices
## TODO: Table row only has pipes
## TODO: Table row has more than 2 columns
## TODO: Table row has more than 2 columns and has no var in column 1
## TODO: Table row has more than 2 columns and has no value choices in column 2

Scenario: normal random input data
  Given I start the interview at "all_tests"
  And number: 1
  And url: all_tests
  And ids: ["group of complex fields"]
  And options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

  @random_scenario_tag @rs_2
Scenario: tag starts a random input data Scenario
  Given I start the interview at "all_tests"
  And number: 1
  And url: all_tests
  And ids: ["group of complex fields"]
  And options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

Scenario: comment in random input data
  Given I start the interview at "all_tests"
  #And number: 2
  And number: 1
  And url: all_tests
  And ids: ["group of complex fields"]
  And options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |

Scenario: unindented random input data
Given I start the interview at "all_tests"
And number: 1
And url: all_tests
And ids: ["group of complex fields"]
And options:
| var | possible_values |
| upload_files_visible | some_png_1.png;; some_png_2.png |

Scenario: out of order random input data
  Given I start the interview at "all_tests"
  And url: all_tests
  And options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  And ids: ["group of complex fields"]
  And number: 1

Scenario: Random rows in between random input data constraint lines
  Given I start the interview at "all_tests"
  And number: 1
  And This row should be ignored
  And url: all_tests
  And ids: ["group of complex fields"]
  And options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

Scenario: Comments and empty rows in random input data options table
  Given I start the interview at "all_tests"
  And number: 1
  And url: all_tests
  And ids: ["group of complex fields"]
  And options:
    #
    | var | possible_values |
    #

    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

## TODO: As users: Behavior? In this case just let the test fail during the test
##  run?
Scenario: Non-table row in random input data options table
  Given I start the interview at "all_tests"
  And number: 1
  And url: all_tests
  And ids: ["group of complex fields"]
  And options:
    | var | possible_values |
    Then Non-table text
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

## =====================
## Warnings
## =====================

Scenario: duplicate keys in random input data
  Given I start the interview at "all_tests"
  And number: 3
  And number: 1
  And url: other_url
  And url: all_tests
  And ids: ["other id"]
  And ids: ["group of complex fields"]
  And options:
    | var | possible_values |
    | other_var | val1;; val2;; val3 |
  And options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

Scenario: number is not a number in random input tests
  Given I start the interview at "all_tests"
  And number: not a number
  And url: all_tests
  And ids: ["group of complex fields"]
  And options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

## Check that this file was indeed created
Scenario: missing number in random input data
  Given I start the interview at "all_tests"
  And url: all_tests
  And ids: ["group of complex fields"]
  And options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
