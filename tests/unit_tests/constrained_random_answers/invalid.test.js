const chai = require(`chai`);
const expect = chai.expect;

const constrained_random_tests = require(`../../../lib/utils/constrained_random_tests.js`);
const parse_file = constrained_random_tests.parse_file;
const Log = require(`../../../lib/utils/Log.js`);
const fixtures = require(`./invalid.fixtures.js`);


function get_error_codes({ errors }) {
  /** Returns a list of ALKiln ALK#### codes from Error stacks
   * 
   * @param {object} obj - Named arguments
   * @param {[Error]} obj.errors - List of Error instances
   * 
   * @returns {[str]} - List of ALKiln log codes in the errors
   * */
  let codes = [];
  for ( let error of errors ) {
    let matches = error.stack.match(/ALK\d\d\d\d/gm);
    if ( matches ) {
      codes.push( ...matches );
    }
  }

  return codes;
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
const logger = new Log({ context: `invalid generators unit tests` });
let fixture = null;
let new_contents = null;
let errors = null;
let actual = null;
function mutate_globals_with({ testing_vals }) {
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

  // Mutates `fixture`
  fixture = testing_vals;
  // Mutates `new_contents` and `error`
  ({ new_contents, errors } = parse_file({
    file_text: fixture.arg,
    generator_path: `used_in_warning_logs`,
    logger
  }) );
};

describe(`Constrained random answers parser,`, function () {

  describe(`when given a empty generator text`, function () {

    before(function () { mutate_globals_with({ testing_vals: fixtures.generator_missing_contents }); });
    
    let outer = fixtures.generator_missing_contents;

    it(`returns \`null\` for contents value`, function () {
      expect( new_contents ).to.equal( fixture.expected );
    });
    it(`has these exact error codes: ${ JSON.stringify( outer.error_codes )}`, function () {
      expect( get_error_codes({ errors: errors }) )
                .to.have.all.members( fixture.error_codes );
    });
    it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
    });

  });

  describe(`when given a missing Feature keyword`, function () {

    before(function () { mutate_globals_with({ testing_vals: fixtures.generator_missing_Feature }); });
    
    let outer = fixtures.generator_missing_Feature;

    it(`returns \`null\` for contents value`, function () {
      expect( new_contents ).to.equal( fixture.expected );
    });
    it(`has these exact error codes: ${ JSON.stringify( outer.error_codes )}`, function () {
      expect( get_error_codes({ errors: errors }) )
                .to.have.all.members( fixture.error_codes );
    });
    it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
    });

  });

  describe(`when given generator text missing Scenarios`, function () {

    before(function () { mutate_globals_with({ testing_vals: fixtures.generator_0_Scenarios }); });
    
    let outer = fixtures.generator_0_Scenarios;

    it(`returns \`null\` for contents value`, function () {
      expect( new_contents ).to.equal( fixture.expected );
    });
    it(`has these exact error codes: ${ JSON.stringify( outer.error_codes )}`, function () {
      expect( get_error_codes({ errors: errors }) )
                .to.have.all.members( fixture.error_codes );
    });
    it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
      expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
    });

  });

  describe(`when given an invalid generator Scenario`, function () {

    /** TODO: `that is missing a "number" first Step` */

    describe(`that has multiple constrained random answers Steps,`, function () {

      before(function () { mutate_globals_with({ testing_vals: fixtures.multiple_constraints_Steps }); });

      let outer = fixtures.multiple_constraints_Steps;
      
      it(`returns \`null\` for contents value`, function () {
        expect( new_contents ).to.equal( fixture.expected );
      });
      it(`has these exact error codes: ${ JSON.stringify( outer.error_codes )}`, function () {
        expect( get_error_codes({ errors: errors }) ).to.have.all.members( fixture.error_codes );
      });
      it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
        expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
      });

    });

    describe(`that has no constrained random answers Steps,`, function () {

      before(function () { mutate_globals_with({ testing_vals: fixtures.no_constraints_Step }); });

      let outer = fixtures.no_constraints_Step;
      
      it(`returns \`null\` for contents value`, function () {
        expect( new_contents ).to.equal( fixture.expected );
      });
      it(`has these exact error codes: ${ JSON.stringify( outer.error_codes )}`, function () {
        expect( get_error_codes({ errors: errors }) ).to.have.all.members( fixture.error_codes );
      });
      it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
        expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
      });

    });

    describe(`where a constraints Step is missing too many keywords,`, function () {

      before(function () { mutate_globals_with({ testing_vals: fixtures.missing_keywords }); });

      let outer = fixtures.missing_keywords;
      
      it(`returns \`null\` for contents value`, function () {
        expect( new_contents ).to.equal( fixture.expected );
      });
      it(`has these exact error codes: ${ JSON.stringify( outer.error_codes )}`, function () {
        expect( get_error_codes({ errors: errors }) ).to.have.all.members( fixture.error_codes );
      });
      it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
        expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
      });

    });

    describe(`that is missing a table,`, function () {

      before(function () { mutate_globals_with({ testing_vals: fixtures.missing_table }); });

      let outer = fixtures.missing_table;
      
      it(`returns \`null\` for contents value`, function () {
        expect( new_contents ).to.equal( fixture.expected );
      });
      it(`has these exact error codes: ${ JSON.stringify( outer.error_codes )}`, function () {
        expect( get_error_codes({ errors: errors }) ).to.have.all.members( fixture.error_codes );
      });
      it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
        expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
      });

    });

    describe(`that has 2 constraints Steps that are missing tables and one Step that is valid,`, function () {

      before(function () { mutate_globals_with({ testing_vals: fixtures.too_many_Steps_with_2_missing_tables }); });

      let outer = fixtures.too_many_Steps_with_2_missing_tables;
      
      it(`returns \`null\` for contents value`, function () {
        expect( new_contents ).to.equal( fixture.expected );
      });
      it(`has these exact error codes, including 2 missing table codes: ${ JSON.stringify( outer.error_codes )}`, function () {
        expect( get_error_codes({ errors: errors }) ).to.have.all.members( fixture.error_codes );
      });
      it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
        expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
      });

    });

    describe(`that has no quoted ids,`, function () {

      before(function () { mutate_globals_with({ testing_vals: fixtures.missing_ids }); });

      let outer = fixtures.missing_ids;
      
      it(`returns \`null\` for contents value`, function () {
        expect( new_contents ).to.equal( fixture.expected );
      });
      it(`has these exact error codes: ${ JSON.stringify( outer.error_codes )}`, function () {
        expect( get_error_codes({ errors: errors }) ).to.have.all.members( fixture.error_codes );
      });
      it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
        expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
      });

    });

    describe(`that has no quoted ids,`, function () {

      before(function () { mutate_globals_with({ testing_vals: fixtures.only_row_is_header }); });

      let outer = fixtures.only_row_is_header;
      
      it(`returns \`null\` for contents value`, function () {
        expect( new_contents ).to.equal( fixture.expected );
      });
      it(`has these exact error codes: ${ JSON.stringify( outer.error_codes )}`, function () {
        expect( get_error_codes({ errors: errors }) ).to.have.all.members( fixture.error_codes );
      });
      it(`has these exact _log_ codes: ${ JSON.stringify( outer.log_codes )}`, function () {
        expect( get_log_codes({ logger }) ).to.have.all.members( fixture.log_codes );
      });

    });

  });

});
