@da
Feature: I use the docassemble API

@fast @da1 @signin @sessions @delete
Scenario: After signing in, I successfully delete an interview
  Given I sign in with the email "USER1_EMAIL", "USER1_PASSWORD", "USER1_API_KEY"
  And I start the interview at "all_tests"
  # Must continue to get interview into "My interviews" list
  And I tap to continue
  And I start the interview at "all_tests"
  And I tap to continue
  Then of two interviews, I delete one __internal__

@fast @da2 @sessions @delete
Scenario: As an anonymous user, I silently fail to delete an interview
  Given I start the interview at "all_tests"
  # Must continue to theoretically get interview into "My interviews" list
  And I tap to continue
  Then as an anonymous user, I fail to delete an interview and get no error __internal__
