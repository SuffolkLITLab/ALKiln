@reload
Feature: Errors caused by server reload

# These can only be run locally one at a time once you uncomment them:
# 1. Make sure you have two versions of the repo locally and open a terminal window for each of them
# 2. With one repo, start one specific test
# 3. Be ready to run the setup step for the 2nd repo
# 4. Prepatory explanation: With some noted exceptions, when the 1st test is _starting_ its long wait time (which they should each have), start the setup step in the other terminal.
# 4a. Start the test in the 1st repo. Ex: npm run cucumber -- "--tags" "@reload1"
# 4b. Wait until the long wait time is just starting (count the number of steps to match the progress dots)
# 4c. Start the setup in the 2nd repo: npm run setup
# 5. Make sure the test waits longer than the scope.timeout
# 6. Make sure the reload error is triggered for the first attempt of the test
# 7. Make sure the reload error is not present for the second attempt
# 8. For the second repo: npm run takedown

# # Tests that need to be written and run:
# # Theoretically implemented
# - [ ] sign in to server with `.sign_in` on two levels:
#   - [ ] (broken, server reload failure in wrong attempt. maybe race condition because failed another way the second time, see report.) when navigating to server
#   - [ ] when submitting to log in (impossible to time? they both happen at once)
# - [x] (waits full time for sign-out page, but I think it's working otherwise) I tap the ... tab (should not cause timeout at all, so should be fine)
# - [ ] (weird. see report 1) I tap the ... element$
# - [ ] I tap the ... element and wait
# - [ ] I set the var ... (using a button press to continue)
# - [ ] I set the var ... GitHub)? secret (for a button press)
# - [ ] I tap the defined text link (really needs testing? not sure it's even currently listed)
# - [ ] (broken, server reload failure in wrong attempt. noticed when tapping tab) Signing out at end of step
# 
# # Already hand tested
# - [ ] I tap to continue
# - [ ] In the middle of a story table (same as "tap to continue")
# 
# # Not yet implemented
# - [ ] I download

## For this scenario, start the server setup before you start running the test and wait till 4th attempt to pull in the #code.
## No screenshots are taken because these are secrets
#@reload1a
#Scenario: The server reloads while I navigate to the server sign in page
#  Given the max seconds for each step in this scenario is 5
#  Given I sign in with the email "USER1_EMAIL" and the password "USER1_PASSWORD"
#
#@reload1b
##Scenario: The server reloads while I'm submitting my signin (impossible)
#
#@reload2
#Scenario: The server reloads while I tap a tab
#  Given I start the interview at "test_taps"
#  And I wait 20 seconds
#  Given I wait 10 seconds
#  And I tap the "Tests-second_template-tab" tab
#  Then I see the phrase "villify"
#
#@reload3
#Scenario: The server reloads while I tap an element selector
#  Given I start the interview at "all_tests"
#  Given I wait 28 seconds
#  Given the max seconds for each step in this scenario is 5
#  Then I tap the "button.btn.btn-da.btn-primary[type='submit']" element
#
#@reload4
#Scenario: The server reloads while I navigate to the server sign in page
#  Given the max seconds for each step in this scenario is 15
#  Given I wait 15 seconds
#
#@reload5
#Scenario: The server reloads while I navigate to the server sign in page
#  Given the max seconds for each step in this scenario is 15
#  Given I wait 15 seconds

@reload5
Scenario: I ensure this feature file is valid, but don't do anything in it
  Given the max seconds for each step in this scenario is 15

