const chai = require('chai');
const expect = chai.expect;


const names = require('./names.fixtures.js');
const scope = require('../../lib/scope.js');
const getSafeScenarioFilename = scope.getSafeScenarioFilename;
// ${ prefix }${ scope.lang }${ Date.now() }_${ scope.safe_id }

let lang = names.language;
let id = names.safe_id;

let test_lang_output_is_correct = function ( expected_prefix, result ) {
  /* Test a name to see if it's valid output with a language defined. */
  let expected_name_regex_str = `^${ expected_prefix }${ lang }_\\d{13}_${ id }$`;
  let regex = new RegExp( expected_name_regex_str );
  expect( regex.test( result )).to.be.true;
};

let test_no_lang_output_is_correct = function ( expected_prefix, result ) {
  /* Test a name to see if it's valid output with an empty language. */
  let expected_name_regex_str = `^${ expected_prefix }\\d{13}_${ id }$`;
  let regex = new RegExp( expected_name_regex_str );
  expect( regex.test( result )).to.be.true;
};

describe(`When I use scope.getSafeScenarioFilename()`, function() {

  beforeEach(function() {
    scope.language = names.language;
    scope.safe_id = names.safe_id;
  });

  it(`preserves chinese characters`, async function() {
    let result = await getSafeScenarioFilename( scope, { prefix: names.chinese_input });
    test_lang_output_is_correct( names.chinese_output, result );
  });

  it(`adds an underscore when there is none`, async function() {
    let result = await getSafeScenarioFilename( scope, { prefix: names.no_underscore_input });
    test_lang_output_is_correct( names.no_underscore_output, result );
  });

  it(`preserves one underscore`, async function() {
    let result = await getSafeScenarioFilename( scope, { prefix: names.one_underscore_input });
    test_lang_output_is_correct( names.one_underscore_output, result );
  });

  it(`preserves two underscores`, async function() {
    let result = await getSafeScenarioFilename( scope, { prefix: names.two_underscores_input });
    test_lang_output_is_correct( names.two_underscores_output, result );
  });

  it(`does not add underscores to an empty string`, async function() {
    let result = await getSafeScenarioFilename( scope, { prefix: names.empty_string_input });
    test_lang_output_is_correct( names.empty_string_output, result );
  });

  it(`converts undefined to an empty string`, async function() {
    let result = await getSafeScenarioFilename( scope, { prefix: names.undefined_input });
    test_lang_output_is_correct( names.undefined_output, result );
  });

  it(`correctly excludes an empty string lang`, async function() {
    scope.language = ``;
    let result = await getSafeScenarioFilename( scope, { prefix: names.undefined_input });
    test_no_lang_output_is_correct( names.undefined_output, result );
  });

  it(`correctly excludes an undefined lang`, async function() {
    scope.language = undefined;
    let result = await getSafeScenarioFilename( scope, { prefix: names.one_underscore_input });
    test_no_lang_output_is_correct( names.one_underscore_output, result );
  });

});
