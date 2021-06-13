@interactive
Feature: Interactive steps

# In tag names, 'i' is for 'interactive'

@slow @i1
Scenario: I set text-type values
  Given I start the interview at "all_tests"
  And I set the "True" choice of var "checkboxes_yesno" to "true"
  And I set the "checkbox_other_opt_1" choice of var "checkboxes_other" to "true"
  And I set the var "dropdown_test" to "dropdown_opt_2"
  And I set the "False" choice of var "radio_yesno" to "true"
  And I set the "radio_other_opt_3" choice of var "radio_other" to "true"
  And I set the var "text_input" to "Regular text input field value"
  And I set the var "textarea" to "Multiline text\narea value"
  When I set the "True" choice of var "direct_standard_fields" to "true"
  # Next page
  Then the question id should be "showifs"
  When I set the "True" choice of var "show_2" to "true"
  And I set the "True" choice of var "show_3" to "true"
  And I set the "showif_checkboxes_nota_2" choice of var "showif_checkbox_yesno" to "true"
  And I set the "showif_checkboxes_nota_3" choice of var "showif_checkboxes_other" to "true"
  And I set the "True" choice of var "showif_yesnoradio" to "true"
  And I set the "showif_radio_multi_2" choice of var "showif_radio_other" to "true"
  And I set the var "showif_text_input" to "Show if text input value"
  And I set the var "showif_textarea" to "Show if\nmultiline text\narea value"
  And I set the var "showif_dropdown" to "showif_dropdown_1"
  When I tap to continue
  # Next page
  Then the question id should be "buttons yesnomaybe"
  When I set the "None" choice of var "buttons_yesnomaybe" to "true"
  # Next page
  Then the question id should be "buttons other"
  When I set the "button_3" choice of var "buttons_other" to "true"
  # Next page
  Then the question id should be "button continue"
  When I set the "True" choice of var "button_continue" to "true"
  # Next page
  Then the question id should be "screen features"
  When I tap to continue
  # Next page
  Then the question id should be "proxy vars"
  When I set the var "x[i].name.first" to "Proxyname1"
  And I tap to continue
  # Next page
  Then the question id should be "proxy vars"
  When I set the var "x[i].name.first" to "Proxyname2"
  And I tap to continue
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
  And I tap to continue
  # Next page
  Then the question id should be "button event action"
  And I tap to continue
  # Next page
  Then the question id should be "the end"
