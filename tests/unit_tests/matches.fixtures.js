let matches =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
matches.standard = [
  [ { var: 'checkboxes_yesno', value: 'True' } ],
  [ { var: "checkboxes_other['checkbox_other_opt_1']", value: 'false' } ],
  [ { var: "checkboxes_other['checkbox_other_opt_2']", value: 'true' } ],
  [ { var: "checkboxes_other['checkbox_other_opt_3']", value: 'false' } ],
  [ { var: "checkboxes_other['None']", value: 'false' } ],
  [],
  [ { var: 'radio_yesno', value: 'False' } ],
  [],
  [ { var: 'radio_other', value: 'radio_other_opt_2' } ],
  [],
  [ { var: 'text_input', value: 'Some one-line text' }, { var: 'text_input', value: 'Some conflicting text' } ],
  [ { var: 'textarea', value: 'Some\nmulti-line\ntext' } ],
  [ { 'var': 'date_input','value':'today-1' } ],
  [ { var: 'dropdown_test', value: 'dropdown_opt_2' } ],
  [ { var: 'direct_standard_fields', value: 'True' } ]
];


// ============================
// Simple show if fields - no proxies
// ============================
matches.show_if = [
  [ { var: 'show_2', value: 'True' } ],
  [ { var: 'show_3', value: 'True' } ],
  [ { var: 'showif_checkbox_yesno', value: 'True' } ],
  [ { var: "showif_checkboxes_other['showif_checkboxes_nota_1']", value: 'false' } ],
  [ { var: "showif_checkboxes_other['showif_checkboxes_nota_2']", value: 'true' } ],
  [],
  [ { var: "showif_checkboxes_other['None']", value: 'false' } ],
  [],
  [ { var: 'showif_yesnoradio', value: 'False' } ],
  [],
  [ { var: 'showif_radio_other', value: 'showif_radio_multi_2' } ],
  [],
  [ { var: 'showif_text_input', value: 'Some one-line text in show if input' } ],
  [ { var: 'showif_textarea', value: 'Some\nmulti-line\ntext in show if textarea' } ],
  [ { var: 'showif_dropdown', value: 'showif_dropdown_2' } ],
  [ { var: 'direct_showifs', value: 'True' } ]
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
  [{"trigger":"proxy_list[0].name.first","var":"x[i].name.first","value":"Firstname"}],
  []
];

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
matches.proxies_multi = [
  [{"trigger":"proxy_list[1].name.first","var":"x[i].name.first","value":"Firstname"}],
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
  [{"var":"field_and_choices","value":"Choice 1"}],
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
  [{"var":"object_dropdown","value":"obj_opt_2"}],
  [],
  []
];


// ============================
// quotes
// ============================
matches.mixed_quotes = [
  [],
  [ { var: `single_quote_dict["single_quote_key"]['sq_two']`, value: 'True', trigger: `double_quote_dict['double_quote_key']` } ],
  [],
  [],
  [],
  [ { var: `double_quote_dict['double_quote_key']["dq_two"]`, value: 'True', trigger: `double_quote_dict["double_quote_key"]` } ],
  [],
  [],
  [],
  [],
];


module.exports = matches;
