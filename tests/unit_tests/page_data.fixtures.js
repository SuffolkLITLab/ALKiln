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
};  // ends page_data.standard


page_data.show_if = {
  "sought_var": [
    "direct_showifs"
  ],
  "fields": [
    {
      "selector": "input[name=\"c2hvd18y\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "show_2",
          "value": "True",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzE\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "show_3",
          "value": "True",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzI\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_checkbox_yesno",
          "value": "True",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eCdd\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_checkboxes_other",
          "value": "showif_checkboxes_nota_1",
          "checked": false
        },
        {
          "var_name": "showif_checkboxes_other",
          "value": "�\u001a0��܅�$n�^��赯�",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eSdd\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_checkboxes_other",
          "value": "showif_checkboxes_nota_2",
          "checked": false
        },
        {
          "var_name": "showif_checkboxes_other",
          "value": "�\u001a0��܅�$n�^��赯�",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "input[name=\"_ignore3\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_checkboxes_other",
          "value": "al_danota",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzQ\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_yesnoradio",
          "value": "True",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzQ\"][value=\"False\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_yesnoradio",
          "value": "False",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_1\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_radio_other",
          "value": "showif_radio_multi_1",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_2\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_radio_other",
          "value": "showif_radio_multi_2",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_3\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_radio_other",
          "value": "showif_radio_multi_3",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "input[name=\"X2ZpZWxkXzY\"]",
      "tag": "input",
      "rows": [
        {
          "var_name": "showif_text_input",
          "value": "",
          "checked": ""
        }
      ],
      "type": "text"
    },
    {
      "selector": "textarea[name=\"X2ZpZWxkXzc\"]",
      "tag": "textarea",
      "rows": [
        {
          "var_name": "showif_textarea",
          "value": "",
          "checked": ""
        }
      ],
      "type": ""
    },
    {
      "selector": "select[name=\"X2ZpZWxkXzg\"]",
      "tag": "select",
      "rows": [
        {
          "var_name": "showif_dropdown",
          "value": "",
          "checked": false
        },
        {
          "var_name": "showif_dropdown",
          "value": "showif_dropdown_1",
          "checked": false
        },
        {
          "var_name": "showif_dropdown",
          "value": "showif_dropdown_2",
          "checked": false
        },
        {
          "var_name": "showif_dropdown",
          "value": "showif_dropdown_3",
          "checked": false
        }
      ],
      "type": ""
    },
    {
      "selector": "button[name=\"ZGlyZWN0X3Nob3dpZnM\"][value=\"True\"]",
      "tag": "button",
      "rows": [
        {
          "var_name": "direct_showifs",
          "value": "True",
          "checked": false
        }
      ],
      "type": "submit"
    }
  ]
};  // ends page_data.show_if

module.exports = page_data;
