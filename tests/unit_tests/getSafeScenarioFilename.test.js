
 const chai = require('chai');
 const expect = chai.expect;
 
 const names = require('./names.fixtures.js');
 const scope = require('../../lib/scope.js');
 const getSafeScenarioFilename = scope.getSafeScenarioFilename;

let test_filename = function ( expected_prefix, result ) {
  /* Test a name to see if it's valid output with a language defined. */
  let expected_name_regex_str = `^${ expected_prefix }-${ names.description }-\.{13}$`;
  if ( expected_prefix == `` ) {
   expected_name_regex_str = `^${ names.description }-\.{13}$`;
  }
  let regex = new RegExp( expected_name_regex_str );
 
  // Log more info if it failed
  let found_match = regex.test( result );
  if ( !found_match ) {
    console.log( 'regex:', regex.source );
    console.log( 'result:', result );
  }

  expect( found_match ).to.be.true;
 };
 

 describe(`When I use scope.getSafeScenarioFilename()`, function() {
 
   beforeEach(function() {
    scope.safe_scenario_name = names.description;
   });
 
   it(`preserves chinese characters`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.chinese_input });
    test_filename( names.chinese_output, result );
   });
 
   it(`adds an underscore when there is none`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.no_underscore_input });
    test_filename( names.no_underscore_output, result );
   });
 
   it(`preserves one underscore`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.one_underscore_input });
    test_filename( names.one_underscore_output, result );
   });
 
   it(`preserves two underscores`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.two_underscores_input });
    test_filename( names.two_underscores_output, result );
   });
 
   it(`does not add underscores to an empty string`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.empty_string_input });
    test_filename( names.empty_string_output, result );
   });
 
   it(`converts undefined to an empty string`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.undefined_input });
    test_filename( names.undefined_output, result );
   });
 
   it(`replaces invalid ':' with '_'`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.colon_input });
    test_filename( names.colon_output, result );
   });
 
   it(`replaces invalid '/' with '_'`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.slash_input });
    test_filename( names.slash_output, result );
   });
 
   it(`replaces two consecutive invalid chars with one '_' each`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.two_consecutive_invalid_input });
    test_filename( names.two_consecutive_invalid_output, result );
   });
 
   it(`does not replace numbers`, async function() {
     let result = await getSafeScenarioFilename( scope, { prefix: names.numerical_input });
    test_filename( names.numerical_output, result );
   });

  it(`handles a missing prefix`, async function() {
    let result = await getSafeScenarioFilename( scope );
    test_filename( ``, result );
  });

  it(`shortens ids over 20 chars long`, async function() {
    // Necessary to set id correctly
    scope.page = true;
    let old_examine = scope.examinePageID;
    scope.examinePageID = function () { return {id: names.long_id_input}; }
    let result = await getSafeScenarioFilename( scope );
    scope.examinePageID = old_examine;

    let regext_str = `^${ names.long_id_output }-${ scope.safe_scenario_name }-\.*$`;
    let regex = new RegExp( regext_str );

    // Log more info if it failed
    let found_match = regex.test( result );
    if ( !found_match ) {
      console.log( 'regex:', regex.source );
      console.log( 'result:', result );
    }
    expect( found_match ).to.be.true;
  });
 
 });
 