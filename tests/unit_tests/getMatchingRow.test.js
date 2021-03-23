const chai = require('chai');
const expect = chai.expect;


const tables = require('./tables.fixtures.js');
const page_data = require('./page_data.fixtures.js');
const scope = require('../../lib/scope.js');
const getMatchingRow = scope.getMatchingRow;


// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
const run_standard_tests = async function () {

  let result = await getMatchingRow( scope, { page_data: page_data.standard , table: tables.standard });
  // expect( result ).to.equal( true );

};

run_standard_tests();
