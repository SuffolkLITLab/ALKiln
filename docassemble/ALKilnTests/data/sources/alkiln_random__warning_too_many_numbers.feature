@random_tests @success
Feature: I generate valid constrained random answers tests

@should_get_warning
Scenario: With too many numbers and number Steps I get a warning and use the final number
  Given ALKiln makes 3 2 constrained random tests
  Given ALKiln makes 4 1 constrained random tests
  And the Scenario report should include:
  """
  ALK0239
  """
  And the Scenario report should include:
  """
  ALK0237
  """
  Given I start the interview at "test_kickout"
  And ALKiln will get to ["kickout screen", "success screen"] with any combination of:
    | var | possible_values |
    | user_choice | correct;; wrong |
