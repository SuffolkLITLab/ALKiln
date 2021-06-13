const chai = require('chai');
const expect = chai.expect;
// We need jest or something, right? To do fancy stuff.


const tables = require('./tables.fixtures.js');
const scope = require('../../lib/scope.js');
const normalizeTable = scope.normalizeTable;


// ============================
// Make sure tables of slightly different formats come out the same
// ============================
it("adds sought data when it's missing", async function() {
  let result = await normalizeTable( scope, { var_data: tables.missing_sought_col });
  expect( result ).to.deep.equal( tables.normalize_missing_sought_col );
});

it("does not change data when not needed", async function() {
  let result = await normalizeTable( scope, { var_data: tables.with_sought_col });
  expect( result ).to.deep.equal( tables.normalize_with_sought_col );
});
