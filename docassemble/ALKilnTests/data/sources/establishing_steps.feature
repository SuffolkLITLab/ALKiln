@establishing
Feature: Establishing steps

Steps that establish things about the state of the test
# In tag names, 'e' is for 'establishing'

@slow @e1 @wait
Scenario: I am able to set a custom wait time that allows steps to run longer than the half minute default
  Given I start the interview at "all_tests"
  And the max seconds for each step in this scenario is 40
  And I wait 35 seconds

@slow @e2 @wait
Scenario: I am able to set a custom wait time before an interview has been loaded
  Given the max seconds for each step in this scenario is 40
  And I start the interview at "all_tests"
  And I wait 35 seconds

@fast @e3 @urlargs
Scenario: Interview name includes url args
  Given I start the interview at "url_args.yml&from=theinternets&random=zoo"
  Then I should see the phrase "zoo"

@slow @e4 @wait_first
Scenario: I can wait as a first step in a test
  Given I wait 1 second
  
@slow @e5 @wait_first
Scenario: Interview name includes url args with a wait
  Given I wait 1 second
  Then I start the interview at "url_args.yml&from=theinternets&random=zoo"
  Then I should see the phrase "zoo"

@fast @e6 @signin
Scenario: I sign in
  Given I sign in with the email "NORMAL_USER_EMAIL", the password "NORMAL_USER_PASSWORD", and the API key "NORMAL_USER_API_KEY"
  And I start the interview at "all_tests"

# WARNING: This Scenario may fail if the file moves or changes too much
@fast @e7 @arbitrary
Scenario: I go to an arbitrary interview
  Given the max seconds for each step in this scenario is 5
  And the Scenario report should include:
  """
  Trying to load the interview at "https://demo.docassemble.org/run/legal/#/1"
  """
  Given I start the interview at "https://demo.docassemble.org/run/legal/#/1"
  Then I should see the phrase "What language do you speak?"

# WARNING: This Scenario may fail incorrectly if the url moves
@fast @failure @e8 @rfe8 @arbitraryurl
Scenario: Fail with no interview at fully arbitrary url
  Given the final Scenario status should be "failed"
  And the Scenario report should include:
  """
  Trying to load the interview at "https://www.usa.gov/"
  """
  And the Scenario report should include:
  """
  ALKiln could not find any interview question page
  """
  And the max seconds for each step in this scenario is 5
  Then I start the interview at "https://www.usa.gov/"

# A completely arbitrary url doesn't have to have the structure of a da page
@fast @e9 @arbitrary
Scenario: I go to a fully arbitrary url
  Given the max seconds for each step in this scenario is 5
  And the Scenario report should include:
  """
  Successfully went to "https://retractionwatch.com"
  """
  Given I go to "https://retractionwatch.com"

@fast @e10 @signin @failure
Scenario: I fail to sign in with wrong email and password
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  ALK0209
  """
  And I sign in with "WRONG_EMAIL", "WRONG_PASSWORD"
