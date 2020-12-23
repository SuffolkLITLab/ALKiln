const { expect } = require('chai');
const env_vars = require('./utils/env_vars');


let ordinal_to_integer = {
  only: 0, first: 0, second: 1, third: 2, fourth: 3, fifth: 4,
  sixth: 5, seventh: 6, eighth: 7, ninth: 8, tenth: 9,
  '1st': 0, '2nd': 1, '3rd': 2, '4th': 3, '5th': 4,
  '6th': 5, '7th': 6, '8th': 7, '9th': 8,'10th': 9,
};

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
    if ( navigated ) {  // if (winner.constructor.name === 'ElementHandle') {
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
      await detectDownloadComplete(scope, endTime);
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
    let base64_name = await scope.base64( scope, var_name );

    // Will catch some radio and checkbox inputs too, which will then be rejected
    // Note: I think `showif`s with `code` don't use `data-saveas`
    let to_manipulate = await Promise.race([
      scope.page.waitForSelector(`button[name="${base64_name}"][value="${value}"]`),  // button
      scope.page.waitForSelector(`:not(button)[name="${base64_name}"]`),  // others (not showif)
      scope.page.waitForSelector(`*[data-saveas="${base64_name}"] input`),  // text input showif
      scope.page.waitForSelector(`*[data-saveas="${base64_name}"] textarea`),  // textarea showif
      scope.page.waitForSelector(`*[data-saveas="${base64_name}"] select`),  // select showif/hideif
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
    scope.page.setDefaultTimeout(30 * 1000);  // Really just to give a bit more time for the server to load

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

    // All the possible variations of name attribute values
    let base64_name = await scope.base64( scope, var_name );
    let base64_id_of_first_choice = base64_name + '_0';
    let { name_attr_B, name_attr_R } = await scope.checkboxNameAttribute( scope, var_name, choice_name );

    // Note: I think `showif`s with `code` don't use `data-saveas`
    // Note: Choices created without variable names cannot be language agnostic

    // `$x` always gives a list, so just make sure all results are lists
    let all_attempts = [
      await scope.page.$$(`button[name="${ base64_name }"][value="${ choice_name }"]`),  // button
      await scope.page.$$(`button[name="${ base64_name }"][value="${ set_to }"]`),  // button
      await scope.page.$$(`*[data-saveas="${ base64_name }"] input`),  // text input showif
      await scope.page.$$(`*[data-saveas="${ base64_name }"] textarea`),  // textarea showif
      await scope.page.$$(`*[data-saveas="${ base64_name }"] select`),  // select showif/hideif
      // Radios and checkboxes
      // radio: `name` = base64 var name, `choice_name` = var name of choice
      // `yesno`/`noyes` checkbox: `name` = base64 var name, choice always 'True'
      // checkbox: `name` = base64 var name + stuff + base64 choice var name + stuff (see function)
      await scope.page.$$(`input[name="${ base64_name }"][value="${ choice_name }"]`),  // radio
      await scope.page.$$(`*[data-saveas="${ base64_name }"] input[value="${ choice_name }"]`),  // radio showif
      await scope.page.$$(`input[name="${ base64_name }"][value="True"]`),  // yesno/noyes checkbox
      await scope.page.$$(`*[data-saveas="${ base64_name }"] input[value="True"]`),  // yesno/noyes checkbox showif
      // Finds the group by looking for the first checkbox in the group using id, then works its way back out again
      // 'none of the above' checkbox showif???
      await scope.page.$$(`input[name="${ name_attr_B }"]`),  // checkbox
      await scope.page.$$(`input[name="${ name_attr_R }"]`),  // checkbox alt
      // await scope.page.$$(`*[data-saveas="${name_attr_B}"]`),  // checkbox showif?
      // await scope.page.$$(`*[data-saveas="${name_attr_R}"]`),  // checkbox alt showif?

      // Put these two last so they'll come last in the loop and won't override other options
      await scope.page.$x(`//input[@id="${ base64_id_of_first_choice }"]/ancestor::fieldset//input[contains(@class,"danota-checkbox")]`),  // 'none of the above' checkbox
      await scope.page.$$(`:not(button)[name="${ base64_name }"]`),  // others (not showif)
    ];

    for ( let attempt of all_attempts ) {
      // There really should be only one anyway, but they're all lists
      if ( attempt[0] ) {
        let tag = await attempt[0].evaluate( elem => { return elem.tagName; });
        return { handle: attempt[0], tag: tag };
      }
    }

    // If we get out of the for loop, we didn't find the element
    return { handle: null, tag: null };

  },  // Ends scope.getField()

  setField: {
    BUTTON: async function ( scope, { handle, set_to }) { await scope.tapElement( scope, handle ); },
    TEXTAREA: async function ( scope, { handle, set_to }) {
      await scope.setText( scope, { handle, set_to });
      await scope.afterStep(scope);  // No showifs for this one?
    },
    SELECT: async function ( scope, { handle, set_to }) {
      await handle.select( set_to );
      await scope.afterStep(scope, { waitForShowIf: true });
    },
    CANVAS: async function ( scope, { handle, set_to }) {
      await scope.sign( scope, { handle });
      await scope.afterStep( scope );
    },
    INPUT: async function ( scope, { handle, set_to }) {
      /* Set value of some `input` element to the given value */

      let type = await handle.evaluate( elem => { return elem.getAttribute('type'); });
      if ( type === `radio` || type === `checkbox` ) {

        let [label] = await handle.$x(`following-sibling::label`);
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
    await handle.type( set_to );
  },

  sign: async function ( scope, { handle }) {
    /* Draw in a canvas element NOTE: Signature pages do not have the
    * signature's variable name on the page. That seems to be intentional,
    * though the reasoning hasn't become clear yet. */
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

    // What are good names for these properties?
    // question_has_id? found_any_id?
    // class_matches_id? class_and_id_do_match? id_and_page_id_match?
    return { question_has_id: found_any_question_id, id: id, id_matches: ids_match };
  },  // Ends scope.examinePageID()

  processVar: async function ( scope, { how_many, var_data, id }) {
    /* Non-recursive function to set as many variables as possible before
    * reaching the terminal page. Important to avoid recursion because of async ops. */

    let a_var_was_found = false;

    let remaining_vars = [];

    // Loop through setting all vars that can be set. Also collect all
    // remaining unused vars for later.
    for ( let row of var_data ) {

      // Try to find this varible on the current page
      let var_name = row.var;
      let choice_name = row.choice;
      let set_to = row.value;

      // Must handle signature outside of general detection of fields or it
      // will eat up vars. This is because signature fields don't have their
      // variable name anywhere in them, so we have to just assume the variable
      // name is correct every single time we see a signature field. Because
      // of how we must detect the need to hit 'continue', all remaining vars
      // will be looped through and get 'found', removing them from the table.
      let is_signature_page = await scope.page.$('.dasignature');
      if ( set_to.includes('/sign') && is_signature_page ) {
        a_var_was_found = true;  // Even though it doesn't have a proper var name

        let handle = await scope.page.waitForSelector(`#dasigcanvas`);
        // await scope.page.waitFor( 500 );  // Wait extra long for a signature canvas to load
        // let handle = await scope.page.$(`#dasigcanvas`);  // signature
        await scope.sign( scope, { handle });

        process.stdout.write(`\x1b[36m${ '~' }\x1b[0m`);  // signed
        continue;
      }

      let { handle, tag } = await scope.getField( scope, { var_name, choice_name, set_to });
      // If an element matching the variable is found
      if ( handle ) {
        a_var_was_found = true;
        await scope.setField[ tag ]( scope, { handle, set_to });
        process.stdout.write(`\x1b[36m${ '*' }\x1b[0m`);  // var was set
        // Must not continue to the next page in here - Ex: if we want to
        // answer three questions, but only one is required, we'll miss two.
      } else {
        // Remember any variable that wasn't found yet
        remaining_vars.push( row );
      }
    }  // ends for every variable in the table

    // Discuss moving this out of here. Having to pass in `id` just for
    // these messages smells bad. Con: Already a lot of code out there.
    if ( !a_var_was_found ) {
      // if no given vars are on this page we should be done with this page
      // and able to continue. This is true even after we've just tapped a button.
      await scope.continue( scope );

      // Make sure no system or user error messages appear
      let { error_found, error_handlers } = await scope.checkForError( scope );

      let was_system_error = error_found && error_handlers.system_error !== undefined;
      let sys_err_message = `There was a system error. See the screenshot. The question id was "${ id }". ` +
        `The remaining variables are ${ JSON.stringify(remaining_vars) }.`
      expect( was_system_error, sys_err_message ).to.be.false;

      let user_err_message = `The user got an error. See the screenshot. The question id was "${ id }". ` +
          `The remaining variables are ${ JSON.stringify(remaining_vars) }.`
      expect( error_found, user_err_message ).to.be.false;

      process.stdout.write(`\x1b[36m${ '>' }\x1b[0m`);  // continued successfully
    }  // ends if !a_var_was_found

    return remaining_vars;
  },  // Ends scope.processVar()

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
    let error_found = false;
    for ( let error_key in possible_errors ) {
      if ( possible_errors[ error_key ][0] ) {
        if ( env_vars.DEBUG ) { await scope.page.waitFor( 60 * 1000 ); }
        error_found = true;
        error_handlers[ error_key ] = possible_errors[ error_key ][0];
      }
    }

    return { error_found, error_handlers };
  },
};
