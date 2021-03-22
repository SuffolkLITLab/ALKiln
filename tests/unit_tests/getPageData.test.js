const chai = require('chai');
const expect = chai.expect;
const cheerio = require('cheerio');
// We need jest or something, right? To do fancy stuff.

const html = require('./html.fixtures.js');
const page_data = require('./page_data.fixtures.js');
const scope = require('../../lib/scope.js');
const getPageData = scope.getPageData;


/* Test `scope.getPageData()`. Discuss: If we do a good job outlining
* what behvior the main tests cover, then we might not need to test
* each individual function separately.
* 
* NOTE: scope.getField should only be concerned with the stuff in `#daquestion`
*/

// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.

// TODO: Add notes detailing what behavior each test covers, including the
// behavior in sub-functions if they are not tested independently
it(`creates the right data for standard fields`, async function() {
  // 18 fields (03/15/21)
  let result = await getPageData( scope, { html: html.standard });
  expect( result ).to.deep.equal( page_data.standard );
});

it(`creates the right data for 'show if' fields`, async function() {
  // 18 fields (03/15/21)
  let result = await getPageData( scope, { html: html.show_if });
  expect( result ).to.deep.equal( page_data.show_if );
});


/*
Fields:
- Checkboxes (multiple choice)
  Story table: var names and chioces separately in the table, as well as value to set to true/false
  html: have var names and choice names both in their `input[name]` attribute.
- Checkboxes (yes/no)
  Story table: var name & set to. NO choice? Or maybe flip those last two? Which would be most useful?
  html: `name` = var_name, True/False for `value`
- Buttons (continue)
  Story table: is var_name all that's needed? Also need 'value'? Do these even matter at all?
  html: var name = `name`, value = 'True'
- Buttons (other/multi)
  Story table: var name, value (set_to) needed
  html: var name is `name` attr, value is `value` attr
- Buttons (yesnomaybe)
  Story table: var name, value (set_to) needed
  html: var name = name. `value` attr: True, False, None
- Radio object_radio
  html: `value` attr has no value, `name` attr is the var name

===============
Questions:
- Do var names contain doubly encoded stuff if they have
keys. e.g. `foo[B'encoded'][B'choice_encoded']`. I think not because
we whould have run into them by now. I think we've run into those and
they've been fine.
*/
