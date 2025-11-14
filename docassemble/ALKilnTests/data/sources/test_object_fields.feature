@object_fields
Feature: I answer complex questions

Scenario: I choose the first answer
  Given I start the interview at "fields"
  And I set the var "villain['antagonist']" to "True"
  And I set the var 'hero["protagonist"]' to "True"
  And I set the var 'characters["antagonist"]' to "True"
  And I set the var 'characters["protagonist"]' to "True"
  And I set the var 'actual_characters["antagonist"]' to "True"
  And I set the var "jazz" to "All of them"
  And I wait 120 seconds
  # And I get to the question id "end" with this data:
  #   | var | values |
  #   | villain["antagonist"] | True |
  #   | hero["protagonist"] | True |
  #   | characters["antagonist"] | True |
  #   | characters["protagonist"] | True |
  #   | actual_characters["antagonist"] | True |
  #   | jazz | All of them |