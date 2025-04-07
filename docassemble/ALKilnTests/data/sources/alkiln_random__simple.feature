@random_tests @success
Feature: I generate valid constrained random answers tests

This line does not get parsed as a Scenario despite the Scenario: keyword
This line doesn't get added either.

# Note: In here we test generated Scenarios that create extra artifacts like
#     warnings. Tests here are also in unit tests.
# 
# Note: We test failures in unit tests to avoid actual failing tests
# 
# Discuss: Should empty var name columns have warnings/errors? They're valid
#     table rows. Hold off on this for now.

Scenario: Simple constrained random answers Steps
  Given ALKiln will make 2 random constrained tests
  Given I start the interview at "test_kickout"
  And ALKiln will get to any of "kickout screen", "success screen" with any combination of:
    | var | possible_values |
    | user_choice | correct;; wrong |
