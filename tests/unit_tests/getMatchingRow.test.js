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
