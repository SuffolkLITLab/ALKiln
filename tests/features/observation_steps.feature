@observation
Feature: Observational steps

# In tag names, 'O' is for 'Observational'

@generated @fast @O1
Scenario: I observe things on a single page when I arrive
  Given I start the interview at "all_tests"
  Then the question id should be "direct standard fields"
  And I should see the phrase "Direct standard fields"
  And I SHOULD see the phrase "Direct standard fields"
  And I should not see the phrase "zzzzzzz"
  And I should NOT see the phrase "zzzzzzz"
  And an element should have the id "daform"

@generated @fast @O2
Scenario: I see user errors
  Given I start the interview at "all_tests"
  And I tap to continue
  Then I can't continue
  And I will be told an answer is invalid
