@reports
Feature: Reports show the right things

@fast @r1
Scenario: Report still shows page id when I tap to continue without setting any fields
  Given
    """

    ---------------
    Scenario: Report still shows page id when I tap to continue without setting any fields reports fast r 
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
          | textarea | Multiline text\\narea value |  |
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

@slow @r2
Scenario: Report lists unused table rows
  Given the Scenario should pass with this report:
    """

    ---------------
    Scenario: Report lists unused table rows reports slow r 
    ---------------
    screen id: upload-files
    screen id: group-of-complex-fields
          | single_quote_dict['single_quote_key']['sq_two'] | true |  |
          | double_quote_dict[\\"double_quote_key\\"]['dq_two'] | true |  |

      Rows that got set:
        And I get the question id "direct standard fields" with this data:
          | var | value | trigger |
          | double_quote_dict[\\"double_quote_key\\"]['dq_two'] | true |  |
          | single_quote_dict['single_quote_key']['sq_two'] | true |  |
      Unused rows:
          | extra_2 | extra 2 |  |
          | extra_out_of_alphabetical_order | extra 1 |  |

    screen id: direct-standard-fields
          | checkboxes_other['checkbox_other_opt_1'] | true |  |
          | radio_yesno | False | false |
          | radio_other | radio_other_opt_3 |  |
          | text_input | Regular text input field value |  |
          | textarea | Multiline text\\narea value |  |
          | dropdown_test | dropdown_opt_2 |  |

      Rows that got set:
        And I get the question id "showifs" with this data:
          | var | value | trigger |
          | checkboxes_other['checkbox_other_opt_1'] | true |  |
          | dropdown_test | dropdown_opt_2 |  |
          | radio_other | radio_other_opt_3 |  |
          | radio_yesno | False | false |
          | text_input | Regular text input field value |  |
          | textarea | Multiline text\\narea value |  |
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


@fast @r3
Scenario: Report shows error on unexpected invalid user input
  Given the Scenario should fail with this report:
    """

    ---------------
    Scenario: Report shows error on unexpected invalid user input reports fast r 
    ---------------
    screen id: upload-files
    screen id: group-of-complex-fields

    ERROR: The question id was supposed to be "direct standard fields", but it's actually "group-of-complex-fields".
    **-- Scenario Failed --**

    """
  And I start the interview at "all_tests"
  And I tap to continue
  And I tap to continue
  Then the question id should be "direct standard fields"
