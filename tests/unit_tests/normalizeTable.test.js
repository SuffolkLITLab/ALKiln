const chai = require('chai');
const expect = chai.expect;
// We need jest or something, right? To do fancy stuff.


const tables = require('./tables.fixtures.js');
const scope = require('../../lib/scope.js');
const normalizeTable = scope.normalizeTable;


// ============================
// Change old table into new table
// ============================
it("converts a table with original formatting into the current formatting", async function() {
  let result = await normalizeTable( scope, { var_data: tables.original_formatting });
  // console.log( result );
  expect( result ).to.deep.equal( tables.old_to_current_formatting );
});

it("does not change the formatting of a current table", async function() {
  let result = await normalizeTable( scope, { var_data: tables.current_formatting });
  // console.log( result );
  expect( result ).to.deep.equal( tables.current_to_current_formatting );
});
