const chai = require(`chai`);
const expect = chai.expect;

const constrained_random_tests = require(`../../../lib/utils/constrained_random_tests.js`);
const parse_file = constrained_random_tests.parse_file;
const fixtures = require(`./invalid.fixtures.js`);


const RANDOM_TABLE_PLACEHOLDER = fixtures.RANDOM_TABLE_PLACEHOLDER;
const TABLE_ROW_REGEX = /^(?!(?:.*\| var \| value \|))(.*\| .* \|)/gm;
const PLACEHOLDER_REGEX = new RegExp(`(${ RANDOM_TABLE_PLACEHOLDER }\n)+`, `g`);
function comparable_text( text ) {
  /** Splits files around the random table contents.
   *
   * We need to check that the contents of the file match the expected contents,
   *    but the table contains random values, so we need to discount the table.
   * */
  let with_placeholders = text.replace(
    TABLE_ROW_REGEX,
    RANDOM_TABLE_PLACEHOLDER
  );
  let with_reduced_placeholders = with_placeholders.replace(
    PLACEHOLDER_REGEX,
    `${ RANDOM_TABLE_PLACEHOLDER }\n`
  );
  return with_reduced_placeholders;
};


describe(`Constrained random answers parser, when given an invalid generator Scenario`, function () {

  // describe(`that has multiple constrained random answers Steps,`, function () {
  //   let fixture = fixtures.multiple_generator_Steps;
  //   let result = parse_file({ file_text: fixture.arg });
  //   // TODO: Expect an error Scenario
  //   it(`returns null`, function () {
  //     expect( result ).to.equal( fixture.expected );
  //   });
  // });

  // describe(`with an author asking for 3 tests when only 2 unique tests can exist`, function () {
  //   let fixture = fixtures.warnings.too_many_requested;
  //   let actual_string = parse_file({ file_text: fixture.arg });

  //   // it(`TODO: adds a warning about not being able to make that many tests`, function () {
  //   //   `Could only make _ unique tests out of the _ you asked for`
  //   // });

  //   it(`only makes 2 tests`, function () {
  //     let matches = actual_string.match( /^Scenario:/gm );
  //     expect( matches ).to.be.an(`array`);
  //     expect( matches.length ).to.equal( 2 );
  //   });

  //   let text_1_regex = new RegExp( fixture.find_2[0], `g`);
  //   let text_2_regex = new RegExp( fixture.find_2[1], `g`);
  //   describe(`both tests are unique from each other`, function () {

  //     it(`for ${ fixture.find_2[0] }`, function () {
  //       let matches = actual_string.match( text_1_regex );
  //       expect( matches ).to.be.an(`array`);
  //       expect( matches.length ).to.equal( 1 );
  //     })
  //     it(`for ${ fixture.find_2[1] }`, function () {
  //       let matches = actual_string.match( text_2_regex );
  //       expect( matches ).to.be.an(`array`);
  //       expect( matches.length ).to.equal( 1 );
  //     })
  //     it(`and all else to be standard`, function () {
  //       expect( comparable_text( actual_string )).to.equal( fixture.expected );
  //     })
      
  //   });

  // });

});


