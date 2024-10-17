const chai = require('chai');
const expect = chai.expect;
// We need jest or something, right? To do fancy stuff.


const tables = require('./tables.fixtures.js');
const scope = require('../../lib/scope.js');

const Log = require(`../../lib/utils/log.js`);
const log = new Log({ path: `_alkiln-misc_artifacts/normalize_table_${ Date.now() }`, context: `unit_tests normalizeTable` });
scope.set_log({ log_obj: log });

const normalizeTable = scope.normalizeTable;


// ============================
// Change old table into new table
// ============================
it("normalizes a table with standard formatting correctly", async function() {
  let result = await normalizeTable( scope, { var_data: tables.standard_formatting });
  expect( result ).to.deep.equal( tables.standard_normalized_formatting );
});

it("normalizes a table with missng `trigger` column correctly", async function() {
  let result = await normalizeTable( scope, { var_data: tables.missing_trigger });
  expect( result ).to.deep.equal( tables.missing_trigger_to_normalized_formatting );
});
