let tables =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
tables.standard = [
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
  { "var_name": "direct_standard_fields", "value": "True", "checked": false }  // May want to change `checked`
];

module.exports = tables;
