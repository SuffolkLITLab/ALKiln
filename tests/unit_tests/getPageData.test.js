const chai = require('chai');
const expect = chai.expect;
const cheerio = require('cheerio');
// We need jest or something, right? To do fancy stuff.

const html = require('./html.fixtures.js');
const page_data = require('./page_data.fixtures.js');
const scope = require('../../lib/scope.js');
const getPageData = scope.getPageData;
// TODO: Rearrange fixtures so related fixtures are next to each other? e.g.
// buttons_yesno.html, buttons_yesno.page_data, buttons_yesno.table, buttons_yesno.matches
// May make more files both to make and to import, but may be more useful
// for editing, maintaining, and clarity.


/* Test `scope.getPageData()`. Discuss: If we do a good job outlining
* what behvior the main tests cover, then we might not need to test
* each individual function separately.
* 
* NOTE: scope.getField should only be concerned with the stuff in `#daquestion`
*/

before(function () {
  scope.report = {};
  scope.safe_id = 'unit_tests';
});

// ============================
// Standard fields - no proxies
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.

// TODO: Add notes detailing what behavior each test covers, including the
// behavior in sub-functions if they are not tested independently
it(`creates the right data for standard fields`, async function() {
  // 18 fields (03/15/21)
  let result = await getPageData( scope, { html: html.standard });
  expect( result ).to.deep.equal( page_data.standard );
});


// ============================
// Simple show if fields - no proxies
// ============================
it(`creates the right data for 'show if' fields`, async function() {
  let result = await getPageData( scope, { html: html.show_if });
  expect( result ).to.deep.equal( page_data.show_if );
});


// ============================
// Buttons
// ============================
it(`creates the right data for one continue button`, async function() {
  // `continue button field:`
  let result = await getPageData( scope, { html: html.button_continue });
  expect( result ).to.deep.equal( page_data.button_continue );
});

it(`creates the right data for yesnomaybe buttons`, async function() {
  // `yesnomaybe:`
  let result = await getPageData( scope, { html: html.buttons_yesnomaybe });
  expect( result ).to.deep.equal( page_data.buttons_yesnomaybe );
});

it(`creates the right data for other mutiple choice continue buttons`, async function() {
  // `field:` and `buttons:`
  let result = await getPageData( scope, { html: html.buttons_other });
  expect( result ).to.deep.equal( page_data.buttons_other );
});

it(`creates the right data for an event action button`, async function() {
  // `field:` and `action buttons:`
  let result = await getPageData( scope, { html: html.buttons_event_action });
  expect( result ).to.deep.equal( page_data.buttons_event_action );
});


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
it(`creates the right data for a multi-proxy name (x[i])`, async function() {
  let result = await getPageData( scope, { html: html.proxies_xi });
  expect( result ).to.deep.equal( page_data.proxies_xi );
});

// your_past_benefits[i].still_receiving
// your_past_benefits['State Veterans Benefits'].still_receiving
it(`creates the right data for a proxy name when a non-match comes after a match`, async function() {
  let result = await getPageData( scope, { html: html.proxies_non_match });
  expect( result ).to.deep.equal( page_data.proxies_non_match );
});

// Proxy vars used on a page with a mixture of fields created by
// `code:` and normal fields
// - code: children[i].name_fields()
// - Birthdate: children[i].birthdate
it(`creates the right data for a proxy name when using normal fields and those created with \`code\` `, async function() {
  let result = await getPageData( scope, { html: html.proxies_code_fields_mix });
  expect( result ).to.deep.equal( page_data.proxies_code_fields_mix );
});


// ============================
// Signature
// ============================
it(`creates the right data for a signature field`, async function() {
  let result = await getPageData( scope, { html: html.signature });
  expect( result ).to.deep.equal( page_data.signature );
});


// ============================
// `choices:`
// ============================
it(`creates the right data for a 'choices:' field`, async function() {
  // `field:` and `choices:`
  let result = await getPageData( scope, { html: html.choices });
  expect( result ).to.deep.equal( page_data.choices );
});


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
it(`creates the right data for a 'choices:' field`, async function() {
  // `field:` and `choices:`
  let result = await getPageData( scope, { html: html.object_dropdown });
  expect( result ).to.deep.equal( page_data.object_dropdown );
  // console.log( JSON.stringify(result) );
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
