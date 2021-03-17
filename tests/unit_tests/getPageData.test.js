const chai = require('chai');
const expect = chai.expect;
// We need jest or something, right? To do fancy stuff.

const DOM = require('./getPageData.fixtures.js');
const scope = require('../../lib/scope.js');
const getPageData = scope.getPageData;


// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
const run_standard_tests = async function () {

  // 18 fields (03/15/21)
  let result = await getPageData( scope, { html: DOM.standard });
  // expect( result ).to.equal( true );

};

run_standard_tests();


/*
Fields:
- Checkboxes (multiple choice)
  Story table: var names and chioces separately in the table, as well as value to set to true/false
  DOM: have var names and choice names both in their `input[name]` attribute.
- Checkboxes (yes/no)
  Story table: var name & set to. NO choice? Or maybe flip those last two? Which would be most useful?
  DOM: `name` = var_name, True/False for `value`
- Buttons (continue)
  Story table: is var_name all that's needed? Also need 'value'? Do these even matter at all?
  DOM: var name = `name`, value = 'True'
- Buttons (other/multi)
  Story table: var name, value (set_to) needed
  DOM: var name is `name` attr, value is `value` attr
- Buttons (yesnomaybe)
  Story table: var name, value (set_to) needed
  DOM: var name = name. `value` attr: True, False, None
- Radio object_radio
  DOM: `value` attr has no value, `name` attr is the var name

===============
Questions:
- Do var names contain doubly encoded stuff if they have
keys. e.g. `foo[B'encoded'][B'choice_encoded']`. I think not because
we whould have run into them by now. I think we've run into those and
they've been fine.
*/
