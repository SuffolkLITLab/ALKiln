const chai = require('chai');
const expect = chai.expect;


const special_rows = require('./special_rows.fixtures.js');
const scope = require('../../lib/scope.js');
const ensureSpecialRows = scope.ensureSpecialRows;

// TODO: Add tests for reports

// ============================
// `.target_number`
// ============================
describe("For a `.target_number` === 3 story table row", async function() {
  it( `returns the right rows for the 1st \`.there_is_another\` question`, async function() {
    let result = await ensureSpecialRows( scope, { var_data: special_rows.target_num_first_input, from_table: true });
    expect( result ).to.deep.equal( special_rows.target_num_first_output );
  });
  it( `returns the right rows for the 2nd \`.there_is_another\` question`, async function() {
    let result = await ensureSpecialRows( scope, { var_data: special_rows.target_num_half_way_input, from_table: true });
    expect( result ).to.deep.equal( special_rows.target_num_half_way_output );
  });
  it( `returns the right rows for the 3rd \`.there_is_another\` question`, async function() {
    let result = await ensureSpecialRows( scope, { var_data: special_rows.target_num_last_input, from_table: true });
    expect( result ).to.deep.equal( special_rows.target_num_last_output );
  });
});

describe(`For a \`.target_number\` trigger column`, async function() {
  it( `it preserves the trigger`, async function() {
    let result = await ensureSpecialRows( scope, { var_data: special_rows.target_number_trigger_input, from_table: true });
    expect( result ).to.deep.equal( special_rows.target_number_trigger_output );
  });
});
