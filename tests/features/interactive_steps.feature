@interactive
Feature: Interactive steps

# In tag names, 'i' is for 'interactive'

@slow @i1
Scenario: I set text-type values
  Given I start the interview at "all_tests"
  And I set the var "checkboxes_yesno" to "True"
  And I set the var "checkboxes_other['checkbox_other_opt_1']" to "true"
  And I set the var "dropdown_test" to "dropdown_opt_2"
  And I set the var "radio_yesno" to "False"
  And I set the var "radio_other" to "radio_other_opt_3"
  And I set the var "text_input" to "Regular text input field value"
  And I set the var "textarea" to "Multiline text\narea value"
  When I set the var "direct_standard_fields" to "True"
  # Next page
  Then the question id should be "showifs"
  When I set the var "show_2" to "True"
  And I set the var "show_3" to "True"
  And I set the var "showif_checkbox_yesno['showif_checkboxes_nota_2']" to "true"
  And I set the var "showif_checkboxes_other['showif_checkboxes_nota_3']" to "true"
  And I set the var "showif_yesnoradio" to "True"
  And I set the var "showif_radio_other" to "showif_radio_multi_2"
  And I set the var "showif_text_input" to "Show if text input value"
  And I set the var "showif_textarea" to "Show if\nmultiline text\narea value"
  And I set the var "showif_dropdown" to "showif_dropdown_1"
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
