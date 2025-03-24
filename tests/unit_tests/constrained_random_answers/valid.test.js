const chai = require(`chai`);
const expect = chai.expect;

/**
 * Discuss:
 * - Test making more than one file?
 * - Test deleting the files from the sources folder?
 * - Test having multiple sources folders? (overdue)
 * - Allow single quotes?
 * */

const TestGenerator = require(`../../../lib/utils/constrained_random_tests.js`);
// const parse_file = new TestGenerator.parse_file;
const Log = require(`../../../lib/utils/Log.js`);
const fixtures = require(`./valid.fixtures.js`);


const RANDOM_TABLE_PLACEHOLDER = fixtures.RANDOM_TABLE_PLACEHOLDER;
const TABLE_ROW_REGEX = /^(?!(?:.*\| var \| value \|))(.*\| .* \|)/gm;
const TABLE_PLACEHOLDER_REGEX = new RegExp(`(${ RANDOM_TABLE_PLACEHOLDER }\n)+`, `g`);

const WARNING_PLACEHOLDER = fixtures.WARNING_PLACEHOLDER;
const WARNING_MSG_REGEX = /(ALK\d{4} )(.*\d{4}-\d\d-\d\d \d\d:\d\d:\d\dUTC.*(?:\n.+)*)(\n\s\s\s\s---+)/g;
function comparable_text( text ) {
  /** Replaces unimportant dynamic strings with placeholder strings
   *
   * We need to check that the contents of the file match the expected contents,
   *    but the table contains random values, so we need to discount the table.
   *    Same for warning timestamps and message text.
   * */
  let with_placeholders = text.replace(
    TABLE_ROW_REGEX,
    RANDOM_TABLE_PLACEHOLDER
  );
  // Collapse multiple consecutive placeholders into one placeholder
  let with_reduced_placeholders = with_placeholders.replace(
    TABLE_PLACEHOLDER_REGEX,
    `${ RANDOM_TABLE_PLACEHOLDER }\n`
  );

  let without_warnings = with_reduced_placeholders.replace(
    WARNING_MSG_REGEX, `$1${ WARNING_PLACEHOLDER }$3`
  );

  return without_warnings;
};


function get_log_codes({ logger }) {
  /** Returns a list of ALKiln codes from arguments sent to a Log instance
   * 
   * @params {object} obj - Named arguments
   * @params {Log} obj.logger - An instance of Log
   * @params {object} obj.logger.opts - Options passed to the Log instance
   * @params {str} obj.logger.opts.code - ALK#### formatted log code
   * @params {[str]} obj.logger.logs - Additional messages to be logged
   * 
   * @returns {[str]} - List of ALKiln log codes in the collection of logs
   * */
  let codes = [];

  for ( let record of logger.internal_tests_records ) {
    codes.push( record.opts.code );
  }

  return codes;
}


/** Variables that will change their values for each `it()` */
const logger = new Log({ context: `valid generators unit tests` });
let fixture = null;
let new_contents = null;
let errors = null;
let actual = null;
let comparable = null;
let passes = null;
function mutate_globals_with({ testing_vals, do_compare = false }) {
  /** Set up values for parsing, parse, record values. Mutates in-scope
   *    variables in a way that helps chaijs (mocha really) get the right
   *    values to the right places.
   * 
   * @params {object} testing_vals - Arguments to pass to the function and
   *     expected values
   * 
   * @returns {undefined}
   * */
  // Resets logger
  logger.internal_tests_records = [];

  // Fresh namespace
  let generator = new TestGenerator();
  // Mutates `fixture`
  fixture = testing_vals;
  // Mutates `new_contents` and `error`
  ( { new_contents, errors } = generator.parse_file({
      file_text: fixture.arg,
      generator_path: `used_in_warning_logs`,
      logger
    }) );

  if ( do_compare ) {
    // Mutates `comparable`
    comparable = comparable_text( new_contents );
    // Mutates `passes`
    passes = comparable === fixture.expected;
  }
};


describe(`Constrained random answers parser, when given a valid generator Scenario`, function () {

  // describe(`that is simple and normal`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.simple }); });

  //   let outer = fixtures.simple;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });

  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`generates 2 Scenarios`, function() {
  //     let num_Scenarios = new_contents.split(`Scenario:`).length - 1;
  //     expect( 2 ).to.equal( num_Scenarios, `Wrong # of Scenarios: ${ num_Scenarios }/2` );
  //   });

  //   it(`has the right non-random text`, function () {
  //     expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
  //   });

  // });

  describe(`that has "constrain" and "generat" minimal Steps text`, function() {
    before(function () { mutate_globals_with({ testing_vals: fixtures.generat }); });

    let outer = fixtures.generat;
    it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
    });
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });
    // it(`has the right non-random text`, function () {
    //   expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
    // });
  });

  describe(`that has "constrain" and "rand" minimal Steps text`, function() {
    before(function () { mutate_globals_with({ testing_vals: fixtures.rand }); });

    let outer = fixtures.rand;
    it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
    });
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });
    // it(`has the right non-random text`, function () {
    //   expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
    // });
  });

  describe(`that has "constrain" and "make" minimal Steps text`, function() {
    before(function () { mutate_globals_with({ testing_vals: fixtures.make }); });

    let outer = fixtures.make;
    it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
    });
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });
    // it(`has the right non-random text`, function () {
    //   expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
    // });
  });

  describe(`that has "constrain" and "made" minimal Steps text`, function() {
    before(function () { mutate_globals_with({ testing_vals: fixtures.made }); });

    let outer = fixtures.made;
    it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
    });
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });
    // it(`has the right non-random text`, function () {
    //   expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
    // });
  });

  // describe(`that has various complexities with 2 generators and 3 generated`, function () {

  //   before(function () { mutate_globals_with({
  //     testing_vals: fixtures.complex, do_compare: true
  //   }); });

  //   let outer = fixtures.complex;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`generates 3 Scenarios (skipping the extra appearance of "Scenario:")`, function() {
  //     let num_Scenarios = new_contents.split(`Scenario:`).length - 2;
  //     expect( 3 ).to.equal( num_Scenarios, `Wrong # of Scenarios: ${ num_Scenarios }/2` );
  //   });

  //   it(`retains the text after the Feature`, function () {
  //     expect( passes, `Incorrect generated text. See below.` ).to.be.true
  //   });
  //   it(`retains the Step after the table`, function () {
  //     expect( passes, `Incorrect generated text. See below.` ).to.be.true
  //   });
  //   it(`retains the comments before the table`, function () {
  //     expect( passes, `Incorrect generated text. See below.` ).to.be.true
  //   });
  //   it(`retains the comments after the table`, function () {
  //     expect( passes, `Incorrect generated text. See below.` ).to.be.true
  //   });
  //   it(`retains and ignores a commented extraneous generator Step`, function () {
  //     expect( passes, `Incorrect generated text. See below.` ).to.be.true
  //   });
  //   it(`loses the comments in the table`, function () {
  //     // Make sure text comparison gets logged once
  //     expect( comparable ).to.equal( fixture.expected );
  //   });

  // });  // ends complex

  // describe(`with an author's tags`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.tags }); });

  //   let outer = fixtures.tags;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`keeps those tags`, function () {
  //     expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
  //   });
  // });

  // describe(`with author's tags on line 2`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.weird_spacing.tags_line_2 }); });

  //   let outer = fixtures.weird_spacing.tags_line_2;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`keeps those tags and spacing`, function () {
  //     expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
  //   });
  // });

  // describe(`with weird spacing in author's tags`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.weird_spacing.tags }); });

  //   let outer = fixtures.weird_spacing.tags;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`keeps that spacing`, function () {
  //     expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
  //   });
  // });

  // describe(`with weird indentations`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.weird_spacing.indents }); });

  //   let outer = fixtures.weird_spacing.indents;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`keeps those indentation levels`, function () {
  //     expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
  //   });
  // });

  // describe(`with no spacing in choices`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.weird_spacing.choices }); });

  //   let outer = fixtures.weird_spacing.choices;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`gets a choice correctly`, function () {
  //     expect( new_contents ).to.match( fixture.find_1 );
  //   });
  // });

  // describe(`with 3 columns`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.columns_3 }); });

  //   let outer = fixtures.columns_3;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`adds a "trigger" column with those values`, function () {
  //     expect( new_contents ).to.equal( fixture.expected );
  //   });
  // });

  // describe(`with 4 columns`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.columns_4 }); });

  //   let outer = fixtures.columns_4;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`ignores the 4th column`, function () {
  //     expect( new_contents ).to.equal( fixture.expected );
  //   });
  // });

  // describe(`with comments before and in the table`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.rows_comments }); });

  //   let outer = fixtures.rows_comments;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`removes the comments`, function () {
  //     expect( comparable_text( new_contents )).to.equal( fixture.expected );
  //   });
  // });

  // describe(`with a comment after the table`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.comment_after_last_row }); });

  //   let outer = fixtures.comment_after_last_row;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`keeps and repeats the comment`, function () {
  //     expect( comparable_text( new_contents )).to.equal( fixture.expected );
  //   });
  // });

  // describe(`with empty rows before and in the table`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.rows_empty }); });

  //   let outer = fixtures.rows_empty;
  //   it(`has these exact log codes: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`removes the empty rows`, function () {
  //     expect( comparable_text( new_contents )).to.equal( fixture.expected );
  //   });
  // });

  describe(`with no number value`, function () {

    before(function () { mutate_globals_with({ testing_vals: fixtures.warnings.no_number }); });

    let outer = fixtures.warnings.no_number;
    it(`has these exact log codes with warnings: ${ JSON.stringify( outer.included_log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
    });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    // it(`generates 1 test`, function () {
    //   expect( comparable_text( new_contents )).to.equal( fixture.expected );
    // });
  });

  describe(`with too many number values in one Step`, function () {

    before(function () { mutate_globals_with({ testing_vals: fixtures.warnings.multiple_numbers }); });

    let outer = fixtures.warnings.multiple_numbers;
    it(`has these exact log codes with warnings: ${ JSON.stringify( outer.included_log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
    });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    // it(`uses the last number given`, function () {
    //   expect( comparable_text( new_contents )).to.equal( fixture.expected );
    // });
  });

  describe(`with too many "number" Steps in one Scenario`, function () {

    before(function () { mutate_globals_with({ testing_vals: fixtures.warnings.multiple_number_Steps }); });

    let outer = fixtures.warnings.multiple_number_Steps;
    it(`has these exact log codes with warnings: ${ JSON.stringify( outer.included_log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
    });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    // it(`uses the last Step given`, function () {
    //   expect( comparable_text( new_contents )).to.equal( fixture.expected );
    // });
  });

  describe(`with 2 "number" Steps in one Scenario and both have multiple numbers`, function () {

    before(function () { mutate_globals_with({ testing_vals: fixtures.warnings.multiple_number_Steps_and_numbers }); });

    let outer = fixtures.warnings.multiple_number_Steps_and_numbers;
    it(`has these exact log codes with warnings: ${ JSON.stringify( outer.included_log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
    });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    // it(`uses the last Step and number given`, function () {
    //   expect( comparable_text( new_contents )).to.equal( fixture.expected );
    // });
  });

  // describe(`that asks for 3 tests when only 2 unique tests are possible`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.warnings.fewer_unique_than_requested }); });

  //   let outer = fixtures.warnings.fewer_unique_than_requested;
  //   it(`has these exact log codes with warnings: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.have.all.members( fixture.included_log_codes );
  //   });
    
  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`only makes 2 tests`, function () {
  //     expect( comparable_text( new_contents )).to.equal( fixture.expected );
  //   });
    
  //   it(`makes 2 unique tests`, function () {
  //     for ( let to_find_1_of of fixture.find_1_of ) {
  //       let text_regex = new RegExp( to_find_1_of, `g` );
  //         let matches = new_contents.match( text_regex );
  //         expect( matches ).to.be.an(`array`);
  //         expect( matches.length ).to.equal( 1 );
  //     }
  //   });
  // });

  // describe(`that has a blank var value in a generator column`, function () {

  //   before(function () { mutate_globals_with({ testing_vals: fixtures.empty_string_value }); });

  //   let outer = fixtures.empty_string_value;
  //   it(`includes at least one of all these log codes with warnings: ${ JSON.stringify( outer.included_log_codes )}`, function () {
  //     expect( get_log_codes({ logger }) ).to.include.members( fixture.included_log_codes );
  //   });

  //   it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

  //   it(`has the right non-random text`, function () {
  //     expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
  //   });

  //   describe(`the "" value does get its own Scenario`, function () {

  //     for ( let to_find_1_of of outer.find_1_of ) {
  //       let text_regex = new RegExp( to_find_1_of, `g` );
  //       it(`for the var value "${ to_find_1_of }"`, function () {
  //         let matches = new_contents.match( text_regex );
  //         expect( matches, `Unable to find column matching ${ to_find_1_of }` ).to.be.an(`array`);
  //         expect( matches.length ).to.equal( 1 );
  //       })
  //     }
      
  //   });

  // });  // ends blank var value

});
