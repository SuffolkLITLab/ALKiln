@story_tables
Feature: Story tables

NOTE:
    Unit tests make sure that all things that are supposed to match do match.

@fast @st1 @sought_var
Scenario: Proxy and regular vars are mixed
  Given I start the interview at "AL_tests"
  And the user gets to "end" with this data:
    | var | value | sought |
    | users[0].name.first | Uli1 | users[0].name.first |
    | users[0].name.last | User1 | users[0].name.first |
    | users[0].address.address | 120 Tremont Street | users[0].name.first |
    | users[0].address.unit | Unit 2 | users[0].name.first |
    | users[0].address.city | Boston | users[0].name.first |
    | users[0].address.state | MA | users[0].name.first |
    | users[0].address.zip | 02108 | users[0].name.first |
    | users[1].name.first | Uli2 | users[1].name.first |
    | users[1].name.last | User2 | users[1].name.first |
    | users[i].proxy_var | Index var value | users[1].name.first |

@slow @st2 @out_of_order
Scenario: Fields are listed out of order

Covers story table tests for:
- [x] Trigger action
- [x] Basic direct fields
- [x] Able to select first choice (not thorough)
- [x] Able to select second choice (not thorough)
- [x] Able to select third choice (not thorough)
- [x] Hidden fields
- [x] Nested hidden fields listed out of order
- [x] Continue button field listed before unrequired fields

  Given I start the interview at "all_tests"
  And the user gets to "the end" with this data:
    | var | value | sought |
    | direct_showifs | True |  |
    | button_continue | True |  |
    | buttons_other | button_2 | |
    | buttons_yesnomaybe | True |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | checkboxes_other['checkbox_other_opt_2'] | true |  |
    | checkboxes_other['checkbox_other_opt_3'] | false |  |
    | checkboxes_yesno | True |  |
    | direct_standard_fields | True |  |
    | dropdown_test | dropdown_opt_2 |  |
    | x[i].name.first | Proxyname1 | proxy_list[0].name.first |
    | x[i].name.first | Proxyname2 | proxy_list[1].name.first |
    | x.there_is_another | 2 | proxy_list.there_is_another |
    | radio_other | radio_other_opt_3 |  |
    | radio_yesno | False |  |
    | screen_features | True |  |
    | showif_checkbox_yesno | False |  |
    | showif_checkboxes_other['showif_checkboxes_nota_1'] | false |  |
    | showif_checkboxes_other['showif_checkboxes_nota_2'] | true |  |
    | showif_checkboxes_other['showif_checkboxes_nota_3'] | false |  |
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
