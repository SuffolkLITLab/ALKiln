const chai = require('chai');
const expect = chai.expect;
// We need jest or something, right? To do fancy stuff.

const html = require('./html.fixtures.js');
const fields = require('./fields.fixtures.js');
const scope = require('../../lib/scope.js');
const getAllFields = scope.getAllFields;
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
  expect( result ).to.deep.equal( fields.standard );
});


// ============================
// Simple show if fields - no proxies
// ============================
it(`creates the right data for 'show if' fields`, async function() {
  let result = await getAllFields( scope, { html: html.show_if });
  expect( result ).to.deep.equal( fields.show_if );
});


// ============================
// Buttons
// ============================
it(`creates the right data for one continue button`, async function() {
  // `continue button field:`
  let result = await getAllFields( scope, { html: html.button_continue });
  expect( result ).to.deep.equal( fields.button_continue );
});

it(`creates the right data for yesnomaybe buttons`, async function() {
  // `yesnomaybe:`
  let result = await getAllFields( scope, { html: html.buttons_yesnomaybe });
  expect( result ).to.deep.equal( fields.buttons_yesnomaybe );
});

it(`creates the right data for other mutiple choice continue buttons`, async function() {
  // `field:` and `buttons:`
  let result = await getAllFields( scope, { html: html.buttons_other });
  expect( result ).to.deep.equal( fields.buttons_other );
});

it(`creates the right data for an event action button`, async function() {
  // `field:` and `action buttons:`
  let result = await getAllFields( scope, { html: html.buttons_event_action });
  expect( result ).to.deep.equal( fields.buttons_event_action );
});


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
it(`creates the right data for a multi-proxy name (x[i])`, async function() {
  let result = await getAllFields( scope, { html: html.proxies_xi });
  expect( result ).to.deep.equal( fields.proxies_xi );
});

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
it(`creates the right data for a multi-proxy name (x[i]) again for consistency`, async function() {
  // same data as `proxies_xi`, but have this here for consistency
  let result = await getAllFields( scope, { html: html.proxies_multi });
  expect( result ).to.deep.equal( fields.proxies_multi );
});


// ============================
// Signature
// ============================
it(`creates the right data for a signature field`, async function() {
  // `field:` and `action buttons:`
  let result = await getAllFields( scope, { html: html.signature });
  expect( result ).to.deep.equal( fields.signature );
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
  expect( result ).to.deep.equal( fields.choices );
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
  expect( result ).to.deep.equal( fields.object_dropdown );
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
  expect( result ).to.deep.equal( fields.mixed_quotes );
});
