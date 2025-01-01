const chai = require(`chai`);
const expect = chai.expect;
// const deepEqualInAnyOrder = require(`deep-equal-in-any-order`);
// chai.use(deepEqualInAnyOrder);
// We need jest or something for managing snapshots more easily

/**
 * Discuss:
 * - Test making more than one file?
 * - Test deleting the files from the sources folder?
 * - Test having multiple sources folders? (overdue)
 * */

const generator = require(`../../../lib/utils/make_random_input_files.js`);
const parse_file = generator.parse_file;
const fixtures = require(`./constrained_valid.fixtures.js`);


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


describe(`Constrained random answers parser, when given a valid generator Scenario`, function () {

  describe(`that is simple and normal`, function () {
    let fixture = fixtures.simple;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`generates 2 Scenarios`, function() {
      let num_Scenarios = actual_string.split(`Scenario:`).length - 1;
      expect( 2 ).to.equal( num_Scenarios, `Wrong # of Scenarios: ${ num_Scenarios }/2` );
    });

    it(`has the right non-random text`, function () {
      expect( comparable_text( actual_string ) ).to.equal( fixture.expected );
    });
    // TODO: Test it has generates both options of the 2 choices - generates
    //    unique Scenarios (use .split()?)
  });

  describe(`that has various complexities with 2 generators and 3 generated`, function () {
    let fixture = fixtures.complex;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`generates 3 Scenarios (skipping the extra appearance of "Scenario:")`, function() {
      let num_Scenarios = actual_string.split(`Scenario:`).length - 2;
      expect( 3 ).to.equal( num_Scenarios, `Wrong # of Scenarios: ${ num_Scenarios }/2` );
    });

    let comparable = comparable_text( actual_string );
    let passes = null;
    try {
      expect( comparable ).to.equal( fixture.expected );
      passes = true;
    } catch ( complex_check_error ) {
      passes = false;
    }

    it(`retains the text after the Feature`, function () {
      expect( passes, `Incorrect generated text. See below.` ).to.be.true
    });
    it(`retains weird tag spacing`, function () {
      expect( passes, `Incorrect generated text. See below.` ).to.be.true
    });
    it(`retains weird table indentation`, function () {
      expect( passes, `Incorrect generated text. See below.` ).to.be.true
    });
    it(`retains the Step after the table`, function () {
      expect( passes, `Incorrect generated text. See below.` ).to.be.true
    });
    it(`retains the comments before the table`, function () {
      expect( passes, `Incorrect generated text. See below.` ).to.be.true
    });
    it(`retains the comments after the table`, function () {
      expect( passes, `Incorrect generated text. See below.` ).to.be.true
    });
    it(`retains and ignores a commented extraneous generator Step`, function () {
      expect( passes, `Incorrect generated text. See below.` ).to.be.true
    });
    it(`loses the comments in the table`, function () {
      // Make sure text comparison gets logged once
      expect( comparable ).to.equal( fixture.expected );
    });

  });

});
