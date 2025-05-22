@random_tests @success
Feature: I generate valid constrained random answers tests

This line does not get parsed as a Scenario despite the Scenario: keyword. It does get copied, though.

# Note: We test generator failures in unit tests to avoid actual failing tests for now.
# Note: Each generated test must be completely unique from all other generated tests.

@simple_random
Scenario: Simple constrained random answers Steps
  Given ALKiln will make 2 random constrained tests
  Given I start the interview at "test_pdf"
  And ALKiln will get to ["signature"] with any combination of:
    | var | possible_values |
    | x[i].name.first | Sam;; Pat;; Logan;; Jordan |
