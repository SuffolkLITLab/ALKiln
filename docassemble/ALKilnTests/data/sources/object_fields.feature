@object_fields
Feature: I answer complex questions

Scenario: I choose the second answers
  Given I start the interview at "object_fields"
  #And I set the var "villain['antagonist']" to "True"
  #And I set the var 'hero["protagonist"]' to "True"
  #And I set the var 'characters["antagonist"]' to "True"
  #And I set the var 'characters["protagonist"]' to "True"
  #And I set the var 'actual_characters["antagonist"]' to "True"
  #And I set the var "jazz" to "All of them"
  And I get to the question id "end" with this data:
    | var | values |
    | characters["antagonist"] | True |
    | jazz | All of them |
    | moral_judgement | other_lady |
    | favorite | favorite["piglet"] |
    | awesomer | awesomer["double_fictional"] |
  And I wait 120 seconds

  #  | favorite["piglet"] | True |
  #  | awesomer["double_fictional"] | True |