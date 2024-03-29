@story_tables @table
Feature: Story tables

NOTE:
    Unit tests make sure that all things that are supposed to match do match.

@fast @st1 @mixed
Scenario: Proxy and regular vars are mixed
  Given I start the interview at "AL_tests"
  And I get to "end" with this data:
    | var | value | trigger |
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
  And I get to "the end" with this data:
    | var | value | trigger |
    | direct_showifs | True |  |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
    | button_continue | True |  |
    | buttons_other | button_2 | |
    | buttons_yesnomaybe | True |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | checkboxes_other['checkbox_other_opt_2'] | true |  |
    | checkboxes_other['checkbox_other_opt_3'] | false |  |
    | checkboxes_yesno | True |  |
    | direct_standard_fields | True |  |
    | combobox_input | Custom combobox option |  |
    | dropdown_test | dropdown_opt_2 |  |
    | object_checkboxes_test["obj_chkbx_opt_1"] | true | |
    | object_dropdown | obj_opt_2 | |
    | radio_other | radio_other_opt_3 |  |
    | radio_yesno | False |  |
    | screen_features | True |  |
    | showif_checkbox_yesno | False |  |
    | showif_checkboxes_other['showif_checkboxes_nota_1'] | false |  |
    | showif_checkboxes_other['showif_checkboxes_nota_2'] | true |  |
    | showif_checkboxes_other['showif_checkboxes_nota_3'] | false |  |
    | showif_combobox_input | Showif custom combobox value |  |
    | showif_dropdown | showif_dropdown_1 |  |
    | showif_radio_other | showif_radio_multi_2 |  |
    | showif_text_input | Show if text input value |  |
    | showif_textarea | Show if\nmultiline text\narea value |  |
    | showif_yesnoradio | True |  |
    | text_input | Regular text input field value |  |
    | textarea | Multiline text\narea value |  |
    | show_3 | True |  |
    | show_2 | True |  |
    | signature_1 |  |  |
    | signature_2 |  |  |
    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    | single_dropdown_field | email | |
    | x[i].name.first | Proxyname1 | proxy_list[0].name.first |
    | x[i].name.first | Proxyname2 | proxy_list[1].name.first |
    | x.target_number | 2 | proxy_list.target_number |

@fast @st3 @quotes
Scenario: Story table accidentally uses the opposite double or single quotes
  Given I start the interview at "all_tests"
  And I get to "direct standard fields" with this data:
    | var | value | trigger |
    | double_quote_dict['double_quote_key']["dq_two"] | true |  |
    | single_quote_dict["single_quote_key"]['sq_two'] | true |  |

@fast @st4 @upload
Scenario: I upload files with a table
  Given I start the interview at "all_tests"
  And I get to "group of complex fields" with this data:
    | var | value | trigger |
    | upload_files_visible | some_png_1.png, some_png_2.png |  |
    | show_upload | True |  |
    | upload_files_hidden | some_png_2.png |  |

@slow @st5 @loops
Scenario: 0 target_number for there_are_any and target_number lists, 1 for there_is_another
  Given I start the interview at "test_loops.yml"
  And I get to "end" with this data:
    | var | value | trigger |
    | x.target_number | 0 | there_are_any_people.target_number |
    | x.target_number | 1 | there_is_another_people.target_number |
    | x[i].name.first | AnotherPerson1 | there_is_another_people[0].name.first |
    | target_people.target_number | 0 |  |
  And I SHOULD see the phrase "there_are_any_people people: 0"
  And I SHOULD see the phrase "there_is_another_people people: 1"
  And I SHOULD see the phrase "target_people people: 0"

@st5_no_proxy @loops @no_proxy
Scenario: 0 target_number for there_are_any and target_number lists, 1 for there_is_another
  Given I start the interview at "test_loops.yml"
  And I get to "end" with this data:
    | var | value |
    | there_are_any_people.target_number | 0 |
    | there_is_another_people.target_number | 1 |
    | there_is_another_people[0].name.first | AnotherPerson1 |
    | target_people.target_number | 0 |
  And I SHOULD see the phrase "there_are_any_people people: 0"
  And I SHOULD see the phrase "there_is_another_people people: 1"
  And I SHOULD see the phrase "target_people people: 0"

@slow @st6 @loops
Scenario: target_number 2 for there_are_any, there_is_another, and target_number lists
  Given I start the interview at "test_loops.yml"
  And I take a screenshot
  And I get to "end" with this data:
    | var | value | trigger |
    | x.target_number | 2 | there_are_any_people.target_number |
    | x[i].name.first | AnyPerson1 | there_are_any_people[0].name.first |
    | x[i].name.first | AnyPerson2 | there_are_any_people[1].name.first |
    | x.target_number | 2 | there_is_another_people.target_number |
    | x[i].name.first | AnotherPerson1 | there_is_another_people[0].name.first |
    | x[i].name.first | AnotherPerson2 | there_is_another_people[1].name.first |
    | target_people.target_number | 2 |  |
    | x[i].name.first | TargetPerson1 | target_people[0].name.first |
    | x[i].name.first | TargetPerson2 | target_people[1].name.first |
  And I SHOULD see the phrase "there_are_any_people people: 2"
  And I SHOULD see the phrase "there_is_another_people people: 2"
  And I SHOULD see the phrase "target_people people: 2"

@slow @st6_no_proxy @loops @no_proxy
Scenario: target_number 2 for there_are_any, there_is_another, and target_number lists
  Given I start the interview at "test_loops.yml"
  And I take a screenshot
  And I get to "end" with this data:
    | var | value |
    | there_are_any_people.target_number | 2 |
    | there_are_any_people[0].name.first | AnyPerson1 |
    | there_are_any_people[1].name.first | AnyPerson2 |
    | there_is_another_people.target_number | 2 |
    | there_is_another_people[0].name.first | AnotherPerson1 |
    | there_is_another_people[1].name.first | AnotherPerson2 |
    | target_people.target_number | 2 |
    | target_people[0].name.first | TargetPerson1 |
    | target_people[1].name.first | TargetPerson2 |
  And I SHOULD see the phrase "there_are_any_people people: 2"
  And I SHOULD see the phrase "there_is_another_people people: 2"
  And I SHOULD see the phrase "target_people people: 2"

@slow @st7 @loops
Scenario: target_number 1 for all people lists
  Given I start the interview at "test_loops.yml"
  And I take a screenshot
  And I get to "end" with this data:
    | var | value | trigger |
    | x.target_number | 1 | there_are_any_people.target_number |
    | x[i].name.first | AnyPerson1 | there_are_any_people[0].name.first |
    | x.target_number | 1 | there_is_another_people.target_number |
    | x[i].name.first | AnotherPerson1 | there_is_another_people[0].name.first |
    | target_people.target_number | 1 |  |
    | x[i].name.first | TargetPerson1 | target_people[0].name.first |
  And I SHOULD see the phrase "there_are_any_people people: 1"
  And I SHOULD see the phrase "there_is_another_people people: 1"
  And I SHOULD see the phrase "target_people people: 1"

@st8 @no_proxy @2_column @compare_docs
Scenario: No proxies when I sign twice with a 2-column table
  Given I start the interview at "test_pdf"
  And I get to "2_signature download" with this data:
  | var | value |
  | proxy_list.target_number | 2 |
  | proxy_list[0].name.first | 2 column name 1 |
  | proxy_list[1].name.first | 2 column name 2 |
  | proxy_list[0].signature |  |
  | proxy_list[1].signature |  |
  When I download "2_signature.pdf"
  Then I expect the baseline PDF "2_column_2_signature-Baseline.pdf" and the new PDF "2_signature.pdf" to be the same
