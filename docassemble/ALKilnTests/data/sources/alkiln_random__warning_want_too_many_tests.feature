@random_tests @success
Feature: I generate valid constrained random answers tests

@should_get_warning
Scenario: I'm warned when I ask for too many unique tests
  Given ALKiln will make 3 random constrained tests
  And the Scenario report should include:
  """
  ALK0258
  """
  Given I start the interview at "test_kickout"
  And ALKiln will get to ["kickout screen", "success screen"] with any combination of:
    | var | possible_values |
    | user_choice | correct;; wrong |
