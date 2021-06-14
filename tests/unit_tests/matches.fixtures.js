let matches =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
matches.standard = [
  // 3 radio choices that won't get selected
  {
    "field":{"selector":"#daquestion input[name=\"Y2hlY2tib3hlc195ZXNubw\"][value=\"True\"][id=\"Y2hlY2tib3hlc195ZXNubw\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"checkboxes_yesno","value":"True","checked":false}],"type":"checkbox"},
    "table": { "var": "checkboxes_yesno", "value": "True", "checked": true },
  },
  {
    "field":{"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1RJ10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8x_0\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"checkboxes_other_1","value":"checkbox_other_1_opt_1","checked":false},{"var":"checkboxes_other_1","value":"r\u0017���1��az����m�","checked":false}],"type":"checkbox"},
    "table": { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_1", "checked": false },
  },
  {
    "field":{"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1nJ10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8x_1\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"checkboxes_other_1","value":"checkbox_other_1_opt_2","checked":false},{"var":"checkboxes_other_1","value":"r\u0017���1��az����m�","checked":false}],"type":"checkbox"},
    "table": { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_2", "checked": true },
  },
  {
    "field":{"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk13J10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8x_2\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"checkboxes_other_1","value":"checkbox_other_1_opt_3","checked":false},{"var":"checkboxes_other_1","value":"r\u0017���1��az����m�","checked":false}],"type":"checkbox"},
    "table": { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_3", "checked": false },
  },
  {
    "field":{"selector":"#daquestion input[name=\"_ignore1\"][id=\"labelauty-712020\"][class=\"dafield1 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"checkboxes_other_1","value":"None","checked":false}],"type":"checkbox"},
    "table": { "var": "checkboxes_other_1", "value": "None", "checked": false },
  },
  {
    "field":{"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1RJ10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8y_0\"][class=\"dafield2 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"checkboxes_other_2","value":"checkbox_other_2_opt_1","checked":false},{"var":"checkboxes_other_2","value":"r\u0017���1��az����m�","checked":false}],"type":"checkbox"},
    "table": { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_1", "checked": false },
  },
  {
    "field":{"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1nJ10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8y_1\"][class=\"dafield2 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"checkboxes_other_2","value":"checkbox_other_2_opt_2","checked":false},{"var":"checkboxes_other_2","value":"r\u0017���1��az����m�","checked":false}],"type":"checkbox"},
    "table": { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_2", "checked": false },
  },
  {
    "field":{"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk13J10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8y_2\"][class=\"dafield2 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"checkboxes_other_2","value":"checkbox_other_2_opt_3","checked":false},{"var":"checkboxes_other_2","value":"r\u0017���1��az����m�","checked":false}],"type":"checkbox"},
    "table": { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_3", "checked": false },
  },
  {
    "field":{"selector":"#daquestion input[name=\"_ignore2\"][id=\"labelauty-344271\"][class=\"dafield2 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"checkboxes_other_2","value":"None","checked":false}],"type":"checkbox"},
    "table": { "var": "checkboxes_other_2", "value": "None", "checked": true },
  },
  {
    "field":{"selector":"#daquestion input[name=\"cmFkaW9feWVzbm8\"][value=\"False\"][id=\"cmFkaW9feWVzbm8_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"radio_yesno","value":"False","checked":false}],"type":"radio"},
    "table": { "var": "radio_yesno", "value": "False", "checked": true },
  },
  {
    "field":{"selector":"#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_2\"][id=\"cmFkaW9fb3RoZXI_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"radio_other","value":"radio_other_opt_2","checked":false}],"type":"radio"},
    "table": { "var": "radio_other", "value": "radio_other_opt_2", "checked": true },
  },
  {
    "field":{"selector":"#daquestion input[name=\"dGV4dF9pbnB1dA\"][id=\"dGV4dF9pbnB1dA\"][class=\"form-control\"]","tag":"input","guesses":[{"var":"text_input","value":"","checked":""}],"type":"text"},
    "table": { "var": "text_input", "value": "Some one-line text", "checked": "" },
  },
  {
    "field":{"selector":"#daquestion textarea[name=\"dGV4dGFyZWE\"][id=\"dGV4dGFyZWE\"][class=\"form-control\"]","tag":"textarea","guesses":[{"var":"textarea","value":"","checked":""}],"type":""},
    "table": { "var": "textarea", "value": "Some\nmulti-line\ntext", "checked": "" },
  },
  {
    "field":{"selector":"#daquestion select[name=\"ZHJvcGRvd25fdGVzdA\"][id=\"ZHJvcGRvd25fdGVzdA\"][class=\"form-control\"]","tag":"select","guesses":[{"var":"dropdown_test","value":"","checked":false},{"var":"dropdown_test","value":"","checked":false},{"var":"dropdown_test","value":"dropdown_opt_1","checked":false},{"var":"dropdown_test","value":"v�)v�'��m�","checked":false},{"var":"dropdown_test","value":"dropdown_opt_2","checked":false},{"var":"dropdown_test","value":"v�)v�'��m�","checked":false},{"var":"dropdown_test","value":"dropdown_opt_3","checked":false},{"var":"dropdown_test","value":"v�)v�'��m�","checked":false}],"type":""},
    "table": { "var": "dropdown_test", "value": "dropdown_opt_2", "checked": true },
  },
  {
    "field":{"selector":"#daquestion button[name=\"ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw\"][value=\"True\"][class=\"btn btn-da btn-primary\"]","tag":"button","guesses":[{"var":"direct_standard_fields","value":"True","checked":false}],"type":"submit"},
    "table": { "var": "direct_standard_fields", "value": "True", "checked": false },  // May want to fix this
  },
];


// ============================
// Simple show if fields - no proxies
// ============================
matches.show_if = [
  {
    "field":{"selector":"#daquestion input[name=\"c2hvd18y\"][value=\"True\"][id=\"c2hvd18y\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"show_2","value":"True","checked":false}],"type":"checkbox"},
    "table": { "var": "show_2", "value": "True", "checked": true, },
  },
  {
    "field":{"selector":"#daquestion input[name=\"X2ZpZWxkXzE\"][value=\"True\"][id=\"X2ZpZWxkXzE\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"show_3","value":"True","checked":false}],"type":"checkbox"},
    "table": { "var": "show_3", "value": "True", "checked": false, },
  },
  {
    "field":{"selector":"#daquestion input[name=\"X2ZpZWxkXzI\"][value=\"True\"][id=\"X2ZpZWxkXzI\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"showif_checkbox_yesno","value":"True","checked":false}],"type":"checkbox"},
    "table": { "var": "showif_checkbox_yesno", "value": "True", "checked": true, },
  },
  {
    "field":{"selector":"#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eCdd\"][value=\"True\"][id=\"X2ZpZWxkXzM_0\"][class=\"dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"showif_checkboxes_other","value":"showif_checkboxes_nota_1","checked":false},{"var":"showif_checkboxes_other","value":"�\u001a0��܅�$n�^��赯�","checked":false}],"type":"checkbox"},
    "table": { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": false, },
  },
  {
    "field":{"selector":"#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eSdd\"][value=\"True\"][id=\"X2ZpZWxkXzM_1\"][class=\"dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"showif_checkboxes_other","value":"showif_checkboxes_nota_2","checked":false},{"var":"showif_checkboxes_other","value":"�\u001a0��܅�$n�^��赯�","checked":false}],"type":"checkbox"},
    "table": { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": true, },
  },
  {
    "field":{"selector":"#daquestion input[name=\"_ignore3\"][id=\"labelauty-473746\"][class=\"dafield3 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"showif_checkboxes_other","value":"None","checked":false}],"type":"checkbox"},
    "table": { "var": "showif_checkboxes_other", "value": "None", "checked": false, },
  },
  {
    "field":{"selector":"#daquestion input[name=\"X2ZpZWxkXzQ\"][value=\"False\"][id=\"X2ZpZWxkXzQ_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"showif_yesnoradio","value":"False","checked":false}],"type":"radio"},
    "table": { "var": "showif_yesnoradio", "value": "False", "checked": true, },
  },
  {
    "field":{"selector":"#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_2\"][id=\"X2ZpZWxkXzU_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"showif_radio_other","value":"showif_radio_multi_2","checked":false}],"type":"radio"},
    "table": { "var": "showif_radio_other", "value": "showif_radio_multi_2", "checked": true, },
  },
  {
    "field":{"selector":"#daquestion input[name=\"X2ZpZWxkXzY\"][id=\"X2ZpZWxkXzY\"][class=\"form-control\"]","tag":"input","guesses":[{"var":"showif_text_input","value":"","checked":""}],"type":"text"},
    "table": { "var": "showif_text_input", "value": "Some one-line text in show if input", "checked": "", },
  },
  {
    "field":{"selector":"#daquestion textarea[name=\"X2ZpZWxkXzc\"][id=\"X2ZpZWxkXzc\"][class=\"form-control\"]","tag":"textarea","guesses":[{"var":"showif_textarea","value":"","checked":""}],"type":""},
    "table": { "var": "showif_textarea", "value": "Some\nmulti-line\ntext in show if textarea", "checked": "", },
  },
  {
    "field":{"selector":"#daquestion select[name=\"X2ZpZWxkXzg\"][id=\"X2ZpZWxkXzg\"][class=\"form-control\"]","tag":"select","guesses":[{"var":"showif_dropdown","value":"","checked":false},{"var":"showif_dropdown","value":"","checked":false},{"var":"showif_dropdown","value":"showif_dropdown_1","checked":false},{"var":"showif_dropdown","value":"�\u001a0��ݮ�]�\t�","checked":false},{"var":"showif_dropdown","value":"showif_dropdown_2","checked":false},{"var":"showif_dropdown","value":"�\u001a0��ݮ�]�\t�","checked":false},{"var":"showif_dropdown","value":"showif_dropdown_3","checked":false},{"var":"showif_dropdown","value":"�\u001a0��ݮ�]�\t�","checked":false}],"type":""},
    "table": { "var": "showif_dropdown", "value": "showif_dropdown_2", "checked": true, },
  },
  {
    "field":{"selector":"#daquestion button[name=\"ZGlyZWN0X3Nob3dpZnM\"][value=\"True\"][class=\"btn btn-da btn-primary\"]","tag":"button","guesses":[{"var":"direct_showifs","value":"True","checked":false}],"type":"submit"},
    "table": { "var": "direct_showifs", "value": "True", "checked": true, },
  },
];


// ============================
// Buttons
// ============================
// `continue button field:`
matches.button_continue = [
  {
    "field":{"selector":"#daquestion button[name=\"YnV0dG9uX2NvbnRpbnVl\"][value=\"True\"][class=\"btn btn-da btn-primary\"]","tag":"button","guesses":[{"var":"button_continue","value":"True","checked":false}],"type":"submit"},
    "table": { "var": "button_continue", "value": "True", "checked": true, },
  }
];

// `yesnomaybe:`
matches.buttons_yesnomaybe_yes = [
  {
  "field":{"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"][class=\"btn btn-primary btn-da \"]","tag":"button","guesses":[{"var":"buttons_yesnomaybe","value":"True","checked":false}],"type":"submit"},
  "table": { "var": "buttons_yesnomaybe", "value": "True", "checked": true, },
  }
];
matches.buttons_yesnomaybe_no = [
  {
  "field":{"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"][class=\"btn btn-da btn-secondary\"]","tag":"button","guesses":[{"var":"buttons_yesnomaybe","value":"False","checked":false}],"type":"submit"},
  "table": { "var": "buttons_yesnomaybe", "value": "False", "checked": true, },
  }
];
matches.buttons_yesnomaybe_none = [
  {
  "field":{"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"][class=\"btn btn-da btn-warning\"]","tag":"button","guesses":[{"var":"buttons_yesnomaybe","value":"None","checked":false}],"type":"submit"},
  "table": { "var": "buttons_yesnomaybe", "value": "None", "checked": true, },
  }
];

// `field:` and `buttons:`
matches.buttons_other_1 = [
  {
  "field":{"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_1\"][class=\"btn btn-da btn-primary\"]","tag":"button","guesses":[{"var":"buttons_other","value":"button_1","checked":false}],"type":"submit"},
  "table": { "var": "buttons_other", "value": "button_1", "checked": true, },
  }
];
matches.buttons_other_2 = [
  {
  "field":{"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_2\"][class=\"btn btn-da btn-primary\"]","tag":"button","guesses":[{"var":"buttons_other","value":"button_2","checked":false}],"type":"submit"},
  "table": { "var": "buttons_other", "value": "button_2", "checked": true, },
  }
];
matches.buttons_other_3 = [
  {
  "field":{"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_3\"][class=\"btn btn-da btn-primary\"]","tag":"button","guesses":[{"var":"buttons_other","value":"button_3","checked":false}],"type":"submit"},
  "table": { "var": "buttons_other", "value": "button_3", "checked": true, },
  }
];

// `field:` and `action buttons:`
matches.buttons_event_action = [
  {
    "field":{"selector":"#daquestion a[class=\"btn btn-primary btn-da daquestionactionbutton danonsubmit\"][data-linknum=\"1\"]","tag":"a","guesses":[{"var":"end","value":"","checked":""}],"type":""},
    "table":{"var": "end","value": "","checked": ""}
  }
];


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
matches.proxies_xi = [
  {
    "field":{"selector":"#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"][id=\"eFtpXS5uYW1lLmZpcnN0\"][class=\"form-control\"]","tag":"input","guesses":[{"var":"x[i].name.first","value":"","checked":""}],"type":"text"},
    "table": { "sought": "a_list[0].name.first", "var": "x[i].name.first", "value": "Firstname", "checked": "", },
  }
];

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
matches.proxies_multi = [
  {
    "field":{"selector":"#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"][id=\"eFtpXS5uYW1lLmZpcnN0\"][class=\"form-control\"]","tag":"input","guesses":[{"var":"x[i].name.first","value":"","checked":""}],"type":"text"},
    "table": { "sought": "a_list[0].name.first", "var": "x[i].name.first", "value": "Firstname", "checked": "", },
  }
];

// your_past_benefits[i].still_receiving
// your_past_benefits[i].still_receiving
// Non-match comes after a match
matches.proxies_non_match = [
  {
    "field":{"selector":"#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU\"][id=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU\"][class=\"form-control is-invalid\"]","tag":"input","guesses":[{"var":"your_past_benefits[i].start_date","value":"","checked":""}],"type":"date"},
    "table": { "sought": "your_past_benefits['State Veterans Benefits'].still_receiving", "var": "your_past_benefits[i].start_date", "value": "01/01/2001", "checked": "", },
  },
  {
    "field":{"selector":"#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw\"][value=\"True\"][id=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth is-invalid\"]","tag":"input","guesses":[{"var":"your_past_benefits[i].still_receiving","value":"True","checked":false}],"type":"radio"},
    "table": { "sought": "your_past_benefits['State Veterans Benefits'].still_receiving", "var": "your_past_benefits[i].still_receiving", "value": "True", "checked": "true", },
  },
  {
    "field":{"selector":"#daquestion input[name=\"X2ZpZWxkXzM\"][id=\"X2ZpZWxkXzM\"][class=\"form-control\"]","tag":"input","guesses":[{"var":"your_past_benefits[i].end_date","value":"","checked":""}],"type":"date"},
    "table": { "sought": "your_past_benefits['State Veterans Benefits'].still_receiving", "var": "your_past_benefits[i].end_date", "value": "02/02/2002", "checked": "", },
  }
];


// ============================
// Signature
// ============================
matches.signature = [
  {
    "field":{"selector":"#daquestion canvas","tag":"canvas","guesses":[{"var":"signature_1","value":"/sign","checked":""}],"type":""},
    "table": { "sought": "signature_1", "var": "signature_1", "value": "/sign", "checked": "", },
  }
];


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
matches.choices = [
  {
    "field":{"selector":"#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"No\"][id=\"Y3NfYXJyZWFyc19tYw_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","tag":"input","guesses":[{"var":"cs_arrears_mc","value":"No","checked":false}],"type":"radio"},
    table: { "var": "cs_arrears_mc", "value": "No", "checked": "true", },
  }
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
  {
    "field":{"selector":"#daquestion select[name=\"dHJpYWxfY291cnQ\"][id=\"dHJpYWxfY291cnQ\"][class=\"form-control daobject\"]","tag":"select","guesses":[{"var":"trial_court","value":"","checked":false},{"var":"trial_court","value":"","checked":false},{"var":"trial_court","value":"YWxsX2NvdXJ0c1swXQ","checked":false},{"var":"trial_court","value":"all_courts[0]","checked":false},{"var":"trial_court","value":"YWxsX2NvdXJ0c1syXQ","checked":false},{"var":"trial_court","value":"all_courts[2]","checked":false},{"var":"trial_court","value":"YWxsX2NvdXJ0c1szXQ","checked":false},{"var":"trial_court","value":"all_courts[3]","checked":false}],"type":""},
    "table": { "var": "trial_court", "value": "all_courts[0]", "checked": "true" }
  }
];


module.exports = matches;
