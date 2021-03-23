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

it("matches the right table and field rows for simple show if fields", async function() {
  
  let result = await getMatchingRow( scope, { page_data: page_data.show_if, story_table: tables.show_if });
  expect( result ).to.deep.equal( matches.show_if );

});


it("matches the right table and field rows for yesnomaybe buttons", async function() {
  
  let result1 = await getMatchingRow( scope, { page_data: page_data.buttons_yesnomaybe, story_table: tables.buttons_yesnomaybe_yes });
  expect( result1 ).to.deep.equal( matches.buttons_yesnomaybe_yes );
  
  let result2 = await getMatchingRow( scope, { page_data: page_data.buttons_yesnomaybe, story_table: tables.buttons_yesnomaybe_no });
  expect( result2 ).to.deep.equal( matches.buttons_yesnomaybe_no );
  
  let result3 = await getMatchingRow( scope, { page_data: page_data.buttons_yesnomaybe, story_table: tables.buttons_yesnomaybe_none });
  expect( result3 ).to.deep.equal( matches.buttons_yesnomaybe_none );

});


it("matches the right table and field rows for yesnomaybe buttons", async function() {
  
  let result1 = await getMatchingRow( scope, { page_data: page_data.buttons_other, story_table: tables.buttons_other_1 });
  expect( result1 ).to.deep.equal( matches.buttons_other_1 );
  
  let result2 = await getMatchingRow( scope, { page_data: page_data.buttons_other, story_table: tables.buttons_other_2 });
  expect( result2 ).to.deep.equal( matches.buttons_other_2 );
  
  let result3 = await getMatchingRow( scope, { page_data: page_data.buttons_other, story_table: tables.buttons_other_3 });
  expect( result3 ).to.deep.equal( matches.buttons_other_3 );

});



