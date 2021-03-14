const cheerio = require('cheerio');
const chai = require('chai');
const expect = chai.expect;

const DOM = require('./getField.fixtures.js');
const scope = require('../../lib/scope.js');
const getField = scope.getField;


// Standard fields - no proxies, no showifs.
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
const standard = cheerio.load( DOM.standard );
let h1 = standard('h1', ).text();


console.log(h1);

const run_tests = async function () {

  let result = await getField( scope, { html:'', var_name:'', choice_name:'', set_to:'' });
  console.log( result );
  expect( result ).to.equal( true );

};

run_tests();
