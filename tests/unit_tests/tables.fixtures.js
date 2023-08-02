let tables =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
tables.standard = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var": "direct_standard_fields", "value": "True" },  // May want to change `checked`
  { "var": "checkboxes_yesno", "value": "True" },
  { "var": "checkboxes_other['checkbox_other_opt_1']", "value": "false" },
  { "var": "checkboxes_other['checkbox_other_opt_2']", "value": "true" },
  { "var": "checkboxes_other['checkbox_other_opt_3']", "value": "false" },
  { "var": "checkboxes_other['None']", "value": "false" },
  // Not sure when these got removed
  // { "var": "checkboxes_other_2['checkbox_other_2_opt_1']", "value": "false" },
  // { "var": "checkboxes_other_2['checkbox_other_2_opt_2']", "value": "false" },
  // { "var": "checkboxes_other_2['checkbox_other_2_opt_3']", "value": "false" },
  // { "var": "checkboxes_other_2['None']", "value": "true" },
  { "var": "date_input","value":"today-1" },
  { "var": "radio_yesno", "value": "False" },
  { "var": "radio_other", "value": "radio_other_opt_2" },
  { "var": "text_input", "value": "Some one-line text", "original": { "var": "text_input", "value": "Some one-line text" } },
  { "var": "text_input","value":"Some conflicting text", "original": { "var": "text_input","value":"Some conflicting text" } },
  { "var": "textarea", "value": "Some\nmulti-line\ntext" },
  { "var": "dropdown_test", "value": "dropdown_opt_2" },  // May want to change `checked`
];


// ============================
// Simple show if fields - no proxies
// ============================
tables.show_if = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var": "direct_showifs", "value": "True", },  // May want to change `checked`
  { "var": "show_2", "value": "True", },
  { "var": "show_3", "value": "True", },
  { "var": "showif_checkbox_yesno", "value": "True", },
  { "var": "showif_checkboxes_other['showif_checkboxes_nota_1']", "value": "false", },
  { "var": "showif_checkboxes_other['showif_checkboxes_nota_2']", "value": "true", },
  { "var": "showif_checkboxes_other['None']", "value": "false", },
  { "var": "showif_yesnoradio", "value": "False", },
  { "var": "showif_radio_other", "value": "showif_radio_multi_2", },
  { "var": "showif_text_input", "value": "Some one-line text in show if input", },
  { "var": "showif_textarea", "value": "Some\nmulti-line\ntext in show if textarea", },
  { "var": "showif_dropdown", "value": "showif_dropdown_2", },  // May want to change `checked`
];


// ============================
// Buttons
// ============================
// `continue button field:`
tables.button_continue = [
  { "var": "button_continue", "value": "True", },  // May want to change `checked`
];

// `yesnomaybe:`
tables.buttons_yesnomaybe_yes = [
  { "var": "buttons_yesnomaybe", "value": "True", },  // May want to change `checked`
];
tables.buttons_yesnomaybe_no = [
  { "var": "buttons_yesnomaybe", "value": "False", },  // May want to change `checked`
];
tables.buttons_yesnomaybe_none = [
  { "var": "buttons_yesnomaybe", "value": "None", },  // May want to change `checked`
];

// `field:` and `buttons:`
tables.buttons_other_1 = [
  { "var": "buttons_other", "value": "button_1", },  // May want to change `checked`
];
tables.buttons_other_2 = [
  { "var": "buttons_other", "value": "button_2", },  // May want to change `checked`
];
tables.buttons_other_3 = [
  { "var": "buttons_other", "value": "button_3", },  // May want to change `checked`
];

// `field:` and `action buttons:`
tables.buttons_event_action = [
  { "var": "end", "value": "", },  // May want to change `checked`
];


// ============================
// Tables
// ============================
// Normalizing tables of different formats

// Fully featured table
tables.standard_formatting = [
  { "var": "direct_showifs", "value": "True", "trigger": "" },
  { "var": "button_continue", "value": "True", "trigger": "" },
];

// Should not be changed at all
tables.standard_normalized_formatting = [
  {
    "original": { "var": "direct_showifs", "value": "True", "trigger": "" },
    "var": "direct_showifs", "value": "True", "trigger": "", "times_used": 0,
    "used_for": { "direct_showifs": 0 }, "artificial": false,
  },
  {
    "original": { "var": "button_continue", "value": "True", "trigger": "" },
    "var": "button_continue", "value": "True", "trigger": "", "times_used": 0,
    "used_for": { "button_continue": 0 }, "artificial": false,
  },
];

// Missing 'trigger' column
tables.missing_trigger = [
  { "var": "direct_showifs", "value": "True" },
  { "var": "button_continue", "value": "True" },
];

// 'trigger' should be added
tables.missing_trigger_to_normalized_formatting = [
  {
    "original": { "var": "direct_showifs", "value": "True", },
    "var": "direct_showifs", "value": "True", "trigger": "", "times_used": 0,
    "used_for": { "direct_showifs": 0 }, "artificial": false,
  },
  {
    "original": { "var": "button_continue", "value": "True", },
    "var": "button_continue", "value": "True", "trigger": "", "times_used": 0,
    "used_for": { "button_continue": 0 }, "artificial": false,
  },
];


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
tables.proxies_xi = [
  { "trigger": "proxy_list[0].name.first", "var": "x[i].name.first", "value": "Firstname", },
];

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
tables.proxies_multi = [
  { "trigger": "proxy_list[0].name.first", "var": "x[i].name.first", "value": "Firstname", },
  { "trigger": "proxy_list[1].name.first", "var": "x[i].name.first", "value": "Firstname", },
  { "trigger": "proxy_list[2].name.first", "var": "x[i].name.first", "value": "Firstname", },
];

// Missing table row for second loop
tables.proxies_missing_loop = [
  { "trigger": "proxy_list[0].name.first", "var": "x[i].name.first", "value": "Firstname", "original": { "trigger": "proxy_list[0].name.first", "var": "x[i].name.first", "value": "Firstname" } },
];

// Missing trigger matches second loop
tables.proxies_missing_trigger = [
  { "trigger": "", "var": "x[i].name.first", "value": "Firstname", "original": { "trigger": "", "var": "x[i].name.first", "value": "Firstname" }},
];


// ============================
// Signature
// ============================
// Also tests that multiple signature rows only match their var
tables.signature = [
  { "trigger": "signature_2", "var": "signature_2", "value": "/sign", },
  { "trigger": "signature_1", "var": "signature_1", "value": "/sign", },
];


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
tables.choices = [
  { "var": "field_and_choices", "value": "Choice 1", },
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
tables.object_dropdown = [
  { "var": "object_dropdown", "value": "obj_opt_2", },
];


// ============================
// mixed quotes
// ============================
tables.mixed_quotes = [
  { "var": `double_quote_dict['double_quote_key']["dq_two"]`, "value": "True", "trigger": `double_quote_dict["double_quote_key"]` },
  { "var": `single_quote_dict["single_quote_key"]['sq_two']`, "value": "True", "trigger": `double_quote_dict['double_quote_key']` },
];


module.exports = tables;
