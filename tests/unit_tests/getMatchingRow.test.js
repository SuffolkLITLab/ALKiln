const chai = require('chai');
const expect = chai.expect;


const tables = require('./tables.fixtures.js');
const page_data = require('./page_data.fixtures.js');
const matches = require('./matches.fixtures.js');
const scope = require('../../lib/scope.js');
const getMatchingRow = scope.getMatchingRow;


// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
it("matches the right table and field rows for standard fields", async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.standard, story_table: tables.standard });
  expect( result ).to.deep.equal( matches.standard );
});


// ============================
// Simple show if fields - no proxies
// ============================
it("matches the right table and field rows for simple show if fields", async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.show_if, story_table: tables.show_if });
  expect( result ).to.deep.equal( matches.show_if );
});


// ============================
// Buttons
// ============================
// `continue button field:`
it("matches the right table and field rows for one continue button", async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.button_continue, story_table: tables.button_continue });
  expect( result ).to.deep.equal( matches.button_continue );
});

// `yesnomaybe:`
it("matches the right table and field rows for yesnomaybe buttons", async function() {
  let result1 = await getMatchingRow( scope, { page_data: page_data.buttons_yesnomaybe, story_table: tables.buttons_yesnomaybe_yes });
  expect( result1 ).to.deep.equal( matches.buttons_yesnomaybe_yes );
  
  let result2 = await getMatchingRow( scope, { page_data: page_data.buttons_yesnomaybe, story_table: tables.buttons_yesnomaybe_no });
  expect( result2 ).to.deep.equal( matches.buttons_yesnomaybe_no );
  
  let result3 = await getMatchingRow( scope, { page_data: page_data.buttons_yesnomaybe, story_table: tables.buttons_yesnomaybe_none });
  expect( result3 ).to.deep.equal( matches.buttons_yesnomaybe_none );
});

// `field:` and `buttons:`
it("matches the right table and field rows for other mutiple choice continue buttons", async function() {
  let result1 = await getMatchingRow( scope, { page_data: page_data.buttons_other, story_table: tables.buttons_other_1 });
  expect( result1 ).to.deep.equal( matches.buttons_other_1 );
  
  let result2 = await getMatchingRow( scope, { page_data: page_data.buttons_other, story_table: tables.buttons_other_2 });
  expect( result2 ).to.deep.equal( matches.buttons_other_2 );
  
  let result3 = await getMatchingRow( scope, { page_data: page_data.buttons_other, story_table: tables.buttons_other_3 });
  expect( result3 ).to.deep.equal( matches.buttons_other_3 );
});

// `field:` and `action buttons:`
it(`matches the right table and field rows for one continue button`, async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.buttons_event_action, story_table: tables.buttons_event_action });
  expect( result ).to.deep.equal( matches.buttons_event_action );
});


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
it(`matches the right table and field rows for a multi-proxy name (x[i])`, async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.proxies_xi, story_table: tables.proxies_xi });
  expect( result ).to.deep.equal( matches.proxies_xi );
});

// your_past_benefits[i].still_receiving
// your_past_benefits['State Veterans Benefits'].still_receiving
// Non-match comes after a match
it(`matches the right table and field rows for a proxy name when a non-match comes after a match`, async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.proxies_non_match, story_table: tables.proxies_non_match });
  expect( result ).to.deep.equal( matches.proxies_non_match );
});

// Proxy vars used on a page with a mixture of fields created by
// `code:` and normal fields
// - code: children[i].name_fields()
// - Birthdate: children[i].birthdate
it(`matches the right table and field rows for a proxy name when using normal fields and those created with \`code\` `, async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.proxies_code_fields_mix, story_table: tables.proxies_code_fields_mix });
  expect( result ).to.deep.equal( matches.proxies_code_fields_mix );
  // console.log( JSON.stringify( result ) );
});


// ============================
// Signature
// ============================
it(`matches the right table and field rows for a signature field`, async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.signature, story_table: tables.signature });
  expect( result ).to.deep.equal( matches.signature );
});


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
it(`matches the right table and field rows for a 'choices:' specifier`, async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.choices, story_table: tables.choices });
  expect( result ).to.deep.equal( matches.choices );
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
it(`matches the right table and field rows for a 'choices:' specifier`, async function() {
  let result = await getMatchingRow( scope, { page_data: page_data.object_dropdown, story_table: tables.object_dropdown });
  expect( result ).to.deep.equal( matches.object_dropdown );
});

