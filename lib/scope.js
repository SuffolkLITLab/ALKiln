const { expect } = require('chai');
const cheerio = require('cheerio');
const safe_filename = require("sanitize-filename");

const env_vars = require('./utils/env_vars');


let ordinal_to_integer = {
  only: 0, first: 0, second: 1, third: 2, fourth: 3, fifth: 4,
  sixth: 5, seventh: 6, eighth: 7, ninth: 8, tenth: 9,
  '1st': 0, '2nd': 1, '3rd': 2, '4th': 3, '5th': 4,
  '6th': 5, '7th': 6, '8th': 7, '9th': 8,'10th': 9,
};

let escape_regex = function( to_escape ) {
  // https://stackoverflow.com/a/3561711
  return to_escape.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

let proxies_regex = /(\bx\.)|(\bx\[)|(\[[ijklmn]\])/g;

module.exports = {
  addToReport: async function( scope, { key, value }) {
    /* Add an item to a specific list in a scenario's report.
    * 
    * The report has a key for each scenario and each of those
    * keys should correspond to a list containing the relevant data. */
    if ( env_vars.DEBUG ) { console.log(`Report: key: ${ key }, value: ${ value }`) }

    if ( !scope.report ) { scope.report = {}; }
    if ( !scope.safe_id ) { scope.safe_id = `_report_${ Date.now() }` }
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

  getSafeScenarioFilename: async function( scope, { prefix='' }) {
    /* Return a string with `prefix` at the start and scenario info at the end,
    * made safe for a filename. We hope it can contain chinese chars and such.
    * No suffix because it may be cut off when we ensure the string is not too
    * long. */

    // Make sure the strings ends in at least one '_', but don't add extra '_'
    if ( prefix ) { prefix = `${ prefix.replace(/_$/, '') }_`; }
    else { prefix = ''; }  // Enure it's a string

    let lang = scope.language;
    if ( lang ) { lang = `${ lang.replace(/_$/, '') }_`; }
    else { lang = ''; }

    let safe_name = safe_filename(`${ prefix }${ lang }${ Date.now() }_${ scope.safe_id }`, { replacement: `_` });
    let safer_name = safe_name.substring(0, (255 - 10));  // Allow room for extensions
    return safer_name;
  },  // Ends scope.getSafeScenarioFilename()

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

    // Use a while loop until the below does not error with `Error: Execution context was destroyed`
    // Temporary fix for race condition. See https://github.com/plocket/docassemble-cucumber/issues/190
    let error_id_elem;
    while ( true ) {
      try {
        // Waiting for `page` to exist. '#da-retry' does not need to exist, it's incidental at this point.
        error_id_elem = await scope.page.$('#da-retry');
        break;
      } catch ( err ) {}
    }

    // If there's a system error, throw it
    if ( error_id_elem ) {
      let error_elem = await scope.page.$('blockquote')
      let error_handle = await error_elem.getProperty( 'textContent' );
      let error_text = await error_handle.jsonValue();

      throw error_text;
    }

    // RESET
    if ( options.navigated ) { scope.navigated = true; }  // Consider `daPageLoad` event
    else { scope.navigated = false; }

    // WAITING
    if ( options.waitForShowIf ) { await scope.waitForShowIf(scope); }
    // Plain old waiting. Yeah, I abstracted it into here so only
    // one thing was being called at the end
    if ( options.waitForTimeout ) { await scope.page.waitFor( options.waitForTimeout ); }
  },  // Ends afterStep

  tapElement: async function tapElement(scope, elem) {
    /* Tap a given element, detect navigation, and do appropriate related things. */
    expect( elem, 'That element cannot be found, so it cannot be tapped.' ).to.exist;

    let start_url = await scope.page.url()

    let winner;
    winner = await Promise.race([
      Promise.all([  // Error loads page, so no need to detect to keep things short
        // Click with no navigation will end immediately
        elem[ scope.activate ](),
        scope.page.waitForNavigation({waitUntil: 'domcontentloaded'}),
      ]),
      scope.page.waitForSelector('.alert-danger'),
      scope.page.waitForSelector('.da-has-error'),
    ]);

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
    let base64_var_name = await scope.toBase64( scope, { utf8_str: var_name });

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
    tagName = tagName.toLowerCase();

    if ( tagName === `button` ) {  // Tap buttons
      await scope.tapElement( scope, to_manipulate );

    } else if ( tagName === `select` ) {  // Choose drop-down option
      await to_manipulate.select(value);

    } else if ( tagName === `input` || tagName === `textarea` ) {
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

    file_name = file_name.endsWith('.yml') ? file_name.substring(0, file_name.length - 4) : file_name;
    let interview_url = `${ env_vars.getBaseInterviewURL() }${ file_name }.yml`;
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

  normalizeTable: async function ( scope, { var_data }) {
    /* Return data derived from cucucmber table object or array.
    * Table must have headers. Arrays are not supported. */

    // Support tables with no 'trigger' column
    let supported_table = [];
    for ( let row of var_data ) {
      // See tests > unit_tests > tables.fixtures.js > tables.old_to_current_formatting
      let result = {
        original: row,
        // Give fake data if needed to prevent some kind of hidden input field from being found
        // See bug at https://github.com/plocket/docassemble-cucumber/issues/79
        // May be able to remove this once converted to `getAllFields`
        var: row.var || 'al_no_var_name',
        value: row.value,
        trigger: row.trigger || '',
        times_used: 0,
      }

      supported_table.push( result );
    }

    if ( env_vars.DEBUG ) { console.log( 'normalized table:', JSON.stringify( supported_table )); }

    return supported_table;
  },  // Ends scope.normalizeTable()

  getAllFields:  async function ( scope, { html }) {
    /* Given HTML string of a page, returns a list of all the fields in it
    *  as some kind of sophisticated data? With their selectors, for example.
    *  We will choose selectors that will continue to identify the node, eve
    *  after a hidden field is revealed, etc.
    *  TODO: Not sure where to bring in cheerio
    *  TODO: Pass in `$` instead? */
    let fields = [];

    const $ = cheerio.load( html );  // Could this be on `scope`?

    // Get trigger var
    // This is the new trigger var element that developers will have to add to their interviews.
    // AssemblyLine will add it automatically unless someone overrides the values in their own interview.
    // See the report message to the dev below for a link to an example.
    let encoded_trigger_var = $($( `#trigger` )).data( `variable` );  // This should come out to 'None' at the very least
    if ( !encoded_trigger_var ) {
      // TODO: Add documentation and then link to it in this message.
      await scope.addToReport(scope, { key: 'ids', value: `Warning: You are missing an element containing the data for the page's trigger variable. Some fields, like loops with index variables, may not work correctly in these tests. Talk to the folks at the AssemblyLine project to learn more or see an example here: https://github.com/plocket/docassemble-ALAutomatedTestingTests/blob/ad1232049d7ca7a9b97b22f8ca3915dd3dae8114/docassemble/ALAutomatedTestingTests/data/questions/all_tests.yml#L6-L10.` });
      encoded_trigger_var = await scope.toBase64( scope, { utf8_str: `None` });
    }
    let trigger = await scope.fromBase64( scope, { base64_str: encoded_trigger_var });

    
    // Some `show if` fields have `names` like '_field_n' instead of their var name. Ex: _field_1
    let field_like_names = await scope.getFieldNamesDict( scope, { $: $ });

    // All the different types of fields
    // buttons, canvases, inputs of all kinds, selects (dropdowns), textareas. Are there more?
    // Will deal with `option` once inside `select`
    let all_nodes = $( `#dasigpage, fieldset button, .daquestionactionbutton, fieldset input, .form-group input, .form-group select, .form-group textarea` );
    for ( let node of all_nodes ) {
      // Decision: Do not abstract the below. There's too much data to pass around for it to make sense
      let $node = $( node );
      let field_data = {
        selector: '',
        tag: node.name,
        guesses: [],
        type: '',
        trigger: trigger,
      };
      if ( node.attribs.type ) { field_data.type = node.attribs.type; }

      // canvas elements are the only field on a signature page
      if ( $(`#dasigpage`).length > 0 && $(`#dasigpage`)[0].name ) {
        field_data.selector = `#daquestion canvas`;
        field_data.tag = `canvas`;
        field_data.guesses = [{
          var: trigger,
          value: '/sign',
        }];
        fields.push( field_data );
        continue;
      }
      
      // The selector we'll use to set the DOM node's value later
      field_data.selector = await scope.getFieldSelector( scope, { $, node });

      // Often used in the variable name
      let encoded_name = $node.attr( `name` );
      // Action buttons keep their var name in a unique place
      if ( $( node ).hasClass( 'daquestionactionbutton' )) {
        let href = node.attribs.href;
        let match = href.match( /action=([^&]*)/ );
        if ( match ) {
          encoded_name = match[1];
        } else {
          // Some action buttons just use urls instead of da actions
          encoded_name = href.replace(/^[A-Za-z0-9]*/, '_');
        }
      }

      // ====================
      // Table rows
      // ====================
      // Default values
      let var_names = await scope.getPossibleVarNames( scope, {
        encoded: encoded_name,
        field_like_names,
        nota: false,  // none of the above (detected and overwritten later)
      });
      
      if ( $node.hasClass('danota-checkbox') || $node.parents(`.da-field-container-datatype-object_radio`).name ) {
        // 'None of the above' fields must find var name info from siblings' attributes
        let first_sib = $(node.parent).find( 'input' )[0];
        var_names = await scope.getPossibleVarNames( scope, {
          encoded: first_sib.attribs.name,
          field_like_names,
          nota: true,  // none of the above
        });
      }

      // button, radio, checkbox yesno, and maybe others need the value of the `value` attribute
      let values = [];
      if ( node.name === `select` ) {
        values = await scope.getOptionValues( scope, { $select: $node });
      }
      if ( values.length === 0 && node.attribs.value ) {
        // TODO: Add links to docs about da YAML values that devs never fill in themselves and
        // so don't know what they are. E.g. yesnomabye -> True/False/None.
        // TODO: Text inputs and textareas must ignore the value, etc. How?
        values.push( node.attribs.value );
      }

      field_data.guesses = await scope.getPossibleTableRowMatchers( scope, { var_names, values });
      fields.push( field_data );
    }  // ends for every node

    if ( env_vars.DEBUG ) { console.log( `page fields:\n${ JSON.stringify( fields )}`); }
    return fields;
  },  // Ends scope.getAllFields()

  getFieldSelector: async function ( scope, { $, node }) {
    /* Given the page object and the node object, return the selector
    * we'll use to set the field's value later. Excludes `canvas`.
    * 
    * What shall we select? Checkbox and radio input elements are
    * hidden and puppeteer does not interact with hidden elements, so
    * it would need their labels. Should we still get the `input`
    * nodes and use `.click()` them ourselves? Is there a downside?
    * 
    */
    // This even gets something unique enough for 'none of the above' checkboxes
    let selector = `${ node.name }`;   // element tag
    if ( node.attribs.name ) { selector += `[name="${ node.attribs.name }"]`; }
    if ( node.attribs.value ) { selector += `[value="${ node.attribs.value }"]`; }
    if ( node.attribs.id ) { selector += `[id="${ node.attribs.id }"]`; }
    if ( node.attribs.class ) { selector += `[class="${ node.attribs.class }"]`; }
    if ( $( node ).attr( 'data-linknum' )) { selector += `[data-linknum="${ $( node ).attr( 'data-linknum' ) }"]`; }
    selector = '#daquestion ' + selector;

    // Make sure this selector matches only one node
    let matching_nodes = $( selector );
    // This check is here to ensure saftey of future development. If there is more
    // or less than one match, this code may have unexpected behavior later.
    // Really need everything to be unique here if at all possible. Shall we resort
    // to parents and n-th child?
    if ( matching_nodes.length > 1 ) {
      let message = `${ matching_nodes.length } items on this page matched the base64 encoded name '${ selector }'. You may be setting the same variable in multiple places on this page.`;
      await scope.addToReport(scope, { key: 'ids', value: message });
      console.warn( `\n${ message }\n` );
    }

    return selector;
  },  // Ends scope.getSelector()

  getPossibleTableRowMatchers: async function ( scope, { var_names, values }) {
    /* Return variable names and values combined in ways that can
    * try to match table rows. Tables can have two properties:
    * variable name and value. */
    let possible_table_rows = [];
    for ( let var_name of var_names ) {
      // Inputs like textareas don't have values
      if ( values.length > 0 ) {
        for ( let value of values ){
          possible_table_rows.push({ var: var_name, value, });
        }
      } else {
        possible_table_rows.push({ var: var_name, value: '', });
      }
      
    }  // end iterate through row possibilities

    return possible_table_rows;
  },  // Ends scope.getPossibleTableRowMatchers()

  getFieldNamesDict: async function ( scope, { $ }) {
    /* Returns an object containing a map of the `_field_n` names and
    * their matching variable names. If none exist, returns an empty object.
    * 
    * `show if` fields have `_field_n` in the DOM instead of their var name,
    * e.g. `_field_2`. Fortunately, there's a da DOM node that contains
    * a map between such a string and the actual var name.
    * See https://github.com/plocket/docassemble-cucumber/issues/173
    * Example: { _field_0: 'some_checkbox_field' }
    */
    if ( !$('input[name="_varnames"]')[0] ) { return {}; }

    let field_like_names = {};
    let field_like_names_encoded = $('input[name="_varnames"]')[0].attribs.value;
    let field_like_names_str = await scope.fromBase64( scope, { base64_str: field_like_names_encoded });
    let field_like_names_json = JSON.parse( field_like_names_str );
    for ( let field_like_key in field_like_names_json ) {
      let field_like_DOM_name = await scope.fromBase64( scope, { base64_str: field_like_key });
      let field_like_var_name = await scope.fromBase64( scope, { base64_str: field_like_names_json[ field_like_key ]});
      field_like_names[ field_like_DOM_name ] = field_like_var_name;
    }

    return field_like_names;
  },  // Ends scope.getFieldNamesDict()

  getPossibleVarNames: async function ( scope, { encoded, field_like_names, nota }) {
    /* Given a base64 encoded string and a map of `_field_n` to var names, return
    * the decoded possible var names and, sometimes, values that the
    * encoded string could be. Only some node names actually use `_field_n`.
    * 
    * They might not be the actual var and value names. They might
    * be proxy names (e.g. thing[i]). Can we think of a better name for them?
    * 
    * TODO: Check if base64-encoded strings could be indicated somehow in their
    * encoded string. Like ending in _base64 or _64
    * TODO: We'll probably eventually have to search for `[B'encoded']` and such
    * iteratively to get all of them. Hasn't cropped up yet, though.
    *  
    *  @param encoded {str} - base64 encoded string of the node
    *  @param field_like_names {obj} - e.g. `{ _field_0: 'some_checkbox_var_name' }`
    *  @param nota {bool} - is the field a 'none of the above' field? */
    let var_names = [];
    let var_name = '';

    // E.g. continue buttons that don't set a variable
    if ( encoded === undefined ) { return var_names; }

    // Names can be encoded multiple times, so start peeling the layers
    let layer_1_decoded = await scope.fromBase64( scope, { base64_str: encoded });
    // If this is of the format `_field_n`, we need to get the actual matching var name.
    if ( field_like_names[ layer_1_decoded ] ) {
      layer_1_decoded = field_like_names[ layer_1_decoded ];
    }

    try {
      let action_button_json = JSON.parse( layer_1_decoded );
      if ( action_button_json.action ) { layer_1_decoded = action_button_json.action }
    } catch ( error ) {
      // Things that are not action buttons can't be parsed this way.
      // A special error for action buttons requires passing the node in here too, which is a lot to pass in.
      // TODO: Should we move this back into `getAllFields()`?
    }

    // A lot of checkbox fields have a key hidden inside them. (not yesno type checkboxes)
    let checkbox_match = layer_1_decoded.match( /^(.*)\[[BR]'(.*)'\]/ );

    // One option would be to now combine the two parts again without
    // the extra letter: z["y"]. That would more closely match the JSON value
    // and may or may not make it easier to generate the table. It would
    // also reduce the table to two columns. On the other hand, the da
    // YAML file shows these two as separate parts. Less experienced devs
    // or those writing tests by hand may find that more obscure. We're
    // really developing this for less experienced devs, so for now we'll
    // keep going with the three-column layout.

    // Of the format `foo[B'encoded']` or `foo[R'encoded']`
    // What about something like foo[R'encoded1'][B'encoded2']? Is that a
    // thing? Can they be index numbers? Or just `foo['encoded1']`? What
    // would their format be? The above? `foo[R'actual_choice'][B'encoded']`?
    // `foo['something'][B'encoded']`?

    // =====================
    // Ex: checkboxes_choices[B'Y2hlY2tib3hfb3RoZXJfb3B0XzI']
    // Ex: checkboxes_choices[R'Y2hlY2tib3hfb3RoZXJfb3B0XzI']
    if ( checkbox_match ) {

      let key_or_name = checkbox_match[1];
      // If this is of the format `_field_n`, we need to get the actual matching var name.
      if ( field_like_names[ key_or_name ] ) {
        var_name = field_like_names[ key_or_name ];
      } else {
        var_name = key_or_name;
      }

      // Our own marker for a 'none of the above' checkbox choice
      if ( nota ) { var_names.push( `${ var_name }['None']` ); }
      else {
        // Get the choice name. E.g. option_1, option_2
        let box_layer_1_decoded = await scope.fromBase64( scope, { base64_str: checkbox_match[2] });
        var_names.push( `${ var_name }['${ box_layer_1_decoded }']` );

        try {
          // The part inside `[B'encoded']` could need one more decoding (or more?)
          // It may have invalid chars if it's not a one-word var name, though, like '_'
          let box_layer_2_decoded = await scope.fromBase64( scope, { base64_str: box_layer_1_decoded });
          var_names.push(`${ var_name }['${ box_layer_2_decoded }']`);
        } catch ( err ) {}  // It wasn't double encoded. Do nothing.
      }

    // =====================
    // Otherwise, just the var name (non checkboxes or yesno checkbox type things)
    } else {
      var_name = layer_1_decoded;
      var_names.push(`${ layer_1_decoded }`);
      // // Values are sometimes encoded multiple times (check this happens with a plain var name)
      // let layer_2_decoded = await scope.fromBase64( layer_1_decoded );
      // names.var_names.push( layer_2_decoded );
    }

    return var_names;
  },  // Ends scope.getPossibleVarNames()

  getOptionValues: async function ( scope, { $select }) {
    /* Returns all the option node values of the select node. */
    let options = [];
    let option_nodes = $select.find( `option` );
    for ( let opt of option_nodes ) {
      options.push( opt.attribs.value );
      // Dropdown options created with objects will be encoded
      let decoded = await scope.fromBase64( scope, { base64_str: opt.attribs.value });
      options.push( decoded );
    }
    // TODO: These may be encoded? Just 'decode' and append those vals too.
    // TODO: Keep those decoded values somewhere for setting the right
    // option in the DOM. Not sure how that can be put together sensically.
    return options;
  },  // Ends scope.getOptionValues()

  fromBase64: async function ( scope, { base64_str }) {
    let buffer = Buffer.from( base64_str, 'base64' );
    return buffer.toString( `utf-8` );
  },

  toBase64: async function ( scope, { utf8_str }, exclude_padding=true) {
    // Sometimes, converting to base64 results in padding characters ('=')
    // being added to the end. Docassemble does not use these padding
    // characters everywhere, so we allow for stripping them using 
    // the exclude_padding argument. For more details, see
    // https://github.com/nodejs/node/issues/6107#issuecomment-207177131
    let buffer = Buffer.from( utf8_str, 'utf-8' );
    let base64str = buffer.toString( `base64` )
    return exclude_padding ? base64str.replace(/=/g, '') : base64str;
  },


  // TODO: Maybe add `from_story_table` to the var data table (array...)
  getMatchingRows: async function ( scope, { field, var_data }) {
    /* Given var_data, a list of objects with variable data for
    * setting fields, and an object for a DOM field, returns list of the
    * rows that match the DOM field. That list of story table rows may be empty.
    * 
    * @param var_data {arr} - fields and the values they can be set to
    * @param var_data[n].var {str} - name of variable to set
    * @param var_data[n].value {str} - choice to set or value to set
    * @param var_data[n].trigger {str} - the variable that triggered the
    *    page to be shown
    * 
    * @param field - data representing one DOM field
    * @param field[n].selector {str} - used to find the DOM node
    * @param field[n].tag {str} - HTML tag of node
    * @param field[n].type {str} - HTML type of node if it has one
    * @param field[n].guesses {arr} - arr of objects that could
    *    possibly match a table row
    * @param field[n].guesses[n].var {str} - name of variable
    * @param field[n].guesses[n].value {str} - value of a choice
    * @param <field[n].guesses[n].trigger> {str} - var name that triggered this page
    * 
    * @returns [ var_data[n] ]
    */
    let matches = [];
    let uses_proxies = false;

    // There are mutliple guesses because field names are encoded
    for ( let guess of field.guesses ) {
      for ( let var_datum of var_data ) {
        let row_matches = false;

        // If the dev uses single instead of double quotes, etc, allow that
        let names_match = await scope.matchNeutralizedQuotes( scope, { value1: guess.var, value2: var_datum.var });
        let values_match = await scope.matchNeutralizedQuotes( scope, { value1: guess.value, value2: var_datum.value });

        // Check different things for different fields. An input box won't
        // be expected to have the same value as the var you want to set while
        // a radio button and its table row need to have a matching value.
        switch ( field.tag ) {
          case 'button':
          case 'select':
            if ( names_match && values_match ) { row_matches = true; }
            break;

          case 'canvas':
          case 'textarea':
          case 'a':
            if ( names_match ) { row_matches = true; }
            break;

          case 'input':
            if ( field.type === 'radio' ) {
              if ( names_match && values_match ) { row_matches = true; }
            } else {  // Some kind of text input
              if ( names_match ) { row_matches = true; }
            }
            break;
        }

        if ( row_matches ) {
          matches.push( var_datum );  // Collect all matches to start with.
          if ( !uses_proxies ) {  // If this gets set to `true` once, leave it alone
            // x, i, j, etc. See notes below about the reasoning
            // AVOID `.test()` - it advances through a string each time you call it on the
            // string, so you can have unexpected results.
            uses_proxies = guess.var.match( proxies_regex );  // 
          }
          continue;
        }

      }  // ends for each table row
    }  // ends for each field row possibility

    // Some fields will have multiple matches from the story table.
    // The only reason we would care about multiple story table row
    // matches is if there is a possible proxy var conflict.
    // When a dev has a loop with an index var or generic object,
    // the same variable name will be used over and over, e.g. `users[i]`.
    // That's what will be in the story table, so there will be multiple
    // matches for a field setting `users[i]`. For this program to
    // know which table row to use on which page, we need the one unique var that
    // will appear on the page - the trigger var. When a row with `users[i]`
    // has a trigger var that matches the page trigger var, the
    // program knows to use that row to set the value for that page.

    // If needed, only get the matches that also match the trigger var
    // For now, we're being flexible about it - if we don't think we
    // need that trigger var, we don't prevent data getting through.
    // e.g. If an interview has a list of `users`, but they only set
    // data for `users[0]`, there's no need to check the trigger var.
    // That way devs with simple cases can ignore the trigger var column.

    // If field uses proxies and there has been more than one match
    // we now use the trigger var to narrow down the matches.
    if ( uses_proxies && matches.length > 1 ) {
      // Multiple matches means this came from a story

      // Feedback for devs - we need the trigger var but we don't have it (field data)
      // TODO: Add docs and link to docs on how to add the trigger var
      if ( field.trigger === undefined ) { await scope.addToReport(scope, { key: 'ids', value: `WARNING: A field on this page uses an index variable or a generic object, but the page does not contain an element with the trigger variable's name. Tell the developer to add an element to the page with the id "trigger"` }); }

      let original_matches = matches;
      matches = [];
      for ( let match of original_matches ) {
        // Feedback for devs - we need the trigger var but we don't have it (var data)
        if ( match.trigger === undefined ) { await scope.addToReport(scope, { key: 'ids', value: `WARNING: A field on this page uses an index variable or a generic object. The test gave story data for setting the field, but that data is missing the trigger. Add a trigger variable to the story table \`trigger\` column. For now, the test may end up ignoring this field. The row's data is ${ JSON.stringify( match.original )}. The field's data is ${ JSON.stringify( field )}` }); }
          // TODO: Add a warning if they're both `undefined`?
        else {

          let triggers_match = await scope.matchNeutralizedQuotes( scope, { value1: field.trigger, value2: match.trigger });
          if ( triggers_match ) {
            matches.push( match );
          }
        }
      }
      // Feedback for devs - we are missing the matching triggers we need
      if ( matches.length === 0 ) { await scope.addToReport(scope, { key: 'ids', value: `WARNING: A field on this page uses an index variable or a generic object. The test gave multiple matches for the story data for the field, but none match the trigger variable. Is the story table missing a row? For now, the test will have to ignore this field. The rows' data is ${ JSON.stringify( original_matches )}. The field's data is ${ JSON.stringify( field )}` }); }
    }

    // Dev may have accidentally included a row more than once. Give them feedback
    if ( matches.length > 1 ) {
      let msg = `WARNING: there are multiple story data matches for this field. The story table data that appears last will be used. Here is the field's data: ${JSON.stringify( field )}`
      await scope.addToReport(scope, { key: 'ids', value: msg });
    }

    if ( env_vars.DEBUG ) { console.log( `matches:\n`, JSON.stringify( matches )); }
    return matches;
  },  // Ends scope.getMatchingRows()


  matchNeutralizedQuotes: async function ( scope, { value1, value2 }) {
    /* Returns true if value1 matches value2 when they're turned into
    * strings and single vs. double quote mismatches are neutralized. */
    let val_1_str = `` + value1;
    let val_2_str = `` + value2;
    let val_1_escaped = escape_regex( val_1_str );
    let val_1_regex = new RegExp(`^${ val_1_escaped.replace(/['"]/g, `['"]`)}$`);
    return val_2_str.match( val_1_regex );
  },  // Ends scope.matchNeutralizedQuotes()


  setVariable: async function ( scope, { field, var_data }) {
    /* Returns true if the field was set.
    *
    * TODO: Will the selector ever change the second time around?
    *   If so, we need to store the handles before this.
    * 
    * @returns bool
   */
    let row_used = null;

    let matching_input_rows = await scope.getMatchingRows( scope, { var_data, field });

    // Nothing to set if there are no matching table rows
    if ( matching_input_rows.length <= 0 ) { return row_used; }
    // Want this info for the report later
    field.matching_input_rows = matching_input_rows;

    // Take a while to load sometimes
    if ( field.tag === 'canvas' ) {
      await scope.page.waitForSelector('#dasigcanvas');
    }

    let handle = await scope.page.evaluateHandle(( selector, field ) => {
      let elem = document.querySelector( selector );
      // `elem` has never been null
      if ( elem.nextSibling && elem.nextSibling.tag === `label` ) {
        return elem.nextSibling;
      } else { return elem; }
    }, field.selector, field );

    let disabled = await handle.evaluate(( elem )=> {
      // da's header covers the top of the section containing the fields which means
      // sometimes it blocks nodes from clicks. Scroll item to the bottom instead.
      if ( !elem.disabled ) { elem.scrollIntoView(false); }
      return elem.disabled;
    });

    // If field is disabled, don't set it yet
    if ( disabled ) { return row_used; }

    if ( env_vars.DEBUG ) {
      let name = await handle.evaluate(( elem ) => {  // Not using this right now
        try { elem.nextSibling.style.background = 'Khaki'; }
        catch(err){ elem.style.background = 'Khaki'; }
        return elem.getAttribute('for') || elem.getAttribute('name'); 
      });
      await scope.page.waitFor( 400 );
    }

    let { tag, type } = field;
    // We use the last match. We wrote a warning for the user if there were
    // mutliple matches in the story that the last value will be used. In future,
    // Steps will be able to set this data gradually and we don't want the developer
    // to get confused thinking that an earlier Step was used instead of a later one.
    let row = matching_input_rows[ matching_input_rows.length - 1 ];
    let set_to = row.value;

    // Detect a custom type and get the element of that custom type if it exists
    let custom_datatype = await handle.evaluate(( elem )=> {
      // If the element is in a form group**, then extract the form group's
      // datatype value.
      // ** For now the only custom datatype we have is in a form group. In
      // future we should look into what happens with a `fieldset` for
      // `choices:`, etc.
      let custom_datatype = null, matches = null;
      let group = elem.closest( `.form-group` );
      if ( group && group.className ) {
        matches = ` ${ group.className } `.match(/da-field-container-datatype-([^ ]+) /);
      }
      if ( matches ) {
        custom_datatype = matches[1];
      }

      return custom_datatype;
    });

    // Set field
    if ( scope.setCustomDatatype[ custom_datatype ] === undefined ) {
      // If no custom datatype, set a regular field
      await scope.setField[ tag ]( scope, { handle, set_to });
    } else {
      // Set da package custom fields. TODO: find `custom_handle` in the setter?
      let custom_handle = await handle.evaluateHandle(( elem )=> { return elem.closest( `.form-group` ); });
      await scope.setCustomDatatype[ custom_datatype ]( scope, { handle: custom_handle, set_to });
    }

    return row;
  },  // Ends scope.setVariable()

  // Handle setting values for da custom datatypes. E.g. `da-field-container-datatype-BirthDate`
  // TODO: Make this more easily extensible.
  // TODO: Just put this in `scope.setField`? Find the custom handle in the setter itself.
  setCustomDatatype: {
    "BirthDate": async function ( scope, { handle, set_to }) {
      /* Given a date of the format 'mm/dd/yyyy' and the handle of the
      * custom field container, sets the ALToolbox custom birthdate
      * field values. */
      let date_parts = set_to.split(`/`);
      let fields = await handle.$$(`select, input:not([type="hidden"])`);
      for ( let field_i = 0; field_i < fields.length; field_i++ ) {
        let field = fields[ field_i ];

        if ( env_vars.DEBUG ) {
          await field.evaluate( elem => { elem.style.background = `Khaki`; });
        }

        if ( field_i === 0 ) {
          // Set the month
          await field.select( date_parts[ 0 ] );
        } else {
          // Set the day and year
          await scope.setText( scope, {
            handle: field,
            set_to: date_parts[ field_i ]
          });
        }

      }  // For each field

      await scope.afterStep( scope );
    },  // Ends BirthDate()


  },  // ends setCustomDatatype {}

  setField: {
    button: async function ( scope, { handle, set_to }) { await scope.tapElement( scope, handle ); },
    textarea: async function ( scope, { handle, set_to }) {
      await scope.setText( scope, { handle, set_to });
      await scope.afterStep(scope);  // No showifs for this one?
    },
    select: async function ( scope, { handle, set_to }) {
      // A dropdown's option value can be one of two things
      // Try to find the element using the first value

      // TODO: Can we somehow pass in a `set_to` that is encoded correctly since
      // we're getting the fields from the DOM to begin with? We'll probably
      // need another prop because we need the `option` human value to
      // match the story table

      // TODO: Change this to search in the actual handle instead of just $
      let option = await scope.page.$(`option[value="${ set_to }"]`);
      if ( option ) {
        await handle.select( set_to );  // And use that value to set it

      // If that literal value isn't on the page, it should be a base64 encoded value
      // TODO: Can these be double encoded?
      } else {
        let base64_name = await scope.toBase64( scope, { utf8_str: set_to });
        await handle.select( base64_name );
      }
      
      await scope.afterStep(scope, { waitForShowIf: true });
    },
    canvas: async function ( scope, { handle, set_to }) {
      await scope.sign( scope );
      await scope.afterStep( scope );
    },
    input: async function ( scope, { handle, set_to }) {
      /* Set value of some `input` element to the given value. */

      let type = await handle.evaluate( elem => { return elem.getAttribute('type'); });
      if ( type === `radio` || type === `checkbox` ) {

        let [label] = await handle.$x(`following-sibling::label`);
        
        if ( env_vars.DEBUG ) {
          if ( set_to.toLowerCase() === 'false' ) { await label.evaluate( elem => { elem.style.background = 'tomato'; }); }
          else { await label.evaluate( elem => { elem.style.background = 'teal'; }); }
          let name = await label.evaluate( elem => { return elem.getAttribute('for'); });
          // console.log( `setting ${ type } ${ name } to ${ set_to }` );
        }

        if ( type === `radio` ) { await label[ scope.activate ](); }
        else { await scope.setCheckbox( scope, { label, set_to }); }

        await scope.afterStep(scope, { waitForShowIf: true });
        
      } else {
        await scope.setText( scope, { handle, set_to });
        await scope.afterStep(scope );  // No showifs for this one?
      }
    },  // Ends scope.setField.input()
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

  sign: async function ( scope ) {
    /* On a signature page, there should only be a single signature canvas
    * and a continue button. Draw in the #dasigcanvas element. `<canvas>`
    * takes a while to load. */
    let handle = await scope.page.waitForSelector( `#dasigcanvas` );
    expect( handle, `No signature field could be found` ).to.exist;

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

  // TODO: Rename var_data to input_data?
  // Note: Totally different from `setField` (which is singular)
  setFields: async function ( scope, { var_data, id, from_table=true }) {
    /* Non-recursive function to set as many variables as possible before
    * continuing to the next page. Important to avoid recursion because of async ops.
    * If it's not data in a table, the code can be more permissive about some input. */
    if ( env_vars.DEBUG ) { console.log( `~~~~~~~~~~~~~~ scope.setFields() ~~~~~~~~~~~` ); }

    // Get special cases.
    let ensured_var_data = await scope.ensureSpecialRows( scope, { var_data, from_table });

    let html = await scope.page.content();
    // These are the fields on the current page. Their handles should all exist.
    let fields = await scope.getAllFields( scope, { html: html });

    // Avoid setting hidden fields, but when you set a field, other fields on
    // the screen may be revealed and then need to be set, so loop through
    // again until nothing more can be set.
    let something_new_was_set = true;  // So loop can start
    while ( something_new_was_set ) {

      something_new_was_set = false;  // start fresh
      // Go through each field on the page, seeing if we can set its variable
      for ( let field of fields ) {

        // Avoid setting a field multiple times
        if ( field.was_set ) { continue; }
        // Avoid navigating in this `while`. Will do this later so we get to
        // set all fields in here first. TODO: Can links (<a>) set vars?
        if ( field.tag === 'button' && field.type === 'submit' ) { continue; }

        // Try to set other types of fields
        let row_used = await scope.setVariable( scope, { field, var_data: ensured_var_data });
        if ( row_used ) {

          something_new_was_set = true;
          field.was_set = true;
          // Accumulate number of times this row was used. Esp important for `.target_number`
          if ( row_used.source ) { row_used.source.times_used += 1 }
          row_used.times_used += 1;

          process.stdout.write(`\x1b[36m${ '*' }\x1b[0m`);  // assumes var was set if no error occurred

        }
      }  // ends for every non-submit-button field on the page
    }  // ends while fields are still being set

    // Press a continue button with a story table variable name if it exists
    let did_navigate = false;
    let error = {};
    for ( let field of fields ) {
      // All other fields should have been set
      if ( field.tag === 'button' && field.type === 'submit' ) {
        let page_url = await scope.page.url();

        let row_used = await scope.setVariable( scope, { field: field, var_data: ensured_var_data, });
        if ( row_used ) {
          // Esp important for `.target_number`
          if ( row_used.source ) { row_used.source.times_used += 1 }
          row_used.times_used += 1;

          // TODO: special continue/navigation button function that handles url and all?
          
          // Have to catch errors right now or may get stuck in an infinite loop?
          // TODO: Don't catch errors - maybe the developer expected/wanted an error
          // For now they'll have to stop the story table early and do the rest the slow way
          // TODO: Discuss: add the option of throwing when an error happens? Per page?

          // The developer said to continue by defining this row.
          // For now, that means this page should not cause any kind of error.
          // Make sure no system or user error messages appear
          // Discuss moving this out of here. Having to pass in `id` just for
          // these messages smells bad. Con: Already a lot of code out there.
          error = await scope.waitUntilContinued( scope, { url: page_url, id });
          if ( error.was_found ) {
            await scope.throwPageError( scope, { id: id });
          }

          did_navigate = true;
          process.stdout.write(`\x1b[36m${ 'v' }\x1b[0m`);  // pressed button successfully
          break;
        }  // ends if row_used
      }  // ends if button submit
    }  // ends for buttons in fields

    // If didn't already press a continue button, press one now.
    if ( !did_navigate && from_table  ) {
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

      // TODO: How do we let 'I set the var __ to __' also afterwards check for an invalidation message?
      error = await scope.waitUntilContinued( scope, { url: page_url, id });
      if ( error.was_found ) {
        await scope.throwPageError( scope, { id: id });  
      }

      process.stdout.write(`\x1b[36m${ '>' }\x1b[0m`);  // continued successfully
    }  // ends if !did_navigate && from_table

    // TODO: Since we now continue only once no matter what, we can put
    // the error in the caller of the function, though we may want
    // to pass the symbol to print as well.
    return error;
    // TODO: Maybe we should return something else or something in addition about used vars
  },  // Ends scope.setFields()

  ensureSpecialRows: async function ( scope, { var_data, from_table=true }) {
    /* Given a list of variable data objects, add more objects or mutate
    * rows under special circumstances:
    * - `.target_number` may indicate the need for a `.there_is_another` row.
    * - `.there_is_another` in a table is invalid
    */
    // Add special cases. Do not mutate `var_data` as a list, but
    // do allow mutation of items inside.
    let enhanced_var_data = [...var_data];
    for ( let var_datum of var_data ) {

      // Add a `.there_is_another` var if it might be needed.
      // If it's not used in the end, that's fine.
      // `.target_number` is sometimes a stand-in for `.there_is_another`.
      // That seems the clearest way to communicate to developers about what they
      // should write in the test. We will attempt to write more about
      // the rationale in the documentation at some point.
      if ( from_table && var_datum.var.match( /\.target_number$/ )) {
        let special_row = {
          artificial: true,  // not currently used but is future-proofing to mark non-dev generated rows
          source: var_datum,
          var: var_datum.var.replace( /\.target_number$/, `.there_is_another` ),
          value: await scope.getThereIsAnotherValue( scope, { row: var_datum, from_table }),
          // devs are supposed to use the right `trigger` name, but they might not
          trigger: var_datum.trigger.replace( /\.target_number$/, `.there_is_another` ),
        };

        enhanced_var_data.push( special_row );

      // Neutralize a `.there_is_another` row in a story table
      } else if ( from_table && var_datum.var.match( /\.there_is_another$/ ) ) {
        var_datum.invalid = true;
        // Removing the row will just cause a different error that will take longer to fail and
        // probably add a confusing message to the report, so mutating seems, sadly, more useful.
        var_datum.value = `False`;  // The original value is still preserved
        // Warn the developer not to use `.there_is_another`.
        await scope.addToReport( scope, { key: `id`, value: `WARNING: The attribute \`.there_is_another\` is invalid in story table tests. Replace it with \`.target_number\` in your \`var\` and \`trigger\` columns. Set the \`value\` to the number of items in that list. This test will now set this row's \`value\` to \`False\`. See https://suffolklitlab.github.io/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing#there_is_another. The row data is\n${ JSON.stringify( var_datum.original )}` });
      }
    }

    return enhanced_var_data;
  },  // Ends scope.ensureSpecialRows()

  getThereIsAnotherValue: async function ( scope, { row, from_table=true }) {
    /* Given story row-like data as well as whether this is from a table row,
    * return the best guess as to a safe value to set for this round. Give
    * the developer a warning if
    * it's an inappropriate value. Avoid mutation.
    *
    * WARNING: Remember to decrement the actual value later.
    * 
    * Sometimes this will be from `.target_number` from story tables and
    * we believe we've set it up so that people will make it a number.
    * Sometimes this will be from `.there_is_another`. We think we've ensured
    * that it will only come from Steps and should be `True` or `False`.
    * This feels precarious, but I can't see another permuation.
    * 
    * This may in future be used to normalize all values that need `True`/`False`
    * normalization.
    */
    let value = row.value;
    let int_val = parseInt( value );
    
    // Step stuff. Take into account a lot of possible values
    if ( value.match( /(false|no|unchecked|uncheck|deselected|deselect)/i )) {
      return `False`;

    } else if ( value.match( /(true|yes|checked|check|selected|select)/i )) {
      if ( from_table ) {
        // Just in case, but this should never happen.
        if ( row.var.match( /\.there_is_another$/ ) ) {
          await scope.addToReport( scope, { key: `id`, value: `WARNING: The attribute \`.there_is_another\` is invalid in story table tests. Replace it with \`.target_number\` in your \`var\` column. Set the \`value\` to the number of items in that list. This test will now set this row's \`value\` to \`False\`. See https://suffolklitlab.github.io/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing#there_is_another-loop. The row data is\n${ JSON.stringify( row.original )}` });
        } else {
          await scope.addToReport( scope, { key: `id`, value: `${ value } is not a valid value for ${ row.var } here. This test will default to \`False\` to avoid problems.` });
        }
        return `False`;
      } else { return `True`; }

    // Story table stuff
    // Target: 3 (3 items. press 'yes' twice.)
    // Times used: 0 -> `True`, 1 -> `True`, 2 -> `False`, 
    } else if ( row.times_used >= int_val - 1 ) {  // Story table loop will end
        return `False`;

    } else if ( row.source && row.source.times_used >= int_val - 1 ) {  // Just in case use changes a tad
        return `False`;

    } else if ( isNaN( parseInt( value )) ) { // Loop will end
      await scope.addToReport( scope, { key: `id`, value: `${ value } is not a valid value for ${ row.var } here. This test will default to \`False\` to avoid problems.` });
      return `False`;

    } else {  // It's a number. Loop will continue.
      return `True`;
    }
  },  // Ends scope.getThereIsAnotherValue()

  waitUntilContinued: async function ( scope, { url = '', id = '' }) {
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
      ` was "${ id }".`
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

  throwPageError: async function ( scope, { error_handlers = {}, id = '' }) {
    /* Throw a cucumber error with the error that appeared on the page. */
    let was_system_error = error_handlers.system_error !== undefined;
    let sys_err_message = `The test tried to continue to the next page, but there was` +
      ` a system error. See the screenshot. The question id was "${ id }".`
    expect( was_system_error, sys_err_message ).to.be.false;

    let was_user_error = true;  // Easier to read below?
    let user_err_message = `The test tried to continue to the next page, but` +
      ` the user got an error. See the screenshot. The question id was "${ id }".`
    expect( was_user_error, user_err_message ).to.be.false;

    return scope;
  },  // Ends scope.throwPageError()
};
