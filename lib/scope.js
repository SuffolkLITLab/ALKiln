const { expect } = require('chai');
const env_vars = require('./utils/env_vars');


let ordinal_to_integer = {
  only: 0, first: 0, second: 1, third: 2, fourth: 3, fifth: 4,
  sixth: 5, seventh: 6, eighth: 7, ninth: 8, tenth: 9,
  '1st': 0, '2nd': 1, '3rd': 2, '4th': 3, '5th': 4,
  '6th': 5, '7th': 6, '8th': 7, '9th': 8,'10th': 9,
};

module.exports = {
  addToReport: async function( scope, { key, value }) {
    /* Add an item to a specific list in a scenario's report.
    * 
    * The report has a key for each scenario and each of those
    * keys should correspond to a list containing the relevant data. */
    if ( !scope.report[ scope.safe_id ] ) {
      scope.report[ scope.safe_id ] = {};
    }
    if ( !scope.report[ scope.safe_id ][ key ] ) {
      scope.report[ scope.safe_id ][ key ] = [];
    }
    scope.report[ scope.safe_id ][ key ].push( value );

    return scope.report[ scope.safe_id ];
  },  // Ends scope.addToReport()

  getPrintableReport: async function( scope ) {
    /* Return a string genereated from test report data. Can/should this be extensible? */
    let report = `Assembly Line Kiln Automated Testing Report - ${ (new Date()).toUTCString() }\n\n`;
    for ( let safe_id in scope.report ) {

      report += `=== Scenario ${ safe_id } ===\nQuestion ids appeared in this order:\n`;
      for ( let q_id of scope.report[ safe_id ].ids ) {
        report += `- ${ q_id }\n`
      }
      report += `\n`;
    }  // ends for every scenario

    return report;
  },  // Ends scope.createFinalReport()

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
  },  // Ends getTextFieldId

  waitForShowIf: async function waitForShowIf(scope) {
    // If something might be hidden or shown, wait extra time to let it hide or show
    // I think `.$()` does not use a timeout
    let showif = await scope.page.$('.dashowif');
    if ( showif ) { await scope.page.waitFor( scope.showif_timeout ); }
  },

  afterStep: async function afterStep(scope, options = {waitForShowIf: false, navigated: false, waitForTimeout: 0}) {
    /* Common things to do after a step, including take care of errors.
    *    TODO: discuss splitting into `afterField` and `afterStep` or something. Or just change name
    *    TODO: Update to latest cucumberjs, which as `AfterStep` */

    // If there's an error, throw it
    let error_id_elem = await scope.page.$('#da-retry');
    if ( error_id_elem ) {
      let error_elem = await scope.page.$('blockquote')
      let error_handle = await error_elem.getProperty( 'textContent' );
      let error_text = await error_handle.jsonValue();

      throw error_text;
    }

    // RESET
    if ( options.navigated ) { scope.navigated = true; }
    else { scope.navigated = false; }

    // WAITING
    if ( options.waitForShowIf ) { await scope.waitForShowIf(scope); }
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
  },  // Ends getSpecifiedChoice()

  tapElement: async function tapElement(scope, elem) {
    /* Tap a given element, detect navigation, and do appropriate related things. */
    expect( elem, 'That element cannot be found, so it cannot be tapped.' ).to.exist;

    let start_url = await scope.page.url()

    let winner;
    if (elem) {
      winner = await Promise.race([
        Promise.all([  // Error loads page, so no need to detect to keep things short
          // Click with no navigation will end immediately
          elem[ scope.activate ](),
          scope.page.waitForNavigation({waitUntil: 'domcontentloaded'}),
        ]),
        scope.page.waitForSelector('.alert-danger'),
        scope.page.waitForSelector('.da-has-error'),
      ]);
    }

    // Not sure how to detect navigation landing at same page.
    let end_url = await scope.page.url();
    let navigated = start_url !== end_url;
    // Might be able to handle this in `scope.afterStep`
    if ( navigated ) {
      // Save the id that comes next
      let { question_has_id, id, id_matches } = await scope.examinePageID( scope, 'none to match' );
      await scope.addToReport(scope, { key: 'ids', value: id });
      // If navigation, wait for 200ms to let things settle down
      await scope.afterStep(scope, {waitForTimeout: 200, navigated: navigated});
    } else {
      // If stay on page, wait for `show if` or feedback elements to be move around
      await scope.afterStep(scope, {waitForShowIf: true, navigated: navigated});
    }

    return winner;
  },  // Ends scope.tapElement()

  checkboxNameAttribute: async function ( scope, var_name, choice_name ) {
    /* Covert a checkbox variable and choice value to its base64
    *    attribute names. In da, a (non-yesno/noyes) checkbox `name`
    *    attribute is made of a combination of its variable's name
    *    and it's choice value's name, plus a little more.
    * 
    * @param {object} scope - The global namespace object
    * @param {string} var_name - Variable name of the variable being set
    * @param {string} choice_name - Value that will be set to true for the variable
    * 
    * Examples:
    * checkboxNameAttribute( scope, 'eviction_all_reasons', 'nonpayment' );
    * // "ZXZpY3Rpb25fYWxsX3JlYXNvbnNbQidibTl1Y0dGNWJXVnVkQSdd"
    */
    let choice_base64 = await scope.base64( scope, choice_name );
    let name_attr_B = await scope.base64( scope, `${ var_name }[B'${ choice_base64 }']`);
    let name_attr_R = await scope.base64( scope, `${ var_name }[R'${ choice_base64 }']`);
    return { name_attr_B, name_attr_R };
  },  // Ends checkboxNameAttribute()

  base64: async function ( scope, text ) {  // Ask for scope for consistency
    /* Return base64 version of `text` without things like '=' added to the end.
    *    base64: https://github.com/nodejs/node/issues/6107#issuecomment-207177131
    * 
    * Examples:
    * base64( scope, 'nonpayment' );
    * // "bm9ucGF5bWVudA"
    */
    if ( typeof( text ) === `string`  ) {  // Prevent an error
      // `Buffer` is a nodejs thing
      return Buffer(text, `utf8`).toString(`base64`).replace(/[^A-Za-z0-9]/g, '');
    } else { return `cannot be base64ed`; }  // Make sure it's not usable
  },

  detectDownloadComplete: async function detectDownloadComplete(scope, endTime) {
    /* Resolve if a download flag has changed. Timeout after a bit less than
    *    the global permitted timeout */

    // Stop/resolve if too much time has passed
    let expirationTime = 1.9 * 60 * 1000;  // m * s * ms
    if ( !endTime ) { endTime = new Date((new Date()).getTime() + expirationTime); }
    let diff = endTime.getTime() - Date.now();
    if ( diff <= 0 ) { return false; }

    // If time hasn't expired
    if ( scope.downloadComplete ) {
      // If download is complete, reset the flag and resolve
      scope.downloadComplete = false;
      return true;
    } else {
      // Otherwise wait and then check again
      await scope.page.waitFor( 100 );
      await scope.detectDownloadComplete(scope, endTime);
    }

    return false;
  },
  
  setVar: async function ( scope, var_name, value ) {
    /* Use variable names and values to interact with buttons that
    *    have values, text input elements, textareas, and dropdowns.
    * Returns the element that was found.
    * 
    * TODO:
    * - Birthdate fields that will be showing up relatively soon
    * - Time fields?
    */
    let base64_var_name = await scope.base64( scope, var_name );

    // Will catch some radio and checkbox inputs too, which will then be rejected
    // Note: I think `showif`s with `code` don't use `data-saveas`
    let to_manipulate = await Promise.race([
      scope.page.waitForSelector(`button[name="${base64_var_name}"][value="${value}"]`),  // button
      scope.page.waitForSelector(`:not(button)[name="${base64_var_name}"]`),  // others (not showif)
      scope.page.waitForSelector(`*[data-saveas="${base64_var_name}"] input`),  // text input showif
      scope.page.waitForSelector(`*[data-saveas="${base64_var_name}"] textarea`),  // textarea showif
      scope.page.waitForSelector(`*[data-saveas="${base64_var_name}"] select`),  // select showif/hideif
    ]);

    // Throw error for checkboxes and radios
    let type = await to_manipulate.evaluate( elem => { return elem.getAttribute('type') });
    if ( type === `checkbox` || type === `radio` ) {
      throw new TypeError(`You need the ${type} step, e.g. 'I tap the ${type} variable "some_dict" with the value "choice_value"'`);
    }

    // Actions based on element
    let tagName = await to_manipulate.evaluate( elem => { return elem.tagName });

    if ( tagName === `BUTTON` ) {  // Tap buttons
      await scope.tapElement( scope, to_manipulate );

    } else if ( tagName === `SELECT` ) {  // Choose drop-down option
      await to_manipulate.select(value);

    } else if ( tagName === `INPUT` || tagName === `TEXTAREA` ) {
      // Set text field values (includes any other input fields)
      await to_manipulate.evaluate( el => { el.value = '' });
      await to_manipulate.type( value );
      // TODO: Add hideif to this too
    }

    // Do your own waiting if you need to in the step
    return to_manipulate;
  },  // Ends setVar()

  continue: async function ( scope ) {
    /* Presses whatever button it finds that might lead to the next page. */
    // Any selectors I find seem somewhat precarious.
    let elem = await Promise.race([
      scope.page.waitForSelector(`fieldset.da-field-buttons button[type="submit"]`),  // other pages (this is the most consistent way)
      scope.page.waitForSelector(`div.form-actions a.dasigsave`),  // signature page
    ]);
    // Waits for navigation or user error
    await scope.tapElement( scope, elem );
  },

  load: async function ( scope, file_name, attempt_num ) {
    /* Try to go to the interview url a few times with a pause in between each try. */
    let max_attempts = 3;

    // If there is no browser open, start a new one
    if (!scope.browser) {
      scope.browser = await scope.driver.launch({ headless: !env_vars.DEBUG });
    }

    let interview_url = `${ env_vars.BASE_INTERVIEW_URL }${ file_name }.yml`;
    if ( !scope.page ) { scope.page = await scope.browser.newPage(); }
    await scope.page.setDefaultTimeout(30 * 1000);  // Really just to give a bit more time for the server to load

    // Try to go to the given page
    try {
      attempt_num = attempt_num || 0;
      attempt_num++;
      
      await scope.page.goto(interview_url, {waitUntil: 'domcontentloaded'});
      // This shouldn't be needed, but I think it may help with the ajax
      // requests. Might not solve all race conditions.
      await scope.page.waitForSelector('#daMainQuestion');

    } catch ( err ) {
      // If it doesn't work, maybe try again
      if ( attempt_num <= max_attempts ) { await scope.load( scope, file_name, attempt_num ); }
      else {
        // Otherwise throw an error, though there must be a better check we can do
        expect( false, `The interview at ${ interview_url } did not load after ${ max_attempts } tries.` ).to.be.true;
      }
    }
    
    return scope.page;
  },  // Ends start()

  getField: async function ( scope, { var_name, choice_name, set_to }) {
    // Detecting signature in here feels fragile. Not sure why. Too deep in.
    // Without it, though, every call to this function while on a signature
    // page will return the canvas. Need to make sure only the /sign row
    // gets added to the list of fields to set.

    let wants_to_sign = set_to === '/sign';

    // All the possible variations of name attribute values
    let base64_var_name = await scope.base64( scope, var_name );
    let base64_id_of_first_choice = base64_var_name + '_0';
    let { name_attr_B, name_attr_R } = await scope.checkboxNameAttribute( scope, var_name, choice_name );

    // Index vars and generic objects are an insurmountable issue. e.g. foo[i]
    // Account for index var for non-nested var name. Does not account for
    // index var be used as choices/set values as opposed to the var_name
    // https://docassemble.org/docs/fields.html#index%20variables
    // experiments: https://repl.it/@plocket/DapperWrongScripts#script.js (try at regex101.com)
    let index_name = var_name.replace(/\[[^\]]+\]/, '[i]');
    let base64_index = await scope.base64( scope, index_name );
    let base64_id_of_index = base64_index + '_0';
    let { index_attr_B, index_attr_R } = await scope.checkboxNameAttribute( scope, index_name, choice_name );

    // Note: I think `showif`s with `code` don't use `data-saveas`
    // Note: Choices created without variable names cannot be language agnostic

    let selectors = [
      `button[name="${ base64_var_name }"][value="${ choice_name }"]`,  // button
      `button[name="${ base64_var_name }"][value="${ set_to }"]`,  // button
      `*[data-saveas="${ base64_var_name }"] input`,  // text input showif
      `*[data-saveas="${ base64_var_name }"] textarea`,  // textarea showif
      `*[data-saveas="${ base64_var_name }"] select`,  // select/dropdown showif/hideif
      // Radios and checkboxes
      // radio: `name` = base64 var name, `choice_name` = var name of choice
      // `yesno`/`noyes` checkbox: `name` = base64 var name, choice always 'True'
      // checkbox: `name` = base64 var name + stuff + base64 choice var name + stuff (see function)
      `input[name="${ base64_var_name }"][value="${ choice_name }"]`,  // radio
      `input[name="${ base64_var_name }"][value="${ set_to }"]`,  // radio
      `*[data-saveas="${ base64_var_name }"] input[value="${ choice_name }"]`,  // radio showif
      `*[data-saveas="${ base64_var_name }"] input[value="${ set_to }"]`,  // radio showif
      `input[name="${ base64_var_name }"][value="True"]`,  // yesno/noyes checkbox
      `*[data-saveas="${ base64_var_name }"] input[value="True"]`,  // yesno/noyes checkbox showif
      // Finds the group by looking for the first checkbox in the group using id, then works its way back out again
      // 'none of the above' checkbox showif???
      `input[name="${ name_attr_B }"]`,  // checkbox
      `input[name="${ name_attr_R }"]`,  // checkbox alt

      // simple index var case as described above
      `button[name="${ base64_index }"][value="${ choice_name }"]`,  // button
      `button[name="${ base64_index }"][value="${ set_to }"]`,  // button
      `*[data-saveas="${ base64_index }"] input`,  // text input showif
      `*[data-saveas="${ base64_index }"] textarea`,  // textarea showif
      `*[data-saveas="${ base64_index }"] select`,  // select/dropdown showif/hideif
      // Radios and checkboxes
      // radio: `name` = base64 var name, `choice_name` = var name of choice
      // `yesno`/`noyes` checkbox: `name` = base64 var name, choice always 'True'
      // checkbox: `name` = base64 var name + stuff + base64 choice var name + stuff (see function)
      `input[name="${ base64_index }"][value="${ choice_name }"]`,  // radio
      `input[name="${ base64_index }"][value="${ set_to }"]`,  // radio
      `*[data-saveas="${ base64_index }"] input[value="${ choice_name }"]`,  // radio showif
      `*[data-saveas="${ base64_index }"] input[value="${ set_to }"]`,  // radio showif
      `input[name="${ base64_index }"][value="True"]`,  // yesno/noyes checkbox
      `*[data-saveas="${ base64_index }"] input[value="True"]`,  // yesno/noyes checkbox showif
      // Finds the group by looking for the first checkbox in the group using id, then works its way back out again
      // 'none of the above' checkbox showif???
      `input[name="${ index_attr_B }"]`,  // checkbox
      `input[name="${ index_attr_R }"]`,  // checkbox alt
    ];

    let handle = await scope.page.evaluateHandle(({
      selectors,
      base64_var_name,
      base64_id_of_first_choice,
      base64_index,
      base64_id_of_index }) => {
      for ( let selector of selectors ) {
        // `set_to` may sometimes not be appropriate for some of the selectors.
        // It's a bit of a wild child, but we need to stay true to it so it'll
        // work the right way other times
        try {
          let possible_node = document.querySelector( selector );
          if ( possible_node ) { return possible_node; }
        } catch (err) {}  // do nothing
      }

      // Put these two last so they'll come last in the loop and won't override other options

      // TODO: Require the developer to use 'None' when they mean 'none of the above'??? Or
      // maybe something more obscure so they're less likely to have written that variable
      // intentionally, like NOTA or DA-NOTA or NONE.
      // 'none of the above' checkbox
      // Only one (or none) of the below selectors will find a field. Either
      // `base64_id_of_first_choice` or `base64_id_of_index`
      let firstChoiceInput = document.querySelector(`input#${ base64_id_of_first_choice }`);
      if ( firstChoiceInput ) {
       let fieldset = firstChoiceInput.closest('fieldset');
       let noneOfTheAboveCheckbox = fieldset.querySelector('input.danota-checkbox');
       if ( noneOfTheAboveCheckbox ) { return noneOfTheAboveCheckbox; } 
      }
      // If the above did not return (wasn't found), try the below
      firstChoiceInput = document.querySelector(`input#${ base64_id_of_index }`);
      if ( firstChoiceInput ) {
       let fieldset = firstChoiceInput.closest('fieldset');
       let noneOfTheAboveCheckbox = fieldset.querySelector('input.danota-checkbox');
       if ( noneOfTheAboveCheckbox ) { return noneOfTheAboveCheckbox; } 
      }

      // others (not showif)
      let other = document.querySelector(`:not(button)[name="${ base64_var_name }"]`);
      if ( other ) { return other; }
      other = document.querySelector(`:not(button)[name="${ base64_index }"]`);
      if ( other ) { return other; }

      // signature page will need special treatment
      let is_signature_page = document.getElementsByClassName('dasignature')[0];
      if ( is_signature_page ) { return 'signature'; }

      return null;
    }, { selectors,
      base64_var_name,
      base64_id_of_first_choice,
      base64_index,
      base64_id_of_index });

    // <canvas> can take longer to load. All online signature pages have canvases.
    if ( handle.constructor.name !== 'ElementHandle' ) {
      let value = await handle.jsonValue();
      // Again, seems fragile. Still not sure what to do about it.
      if ( value === 'signature' && wants_to_sign ) {
        handle = await scope.page.waitForSelector('#dasigcanvas');
      }
    }

    // This seems to be working fine. Very pythonic. Some puppeteer stuff
    // is slow, so I'm hesitant to get `.jsonValue()` without more exploration.
    try {
      let { tag, type } = await handle.evaluate( elem => {
        return { tag: elem.tagName, type: elem.getAttribute('type') };
      });

      if ( env_vars.DEBUG ) {
        await handle.evaluate( elem => {
          try {elem.nextSibling.style.background = 'Khaki';}
          catch(err){ elem.style.background = 'Khaki'; }
        });
      }

      return { handle: handle, tag: tag, type: type };
    } catch ( err ) {
      // If we end up here, we didn't find the element. Don't error because
      // var tables may not need to find all their variables. Errors will
      // have to be handled upstream.
      return { handle: null, tag: null };
    }

  },  // Ends scope.getField()

  setVariable: async function ( scope, { handle, set_to }) {
    /* Returns true if the variable was enabled (which
       assumes that it was set correctly if no error happened) */
    let { disabled, tag } = await handle.evaluate( elem => {
      return {
        disabled: elem.disabled,
        tag: elem.tagName,
      };
    });

    if ( !disabled ) {
      // da's header covers the top of the section containing the fields which means
      // sometimes it blocks nodes from clicks. Scroll item to the bottom instead.
      await handle.evaluate( elem => { elem.scrollIntoView(false); return elem.scrollTop });
      await scope.setField[ tag ]( scope, { handle, set_to });
    }

    return !disabled;
  },

  setField: {
    BUTTON: async function ( scope, { handle, set_to }) { await scope.tapElement( scope, handle ); },
    TEXTAREA: async function ( scope, { handle, set_to }) {
      await scope.setText( scope, { handle, set_to });
      await scope.afterStep(scope);  // No showifs for this one?
    },
    SELECT: async function ( scope, { handle, set_to }) {
      // A dropdown's option value can be one of two things
      // Try to find the element using the first value
      let option = await scope.page.$(`option[value="${ set_to }"]`);
      if ( option ) {
        await handle.select( set_to );  // And use that value to set it

      // If that value isn't on the page, it should be the second type of value
      } else {
        let base64_name = await scope.base64( scope, set_to );
        await handle.select( base64_name );
      }
      
      await scope.afterStep(scope, { waitForShowIf: true });
    },
    CANVAS: async function ( scope, { handle, set_to }) {
      await scope.sign( scope, { handle });
      await scope.afterStep( scope );
    },
    INPUT: async function ( scope, { handle, set_to }) {
      /* Set value of some `input` element to the given value. */

      let type = await handle.evaluate( elem => { return elem.getAttribute('type'); });
      if ( type === `radio` || type === `checkbox` ) {

        let [label] = await handle.$x(`following-sibling::label`);
        
        if ( env_vars.DEBUG ) {
          if ( set_to.toLowerCase() === 'false' ) { await label.evaluate( elem => { elem.style.background = 'tomato'; }); }
          else { await label.evaluate( elem => { elem.style.background = 'teal'; }); }
          let name = await label.evaluate( elem => { return elem.getAttribute('for'); });
          console.log( `setting ${ type } ${ name } to ${ set_to }` );
        }

        if ( type === `radio` ) { await label[ scope.activate ](); }
        else { await scope.setCheckbox( scope, { label, set_to }); }

        await scope.afterStep(scope, { waitForShowIf: true });

      } else {
        await scope.setText( scope, { handle, set_to });
        await scope.afterStep(scope );  // No showifs for this one?
      }
    },  // Ends scope.setField.INPUT()
  },

  setCheckbox: async function ( scope, { label, set_to }) {
    // Depending on the current value/status of a checkbox and the desired
    // value to set, either taps the checkbox or leaves it alone.
    let status = await label.evaluate( elem => { return elem.getAttribute('aria-checked'); });
    if ( set_to.toLowerCase() !== status ) {
      await label[ scope.activate ]();
    }
  },  // Ends scope.setCheckbox()

  setText: async function ( scope, { handle, set_to }) {
    // Set text in some kind of field (input text, input date, textarea, etc.)
    await handle.evaluate( el => { el.value = '' });
    await handle.focus();
    await handle.type( set_to );
    setTimeout(async () => {
    }, 500)
  },

  sign: async function ( scope, { handle }) {
    /* Draw in a canvas element. NOTE: Signature pages do not have the
    * signature's variable name on the page. That seems to be intentional
    * in da, though the reasoning hasn't become clear yet. */
    expect( handle, `No signature field could be found`).to.exist;

    let bounding_box = await handle.boundingBox();
    await scope.page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
    await scope.page.mouse.down();
    // await scope.page.mouse.move(1, 1);  // Too big? Wait a while before drawing?
    await scope.page.mouse.up();
  },

  examinePageID: async function ( scope, question_id = '' ) {
    /* Looks for a santized version of the question id as it's written
    *     in the .yml. docassemble's way in python:
    *     re.sub(r'[^A-Za-z0-9]+', '-', interview_status.question.id.lower()) */
    let id_as_class = question_id.toLowerCase().replace(/[^A-Za-z0-9]+/g, '-');
    // `.className` is the node's list of classes as a string, separated by spaces
    let classes_str = await scope.page.$eval(`body`, function (elem) { return elem.className });
    let ids_found = classes_str.match(/question-([^ ]+)/);

    // Data that we've decided is useful for our purposes
    let found_any_question_id = ids_found !== null;
    // If there is an id, see if it matches the class
    let id = null;
    let ids_match = false;
    if ( found_any_question_id ) {
      id = ids_found[1]
      ids_match = id === id_as_class;
    }

    // TODO: What are good names for these properties?
    // question_has_id? found_any_id?
    // class_matches_id? class_and_id_do_match? id_and_page_id_match?
    return { question_has_id: found_any_question_id, id: id, id_matches: ids_match };
  },  // Ends scope.examinePageID()

  processVar: async function ( scope, { var_data, id }) {
    /* Non-recursive function to set as many variables as possible before
    * reaching the terminal page. Important to avoid recursion because of async ops. */
    let a_var_was_found = false;

    let remaining_vars = [];
    let fields_to_set = [];
    // Loop through setting all vars that can be set. Also collect all
    // remaining unused vars for later.
    for ( let row of var_data ) {
      // Store a list of all the variables on the page
      let { handle, tag, type } = await scope.getField( scope, {
        var_name: row.var,
        choice_name: row.choice,
        set_to: row.value,
      });
      if ( handle ) {
        if ( (tag === 'CANVAS') && row.value === '/sign' ) {
          // A signature field on a signature page is the only field on that page
          fields_to_set.push({ row, handle, tag, type });
          // Get the rest of the variables before...
          remaining_vars = remaining_vars.concat( var_data.slice( var_data.indexOf(row) + 1 ));
          // ...stopping the loop so no more /sign rows are gathered
          break;
        } else {
          fields_to_set.push({ row, handle, tag, type });
        }
      } else {
        remaining_vars.push( row );  // keep remaing vars around for future pages
      }
    }  // ends for every variable in the table

    // Loop through fields until no more fields are getting used up -
    // each field could reveal other `show if` fields that would then get used.
    // +1 triggers `while` the first time
    let prev_length = fields_to_set.length + 1;
    while ( prev_length > fields_to_set.length && fields_to_set.length > 0 ) {

      prev_length = fields_to_set.length;
      // Go through each field on the page, seeing if you can set its variable
      let remaining_fields = [];
      for ( let field_i = 0; field_i < fields_to_set.length; field_i++ ) {
        let field = fields_to_set[field_i];
        let { row, handle, tag, type } = field;
        // We will only continue after setting all other possible fields (see next loop)
        if ( tag === 'BUTTON' && type === 'submit' ) {
          remaining_fields.push( field );
          continue;
        }

        // Try to set other types of fields
        let not_disabled = await scope.setVariable( scope, { handle, set_to: row.value });
        if ( not_disabled ) {
          process.stdout.write(`\x1b[36m${ '*' }\x1b[0m`);  // assumes var was set if no error occurred
        } else {
          // If the field wasn't found, keep it around
          remaining_fields.push( field );
        }
      }  // ends for every field on the page
      
      // Try to loop through whatever's left
      fields_to_set = remaining_fields;
    }  // ends while fields are still being set

    // Press a continue button with a variable name if it exists
    let already_continued = false;
    for ( let data_i = 0; data_i < fields_to_set.length; data_i++ ) {
      let { handle, tag, type, row } = fields_to_set[ data_i ];
      if ( tag === 'BUTTON' && type === 'submit' ) {
        let page_url = await scope.page.url();
        await scope.setVariable( scope, { handle, set_to: row.value });
      
        // Have to catch errors right now or may get stuck in an infinite loop?
        // TODO: Don't catch errors - maybe the developer expected/wanted an error
        // For now they'll have to stop the story table early and do the rest the slow way
        // TODO: Discuss: add the option of throwing when an error happens? Per page?

        // Make sure no system or user error messages appear
        // Discuss moving this out of here. Having to pass in `id` just for
        // these messages smells bad. Con: Already a lot of code out there.
        let error = await scope.waitUntilContinued( scope, { url: page_url, id, remaining_vars });
        if ( error.was_found ) {
          await scope.throwPageError( scope, { remaining_vars: remaining_vars, id: id });  
        }

        already_continued = true;
        process.stdout.write(`\x1b[36m${ 'v' }\x1b[0m`);  // pressed button successfully

        // Quickly remove that variable from the list. See https://stackoverflow.com/a/638404.
        // This wasn't premature optimization when it was being developed, why waste it now.
        fields_to_set[ data_i ] = fields_to_set[ fields_to_set.length - 1 ];
        fields_to_set.pop();
        break;
      }
    }

    // Add the leftovers back in case they get used later on
    for ( let field_data of fields_to_set ) {
      remaining_vars.push( field_data.row );
    }

    // If didn't already press a continue button, press one now.
    if ( !already_continued ) {
      // All fields on this page should be taken care of
      let page_url = await scope.page.url();
      await scope.continue( scope );
      // Have to catch errors right now or may get stuck in an infinite loop?
      // TODO: Don't catch errors - maybe the developer expected/wanted an error
      // For now they'll have to stop the story table early and do the rest the slow way
      // TODO: Discuss: add the option of throwing when an error happens? Per page?

      // Make sure no system or user error messages appear
      // Discuss moving this out of here. Having to pass in `id` just for
      // these messages smells bad. Con: Already a lot of code out there.
      let error = await scope.waitUntilContinued( scope, { url: page_url, id, remaining_vars });
      if ( error.was_found ) {
        await scope.throwPageError( scope, { remaining_vars: remaining_vars, id: id });  
      }

      process.stdout.write(`\x1b[36m${ '>' }\x1b[0m`);  // continued successfully
    }  // ends if !already_continued

    return remaining_vars;
  },  // Ends scope.processVar()

  waitUntilContinued: async function ( scope, { url = '', remaining_vars = {}, id = '' }) {
    /** Given a url, attempt to continue until the page url changes or an error
        is found. Return the error object no matter what. */
    let prev_url = url;
    let curr_url = await scope.page.url();
    let error = await scope.checkForError( scope );

    let timedOut = false;  // Lazy timeout?
    let cont_timeout = setTimeout(function(){ timedOut = true }, scope.timeout);

    // Attempt to solve weird race condition issues where page has not properly continued
    while ( curr_url === prev_url && !error.was_found && !timedOut ) {
      await scope.page.waitFor( 50 );
      curr_url = await scope.page.url();
      error = await scope.checkForError( scope );
    }

    let timeout_err_message = `The test tried to continue to the next page, but it took` +
      ` longer than ${ (scope.timeout/1000)/60 } min. See the screenshot. The question id` +
      ` was "${ id }". The remaining variables are ${ JSON.stringify(remaining_vars) }.`
    expect( timedOut, timeout_err_message ).to.be.false;
    clearTimeout( cont_timeout );

    return error;
  },  // Ends scope.waitUntilContinued()

  checkForError: async function ( scope ) {
    /* Returns whether any system or user error elements were found and, if so,
    * returns those elements. The error elements are probably exclusive, but
    * we're not sure. */

    // All results are lists to match `$x`
    let possible_errors = {
      complex_user_error: await scope.page.$$('.alert-danger'),
      // The below does not work if there's not a space betweein ':' and 'none'
      simple_user_error: await scope.page.$x(`//*[contains(@class, "da-has-error")][not(contains(@style,"display: none"))]`),
      system_error: await scope.page.$x( '//meta[@content="docassemble: Error"]' ),
    };

    let error_handlers = {};
    let was_found = false;
    for ( let error_key in possible_errors ) {
      if ( possible_errors[ error_key ][0] ) {
        if ( env_vars.DEBUG ) { await scope.page.waitFor( 60 * 1000 ); }
        was_found = true;
        error_handlers[ error_key ] = possible_errors[ error_key ][0];
      }
    }

    return { was_found, error_handlers };
  },  // Ends scope.checkForError()

  throwPageError: async function ( scope, { error_handlers = {}, remaining_vars = {}, id = '' }) {
    /* Throw a cucumber error with the error that appeared on the page. */
    let was_system_error = error_handlers.system_error !== undefined;
    let sys_err_message = `The test tried to continue to the next page, but there was` +
      ` a system error. See the screenshot. The question id was "${ id }".` +
      ` The remaining variables are ${ JSON.stringify(remaining_vars) }.`
    expect( was_system_error, sys_err_message ).to.be.false;

    let was_user_error = true;  // Easier to read below?
    let user_err_message = `The test tried to continue to the next page, but` +
      ` the user got an error. See the screenshot. The question id was "${ id }".` +
      ` The remaining variables are ${ JSON.stringify(remaining_vars) }.`
    expect( was_user_error, user_err_message ).to.be.false;

    return scope;
  },  // Ends scope.throwPageError()
};
