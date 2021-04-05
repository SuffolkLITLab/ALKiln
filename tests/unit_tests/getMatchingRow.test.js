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
  let result1 = await getMatchingRow( scope, { page_data: page_data.button_continue, story_table: tables.button_continue });
  expect( result1 ).to.deep.equal( matches.button_continue );
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
  let result1 = await getMatchingRow( scope, { page_data: page_data.buttons_event_action, story_table: tables.buttons_event_action });
  expect( result1 ).to.deep.equal( matches.buttons_event_action );
});


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
it(`matches the right table and field rows for a proxy input text field (x, i, j...)`, async function() {
  let result1 = await getMatchingRow( scope, { page_data: page_data.proxies, story_table: tables.proxies });
  expect( result1 ).to.deep.equal( matches.proxies );
});


// ============================
// Signature
// ============================
it(`matches the right table and field rows for a signature field`, async function() {
  let result1 = await getMatchingRow( scope, { page_data: page_data.signature, story_table: tables.signature });
  expect( result1 ).to.deep.equal( matches.signature );
});

