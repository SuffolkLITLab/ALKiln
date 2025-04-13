@random_tests @success
Feature: I generate valid constrained random answers tests

# The 1st of 2 related tests. This 1st one tests uniqueness within one Scenario.

@should_get_warning
Scenario: First I'm warned when I ask for too many unique tests in one generator
  Given ALKiln will make 3 random constrained tests
  Given I start the interview at "test_kickout"
  And ALKiln will get to ["kickout screen", "success screen"] with any combination of:
    | var | possible_values |
    | user_choice | correct;; wrong |
