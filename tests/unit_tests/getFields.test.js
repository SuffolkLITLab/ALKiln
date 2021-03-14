const chai = require('chai');
const expect = chai.expect;
// We need jest or something, right? To do fancy stuff.

const DOM = require('./getFields.fixtures.js');
const scope = require('../../lib/scope.js');
const getFields = scope.getFields;


// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
const run_standard_tests = async function () {

  let result = await getFields( scope, { html: DOM.standard });
  // expect( result ).to.equal( true );

};

run_standard_tests();
