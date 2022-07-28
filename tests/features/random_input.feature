@random_input
Feature: Assembly Line package-specific Steps

# In tag names, 'ri' is for 'random input'

@slow @ri1 @random
Scenario: I fill in random input till the end
  Given I start the interview at "test_random_input"
  And I answer randomly for at most 20 pages
  Then the question id should be "end"

@slow @ri2 @random
Scenario: I fill in random input for 1 page
  Given I start the interview at "test_random_input"
  And I answer randomly for at most 1 page
