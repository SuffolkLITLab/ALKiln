@reports
Feature: Reports show the right things

Note: For now we'll have to check them visually

@fast @r1
Scenario: Report still has page id when I tap to continue without setting any fields
  Given I start the interview at "all_tests"
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
  And the report matches reports.non_setting_page_id

@slow @r2
Scenario: Report lists unused table rows
  Given I start the interview at "all_tests"
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
  Then the report matches reports.excess_rows

@fast @r3
Scenario: Report shows error and failure on unexpected invalid user input
  Given the scenario error report should match "unintended_invalid_input"
  Given I start the interview at "all_tests"
  And I tap to continue
  Then the question id should be "direct standard fields"
