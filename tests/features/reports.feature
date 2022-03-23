@reports
Feature: Reports show the right things

# rf for report failing
# rw for report warning
# rp for report pass

# ===============================
# Reoprts for "failed" Scenarios
# ===============================

# ---- Exceptions in steps.js ----

@fast @rf1 @error
Scenario: Fail with missng language link
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  Could not find the link with the text "Latin"
  """
  And I start the interview at "all_tests" in lang "Latin"

## This screen has not yet been created in the testing interview
#@fast @rf2 @error
#Scenario: Fail with found no page id
#  Given the final Scenario status should be "failed"
#  Given the Scenario report should include:
#  """
#  Did not find any question id.
#  """
#  And I start the interview at "all_tests"
#  Then the question id should be "any question id"

@fast @rf3 @error
Scenario: Fail with wrong page id
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  The question id was supposed to be
  """
  And I start the interview at "all_tests"
  Then the question id should be "wrong question id"

@fast @rf4 @error
Scenario: Fail with a missing phrase
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  SHOULD be on this page, but it's NOT
  """
  And I start the interview at "all_tests"
  Then I SHOULD see the phrase "phrase missing"

@fast @rf5 @error
Scenario: Fail with incorrectly present phrase
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  should NOT be on this page, but it IS here
  """
  And I start the interview at "all_tests"
  Then I should NOT see the phrase "e"

@fast @rf6 @error
Scenario: Fail with missing element id
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  No element on this page has the ID
  """
  And I start the interview at "all_tests"
  Then an element should have the id "wrong element id"

@fast @rf7 @error
Scenario: Fail with unexpectedly able to continue
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  The page should have stopped the user from continuing, but the user was able to continue.
  """
  And I start the interview at "all_tests"
  Then the question id should be "upload files"
  And I tap to continue
  Then I can't continue

@fast @rf8 @error
Scenario: Fail with missing error message
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  No error message was found on the page
  """
  And I start the interview at "all_tests"
  And I will be told an answer is invalid

## Not sure how to trigger this at the moment
#@fast @rf9 @error
#Scenario: Fail with missing user error message
#  Given the final Scenario status should be "failed"
#  Given the Scenario report should include:
#  """
#  The error was a system error, not an error message to the user.
#  """
#  And I start the interview at "all_tests"
#  And I will be told an answer is invalid

# TODO: Check this with validation code failure too
@fast @rf10 @error
Scenario: Fail with was uexepctedly not able to continue for invalid field input message
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  User did not arrive at the next page.
  """
  And I start the interview at "all_tests"
  And I tap to continue
  And I tap to continue
  And I tap to continue
  Then I arrive at the next page

@fast @rf11 @error
Scenario: Fail with link text not visible
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  Cannot find a link with the text
  """
  And I start the interview at "all_tests"
  Then I should see the link "Missing link"

@fast @rf12 @error
Scenario: Fail with missing link with url
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  Cannot find a link to
  """
  And I start the interview at "all_tests"
  Then I should see the link to "http://missing-url.com"

@slow @rf13 @error @table
Scenario: Fail with link with given text does not lead to correct url
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  Cannot find a link with the text "Link to external page" leading to http://wrong-url.com.
  """
  Given I start the interview at "all_tests"
  And I tap to continue
  And I get to "showifs" with this data:
    | var | value | trigger |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | dropdown_test | dropdown_opt_2 | |
    | radio_yesno | False | false |
    | radio_other | radio_other_opt_3 | |
    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    | text_input | Regular text input field value | |
    | textarea | Multiline text\narea value | |
  Then I arrive at the next page
  Then I get to "screen features" with this data:
    | var | value | trigger |
    | button_continue | True |  |
    | buttons_other | button_2 |  |
    | buttons_yesnomaybe | True |  |
  And I should see the link to "http://ecosia.org/"
  Then the "Link to external page" link leads to "http://wrong-url.com"

@slow @rf14 @error @table
Scenario: Fail with link unexpectedly opens in same window
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  The link "Link to external page" does NOT open in the same window
  """
  Given I start the interview at "all_tests"
  And I tap to continue
  And I get to "showifs" with this data:
    | var | value | trigger |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | dropdown_test | dropdown_opt_2 | |
    | radio_yesno | False | false |
    | radio_other | radio_other_opt_3 | |
    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    | text_input | Regular text input field value | |
    | textarea | Multiline text\narea value | |
  Then I arrive at the next page
  Then I get to "screen features" with this data:
    | var | value | trigger |
    | button_continue | True |  |
    | buttons_other | button_2 |  |
    | buttons_yesnomaybe | True |  |
  And I should see the link to "http://ecosia.org/"
  Then the "Link to external page" link opens in the same window

@fast @rf15 @error @table
Scenario: Fail with link unexpectedly opens in a new window
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  The link "Link: reload the page" does NOT open in a new window
  """
  Given I start the interview at "all_tests"
  And I tap to continue
  And I get to "showifs" with this data:
    | var | value | trigger |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | dropdown_test | dropdown_opt_2 | |
    | radio_yesno | False | false |
    | radio_other | radio_other_opt_3 | |
    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    | text_input | Regular text input field value | |
    | textarea | Multiline text\narea value | |
  Then I arrive at the next page
  Then I get to "screen features" with this data:
    | var | value | trigger |
    | button_continue | True |  |
    | buttons_other | button_2 |  |
    | buttons_yesnomaybe | True |  |
  And I should see the link to "http://ecosia.org/"
  Then the "Link: reload the page" link opens in a new window

## Don't currently have a broken link to test and this Step is not officially supported
#@fast @rf16 @error @table
#Scenario: Fail with link leads to a broken page
#  Given the final Scenario status should be "failed"
#  Given the Scenario report should include:
#  """
#  link is broken
#  """
#  Given I start the interview at "all_tests"
#  And I tap to continue
#  And I get to "showifs" with this data:
#    | var | value | trigger |
#    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
#    | checkboxes_other['checkbox_other_opt_1'] | true |  |
#    | dropdown_test | dropdown_opt_2 | |
#    | radio_yesno | False | false |
#    | radio_other | radio_other_opt_3 | |
#    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
#    | text_input | Regular text input field value | |
#    | textarea | Multiline text\narea value | |
#  Then I arrive at the next page
#  Then I get to "screen features" with this data:
#    | var | value | trigger |
#    | button_continue | True |  |
#    | buttons_other | button_2 |  |
#    | buttons_yesnomaybe | True |  |
#  And I should see the link to "http://ecosia.org/"
#  Then the "Link to external page" link opens a working page

# 'I tap to continue'
# Tapping to continue should not ever fail for its own sake. We
# have Steps that check the consequences of tapping to continue.

# Below is test from scope.js, which makes this of place. Maybe this is the
# wrong way to organize things. Or maybe we shouldn't give tests unique ids
# at all.

# Not testing: missing var independently, missing value independently.
# Cannot auto test that multiple vars get detected because it's not currently
# possible to hand in multiple vars and require that all rows be used, but it
# has been confirmed by hand for now.
@fast @rf17 @error
Scenario: Fail with var not on page
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  Did not find a field on this page for the variable
  """
  And the Scenario report should include:
  """
  Missing variable or variables on page
  """
  And I start the interview at "all_tests"
  And I set the var "missing_var_1" to "missing value 1"

@fast @rf18 @error
Scenario: Fail with missing term with the given text
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  The term "wrong term" seems to be missing
  """
  And I start the interview at "all_tests"
  Then I tap the defined text link "wrong term"

@fast @rf19 @error
Scenario: Fail with cannot find missing document
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  Cannot find a link to that document
  """
  And I start the interview at "all_tests"
  Then I download "missing-doc.pdf"


# ---- Exceptions in scope.js ----

# This can have a ton of different error messages depending on the DA error
# that was triggered. We'll make do with one for now.
@fast @rf20 @error
Scenario: Fail with system error after Step using wrong file name as trigger
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  Reference to invalid playground path
  """
  And I start the interview at "wrong_yaml_filename"

## Not sure how to trigger this. I think we'd need the server to be down.
#@fast @rf21 @error
#Scenario: Fail with interview does not load after multiple tries
#  Given the final Scenario status should be "failed"
#  Given the Scenario report should include:
#  """
#  The interview at ${ interview_url } did not load after
#  """
#  And I start the interview at "wrong_yaml_filename"

@fast @rf22 @table
Scenario: I can't match JSON page var to str
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  was not equal to the expected value
  """
  Given I start the interview at "all_tests.yml"
  And I get to "showifs" with this data:
    | var | value | trigger |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | dropdown_test | dropdown_opt_2 | |
    | radio_yesno | False | false |
    | radio_other | radio_other_opt_3 | |
    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    | text_input | Regular text input field value | |
    | textarea | Multiline text\narea value | |
    | date_input | today | |
  Then the text in the JSON variable "dropdown_test" should be
  """
  wrong_value
  """

@fast @rf22 @signin
Scenario: Fail with wrong email secret
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  email address GitHub SECRET
  """
  Given I log on with the email "WRONG_EMAIL_NAME" and the password "USER1_PASSWORD"

@fast @rf23 @signin
Scenario: Fail with wrong password secret
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  password GitHub SECRET
  """
  Given I sign in with the email "USER1_EMAIL" and the password "WRONG_PASSWORD_NAME"

@fast @rf24 @signin
Scenario: Fail with 2 wrong signin secrets
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  email address GitHub SECRET
  """
  Given the Scenario report should include:
  """
  password GitHub SECRET
  """
  Given I sign in with the email "WRONG_EMAIL_NAME" and the password "WRONG_PASSWORD_NAME"

# scope.js
# I upload "___" to "___"
# No need to test wrong var name
# Test non-existant file?
# How to test non-existant directory?
#
# I sign

# ===============================
# Reports for Scenarios with warnings
# ===============================

@fast @rw1 @warning
Scenario: Warn when there are too many names
  Given the Scenario report should include:
  """
  The name "Uli Udo User Sampson Jr" has more than 4 parts, but 4 is the maximum allowed. The test will set the name to "Uli Udo User Jr"
  """
  Given I start the interview at "AL_tests"
  And I set the name of "users[0]" to "Uli Udo User Sampson Jr"
  And I tap to continue

# ===============================
# Reports for "passed" Scenarios
# ===============================

@fast @rp1
Scenario: Report still shows page id when I tap to continue without setting any fields
  Given the final Scenario status should be "passed"
  Given the Scenario report should include:
    """
    ---------------
    Scenario: Report still shows page id when I tap to continue without setting any fields
    Tags: @reports @fast @rp1
    ---------------
    screen id: upload-files
    screen id: group-of-complex-fields
          | double_quote_dict['double_quote_key']['dq_two'] | true |  |
          | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    screen id: direct-standard-fields
          | checkboxes_yesno | True |  |
          | checkboxes_other['checkbox_other_opt_1'] | true |  |
          | dropdown_test | dropdown_opt_2 |  |
          | radio_yesno | False |  |
          | radio_other | radio_other_opt_3 |  |
          | text_input | Regular text input field value |  |
          | textarea | Multiline text\narea value |  |
    screen id: showifs

    """
  And I start the interview at "all_tests"
  And I tap to continue
  # Next page
  And I set the var "double_quote_dict['double_quote_key']['dq_two']" to "true"
  And I set the var "single_quote_dict['single_quote_key']['sq_two']" to "true"
  And I tap to continue
  Then the question id should be "direct standard fields"
  # Next page
  When I set the var "checkboxes_yesno" to "True"
  And I set the var "checkboxes_other['checkbox_other_opt_1']" to "true"
  And I set the var "dropdown_test" to "dropdown_opt_2"
  And I set the var "radio_yesno" to "False"
  And I set the var "radio_other" to "radio_other_opt_3"
  And I set the var "text_input" to "Regular text input field value"
  And I set the var "textarea" to "Multiline text\narea value"
  When I tap to continue
  # Next page
  Then the question id should be "showifs"
  When I tap to continue
  # Next page (showifs ID SHOULD BE SHOWN IN REPORT)
  Then the question id should be "buttons yesnomaybe"

@slow @rp2 @table
Scenario: Report lists unused table rows
  Given the final Scenario status should be "passed"
  Given the Scenario report should include:
    """
      Unused rows:
          | extra_2 | extra 2 |  |
          | extra_out_of_alphabetical_order | extra 1 |  |
    """
  Given the Scenario report should include:
    """
      Unused rows:
          | extra_3 | extra 3 |  |
          | extra_4 | extra 4 |  |
          | extra_5 | extra 5 |  |
    """
  Given the Scenario report should include:
    """
      Unused rows:
          | extra_6 | extra 6 |  |
          | extra_7 | extra 7 |  |
    """
  And I start the interview at "all_tests"
  And I get to "direct standard fields" with this data:
    | var | value | trigger |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    | extra_out_of_alphabetical_order | extra 1 |  |
    | extra_2 | extra 2 |  |
  And I get to "showifs" with this data:
    | var | value | trigger |
    | extra_3 | extra 3 |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | dropdown_test | dropdown_opt_2 | |
    | radio_yesno | False | false |
    | extra_4 | extra 4 |  |
    | radio_other | radio_other_opt_3 | |
    | text_input | Regular text input field value | |
    | textarea | Multiline text\narea value | |
    | extra_5 | extra 5 |  |
  Then I get to "screen features" with this data:
    | var | value | trigger |
    | extra_6 | extra 6 |  |
    | extra_7 | extra 7 |  |
    | button_continue | True |  |
    | buttons_other | button_2 |  |
    | buttons_yesnomaybe | True |  |
