@random_tests
Feature: kdlsjf

TODO: get tags from Scenarios so authors can skip them
TODO: add random test tags to Feature and Scenarios

This does not get parsed as a Scenario: despite the Scenario keyword
TODO: can probably remove url and let dev do that as a first Step

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

Scenario: comment in random input data
  Given I start the interview at "all_tests"
  #number: 2
  number: 1
  url: all_tests
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |

Scenario: unindented input data
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

Scenario: Random rows in between constraint lines
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

Scenario: Comments and empty rows in options table
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

# TODO: In this case just let the test fail during the test run?
Scenario: Non-table row in options table
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
# Skipping scenarios
# =====================

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

Scenario: missing number in random input data
  Given I start the interview at "all_tests"
  url: all_tests
  ids: ["group of complex fields"]
  options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |

Scenario: missing all options parts in random input data
  number: 1
  url: all_tests
  ids: ["group of complex fields"]

Scenario: missing options start in random input data
  Given I start the interview at "all_tests"
  number: 1
  url: all_tests
  ids: ["group of complex fields"]
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |

Scenario: missing options table in random input data
  Given I start the interview at "all_tests"
  number: 1
  url: all_tests
  ids: ["group of complex fields"]
  options:
  No options table

