@story_tables_formats
Feature: Supported story table formats

NOTE:
    Unsupported formats:
    - Arrays (see https://github.com/plocket/docassemble-cucumber/issues/257)
    - Format 1 and 2 tables (permanent) (see https://github.com/plocket/docassemble-cucumber/issues/264)

NOTE:
   x[i].name.first is the string in the YAML for this variable name, and it's the info that will be in the DOM.
   https://github.com/plocket/docassemble-ALAutomatedTestingTests/blob/ad1232049d7ca7a9b97b22f8ca3915dd3dae8114/docassemble/ALAutomatedTestingTests/data/questions/all_tests.yml#L80

NOTE:
   The `trigger` column does not require a value. That way simple interviews
   don't have to deal with it. They don't even need a trigger column (see tests below).

### Here for reference. See note above about formats 1 and 2 being unsupported
## TODO: Test og table with `trigger` col added?
#@fast @stf1
#Scenario: Table is format 1 (og three cols)
#  Given I start the interview at "all_tests"
#  And I get to "showifs" with this data:
#    | var | choice | value |
#    | checkboxes_other['checkbox_other_opt_1'] |  | true |
#    | checkboxes_yesno | True | true |
#    | dropdown_test | | dropdown_opt_2 |
#    | radio_other | | radio_other_opt_3 |
#    | radio_yesno | False | true |
#    | text_input | | Regular text input field value |
#    | textarea | | Multiline text\narea value |
#
#@fast @stf2
#Scenario: Table is format 2 (no trigger column)
#  Given I start the interview at "all_tests"
#  And I get to "showifs" with this data:
#    | var | value | checked |
#    | checkboxes_other['checkbox_other_opt_2'] | true |  |
#    | checkboxes_yesno | True | true |
#    | dropdown_test | dropdown_opt_2 |  |
#    | radio_other | radio_other_opt_3 |  |
#    | radio_yesno | False | false |
#    | text_input | Regular text input field value |  |
#    | textarea | Multiline text\narea value |  |

# TODO: Only go up to the x[i] pages
@slow @stf3
Scenario: Table has trigger column
  Given I start the interview at "all_tests"
  And I get to "showifs" with this data:
    | var | value | trigger |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | checkboxes_other['checkbox_other_opt_2'] | true |  |
    | checkboxes_other['checkbox_other_opt_3'] | false |  |
    | checkboxes_yesno | True |  |
    | dropdown_test | dropdown_opt_2 |  |
    | radio_other | radio_other_opt_3 |  |
    | radio_yesno | False |  |
    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    | text_input | Regular text input field value |  |
    | textarea | Multiline text\narea value |  |

# TODO: Only go up to the x[i] pages
@slow @stf4
Scenario: Table MISSING trigger column
  Given I start the interview at "all_tests"
  And I get to "showifs" with this data:
    | var | value |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |
    | checkboxes_other['checkbox_other_opt_2'] | true |
    | checkboxes_yesno | True |
    | dropdown_test | dropdown_opt_2 |
    | radio_other | radio_other_opt_3 |
    | radio_yesno | False |
    | single_quote_dict['single_quote_key']['sq_two'] | true |
    | text_input | Regular text input field value |
    | textarea | Multiline text\narea value |
