@random_tests @success
Feature: I generate valid constrained random answers tests

@should_get_warning
Scenario: With a missing number I get a warning and 1 generated test
  Given ALKiln will make _not a number_ random constrained tests
  And the Scenario report should include:
  """
  ALK0238
  """
  Given I start the interview at "test_kickout"
  And ALKiln will get to ["kickout screen", "success screen"] with any combination of:
    | var | possible_values |
    | user_choice | correct;; wrong |
