@reports
Feature: Reports show the right things

# rf for report failing
# rw for report warning
# rp for report pass

# ===============================
# Reoprts for "failed" Scenarios
# ===============================

@fast @rf1 @error
Scenario: Fail with missng language link
  Given the final Scenario status should be "failed"
  Given the Scenario report should include:
  """
  Could not find the link with the text "Latin"
  """
  And I start the interview at "all_tests" in lang "Latin"

## This screen has not yet been created
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

@fast @rf10 @error
Scenario: Fail with was uexepctedly not able to continue
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



# ===============================
# Reoprts for "passed" Scenarios
# ===============================

@fast @rp1
Scenario: Report still shows page id when I tap to continue without setting any fields
  Given the final Scenario status should be "passed"
  Given the Scenario report should include:
    """
    ---------------
    Scenario: Report still shows page id when I tap to continue without setting any fields reports fast rp 
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

@slow @rp2
Scenario: Report lists unused table rows
  Given the final Scenario status should be "passed"
  Given the Scenario report should include:
    """

    ---------------
    Scenario: Report lists unused table rows reports slow rp 
    ---------------
    screen id: upload-files
    screen id: group-of-complex-fields
          | single_quote_dict['single_quote_key']['sq_two'] | true |  |
          | double_quote_dict[\"double_quote_key\"]['dq_two'] | true |  |

      Rows that got set:
        And I get the question id "direct standard fields" with this data:
          | var | value | trigger |
          | double_quote_dict[\"double_quote_key\"]['dq_two'] | true |  |
          | single_quote_dict['single_quote_key']['sq_two'] | true |  |
      Unused rows:
          | extra_2 | extra 2 |  |
          | extra_out_of_alphabetical_order | extra 1 |  |

    screen id: direct-standard-fields
          | checkboxes_other['checkbox_other_opt_1'] | true |  |
          | radio_yesno | False | false |
          | radio_other | radio_other_opt_3 |  |
          | text_input | Regular text input field value |  |
          | textarea | Multiline text\narea value |  |
          | dropdown_test | dropdown_opt_2 |  |

      Rows that got set:
        And I get the question id "showifs" with this data:
          | var | value | trigger |
          | checkboxes_other['checkbox_other_opt_1'] | true |  |
          | dropdown_test | dropdown_opt_2 |  |
          | radio_other | radio_other_opt_3 |  |
          | radio_yesno | False | false |
          | text_input | Regular text input field value |  |
          | textarea | Multiline text\narea value |  |
      Unused rows:
          | extra_3 | extra 3 |  |
          | extra_4 | extra 4 |  |
          | extra_5 | extra 5 |  |

    screen id: showifs
    screen id: buttons-yesnomaybe
          | buttons_yesnomaybe | True |  |
    screen id: buttons-other
          | buttons_other | button_2 |  |
    screen id: button-continue
          | button_continue | True |  |

      Rows that got set:
        And I get the question id "screen features" with this data:
          | var | value | trigger |
          | button_continue | True |  |
          | buttons_other | button_2 |  |
          | buttons_yesnomaybe | True |  |
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
