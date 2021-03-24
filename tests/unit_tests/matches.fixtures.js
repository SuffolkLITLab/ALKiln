let matches =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
matches.standard = [
  // 3 radio choices that won't get selected
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"Y2hlY2tib3hlc195ZXNubw\"][value=\"True\"]", "rows": [ { "var_name": "checkboxes_yesno", "value": "True", "checked": false } ] },
    "table": { "var_name": "checkboxes_yesno", "value": "True", "checked": true },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1RJ10\"][value=\"True\"]", "rows": [ { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_1", "checked": false }, { "var_name": "checkboxes_other_1", "value": "r\u0017���1��az����m�", "checked": false } ] },
    "table": { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_1", "checked": false },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1nJ10\"][value=\"True\"]", "rows": [ { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_2", "checked": false }, { "var_name": "checkboxes_other_1", "value": "r\u0017���1��az����m�", "checked": false } ] },
    "table": { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_2", "checked": true },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk13J10\"][value=\"True\"]", "rows": [ { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_3", "checked": false }, { "var_name": "checkboxes_other_1", "value": "r\u0017���1��az����m�", "checked": false } ] },
    "table": { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_3", "checked": false },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"_ignore1\"]", "rows": [ { "var_name": "checkboxes_other_1", "value": "al_danota", "checked": false } ] },
    "table": { "var_name": "checkboxes_other_1", "value": "al_danota", "checked": false },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1RJ10\"][value=\"True\"]", "rows": [ { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_1", "checked": false }, { "var_name": "checkboxes_other_2", "value": "r\u0017���1��az����m�", "checked": false } ] },
    "table": { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_1", "checked": false },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1nJ10\"][value=\"True\"]", "rows": [ { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_2", "checked": false }, { "var_name": "checkboxes_other_2", "value": "r\u0017���1��az����m�", "checked": false } ] },
    "table": { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_2", "checked": false },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk13J10\"][value=\"True\"]", "rows": [ { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_3", "checked": false }, { "var_name": "checkboxes_other_2", "value": "r\u0017���1��az����m�", "checked": false } ] },
    "table": { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_3", "checked": false },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"_ignore2\"]", "rows": [ { "var_name": "checkboxes_other_2", "value": "al_danota", "checked": false } ] },
    "table": { "var_name": "checkboxes_other_2", "value": "al_danota", "checked": true },
  },
  {
    "field": { "tag": "input", "type": "radio", "selector": "input[name=\"cmFkaW9feWVzbm8\"][value=\"False\"]", "rows": [ { "var_name": "radio_yesno", "value": "False", "checked": false } ] },
    "table": { "var_name": "radio_yesno", "value": "False", "checked": true },
  },
  {
    "field": { "tag": "input", "type": "radio", "selector": "input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_2\"]", "rows": [ { "var_name": "radio_other", "value": "radio_other_opt_2", "checked": false } ] },
    "table": { "var_name": "radio_other", "value": "radio_other_opt_2", "checked": true },
  },
  {
    "field": { "tag": "input", "type": "text", "selector": "input[name=\"dGV4dF9pbnB1dA\"]", "rows": [ { "var_name": "text_input", "value": "", "checked": "" } ] },
    "table": { "var_name": "text_input", "value": "Some one-line text", "checked": "" },
  },
  {
    "field": { "tag": "textarea", "type": "", "selector": "textarea[name=\"dGV4dGFyZWE\"]", "rows": [ { "var_name": "textarea", "value": "", "checked": "" } ] },
    "table": { "var_name": "textarea", "value": "Some\nmulti-line\ntext", "checked": "" },
  },
  {
    "field": { "tag": "select", "type": "", "selector": "select[name=\"ZHJvcGRvd25fdGVzdA\"]", "rows": [ { "var_name": "dropdown_test", "value": "", "checked": false }, { "var_name": "dropdown_test", "value": "dropdown_opt_1", "checked": false }, { "var_name": "dropdown_test", "value": "dropdown_opt_2", "checked": false }, { "var_name": "dropdown_test", "value": "dropdown_opt_3", "checked": false } ] },
    "table": { "var_name": "dropdown_test", "value": "dropdown_opt_2", "checked": true },
  },
  {
    "field": { "tag": "button", "type": "submit", "selector": "button[name=\"ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw\"][value=\"True\"]", "rows": [ { "var_name": "direct_standard_fields", "value": "True", "checked": false } ] },
    "table": { "var_name": "direct_standard_fields", "value": "True", "checked": false },  // May want to fix this
  },
];


// ============================
// Simple show if fields - no proxies
// ============================
matches.show_if = [
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"c2hvd18y\"][value=\"True\"]", "rows": [ { "var_name": "show_2", "value": "True", "checked": false }], },
    "table": { "var_name": "show_2", "value": "True", "checked": true, },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"X2ZpZWxkXzE\"][value=\"True\"]", "rows": [ { "var_name": "show_3", "value": "True", "checked": false }], },
    "table": { "var_name": "show_3", "value": "True", "checked": false, },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"X2ZpZWxkXzI\"][value=\"True\"]", "rows": [ { "var_name": "showif_checkbox_yesno", "value": "True", "checked": false }], },
    "table": { "var_name": "showif_checkbox_yesno", "value": "True", "checked": true, },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eCdd\"][value=\"True\"]", "rows": [ { "var_name": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": false }, { "var_name": "showif_checkboxes_other", "value": "�\u001a0��܅�$n�^��赯�", "checked": false }], },
    "table": { "var_name": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": false, },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eSdd\"][value=\"True\"]", "rows": [ { "var_name": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": false }, { "var_name": "showif_checkboxes_other", "value": "�\u001a0��܅�$n�^��赯�", "checked": false }], },
    "table": { "var_name": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": true, },
  },
  {
    "field": { "tag": "input", "type": "checkbox", "selector": "input[name=\"_ignore3\"]", "rows": [ { "var_name": "showif_checkboxes_other", "value": "al_danota", "checked": false }], },
    "table": { "var_name": "showif_checkboxes_other", "value": "al_danota", "checked": false, },
  },
  {
    "field": { "tag": "input", "type": "radio", "selector": "input[name=\"X2ZpZWxkXzQ\"][value=\"False\"]", "rows": [ { "var_name": "showif_yesnoradio", "value": "False", "checked": false }], },
    "table": { "var_name": "showif_yesnoradio", "value": "False", "checked": true, },
  },
  {
    "field": { "tag": "input", "type": "radio", "selector": "input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_2\"]", "rows": [ { "var_name": "showif_radio_other", "value": "showif_radio_multi_2", "checked": false }], },
    "table": { "var_name": "showif_radio_other", "value": "showif_radio_multi_2", "checked": true, },
  },
  {
    "field": { "tag": "input", "type": "text", "selector": "input[name=\"X2ZpZWxkXzY\"]", "rows": [ { "var_name": "showif_text_input", "value": "", "checked": "" }], },
    "table": { "var_name": "showif_text_input", "value": "Some one-line text in show if input", "checked": "", },
  },
  {
    "field": { "tag": "textarea", "type": "", "selector": "textarea[name=\"X2ZpZWxkXzc\"]", "rows": [ { "var_name": "showif_textarea", "value": "", "checked": "" }], },
    "table": { "var_name": "showif_textarea", "value": "Some\nmulti-line\ntext in show if textarea", "checked": "", },
  },
  {
    "field": { "tag": "select", "type": "", "selector": "select[name=\"X2ZpZWxkXzg\"]", "rows": [ { "var_name": "showif_dropdown", "value": "", "checked": false }, { "var_name": "showif_dropdown", "value": "showif_dropdown_1", "checked": false }, { "var_name": "showif_dropdown", "value": "showif_dropdown_2", "checked": false }, { "var_name": "showif_dropdown", "value": "showif_dropdown_3", "checked": false }], },
    "table": { "var_name": "showif_dropdown", "value": "showif_dropdown_2", "checked": true, },
  },
  {
    "field": { "tag": "button", "type": "submit", "selector": "button[name=\"ZGlyZWN0X3Nob3dpZnM\"][value=\"True\"]", "rows": [ { "var_name": "direct_showifs", "value": "True", "checked": false }], },
    "table": { "var_name": "direct_showifs", "value": "True", "checked": true, },
  },
];


// ============================
// Buttons
// ============================
matches.buttons_yesnomaybe_yes = [
  {
  "field": { "selector": "button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"]", "tag": "button", "rows": [ { "var_name": "buttons_yesnomaybe", "value": "True", "checked": false, } ], "type": "submit" },
  "table": { "var_name": "buttons_yesnomaybe", "value": "True", "checked": true, },
  }
];
matches.buttons_yesnomaybe_no = [
  {
  "field": { "selector": "button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"]", "tag": "button", "rows": [ { "var_name": "buttons_yesnomaybe", "value": "False", "checked": false, } ], "type": "submit" },
  "table": { "var_name": "buttons_yesnomaybe", "value": "False", "checked": true, },
  }
];
matches.buttons_yesnomaybe_none = [
  {
  "field": { "selector": "button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"]", "tag": "button", "rows": [ { "var_name": "buttons_yesnomaybe", "value": "None", "checked": false, } ], "type": "submit" },
  "table": { "var_name": "buttons_yesnomaybe", "value": "None", "checked": true, },
  }
];


module.exports = matches;
