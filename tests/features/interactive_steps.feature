@interactive
Feature: Interactive steps

# In tag names, 'i' is for 'interactive'

@slow @i1
Scenario: I set various values
  Given I start the interview at "all_tests"
  Then the question id should be "upload files"
  When I set the var "upload_files_visible" to "some_png_1.png, some_png_2.png"
  And I set the var "show_upload" to "True"
  And I upload "some_png_2.png,some_png_1.png" to "upload_files_hidden"
  And I tap to continue
  # Next page
  Then the question id should be "group of complex fields"
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
  And I set the var "date_input" to "today - 1"
  When I set the var "direct_standard_fields" to "True"
  # Next page
  Then the question id should be "showifs"
  When I set the var "show_2" to "True"
  And I set the var "show_3" to "True"
  And I set the var "showif_checkbox_yesno" to "true"
  And I set the var "showif_checkboxes_other['showif_checkboxes_nota_2']" to "true"
  And I set the var "showif_checkboxes_other['showif_checkboxes_nota_3']" to "true"
  And I set the var "showif_yesnoradio" to "True"
  And I set the var "showif_radio_other" to "showif_radio_multi_2"
  And I set the var "showif_text_input" to "Show if text input value"
  And I set the var "showif_textarea" to "Show if\nmultiline text\narea value"
  And I set the var "showif_dropdown" to "showif_dropdown_1"
  When I tap to continue
  # Next page
  Then the question id should be "object checkboxes"
  And I set the var "object_checkboxes_test['obj_chkbx_opt_1']" to "true" 
  And I set the var "object_dropdown" to "obj_opt_2"
  When I tap to continue
  # Next page
  Then the question id should be "buttons yesnomaybe"
  When I set the var "buttons_yesnomaybe" to "None"
  # Next page
  Then the question id should be "buttons other"
  When I set the var "buttons_other" to "button_3"
  # Next page
  Then the question id should be "button continue"
  When I set the var "button_continue" to "True"
  # Next page
  Then the question id should be "screen features"
  When I tap to continue
  # Next page
  Then the question id should be "proxy vars"
  When I set the var "x[i].name.first" to "Proxyname1"
  And I tap to continue
  # Next page
  Then the question id should be "is there another generic"
  When I set the var "x.there_is_another" to "True"
  # Next page
  Then the question id should be "proxy vars"
  When I set the var "x[i].name.first" to "Proxyname2"
  And I tap to continue
  # Next page
  Then the question id should be "is there another generic"
  When I set the var "x.there_is_another" to "False"
  # Next page
  Then the question id should be "first signature"
  When I sign
  And I tap to continue
  # Next page
  Then the question id should be "second signature"
  When I sign
  And I tap to continue
  # Next page
  Then the question id should be "simple doc"
  When I download "simple-doc.pdf"
  And I tap to continue
  # Next page
  Then the question id should be "button event action"
  And I tap to continue
  # Next page
  Then the question id should be "single-dropdown-field"
  And I set the var "single_dropdown_field" to "email"
  And I tap to continue
  # Next page
  Then the question id should be "the end"

@fast @i2 @secret
Scenario: handles settings from Github secrets
  Given the final Scenario status should be "failed"
  And the Scenario report should include:
  """
  The GitHub SECRET "SECRET_NOT_THERE" doesn't exist
  """
  Given I start the interview at "test_secret_vars"
  When I set the var "first_text_entry" to the secret "SECRET_VAR1"
  And I tap to continue
  Then I see the phrase "secret-var1-value"
  When I tap to continue
  And I set the var "second_text_entry" to the github secret "SECRET_VAR2"
  And I tap to continue
  Then I see the phrase "secret-var2-value"
  When I tap to continue
  And I set the variable "third_text_entry" to secret "SECRET_NOT_THERE"

@i3 @tap-elements @tabs
Scenario: tap elements
  Given I start the interview at "test_taps"
  And I tap the "Tests-first_template-tab" tab
  Then I see the phrase "Mechanics"
  And I tap the "Tests-second_template-tab" tab
  Then I see the phrase "villify"
  And I tap the "Tests-third_template-tab" tab
  Then I see the phrase "museum"
  And I tap the "#special_event" element and wait 1 second
  Then I see the phrase "Portishead"

@i4 @tap-elements @tabs @error
Scenario: tap element with an error
  Given the final Scenario status should be "failed"
  And the Scenario report should include:
  """
  is there a typo?
  """
  Given I start the interview at "test_taps"
  And I tap the "Tests-not_there-tab" tab

@i5 @decoding-test @object-multiselect
Scenario: Base64 encoded corner cases are decoded correctly
  Given I start the interview at "test_decoding"
  And I get to "end screen" with this data:
    | var | value | trigger |
    | object_multiselect_test['obj_opt_1'] | True | |
    | object_multiselect_test['obj_opt_3'] | True | |
    | multiselect_test['hi'] | True | |
    | multiselect_test['dear'] | True | |
    | object_radio_field | object_radio_choice_one | |
    | object_checkboxes_test['obj_chkbx_opt_1'] | True | |
    | object_dropdown | obj_opt_2 | |
    | checkbox_dict['single_quote_key']['🁳🧴🯍🥫🅍🗎🹇🗷🌲🯵'] | True | |

# This test should fail because it's target id is never found, but that also means
# it has succeeded because it didn't try to keep looking for the id by pressing 'restart'
# to continue.
@fast @i6
Scenario: Fails as it doesn't try to 'continue' with a restart button
  Given the final Scenario status should be "failed"
  And the Scenario report should include:
  """
  The test got stuck on "kickout-screen"
  """
  Given the max seconds for each step in this scenario is 10
  Given I start the interview at "test_kickout"
  And I get to "doesnt exist" with this data:
    | var | value | trigger |
    | user_choice | wrong | |
  
@i7
Scenario: I sign with text
  Given I start the interview at "all_tests"
  Then the question id should be "upload files"
  When I set the var "upload_files_visible" to "some_png_1.png, some_png_2.png"
  And I set the var "show_upload" to "True"
  And I upload "some_png_2.png,some_png_1.png" to "upload_files_hidden"
  And I tap to continue
  # Next page
  Then the question id should be "group of complex fields"
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
  And I set the var "date_input" to "today - 1"
  When I set the var "direct_standard_fields" to "True"
  # Next page
  Then the question id should be "showifs"
  When I set the var "show_2" to "True"
  And I set the var "show_3" to "True"
  And I set the var "showif_checkbox_yesno" to "true"
  And I set the var "showif_checkboxes_other['showif_checkboxes_nota_2']" to "true"
  And I set the var "showif_checkboxes_other['showif_checkboxes_nota_3']" to "true"
  And I set the var "showif_yesnoradio" to "True"
  And I set the var "showif_radio_other" to "showif_radio_multi_2"
  And I set the var "showif_text_input" to "Show if text input value"
  And I set the var "showif_textarea" to "Show if\nmultiline text\narea value"
  And I set the var "showif_dropdown" to "showif_dropdown_1"
  When I tap to continue
  # Next page
  Then the question id should be "object checkboxes"
  And I set the var "object_checkboxes_test['obj_chkbx_opt_1']" to "true" 
  And I set the var "object_dropdown" to "obj_opt_2"
  When I tap to continue
  # Next page
  Then the question id should be "buttons yesnomaybe"
  When I set the var "buttons_yesnomaybe" to "None"
  # Next page
  Then the question id should be "buttons other"
  When I set the var "buttons_other" to "button_3"
  # Next page
  Then the question id should be "button continue"
  When I set the var "button_continue" to "True"
  # Next page
  Then the question id should be "screen features"
  When I tap to continue
  # Next page
  Then the question id should be "proxy vars"
  When I set the var "x[i].name.first" to "Proxyname1"
  And I tap to continue
  # Next page
  Then the question id should be "is there another generic"
  When I set the var "x.there_is_another" to "True"
  # Next page
  Then the question id should be "proxy vars"
  When I set the var "x[i].name.first" to "Proxyname2"
  And I tap to continue
  # Next page
  Then the question id should be "is there another generic"
  When I set the var "x.there_is_another" to "False"
  # Next page
  Then the question id should be "first signature"
  When I sign
  And I wait 2 second
  

