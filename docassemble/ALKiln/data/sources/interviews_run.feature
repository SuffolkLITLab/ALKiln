@interviews_start
Feature: The interviews run without erroring

This file:
[x] Test that each interview starts without an error.
[x] Contains some additional example Steps. They use fake values and are commented out with a "#" so they won't run.

These tests are made to work with the ALKiln testing framework, an automated testing framework made under the Document Assembly Line Project.

Want to disable the tests? Want to learn more? See ALKiln's docs: https://assemblyline.suffolklitlab.org/docs/components/ALKiln/alkiln/

@test
Scenario: test.yml runs
  Given I start the interview at "test.yml"
  #And the maximum seconds for each Step in this Scenario is 50
  #And I get to the question id "downloads" with this data:
  #  | var | value | trigger |
  #  | users[0].name.first | Uli | users[0].name.first |
  #  | users[0].name.last | User1 | users[0].name.first |
  
@testactionlink
Scenario: test_action_link.yml runs
  Given I start the interview at "test_action_link.yml"
  #And the maximum seconds for each Step in this Scenario is 50
  #And I get to the question id "downloads" with this data:
  #  | var | value | trigger |
  #  | users[0].name.first | Uli | users[0].name.first |
  #  | users[0].name.last | User1 | users[0].name.first |
  
@testtaps
Scenario: test_taps.yml runs
  Given I start the interview at "test_taps.yml"
  #And the maximum seconds for each Step in this Scenario is 50
  #And I get to the question id "downloads" with this data:
  #  | var | value | trigger |
  #  | users[0].name.first | Uli | users[0].name.first |
  #  | users[0].name.last | User1 | users[0].name.first |