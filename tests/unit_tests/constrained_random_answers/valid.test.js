const chai = require(`chai`);
const expect = chai.expect;

/**
 * Discuss:
 * - Test making more than one file?
 * - Test deleting the files from the sources folder?
 * - Test having multiple sources folders? (overdue)
 * 
 * TODO: Test no double semicolons are in the generated text
 * */

const constrained_random_tests = require(`../../../lib/utils/constrained_random_tests.js`);
const parse_file = constrained_random_tests.parse_file;
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
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });

    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`generates 2 Scenarios`, function() {
      let num_Scenarios = new_contents.split(`Scenario:`).length - 1;
      expect( 2 ).to.equal( num_Scenarios, `Wrong # of Scenarios: ${ num_Scenarios }/2` );
    });

    it(`has the right non-random text`, function () {
      expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
    });

  });

  describe(`that has various complexities with 2 generators and 3 generated`, function () {
    let fixture = fixtures.complex;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`generates 3 Scenarios (skipping the extra appearance of "Scenario:")`, function() {
      let num_Scenarios = new_contents.split(`Scenario:`).length - 2;
      expect( 3 ).to.equal( num_Scenarios, `Wrong # of Scenarios: ${ num_Scenarios }/2` );
    });

    let comparable = comparable_text( new_contents );
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

  });  // ends complex

  describe(`with an author's tags`, function () {
    let fixture = fixtures.tags;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`keeps those tags`, function () {
      expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
    });
  });

  describe(`with author's tags on line 2`, function () {
    let fixture = fixtures.weird_spacing.tags_line_2;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`keeps those tags and spacing`, function () {
      expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
    });
  });

  describe(`with weird spacing in author's tags`, function () {
    let fixture = fixtures.weird_spacing.tags;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`keeps that spacing`, function () {
      expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
    });
  });

  describe(`with weird indentations`, function () {
    let fixture = fixtures.weird_spacing.indents;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`keeps those indentation levels`, function () {
      expect( comparable_text( new_contents ) ).to.equal( fixture.expected );
    });
  });

  describe(`with no spacing in choices`, function () {
    let fixture = fixtures.weird_spacing.choices;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`gets a choice correctly`, function () {
      expect( new_contents ).to.match( fixture.find_1 );
    });
  });

  describe(`with 3 columns`, function () {
    let fixture = fixtures.columns_3;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`adds a "trigger" column with those values`, function () {
      expect( new_contents ).to.equal( fixture.expected );
    });
  });

  describe(`with 4 columns`, function () {
    let fixture = fixtures.columns_4;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`ignores the 4th column`, function () {
      expect( new_contents ).to.equal( fixture.expected );
    });
  });

  describe(`with comments before and in the table`, function () {
    let fixture = fixtures.rows_comments;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`removes the comments`, function () {
      expect( comparable_text( new_contents )).to.equal( fixture.expected );
    });
  });

  describe(`with a comment after the table`, function () {
    let fixture = fixtures.comment_after_last_row;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`keeps and repeats the comment`, function () {
      expect( comparable_text( new_contents )).to.equal( fixture.expected );
    });
  });

  describe(`with empty rows before and in the table`, function () {
    let fixture = fixtures.rows_empty;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    it(`removes the empty rows`, function () {
      expect( comparable_text( new_contents )).to.equal( fixture.expected );
    });
  });

  describe(`with no number value`, function () {
    let fixture = fixtures.warnings.no_number;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    // it(`TODO: adds a warning`, function () {
    //   `You gave no number. ALKiln will generate 1 test`
    // });
    it(`generates 1 test`, function () {
      expect( comparable_text( new_contents )).to.equal( fixture.expected );
    });
  });

  describe(`with too many number values`, function () {
    let fixture = fixtures.warnings.multiple_numbers;
    let { new_contents, errors } = parse_file({ file_text: fixture.arg });
    
    it(`returns no errors`, function () { expect( errors ).to.have.lengthOf( 0 ); });

    // it(`TODO: adds a warning`, function () {
    //   `You gave multiple numbers. ALKiln will use the second one and generate 2 test(s)`
    // });
    it(`uses the last number given`, function () {
      expect( comparable_text( new_contents )).to.equal( fixture.expected );
    });
  });

});
