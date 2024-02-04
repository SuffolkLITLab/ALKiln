const chai = require('chai');
const expect = chai.expect;


const tables = require('./tables.fixtures.js');
const fields = require('./fields.fixtures.js');
const matches = require('./matches.fixtures.js');
const scope = require('../../lib/scope.js');
const getMatchingRows = scope.getMatchingRows;
// Match state var instantiated in steps.js. TODO: Add tests for such rows.
scope.row_needs_trigger_flag = `ALKiln: no trigger variable needed`;

// TODO: Add tests for reports

// ============================
// Helpers

let getSafeName = function ( field ) {
  let name = 'a field with no name';
  let guess_1 = field.guesses[0];
  if ( guess_1 ) { name = field.guesses[0].var }
  return name;
};

// TODO: Add `testForMatches()` to reduce duplication (will run for loops)

// ============================


// ============================
// Standard fields - no proxies, no showifs.
// ============================
describe("Matches: For standard fields", async function() {
  // TODO: One of these should have a report for having two fields that match. Test the report?
  for ( let test_i = 0; test_i < fields.standard.length; test_i++ ) {
    let field = fields.standard[ test_i ];
    let curr_matches = matches.standard[ test_i ];
    let name = getSafeName( field );
    let result = await getMatchingRows( scope, { field, var_data: tables.standard });
    it( `finds the right matches for ${ name }`, async function() {
      // console.log(`=================\n${ JSON.stringify(curr_matches) }`);
      // console.log(`-----------------\n${ JSON.stringify(result) }`);
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});


// ============================
// Simple show if fields - no proxies
// ============================
describe("For simple show if fields", async function() {
  for ( let test_i = 0; test_i < fields.show_if.length; test_i++ ) {
    let field = fields.show_if[ test_i ];
    let curr_matches = matches.show_if[ test_i ];
    let name = getSafeName( field );
    let result = await getMatchingRows( scope, { field, var_data: tables.show_if });
    it( `finds the right matches for ${ name }`, async function() {
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});


// ============================
// Buttons
// ============================
// `continue button field:`
describe("For one continue button", async function() {
  for ( let test_i = 0; test_i < fields.button_continue.length; test_i++ ) {
    let field = fields.button_continue[ test_i ];
    let curr_matches = matches.button_continue[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.button_continue });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});

// `yesnomaybe:`
describe("For the 'yes' choice of yesnomaybe buttons", async function() {
  for ( let test_i = 0; test_i < fields.buttons_yesnomaybe.length; test_i++ ) {
    let field = fields.buttons_yesnomaybe[ test_i ];
    let curr_matches = matches.buttons_yesnomaybe_yes[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.buttons_yesnomaybe_yes });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});
describe("For the 'no' choice of yesnomaybe buttons", async function() {
  for ( let test_i = 0; test_i < fields.buttons_yesnomaybe.length; test_i++ ) {
    let field = fields.buttons_yesnomaybe[ test_i ];
    let curr_matches = matches.buttons_yesnomaybe_no[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.buttons_yesnomaybe_no });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});
describe("For the 'maybe' choice of yesnomaybe buttons", async function() {
  for ( let test_i = 0; test_i < fields.buttons_yesnomaybe.length; test_i++ ) {
    let field = fields.buttons_yesnomaybe[ test_i ];
    let curr_matches = matches.buttons_yesnomaybe_none[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.buttons_yesnomaybe_none });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});

// `field:` and `buttons:`
describe("For choice 1 of other mutiple choice continue buttons", async function() {
  for ( let test_i = 0; test_i < fields.buttons_other.length; test_i++ ) {
    let field = fields.buttons_other[ test_i ];
    let curr_matches = matches.buttons_other_1[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.buttons_other_1 });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});
describe("For choice 2 of other mutiple choice continue buttons", async function() {
  for ( let test_i = 0; test_i < fields.buttons_other.length; test_i++ ) {
    let field = fields.buttons_other[ test_i ];
    let curr_matches = matches.buttons_other_2[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.buttons_other_2 });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});
describe("For choice 3 of other mutiple choice continue buttons", async function() {
  for ( let test_i = 0; test_i < fields.buttons_other.length; test_i++ ) {
    let field = fields.buttons_other[ test_i ];
    let curr_matches = matches.buttons_other_3[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.buttons_other_3 });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});

// `field:` and `action buttons:`
describe(`For an action button`, async function() {
  for ( let test_i = 0; test_i < fields.buttons_event_action.length; test_i++ ) {
    let field = fields.buttons_event_action[ test_i ];
    let curr_matches = matches.buttons_event_action[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.buttons_event_action });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});


// ============================
// Proxy vars (x, i, j, ...)
// ============================
// x[i].name.first
describe(`For a multi-proxy name (x[i])`, async function() {
  for ( let test_i = 0; test_i < fields.proxies_xi.length; test_i++ ) {
    let field = fields.proxies_xi[ test_i ];
    let curr_matches = matches.proxies_xi[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.proxies_xi });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});

// Multiple proxies by the same name are on the list (because of a loop)
// x[i].name.first
describe(`For mulitple rows with the same proxies`, async function() {
  for ( let test_i = 0; test_i < fields.proxies_multi.length; test_i++ ) {
    let field = fields.proxies_multi[ test_i ];
    let curr_matches = matches.proxies_multi[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.proxies_multi });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});

// Missing table row for loop
describe(`For a second proxy loop page,`, async function() {
  for ( let test_i = 0; test_i < fields.proxies_multi.length; test_i++ ) {
    let field = fields.proxies_multi[ test_i ];
    let curr_matches = matches.proxies_missing_table_row[ test_i ];
    let name = getSafeName( field );
    it( `does not find any matches when table row for second loop page is missing`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.proxies_missing_table_row });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});

// Missing trigger matches second loop
describe(`For a second proxy loop page,`, async function() {
  for ( let test_i = 0; test_i < fields.proxies_multi.length; test_i++ ) {
    let field = fields.proxies_multi[ test_i ];
    let curr_matches = matches.proxies_missing_trigger[ test_i ];
    let name = getSafeName( field );
    it( `matches with a missing trigger row with the correct variable name`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.proxies_missing_trigger });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});

// Proxy substitutes (no trigger) first loop (i = 0)
describe(`For proxy substitution where "i" = 0`, async function() {
  for ( let test_i = 0; test_i < fields.proxy_substitution_i_is_0.length; test_i++ ) {
    let field = fields.proxy_substitution_i_is_0[ test_i ];
    let curr_matches = matches.proxy_substitution_i_is_0[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.proxy_substitution_i_is_0 });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});

// Multiple proxies by the same name are on the list (because of a loop)
// Proxy substitutes (no trigger) second loop (i = 1)
describe(`For proxy substitutions with mulitple rows of "i" where "i" = 1`, async function() {
  for ( let test_i = 0; test_i < fields.proxy_substitution_i_is_1.length; test_i++ ) {
    let field = fields.proxy_substitution_i_is_1[ test_i ];
    let curr_matches = matches.proxy_substitution_i_is_1[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.proxy_substitution_i_is_1 });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});

// Proxy substitution (no trigger) missing table row for second loop (i = 1)
describe(`For a second loop page with a proxy substitution Story Table,`, async function() {
  for ( let test_i = 0; test_i < fields.proxies_multi.length; test_i++ ) {
    let field = fields.proxies_multi[ test_i ];
    let curr_matches = matches.proxy_substitution_missing_table_row[ test_i ];
    let name = getSafeName( field );
    it( `finds no matches when the Story Table row for that loop is missing`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.proxy_substitution_missing_table_row });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});


// ============================
// Signature
// ============================
describe(`For a signature field`, async function() {
  for ( let test_i = 0; test_i < fields.signature.length; test_i++ ) {
    let field = fields.signature[ test_i ];
    let curr_matches = matches.signature[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.signature });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});


// ============================
// `choices:`
// ============================
// `field:` and `choices:`
describe(`For a 'choices:' specifier`, async function() {
  for ( let test_i = 0; test_i < fields.choices.length; test_i++ ) {
    let field = fields.choices[ test_i ];
    let curr_matches = matches.choices[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.choices });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});


// ============================
// dropdowns created with objects
// ============================
// ```
// - Something: some_var
//   datatype: object
//   object labeler: |
//     lambda y: y.short_label()```
//   choices: some_obj
// ```
describe(`For a dropdown created with objects`, async function() {
  for ( let test_i = 0; test_i < fields.object_dropdown.length; test_i++ ) {
    let field = fields.object_dropdown[ test_i ];
    let curr_matches = matches.object_dropdown[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.object_dropdown });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});


// ============================
// mixed quotes
// ============================
describe(`For quotes that are mismatched`, async function() {
  for ( let test_i = 0; test_i < fields.mixed_quotes.length; test_i++ ) {
    let field = fields.mixed_quotes[ test_i ];
    let curr_matches = matches.mixed_quotes[ test_i ];
    let name = getSafeName( field );
    it( `finds the right matches for ${ name }`, async function() {
      let result = await getMatchingRows( scope, { field, var_data: tables.mixed_quotes });
      expect( result ).to.deep.equal( curr_matches );
    });
  }
});
