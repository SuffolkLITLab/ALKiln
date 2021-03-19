const chai = require('chai');
const expect = chai.expect;
const cheerio = require('cheerio');
// We need jest or something, right? To do fancy stuff.

const html = require('./html.fixtures.js');
const page_data = require('./page_data.fixtures.js');
const scope = require('../../lib/scope.js');
const getPageData = scope.getPageData;
const getFieldData = scope.getFieldData;


// ============================
// Standard fields - no proxies, no showifs.
// ============================
// TODO: Add more complex fields. E.g `object_checkboxes` and dropdown with `object`.


// describe("getFieldData should create the right data for"), async function() {

//   let sought_var = html.standard_sought_var;
//   let field_like_names = 'foo'

//   beforeEach(function() {
//       nock('https://dog.ceo')
//           .get('/api/breed/hound/list')
//           .reply(200, response)
//   })

//   it("checkboxes_yesno", async function() {
//     let $ = cheerio( html.checkboxes_yesno );  // html.standard?
//     let result = await getFieldData( scope, {
//       $,
//       node: $( html.checkboxes_yesno ),
//       sought_var,
//       field_like_names
//     });
//     expect( result ).to.deep.equal( page_data.standard );
//   });


// });


it("creates the right data for standard fields", async function() {
  // 18 fields (03/15/21)
  let result = await getPageData( scope, { html: html.standard });
  expect( result ).to.deep.equal( page_data.standard );
});


/*
Fields:
- Checkboxes (multiple choice)
  Story table: var names and chioces separately in the table, as well as value to set to true/false
  html: have var names and choice names both in their `input[name]` attribute.
- Checkboxes (yes/no)
  Story table: var name & set to. NO choice? Or maybe flip those last two? Which would be most useful?
  html: `name` = var_name, True/False for `value`
- Buttons (continue)
  Story table: is var_name all that's needed? Also need 'value'? Do these even matter at all?
  html: var name = `name`, value = 'True'
- Buttons (other/multi)
  Story table: var name, value (set_to) needed
  html: var name is `name` attr, value is `value` attr
- Buttons (yesnomaybe)
  Story table: var name, value (set_to) needed
  html: var name = name. `value` attr: True, False, None
- Radio object_radio
  html: `value` attr has no value, `name` attr is the var name

===============
Questions:
- Do var names contain doubly encoded stuff if they have
keys. e.g. `foo[B'encoded'][B'choice_encoded']`. I think not because
we whould have run into them by now. I think we've run into those and
they've been fine.
*/
