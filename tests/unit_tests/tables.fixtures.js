let tables =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
tables.standard = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var": "direct_standard_fields", "value": "True", "checked": false },  // May want to change `checked`
  { "var": "checkboxes_yesno", "value": "True", "checked": true },
  { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_1", "checked": false },
  { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_2", "checked": true },
  { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_3", "checked": false },
  { "var": "checkboxes_other_1", "value": "None", "checked": false },
  { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_1", "checked": false },
  { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_2", "checked": false },
  { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_3", "checked": false },
  { "var": "checkboxes_other_2", "value": "None", "checked": true },
  { "var": "radio_yesno", "value": "False", "checked": true },
  { "var": "radio_other", "value": "radio_other_opt_2", "checked": true },
  { "var": "text_input", "value": "Some one-line text", "checked": "" },
  { "var": "textarea", "value": "Some\nmulti-line\ntext", "checked": "" },
  { "var": "dropdown_test", "value": "dropdown_opt_2", "checked": true },  // May want to change `checked`
];


// ============================
// Simple show if fields - no proxies
// ============================
tables.show_if = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var": "direct_showifs", "value": "True", "checked": true, },  // May want to change `checked`
  { "var": "show_2", "value": "True", "checked": true, },
  { "var": "show_3", "value": "True", "checked": false, },
  { "var": "showif_checkbox_yesno", "value": "True", "checked": true, },
  { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": false, },
  { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": true, },
  { "var": "showif_checkboxes_other", "value": "None", "checked": false, },
  { "var": "showif_yesnoradio", "value": "False", "checked": true, },
  { "var": "showif_radio_other", "value": "showif_radio_multi_2", "checked": true, },
  { "var": "showif_text_input", "value": "Some one-line text in show if input", "checked": "", },
  { "var": "showif_textarea", "value": "Some\nmulti-line\ntext in show if textarea", "checked": "", },
  { "var": "showif_dropdown", "value": "showif_dropdown_2", "checked": true, },  // May want to change `checked`
];


// ============================
// Buttons
// ============================
// `continue button field:`
tables.button_continue = [
  { "var": "button_continue", "value": "True", "checked": true, },  // May want to change `checked`
];

// `yesnomaybe:`
tables.buttons_yesnomaybe_yes = [
  { "var": "buttons_yesnomaybe", "value": "True", "checked": true, },  // May want to change `checked`
];
tables.buttons_yesnomaybe_no = [
  { "var": "buttons_yesnomaybe", "value": "False", "checked": true, },  // May want to change `checked`
];
tables.buttons_yesnomaybe_none = [
  { "var": "buttons_yesnomaybe", "value": "None", "checked": true, },  // May want to change `checked`
];

// `field:` and `buttons:`
tables.buttons_other_1 = [
  { "var": "buttons_other", "value": "button_1", "checked": true, },  // May want to change `checked`
];
tables.buttons_other_2 = [
  { "var": "buttons_other", "value": "button_2", "checked": true, },  // May want to change `checked`
];
tables.buttons_other_3 = [
  { "var": "buttons_other", "value": "button_3", "checked": true, },  // May want to change `checked`
];

// `field:` and `action buttons:`
tables.buttons_event_action = [
  { "var": "end", "value": "", "checked": "", },  // May want to change `checked`
];


module.exports = tables;
