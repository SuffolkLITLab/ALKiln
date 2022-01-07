const chai = require(`chai`);
const expect = chai.expect;

const names = require(`./getSafeScenarioBaseFilename.fixtures.js`);
const scope = require(`../../lib/scope.js`);
const getSafeScenarioBaseFilename = scope.getSafeScenarioBaseFilename;


let mock_scenario = function ( description, tag_names=[] ) {
  /** Mock the complex structure of a Scenario object */
  let scenario = {
    pickle: { name: description, tags: [], }
  };
  for ( let tag of tag_names ) {
    scenario.pickle.tags.push({ name: tag });
  }
  return scenario;
};  // Ends mock_scenario();

describe(`When I use scope.getSafeScenarioBaseFilename()`, function() {

  beforeEach(function() {
    scope.language = undefined;
  });

  // No language, no tags
  it(`preserves spaces`, async function() {
    let scenario = mock_scenario( names.with_spaces, [] );
    let result = await getSafeScenarioBaseFilename( scope, { scenario });
    expect( result ).to.equal( names.with_spaces );
  });

  it(`preserves non-english characters`, async function() {
    let scenario = mock_scenario( names.non_english_chars, [] );
    let result = await getSafeScenarioBaseFilename( scope, { scenario });
    expect( result ).to.equal( names.non_english_chars );
  });

  it(`replaces invalid characters with "_"`, async function() {
    let scenario = mock_scenario( names.colon_input, [] );
    let result = await getSafeScenarioBaseFilename( scope, { scenario });
    expect( result ).to.equal( names.colon_output );
  });

  // language, 1 tag
  it(`adds a language and 1 tag correctly, preserving numbers`, async function() {
    scope.language = names.non_english_chars;
    let scenario = mock_scenario( names.with_spaces, [ names.tag1 ] );
    let result = await getSafeScenarioBaseFilename( scope, { scenario });
    let expected = `${ names.non_english_chars }-${ names.with_spaces }-${ names.tag1 }`;
    expect( result ).to.equal( expected );
  });

  // 2 tags
  it(`adds 2 tags correctly, preserving numbers`, async function() {
    let scenario = mock_scenario( names.with_spaces, [ names.tag1, names.tag2 ] );
    let result = await getSafeScenarioBaseFilename( scope, { scenario });
    let expected = `${ names.with_spaces }-${ names.tag1 }-${ names.tag2 }`;
    expect( result ).to.equal( expected );
  });

});
