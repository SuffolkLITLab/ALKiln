const chai = require('chai');
const expect = chai.expect;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
chai.use(deepEqualInAnyOrder);
// We need jest or something, right? To do fancy stuff.

const html = require('./html.fixtures.js');
const fields = require('./fields.fixtures.js');
const scope = require('../../lib/scope.js');
const getAllFields = scope.getAllFields;

chai.config.truncateThreshold = 0
// TODO: Rearrange fixtures so related fixtures are next to each other? e.g.
// buttons_yesno.html, buttons_yesno.fields, buttons_yesno.table, buttons_yesno.matches
// May make more files both to make and to import, but may be more useful
// for editing, maintaining, and clarity.


/* Test `scope.getAllFields()`. Discuss: If we do a good job outlining
* what behvior the main tests cover, then we might not need to test
* each individual function separately.
* 
* NOTE: scope.getField should only be concerned with the stuff in `#daquestion`
*/

// ============================
// Standard fields - no proxies
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.

// TODO: Add notes detailing what behavior each test covers, including the
// behavior in sub-functions if they are not tested independently
it(`creates the right data for standard fields`, async function() {
  // 18 fields (03/15/21)
  let result = await getAllFields( scope, { html: html.standard });
  // console.log(`=================\n${ JSON.stringify(fields.standard, null, 2) }`);
  // console.log(`-----------------\n${ JSON.stringify(result, null, 2) }`);
  expect( result ).to.deep.equalInAnyOrder( fields.standard );
});


// ============================
// Simple show if fields - no proxies
// ============================
it(`creates the right data for 'show if' fields`, async function() {
  let result = await getAllFields( scope, { html: html.show_if });
  expect( result ).to.deep.equalInAnyOrder( fields.show_if );
});


// ============================
// Buttons
// ============================
it(`creates the right data for one continue button`, async function() {
  // `continue button field:`
  let result = await getAllFields( scope, { html: html.button_continue });
  expect( result ).to.deep.equalInAnyOrder( fields.button_continue );
});

it(`creates the right data for yesnomaybe buttons`, async function() {
  // `yesnomaybe:`
  let result = await getAllFields( scope, { html: html.buttons_yesnomaybe });
  expect( result ).to.deep.equalInAnyOrder( fields.buttons_yesnomaybe );
});

it(`creates the right data for other mutiple choice continue buttons`, async function() {
  // `field:` and `buttons:`
  let result = await getAllFields( scope, { html: html.buttons_other });
  expect( result ).to.deep.equalInAnyOrder( fields.buttons_other );
});

it(`creates the right data for an event action button`, async function() {
  // `field:` and `action buttons:`
  let result = await getAllFields( scope, { html: html.buttons_event_action });
  expect( result ).to.deep.equalInAnyOrder( fields.buttons_event_action );
});


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first where i = 0
it(`creates the right data for x[i] target variable where "i" is 0`, async function() {
  let result = await getAllFields( scope, { html: html.proxies_xi });
  expect( result ).to.deep.equalInAnyOrder( fields.proxies_xi );
});

// x[i].name.first where i = 1
it(`creates the right data for x[i] target variable where "i" is 1`, async function() {
  let result = await getAllFields( scope, { html: html.proxies_multi });
  expect( result ).to.deep.equalInAnyOrder( fields.proxies_multi );
});


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first where i = 0
it(`creates the right data for x[i] proxy substitution where "i" is 0`, async function() {
  let result = await getAllFields( scope, { html: html.proxy_substitution_i_is_0 });
  expect( result ).to.deep.equalInAnyOrder( fields.proxy_substitution_i_is_0 );
});

// x[i].name.first where i = 1
it(`creates the right data for x[i] target variable where "i" is 1`, async function() {
  let result = await getAllFields( scope, { html: html.proxy_substitution_i_is_1 });
  expect( result ).to.deep.equalInAnyOrder( fields.proxy_substitution_i_is_1 );
});


// ============================
// Signature
// ============================
it(`creates the right data for a signature field`, async function() {
  // `field:` and `action buttons:`
  let result = await getAllFields( scope, { html: html.signature });
  expect( result ).to.deep.equalInAnyOrder( fields.signature );
});


// ============================
// `choices:`
// ============================
// ```
// field: favorite_fruit
// choices:
//   - Apple
//   - Orange
// ```
it(`creates the right data for a 'choices:' field`, async function() {
  let result = await getAllFields( scope, { html: html.choices });
  expect( result ).to.deep.equalInAnyOrder( fields.choices );
});


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
it(`creates the right data for a dropdown created with an object`, async function() {
  let result = await getAllFields( scope, { html: html.object_dropdown });
  expect( result ).to.deep.equalInAnyOrder(fields.object_dropdown );
});

// Ajax
it('creates the right data for an `ajax` combobox', async function() {
  let result = await getAllFields( scope, { html: html.ajax });
  expect( result ).to.deep.equalInAnyOrder(fields.ajax );
});

// ============================
// DOM for mixed quotes test in getMatchingRows.test.js
// ============================
// Why is this test useful? Or so someone might ask when looking at this closely.
// This file runs tests for `.getAllFields()`, but also helps us generate the
// objects in fields.fixtures.js for the `.getMatchingRows()` unit tests. The
// following test is mostly useful for that second purpose.
it(`creates the right data for a question whose table will have mixed quotes`, async function() {
  let result = await getAllFields( scope, { html: html.mixed_quotes });
  expect( result ).to.deep.equalInAnyOrder( fields.mixed_quotes );
});
