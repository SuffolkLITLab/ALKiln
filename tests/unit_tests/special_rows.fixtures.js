let special_rows = {};

// Includes `.there_is_another` and `.target_nubmer`.
// In the future, maybe some false positives/negatives.

// ==============================
// `.target_number`
// ==============================
// 3 `users`, 2 `parents`

// 1st press (Yes)
special_rows.target_num_first_input = [
  {
    "original": { "var": "x.target_number", "value": "2", "trigger": "parents.there_is_another" },
    "var": "x.target_number", "value": "2", "trigger": "parents.there_is_another", times_used: 0,
  },
  {
    "original": { "var": "x.target_number", "value": "3", "trigger": "users.there_is_another" },
    "var": "x.target_number", "value": "3", "trigger": "users.there_is_another", times_used: 0,
  },
];
// Same as input plus`.there_is_another` rows
special_rows.target_num_first_output = [ ...special_rows.target_num_first_input ];
special_rows.target_num_first_output.push({
  "artificial": true, "source": special_rows.target_num_first_input[0],
  "var": "x.there_is_another", "value": "True", "trigger": "parents.there_is_another",
});
special_rows.target_num_first_output.push(  {
  "artificial": true, "source": special_rows.target_num_first_input[1],
  "var": "x.there_is_another", "value": "True", "trigger": "users.there_is_another",
});

// 2nd press (Yes and No)
special_rows.target_num_half_way_input = [
  {
    "original": { "var": "x.target_number", "value": "2", "trigger": "parents.there_is_another" },
    "var": "x.target_number", "value": "2", "trigger": "parents.there_is_another", times_used: 1,
  },
  {
    "original": { "var": "x.target_number", "value": "3", "trigger": "users.there_is_another" },
    "var": "x.target_number", "value": "3", "trigger": "users.there_is_another", times_used: 1,
  },
];
// Same as input plus `.there_is_another` rows
special_rows.target_num_half_way_output = [ ...special_rows.target_num_half_way_input ];
special_rows.target_num_half_way_output.push({
  "var": "x.there_is_another", "value": "False", "trigger": "parents.there_is_another",
  "artificial": true, "source": special_rows.target_num_half_way_input[0],
});
special_rows.target_num_half_way_output.push(  {
  "var": "x.there_is_another", "value": "True", "trigger": "users.there_is_another",
  "artificial": true, "source": special_rows.target_num_half_way_input[1],
});

// 3rd press (No and No)
special_rows.target_num_last_input = [
  {
    "original": { "var": "x.target_number", "value": "2", "trigger": "parents.there_is_another" },
    "var": "x.target_number", "value": "2", "trigger": "parents.there_is_another", times_used: 2,
  },
  {
    "original": { "var": "x.target_number", "value": "3", "trigger": "users.there_is_another" },
    "var": "x.target_number", "value": "3", "trigger": "users.there_is_another", times_used: 2,
  },
];
// Same as input plus `.there_is_another` rows
special_rows.target_num_last_output = [ ...special_rows.target_num_last_input ];
special_rows.target_num_last_output.push({
  "var": "x.there_is_another", "value": "False", "trigger": "parents.there_is_another",
  "artificial": true, "source": special_rows.target_num_last_input[0],
});
special_rows.target_num_last_output.push(  {
  "var": "x.there_is_another", "value": "False", "trigger": "users.there_is_another",
  "artificial": true, "source": special_rows.target_num_last_input[1],
});

// trigger uses `.target_number`
// devs are supposed to use the right `trigger` name, but they might not
special_rows.target_number_trigger_input = [
  {
    "original": { "var": "x.target_number", "value": "2", "trigger": "parents.target_number" },
    "var": "x.target_number", "value": "2", "trigger": "parents.target_number", times_used: 0,
  },
  {
    "original": { "var": "x.target_number", "value": "3", "trigger": "users.target_number" },
    "var": "x.target_number", "value": "3", "trigger": "users.target_number", times_used: 0,
  },
];
// Same as input plus`.there_is_another` rows
special_rows.target_number_trigger_output = [ ...special_rows.target_number_trigger_input ];
special_rows.target_number_trigger_output.push({
  "artificial": true, "source": special_rows.target_number_trigger_input[0],
  "var": "x.there_is_another", "value": "True", "trigger": "parents.there_is_another",
});
special_rows.target_number_trigger_output.push(  {
  "artificial": true, "source": special_rows.target_number_trigger_input[1],
  "var": "x.there_is_another", "value": "True", "trigger": "users.there_is_another",
});


module.exports = special_rows;
