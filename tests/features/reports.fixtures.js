let reports = {};

reports.non_setting_page_id = `
---------------
Scenario: Report still has page id when I tap to continue without setting any fields reports fast r 
---------------
group-of-complex-fields
      | double_quote_dict['double_quote_key']['dq_two'] | true |  |
      | single_quote_dict['single_quote_key']['sq_two'] | true |  |
direct-standard-fields
      | checkboxes_yesno | True |  |
      | checkboxes_other['checkbox_other_opt_1'] | true |  |
      | dropdown_test | dropdown_opt_2 |  |
      | radio_yesno | False |  |
      | radio_other | radio_other_opt_3 |  |
      | text_input | Regular text input field value |  |
      | textarea | Multiline text\\narea value |  |
showifs
`;

reports.excess_rows = `
---------------
Scenario: Report lists unused table rows reports slow r 
---------------
group-of-complex-fields
      | single_quote_dict['single_quote_key']['sq_two'] | true |  |
      | double_quote_dict[\\"double_quote_key\\"]['dq_two'] | true |  |

Rows that DID get used:
    And I get the question id "direct standard fields" with this data:
      | var | value | trigger |
      | double_quote_dict[\\"double_quote_key\\"]['dq_two'] | true |  |
      | single_quote_dict['single_quote_key']['sq_two'] | true |  |
Unused rows:
      | extra_2 | extra 2 |  |
      | extra_out_of_alphabetical_order | extra 1 |  |

direct-standard-fields
      | checkboxes_other['checkbox_other_opt_1'] | true |  |
      | radio_yesno | False | false |
      | radio_other | radio_other_opt_3 |  |
      | text_input | Regular text input field value |  |
      | textarea | Multiline text\\narea value |  |
      | dropdown_test | dropdown_opt_2 |  |

Rows that DID get used:
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

showifs
buttons-yesnomaybe
      | buttons_yesnomaybe | True |  |
buttons-other
      | buttons_other | button_2 |  |
button-continue
      | button_continue | True |  |

Rows that DID get used:
    And I get the question id "screen features" with this data:
      | var | value | trigger |
      | button_continue | True |  |
      | buttons_other | button_2 |  |
      | buttons_yesnomaybe | True |  |
Unused rows:
      | extra_6 | extra 6 |  |
      | extra_7 | extra 7 |  |

`;


module.exports = reports;
