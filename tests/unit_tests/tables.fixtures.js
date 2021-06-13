let tables =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
tables.standard = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var": "direct_standard_fields", "value": "True", },
  { "var": "checkboxes_yesno", "value": "True", },
  // { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_1", "checked": false },
  { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_2", },
  // { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_3", "checked": false },
  // { "var": "checkboxes_other_1", "value": "None", "checked": false },
  // { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_1", "checked": false },
  // { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_2", "checked": false },
  // { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_3", "checked": false },
  { "var": "checkboxes_other_2", "value": "None", },
  { "var": "radio_yesno", "value": "False", },
  { "var": "radio_other", "value": "radio_other_opt_2", },
  { "var": "text_input", "value": "Some one-line text", },
  { "var": "text_input", "value": "Some conflicting text", },
  { "var": "textarea", "value": "Some\nmulti-line\ntext", },
  { "var": "dropdown_test", "value": "dropdown_opt_2", },
];


// ============================
// Simple show if fields - no proxies
// ============================
tables.show_if = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var": "direct_showifs", "value": "True", },
  { "var": "show_2", "value": "True", },
  { "var": "show_3", "value": "True", },
  { "var": "showif_checkbox_yesno", "value": "True", },
  // { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": false, },
  { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", },
  // { "var": "showif_checkboxes_other", "value": "None", "checked": false, },
  { "var": "showif_yesnoradio", "value": "False", },
  { "var": "showif_radio_other", "value": "showif_radio_multi_2", },
  { "var": "showif_text_input", "value": "Some one-line text in show if input", },
  { "var": "showif_textarea", "value": "Some\nmulti-line\ntext in show if textarea", },
  { "var": "showif_dropdown", "value": "showif_dropdown_2", },
];


// ============================
// Buttons
// ============================
// `continue button field:`
tables.button_continue = [
  { "var": "button_continue", "value": "True", },
];

// `yesnomaybe:`
tables.buttons_yesnomaybe_yes = [
  { "var": "buttons_yesnomaybe", "value": "True", },
];
tables.buttons_yesnomaybe_no = [
  { "var": "buttons_yesnomaybe", "value": "False", },
];
tables.buttons_yesnomaybe_none = [
  { "var": "buttons_yesnomaybe", "value": "None", },
];

// `field:` and `buttons:`
tables.buttons_other_1 = [
  { "var": "buttons_other", "value": "button_1", },
];
tables.buttons_other_2 = [
  { "var": "buttons_other", "value": "button_2", },
];
tables.buttons_other_3 = [
  { "var": "buttons_other", "value": "button_3", },
];

// `field:` and `action buttons:`
tables.buttons_event_action = [
  { "var": "end", "value": "", },
];


// =================
// Converting from old table to new table
// =================
// Unsupported formats:
// - Arrays (see https://github.com/plocket/docassemble-cucumber/issues/257)
// - Format 1 and 2 tables (permanent) (see https://github.com/plocket/docassemble-cucumber/issues/264)

// // This is here for historical record
// tables.format_1 = [
//   { "var": "direct_showifs", "choice": "True", "value": "true" },
//   { "var": "button_continue", "choice": "True", "value": "true" },
//   { "var": "buttons_other", "choice": "", "value": "button_2" },
//   { "var": "buttons_yesnomaybe", "choice": "True", "value": "true" },
//   { "var": "checkboxes_other", "choice": "checkbox_other_opt_1", "value": "true" },
//   { "var": "checkboxes_other", "choice": "checkbox_other_opt_2", "value": "true" },
//   { "var": "checkboxes_other", "choice": "checkbox_other_opt_3", "value": "false" },
//   { "var": "checkboxes_yesno", "choice": "True", "value": "true" },
//   { "var": "direct_standard_fields", "choice": "True", "value": "true" },
//   { "var": "dropdown_test", "choice": "", "value": "dropdown_opt_2" },
//   { "var": "radio_other", "choice": "", "value": "radio_other_opt_3" },
//   { "var": "radio_yesno", "choice": "False", "value": "false" },
//   { "var": "screen_features", "choice": "True", "value": "true" },
//   { "var": "showif_checkbox_yesno", "choice": "False", "value": "false" },
//   { "var": "showif_checkboxes_other", "choice": "showif_checkboxes_nota_1", "value": "false" },
//   { "var": "showif_checkboxes_other", "choice": "showif_checkboxes_nota_2", "value": "true" },
//   { "var": "showif_dropdown", "choice": "", "value": "showif_dropdown_1" },
//   { "var": "showif_radio_other", "choice": "", "value": "showif_radio_multi_2" },
//   { "var": "showif_text_input", "choice": "", "value": "Show if text input value" },
//   { "var": "showif_textarea", "choice": "", "value": "Show if\nmultiline text\narea value" },
//   { "var": "showif_yesnoradio", "choice": "True", "value": "true" },
//   { "var": "text_input", "choice": "", "value": "Regular text input field value" },
//   { "var": "textarea", "choice": "", "value": "Multiline text\narea value" },
//   { "var": "show_3", "choice": "True", "value": "true" },
//   { "var": "show_2", "choice": "True", "value": "true" },
// ];

// // This is here for historical record
// tables.format_2 = [ },
//   { "var": "show_3", "value": "True", },
//   { "var": "show_2", "value": "True", },
// ];

tables.missing_sought_col = [
  { "var": "direct_showifs","value": "True", },
  { "var": "button_continue", "value": "True", },
  { "var": "buttons_other", "value": "button_2", },
  { "var": "buttons_yesnomaybe", "value": "True", },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_1", },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_2", },
  { "var": "checkboxes_yesno", "value": "True", },
  { "var": "direct_standard_fields", "value": "True", },
  { "var": "dropdown_test", "value": "dropdown_opt_2", },
  { "var": "radio_other", "value": "radio_other_opt_3", },
  { "var": "radio_yesno", "value": "False", },
  { "var": "screen_features", "value":"True", },
  { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", },
  { "var": "showif_dropdown", "value": "showif_dropdown_1", },
  { "var": "showif_radio_other", "value": "showif_radio_multi_2", },
  { "var": "showif_text_input", "value": "Show if text input value", },
  { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", },
  { "var": "showif_yesnoradio", "value": "True", },
  { "var": "text_input", "value": "Regular text input field value", },
  { "var": "textarea", "value": "Multiline text\narea value", },
  { "var": "show_3", "value": "True", },
  { "var": "show_2", "value": "True", },
];

tables.normalize_missing_sought_col = [
  {
    "original": { "var": "direct_showifs", "value": "True", },
    "var": "direct_showifs", "value": "True", "sought": "",
  },
  {
    "original": { "var": "button_continue", "value": "True", },
    "var": "button_continue", "value": "True", "sought": "",
  },
  {
    "original": { "var": "buttons_other", "value": "button_2", },
    "var": "buttons_other", "value": "button_2", "sought": "",
  },
  {
    "original": { "var": "buttons_yesnomaybe", "value": "True", },
    "var": "buttons_yesnomaybe", "value": "True", "sought": "",
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_1", },
    "var": "checkboxes_other", "value": "checkbox_other_opt_1", "sought": "",
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_2", },
    "var": "checkboxes_other", "value": "checkbox_other_opt_2", "sought": "",
  },
  {
    "original": { "var": "checkboxes_yesno", "value": "True", },
    "var": "checkboxes_yesno", "value": "True", "sought": "",
  },
  {
    "original": { "var": "direct_standard_fields", "value": "True", },
    "var": "direct_standard_fields", "value": "True", "sought": "",
  },
  {
    "original": { "var": "dropdown_test", "value": "dropdown_opt_2", },
    "var": "dropdown_test", "value": "dropdown_opt_2", "sought": "",
  },
  {
    "original": { "var": "radio_other", "value": "radio_other_opt_3", },
    "var": "radio_other", "value": "radio_other_opt_3", "sought": "",
  },
  {
    "original": { "var": "radio_yesno", "value": "False", },
    "var": "radio_yesno", "value": "False", "sought": "",
  },
  {
    "original": { "var": "screen_features", "value": "True", },
    "var": "screen_features", "value": "True", "sought": "",
  },
  {
    "original": { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", },
    "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "sought": "",
  },
  {
    "original": { "var": "showif_dropdown", "value": "showif_dropdown_1", },
    "var": "showif_dropdown", "value": "showif_dropdown_1", "sought": "",
  },
  {
    "original": { "var": "showif_radio_other", "value": "showif_radio_multi_2", },
    "var": "showif_radio_other", "value": "showif_radio_multi_2", "sought": "",
  },
  {
    "original": { "var": "showif_text_input", "value": "Show if text input value", },
    "var": "showif_text_input", "value": "Show if text input value", "sought": "",
  },
  {
    "original": { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", },
    "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "sought": "",
  },
  {
    "original": { "var": "showif_yesnoradio", "value": "True", },
    "var": "showif_yesnoradio", "value": "True", "sought": "",
  },
  {
    "original": { "var": "text_input", "value": "Regular text input field value", },
    "var": "text_input", "value": "Regular text input field value", "sought": "",
  },
  {
    "original": { "var": "textarea", "value": "Multiline text\narea value", },
    "var": "textarea", "value": "Multiline text\narea value", "sought": "",
  },
  {
    "original": { "var": "show_3", "value": "True", },
    "var": "show_3", "value": "True", "sought": "",
  },
  {
    "original": { "var": "show_2", "value": "True", },
    "var": "show_2", "value": "True", "sought": "",
  },
];

tables.with_sought_col = [
  { "var": "direct_showifs", "value": "True", "sought": "" },
  { "var": "button_continue", "value": "True", "sought": "" },
  { "var": "buttons_other", "value": "button_2", "sought": "" },
  { "var": "buttons_yesnomaybe", "value": "True", "sought": "" },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_1", "sought": "" },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_2", "sought": "" },
  { "var": "checkboxes_yesno", "value": "True", "sought": "" },
  { "var": "direct_standard_fields", "value": "True", "sought": "" },
  { "var": "dropdown_test", "value": "dropdown_opt_2", "sought": "" },
  { "var": "radio_other", "value": "radio_other_opt_3", "sought": "" },
  { "var": "radio_yesno", "value": "False", "sought": "" },
  { "var": "screen_features", "value": "True", "sought": "" },
  { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "sought": "" },
  { "var": "showif_dropdown", "value": "showif_dropdown_1", "sought": "" },
  { "var": "showif_radio_other", "value": "showif_radio_multi_2", "sought": "" },
  { "var": "showif_text_input", "value": "Show if text input value", "sought": "" },
  { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "sought": "" },
  { "var": "showif_yesnoradio", "value": "True", "sought": "" },
  { "var": "text_input", "value": "Regular text input field value", "sought": "" },
  { "var": "textarea", "value": "Multiline text\narea value", "sought": "" },
  { "var": "show_3", "value": "True", "sought": "" },
  { "var": "show_2", "value": "True", "sought": "" },
];

// Should not change
tables.normalize_with_sought_col = [
  {
    "original": { "var": "direct_showifs", "value": "True", "sought": "", },
    "var": "direct_showifs", "value": "True", "sought": "",
  },
  {
    "original": { "var": "button_continue", "value": "True", "sought": "", },
    "var": "button_continue", "value": "True", "sought": "",
  },
  {
    "original": { "var": "buttons_other", "value": "button_2", "sought": "", },
    "var": "buttons_other", "value": "button_2", "sought": "",
  },
  {
    "original": { "var": "buttons_yesnomaybe", "value": "True", "sought": "", },
    "var": "buttons_yesnomaybe", "value": "True", "sought": "",
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_1", "sought": "", },
    "var": "checkboxes_other", "value": "checkbox_other_opt_1", "sought": "",
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_2", "sought": "", },
    "var": "checkboxes_other", "value": "checkbox_other_opt_2", "sought": "",
  },
  {
    "original": { "var": "checkboxes_yesno", "value": "True", "sought": "", },
    "var": "checkboxes_yesno", "value": "True", "sought": "",
  },
  {
    "original": { "var": "direct_standard_fields", "value": "True", "sought": "", },
    "var": "direct_standard_fields", "value": "True", "sought": "",
  },
  {
    "original": { "var": "dropdown_test", "value": "dropdown_opt_2", "sought": "", },
    "var": "dropdown_test", "value": "dropdown_opt_2", "sought": "",
  },
  {
    "original": { "var": "radio_other", "value": "radio_other_opt_3", "sought": "", },
    "var": "radio_other", "value": "radio_other_opt_3", "sought": "",
  },
  {
    "original": { "var": "radio_yesno", "value": "False", "sought": "", },
    "var": "radio_yesno", "value": "False", "sought": "",
  },
  {
    "original": { "var": "screen_features", "value": "True", "sought": "", },
    "var": "screen_features", "value": "True", "sought": "",
  },
  {
    "original": { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "sought": "", },
    "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "sought": "",
  },
  {
    "original": { "var": "showif_dropdown", "value": "showif_dropdown_1", "sought": "", },
    "var": "showif_dropdown", "value": "showif_dropdown_1", "sought": "",
  },
  {
    "original": { "var": "showif_radio_other", "value": "showif_radio_multi_2", "sought": "", },
    "var": "showif_radio_other", "value": "showif_radio_multi_2", "sought": "",
  },
  {
    "original": { "var": "showif_text_input", "value": "Show if text input value", "sought": "", },
    "var": "showif_text_input", "value": "Show if text input value", "sought": "",
  },
  {
    "original": { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "sought": "", },
    "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "sought": "",
  },
  {
    "original": { "var": "showif_yesnoradio", "value": "True", "sought": "", },
    "var": "showif_yesnoradio", "value": "True", "sought": "",
  },
  {
    "original": { "var": "text_input", "value": "Regular text input field value", "sought": "", },
    "var": "text_input", "value": "Regular text input field value", "sought": "",
  },
  {
    "original": { "var": "textarea", "value": "Multiline text\narea value", "sought": "", },
    "var": "textarea", "value": "Multiline text\narea value", "sought": "",
  },
  {
    "original": { "var": "show_3", "value": "True", "sought": "", },
    "var": "show_3", "value": "True", "sought": "",
  },
  {
    "original": { "var": "show_2", "value": "True", "sought": "", },
    "var": "show_2", "value": "True", "sought": "",
  },
];


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
tables.proxies_xi = [
  { "sought": "a_list[0].name.first", "var": "x[i].name.first", "value": "Firstname", },
];

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
tables.proxies_multi = [
  { "sought": "a_list[0].name.first", "var": "x[i].name.first", "value": "Firstname1", },
  { "sought": "a_list[1].name.first", "var": "x[i].name.first", "value": "Firstname2", },
  { "sought": "a_list[2].name.first", "var": "x[i].name.first", "value": "Firstname3", },
];

// your_past_benefits[i].still_receiving
// your_past_benefits['State Veterans Benefits'].still_receiving
// Non-match comes after a match
tables.proxies_non_match = [
  { "sought": "your_past_benefits['State Veterans Benefits'].still_receiving", "var": "your_past_benefits[i].start_date", "value": "01/01/2001", },
  { "sought": "your_past_benefits['State Veterans Benefits'].still_receiving", "var": "your_past_benefits[i].still_receiving", "value": "True", },
  { "sought": "your_past_benefits['State Veterans Benefits'].still_receiving", "var": "your_past_benefits[i].end_date", "value": "02/02/2002", },
];


// ============================
// Signature
// ============================
// Also tests that multiple signature rows only match their var
tables.signature = [
  { "sought": "signature_2", "var": "signature_2", "value": "/sign", },
  { "sought": "signature_1", "var": "signature_1", "value": "/sign", },
];


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
tables.choices = [
  { "var": "cs_arrears_mc", "value": "No", },
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
  { "var": "trial_court", "value": "all_courts[0]", },
];



module.exports = tables;
