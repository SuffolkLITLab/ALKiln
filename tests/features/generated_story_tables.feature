#@story_tables_formats
#Feature: Generated story table
#
#To cover:
#- [x] Trigger action
#- [x] Basic direct fields
#- [ ] Fields created with objects
#- [ ] Fields triggered with index vars
#- [ ] Fields triggered with nested index vars
#- [ ] Fields triggered with generic object vars
#- [x] Able to select first choice (not thorough)
#- [x] Able to select second choice (not thorough)
#- [x] Able to select third choice (not thorough)
#- [ ] Able to select none of the above
#- [x] Hidden fields
#- [x] Nested hidden fields listed out of order
#- [x] Continue button field listed before unrequired fields
#
#TODO:
#- Change file name to 'story table formats' - not sure generated tables should be tested this way #or can be trusted anymore. Certainly not for no/yes choices, but also can't do sought var column.
#- Check that all the appropriate items are selected somehow. Maybe we need to get actual screen #vars into a report. That's a lot of noise, though.
#
#The below scenario covers story table tests for:
#- [x] Trigger action
#- [x] Basic direct fields
#- [x] Able to select first choice (not thorough)
#- [x] Able to select second choice (not thorough)
#- [x] Able to select third choice (not thorough)
#- [x] Hidden fields
#- [x] Nested hidden fields listed out of order
#- [x] Continue button field listed before unrequired fields
#
## TODO: Move the below to 'story_table.feature'
#@generated @slow @stf1 @out_of_order
#Scenario: Fields are listed out of order
#  Given I start the interview at "all_tests"
#  And the user gets to "the end" with this data:
#    | var | value | checked | sought |
#    | direct_showifs | True | true |  |
#    | button_continue | True | true |  |
#    | buttons_other | button_2 |  |  |
#    | buttons_yesnomaybe | True | true |  |
#    | checkboxes_other | checkbox_other_opt_1 | true |  |
#    | checkboxes_other | checkbox_other_opt_2 | true |  |
#    | checkboxes_other | checkbox_other_opt_3 | false |  |
#    | checkboxes_yesno | True | true |  |
#    | direct_standard_fields | True | true |  |
#    | dropdown_test | dropdown_opt_2 |  |  |
#    | x[i].name.first | Proxyname1 |  | proxy_list[0].name.first |
#    | x[i].name.first | Proxyname2 |  | proxy_list[1].name.first |
#    | radio_other | radio_other_opt_3 |  |  |
#    | radio_yesno | False | false |  |
#    | screen_features | True | true |  |
#    | showif_checkbox_yesno | False | false |  |
#    | showif_checkboxes_other | showif_checkboxes_nota_1 | false |  |
#    | showif_checkboxes_other | showif_checkboxes_nota_2 | true |  |
#    | showif_checkboxes_other | showif_checkboxes_nota_3 | false |  |
#    | showif_dropdown | showif_dropdown_1 |  |  |
#    | showif_radio_other | showif_radio_multi_2 |  |  |
#    | showif_text_input | Show if text input value |  |  |
#    | showif_textarea | Show if\nmultiline text\narea value |  |  |
#    | showif_yesnoradio | True | true |  |
#    | text_input | Regular text input field value |  |  |
#    | textarea | Multiline text\narea value |  |  |
#    | show_3 | True | true |  |
#    | show_2 | True | true |  |
#    | signature_1 | /sign |  |  |
#    | signature_2 | /sign |  |  |
#
#@generated @fast @stf2
#Scenario: Table is format 1 (og three cols)
#  Given I start the interview at "all_tests"
#  And the user gets to "showifs" with this data:
#    | var | choice | value |
#    | checkboxes_other | checkbox_other_opt_1 | true |
#    | checkboxes_yesno | True | true |
#    | dropdown_test | | dropdown_opt_2 |
#    | radio_other | | radio_other_opt_3 |
#    | radio_yesno | False | true |
#    | text_input | | Regular text input field value |
#    | textarea | | Multiline text\narea value |
#  Then I arrive at the next page
#
## Unsupported - array of format 1
#
#@generated @fast @stf3
#Scenario: Table is format 2 (no sought var)
#  Given I start the interview at "all_tests"
#  And the user gets to "showifs" with this data:
#    | var | value | checked |
#    | checkboxes_other | checkbox_other_opt_2 | true |
#    | checkboxes_yesno | True | true |
#    | dropdown_test | dropdown_opt_2 |  |
#    | radio_other | radio_other_opt_3 |  |
#    | radio_yesno | False | false |
#    | text_input | Regular text input field value |  |
#    | textarea | Multiline text\narea value |  |
#  Then I arrive at the next page
#
#@generated @fast @stf4
#Scenario: Array of format 2 (no sought var)
#  Given I start the interview at "all_tests"
#  And the user gets to "showifs" with this data:
#    | checkboxes_other | checkbox_other_opt_2 | true |
#    | checkboxes_yesno | True | true |
#    | dropdown_test | dropdown_opt_2 |  |
#    | radio_other | radio_other_opt_3 |  |
#    | radio_yesno | False | false |
#    | text_input | Regular text input field value |  |
#    | textarea | Multiline text\narea value |  |
#  Then I arrive at the next page
