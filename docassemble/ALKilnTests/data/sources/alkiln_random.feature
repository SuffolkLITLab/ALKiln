@random_tests
Feature: I generate some random tests

This does not get parsed as a Scenario: despite the Scenario keyword
TODO: can probably remove url and let dev do that as a first Step
TODO: Make sure folks don't put semicolons on the end of answer
choices/variations when they don't mean to. Maybe warn about that, though still
use the value.

Scenario: normal random input data
  Given I start the interview at "all_tests"
  #number: 2
  number: 1
  url: all_tests
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

  @random_scenario_tag @rs_2
Scenario: tag starts a random input data Scenario
  Given I start the interview at "all_tests"
  #number: 2
  number: 1
  url: all_tests
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

Scenario: comment in random input data
  Given I start the interview at "all_tests"
  #number: 2
  number: 1
  url: all_tests
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |

Scenario: unindented random input data
Given I start the interview at "all_tests"
A number: 1
url: all_tests
ids: ["group of complex fields"]
options:
| var | possible_values |
| upload_files_visible | some_png_1.png;; some_png_2.png |

Scenario: out of order random input data
  Given I start the interview at "all_tests"
  url: all_tests
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  ids: ["group of complex fields"]
  number: 1

Scenario: Random rows in between random input data constraint lines
  Given I start the interview at "all_tests"
  #number: 2
  number: 1
  This row should be ignored
  url: all_tests
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

Scenario: Comments and empty rows in random input data options table
  Given I start the interview at "all_tests"
  #number: 2
  number: 1
  This row should be ignored
  url: all_tests
  ids: ["group of complex fields"]
  options:
    #
    | var | possible_values |
    #

    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

# TODO: As users: Behavior? In this case just let the test fail during the test
#  run?
Scenario: Non-table row in random input data options table
  Given I start the interview at "all_tests"
  #number: 2
  number: 1
  This row should be ignored
  url: all_tests
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    Non-table text
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

# =====================
# Warnings
# =====================

Scenario: duplicate keys in random input data
  Given I start the interview at "all_tests"
  number: 2
  number: 1
  url: other_url
  url: all_tests
  ids: ["other id"]
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    | other_var | val1;; val2;; val3 |
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

# TODO: Table row is missing var name
# TODO: Table row is missing value choices
# TODO: Table row only has pipes
# TODO: Table row has more than 2 columns
# TODO: Table row has more than 2 columns and has no var in column 1
# TODO: Table row has more than 2 columns and has no value choices in column 2

Scenario: number is not a number in random input tests
  Given I start the interview at "all_tests"
  number: not a number
  url: all_tests
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |
  Then the question id should be "group of complex fields"

# Check that this file was indeed created
Scenario: missing number in random input data
  Given I start the interview at "all_tests"
  url: all_tests
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |

# =====================
# Errors?
# =====================

# Check for log code (and no file?)
Scenario: missing all options parts in random input data
  number: 1
  url: all_tests
  ids: ["group of complex fields"]

# Check for log code (and no file?)
Scenario: missing options start in random input data
  Given I start the interview at "all_tests"
  number: 1
  url: all_tests
  ids: ["group of complex fields"]
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |

# Check for log code (and no file?)
Scenario: missing options table in random input data
  Given I start the interview at "all_tests"
  number: 1
  url: all_tests
  ids: ["group of complex fields"]
  options:
  No options table

#Scenario: missing url in random input data
#  Given I start the interview at "all_tests"
#  number: 1
#  ids: ["group of complex fields"]
#  options:
#    | var | possible_values |
#    | upload_files_visible | some_png_1.png;; some_png_2.png |
#
#Scenario: missing ids in random input data
#  Given I start the interview at "all_tests"
#  number: 1
#  url: all_tests
#  options:
#    | var | possible_values |
#    | upload_files_visible | some_png_1.png;; some_png_2.png |

