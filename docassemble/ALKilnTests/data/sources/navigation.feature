Feature: Navigations work

@action_link @navigation @interactive
Scenario: I click an action link and fill in items on the next page
  Given the max seconds for each Step is 5
  And I start the interview at "test_action_link.yml"
  Then I tap the "#upload" element and wait 5 seconds
  And I get to the question id "end" with this data:
    | var | value | trigger |
    | result_type | self | |
