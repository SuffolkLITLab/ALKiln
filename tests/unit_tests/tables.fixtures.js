let tables =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
tables.standard = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var": "direct_standard_fields", "value": "True", "checked": false },  // May want to change `checked`
  { "var": "checkboxes_yesno", "value": "True", "checked": true },
  { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_1", "checked": false },
  { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_2", "checked": true },
  { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_3", "checked": false },
  { "var": "checkboxes_other_1", "value": "None", "checked": false },
  { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_1", "checked": false },
  { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_2", "checked": false },
  { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_3", "checked": false },
  { "var": "checkboxes_other_2", "value": "None", "checked": true },
  { "var": "radio_yesno", "value": "False", "checked": true },
  { "var": "radio_other", "value": "radio_other_opt_2", "checked": true },
  { "var": "text_input", "value": "Some one-line text", "checked": "" },
  { "var": "textarea", "value": "Some\nmulti-line\ntext", "checked": "" },
  { "var": "dropdown_test", "value": "dropdown_opt_2", "checked": true },  // May want to change `checked`
];


// ============================
// Simple show if fields - no proxies
// ============================
tables.show_if = [
  // continue button comes first to test that it doesn't get activated till after all other
  // variables have been set.
  { "var": "direct_showifs", "value": "True", "checked": true, },  // May want to change `checked`
  { "var": "show_2", "value": "True", "checked": true, },
  { "var": "show_3", "value": "True", "checked": false, },
  { "var": "showif_checkbox_yesno", "value": "True", "checked": true, },
  { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": false, },
  { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": true, },
  { "var": "showif_checkboxes_other", "value": "None", "checked": false, },
  { "var": "showif_yesnoradio", "value": "False", "checked": true, },
  { "var": "showif_radio_other", "value": "showif_radio_multi_2", "checked": true, },
  { "var": "showif_text_input", "value": "Some one-line text in show if input", "checked": "", },
  { "var": "showif_textarea", "value": "Some\nmulti-line\ntext in show if textarea", "checked": "", },
  { "var": "showif_dropdown", "value": "showif_dropdown_2", "checked": true, },  // May want to change `checked`
];


// ============================
// Buttons
// ============================
// `continue button field:`
tables.button_continue = [
  { "var": "button_continue", "value": "True", "checked": true, },  // May want to change `checked`
];

// `yesnomaybe:`
tables.buttons_yesnomaybe_yes = [
  { "var": "buttons_yesnomaybe", "value": "True", "checked": true, },  // May want to change `checked`
];
tables.buttons_yesnomaybe_no = [
  { "var": "buttons_yesnomaybe", "value": "False", "checked": true, },  // May want to change `checked`
];
tables.buttons_yesnomaybe_none = [
  { "var": "buttons_yesnomaybe", "value": "None", "checked": true, },  // May want to change `checked`
];

// `field:` and `buttons:`
tables.buttons_other_1 = [
  { "var": "buttons_other", "value": "button_1", "checked": true, },  // May want to change `checked`
];
tables.buttons_other_2 = [
  { "var": "buttons_other", "value": "button_2", "checked": true, },  // May want to change `checked`
];
tables.buttons_other_3 = [
  { "var": "buttons_other", "value": "button_3", "checked": true, },  // May want to change `checked`
];

// `field:` and `action buttons:`
tables.buttons_event_action = [
  { "var": "end", "value": "", "checked": "", },  // May want to change `checked`
];


// =================
// Converting from old table to new table
// =================
tables.original_formatting = [
  { "var": "direct_showifs", "choice": "True", "value": "true" },
  { "var": "button_continue", "choice": "True", "value": "true" },
  { "var": "buttons_other", "choice": "", "value": "button_2" },
  { "var": "buttons_yesnomaybe", "choice": "True", "value": "true" },
  { "var": "checkboxes_other", "choice": "checkbox_other_opt_1", "value": "true" },
  { "var": "checkboxes_other", "choice": "checkbox_other_opt_2", "value": "true" },
  { "var": "checkboxes_other", "choice": "checkbox_other_opt_3", "value": "false" },
  { "var": "checkboxes_yesno", "choice": "True", "value": "true" },
  { "var": "direct_standard_fields", "choice": "True", "value": "true" },
  { "var": "dropdown_test", "choice": "", "value": "dropdown_opt_2" },
  { "var": "radio_other", "choice": "", "value": "radio_other_opt_3" },
  { "var": "radio_yesno", "choice": "False", "value": "false" },
  { "var": "screen_features", "choice": "True", "value": "true" },
  { "var": "showif_checkbox_yesno", "choice": "False", "value": "false" },
  { "var": "showif_checkboxes_other", "choice": "showif_checkboxes_nota_1", "value": "false" },
  { "var": "showif_checkboxes_other", "choice": "showif_checkboxes_nota_2", "value": "true" },
  { "var": "showif_dropdown", "choice": "", "value": "showif_dropdown_1" },
  { "var": "showif_radio_other", "choice": "", "value": "showif_radio_multi_2" },
  { "var": "showif_text_input", "choice": "", "value": "Show if text input value" },
  { "var": "showif_textarea", "choice": "", "value": "Show if\nmultiline text\narea value" },
  { "var": "showif_yesnoradio", "choice": "True", "value": "true" },
  { "var": "text_input", "choice": "", "value": "Regular text input field value" },
  { "var": "textarea", "choice": "", "value": "Multiline text\narea value" },
  { "var": "show_3", "choice": "True", "value": "true" },
  { "var": "show_2", "choice": "True", "value": "true" },
];

/* Notes about conversion
* - value: row.choice || row.value,
*   Looking at the old tables, what we consider to be `value` now is most often
*   `choice`. Whenever og `value` is the right value for current `value`, og
*   `choice` is blank, so this logic is correct.
* - checked: row.checked vs. row.value,
*   The original `value` might be 'Some input text' or 'true'/'false'
*   If an original format table has a non-true/false value, that will stick
*   around, but it won't hurt our current code's functionality
*   We do want to give preference to `.checked` from new tables.
*/
tables.old_to_current_formatting = [
  {
    "original": { "var": "direct_showifs", "choice": "True", "value": "true" },
    "var": "direct_showifs", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "button_continue", "choice": "True", "value": "true" },
    "var": "button_continue", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "buttons_other", "choice": "", "value": "button_2" },
    "var": "buttons_other", "value": "button_2", "checked": "button_2",
  },
  {
    "original": { "var": "buttons_yesnomaybe", "choice": "True", "value": "true" },
    "var": "buttons_yesnomaybe", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "checkboxes_other", "choice": "checkbox_other_opt_1", "value": "true" },
    "var": "checkboxes_other", "value": "checkbox_other_opt_1", "checked": "true",
  },
  {
    "original": { "var": "checkboxes_other", "choice": "checkbox_other_opt_2", "value": "true" },
    "var": "checkboxes_other", "value": "checkbox_other_opt_2", "checked": "true",
  },
  {
    "original": { "var": "checkboxes_other", "choice": "checkbox_other_opt_3", "value": "false" },
    "var": "checkboxes_other", "value": "checkbox_other_opt_3", "checked": "false",
  },
  {
    "original": { "var": "checkboxes_yesno", "choice": "True", "value": "true" },
    "var": "checkboxes_yesno", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "direct_standard_fields", "choice": "True", "value": "true" },
    "var": "direct_standard_fields", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "dropdown_test", "choice": "", "value": "dropdown_opt_2" },
    "var": "dropdown_test", "value": "dropdown_opt_2", "checked": "dropdown_opt_2",
  },
  {
    "original": { "var": "radio_other", "choice": "", "value": "radio_other_opt_3" },
    "var": "radio_other", "value": "radio_other_opt_3", "checked": "radio_other_opt_3",
  },
  {
    "original": { "var": "radio_yesno", "choice": "False", "value": "false" },
    "var": "radio_yesno", "value": "False", "checked": "false",
  },
  {
    "original": { "var": "screen_features", "choice": "True", "value": "true" },
    "var": "screen_features", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "showif_checkbox_yesno", "choice": "False", "value": "false" },
    "var": "showif_checkbox_yesno", "value": "False", "checked": "false",
  },
  {
    "original": { "var": "showif_checkboxes_other", "choice": "showif_checkboxes_nota_1", "value": "false" },
    "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": "false",
  },
  {
    "original": { "var": "showif_checkboxes_other", "choice": "showif_checkboxes_nota_2", "value": "true" },
    "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": "true",
  },
  {
    "original": { "var": "showif_dropdown", "choice": "", "value": "showif_dropdown_1" },
    "var": "showif_dropdown", "value": "showif_dropdown_1", "checked": "showif_dropdown_1",
  },
  {
    "original": { "var": "showif_radio_other", "choice": "", "value": "showif_radio_multi_2" },
    "var": "showif_radio_other", "value": "showif_radio_multi_2", "checked": "showif_radio_multi_2",
  },
  {
    "original": { "var": "showif_text_input", "choice": "", "value": "Show if text input value" },
    "var": "showif_text_input", "value": "Show if text input value", "checked": "Show if text input value",
  },
  {
    "original": { "var": "showif_textarea", "choice": "", "value": "Show if\nmultiline text\narea value" },
    "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "checked": "Show if\nmultiline text\narea value",
  },
  {
    "original": { "var": "showif_yesnoradio", "choice": "True", "value": "true" },
    "var": "showif_yesnoradio", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "text_input", "choice": "", "value": "Regular text input field value" },
    "var": "text_input", "value": "Regular text input field value", "checked": "Regular text input field value",
  },
  {
    "original": { "var": "textarea", "choice": "", "value": "Multiline text\narea value" },
    "var": "textarea", "value": "Multiline text\narea value", "checked": "Multiline text\narea value",
  },
  {
    "original": { "var": "show_3", "choice": "True", "value": "true" },
    "var": "show_3", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "show_2", "choice": "True", "value": "true" },
    "var": "show_2", "value": "True", "checked": "true",
  },
];


tables.current_formatting = [
  { "var": "direct_showifs", "value": "True", "checked": "true", },
  { "var": "button_continue", "value": "True", "checked": "true", },
  { "var": "buttons_other", "value": "button_2", "checked": "", },
  { "var": "buttons_yesnomaybe", "value": "True", "checked": "true", },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_1", "checked": "true", },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_2", "checked": "true", },
  { "var": "checkboxes_other", "value": "checkbox_other_opt_3", "checked": "false", },
  { "var": "checkboxes_yesno", "value": "True", "checked": "true", },
  { "var": "direct_standard_fields", "value": "True", "checked": "true", },
  { "var": "dropdown_test", "value": "dropdown_opt_2", "checked": "", },
  { "var": "radio_other", "value": "radio_other_opt_3", "checked": "", },
  { "var": "radio_yesno", "value": "False", "checked": "false", },
  { "var": "screen_features", "value": "True", "checked": "true", },
  { "var": "showif_checkbox_yesno", "value": "False", "checked": "false", },
  { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": "false", },
  { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": "true", },
  { "var": "showif_dropdown", "value": "showif_dropdown_1", "checked": "", },
  { "var": "showif_radio_other", "value": "showif_radio_multi_2", "checked": "", },
  { "var": "showif_text_input", "value": "Show if text input value", "checked": "", },
  { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "checked": "", },
  { "var": "showif_yesnoradio", "value": "True", "checked": "true", },
  { "var": "text_input", "value": "Regular text input field value", "checked": "", },
  { "var": "textarea", "value": "Multiline text\narea value", "checked": "", },
  { "var": "show_3", "value": "True", "checked": "true", },
  { "var": "show_2", "value": "True", "checked": "true", },
];

// Should not be changed at all
tables.current_to_current_formatting = [
  {
    "original": { "var": "direct_showifs", "value": "True", "checked": "true" },
    "var": "direct_showifs", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "button_continue", "value": "True", "checked": "true" },
    "var": "button_continue", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "buttons_other", "value": "button_2", "checked": "" },
    "var": "buttons_other", "value": "button_2", "checked": "",
  },
  {
    "original": { "var": "buttons_yesnomaybe", "value": "True", "checked": "true" },
    "var": "buttons_yesnomaybe", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_1", "checked": "true" },
    "var": "checkboxes_other", "value": "checkbox_other_opt_1", "checked": "true",
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_2", "checked": "true" },
    "var": "checkboxes_other", "value": "checkbox_other_opt_2", "checked": "true",
  },
  {
    "original": { "var": "checkboxes_other", "value": "checkbox_other_opt_3", "checked": "false" },
    "var": "checkboxes_other", "value": "checkbox_other_opt_3", "checked": "false",
  },
  {
    "original": { "var": "checkboxes_yesno", "value": "True", "checked": "true" },
    "var": "checkboxes_yesno", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "direct_standard_fields", "value": "True", "checked": "true" },
    "var": "direct_standard_fields", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "dropdown_test", "value": "dropdown_opt_2", "checked": "" },
    "var": "dropdown_test", "value": "dropdown_opt_2", "checked": "",
  },
  {
    "original": { "var": "radio_other", "value": "radio_other_opt_3", "checked": "" },
    "var": "radio_other", "value": "radio_other_opt_3", "checked": "",
  },
  {
    "original": { "var": "radio_yesno", "value": "False", "checked": "false" },
    "var": "radio_yesno", "value": "False", "checked": "false",
  },
  {
    "original": { "var": "screen_features", "value": "True", "checked": "true" },
    "var": "screen_features", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "showif_checkbox_yesno", "value": "False", "checked": "false" },
    "var": "showif_checkbox_yesno", "value": "False", "checked": "false",
  },
  {
    "original": { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": "false" },
    "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_1", "checked": "false",
  },
  {
    "original": { "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": "true" },
    "var": "showif_checkboxes_other", "value": "showif_checkboxes_nota_2", "checked": "true",
  },
  {
    "original": { "var": "showif_dropdown", "value": "showif_dropdown_1", "checked": "" },
    "var": "showif_dropdown", "value": "showif_dropdown_1", "checked": "",
  },
  {
    "original": { "var": "showif_radio_other", "value": "showif_radio_multi_2", "checked": "" },
    "var": "showif_radio_other", "value": "showif_radio_multi_2", "checked": "",
  },
  {
    "original": { "var": "showif_text_input", "value": "Show if text input value", "checked": "" },
    "var": "showif_text_input", "value": "Show if text input value", "checked": "",
  },
  {
    "original": { "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "checked": "" },
    "var": "showif_textarea", "value": "Show if\nmultiline text\narea value", "checked": "",
  },
  {
    "original": { "var": "showif_yesnoradio", "value": "True", "checked": "true" },
    "var": "showif_yesnoradio", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "text_input", "value": "Regular text input field value", "checked": "" },
    "var": "text_input", "value": "Regular text input field value", "checked": "",
  },
  {
    "original": { "var": "textarea", "value": "Multiline text\narea value", "checked": "" },
    "var": "textarea", "value": "Multiline text\narea value", "checked": "",
  },
  {
    "original": { "var": "show_3", "value": "True", "checked": "true" },
    "var": "show_3", "value": "True", "checked": "true",
  },
  {
    "original": { "var": "show_2", "value": "True", "checked": "true" },
    "var": "show_2", "value": "True", "checked": "true",
  },
];


module.exports = tables;
