@random_input
Feature: Assembly Line package-specific Steps

# In tag names, 'ri' is for 'random input'

@slow @ri1 @random
Scenario: I fill in random input
  Given I start the interview at "test_random_input"
  And I answer randomly
  Then the question id should be "end"
