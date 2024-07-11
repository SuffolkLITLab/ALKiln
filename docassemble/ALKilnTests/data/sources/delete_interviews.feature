@delete @da_api
Feature: I use the docassemble API

@fast @del1 @sessions
Scenario: As an anonymous user, I silently fail to delete an interview
  Given I start the interview at "all_tests"
  # Must continue to theoretically get interview into "My interviews" list
  And I tap to continue
  Then I fail to delete 1 detected interview and get no error __internal__

@fast @del2 @signin @sessions
Scenario: Without an API key, I silently fail to delete an interview and trigger no warnings
  Given I sign in with the email "USER_NO_PERMISSIONS_EMAIL" and the password "USER_NO_PERMISSIONS_PASSWORD"
  And I start the interview at "all_tests"
  # Must continue to theoretically get interview into "My interviews" list
  And I tap to continue
  Then I fail to delete 1 detected interview and get no error __internal__

@fast @del3 @signin @sessions
Scenario: I delete an interview after signing in
  Given I sign in with the email "USER_NO_PERMISSIONS_EMAIL", "USER_NO_PERMISSIONS_PASSWORD", "USER_NO_PERMISSIONS_API_KEY"
  And I start the interview at "all_tests"
  # Must continue to get interview into "My interviews" list
  And I tap to continue
  And I start the interview at "all_tests"
  And I tap to continue
  Then of two interviews, I delete one __internal__

@fast @del4 @signin @sessions
Scenario: I go to non-existent interview and only get that error
  Given the final Scenario status should be "failed"
  Given I sign in with the email "USER_NO_PERMISSIONS_EMAIL", "USER_NO_PERMISSIONS_PASSWORD", "USER_NO_PERMISSIONS_API_KEY"
  And I start the interview at "nonexistent_interview"

@fast @del5 @signin @sessions
Scenario: I leave an API key undefined and get a warning
  Given the Scenario report should include:
  """
  ALK0199
  """
  Given I sign in with the email "USER_NO_PERMISSIONS_EMAIL", "USER_NO_PERMISSIONS_PASSWORD", "NONEXISTENT_API_KEY_VAR_NAME"
  And I start the interview at "all_tests"
  And I tap to continue
  Then I fail to delete 1 detected interview and get no error __internal__

@fast @del6 @signin @sessions
Scenario: My API key is an empty string and I get a warning
  Given the Scenario report should include:
  """
  ALK0200
  """
  Given I sign in with the email "USER_NO_PERMISSIONS_EMAIL", "USER_NO_PERMISSIONS_PASSWORD", "EMPTY_STRING"
  And I start the interview at "all_tests"
  And I tap to continue
  Then I fail to delete 1 detected interview and get no error __internal__

@fast @del7 @sessions
Scenario: With an invalid API key, I get a warning and silently fail to delete an interview
  Given the Scenario report should include:
  """
  ALK0201
  """
  Given I sign in with the email "USER_NO_PERMISSIONS_EMAIL", "USER_NO_PERMISSIONS_PASSWORD", "INVALID_API_KEY"
  And I start the interview at "all_tests"
  And I tap to continue
  Then I fail to delete 1 detected interview and get no error __internal__
