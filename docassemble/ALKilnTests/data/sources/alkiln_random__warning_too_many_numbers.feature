@random_tests @success
Feature: I generate valid constrained random answers tests

@should_get_warning
Scenario: With too many numbers and number Steps I get a warning and ALKiln uses the final number
  Given ALKiln makes 3 2 constrained random tests
  Given ALKiln makes 4 1 constrained random tests
  Given I start the interview at "test_loops"
  And ALKiln will get to ["person name"] with any combination of:
    | var | possible_values |
    | x.there_are_any | False |
