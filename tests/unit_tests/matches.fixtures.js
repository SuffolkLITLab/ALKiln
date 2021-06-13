let matches = {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// Text field has multiple results
matches.standard = [
  { "selector": "#daquestion input[name=\"Y2hlY2tib3hlc195ZXNubw\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [{ "var": "checkboxes_yesno", "value": "True" }] }, 
  { "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1RJ10\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1nJ10\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [{ "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_2" }] }, 
  { "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk13J10\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"_ignore1\"]", "type": "checkbox", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1RJ10\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1nJ10\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk13J10\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"_ignore2\"]", "type": "checkbox", "tag": "input",
    "table_rows": [{ "var": "checkboxes_other_2", "value": "None" }] }, 
  { "selector": "#daquestion input[name=\"cmFkaW9feWVzbm8\"][value=\"True\"]", "type": "radio", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"cmFkaW9feWVzbm8\"][value=\"False\"]", "type": "radio", "tag": "input",
    "table_rows": [{ "var": "radio_yesno", "value": "False" }] }, 
  { "selector": "#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_1\"]", "type": "radio", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_2\"]", "type": "radio", "tag": "input",
    "table_rows": [{ "var": "radio_other", "value": "radio_other_opt_2" }] }, 
  { "selector": "#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_3\"]", "type": "radio", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"dGV4dF9pbnB1dA\"]", "type": "text", "tag": "input",
    "table_rows": [{ "var": "text_input", "value": "Some one-line text" }, { "value": "Some conflicting text", "var": "text_input" }] }, 
  { "selector": "#daquestion textarea[name=\"dGV4dGFyZWE\"]", "type": "", "tag": "textarea",
    "table_rows": [{ "var": "textarea", "value": "Some\nmulti-line\ntext" }] }, 
  { "selector": "#daquestion select[name=\"ZHJvcGRvd25fdGVzdA\"]", "type": "", "tag": "select",
    "table_rows": [{ "var": "dropdown_test", "value": "dropdown_opt_2" }] }, 
  { "selector": "#daquestion button[name=\"ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw\"][value=\"True\"]", "type": "submit", "tag": "button",
    "table_rows": [{ "var": "direct_standard_fields", "value": "True" }] }
];


// ============================
// Simple show if fields - no proxies
// ============================
matches.show_if = [
  { "selector": "#daquestion input[name=\"c2hvd18y\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [{ "var": "show_2", "value": "True" }] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzE\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [{ "var": "show_3", "value": "True" }] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzI\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [{ "var": "showif_checkbox_yesno", "value": "True" }] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eCdd\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eSdd\"][value=\"True\"]", "type": "checkbox", "tag": "input",
    "table_rows": [{ "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2" }] }, 
  { "selector": "#daquestion input[name=\"_ignore3\"]", "type": "checkbox", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzQ\"][value=\"True\"]", "type": "radio", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzQ\"][value=\"False\"]", "type": "radio", "tag": "input",
    "table_rows": [{ "var": "showif_yesnoradio", "value": "False" }] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_1\"]", "type": "radio", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_2\"]", "type": "radio", "tag": "input",
    "table_rows": [{ "var": "showif_radio_other", "value": "showif_radio_multi_2" }] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_3\"]", "type": "radio", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzY\"]", "type": "text", "tag": "input",
    "table_rows": [{ "var": "showif_text_input", "value": "Some one-line text in show if input" }] }, 
  { "selector": "#daquestion textarea[name=\"X2ZpZWxkXzc\"]", "type": "", "tag": "textarea",
    "table_rows": [{ "var": "showif_textarea", "value": "Some\nmulti-line\ntext in show if textarea" }] }, 
  { "selector": "#daquestion select[name=\"X2ZpZWxkXzg\"]", "type": "", "tag": "select",
    "table_rows": [{ "var": "showif_dropdown", "value": "showif_dropdown_2" }] }, 
  { "selector": "#daquestion button[name=\"ZGlyZWN0X3Nob3dpZnM\"][value=\"True\"]", "type": "submit", "tag": "button",
    "table_rows": [{ "var": "direct_showifs", "value": "True" }] }
];


// ============================
// Buttons
// ============================
// `continue button field:`
matches.button_continue = [
  { "selector": "#daquestion button[name=\"YnV0dG9uX2NvbnRpbnVl\"][value=\"True\"]", "type": "submit", "tag": "button",
    "table_rows": [{ "var": "button_continue", "value": "True" }] }
];

// `yesnomaybe:`
matches.buttons_yesnomaybe_yes = [
  { "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"]", "type": "submit", "tag": "button",
    "table_rows": [{ "var": "buttons_yesnomaybe", "value": "True" }] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"]", "type": "submit", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"]", "type": "submit", "tag": "button",
    "table_rows": [] }
];
matches.buttons_yesnomaybe_no = [
  { "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"]", "type": "submit", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"]", "type": "submit", "tag": "button",
    "table_rows": [{ "var": "buttons_yesnomaybe", "value": "False" }] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"]", "type": "submit", "tag": "button",
    "table_rows": [] }
];
matches.buttons_yesnomaybe_none = [
  { "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"]", "type": "submit", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"]", "type": "submit", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"]", "type": "submit", "tag": "button",
    "table_rows": [{ "var": "buttons_yesnomaybe", "value": "None" }] }
];

// `field:` and `buttons:`
matches.buttons_other_1 = [
  { "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_1\"]", "type": "submit", "tag": "button",
    "table_rows": [{ "var": "buttons_other", "value": "button_1" }] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_2\"]", "type": "submit", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_3\"]", "type": "submit", "tag": "button",
    "table_rows": [] }
];
matches.buttons_other_2 = [
  { "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_1\"]", "type": "submit", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_2\"]", "type": "submit", "tag": "button",
    "table_rows": [{ "var": "buttons_other", "value": "button_2" }] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_3\"]", "type": "submit", "tag": "button",
    "table_rows": [] }
];
matches.buttons_other_3 = [
  { "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_1\"]", "type": "submit", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_2\"]", "type": "submit", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_3\"]", "type": "submit", "tag": "button",
    "table_rows": [{ "var": "buttons_other", "value": "button_3" }] }
];

// `field:` and `action buttons:`
matches.buttons_event_action = [
  { "selector": "#daquestion button[name=\"YnV0dG9uX2V2ZW50X2FjdGlvbg\"][value=\"True\"]", "type": "submit", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion a[data-linknum=\"1\"]", "type": "", "tag": "a",
    "table_rows": [{ "var": "end", "value": "" }] }
];


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
matches.proxies_xi = [
  { "selector": "#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"]", "type": "text", "tag": "input",
    "table_rows": [{ "sought": "a_list[0].name.first", "var": "x[i].name.first", "value": "Firstname" }] }, 
  { "selector": "#daquestion button", "type": "submit", "tag": "button",
    "table_rows": [] }
];

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
matches.proxies_multi = [
  { "selector": "#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"]", "type": "text", "tag": "input",
    "table_rows": [{ "sought": "a_list[0].name.first", "var": "x[i].name.first", "value": "Firstname1" }] }, 
  { "selector": "#daquestion button", "type": "submit", "tag": "button",
    "table_rows": [] }
];

// your_past_benefits[i].still_receiving
// your_past_benefits['State Veterans Benefits'].still_receiving
// Non-match comes after a match
matches.proxies_non_match = [
  { "selector": "#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU\"]", "type": "date", "tag": "input",
    "table_rows": [{ "sought": "your_past_benefits['State Veterans Benefits'].still_receiving", "var": "your_past_benefits[i].start_date", "value": "01/01/2001" }] }, 
  { "selector": "#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw\"][value=\"True\"]", "type": "radio", "tag": "input",
    "table_rows": [{ "sought": "your_past_benefits['State Veterans Benefits'].still_receiving", "var": "your_past_benefits[i].still_receiving", "value": "True" }] }, 
  { "selector": "#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw\"][value=\"False\"]", "type": "radio", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"X2ZpZWxkXzM\"]", "type": "date", "tag": "input",
    "table_rows": [{ "sought": "your_past_benefits['State Veterans Benefits'].still_receiving", "var": "your_past_benefits[i].end_date", "value": "02/02/2002" }] }, 
  { "selector": "#daquestion button", "type": "submit", "tag": "button",
    "table_rows": [] }
];


// ============================
// Signature
// ============================
matches.signature = [
  { "selector": "#daquestion canvas", "type": "", "tag": "canvas",
    "table_rows": [{ "sought": "signature_1", "var": "signature_1", "value": "/sign" }] }
];


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
matches.choices = [
  { "selector": "#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"Yes\"]", "type": "radio", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"No\"]", "type": "radio", "tag": "input",
    "table_rows": [{ "var": "cs_arrears_mc", "value": "No" }] }, 
  { "selector": "#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"I am not sure\"]", "type": "radio", "tag": "input",
    "table_rows": [] }, 
  { "selector": "#daquestion button", "type": "submit", "tag": "button",
    "table_rows": [] }
];


// ============================
// dropdowns created with objects
// ============================
// ```
// - Something: some_var
//   datatype: object
//   object labeler: |
//     lambda y: y.short_label()```
//   choices: some_obj
// ```
matches.object_dropdown = [
  { "selector": "#daquestion select[name=\"dHJpYWxfY291cnQ\"]", "type": "", "tag": "select",
    "table_rows": [{ "var": "trial_court", "value": "all_courts[0]" }] }, 
  { "selector": "#daquestion button", "type": "button", "tag": "button",
    "table_rows": [] }, 
  { "selector": "#daquestion button", "type": "submit", "tag": "button",
    "table_rows": [] }
];


module.exports = matches;