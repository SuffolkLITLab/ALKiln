Feature: Navigations work

# TODO: Change "choose an result screen" to "choose a result screen" both places

@action_link @navigation @interactive
Scenario: I click an action link and fill in items on the next page
  Given the max seconds for each Step is 20
  And I start the interview at "test_action_link.yml"
  Then I tap the "#upload" element and wait 10 seconds
  Then the page id should be "choose a result screen"
  And I get to the question id "final screen" with this data:
    | var | value | trigger |
    | result_type | self | |
