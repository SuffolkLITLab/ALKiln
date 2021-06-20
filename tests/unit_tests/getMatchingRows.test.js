// const chai = require('chai');
// const expect = chai.expect;


// const tables = require('./tables.fixtures.js');
// const fields = require('./fields.fixtures.js');
// const matches = require('./matches.fixtures.js');
// const scope = require('../../lib/scope.js');
// const getMatchingRows = scope.getMatchingRows;


// // ============================
// // Standard fields - no proxies, no showifs.
// // ============================
// // TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.
// describe("When given a field and table rows for standard fields", async function() {
//   for ( let test_i = 0; test_i < matches.standard.length; test_i++ ) {
//     let field = fields.standard[ test_i ];
//     let curr_matches = matches.standard[ test_i ];
//     it( `finds the right matches for ${ field.selector }`, async function() {
//       let result = await getMatchingRows( scope, { field, var_data: tables.standard });
//       expect( result ).to.deep.equal( curr_matches );
//     });
//   }
// });


// // // ============================
// // // Simple show if fields - no proxies
// // // ============================
// // it("matches the right table and field rows for simple show if fields", async function() {
// //   let result = await getMatchingRows( scope, { fields: fields.show_if, var_data: tables.show_if });
// //   expect( result ).to.deep.equal( matches.show_if );
// // });


// // // ============================
// // // Buttons
// // // ============================
// // // `continue button field:`
// // it("matches the right table and field rows for one continue button", async function() {
// //   let result = await getMatchingRows( scope, { fields: fields.button_continue, var_data: tables.button_continue });
// //   expect( result ).to.deep.equal( matches.button_continue );
// // });

// // // `yesnomaybe:`
// // it("matches the right table and field rows for yesnomaybe 'yes' buttons", async function() {
// //   let result1 = await getMatchingRows( scope, { fields: fields.buttons_yesnomaybe, var_data: tables.buttons_yesnomaybe_yes });
// //   expect( result1 ).to.deep.equal( matches.buttons_yesnomaybe_yes );
// // });
// // it("matches the right table and field rows for yesnomaybe 'no' buttons", async function() {
// //   let result2 = await getMatchingRows( scope, { fields: fields.buttons_yesnomaybe, var_data: tables.buttons_yesnomaybe_no });
// //   expect( result2 ).to.deep.equal( matches.buttons_yesnomaybe_no );
// // });
// // it("matches the right table and field rows for yesnomaybe 'maybe' buttons", async function() {
// //   let result3 = await getMatchingRows( scope, { fields: fields.buttons_yesnomaybe, var_data: tables.buttons_yesnomaybe_none });
// //   expect( result3 ).to.deep.equal( matches.buttons_yesnomaybe_none );
// // });

// // // `field:` and `buttons:`
// // it("matches the right table and field rows for other mutiple choice continue buttons, choice 1", async function() {
// //   let result1 = await getMatchingRows( scope, { fields: fields.buttons_other, var_data: tables.buttons_other_1 });
// //   expect( result1 ).to.deep.equal( matches.buttons_other_1 );
// // });
// // it("matches the right table and field rows for other mutiple choice continue buttons, choice 2", async function() {
// //   let result2 = await getMatchingRows( scope, { fields: fields.buttons_other, var_data: tables.buttons_other_2 });
// //   expect( result2 ).to.deep.equal( matches.buttons_other_2 );
// // });
// // it("matches the right table and field rows for other mutiple choice continue buttons, choice 3", async function() {
// //   let result3 = await getMatchingRows( scope, { fields: fields.buttons_other, var_data: tables.buttons_other_3 });
// //   expect( result3 ).to.deep.equal( matches.buttons_other_3 );
// // });

// // // `field:` and `action buttons:`
// // it(`matches the right table and field rows for an action button`, async function() {
// //   let result = await getMatchingRows( scope, { fields: fields.buttons_event_action, var_data: tables.buttons_event_action });
// //   expect( result ).to.deep.equal( matches.buttons_event_action );
// // });


// // // ============================
// // // Proxy vars (x, i, j, ...)
// // // ============================
// // // x[i].name.first
// // it(`matches the right table and field rows for a multi-proxy name (x[i])`, async function() {
// //   let result = await getMatchingRows( scope, { fields: fields.proxies_xi, var_data: tables.proxies_xi });
// //   expect( result ).to.deep.equal( matches.proxies_xi );
// // });

// // // Multiple proxies by the same name are on the list (because of a loop)
// // // x[i].name.first
// // it(`matches the right table and field rows for mulitple rows with the same proxies`, async function() {
// //   let result = await getMatchingRows( scope, { fields: fields.proxies_multi, var_data: tables.proxies_multi });
// //   expect( result ).to.deep.equal( matches.proxies_multi );
// // });

// // // your_past_benefits[i].still_receiving
// // // your_past_benefits['State Veterans Benefits'].still_receiving
// // // Non-match comes after a match
// // it(`matches the right table and field rows for a proxy name when a non-match comes after a match`, async function() {
// //   let result = await getMatchingRows( scope, { fields: fields.proxies_non_match, var_data: tables.proxies_non_match });
// //   expect( result ).to.deep.equal( matches.proxies_non_match );
// //   // console.log( JSON.stringify( result ) );
// // });


// // // ============================
// // // Signature
// // // ============================
// // it(`matches the right table and field rows for a signature field`, async function() {
// //   let result = await getMatchingRows( scope, { fields: fields.signature, var_data: tables.signature });
// //   expect( result ).to.deep.equal( matches.signature );
// // });


// // // ============================
// // // `choices:`
// // // ============================
// // // `field:` and `choices:`
// // it(`matches the right table and field rows for a 'choices:' specifier`, async function() {
// //   let result = await getMatchingRows( scope, { fields: fields.choices, var_data: tables.choices });
// //   expect( result ).to.deep.equal( matches.choices );
// // });


// // // ============================
// // // dropdowns created with objects
// // // ============================
// // // ```
// // // - Something: some_var
// // //   datatype: object
// // //   object labeler: |
// // //     lambda y: y.short_label()```
// // //   choices: some_obj
// // // ```
// // it(`matches the right table and field rows for a dropdown created with objects`, async function() {
// //   let result = await getMatchingRows( scope, { fields: fields.object_dropdown, var_data: tables.object_dropdown });
// //   expect( result ).to.deep.equal( matches.object_dropdown );
// // });

