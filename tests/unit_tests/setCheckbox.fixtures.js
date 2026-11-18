let checkboxes = [
  {
    description: `leaves a selected checkbox selected without aria-checked`,
    checked: true,
    answer: `True`,
    aria_checked: null,
    expected_checked: true,
    expected_clicks: 0,
  },
  {
    description: `selects an unselected checkbox without aria-checked`,
    checked: false,
    answer: `True`,
    aria_checked: null,
    expected_checked: true,
    expected_clicks: 1,
  },
  {
    description: `clears a selected checkbox without aria-checked`,
    checked: true,
    answer: `False`,
    aria_checked: null,
    expected_checked: false,
    expected_clicks: 1,
  },
  {
    description: `leaves an unselected checkbox alone without aria-checked`,
    checked: false,
    answer: `False`,
    aria_checked: null,
    expected_checked: false,
    expected_clicks: 0,
  },
  {
    description: `uses the input state when aria-checked disagrees`,
    checked: true,
    answer: `True`,
    aria_checked: `false`,
    expected_checked: true,
    expected_clicks: 0,
  },
  {
    description: `uses aria-checked when the label has no associated input`,
    checked: false,
    answer: `True`,
    aria_checked: `false`,
    has_input: false,
    expected_checked: true,
    expected_clicks: 1,
  },
];

module.exports = checkboxes;
