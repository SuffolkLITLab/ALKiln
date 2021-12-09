let fields =  {};

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
fields.standard = [
  {
    "selector": "#daquestion input[name=\"Y2hlY2tib3hlc195ZXNubw\"][value=\"True\"][id=\"Y2hlY2tib3hlc195ZXNubw\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "checkboxes_yesno",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcltCJ1kyaGxZMnRpYjNoZmIzUm9aWEpmYjNCMFh6RSdd\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcg_0\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "checkboxes_other['checkbox_other_opt_1']",
        "value": "True"
      },
      {
        "var": "checkboxes_other['r\u0017���1��az����']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcltCJ1kyaGxZMnRpYjNoZmIzUm9aWEpmYjNCMFh6SSdd\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcg_1\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "checkboxes_other['checkbox_other_opt_2']",
        "value": "True"
      },
      {
        "var": "checkboxes_other['r\u0017���1��az����']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"Y2hlY2tib3hlc19vdGhlcltCJ1kyaGxZMnRpYjNoZmIzUm9aWEpmYjNCMFh6TSdd\"][value=\"True\"][id=\"Y2hlY2tib3hlc19vdGhlcg_2\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "checkboxes_other['checkbox_other_opt_3']",
        "value": "True"
      },
      {
        "var": "checkboxes_other['r\u0017���1��az����']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"_ignore1\"][id=\"labelauty-294201\"][class=\"dafield1 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "checkboxes_other['None']",
        "value": ""
      }
    ],
    "type": "checkbox",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"cmFkaW9feWVzbm8\"][value=\"True\"][id=\"cmFkaW9feWVzbm8_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "radio_yesno",
        "value": "True"
      }
    ],
    "type": "radio",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"cmFkaW9feWVzbm8\"][value=\"False\"][id=\"cmFkaW9feWVzbm8_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "radio_yesno",
        "value": "False"
      }
    ],
    "type": "radio",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_1\"][id=\"cmFkaW9fb3RoZXI_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "radio_other",
        "value": "radio_other_opt_1"
      }
    ],
    "type": "radio",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_2\"][id=\"cmFkaW9fb3RoZXI_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "radio_other",
        "value": "radio_other_opt_2"
      }
    ],
    "type": "radio",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"cmFkaW9fb3RoZXI\"][value=\"radio_other_opt_3\"][id=\"cmFkaW9fb3RoZXI_2\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "radio_other",
        "value": "radio_other_opt_3"
      }
    ],
    "type": "radio",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"dGV4dF9pbnB1dA\"][id=\"dGV4dF9pbnB1dA\"][class=\"form-control\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "text_input",
        "value": ""
      }
    ],
    "type": "text",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion textarea[name=\"dGV4dGFyZWE\"][id=\"dGV4dGFyZWE\"][class=\"form-control\"]",
    "tag": "textarea",
    "guesses": [
      {
        "var": "textarea",
        "value": ""
      }
    ],
    "type": "",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion input[name=\"ZGF0ZV9pbnB1dA\"][id=\"ZGF0ZV9pbnB1dA\"][class=\"form-control\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "date_input",
        "value": ""
      }
    ],
    "type": "date",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion select[name=\"ZHJvcGRvd25fdGVzdA\"][id=\"ZHJvcGRvd25fdGVzdA\"][class=\"form-select dasingleselect\"]",
    "tag": "select",
    "guesses": [
      {
        "var": "dropdown_test",
        "value": ""
      },
      {
        "var": "dropdown_test",
        "value": ""
      },
      {
        "var": "dropdown_test",
        "value": "dropdown_opt_1"
      },
      {
        "var": "dropdown_test",
        "value": "v�)v�'��m�"
      },
      {
        "var": "dropdown_test",
        "value": "dropdown_opt_2"
      },
      {
        "var": "dropdown_test",
        "value": "v�)v�'��m�"
      },
      {
        "var": "dropdown_test",
        "value": "dropdown_opt_3"
      },
      {
        "var": "dropdown_test",
        "value": "v�)v�'��m�"
      }
    ],
    "type": "",
    "trigger": "direct_standard_fields"
  },
  {
    "selector": "#daquestion button[name=\"ZGlyZWN0X3N0YW5kYXJkX2ZpZWxkcw\"][value=\"True\"][class=\"btn btn-da btn-primary\"]",
    "tag": "button",
    "guesses": [
      {
        "var": "direct_standard_fields",
        "value": "True"
      }
    ],
    "type": "submit",
    "trigger": "direct_standard_fields"
  }
];  // ends fields.standard


// ============================
// Simple show if fields - no proxies
// ============================
fields.show_if = [
  {
    "selector": "#daquestion input[name=\"c2hvd18y\"][value=\"True\"][id=\"c2hvd18y\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "show_2",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzE\"][value=\"True\"][id=\"X2ZpZWxkXzE\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "show_3",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzI\"][value=\"True\"][id=\"X2ZpZWxkXzI\"][class=\"da-to-labelauty checkbox-icon dauncheckable labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_checkbox_yesno",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eCdd\"][value=\"True\"][id=\"X2ZpZWxkXzM_0\"][class=\"dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_checkboxes_other['showif_checkboxes_nota_1']",
        "value": "True"
      },
      {
        "var": "showif_checkboxes_other['�\u001a0��܅�$n�^��赯�']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eSdd\"][value=\"True\"][id=\"X2ZpZWxkXzM_1\"][class=\"dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_checkboxes_other['showif_checkboxes_nota_2']",
        "value": "True"
      },
      {
        "var": "showif_checkboxes_other['�\u001a0��܅�$n�^��赯�']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzNbQidjMmh2ZDJsbVgyTm9aV05yWW05NFpYTmZibTkwWVY4eidd\"][value=\"True\"][id=\"X2ZpZWxkXzM_2\"][class=\"dafield3 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_checkboxes_other['showif_checkboxes_nota_3']",
        "value": "True"
      },
      {
        "var": "showif_checkboxes_other['�\u001a0��܅�$n�^��赯�']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"_ignore3\"][id=\"labelauty-67439\"][class=\"dafield3 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_checkboxes_other['None']",
        "value": ""
      }
    ],
    "type": "checkbox",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzQ\"][value=\"True\"][id=\"X2ZpZWxkXzQ_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_yesnoradio",
        "value": "True"
      }
    ],
    "type": "radio",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzQ\"][value=\"False\"][id=\"X2ZpZWxkXzQ_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_yesnoradio",
        "value": "False"
      }
    ],
    "type": "radio",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_1\"][id=\"X2ZpZWxkXzU_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_radio_other",
        "value": "showif_radio_multi_1"
      }
    ],
    "type": "radio",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_2\"][id=\"X2ZpZWxkXzU_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_radio_other",
        "value": "showif_radio_multi_2"
      }
    ],
    "type": "radio",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzU\"][value=\"showif_radio_multi_3\"][id=\"X2ZpZWxkXzU_2\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_radio_other",
        "value": "showif_radio_multi_3"
      }
    ],
    "type": "radio",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion input[name=\"X2ZpZWxkXzY\"][id=\"X2ZpZWxkXzY\"][class=\"form-control\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "showif_text_input",
        "value": ""
      }
    ],
    "type": "text",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion textarea[name=\"X2ZpZWxkXzc\"][id=\"X2ZpZWxkXzc\"][class=\"form-control\"]",
    "tag": "textarea",
    "guesses": [
      {
        "var": "showif_textarea",
        "value": ""
      }
    ],
    "type": "",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion select[name=\"X2ZpZWxkXzg\"][id=\"X2ZpZWxkXzg\"][class=\"form-select dasingleselect\"]",
    "tag": "select",
    "guesses": [
      {
        "var": "showif_dropdown",
        "value": ""
      },
      {
        "var": "showif_dropdown",
        "value": ""
      },
      {
        "var": "showif_dropdown",
        "value": "showif_dropdown_1"
      },
      {
        "var": "showif_dropdown",
        "value": "�\u001a0��ݮ�]�\t�"
      },
      {
        "var": "showif_dropdown",
        "value": "showif_dropdown_2"
      },
      {
        "var": "showif_dropdown",
        "value": "�\u001a0��ݮ�]�\t�"
      },
      {
        "var": "showif_dropdown",
        "value": "showif_dropdown_3"
      },
      {
        "var": "showif_dropdown",
        "value": "�\u001a0��ݮ�]�\t�"
      },
      {
        "var": "showif_dropdown",
        "value": "showif_dropdown_4"
      },
      {
        "var": "showif_dropdown",
        "value": "�\u001a0��ݮ�]�\t�"
      }
    ],
    "type": "",
    "trigger": "direct_showifs"
  },
  {
    "selector": "#daquestion button[name=\"ZGlyZWN0X3Nob3dpZnM\"][value=\"True\"][class=\"btn btn-da btn-primary\"]",
    "tag": "button",
    "guesses": [
      {
        "var": "direct_showifs",
        "value": "True"
      }
    ],
    "type": "submit",
    "trigger": "direct_showifs"
  }
];  // ends fields.show_if


// ============================
// Buttons
// ============================
// `continue button field:`
fields.button_continue = [
    {
      "trigger": "button_continue",
      "selector": "#daquestion button[name=\"YnV0dG9uX2NvbnRpbnVl\"][value=\"True\"][class=\"btn btn-da btn-primary\"]",
      "tag": "button",
      "guesses": [
        { "var": "button_continue", "value": "True" }
      ],
      "type": "submit"
    }
  ];

// `yesnomaybe:`
// TODO: Shall we allow 'maybe' in the table as a value for `None`?
fields.buttons_yesnomaybe = [
  {
    "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"True\"][class=\"btn btn-primary btn-da\"]",
    "tag": "button",
    "guesses": [
      {
        "var": "buttons_yesnomaybe",
        "value": "True"
      }
    ],
    "type": "submit",
    "trigger": "buttons_yesnomaybe"
  },
  {
    "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"False\"][class=\"btn btn-secondary btn-da\"]",
    "tag": "button",
    "guesses": [
      {
        "var": "buttons_yesnomaybe",
        "value": "False"
      }
    ],
    "type": "submit",
    "trigger": "buttons_yesnomaybe"
  },
  {
    "selector": "#daquestion button[name=\"YnV0dG9uc195ZXNub21heWJl\"][value=\"None\"][class=\"btn btn-warning btn-da\"]",
    "tag": "button",
    "guesses": [
      {
        "var": "buttons_yesnomaybe",
        "value": "None"
      }
    ],
    "type": "submit",
    "trigger": "buttons_yesnomaybe"
  }
];

// Multiple choice 'continue' button fields that are not yesnomaybe
// `field:` and `buttons:`
fields.buttons_other = [
    {
      "trigger": "buttons_other",
      "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_1\"][class=\"btn btn-da btn-primary\"]",
      "tag": "button",
      "guesses": [
        { "var": "buttons_other", "value": "button_1" }
      ],
      "type": "submit"
    },
    {
      "trigger": "buttons_other",
      "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_2\"][class=\"btn btn-da btn-primary\"]",
      "tag": "button",
      "guesses": [
        { "var": "buttons_other", "value": "button_2" }
      ],
      "type": "submit"
    },
    {
      "trigger": "buttons_other",
      "selector": "#daquestion button[name=\"YnV0dG9uc19vdGhlcg\"][value=\"button_3\"][class=\"btn btn-da btn-primary\"]",
      "tag": "button",
      "guesses": [
        { "var": "buttons_other", "value": "button_3" }
      ],
      "type": "submit"
    }
  ];

// `field:` and `action buttons:`
fields.buttons_event_action = [
    {
      "trigger": "button_event_action",
      "selector": "#daquestion button[name=\"YnV0dG9uX2V2ZW50X2FjdGlvbg\"][value=\"True\"][class=\"btn btn-da btn-primary\"]",
      "tag": "button",
      "guesses": [
        { "var": "button_event_action", "value": "True" }
      ],
      "type": "submit"
    },
    {
      "trigger": "button_event_action",
      "selector": "#daquestion a[class=\"btn btn-primary btn-da daquestionactionbutton danonsubmit\"][data-linknum=\"1\"]",
      "tag": "a",
      "guesses": [
        { "var": "end", "value": "" }
      ],
      "type": ""
    }
  ];


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
fields.proxies_xi = [
  {
    "selector": "#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"][id=\"eFtpXS5uYW1lLmZpcnN0\"][class=\"form-control\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "x[i].name.first",
        "value": ""
      }
    ],
    "type": "text",
    "trigger": "proxy_list[0].name.first"
  },
  {
    "selector": "#daquestion button[class=\"btn btn-da btn-primary\"]",
    "tag": "button",
    "guesses": [],
    "type": "submit",
    "trigger": "proxy_list[0].name.first"
  }
];

// Multiple proxies by the same name are in the story table (because of a loop)
// Second loop (second page where this question is asked)
// x[i].name.first
fields.proxies_multi = [
  {
    "selector": "#daquestion input[name=\"eFtpXS5uYW1lLmZpcnN0\"][id=\"eFtpXS5uYW1lLmZpcnN0\"][class=\"form-control\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "x[i].name.first",
        "value": ""
      }
    ],
    "type": "text",
    "trigger": "proxy_list[1].name.first"
  },
  {
    "selector": "#daquestion button[class=\"btn btn-da btn-primary\"]",
    "tag": "button",
    "guesses": [],
    "type": "submit",
    "trigger": "proxy_list[1].name.first"
  }
];


// ============================
// Signature
// ============================
// Signature page continue buttons are contained in a different DOM structure than regular ones
// Also, there's an additional hidden continue button on the page with similar selectors
fields.signature = [
    {
      "trigger": "signature_1",
      "selector": "#daquestion canvas",
      "tag": "canvas",
      "guesses": [
        {
          "var": "signature_1",
          "value": "/sign",
        }
      ],
      "type": ""
    },
    
  ];


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
// ```
// field: favorite_fruit
// choices:
//   - Apple
//   - Orange
// ```
fields.choices = [
  {
    "selector": "#daquestion input[name=\"ZmllbGRfYW5kX2Nob2ljZXM\"][value=\"Choice 1\"][id=\"ZmllbGRfYW5kX2Nob2ljZXM_0\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "field_and_choices",
        "value": "Choice 1"
      }
    ],
    "type": "radio",
    "trigger": "field_and_choices"
  },
  {
    "selector": "#daquestion input[name=\"ZmllbGRfYW5kX2Nob2ljZXM\"][value=\"Choice 2\"][id=\"ZmllbGRfYW5kX2Nob2ljZXM_1\"][class=\"da-to-labelauty labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "field_and_choices",
        "value": "Choice 2"
      }
    ],
    "type": "radio",
    "trigger": "field_and_choices"
  },
  {
    "selector": "#daquestion button[class=\"btn btn-da btn-primary\"]",
    "tag": "button",
    "guesses": [],
    "type": "submit",
    "trigger": "field_and_choices"
  }
];


// ============================
// dropdowns created with objects
// ============================
// ```
// - Something: some_var
//   datatype: object
//   choices:
//     - obj1
//     - obj2
// ```
fields.object_dropdown = [
  {
    "selector": "#daquestion select[name=\"b2JqZWN0X2Ryb3Bkb3du\"][id=\"b2JqZWN0X2Ryb3Bkb3du\"][class=\"form-select dasingleselect daobject\"]",
    "tag": "select",
    "guesses": [
      {
        "var": "object_dropdown",
        "value": ""
      },
      {
        "var": "object_dropdown",
        "value": ""
      },
      {
        "var": "object_dropdown",
        "value": "b2JqX29wdF8x"
      },
      {
        "var": "object_dropdown",
        "value": "obj_opt_1"
      },
      {
        "var": "object_dropdown",
        "value": "b2JqX29wdF8y"
      },
      {
        "var": "object_dropdown",
        "value": "obj_opt_2"
      },
      {
        "var": "object_dropdown",
        "value": "b2JqX29wdF8z"
      },
      {
        "var": "object_dropdown",
        "value": "obj_opt_3"
      }
    ],
    "type": "",
    "trigger": "object_dropdown"
  },
  {
    "selector": "#daquestion button[class=\"btn btn-da btn-primary\"]",
    "tag": "button",
    "guesses": [],
    "type": "submit",
    "trigger": "object_dropdown"
  }
];


// ============================
// mixed quotes
// ============================
fields.mixed_quotes = [
  {
    "selector": "#daquestion input[name=\"c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXVtCJ2MzRmZiMjVsJ10\"][value=\"True\"][id=\"c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXQ_0\"][class=\"dafield0 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "single_quote_dict['single_quote_key']['sq_one']",
        "value": "True"
      },
      {
        "var": "single_quote_dict['single_quote_key']['���']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "double_quote_dict['double_quote_key']"
  },
  {
    "selector": "#daquestion input[name=\"c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXVtCJ2MzRmZkSGR2J10\"][value=\"True\"][id=\"c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXQ_1\"][class=\"dafield0 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "single_quote_dict['single_quote_key']['sq_two']",
        "value": "True"
      },
      {
        "var": "single_quote_dict['single_quote_key']['����']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "double_quote_dict['double_quote_key']"
  },
  {
    "selector": "#daquestion input[name=\"c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXVtCJ2MzRmZkR2h5WldVJ10\"][value=\"True\"][id=\"c2luZ2xlX3F1b3RlX2RpY3RbJ3NpbmdsZV9xdW90ZV9rZXknXQ_2\"][class=\"dafield0 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "single_quote_dict['single_quote_key']['sq_three']",
        "value": "True"
      },
      {
        "var": "single_quote_dict['single_quote_key']['��톷�']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "double_quote_dict['double_quote_key']"
  },
  {
    "selector": "#daquestion input[name=\"_ignore0\"][id=\"labelauty-647679\"][class=\"dafield0 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "single_quote_dict['single_quote_key']['None']",
        "value": ""
      }
    ],
    "type": "checkbox",
    "trigger": "double_quote_dict['double_quote_key']"
  },
  {
    "selector": "#daquestion input[name=\"ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXVtCJ1pIRmZiMjVsJ10\"][value=\"True\"][id=\"ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXQ_0\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "double_quote_dict[\"double_quote_key\"]['dq_one']",
        "value": "True"
      },
      {
        "var": "double_quote_dict[\"double_quote_key\"]['v��']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "double_quote_dict['double_quote_key']"
  },
  {
    "selector": "#daquestion input[name=\"ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXVtCJ1pIRmZkSGR2J10\"][value=\"True\"][id=\"ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXQ_1\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "double_quote_dict[\"double_quote_key\"]['dq_two']",
        "value": "True"
      },
      {
        "var": "double_quote_dict[\"double_quote_key\"]['v���']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "double_quote_dict['double_quote_key']"
  },
  {
    "selector": "#daquestion input[name=\"ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXVtCJ1pIRmZkR2h5WldVJ10\"][value=\"True\"][id=\"ZG91YmxlX3F1b3RlX2RpY3RbImRvdWJsZV9xdW90ZV9rZXkiXQ_2\"][class=\"dafield1 danon-nota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "double_quote_dict[\"double_quote_key\"]['dq_three']",
        "value": "True"
      },
      {
        "var": "double_quote_dict[\"double_quote_key\"]['v�톷�']",
        "value": "True"
      }
    ],
    "type": "checkbox",
    "trigger": "double_quote_dict['double_quote_key']"
  },
  {
    "selector": "#daquestion input[name=\"_ignore1\"][id=\"labelauty-382460\"][class=\"dafield1 danota-checkbox da-to-labelauty checkbox-icon labelauty da-active-invisible dafullwidth\"]",
    "tag": "input",
    "guesses": [
      {
        "var": "double_quote_dict[\"double_quote_key\"]['None']",
        "value": ""
      }
    ],
    "type": "checkbox",
    "trigger": "double_quote_dict['double_quote_key']"
  },
  {
    "selector": "#daquestion button[class=\"btn btn-da btn-primary\"]",
    "tag": "button",
    "guesses": [],
    "type": "submit",
    "trigger": "double_quote_dict['double_quote_key']"
  }
];


module.exports = fields;
