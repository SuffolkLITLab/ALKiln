Feature: I use the docassemble API

@fast @da1 @signin @sessions @delete
Scenario: I sign in
  Given I sign in with the email "USER1_EMAIL" and the password "USER1_PASSWORD"
  And I start the interview at "all_tests"
  # Must continue to get interview into "My interviews" list
  And I tap to continue
  And I start the interview at "all_tests"
  # Must continue to get interview into "My interviews" list
  And I tap to continue
  And of two interviews, one is deleted __internal__
