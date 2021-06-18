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
   The `sought` column does not require a value. That way simple interviews
   don't have to deal with it. They don't even need a sought column (see tests below).

### Here for reference. See note above about formats 1 and 2 being unsupported
## TODO: Test og table with `sought` col added?
#@fast @stf1
#Scenario: Table is format 1 (og three cols)
#  Given I start the interview at "all_tests"
#  And the user gets to "showifs" with this data:
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
#Scenario: Table is format 2 (no sought var)
#  Given I start the interview at "all_tests"
#  And the user gets to "showifs" with this data:
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
Scenario: Table has sought var column
  Given I start the interview at "all_tests"
  And the user gets to "the end" with this data:
    | var | value | sought |
    | direct_showifs | True |  |
    | button_continue | True |  |
    | buttons_other | button_2 | |
    | buttons_yesnomaybe | True |  |
    | checkboxes_other['checkbox_other_opt_1'] | checked |  |
    | checkboxes_other['checkbox_other_opt_2'] | checked |  |
    | checkboxes_other['checkbox_other_opt_3'] | unchecked |  |
    | checkboxes_yesno | True |  |
    | direct_standard_fields | True |  |
    | dropdown_test | dropdown_opt_2 |  |
    | x[i].name.first | Proxyname1 | proxy_list[0].name.first |
    | x[i].name.first | Proxyname2 | proxy_list[1].name.first |
    | radio_other | radio_other_opt_3 |  |
    | radio_yesno | False |  |
    | screen_features | True |  |
    | showif_checkbox_yesno | False |  |
    | showif_checkboxes_other['showif_checkboxes_nota_1'] | unchecked |  |
    | showif_checkboxes_other['showif_checkboxes_nota_2'] | checked |  |
    | showif_checkboxes_other['showif_checkboxes_nota_3'] | unchecked |  |
    | showif_dropdown | showif_dropdown_1 |  |
    | showif_radio_other | showif_radio_multi_2 |  |
    | showif_text_input | Show if text input value |  |
    | showif_textarea | Show if\nmultiline text\narea value |  |
    | showif_yesnoradio | True |  |
    | text_input | Regular text input field value |  |
    | textarea | Multiline text\narea value |  |
    | show_3 | True |  |
    | show_2 | True |  |
    | signature_1 | /sign |  |
    | signature_2 | /sign |  |

# TODO: Only go up to the x[i] pages
@slow @stf4
Scenario: Table MISSING sought var column
  Given I start the interview at "all_tests"
  And the user gets to "showifs" with this data:
    | var | value |
    | checkboxes_other['checkbox_other_opt_2'] | true |
    | checkboxes_yesno | True |
    | dropdown_test | dropdown_opt_2 |
    | radio_other | radio_other_opt_3 |
    | radio_yesno | False |
    | text_input | Regular text input field value |
    | textarea | Multiline text\narea value |
