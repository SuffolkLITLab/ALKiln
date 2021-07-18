let matches =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
matches.standard = [
  [{"var":"checkboxes_yesno","value":"True"}],
  [{"var":"checkboxes_other_1['checkbox_other_1_opt_1']","value":"false"}],
  [{"var":"checkboxes_other_1['checkbox_other_1_opt_2']","value":"true"}],
  [{"var":"checkboxes_other_1['checkbox_other_1_opt_3']","value":"false"}],
  [{"var":"checkboxes_other_1['None']","value":"false"}],
  [{"var":"checkboxes_other_2['checkbox_other_2_opt_1']","value":"false"}],
  [{"var":"checkboxes_other_2['checkbox_other_2_opt_2']","value":"false"}],
  [{"var":"checkboxes_other_2['checkbox_other_2_opt_3']","value":"false"}],
  [{"var":"checkboxes_other_2['None']","value":"true"}],
  [],
  [{"var":"radio_yesno","value":"False"}],
  [],
  [{"var":"radio_other","value":"radio_other_opt_2"}],
  [],
  [{"var":"text_input","value":"Some one-line text"},{"var":"text_input","value":"Some conflicting text"}],
  [{"var":"textarea","value":"Some\nmulti-line\ntext"}],
  [{"var":"dropdown_test","value":"dropdown_opt_2"}],
  [{"var":"direct_standard_fields","value":"True"}]
];


// ============================
// Simple show if fields - no proxies
// ============================
matches.show_if = [
  [{"var":"show_2","value":"True"}],
  [{"var":"show_3","value":"True"}],
  [{"var":"showif_checkbox_yesno","value":"True"}],
  [{"var":"showif_checkboxes_other['showif_checkboxes_nota_1']","value":"false"}],
  [{"var":"showif_checkboxes_other['showif_checkboxes_nota_2']","value":"true"}],
  [{"var":"showif_checkboxes_other['None']","value":"false"}],
  [],
  [{"var":"showif_yesnoradio","value":"False"}],
  [],
  [{"var":"showif_radio_other","value":"showif_radio_multi_2"}],
  [],
  [{"var":"showif_text_input","value":"Some one-line text in show if input"}],
  [{"var":"showif_textarea","value":"Some\nmulti-line\ntext in show if textarea"}],
  [{"var":"showif_dropdown","value":"showif_dropdown_2"}],
  [{"var":"direct_showifs","value":"True"}]
];


// ============================
// Buttons
// ============================
// `continue button field:`
matches.button_continue = [
  [{"var":"button_continue","value":"True"}]
];

// `yesnomaybe:`
matches.buttons_yesnomaybe_yes = [
  [{"var":"buttons_yesnomaybe","value":"True"}],
  [],
  []
];
matches.buttons_yesnomaybe_no = [
  [],
  [{"var":"buttons_yesnomaybe","value":"False"}],
  []
];
matches.buttons_yesnomaybe_none = [
  [],
  [],
  [{"var":"buttons_yesnomaybe","value":"None"}]
];

// `field:` and `buttons:`
matches.buttons_other_1 = [
  [{"var":"buttons_other","value":"button_1"}],
  [],
  []
];
matches.buttons_other_2 = [
  [],
  [{"var":"buttons_other","value":"button_2"}],
  []
];
matches.buttons_other_3 = [
  [],
  [],
  [{"var":"buttons_other","value":"button_3"}]
];

// `field:` and `action buttons:`
matches.buttons_event_action = [
  [],
  [{"var":"end","value":""}]
];


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
matches.proxies_xi = [
  [{"trigger":"a_list[0].name.first","var":"x[i].name.first","value":"Firstname"}],
  []
];

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
matches.proxies_multi = [
  [{"trigger":"a_list[0].name.first","var":"x[i].name.first","value":"Firstname"}],
  []
];

// your_past_benefits[i].still_receiving
// your_past_benefits[i].still_receiving
// Non-match comes after a match
matches.proxies_non_match = [
  [{"trigger":"your_past_benefits['State Veterans Benefits'].still_receiving","var":"your_past_benefits[i].start_date","value":"01/01/2001"}],
  [{"trigger":"your_past_benefits['State Veterans Benefits'].still_receiving","var":"your_past_benefits[i].still_receiving","value":"True"}],
  [],
  [{"trigger":"your_past_benefits['State Veterans Benefits'].still_receiving","var":"your_past_benefits[i].end_date","value":"02/02/2002"}],
  []
];


// ============================
// Signature
// ============================
matches.signature = [
  [{"trigger":"signature_1","var":"signature_1","value":"/sign"}]
];


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
matches.choices = [
  [],
  [{"var":"cs_arrears_mc","value":"No"}],
  [],
  []
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
  [{"var":"trial_court","value":"all_courts[0]"}],
  [],
  []
];


// ============================
// quotes
// ============================
matches.mixed_quotes = [
  [],
  [ { var: `single_quote_dict["single_quote_key"]['sq_two']`, value: 'True', trigger: `x['some_key']['dbl_quoted_val']` } ],
  [],
  [],
  [],
  [ { var: `double_quote_dict['double_quote_key']["dq_two"]`, value: 'True', trigger: `x['some_key']["dbl_quoted_val"]` } ],
  [],
  [],
  [],
];


module.exports = matches;
