module.exports = {
  getTextFieldId: async function getTextFieldId(scope, field_label) {
    // field label is optional

    let field_id;
    if ( field_label ) {
      field_id = await scope.page.$$eval('label[class*="datext"]', (elements, field_label) => {
        let elems_array = Array.from( elements );
        for ( let elem of elems_array ) {
          if (( elem.innerText ).includes( field_label )) {
            return elem.getAttribute( 'for' );
          }
        }  // End for labels

      }, field_label);
    } else {
      field_id = await scope.page.$eval(`#daquestion input[alt*="Input box"]`, (elem) => {
        return elem.getAttribute('id');
      });
    }

    return field_id;
  },

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
    if ( options.waitForShowIf ) { await scope.waitForShowIf(scope); }
    // Always reset unless told otherwise
    if ( options.navigated ) { scope.navigated = true; }
    else { scope.navigated = false; }
    // Plain old waiting. Yeah, I abstracted it into here so only
    // one thing was being called at the end
    if ( options.waitForTimeout ) { await scope.page.waitFor( options.waitForTimeout ); }
  },
};
