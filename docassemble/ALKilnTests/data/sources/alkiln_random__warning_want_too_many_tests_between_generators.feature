@random_tests @success
Feature: I generate valid constrained random answers tests

# The 2nd of 2 related tests. Because ALKiln will try to only generate unique tests between all the generators, this 2nd one tests uniqueness of tests between generators. Only the body of the Scenario should matter for uniqueness.

@should_get_warning
Scenario: 2nd I'm warned when I ask for too many unique tests between 2 generators
  Given ALKiln will make 1 random constrained test
  Given I start the interview at "test_kickout"
  And ALKiln will get to ["kickout screen", "success screen"] with any combination of:
    | var | possible_values |
    | user_choice | correct;; wrong |
