let page_data =  {}

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
page_data.standard = {
  "sought_var": [ "direct_standard_fields" ],
  "fields": [
    {
      "selector": "input[name=\"Y2hlY2tib3hlc195ZXNubw\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var_name": "checkboxes_yesno", "value": "True", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1RJ10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_1", "checked": false },
        { "var_name": "checkboxes_other_1", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1nJ10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_2", "checked": false },
        { "var_name": "checkboxes_other_1", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk13J10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var_name": "checkboxes_other_1", "value": "checkbox_other_1_opt_3", "checked": false },
        { "var_name": "checkboxes_other_1", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"_ignore1\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var_name": "checkboxes_other_1", "value": "al_danota", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1RJ10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_1", "checked": false },
        { "var_name": "checkboxes_other_2", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1nJ10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_2", "checked": false },
        { "var_name": "checkboxes_other_2", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk13J10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var_name": "checkboxes_other_2", "value": "checkbox_other_2_opt_3", "checked": false },
        { "var_name": "checkboxes_other_2", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"_ignore2\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var_name": "checkboxes_other_2", "value": "al_danota", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"cmFkaW9feWVzbm8\"][value=\"True\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var_name": "radio_yesno", "value": "True", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"cmFkaW9feWVzbm8\"][value=\"False\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var_name": "radio_yesno", "value": "False", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_1\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var_name": "radio_other", "value": "radio_other_opt_1", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_2\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var_name": "radio_other", "value": "radio_other_opt_2", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_3\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var_name": "radio_other", "value": "radio_other_opt_3", "checked": false }
      ]
    },
    {
      "selector": "input[name=\"dGV4dF9pbnB1dA\"]",
      "tag": "input",
      "type": "text",
      "rows": [
        { "var_name": "text_input", "value": "", "checked": "" }
      ]
    },
    {
      "selector": "textarea[name=\"dGV4dGFyZWE\"]",
      "tag": "textarea",
      "type": "",
      "rows": [
        { "var_name": "textarea", "value": "", "checked": "" }
      ]
    },
    {
      "selector": "select[name=\"ZHJvcGRvd25fdGVzdA\"]",
      "tag": "select",
      "type": "",
      "rows": [
        { "var_name": "dropdown_test", "value": "", "checked": false },  // May want to change `checked`
        { "var_name": "dropdown_test", "value": "dropdown_opt_1", "checked": false },  // May want to change `checked`
        { "var_name": "dropdown_test", "value": "dropdown_opt_2", "checked": false },  // May want to change `checked`
        { "var_name": "dropdown_test", "value": "dropdown_opt_3", "checked": false }  // May want to change `checked`
      ]
    },
    {
      "selector": "button[name=\"ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw\"][value=\"True\"]",
      "tag": "button",
      "type": "submit",
      "rows": [
        { "var_name": "direct_standard_fields", "value": "True", "checked": false }  // May want to change `checked`
      ]
    }
  ]  // ends page_data.standard.fields
};

module.exports = page_data;
