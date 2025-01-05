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
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`keeps those tags`, function () {
      expect( comparable_text( actual_string ) ).to.equal( fixture.expected );
    });
  });

  describe(`with author's tags on line 2`, function () {
    let fixture = fixtures.weird_spacing.tags_line_2;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`keeps those tags and spacing`, function () {
      expect( comparable_text( actual_string ) ).to.equal( fixture.expected );
    });
  });

  describe(`with weird spacing in author's tags`, function () {
    let fixture = fixtures.weird_spacing.tags;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`keeps that spacing`, function () {
      expect( comparable_text( actual_string ) ).to.equal( fixture.expected );
    });
  });

  describe(`with weird indentations`, function () {
    let fixture = fixtures.weird_spacing.indents;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`keeps those indentation levels`, function () {
      expect( comparable_text( actual_string ) ).to.equal( fixture.expected );
    });
  });

  describe(`with no spacing in choices`, function () {
    let fixture = fixtures.weird_spacing.choices;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`gets a choice correctly`, function () {
      expect( actual_string ).to.match( fixture.find_1 );
    });
  });

  describe(`with 3 columns`, function () {
    let fixture = fixtures.columns_3;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`adds a "trigger" column with those values`, function () {
      expect( actual_string ).to.equal( fixture.expected );
    });
  });

  describe(`with 4 columns`, function () {
    let fixture = fixtures.columns_4;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`ignores the 4th column`, function () {
      expect( actual_string ).to.equal( fixture.expected );
    });
  });

  describe(`with comments before and in the table`, function () {
    let fixture = fixtures.rows_comments;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`removes the comments`, function () {
      expect( comparable_text( actual_string )).to.equal( fixture.expected );
    });
  });

  describe(`with a comment after the table`, function () {
    let fixture = fixtures.comment_after_last_row;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`keeps and repeats the comment`, function () {
      expect( comparable_text( actual_string )).to.equal( fixture.expected );
    });
  });

  describe(`with empty rows before and in the table`, function () {
    let fixture = fixtures.rows_empty;
    let actual_string = parse_file({ file_text: fixture.arg });

    it(`removes the empty rows`, function () {
      expect( comparable_text( actual_string )).to.equal( fixture.expected );
    });
  });

  describe(`with table interrupted by a regular line after the header`, function () {
    let fixture = fixtures.warnings.only_row_is_header;
    let actual_string = parse_file({ file_text: fixture.arg });

    // it(`TODO: adds a warning`, function () {
    //   `The generator table only has a header row`
    // });
    it(`keeps the text, including the table, as is`, function () {
      expect( actual_string ).to.equal( fixture.expected );
    });
  });

  describe(`with an author asking for 3 tests when only 2 unique tests can exist`, function () {
    let fixture = fixtures.warnings.too_many_requested;
    let actual_string = parse_file({ file_text: fixture.arg });

    // it(`TODO: adds a warning about not being able to make that many tests`, function () {
    //   `Could only make _ unique tests out of the _ you asked for`
    // });

    it(`only makes 2 tests`, function () {
      let matches = actual_string.match( /^Scenario:/gm );
      expect( matches ).to.be.an(`array`);
      expect( matches.length ).to.equal( 2 );
    });

    let text_1_regex = new RegExp( fixture.find_2[0], `g`);
    let text_2_regex = new RegExp( fixture.find_2[1], `g`);
    describe(`both tests are unique from each other`, function () {

      it(`for ${ fixture.find_2[0] }`, function () {
        let matches = actual_string.match( text_1_regex );
        expect( matches ).to.be.an(`array`);
        expect( matches.length ).to.equal( 1 );
      })
      it(`for ${ fixture.find_2[1] }`, function () {
        let matches = actual_string.match( text_2_regex );
        expect( matches ).to.be.an(`array`);
        expect( matches.length ).to.equal( 1 );
      })
      it(`and all else to be standard`, function () {
        expect( comparable_text( actual_string )).to.equal( fixture.expected );
      })
      
    });

  });

  describe(`with no number value`, function () {
    let fixture = fixtures.warnings.no_number;
    let actual_string = parse_file({ file_text: fixture.arg });

    // it(`TODO: adds a warning`, function () {
    //   `You gave no number. ALKiln will generate 1 test`
    // });
    it(`generates 1 test`, function () {
      expect( comparable_text( actual_string )).to.equal( fixture.expected );
    });
  });

  describe(`with too many number values`, function () {
    let fixture = fixtures.warnings.multiple_numbers;
    let actual_string = parse_file({ file_text: fixture.arg });

    // it(`TODO: adds a warning`, function () {
    //   `You gave multiple numbers. ALKiln will use the second one and generate 2 test(s)`
    // });
    it(`uses the last number given`, function () {
      expect( comparable_text( actual_string )).to.equal( fixture.expected );
    });
  });

});
