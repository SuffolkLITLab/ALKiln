let tables =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
tables.standard = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var_name": "direct_standard_fields", "value": "True", "checked": false },  // May want to change `checked`
  { "var_name": "checkboxes_yesno", "value": "True", "checked": true },
  { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_1", "checked": false },
  { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_2", "checked": true },
  { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_3", "checked": false },
  { "var_name": "checkboxes_other_1", "value": "al_danota", "checked": false },
  { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_1", "checked": false },
  { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_2", "checked": false },
  { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_3", "checked": false },
  { "var_name": "checkboxes_other_2", "value": "al_danota", "checked": true },
  { "var_name": "radio_yesno", "value": "False", "checked": true },
  { "var_name": "radio_other", "value": "radio_other_opt_2", "checked": true },
  { "var_name": "text_input", "value": "Some one-line text", "checked": "" },
  { "var_name": "textarea", "value": "Some\nmulti-line\ntext", "checked": "" },
  { "var_name": "dropdown_test", "value": "dropdown_opt_2", "checked": true },  // May want to change `checked`
];


// ============================
// Simple show if fields - no proxies
// ============================
tables.show_if = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var_name": "direct_showifs", "value": "True", "checked": true, },  // May want to change `checked`
  { "var_name": "show_2", "value": "True", "checked": true, },
  { "var_name": "show_3", "value": "True", "checked": false, },
  { "var_name": "showif_checkbox_yesno", "value": "True", "checked": true, },
  { "var_name": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": false, },
  { "var_name": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": true, },
  { "var_name": "showif_checkboxes_other", "value": "al_danota", "checked": false, },
  { "var_name": "showif_yesnoradio", "value": "False", "checked": true, },
  { "var_name": "showif_radio_other", "value": "showif_radio_multi_2", "checked": true, },
  { "var_name": "showif_text_input", "value": "Some one-line text in show if input", "checked": "", },
  { "var_name": "showif_textarea", "value": "Some\nmulti-line\ntext in show if textarea", "checked": "", },
  { "var_name": "showif_dropdown", "value": "showif_dropdown_2", "checked": true, },  // May want to change `checked`
];


// ============================
// Buttons
// ============================
tables.buttons_yesnomaybe_yes = [
  { "var_name": "buttons_yesnomaybe", "value": "True", "checked": true, },  // May want to change `checked`
];
tables.buttons_yesnomaybe_no = [
  { "var_name": "buttons_yesnomaybe", "value": "False", "checked": true, },  // May want to change `checked`
];
tables.buttons_yesnomaybe_none = [
  { "var_name": "buttons_yesnomaybe", "value": "None", "checked": true, },  // May want to change `checked`
];

tables.buttons_other_1 = [
  { "var_name": "buttons_other", "value": "button_1", "checked": true, },  // May want to change `checked`
];
tables.buttons_other_2 = [
  { "var_name": "buttons_other", "value": "button_2", "checked": true, },  // May want to change `checked`
];
tables.buttons_other_3 = [
  { "var_name": "buttons_other", "value": "button_3", "checked": true, },  // May want to change `checked`
];

module.exports = tables;
