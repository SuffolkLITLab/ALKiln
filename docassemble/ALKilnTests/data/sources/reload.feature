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
# - [ ] 1. sign in to server with `.sign_in` on two levels:
#   - [x] (throw_after_server_reloads() solved this I think) when navigating to server
#   - [ ] when submitting to log in (impossible to time? they both happen at once)
# - [x] 2. (waits full time for sign-out page, but I think it's working otherwise) I tap the ... tab (should not cause timeout at all, so should be fine)
# - [x] 3. tap elements
#   - [x] I tap the ... element$
#   - [ ] (same as above?) I tap the ... element and wait
# - [x] 4. Set the var of a continue button
#   - [x] I set the var ... (using a button press to continue)
#   - [x] (same as above?) I set the var ... GitHub)? secret (for a button press)
#   - [ ] (same as above? We don't have an interview ready for this yet. Seen notes in 4c) I set the var for a button in a story table
# - [x] 5. Signing out at end of step
# - [x] 6. Tap to continue
#   - [x] I tap to continue
#   - [x] In the middle of a story table (basically same as "tap to continue")
# - [x] 7. Fails both tests
# - [x] 8. The server does actually finish reloading during the first attempt, so there's only one error printed in the report.
# 
# # Not yet implemented
# - [ ] I download
#
# Skipping for now because not a documented step yet
# - [ ] I tap the defined text link

## For this scenario, start the server setup before you start running the test and wait till 4th attempt to pull in the code.
## No screenshots are taken because these are secrets
#@reload1a
#Scenario: The server reloads while I navigate to the server sign in page
#  Given the max seconds for each step in this scenario is 5
#  Given I sign in with the email "USER_NO_PERMISSIONS_EMAIL", the password "USER_NO_PERMISSIONS_PASSWORD", and the API key "USER_NO_PERMISSIONS_API_KEY"
#
#@reload1b
##Scenario: The server reloads while I'm submitting my signin (impossible)
#
## Should error after finishing test, but only because can't finish the test by going to the sign out page during server #reload. Sign out page is a necessary evil at the moment to make sure the next test starts fresh.
#@reload2
#Scenario: The server reloads while I tap a tab
#  Given I start the interview at "test_taps"
#  And I wait 20 seconds
#  And I tap the "Tests-second_template-tab" tab
#  Then I see the phrase "villify"
#
#@reload3a
#Scenario: The server reloads while I tap an element selector
#  Given I start the interview at "all_tests"
#  And I wait 18 seconds
#  Given the max seconds for each step in this scenario is 5
#  Then I tap the "button.btn.btn-da.btn-primary[type='submit']" element
#
##@reload3b
##  Given I start the interview at "all_tests"
##  And I wait 18 seconds
##  Given the max seconds for each step in this scenario is 5
##  Then I tap the "button.btn.btn-da.btn-primary[type='submit']" element and wait 1 seconds
#
## Start setup on the 12th dot
#@reload4a
#Scenario: The server reloads while I set the var of a continue button
#  Given I start the interview at "all_tests"
#  And I tap to continue
#  And I tap to continue
#  When I set the var "checkboxes_yesno" to "True"
#  And I set the var "checkboxes_other['checkbox_other_opt_1']" to "true"
#  And I set the var "combobox_input" to "Custom combobox option"
#  And I set the var "dropdown_test" to "dropdown_opt_2"
#  And I set the var "radio_yesno" to "False"
#  And I set the var "radio_other" to "radio_other_opt_3"
#  And I set the var "text_input" to "Regular text input field value"
#  And I set the var "textarea" to "Multiline text\narea value"
#  And I wait 25 seconds
#  Given the max seconds for each step in this scenario is 5
#  Then I set the var "direct_standard_fields" to "True"
#
## You must add the env var `STANDARD_FIELDS`. Otherwise, it's just like @reload4a
#@reload4b
#Scenario: The server reloads while I set the var of a continue button
#  Given I start the interview at "all_tests"
#  And I tap to continue
#  And I tap to continue
#  When I set the var "checkboxes_yesno" to "True"
#  And I set the var "checkboxes_other['checkbox_other_opt_1']" to "true"
#  And I set the var "combobox_input" to "Custom combobox option"
#  And I set the var "dropdown_test" to "dropdown_opt_2"
#  And I set the var "radio_yesno" to "False"
#  And I set the var "radio_other" to "radio_other_opt_3"
#  And I set the var "text_input" to "Regular text input field value"
#  And I set the var "textarea" to "Multiline text\narea value"
#  And I wait 25 seconds
#  Given the max seconds for each step in this scenario is 5
#  Then I set the var "direct_standard_fields" to the github secret "STANDARD_FIELDS"
#
### We don't have an interview set up for this yet. We need one where the _first_ page
### has a continue button field that sets a variable.
##@reload4c
##Scenario: The server reloads while I run a story table
##  Given I start the interview at "all_tests"
##  And I wait 18 seconds
##  Given the max seconds for each step in this scenario is 3
##  And I get to "id of second page" with this data:
##    | var | value | trigger |
##    | some_continue_button_var_on_first_page | true |  |
#
#@reload5
#Scenario: The server reloads while signing out
#  Given I start the interview at "all_tests"
#  And I wait 16 seconds
#  Given the max seconds for each step in this scenario is 1
#
#@reload6a
#Scenario: The server reloads while I tap to continue
#  Given I start the interview at "all_tests"
#  And I wait 18 seconds
#  Given the max seconds for each step in this scenario is 3
#  And I tap to continue
#
#@reload6b
#Scenario: The server reloads while I run a story table
#  Given I start the interview at "all_tests"
#  And I wait 18 seconds
#  Given the max seconds for each step in this scenario is 3
#  And I get to "direct standard fields" with this data:
#    | var | value | trigger |
#    | double_quote_dict['double_quote_key']["dq_two"] | true |  |
#    | single_quote_dict["single_quote_key"]['sq_two'] | true |  |
#
## This test might not be necessary. The test run should end in failure and the message should appear in both reports.
## Run `npm run setup` both times. This will complicate takedown - it creates two projects, so at the end you have to takedown #the current project, which removes the project name in the config, then you have to put the name of the first project into the #config and then run takedown again.
#@reload7
#Scenario: The server is reloading in both attempts
#  Given I start the interview at "all_tests"
#  And I wait 22 seconds
#  Given the max seconds for each step in this scenario is 1
#
#@reload8
#Scenario: The server finishes reloading before the first timeout
#  Given I start the interview at "all_tests"
#  And I wait 18 seconds
#  Given the max seconds for each step in this scenario is 30
#  And I tap to continue