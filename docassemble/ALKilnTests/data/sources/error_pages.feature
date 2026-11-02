@ep
Feature: Error pages

# Test that ALKiln detects these error screens

@ep1 @failure
Scenario: Fail on AL error page with linear Steps
  Given the Scenario report should include:
  """
  ALK0147
  """
  And the final Scenario status should be "failed"
  When I start the interview at "AL_custom_error_page"
  And I sign
  And I tap to continue

@ep2 @failure
Scenario: Fail on AL error page with Story Table
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  ALK0147
  """
  Given I start the interview at "AL_custom_error_page"
  And the max seconds for each step in this scenario is 10
  And I get to the question id "idk" with this data:
  | var | value |
  | signature | "signature" |
