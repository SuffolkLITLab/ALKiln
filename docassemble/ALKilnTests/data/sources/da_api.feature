@da
Feature: I use the docassemble API

@fast @da1 @signin @sessions @delete
Scenario: After signing in, I delete an interview
  Given I sign in with the email "USER1_EMAIL" and the password "USER1_PASSWORD"
  And I start the interview at "all_tests"
  # Must continue to get interview into "My interviews" list
  And I tap to continue
  And I start the interview at "all_tests"
  # Must continue to get interview into "My interviews" list
  And I tap to continue
  Then of two interviews, I delete one __internal__

@fast @da2 @sessions @delete
Scenario: Without signing in, I delete an interview
  Given I start the interview at "all_tests"
  # Must continue to get interview into "My interviews" list
  And I tap to continue
  And I start the interview at "all_tests"
  # Must continue to get interview into "My interviews" list
  And I tap to continue
  Then of two interviews, I delete one __internal__
  #Then there are no interview_vars saved __internal__
