let page_data =  {};

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
page_data.standard = {
  "sought_var": "direct_standard_fields",
  "uses_proxies": false,
  "fields": [
    {
      "selector": "#daquestion input[name=\"Y2hlY2tib3hlc195ZXNubw\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var": "checkboxes_yesno", "value": "True", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1RJ10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_1", "checked": false },
        { "var": "checkboxes_other_1", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk1nJ10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_2", "checked": false },
        { "var": "checkboxes_other_1", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8xW0InWTJobFkydGliM2hmYjNSb1pYSmZNVjl2Y0hSZk13J10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var": "checkboxes_other_1", "value": "checkbox_other_1_opt_3", "checked": false },
        { "var": "checkboxes_other_1", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"_ignore1\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var": "checkboxes_other_1", "value": "None", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1RJ10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_1", "checked": false },
        { "var": "checkboxes_other_2", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk1nJ10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_2", "checked": false },
        { "var": "checkboxes_other_2", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcl8yW0InWTJobFkydGliM2hmYjNSb1pYSmZNbDl2Y0hSZk13J10\"][value=\"True\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var": "checkboxes_other_2", "value": "checkbox_other_2_opt_3", "checked": false },
        { "var": "checkboxes_other_2", "value": "r\u0017���1��az����m�", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"_ignore2\"]",
      "tag": "input",
      "type": "checkbox",
      "rows": [
        { "var": "checkboxes_other_2", "value": "None", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"cmFkaW9feWVzbm8\"][value=\"True\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var": "radio_yesno", "value": "True", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"cmFkaW9feWVzbm8\"][value=\"False\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var": "radio_yesno", "value": "False", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_1\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var": "radio_other", "value": "radio_other_opt_1", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_2\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var": "radio_other", "value": "radio_other_opt_2", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_3\"]",
      "tag": "input",
      "type": "radio",
      "rows": [
        { "var": "radio_other", "value": "radio_other_opt_3", "checked": false }
      ]
    },
    {
      "selector": "#daquestion input[name=\"dGV4dF9pbnB1dA\"]",
      "tag": "input",
      "type": "text",
      "rows": [
        { "var": "text_input", "value": "", "checked": "" }
      ]
    },
    {
      "selector": "#daquestion textarea[name=\"dGV4dGFyZWE\"]",
      "tag": "textarea",
      "type": "",
      "rows": [
        { "var": "textarea", "value": "", "checked": "" }
      ]
    },
    {
      "selector": "#daquestion select[name=\"ZHJvcGRvd25fdGVzdA\"]",
      "tag": "select",
      "type": "",
      "rows": [
      // May want to change `checked`
        { "var": "dropdown_test", "value": "", "checked": false },
        { "var": "dropdown_test", "value": "", "checked": false },
        { "var": "dropdown_test", "value": "dropdown_opt_1", "checked": false },
        { "var": "dropdown_test", "value": "v�)v�'��m�", "checked": false },
        { "var": "dropdown_test", "value": "dropdown_opt_2", "checked": false },
        { "var": "dropdown_test", "value": "v�)v�'��m�", "checked": false },
        { "var": "dropdown_test", "value": "dropdown_opt_3", "checked": false },
        { "var": "dropdown_test", "value": "v�)v�'��m�", "checked": false }
      ]
    },
    {
      "selector": "#daquestion button[name=\"ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw\"][value=\"True\"]",
      "tag": "button",
      "type": "submit",
      "rows": [
        { "var": "direct_standard_fields", "value": "True", "checked": false }  // May want to change `checked`
      ]
    }
  ]  // ends page_data.standard.fields
};  // ends page_data.standard


// ============================
// Simple show if fields - no proxies
// ============================
page_data.show_if = {
  "sought_var": "direct_showifs",
  "uses_proxies": false,
  "fields": [
    {
      "selector": "#daquestion input[name=\"c2hvd18y\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var": "show_2",
          "value": "True",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzE\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var": "show_3",
          "value": "True",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzI\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_checkbox_yesno",
          "value": "True",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eCdd\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_checkboxes_other",
          "value": "showif_checkboxes_nota_1",
          "checked": false
        },
        {
          "var": "showif_checkboxes_other",
          "value": "�\u001a0��܅�$n�^��赯�",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eSdd\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_checkboxes_other",
          "value": "showif_checkboxes_nota_2",
          "checked": false
        },
        {
          "var": "showif_checkboxes_other",
          "value": "�\u001a0��܅�$n�^��赯�",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "#daquestion input[name=\"_ignore3\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_checkboxes_other",
          "value": "None",
          "checked": false
        }
      ],
      "type": "checkbox"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzQ\"][value=\"True\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_yesnoradio",
          "value": "True",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzQ\"][value=\"False\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_yesnoradio",
          "value": "False",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_1\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_radio_other",
          "value": "showif_radio_multi_1",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_2\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_radio_other",
          "value": "showif_radio_multi_2",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_3\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_radio_other",
          "value": "showif_radio_multi_3",
          "checked": false
        }
      ],
      "type": "radio"
    },
    {
      "selector": "#daquestion input[name=\"X2ZpZWxkXzY\"]",
      "tag": "input",
      "rows": [
        {
          "var": "showif_text_input",
          "value": "",
          "checked": ""
        }
      ],
      "type": "text"
    },
    {
      "selector": "#daquestion textarea[name=\"X2ZpZWxkXzc\"]",
      "tag": "textarea",
      "rows": [
        {
          "var": "showif_textarea",
          "value": "",
          "checked": ""
        }
      ],
      "type": ""
    },
    {
      "selector": "#daquestion select[name=\"X2ZpZWxkXzg\"]",
      "tag": "select",
      "rows": [
        { "var": "showif_dropdown", "value": "", "checked": false },
        { "var": "showif_dropdown", "value": "", "checked": false },
        { "var": "showif_dropdown", "value": "showif_dropdown_1", "checked": false },
        { "var": "showif_dropdown", "value": "�\u001a0��ݮ�]�\t�", "checked": false },
        { "var": "showif_dropdown", "value": "showif_dropdown_2", "checked": false },
        { "var": "showif_dropdown", "value": "�\u001a0��ݮ�]�\t�", "checked": false },
        { "var": "showif_dropdown", "value": "showif_dropdown_3", "checked": false },
        { "var": "showif_dropdown", "value": "�\u001a0��ݮ�]�\t�", "checked": false }
      ],
      "type": ""
    },
    {
      "selector": "#daquestion button[name=\"ZGlyZWN0X3Nob3dpZnM\"][value=\"True\"]",
      "tag": "button",
      "rows": [
        {
          "var": "direct_showifs",
          "value": "True",
          "checked": false
        }
      ],
      "type": "submit"
    }
  ]
};  // ends page_data.show_if


// ============================
// Buttons
// ============================
// `continue button field:`
page_data.button_continue = {
  "sought_var": "button_continue",
  "uses_proxies": false,
  "fields": [
    {
      "selector": "#daquestion button[name=\"YnV0dG9uX2NvbnRpbnVl\"][value=\"True\"]",
      "tag": "button",
      "rows": [
        {
          "var": "button_continue",
          "value": "True",
          "checked": false
        }
      ],
      "type": "submit"
    }
  ]
};

// `yesnomaybe:`
// TODO: Shall we allow 'maybe' in the table as a value for `None`?
page_data.buttons_yesnomaybe = {
  "sought_var": "buttons_yesnomaybe",
  "uses_proxies": false,
  "fields": [
    {
      "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"]",
      "tag": "button",
      "rows": [
        {
          "var": "buttons_yesnomaybe",
          "value": "True",
          "checked": false
        }
      ],
      "type": "submit"
    },
    {
      "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"]",
      "tag": "button",
      "rows": [
        {
          "var": "buttons_yesnomaybe",
          "value": "False",
          "checked": false
        }
      ],
      "type": "submit"
    },
    {
      "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"]",
      "tag": "button",
      "rows": [
        {
          "var": "buttons_yesnomaybe",
          "value": "None",
          "checked": false
        }
      ],
      "type": "submit"
    }
  ]
};

// Multiple choice 'continue' button fields that are not yesnomaybe
// `field:` and `buttons:`
page_data.buttons_other = {
  "sought_var": "buttons_other",
  "uses_proxies": false,
  "fields": [
    {
      "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_1\"]",
      "tag": "button",
      "rows": [
        {
          "var": "buttons_other",
          "value": "button_1",
          "checked": false
        }
      ],
      "type": "submit"
    },
    {
      "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_2\"]",
      "tag": "button",
      "rows": [
        {
          "var": "buttons_other",
          "value": "button_2",
          "checked": false
        }
      ],
      "type": "submit"
    },
    {
      "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_3\"]",
      "tag": "button",
      "rows": [
        {
          "var": "buttons_other",
          "value": "button_3",
          "checked": false
        }
      ],
      "type": "submit"
    }
  ]
};

// `field:` and `action buttons:`
page_data.buttons_event_action = {
  "sought_var": "button_event_action",
  "uses_proxies": false,
  "fields": [
    {
      "selector": "#daquestion button[name=\"YnV0dG9uX2V2ZW50X2FjdGlvbg\"][value=\"True\"]",
      "tag": "button",
      "rows": [
        {
          "var": "button_event_action",
          "value": "True",
          "checked": false
        }
      ],
      "type": "submit"
    },
    {
      "selector": "#daquestion a[data-linknum=\"1\"]",
      "tag": "a",
      "rows": [
        {
          "var": "end",
          "value": "",
          "checked": ""
        }
      ],
      "type": ""
    }
  ]
}


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
page_data.proxies_xi = {
  "sought_var": "a_list[0].name.first",
  "uses_proxies": true,
  "fields": [
    {
      "selector": "#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"]",
      "tag": "input",
      "rows": [
        {
          "var": "x[i].name.first",
          "value": "",
          "checked": ""
        }
      ],
      "type": "text"
    },
    {
      "selector": "#daquestion button",
      "tag": "button",
      "rows": [],
      "type": "submit"
    }
  ]
};

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
page_data.proxies_multi = {
  "sought_var": "a_list[0].name.first",
  "uses_proxies": true,
  "fields": [
    {
      "selector": "#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"]",
      "tag": "input",
      "rows": [
        {
          "var": "x[i].name.first",
          "value": "",
          "checked": ""
        }
      ],
      "type": "text"
    },
    {
      "selector": "#daquestion button",
      "tag": "button",
      "rows": [],
      "type": "submit"
    }
  ]
};

// your_past_benefits[i].still_receiving
// your_past_benefits['State Veterans Benefits'].still_receiving
// Non-match comes after a match
page_data.proxies_non_match = {
  "sought_var": "your_past_benefits['State Veterans Benefits'].still_receiving",
  "uses_proxies": true,
  "fields": [
  {
    "selector": "#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0YXJ0X2RhdGU\"]",
    "tag": "input",
    "type": "date",
    "rows": [
    {
      "var": "your_past_benefits[i].start_date",
      "value": "",
      "checked": ""
    }]
  },
  {
    "selector": "#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw\"][value=\"True\"]",
    "tag": "input",
    "type": "radio",
    "rows": [
    {
      "var": "your_past_benefits[i].still_receiving",
      "value": "True",
      "checked": false
    }]
  },
  {
    "selector": "#daquestion input[name=\"eW91cl9wYXN0X2JlbmVmaXRzW2ldLnN0aWxsX3JlY2VpdmluZw\"][value=\"False\"]",
    "tag": "input",
    "type": "radio",
    "rows": [
    {
      "var": "your_past_benefits[i].still_receiving",
      "value": "False",
      "checked": false
    }]
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzM\"]",
    "tag": "input",
    "type": "date",
    "rows": [
    {
      "var": "your_past_benefits[i].end_date",
      "value": "",
      "checked": ""
    }]
  },
  {
    "selector": "#daquestion button",
    "tag": "button",
    "type": "submit",
    "rows": []
  }]
};


// ============================
// Signature
// ============================
page_data.signature = {
  "sought_var": "signature_1",
  "uses_proxies": false,
  "fields": [
    {
      "selector": "#daquestion canvas",
      "tag": "canvas",
      "rows": [
        {
          "var": "signature_1",
          "value": "/sign",
          "checked": ""
        }
      ],
      "type": ""
    },
    // Signature page continue buttons are in a `div.dasigbuttons`, not in a `fieldset`
  ]
};


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
page_data.choices = {
  "sought_var": "cs_arrears_mc",
  "uses_proxies": false,
  "fields": [
  {
    "selector": "#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"Yes\"]",
    "tag": "input",
    "type": "radio",
    "rows": [{ "var": "cs_arrears_mc", "value": "Yes", "checked": false }]
  },
  {
    "selector": "#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"No\"]",
    "tag": "input",
    "type": "radio",
    "rows": [{ "var": "cs_arrears_mc", "value": "No", "checked": false }]
  },
  {
    "selector": "#daquestion input[name=\"Y3NfYXJyZWFyc19tYw\"][value=\"I am not sure\"]",
    "tag": "input",
    "type": "radio",
    "rows": [{ "var": "cs_arrears_mc", "value": "I am not sure", "checked": false }]
  },
  {
    "selector": "#daquestion button",
    "tag": "button",
    "type": "submit",
    "rows": []
  }]
};


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
page_data.object_dropdown =  {
  "sought_var": "trial_court",
  "uses_proxies": false,
  "fields": [
  {
    "selector": "#daquestion select[name=\"dHJpYWxfY291cnQ\"]",
    "tag": "select",
    "type": "",
    "rows": [
      { "var": "trial_court", "value": "", "checked": false },
      { "var": "trial_court", "value": "", "checked": false },
      { "var": "trial_court", "value": "YWxsX2NvdXJ0c1swXQ", "checked": false },
      { "var": "trial_court", "value": "all_courts[0]", "checked": false },
      { "var": "trial_court", "value": "YWxsX2NvdXJ0c1syXQ", "checked": false },
      { "var": "trial_court", "value": "all_courts[2]", "checked": false },
      { "var": "trial_court", "value": "YWxsX2NvdXJ0c1szXQ", "checked": false },
      { "var": "trial_court", "value": "all_courts[3]", "checked": false }
    ]
  },
  {
    "selector": "#daquestion button",
    "tag": "button",
    "type": "button",
    "rows": []
  },
  {
    "selector": "#daquestion button",
    "tag": "button",
    "type": "submit",
    "rows": []
  }]
};


module.exports = page_data;
