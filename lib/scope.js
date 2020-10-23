const { expect } = require('chai');


let ordinal_to_integer = {
  only: 0, first: 0, second: 1, third: 2, fourth: 3, fifth: 4,
  sixth: 5, seventh: 6, eighth: 7, ninth: 8, tenth: 9,
  '1st': 0, '2nd': 1, '3rd': 2, '4th': 3, '5th': 4,
  '6th': 5, '7th': 6, '8th': 7, '9th': 8,'10th': 9,
};

module.exports = {
  getTextFieldId: async function getTextFieldId(scope, {ordinal='first', field_label='', type}) {
    /* Returns the id for the specified text field or area
    */
    let index = ordinal_to_integer[ ordinal ];

    let field_id;
    if ( field_label ) {
      field_id = await scope.page.$$eval('label[class*="datext"]', (elements, field_label, index, type) => {
        let elems_array = Array.from( elements );
        let matches = [];
        for ( let elem of elems_array ) {
          if (( elem.innerText ).includes( field_label )) {  // TODO: look for type
            matches.push( elem );
          }
        }  // End for labels

        if ( matches[ index ] ) { return matches[ index ].getAttribute( 'for' ); }
        else { return false; }

      }, field_label, index, type);
    } else {
      field_id = await scope.page.$$eval(`#daquestion ${ type }[alt*="Input box"]`, (elems, index) => {
        return elems[ index ].getAttribute('id');
      }, index);
    }

    expect( field_id, `No ${ordinal} "${ field_label }" ${ type } found` ).to.be.a('string');
    return field_id;
  },  // Ends getTextFieldId

  waitForShowIf: async function waitForShowIf(scope) {
    // If something might be hidden or shown, wait extra time to let it hide or show
    // I think `.$()` does not use a timeout
    let showif = await scope.page.$('.dashowif');
    if ( showif ) { await scope.page.waitFor(500); }
  },

  afterStep: async function afterStep(scope, options = {waitForShowIf: false, navigated: false, waitForTimeout: 0}) {
    /* Common things to do after a step, including take care of errors.
    *    There is no 'AfterStep' for puppeteer cucumber that I could find. */

    // If there's an error, throw it
    let error_id_elem = await scope.page.$('#da-retry');
    if ( error_id_elem ) {
      let error_elem = await scope.page.$('blockquote')
      let error_handle = await error_elem.getProperty( 'textContent' );
      let error_text = await error_handle.jsonValue();

      throw error_text;
    }

    // Otherwise, maybe do some waiting
    // console.log(options.waitForShowIf, options.navigated);
    if ( options.waitForShowIf ) { await scope.waitForShowIf(scope); }
    // Always reset unless told otherwise
    if ( options.navigated ) { scope.navigated = true; }
    else { scope.navigated = false; }
    // Plain old waiting. Yeah, I abstracted it into here so only
    // one thing was being called at the end
    if ( options.waitForTimeout ) { await scope.page.waitFor( options.waitForTimeout ); }
  },  // Ends afterStep

  getSpecifiedChoice: async function getSpecifiedChoice(scope, {ordinal, label_text, group_label_text, roles}) {
    /* Returns the elementHandle of the field specified by the arguments
    * 
    * @param {string} [ordinal='first'] Which instance of the field on the page.
    * @param {string} [label_text=''] Text of the label for the field, if it has one.
    * @param {string} [group_label_text=''] Text of the label for the group of fields to which the field belongs, if there is one.
    * @param {array} role_types 'radio', 'checkbox', or both. The type of field that the developer could be asking for.
    * 
    * @returns instance of ElementHandle or test fails
    * 
    * Methodologies proposed:
    *     * Proposed: First dig all the way down to the label, then dig back out
    *     * Regected: It's not clear how to keep things in order and filtering them
    *     that way is more confusing, not less. It also takes more lines of code.
    *     * Proposed: First collect all elements of expected status.
    *     * Rejected: That ruins getting the correct ordinal
    */

    group_label_text = group_label_text || '';
    // If possible, get the first group to which this choice belongs
    let group_name = null;
    if ( group_label_text ) {
      // Example: `//*[@id="daform"]//label[contains(text(), "serve")][1]`
      let identifier_xpath = `//*[@id="daform"]//label[contains(text(), "${ group_label_text }")][1]`;
      let [group_label] = await scope.page.$x( identifier_xpath );
      expect( group_label.constructor.name, `Did not find a "${ group_label_text }" group on this page. ${ group_label.constructor.name }` ).to.equal('ElementHandle');

      group_name = await group_label.evaluate(( elem ) => elem.getAttribute('for'));
    }

    let role_type = '';
    for (let role of roles) {
      role_type += `@role="${ role }"`;
      if ( roles.indexOf(role) < roles.length - 1 ) { role_type += ' or '; }
    }

    // labels for choices
    let label_xpath = `//*[@id="daform"]//label[${ role_type }]`;
    // Labels for a group of items will end in the group name plus _0, _1, etc. Ex: `[contains(@for, "X2ZpZWxkXzA_")]`
    if ( group_name ) { label_xpath += `[contains(@for, "${ group_name }_")]` }

    // These labels don't have text, their descendants do. Dig down to find matches then come back out to get the label again.
    // Ex: `//*[contains(text(), "My case")]/ancestor-or-self::label`
    label_text = label_text || '';
    if ( label_text ) { label_xpath += `//*[contains(text(), "${ label_text }")]/ancestor-or-self::label` }
    
    // The index to identify just one. It's 1-indexed. xpath still makes an array. Ex: `[1]`
    ordinal = ordinal || 'first';
    let index = ordinal_to_integer[ ordinal ];
    label_xpath += `[${ index + 1 }]`;
    // Ex: `//*[@id="daform"]//label[@role="checkbox" or @role="radio"][contains(@for, "X2ZpZWxkXzA_")]//*[contains(text(), "My case")]/ancestor-or-self::label[1]`

    let [elem] = await scope.page.$x( label_xpath );
    // TODO: Make this error description more relavent to the specific situation (no empty quotes, etc.)
    expect( elem.constructor.name, `Did not find anything where the ${ ordinal } "${ label_text }" ${ roles } should have been. ${ elem.constructor.name }` ).to.equal('ElementHandle');

    return elem;
  },  // Ends getSpecifiedChoice
};
