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
  { "var": "text_input", "value": "Some one-line text" },
  { "var": "text_input","value":"Some conflicting text" },
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
  { "var": "buttons_other", "value": "button_2", "trigger": "" },
  { "var": "buttons_yesnomaybe", "value": "True", "trigger": "" },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_1", "trigger": "" },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_2", "trigger": "" },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_3", "trigger": "" },
  { "var": "checkboxes_yesno", "value": "True", "trigger": "" },
  { "var": "direct_standard_fields", "value": "True", "trigger": "" },
  { "var": "dropdown_test", "value": "dropdown_opt_2", "trigger": "" },
  { "var": "radio_other", "value": "radio_other_opt_3", "trigger": "" },
  { "var": "radio_yesno", "value": "False", "trigger": "" },
  { "var": "screen_features", "value": "True", "trigger": "" },
  { "var": "showif_checkbox_yesno", "value": "False", "trigger": "" },
  { "var": "showif_checkboxes_other['showif_checkboxes_nota_1']", "value": "false", "trigger": "" },
  { "var": "showif_checkboxes_other['showif_checkboxes_nota_2']", "value": "true", "trigger": "" },
  { "var": "showif_dropdown", "value": "showif_dropdown_1", "trigger": "" },
  { "var": "showif_radio_other", "value": "showif_radio_multi_2", "trigger": "" },
  { "var": "showif_text_input", "value": "Show if text input value", "trigger": "" },
  { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "trigger": "" },
  { "var": "showif_yesnoradio", "value": "True", "trigger": "" },
  { "var": "text_input", "value": "Regular text input field value", "trigger": "" },
  { "var": "textarea", "value": "Multiline text\narea value", "trigger": "" },
  { "var": "show_3", "value": "True", "trigger": "" },
  { "var": "show_2", "value": "True", "trigger": "" },
];

// Should not be changed at all
tables.standard_normalized_formatting = [
  {
    "original": { "var": "direct_showifs", "value": "True", "trigger": "" },
    "var": "direct_showifs", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "button_continue", "value": "True", "trigger": "" },
    "var": "button_continue", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "buttons_other", "value": "button_2", "trigger": "" },
    "var": "buttons_other", "value": "button_2", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "buttons_yesnomaybe", "value": "True", "trigger": "" },
    "var": "buttons_yesnomaybe", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_1", "trigger": "" },
    "var": "checkboxes_other", "value": "checkbox_other_opt_1", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_2", "trigger": "" },
    "var": "checkboxes_other", "value": "checkbox_other_opt_2", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_3", "trigger": "" },
    "var": "checkboxes_other", "value": "checkbox_other_opt_3", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "checkboxes_yesno", "value": "True", "trigger": "" },
    "var": "checkboxes_yesno", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "direct_standard_fields", "value": "True", "trigger": "" },
    "var": "direct_standard_fields", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "dropdown_test", "value": "dropdown_opt_2", "trigger": "" },
    "var": "dropdown_test", "value": "dropdown_opt_2", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "radio_other", "value": "radio_other_opt_3", "trigger": "" },
    "var": "radio_other", "value": "radio_other_opt_3", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "radio_yesno", "value": "False", "trigger": "" },
    "var": "radio_yesno", "value": "False", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "screen_features", "value": "True", "trigger": "" },
    "var": "screen_features", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_checkbox_yesno", "value": "False", "trigger": "" },
    "var": "showif_checkbox_yesno", "value": "False", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_checkboxes_other['showif_checkboxes_nota_1']", "value": "false", "trigger": "" },
    "var": "showif_checkboxes_other['showif_checkboxes_nota_1']", "value": "false", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_checkboxes_other['showif_checkboxes_nota_2']", "value": "true", "trigger": "" },
    "var": "showif_checkboxes_other['showif_checkboxes_nota_2']", "value": "true", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_dropdown", "value": "showif_dropdown_1", "trigger": "" },
    "var": "showif_dropdown", "value": "showif_dropdown_1", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_radio_other", "value": "showif_radio_multi_2", "trigger": "" },
    "var": "showif_radio_other", "value": "showif_radio_multi_2", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_text_input", "value": "Show if text input value", "trigger": "" },
    "var": "showif_text_input", "value": "Show if text input value", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "trigger": "" },
    "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_yesnoradio", "value": "True", "trigger": "" },
    "var": "showif_yesnoradio", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "text_input", "value": "Regular text input field value", "trigger": "" },
    "var": "text_input", "value": "Regular text input field value", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "textarea", "value": "Multiline text\narea value", "trigger": "" },
    "var": "textarea", "value": "Multiline text\narea value", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "show_3", "value": "True", "trigger": "" },
    "var": "show_3", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "show_2", "value": "True", "trigger": "" },
    "var": "show_2", "value": "True", "trigger": "", times_used: 0,
  },
];

// Missing 'trigger' column
tables.missing_sought = [
  { "var": "direct_showifs", "value": "True" },
  { "var": "button_continue", "value": "True" },
  { "var": "buttons_other", "value": "button_2" },
  { "var": "buttons_yesnomaybe", "value": "True" },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_1" },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_2" },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_3" },
  { "var": "checkboxes_yesno", "value": "True" },
  { "var": "direct_standard_fields", "value": "True" },
  { "var": "dropdown_test", "value": "dropdown_opt_2" },
  { "var": "radio_other", "value": "radio_other_opt_3" },
  { "var": "radio_yesno", "value": "False" },
  { "var": "screen_features", "value": "True" },
  { "var": "showif_checkbox_yesno", "value": "False" },
  { "var": "showif_checkboxes_other['showif_checkboxes_nota_1']", "value": "false" },
  { "var": "showif_checkboxes_other['showif_checkboxes_nota_2']", "value": "true" },
  { "var": "showif_dropdown", "value": "showif_dropdown_1" },
  { "var": "showif_radio_other", "value": "showif_radio_multi_2" },
  { "var": "showif_text_input", "value": "Show if text input value" },
  { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value" },
  { "var": "showif_yesnoradio", "value": "True" },
  { "var": "text_input", "value": "Regular text input field value" },
  { "var": "textarea", "value": "Multiline text\narea value" },
  { "var": "show_3", "value": "True" },
  { "var": "show_2", "value": "True" },
];

// 'trigger' should be added
tables.missing_sought_to_normalized_formatting = [
  {
    "original": { "var": "direct_showifs", "value": "True", },
    "var": "direct_showifs", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "button_continue", "value": "True", },
    "var": "button_continue", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "buttons_other", "value": "button_2", },
    "var": "buttons_other", "value": "button_2", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "buttons_yesnomaybe", "value": "True", },
    "var": "buttons_yesnomaybe", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_1", },
    "var": "checkboxes_other", "value": "checkbox_other_opt_1", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_2", },
    "var": "checkboxes_other", "value": "checkbox_other_opt_2", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_3", },
    "var": "checkboxes_other", "value": "checkbox_other_opt_3", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "checkboxes_yesno", "value": "True", },
    "var": "checkboxes_yesno", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "direct_standard_fields", "value": "True", },
    "var": "direct_standard_fields", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "dropdown_test", "value": "dropdown_opt_2", },
    "var": "dropdown_test", "value": "dropdown_opt_2", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "radio_other", "value": "radio_other_opt_3", },
    "var": "radio_other", "value": "radio_other_opt_3", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "radio_yesno", "value": "False", },
    "var": "radio_yesno", "value": "False", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "screen_features", "value": "True", },
    "var": "screen_features", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_checkbox_yesno", "value": "False", },
    "var": "showif_checkbox_yesno", "value": "False", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_checkboxes_other['showif_checkboxes_nota_1']", "value": "false", },
    "var": "showif_checkboxes_other['showif_checkboxes_nota_1']", "value": "false", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_checkboxes_other['showif_checkboxes_nota_2']", "value": "true", },
    "var": "showif_checkboxes_other['showif_checkboxes_nota_2']", "value": "true", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_dropdown", "value": "showif_dropdown_1", },
    "var": "showif_dropdown", "value": "showif_dropdown_1", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_radio_other", "value": "showif_radio_multi_2", },
    "var": "showif_radio_other", "value": "showif_radio_multi_2", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_text_input", "value": "Show if text input value", },
    "var": "showif_text_input", "value": "Show if text input value", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", },
    "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "showif_yesnoradio", "value": "True", },
    "var": "showif_yesnoradio", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "text_input", "value": "Regular text input field value", },
    "var": "text_input", "value": "Regular text input field value", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "textarea", "value": "Multiline text\narea value", },
    "var": "textarea", "value": "Multiline text\narea value", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "show_3", "value": "True", },
    "var": "show_3", "value": "True", "trigger": "", times_used: 0,
  },
  {
    "original": { "var": "show_2", "value": "True", },
    "var": "show_2", "value": "True", "trigger": "", times_used: 0,
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
// `.there_is_another`
// ============================
tables.there_is_another = [
  { "var": "x.there_is_another", "value": "True", "trigger": "proxy_list.there_is_another" }
];


// ============================
// mixed quotes
// ============================
tables.mixed_quotes = [
  { "var": `double_quote_dict['double_quote_key']["dq_two"]`, "value": "True", "trigger": `double_quote_dict["double_quote_key"]` },
  { "var": `single_quote_dict["single_quote_key"]['sq_two']`, "value": "True", "trigger": `double_quote_dict['double_quote_key']` },
];


module.exports = tables;
