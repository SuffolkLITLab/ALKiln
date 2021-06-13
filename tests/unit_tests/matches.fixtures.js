let matches = {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// Text field has multiple results
matches.standard = [
  {"selector":"#daquestion input[name=\"Y2hlY2tib3hlc195ZXNubw\"][value=\"True\"][id=\"Y2hlY2tib3hlc195ZXNubw\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[{"var":"checkboxes_yesno","value":"True"}]},
  {"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1RJ10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8x_0\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1nJ10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8x_1\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[{"var":"checkboxes_other_1","value":"checkbox_other_1_opt_2"}]},
  {"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk13J10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8x_2\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"_ignore1\"][id=\"labelauty-712020\"][class=\"dafield1 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1RJ10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8y_0\"][class=\"dafield2 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1nJ10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8y_1\"][class=\"dafield2 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk13J10\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcl8y_2\"][class=\"dafield2 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"_ignore2\"][id=\"labelauty-344271\"][class=\"dafield2 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[{"var":"checkboxes_other_2","value":"None"}]},
  {"selector":"#daquestion input[name=\"cmFkaW9feWVzbm8\"][value=\"True\"][id=\"cmFkaW9feWVzbm8_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"cmFkaW9feWVzbm8\"][value=\"False\"][id=\"cmFkaW9feWVzbm8_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[{"var":"radio_yesno","value":"False"}]},
  {"selector":"#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_1\"][id=\"cmFkaW9fb3RoZXI_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_2\"][id=\"cmFkaW9fb3RoZXI_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[{"var":"radio_other","value":"radio_other_opt_2"}]},
  {"selector":"#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_3\"][id=\"cmFkaW9fb3RoZXI_2\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"dGV4dF9pbnB1dA\"][id=\"dGV4dF9pbnB1dA\"][class=\"form-control\"]","type":"text","tag":"INPUT",
    "matching_table_rows":[{"var":"text_input","value":"Some one-line text"},{"var":"text_input","value":"Some conflicting text"}]},
  {"selector":"#daquestion textarea[name=\"dGV4dGFyZWE\"][id=\"dGV4dGFyZWE\"][class=\"form-control\"]","type":"","tag":"TEXTAREA",
    "matching_table_rows":[{"var":"textarea","value":"Some\nmulti-line\ntext"}]},
  {"selector":"#daquestion select[name=\"ZHJvcGRvd25fdGVzdA\"][id=\"ZHJvcGRvd25fdGVzdA\"][class=\"form-control\"]","type":"","tag":"SELECT",
    "matching_table_rows":[{"var":"dropdown_test","value":"dropdown_opt_2"}]},
  {"selector":"#daquestion button[name=\"ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw\"][value=\"True\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[{"var":"direct_standard_fields","value":"True"}]}
];


// ============================
// Simple show if fields - no proxies
// ============================
matches.show_if = [
  {"selector":"#daquestion input[name=\"c2hvd18y\"][value=\"True\"][id=\"c2hvd18y\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[{"var":"show_2","value":"True"}]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzE\"][value=\"True\"][id=\"X2ZpZWxkXzE\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[{"var":"show_3","value":"True"}]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzI\"][value=\"True\"][id=\"X2ZpZWxkXzI\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[{"var":"showif_checkbox_yesno","value":"True"}]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eCdd\"][value=\"True\"][id=\"X2ZpZWxkXzM_0\"][class=\"dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eSdd\"][value=\"True\"][id=\"X2ZpZWxkXzM_1\"][class=\"dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[{"var":"showif_checkboxes_other","value":"showif_checkboxes_nota_2"}]},
  {"selector":"#daquestion input[name=\"_ignore3\"][id=\"labelauty-473746\"][class=\"dafield3 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]","type":"checkbox","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzQ\"][value=\"True\"][id=\"X2ZpZWxkXzQ_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzQ\"][value=\"False\"][id=\"X2ZpZWxkXzQ_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[{"var":"showif_yesnoradio","value":"False"}]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_1\"][id=\"X2ZpZWxkXzU_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_2\"][id=\"X2ZpZWxkXzU_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[{"var":"showif_radio_other","value":"showif_radio_multi_2"}]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_3\"][id=\"X2ZpZWxkXzU_2\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzY\"][id=\"X2ZpZWxkXzY\"][class=\"form-control\"]","type":"text","tag":"INPUT",
    "matching_table_rows":[{"var":"showif_text_input","value":"Some one-line text in show if input"}]},
  {"selector":"#daquestion textarea[name=\"X2ZpZWxkXzc\"][id=\"X2ZpZWxkXzc\"][class=\"form-control\"]","type":"","tag":"TEXTAREA",
    "matching_table_rows":[{"var":"showif_textarea","value":"Some\nmulti-line\ntext in show if textarea"}]},
  {"selector":"#daquestion select[name=\"X2ZpZWxkXzg\"][id=\"X2ZpZWxkXzg\"][class=\"form-control\"]","type":"","tag":"SELECT",
    "matching_table_rows":[{"var":"showif_dropdown","value":"showif_dropdown_2"}]},
  {"selector":"#daquestion button[name=\"ZGlyZWN0X3Nob3dpZnM\"][value=\"True\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[{"var":"direct_showifs","value":"True"}]}
];


// ============================
// Buttons
// ============================
// `continue button field:`
matches.button_continue = [
  {"selector":"#daquestion button[name=\"YnV0dG9uX2NvbnRpbnVl\"][value=\"True\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[{"var":"button_continue","value":"True"}]}
];

// `yesnomaybe:`
matches.buttons_yesnomaybe_yes = [
  {"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"][class=\"btn btn-primary btn-da \"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[{"var":"buttons_yesnomaybe","value":"True"}]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"][class=\"btn btn-da btn-secondary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"][class=\"btn btn-da btn-warning\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]}
];
matches.buttons_yesnomaybe_no = [
  {"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"][class=\"btn btn-primary btn-da \"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"][class=\"btn btn-da btn-secondary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[{"var":"buttons_yesnomaybe","value":"False"}]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"][class=\"btn btn-da btn-warning\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]}
];
matches.buttons_yesnomaybe_none = [
  {"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"][class=\"btn btn-primary btn-da \"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"][class=\"btn btn-da btn-secondary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"][class=\"btn btn-da btn-warning\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[{"var":"buttons_yesnomaybe","value":"None"}]}
];

// `field:` and `buttons:`
matches.buttons_other_1 = [
  {"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_1\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[{"var":"buttons_other","value":"button_1"}]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_2\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_3\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]}
];
matches.buttons_other_2 = [
  {"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_1\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_2\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[{"var":"buttons_other","value":"button_2"}]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_3\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]}
];
matches.buttons_other_3 = [
  {"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_1\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_2\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_3\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[{"var":"buttons_other","value":"button_3"}]}
];

// `field:` and `action buttons:`
matches.buttons_event_action = [
  {"selector":"#daquestion button[name=\"YnV0dG9uX2V2ZW50X2FjdGlvbg\"][value=\"True\"][class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion a[class=\"btn btn-primary btn-da daquestionactionbutton danonsubmit\"][data-linknum=\"1\"]","type":"","tag":"A",
    "matching_table_rows":[{"var":"end","value":""}]}
];


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
matches.proxies_xi = [
  {"selector":"#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"][id=\"eFtpXS5uYW1lLmZpcnN0\"][class=\"form-control\"]","type":"text","tag":"INPUT",
    "matching_table_rows":[{"sought":"a_list[0].name.first","var":"x[i].name.first","value":"Firstname"}]},
  {"selector":"#daquestion button[class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]}
];

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
matches.proxies_multi = [
  {"selector":"#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"][id=\"eFtpXS5uYW1lLmZpcnN0\"][class=\"form-control\"]","type":"text","tag":"INPUT",
    "matching_table_rows":[{"sought":"a_list[0].name.first","var":"x[i].name.first","value":"Firstname1"}]},
  {"selector":"#daquestion button[class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]}
];

// your_past_benefits[i].still_receiving
// your_past_benefits['State Veterans Benefits'].still_receiving
// Non-match comes after a match
matches.proxies_non_match = [
  {"selector":"#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU\"][id=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU\"][class=\"form-control is-invalid\"]","type":"date","tag":"INPUT",
    "matching_table_rows":[{"sought":"your_past_benefits['State Veterans Benefits'].still_receiving","var":"your_past_benefits[i].start_date","value":"01/01/2001"}]},
  {"selector":"#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw\"][value=\"True\"][id=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth is-invalid\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[{"sought":"your_past_benefits['State Veterans Benefits'].still_receiving","var":"your_past_benefits[i].still_receiving","value":"True"}]},
  {"selector":"#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw\"][value=\"False\"][id=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"X2ZpZWxkXzM\"][id=\"X2ZpZWxkXzM\"][class=\"form-control\"]","type":"date","tag":"INPUT",
    "matching_table_rows":[{"sought":"your_past_benefits['State Veterans Benefits'].still_receiving","var":"your_past_benefits[i].end_date","value":"02/02/2002"}]},
  {"selector":"#daquestion button[class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]}
];


// ============================
// Signature
// ============================
matches.signature = [
  {"selector":"#daquestion canvas","type":"","tag":"CANVAS",
    "matching_table_rows":[{"sought":"signature_1","var":"signature_1","value":"/sign"}]}
];


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
matches.choices = [
  {"selector":"#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"Yes\"][id=\"Y3NfYXJyZWFyc19tYw_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth is-invalid\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"No\"][id=\"Y3NfYXJyZWFyc19tYw_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[{"var":"cs_arrears_mc","value":"No"}]},
  {"selector":"#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"I am not sure\"][id=\"Y3NfYXJyZWFyc19tYw_2\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]","type":"radio","tag":"INPUT",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]}
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
  {"selector":"#daquestion select[name=\"dHJpYWxfY291cnQ\"][id=\"dHJpYWxfY291cnQ\"][class=\"form-control daobject\"]","type":"","tag":"SELECT",
    "matching_table_rows":[{"var":"trial_court","value":"all_courts[0]"}]},
  {"selector":"#daquestion button[class=\"btn btn-link btn-da daquestionbackbutton danonsubmit\"]","type":"button","tag":"BUTTON",
    "matching_table_rows":[]},
  {"selector":"#daquestion button[class=\"btn btn-da btn-primary\"]","type":"submit","tag":"BUTTON",
    "matching_table_rows":[]}
];


module.exports = matches;