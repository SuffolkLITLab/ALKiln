const chai = require('chai');
const expect = chai.expect;

const checkboxes = require('./setCheckbox.fixtures.js');
const scope = require('../../lib/scope.js');
const setCheckbox = scope.setCheckbox;


let mock_label = function ( fixture ) {
  // Mock the label's browser methods without starting Puppeteer.
  let input = { type: `checkbox`, checked: fixture.checked };
  let clicks = 0;
  let element = {
    control: fixture.has_input === false ? null : input,
    getAttribute: function ( name ) {
      return name === `aria-checked` ? fixture.aria_checked : null;
    },
    click: function () {
      input.checked = !input.checked;
      clicks += 1;
    },
  };
  let label = {
    evaluate: async function ( callback ) {
      return callback( element );
    },
  };
  return { label, input, get_clicks: () => clicks };
};


describe(`When I use scope.setCheckbox()`, function() {

  for ( let fixture of checkboxes ) {
    it( fixture.description, async function() {
      let mock = mock_label( fixture );
      await setCheckbox( scope, { label: mock.label, answer: fixture.answer });
      expect( mock.input.checked ).to.equal( fixture.expected_checked );
      expect( mock.get_clicks() ).to.equal( fixture.expected_clicks );
    });
  }

});
