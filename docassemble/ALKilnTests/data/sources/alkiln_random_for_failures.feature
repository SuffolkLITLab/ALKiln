@random_tests @failure
Feature: I generate erroring random tests

## =====================
## Errors?
## =====================

## Check for log code (and no file?)
Scenario: I fail with missing all options parts in random input data
  And number: 1
  And url: all_tests
  And ids: ["group of complex fields"]

## Check for log code (and no file?)
Scenario: I fail with missing options start in random input data
  Given I start the interview at "all_tests"
  And number: 1
  And url: all_tests
  And ids: ["group of complex fields"]
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |

## Check for log code (and no file?)
Scenario: I fail with missing options table in random input data
  Given I start the interview at "all_tests"
  And number: 1
  And url: all_tests
  And ids: ["group of complex fields"]
  And options:
  And No options table

Scenario: I fail with missing ids in random input data
  Given I start the interview at "all_tests"
  And number: 1
  And url: all_tests
  And options:
    | var | possible_values |
    | upload_files_visible | some_png_1.png;; some_png_2.png |

##Scenario: I fail with missing url in random input data
##  Given I start the interview at "all_tests"
##  And number: 1
##  And ids: ["group of complex fields"]
##  And options:
##    | var | possible_values |
##    | upload_files_visible | some_png_1.png;; some_png_2.png |
