const { expect } = require('chai');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const safe_filename = require("sanitize-filename");

// Ours
const session_vars = require('./utils/session_vars');
const get_base_interview_url = require(`./docassemble/get_base_interview_url`);
const time = require('./utils/time');
const log = require('./utils/log');
const { waitForTimeout } = require('./utils/time');
const files = require('./utils/files' );
const faker = require('@faker-js/faker').faker;


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

let get_original_row = function (row) {
  /* `row` might be a row, a source row, or an original row. */

  // Until we flatten row data a little, we need to find the `original` row, which has the flags
  let source_row = row.source || row;
  let original = source_row.original || source_row;
  return original;
}

let printable_var_value = function(row) {
  /* `row` might be a row, a source row, or an original row. */
  let original = get_original_row(row);
  if ( is_secret_var(original) ) {
    return original.flags.secret_name;
  }
  return row.value;
};

let is_secret_var = function(row) {
  /* `row` might be a row, a source row, or an original row. */
  let original = get_original_row(row);
  return original.flags !== undefined && original.flags.secret_name !== undefined;
}

let proxies_regex = /(\bx\.)|(\bx\[)|(\[[ijklmn]\])/g;
let misc_artifacts_dir = `_alkiln_test-misc_artifacts`;

module.exports = {
  trigger_not_needed_flag: `ALKiln: no trigger variable needed`,
  addToReport: async function( scope, { type, value }) {
    /* Add an item to a specific list in a scenario's report.
    * Create report if necessary.
    * 
    * The report has a key for each scenario and each of those
    * keys should correspond to a list containing the relevant data. */
    if ( session_vars.get_debug() ) { console.log(`Report:\ntype: ${ type }, value: ${ value }\n`) }
    let scenario = await scope.makeSureReportPartsExist( scope );
    scenario.lines.push({ type, value });

    // TODO: Not sure how to use .add_to_debug_log() here considering possibly dynamic filepath
    // log.add_to_debug_log(`Report:\ntype: ${ type }, value: ${ value }\n`);

    // Ensure filepath for saving local unit test logs
    if ( !scope.paths ) {
      // TODO: would it be useful to put in existing artifacts folder if possible.
      // Can this be usefully abstracted?
      scope.paths = { debug_log: `${ misc_artifacts_dir }/unit_tests_logs-${ files.readable_date() }.txt` };
    }

    try {
      fs.appendFileSync(scope.paths.debug_log, `\nReport:\ntype: ${ type }, value: ${ value }`);
    } catch (err) {
      fs.mkdirSync( misc_artifacts_dir );
      fs.appendFileSync(scope.paths.debug_log, `\nReport:\ntype: ${ type }, value: ${ value }`);
    }
    return scenario;
    
  },  // Ends scope.addToReport()

  makeSureReportPartsExist: async function( scope ) {
    /* If a part of the report needs to exist right now, but doesn't exist,
    * create it. */
    if ( !scope.report ) { scope.report = new Map(); }
    if ( !scope.scenario_id ) {
      let date = files.readable_date();
      scope.scenario_id = `_report_${ date }`;
    }
    if ( !scope.report.get( scope.scenario_id )) {
      scope.report.set( scope.scenario_id, {} )
      scope.report.get( scope.scenario_id ).status = `in progress`;
    }

    let scenario = scope.report.get( scope.scenario_id );
    if ( !scenario.lines ) { scenario.lines = []; }

    return scenario;
  },  // Ends scope.makeSureReportPartsExist()

  setReportScenarioStatus: async function( scope, { status=`PASSED` }) {
    /* Add final status of scenario to scenario report object - passed, failed, etc. */
    scope.report.get( scope.scenario_id ).status = status;
  },  // Ends scope.setReportScenarioStatus()

  convertToOriginalStoryTableRow: async function( scope, { row_data }) {
    /* Returns the original data of row into a string formatted as a story table row.
    * Should this show the actual row data that was used instead? That could
    * be pretty confusing to most devs. */
    let source_row = row_data.source || row_data;
    let original = source_row.original;
    let var_str = await scope.toTrimmedJSON( scope, { str: original.var });
    let value_str = await scope.toTrimmedJSON( scope, { str: original.value });
    let trigger_str = await scope.toTrimmedJSON( scope, { str: original.trigger });
    if ( trigger_str === scope.trigger_not_needed_flag ) {
      // This text was added by ALKiln itself. It's not part of the user's data
      trigger_str = ``;
    }
    return `${ ' '.repeat(6) }| ${ var_str } | ${ value_str } | ${ trigger_str } |`;
  },  // Ends scope.convertToOriginalStoryTableRows()

  toTrimmedJSON: async function( scope, { str='' }) {
    /* Turn into JSON string then trim quotes from the start and end. */
    let json = JSON.stringify( str );
    let trimmed = json.replace( /^"/, '' ).replace( /"$/, '' ).replace( /\\\\/g, `\\`);
    return trimmed;
  },  // Ends scope.toTrimmedJSON()

  addReportHeading: async function (scope, { scenario }) {
    /** Return printable heading based on Scenario name and tags.
    *    Allow characters from other languages.
    */
    if ( session_vars.get_debug() ) { console.log( scenario.pickle.name ); }

    // Collect all tag names
    let tag_names = [];
    for ( let tag of scenario.pickle.tags ) {
      tag_names.push( tag.name );
    }

    let heading = `\n---------------\n`
      + `Scenario: ${ scenario.pickle.name }`;

    if ( tag_names.length > 0 ) {
      heading += `\nTags: ${ tag_names.join(' ') }`;
    }

    heading += `\n---------------`;

    await scope.addToReport( scope, {
      type: `heading`,
      value: heading,
    });
  },  // Ends scope.addReportHeading()

  getPrintableReport: async function( scope ) {
    /* Return a string generated from test report data. */
    let report = `Assembly Line Kiln Automated Testing Report - ${ (new Date()).toUTCString() }\n`;

    // First list failed scenarios, then non-passed scenarios, then passed scenarios
    let failed_reports = ``;
    let passed_reports = ``;
    let other_reports = ``;
    for ( let scenario of scope.report ) {

      let report = await scope.getPrintableScenario( scope, { scenario });
      let [ scenario_id, data ] = scenario;
      if ( data.status === `FAILED` ) { failed_reports += report; }
      else if ( data.status === `PASSED` ) { passed_reports += report; }
      else { other_reports += report; }
    }  // ends for every scenario

    if ( failed_reports !== `` ) { report += `\n\n===============================\n===============================\nFailed scenarios:\n${ failed_reports }`; }
    if ( other_reports !== `` ) { report += `\n\n===============================\n===============================\nScenarios that did not pass:\n${ other_reports }`; }
    if ( passed_reports !== `` ) { report += `\n\n===============================\n===============================\nPassed scenarios:\n${ passed_reports }`; }

    return report;
  },  // Ends scope.getPrintableReport()

  getPrintableScenario: async function( scope, { scenario }) {
    /* Return a string generated from scenario list of report items. */
    let [ scenario_id, data ] = scenario;
    let report = ``;
    for ( let line of data.lines ) {
      if ( line.type === `page_id` ) { report += `screen id: `; }
      else if ( line.type === `warning` ) { report += `WARNING: `; }
      else if ( line.type === `error` ) { report += `\nERROR: ` }
      report += `${ line.value }\n`;
    }
    return report;
  },  // Ends scope.getPrintableScenario()

  getSafeScenarioBaseFilename: async function( scope, { scenario }) {
    /** Return a string that's safe to be a filename. Include the Scenario
    *    description, tags, and language.
    */
    let name_parts = [];

    // Try to order filenames by language if possible/needed
    if ( scope.language ) {
      name_parts.push( scope.language );
    }
    name_parts.push( scenario.pickle.name );

    let filename = name_parts.join(`-`);
    let safe_name = safe_filename( filename, { replacement: `_` });
    // Allow room for extensions, date, etc.
    let safer_name = safe_name.substring(0, (255 - 45));

    return safer_name;
  },  // Ends scope.getSafeScenarioBaseFilename()

  // TODO: Does this need a name change? getSafeScenarioBasedFilename?
  getSafeScenarioFilename: async function( scope, options={ prefix: '' }) {
    /* Return a string that's safe to be a filename. Use a timestamp,
    *    a prefix the caller wants, and the base filename. We hope it can
    *    contain non-english characters too. We do not offer a suffix option
    *    because it may be cut off if the filename is too long.
    */
    let name = options.prefix || '';

    // As long as it's not an empty string, add a separator between it and the rest of the name
    if ( name.length > 0 ) {
      name += `-`;
    }

    if ( scope.page ) {
      let { id } = await scope.examinePageID( scope, 'none to match' );
      name += `${ id }-`;
    }

    name += scope.base_filename;
    name += `-${ files.readable_date() }`;

    let safe_name = safe_filename( name, { replacement: `_` });
    // Allow room for extensions, etc.
    let safer_name = safe_name.substring(0, (255 - 10));
    return safer_name;
  },  // Ends scope.getSafeScenarioFilename()

  getJSONFilename: async function( scope ) {
    // Get a unique path for a json file
    let { id } = await scope.examinePageID( scope, 'none to match' );
    let date = files.readable_date();
    let json_path = path.join( scope.paths.scenario, `json_for-${ id }-${ date }.json` );
    return json_path;
  },

  savePageJSONData: async function( scope ) {
    /** Save the JSON variables of the current page to a json file.
    *
    * @returns {Object} info Info about the result.
    * @returns {string} info.filename The name of the file that was saved.
    * @returns {Object} info.json The variables object.
    */
    let json_path = await scope.getJSONFilename( scope );
    // Get the data
    let json = await scope.getPageJSON( scope );
    // Save the data
    fs.writeFileSync( json_path, JSON.stringify( json, null, 2 ));
    return { json_path, json };
  },  // Ends scope.savePageJSONData()

  waitForShowIf: async function waitForShowIf(scope) {
    // If something might be hidden or shown, wait extra time to let it hide or show
    // I think `.$()` does not use a timeout
    let showif = await scope.page.$('.dashowif');
    if ( showif ) { await scope.page.waitForTimeout( scope.showif_timeout ); }
  },

  waitForTab: async function waitForTab(scope, tab_to_show) {
    /**
     * @param {tab_to_show} the aria-labeledby text of the tab panel, which
     *   we use to query and wait for that tab panel to be shown.
     */
    // Implementation linked to https://github.com/SuffolkLITLab/docassemble-ALToolbox/blob/4aa1069389d2ca9cadb586f309dd73d791f081d1/docassemble/ALToolbox/misc.py#L127
    // I think `.$()` does not use a timeout
    if ( tab_to_show.length == 0) { return }
    // waiting for the transitionend event: https://stackoverflow.com/a/57955251/11416267
    await scope.page.evaluate((element_query) => {
      return new Promise((resolve) => {
        const elem = document.querySelector(element_query); 
        // Taken from jQuery: https://stackoverflow.com/a/33456469/11416267
        const is_visible = !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
        if (!is_visible) {
          const onEnd = function() {
            elem.removeEventListener('transitionend', onEnd);
            resolve();
          };
          elem.addEventListener('transitionend', onEnd); 
        } else {
          resolve();
        }
      });
    }, `div[aria-labelledby="${tab_to_show}"]`);
  },

  afterStep: async function afterStep(scope, options = {waitForShowIf: false, tabToWaitFor: '', navigated: false, waitForTimeout: 0}) {
    /* Common things to do after a step, including take care of errors.
    *    TODO: discuss splitting into `afterField` and `afterStep` or something. Or just change name
    *    TODO: Update to latest cucumberjs, which has `AfterStep` */

    if ( scope.page ) {
      // Use a while loop until the below does not error with `Error: Execution context was destroyed`
      // Temporary fix for race condition. See https://github.com/plocket/docassemble-cucumber/issues/190
      let error_id_elem;
      while ( true ) {
        try {
          // Waiting for `page` to exist. '#da-retry' does not need to exist, it's incidental at this point.
          // If this doesn't throw an error, then the page exists and the result is valid.
          error_id_elem = await scope.page.$('#da-retry');
          break;
        } catch ( err ) {}
      }

      // If there's a system error, throw it
      if ( error_id_elem ) {
        let error_elem = await scope.page.$('blockquote')
        let error_text_prop = await error_elem.getProperty( 'textContent' );
        let system_error_text = await error_text_prop.jsonValue();

        await scope.addToReport(scope, { type: `error`, value: system_error_text });
        throw system_error_text;
      };

      // Wait for elements that might get revealed
      if ( options.waitForShowIf ) { await scope.waitForShowIf( scope ); }
      if ( options.tabToWaitFor ) { await scope.waitForTab( scope, options.tabToWaitFor); }
    }  // ends if scope.page

    if ( options.navigated ) {
      // Reset navigation (TODO: discuss use for observational steps)
      // TODO: Consider `daPageLoad` event
      scope.navigated = true;
      // Allow screenshots of the next page (may have been disabled in order to hide secret values)
      scope.disable_error_screenshot = false;
    } else {
      scope.navigated = false;
    }
    
    // Plain old waiting. Here to avoid doing this in each individual place
    if ( options.waitForTimeout ) { await time.waitForTimeout( options.waitForTimeout ); }
  },  // Ends afterStep

  tapElement: async function tapElement(scope, elem, tabToWaitFor='', waitForTimeout=0) {
    /* Tap a given element, detect navigation, and do appropriate related things. */

    // This check might never be needed now as we try to match fields on the page
    // first in user-triggered cases - users used to be able to access this almost
    // directly, but they can't anymore. Our functions should know to only pass good things.
    let msg = `Cannot find that element.`;
    if ( !elem ) { await scope.addToReport(scope, { type: `error`, value: msg }); }

    expect( elem, msg ).to.exist;

    let start_url = await scope.page.url();  // so we can later check for navigation

    let clickWait;
    // Can't use elem[ scope.activate ](). It works locally, but errors on GitHub
    // with "Node is not visible or not an HTMLElement". We're not using a custom Chromium version
    // Unfortunately, this won't catch an invisible element. Hopefully we'd catch it before now...?
    // "Tap" on mobile is more complex to implement ourselves.
    // See https://stackoverflow.com/a/56547605/14144258
    // and other convos around it. We haven't made it public that the device
    // can customized. Until we do that, we'll just use "click" all the time.
    if (!tabToWaitFor) {
      // Click with no navigation will end immediately
      clickWait = Promise.all([
        elem.evaluate( (el) => { return el.click(); }),
        scope.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      ]);
    } else {
      // Same thing as above, but the promise doesn't wait for navigation.
      clickWait = elem.evaluate( (el) => {return el.click(); });
    }
    // Error loads page, so no need to detect to keep things short
    let winner = await Promise.race([
      clickWait,
      // This is meant to detect user-visible alerts/errors,
      // not breaking errors in the testing code.
      scope.page.waitForSelector('.alert-danger', { visible: true }),
      scope.page.waitForSelector('.da-has-error', { visible: true }),
    ])

    // TODO: Not sure how to detect navigation landing at same page.
    // Maybe url change + trigger var change? Maybe just trigger var?
    let end_url = await scope.page.url();
    let navigated = start_url !== end_url;

    // Might be able to handle this in `scope.afterStep`
    if ( navigated ) {
      // Save the id that comes next
      let { question_has_id, id, id_matches } = await scope.examinePageID( scope, 'none to match' );
      // If navigation, wait for 200ms to let things settle down
      await scope.afterStep(scope, {waitForTimeout: 200, navigated: navigated});
    } else {
      // If stay on page, wait for `show if`, the new tab to be loaded, or feedback elements to be move around
      options = {waitForShowIf: !tabToWaitFor, tabToWaitFor: tabToWaitFor, navigated: navigated};
      if (waitForTimeout > 0) {
        options = {waitForTimeout: waitForTimeout, navigated: navigated};
      }
      await scope.afterStep(scope, options); 
    }

    return winner;
  },  // Ends scope.tapElement()

  detectDownloadComplete: async function detectDownloadComplete(scope, endTime) {
    /* Resolve if a download flag has changed. Timeout after a bit less than
    *    the global permitted timeout
    * 
    * TODO: Properly wait for download to complete. See 
    * https://github.com/SuffolkLITLab/ALKiln/issues/492 and
    * https://stackoverflow.com/a/56951024 and
    * https://github.com/puppeteer/puppeteer/issues/4676 and
    * https://github.com/puppeteer/puppeteer/issues/299 and
    */

    // Stop/resolve if too much time has passed
    let expirationTime = scope.timeout - 200;  // ms
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
      await scope.page.waitForTimeout( 100 );
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
  },  // Ends scope.setVar()

  continue: async function ( scope ) {
    /* Presses whatever button it finds that might lead to the next page. */
    // Any selectors I find seem somewhat precarious.
    let elem = await Promise.race([
      scope.page.waitForSelector(`fieldset.da-field-buttons button[type="submit"]`),  // other pages (this is the most consistent way)
      scope.page.waitForSelector(`fieldset .dasigsave`),  // signature page
    ]);
    await elem.evaluate( el => { return el.className });
    // Waits for navigation or user error
    await scope.tapElement( scope, elem );
  },  // Ends scope.continue()

  continue_exists: async function ( scope ) {
    let elem = await Promise.race([
      // PROBLEM: because we don't have a page id that can stop us from moving
      // forward. We have to detect a continue button, but that may be impossible
      // TODO: Story table requires a question id or it similarly might not be able to stop
      // Possible to find this on an event screen with `buttons:`, like an exit button
      // <button type="submit" class="btn btn-da btn-danger" name="X211bHRpcGxlX2Nob2ljZQ" value="0">exit</button>
      // An actual continue button that doesn't set a variable
      // <button class="btn btn-da btn-primary" type="submit">Continue</button>
      // One that sets a variable:
      // <button type="submit" class="btn btn-da btn-primary" name="Zm9v" value="True">Continue</button>
      // `buttons:` can be used in question blocks as choices
      scope.page.$( `fieldset.da-field-buttons button[type="submit"]` ),  // other pages (this is the most consistent way)
      scope.page.$( `fieldset .dasigsave` ),  // signature page
    ]);

    return elem !== null;
  },  // Ends scope.continue_exists()

  tapTab: async function ( scope, tab_id ) {
    let elem = await scope.page.$(`#${tab_id}`); 
    let error_msg = `Couldn't find the tab with id "#${tab_id}" on the page, is there a typo?`;
    if ( !elem ) {
      await scope.addToReport(scope, { type: `error`, value: error_msg }); 
    }
    expect( elem, error_msg ).to.exist;
    await scope.tapElement( scope, elem, tab_id );
  },

  checkForA11y: async function (scope ) {
    /** Return if there were any violations and the file containing aXe output with more details of the checks */
    let { id } = await scope.examinePageID( scope, 'none to match' );
    if ( scope.page_id !== id ) {
      await scope.addToReport(scope, { type: `page_id`, value: `${ id }`, });
      scope.page_id = id;
    }
    const axe = new AxePuppeteer(scope.page);
    axe.options({
      runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      resultTypes: ['violations', 'incomplete']
    });
    let axe_result = await axe.analyze();
    axe_result.page_id = scope.page_id;
    axe_result.passes_ids = axe_result.passes.map(pass_obj => pass_obj.id);
    axe_result.inapplicable_ids = axe_result.inapplicable.map(inapp_obj => inapp_obj.id);
    axe_result.passes = [];
    axe_result.inapplicable = [];

    let axe_path = null;
    const passed = axe_result.violations.length == 0;
    if (!passed) {
      let axe_filename = await scope.getSafeScenarioFilename( scope, {prefix: `aXe_failure`}) + '.json';
      axe_path = `${ scope.paths.scenario }/${ axe_filename }`;
      fs.writeFileSync( axe_path, JSON.stringify( axe_result, null, 2 ));
      let msg = `Found potential accessibility issues on the ${ scope.page_id } screen. Details in ${ axe_path }.`;
      await scope.addToReport( scope, {
        type: `error`,
        value: msg
      });
    } else {
      await scope.addToReport(scope, { type: `info`, value: `Accessibility on ${ scope.page_id } passed!`})
    }
    return {
      passed: axe_result.violations.length == 0,
      axe_filepath: axe_path
    };
  },

  tapElementBySelector: async function ( scope, selector, waitForTimeout ) {
    let elem = await scope.page.$(`${selector}`);
    let error_msg = `Couldn't find "${selector}" on the page, is there a typo?`;
    if ( !elem ) {
      await scope.addToReport(scope, { type: `error`, value: error_msg });
    }
    expect( elem, error_msg ).to.exist;
    await scope.tapElement( scope, elem, '', waitForTimeout );
  },

  load: async function ( scope, file_name ) {
    /* Try to load the page. Should we also pass a `timeout` arg or just
    *    use scope.timeout? */

    // If there is no browser open, start a new one
    if (!scope.browser) {
      scope.browser = await scope.driver.launch({ headless: !session_vars.get_debug(), devtools: session_vars.get_debug() });
    }
    if ( !scope.page ) { scope.page = await scope.browser.newPage(); }

    if ( !file_name.includes('.yml') ) { file_name = `${ file_name }.yml` }
    let base_url = await get_base_interview_url();
    let interview_url = `${ base_url }${ file_name }`;
    if ( session_vars.get_debug() ) { console.log( interview_url ); }

    await scope.page.goto(interview_url, { waitUntil: 'domcontentloaded', timeout: scope.timeout })

    let load_result = await scope.getLoadData( scope );
    // Errors, or reaching timeout, causes an exception and is shown to the developer at the end
    if ( load_result.error ) {
      await scope.addToReport(scope, { type: `error`, value: `On final attempt to load interview, got "${ load_result.error }"` });
      expect( load_result.error ).to.equal( '' );
    }

    return scope.page;
  },  // Ends scope.load()

  getLoadData: async function ( scope ) {
    /* Return one of two elements that could load on the page - #daMainQuestion
    * or #da-retry. If there's a system error on the page, return its main text.
    * 
    * If server isn't loaded yet, it should get the browser timeout error,
    * which won't match either of those and this will timeout and, I assume, error.*/
    let result = { error: ``, elem: null };

    let winner = await Promise.race([
      scope.page.waitForSelector( `#daMainQuestion`, { timeout: scope.timeout }),
      scope.page.waitForSelector( `#da-retry`, { timeout: scope.timeout }),
    ]);

    result.elem = winner;

    let error_id_elem = await scope.page.$( `#da-retry` );
    if ( error_id_elem ) {
      let error_elem = await scope.page.$( `blockquote` );
      let error_handle = await error_elem.getProperty( `textContent` );
      let system_error_text = await error_handle.jsonValue();

      result.error = system_error_text;
    }

    return result;
  },  // Ends scope.getLoadData()

  setLanguage: async function ( scope, { language }) {
    // Tap the language button if given
    let lang_url = null;
    if ( language ) {

      let [lang_link] = await scope.page.$x(`//a[text()="${ language }"]`);

      let msg = `Could not find the link with the text "${ language }"`;
      if ( !lang_link ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
      expect( lang_link, msg ).to.exist;  // Cause test failure

      await scope.tapElement( scope, lang_link );
    }
  },  // Ends scope.setLanguage()

  normalizeTable: async function ( scope, { var_data, from_story_table=true }) {
    /* Return data derived from cucumber variable-setting data.
     * Table must have headers. Arrays are not supported. */

    // Support tables with no 'trigger' column
    let supported_table = [];
    for ( let row of var_data ) {
      // See tests > unit_tests > tables.fixtures.js > tables.old_to_current_formatting
      let actual_var_value = row.value;
      if (is_secret_var(row)) {
        actual_var_value = process.env[row.flags.secret_name];
        if ( actual_var_value === undefined ) {
          let not_in_env_msg = `The GitHub SECRET "${ row.flags.secret_name }" doesn't exist. Check for a typo and check your workflow file.`;
          await scope.addToReport( scope, { type: `error`, value: not_in_env_msg })
          throw ReferenceError(`Could not find "${row.flags.secret_name }": ${not_in_env_msg}.`)
        }
      }

      let result = {
        original: row,
        // Give fake data if needed to prevent some kind of hidden input field from being found
        // See bug at https://github.com/plocket/docassemble-cucumber/issues/79
        // May be able to remove this once converted to `getAllFields`
        var: row.var || 'al_no_var_name',
        value: actual_var_value,
        trigger: row.trigger || '',
        times_used: 0,
      }

      supported_table.push( result );
    }

    if ( session_vars.get_debug() ) { 
      console.log( 'scope.normalizedTable():\n', JSON.stringify( supported_table )); 
    }

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
    let trigger_elem = $( `#trigger` );
    if ( !trigger_elem.length ) { trigger_elem = $( `#sought_variable` ); }  // Backwards compatibility
    let encoded_trigger_var = $( trigger_elem ).data( `variable` );  // This should come out to 'None' at the very least
    if ( !encoded_trigger_var ) {
      // TODO: Add documentation and then link to it in this message.
      await scope.addToReport(scope, { type: `warning`, value: `You are missing an element containing the data for the page's trigger variable. Some fields, like loops with index variables, may not work correctly in these tests. See https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/#a-missing-trigger-variable.` });
      encoded_trigger_var = await scope.toBase64( scope, { utf8_str: `None` });
    }
    let trigger = await scope.fromBase64( scope, { base64_str: encoded_trigger_var });

    
    // Some `show if` fields have `names` like '_field_n' instead of their var name. Ex: _field_1
    let field_like_names = await scope.getFieldNamesDict( scope, { $: $ });

    // All the different types of fields
    // buttons, canvases, inputs of all kinds, selects (dropdowns), textareas. Are there more?
    // Will deal with `option` once inside `select`
    let all_nodes = $( `#dasigpage, fieldset button, .daquestionactionbutton, fieldset input, .da-form-group input, .da-form-group select, form select, .da-form-group textarea` );
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
          // TODO: Does this `replace` need the `g` flag?
          // TODO: This only replaces the chars at the start of the string. Is that intentional?
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

    if ( session_vars.get_debug() ) { console.log( `page fields:\n${ JSON.stringify( fields )}`); }
    return fields;
  },  // Ends scope.getAllFields()

  getPageJSON: async function ( scope ) {
    /* Get the JSON data of the current page. */
    return await scope.page.evaluate(async function ( elem ) {
      return await get_interview_variables();
    });

    // return data;
  },  // Ends scope.getPageJSON()

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
    // Everything should be in #daquestion and that's also how our unit tests and fixtures work.
    selector = '#daquestion ' + selector;

    // Make sure this selector matches only one node
    let matching_nodes = $( selector );
    // This check is here to ensure safety of future development. If there is more
    // or less than one match, this code may have unexpected behavior later.
    // Really need everything to be unique here if at all possible. Shall we resort
    // to parents and n-th child?
    // Exceptions: Some specific fields can be duplicates without being dangerous
    if ( matching_nodes.length > 1 && !selector.includes(`[class="file-caption-name"]`) ) {
      let msg = `${ matching_nodes.length } items on this page matched the base64 encoded name '${ selector }'. You may be setting the same variable in multiple places on this page.`;
      await scope.addToReport(scope, { type: `warning`, value: msg });
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
    * be proxy names (e.g. thing[i]).
    * We now don't try to guess proxy var names, though. We have the developer put
    * them directly in the data table with the value they want to set and
    * include the trigger variable. Even though the proxy var name is the same
    * in different iterations of the page, the unique trigger variable lets us
    * know which value to set.
    * See https://github.com/plocket/docassemble-cucumber/issues/256
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

    // Of the format `foo[B'encoded']` or `foo[R'encoded']`
    // See https://github.com/jhpyle/docassemble/blob/595ad0a08572c0188f9ab49b1a6af99a3621cd42/docassemble_base/docassemble/base/standardformatter.py#L2108

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

    // Detecting valid variable names/characters
    // https://stackoverflow.com/a/23377268

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
    if ( typeof( utf8_str ) !== `string`  ) {  // Prevent an error
      return `Will+Never+Match+Existing+DOM+Node==`;
    }
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
    * For notes on trigger var, see https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/#trigger
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
    *    possibly match a table row's `var` column
    * @param field[n].guesses[n].var {str} - name of variable
    * @param field[n].guesses[n].value {str} - value of a choice
    * @param <field[n].guesses[n].trigger> {str} - var name that triggered this page
    * 
    * @returns [ var_data[n] ]
    */

    let rows_that_match_field_names = [];
    let uses_proxies = false;  // See "proxies" notes further down
    let trigger_might_be_needed = true;

    // There are multiple guesses because field names are sometimes encoded
    for ( let guess of field.guesses ) {
      for ( let table_row of var_data ) {
        let this_row_matches_this_field = false;

        // If the dev uses single instead of double quotes, etc, allow that
        let names_match = await scope.matchNeutralizedQuotes( scope, { value1: guess.var, value2: table_row.var });
        let values_match = await scope.matchNeutralizedQuotes( scope, { value1: guess.value, value2: table_row.value });

        // Check different things for different fields. An input box won't
        // be expected to have the same value as the var you want to set while
        // a radio button and its table row need to have a matching value.
        switch ( field.tag ) {
          case 'button':
          case 'select':
            if ( names_match && values_match ) { this_row_matches_this_field = true; }
            break;

          case 'canvas':
          case 'textarea':
          case 'a':
            if ( names_match ) { this_row_matches_this_field = true; }
            break;

          case 'input':
            if ( field.type === 'radio' ) {
              if ( names_match && values_match ) { this_row_matches_this_field = true; }
            } else {  // Some kind of text input
              if ( names_match ) { this_row_matches_this_field = true; }
            }
            break;
        }

        if ( this_row_matches_this_field ) {
          rows_that_match_field_names.push( table_row );
          // Check this until the value is set to `true` (if it ever is)
          // If the field uses proxy variables - x, i, j, etc, flag it. See "proxies" note.
          uses_proxies = uses_proxies || guess.var.match( proxies_regex );

          if ( table_row.trigger === scope.trigger_not_needed_flag ) {
            trigger_might_be_needed = false;
          }
        } // end if this_row_matches_this_field

      }  // ends for each table row
    }  // ends for each field row possibility

    // Proxies:
    // When a dev has a loop with an index var or generic object, the
    // same variable name will be used over and over, e.g.`users[i].name.first`.
    // In a regular Step, there's no ambiguity about the value to set.
    // In a dev's story table, though, there could be multiple rows that match
    // a field named `users[i]`. For kiln to know which row to use on which
    // page, we need the one unique HTML string that will appear on the page -
    // the trigger var name. When a row with `users[i]` has a "trigger" column
    // value that matches the page HTML's trigger var name, kiln will know to
    // use the value from that row. We need to find the matching row.
    let final_matching_rows = [];
    if ( trigger_might_be_needed && uses_proxies && rows_that_match_field_names.length > 0 ) {

      let rows_that_also_match_trigger_name = [];
      let rows_without_a_trigger_name = [];
      let rows_with_conflicting_trigger_names = [];

      let page_trigger_name = field.trigger;

      // field/page trigger name is needed but is missing.
      if ( !page_trigger_name ) {
        let page_trigger_warning = `A field on this page uses an index `
          + `variable or a generic object, but the page does not `
          + `contain the trigger variable's name in its HTML. See `
          + `https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/#a-missing-trigger-variable.`;
        await scope.addToReport(scope, { type: `warning`, value: page_trigger_warning });
      }

      for ( let row_that_matches_this_field of rows_that_match_field_names ) {

        let table_row_trigger_name = row_that_matches_this_field.trigger;

        if ( !table_row_trigger_name ) {
          // var/row trigger name is (probably) needed but is missing. Caveat: If there's
          // only one page in the proxy var loop and there's only one row, trigger name is
          // not needed, but I'm not sure how we figure out all those things here and log
          // a useful message.

          // First, make the row data more readable to humans.
          let row_as_story_table = await scope.convertToOriginalStoryTableRow( scope, { row_data: row_that_matches_this_field });
          let row_trigger_warning = `This story table row needs a value in the "trigger" `
            + `column, but it is empty. The test might get unexpected results. See `
            + `https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/#trigger.`
            + `\nThe row's data:\n${ row_as_story_table }`
            + `\nThis field's data:\n${ JSON.stringify( field )}`;
          await scope.addToReport(scope, { type: `warning`, value: row_trigger_warning });
          rows_without_a_trigger_name.push( row_that_matches_this_field );
        } else {
          let triggers_match = await scope.matchNeutralizedQuotes( scope, { value1: page_trigger_name, value2: table_row_trigger_name });
          if ( triggers_match ) {
            rows_that_also_match_trigger_name.push( row_that_matches_this_field );
          } else {
            rows_with_conflicting_trigger_names.push( row_that_matches_this_field );
          }
        }
      }  // ends for each row_that_matches_this_field

      // Be very permissive, based on feedback. See https://github.com/SuffolkLITLab/ALKiln/issues/464#issuecomment-1005166616
      if ( rows_that_also_match_trigger_name.length > 0 ) {
        final_matching_rows = rows_that_also_match_trigger_name;
      } else {
        final_matching_rows = rows_without_a_trigger_name;
      }

      // Warn the user if all matching rows had trigger names that conflicted.
      // Missing trigger names don't count as conflicting.
      if ( final_matching_rows.length === 0 ) {

        // First, make the row data more readable to humans.
        let conflicts_as_story_table_rows = [];
        for ( let row of rows_with_conflicting_trigger_names ) {
          let table_str = await scope.convertToOriginalStoryTableRow( scope, { row_data: row });
          conflicts_as_story_table_rows.push( table_str );
        }

        let all_trigger_names_conflict_msg = `Is this story table missing a row? `
          + `${ rows_that_match_field_names.length } story table row(s) matched a field name, `
          + `but none of their trigger variable name(s) matched the trigger variable `
          + `name in the screen's HTML. The test will have to ignore this field. See `
          + `https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/#trigger.`
          + `\nThe data of row(s) with conflicting trigger name(s):\n${ conflicts_as_story_table_rows.join( `\n` )}`
          + `\nThis field's data:\n${ JSON.stringify( field )}`;
        await scope.addToReport(scope, {
          type: `warning`,
          value: all_trigger_names_conflict_msg
        });
      }

    } else {
      // These should be used if NO trigger name was needed
      final_matching_rows = rows_that_match_field_names;
    }  // ends if need trigger name to match

    // Dev may have accidentally included a row more than once.
    if ( final_matching_rows.length > 1 ) {

      // First, make the row data more readable to humans.
      let rows_as_story_table = [];
      for ( let row of final_matching_rows ) {
        let table_str = await scope.convertToOriginalStoryTableRow( scope, { row_data: row });
        rows_as_story_table.push( table_str );
      }

      let multiple_matches_msg = `Do you have a duplicate story table row? `
        + `Multiple story table rows match this field's variable name. `
        + `The test will use the last row that matched. See `
        + `https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/#trigger.`
        + `\nThe matching rows:\n${ rows_as_story_table.join(`\n`) }`
        + `\nThis field's data:\n${ JSON.stringify( field )}`;
      await scope.addToReport(scope, { type: `warning`, value: multiple_matches_msg });
    }

    if ( session_vars.get_debug() ) { console.log( `final_matching_rows:\n`, JSON.stringify( final_matching_rows )); }
    return final_matching_rows;
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

    let handle = await scope.get_handle_from_selector( scope, { field: field });

    let disabled = await handle.evaluate(( elem )=> {
      // da's header covers the top of the section containing the fields which means
      // sometimes it blocks nodes from clicks. Scroll item to the bottom instead.
      if ( !elem.disabled ) { elem.scrollIntoView(false); }
      return elem.disabled;
    });

    // If field is disabled, don't set it yet
    if ( disabled ) { return row_used; }

    if ( session_vars.get_debug() ) {
      let name = await handle.evaluate(( elem ) => {  // Not using this right now
        try { elem.nextSibling.style.background = 'Khaki'; }
        catch(err){ elem.style.background = 'Khaki'; }
        return elem.getAttribute('for') || elem.getAttribute('name'); 
      });
      await scope.page.waitForTimeout( 400 );
    }

    // We use the last match. We wrote a warning for the user if there were
    // multiple matches in the story that the last value will be used. In future,
    // Steps will be able to set this data gradually and we don't want the developer
    // to get confused thinking that an earlier Step was used instead of a later one.
    let row = matching_input_rows[ matching_input_rows.length - 1 ];
    let set_to = row.value;

    await scope.funnel_the_answer( scope, { handle, set_to, field });

    return row;
  },  // Ends scope.setVariable()

  get_handle_from_selector: async function ( scope, { field }) {
    /** Get the element's puppeteer handle using the field's selector. */

    let handle = await scope.page.evaluateHandle(( selector ) => {
      let elem = document.querySelector( selector );
      // If the element has a sibling that's a label, we need to
      // interact with that label instead.
      // `elem` has never been null from what we've seen
      if ( elem.nextSibling && elem.nextSibling.tag === `label` ) {
        return elem.nextSibling;
      } else { return elem; }
    // Pass in the selector as an argument
    }, field.selector );

    return handle;
  },  // Ends scope.get_handle_from_selector()

  get_custom_datatype: async function( scope, { handle }) {
    /** If this is part of a custom datatype, returns an element,
    *    otherwise returns null. */

    let custom_datatype = await handle.evaluate(( elem )=> {
      // If the element is in a form group**, then extract the form group's
      // datatype value.
      // ** For now the only custom datatype we have is in a form group. In
      // future we should look into what happens with a `fieldset` for
      // `choices:`, etc.
      let custom_datatype = null, matches = null;
      let group = elem.closest( `.da-form-group` );
      if ( group && group.className ) {
        matches = ` ${ group.className } `.match(/da-field-container-datatype-([^ ]+) /);
      }
      if ( matches ) {
        custom_datatype = matches[1];
      }

      return custom_datatype;
    });

    return custom_datatype;
  },  // Ends scope.is_custom_datatype()

  // TODO: change `set_to` to the name `answer`
  funnel_the_answer: async function( scope, { handle, field, set_to }) {
    /** Use the tag or custom datatype to funnel the answer to the right field. */

    // Detect a custom type and get the element of that custom type if it exists
    let custom_datatype = await scope.get_custom_datatype( scope, { handle });

    // Set field
    if ( scope.setCustomDatatype[ custom_datatype ] === undefined ) {
      // If no custom datatype, set a regular field
      await scope.enter_answer[ field.tag ]( scope, { handle, set_to });
    } else {
      // Set da package custom fields. TODO: find `custom_handle` in the setter?
      let custom_handle = await handle.evaluateHandle(( elem )=> { return elem.closest( `.da-form-group` ) });
      await scope.setCustomDatatype[ custom_datatype ]( scope, { handle: custom_handle, set_to });
    }

  },  // Ends scope.funnel_the_answer()

  // Handle setting values for da custom datatypes. E.g. `da-field-container-datatype-BirthDate`
  // TODO: Make this more easily extensible.
  // TODO: Just put this in `scope.enter_answer`? Find the custom handle in the setter itself.
  setCustomDatatype: {
    al_date: async function ( scope, { handle, set_to, is_past }) {
      /* Given a date of the format 'mm/dd/yyyy' and the handle of the
      * custom field container, sets an AssemblyLine three-part date's
      * field values. */

      // If it doesn't have the right format
      if ( set_to === null || !set_to.includes(`/`) ) {
        // Do nothing
        return;
      }

      let date_parts = set_to.split(`/`);
      let fields = await handle.$$(`select, input:not([type="hidden"])`);
      for ( let field_i = 0; field_i < fields.length; field_i++ ) {
        let field = fields[ field_i ];

        if ( session_vars.get_debug() ) {
          await field.evaluate( elem => { elem.style.background = `Khaki`; });
        }

        if ( field_i === 0 ) {
          // Set the month
          await field.select( date_parts[ 0 ] );
        } else {
          // Set the day or year
          await scope.setText( scope, {
            handle: field,
            set_to: date_parts[ field_i ]
          });
        }

      }  // For each field

      await scope.afterStep( scope );
    },  // Ends scope.setCustomDatatype.al_date()

    BirthDate: async function ( scope, { handle, set_to }) {
      /** Given a date of the format 'mm/dd/yyyy' and the handle of the
      * custom field container, sets the ALToolbox custom birthdate
      * field values. */

      await scope.setCustomDatatype.al_date( scope, { handle, set_to })
    },  // Ends scope.setCustomDatatype.BirthDate()

    ThreePartsDate: async function ( scope, { handle, set_to }) {
      /** Given a date of the format 'mm/dd/yyyy' and the handle of the
      * custom field container, sets the ALToolbox custom ThreePartsDate
      * field values. */
      await scope.setCustomDatatype.al_date( scope, { handle, set_to })
    },  // Ends scope.setCustomDatatype.ThreePartsDate()

  },  // ends setCustomDatatype {}

  enter_answer: {
    button: async function ( scope, { handle, set_to }) { await scope.tapElement( scope, handle ); },
    textarea: async function ( scope, { handle, set_to }) {
      await scope.setText( scope, { handle, set_to });
      await scope.afterStep(scope);  // No showifs for this one?
    },
    select: async function ( scope, { handle, set_to }) {
      // Note: I don't remember what's really going on in here.
      // I will note that values of `select` elements are strings,
      // not variables, so we don't need to check for variable names.

      // A dropdown's option value can be one of two things
      // Try to find the element using the first value

      // TODO: Can we somehow pass in a `set_to` that is encoded correctly since
      // we're getting the fields from the DOM to begin with? We'll probably
      // need another prop because we need the `option` human value to
      // match the story table

      // TODO: Change this to search in the actual handle instead of just $
      // There could be multiple fields on the page with the same option
      // values.
      // let option = await handle.$(`option[value="${ set_to }"]`);
      let option = await scope.page.$(`option[value="${ set_to }"]`);
      if ( option ) {
        await handle.select( set_to );  // And use that value to set it

      // If that literal value isn't on the page, it should be a base64 encoded value
      // TODO: Can these be double encoded? Can they be encoded like objects?
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
        
        if ( session_vars.get_debug() ) {
          if ( set_to.toLowerCase() === 'false' ) { await label.evaluate( elem => { elem.style.background = 'tomato'; }); }
          else { await label.evaluate( elem => { elem.style.background = 'teal'; }); }
          let name = await label.evaluate( elem => { return elem.getAttribute('for'); });
        }

        if ( type === `radio` ) { await label.evaluate( elem => { return elem.click(); }); }
        else { await scope.setCheckbox( scope, { label, set_to }); }

        await scope.afterStep(scope, { waitForShowIf: true });
        
      } else if ( type === `file` ) {
        await scope.uploadFiles( scope, { handle, set_to });
        await scope.afterStep(scope, { waitForShowIf: true });

      } else if (type == `date`) {
        let set_to_date = set_to;
        // If the date is specified in the format "today" or "today + 2" or "today-1"
        // it will need some pre-processing. 
        if (set_to.indexOf(`today`) !== -1) {
          // Find out how many days to add/subtract
          let date_delta = set_to.replace(/\s/g, '');
          date_delta = date_delta.match(/today([+-]\d+)?/)[1];
          date_delta = date_delta == undefined ? 0 : date_delta;
          date_delta = parseInt(date_delta);
          // Get today's date
          set_to_date = new Date(); 
          // Add/subtract required number of days
          set_to_date.setDate(set_to_date.getDate() + date_delta);
          // Convert to the docassemble date field format: mm/dd/yyyy
          // Reference: https://gomakethings.com/setting-a-date-input-to-todays-date-with-vanilla-js/
          set_to_date = ((set_to_date.getMonth() + 1).toString().padStart(2, 0) + '/' + 
                         set_to_date.getDate().toString().padStart(2, 0) + '/' +
                         set_to_date.getFullYear().toString());
        }
        await scope.setText( scope, { handle, set_to: set_to_date });
        await scope.afterStep(scope, { waitForShowIf: true });
      } else {
        await scope.setText( scope, { handle, set_to });
        await scope.afterStep(scope, { waitForShowIf: true });
      }
    },  // Ends scope.enter_answer.input()
    hidden: async function ( scope, { handle, set_to }) {
      // Do nothing. The only way the code should get here is if
      // this wasn't a custom datatype we can handle.
      // If we were to write a message, I don't know what we can
      // write - this may be a different custom datatype or this
      // could be a special da field that we shouldn't worry the
      // dev about at all.
      return;
    },

  },  // ends scope.enter_answer

  uploadFiles: async function ( scope, { handle, set_to }) {
    /* Try to upload one or more files to a file-type input field. */
    
    // Tests could be in one of two places. Figure out which directory they're in
    // Makes an absolute path from the directory in which `npm run` was used plus our internal folders
    let dir_source = `${ process.cwd() }/docassemble/${ session_vars.get_repo_url().match(/docassemble-(.*)/)[1] }/data/sources`;
    let dir_features = `${ process.cwd() }/tests/features`;
    let dir = null;

    // Make sure one of the valid directories exist. This only allows
    // one directory to be used per Step or table row. We don't anticipate
    // future people having a `tests/features` folder, let alone both.
    try {
      // Try the most common directory first
      fs.accessSync( dir_source );
      dir = dir_source;
      // If they have both directories, let them know which directory will be used.
      try {
        fs.accessSync( dir_features );
        await scope.addToReport( scope, { type: `warning`, value: `You have both a docassemble package 'sources' folder and a 'test/features' folder. These tests will use the package's 'sources' folder.` });
      } catch ( error_features ) { `all's well, do nothing`; }

    } catch ( error_source ) {
      try {
        fs.accessSync( dir_features );
        dir = dir_features;
      } catch ( error_features ) {
        await scope.addToReport( scope, { type: `warning`, value: `There are two places where you can store files to upload: "${ dir_source }" and "${ dir_features }". These tests could not find either of those.` });
        throw error_source;  // Most people will want to know the sources folder path;
      }
    }

    // Allow a typo where someone forgot to include a space after a comma
    let file_names = set_to.split(`,`);

    // If a file exist, add it to a list of files to be uploaded. If it doesn't, add a warning.
    let paths = [];
    for ( let name of file_names ) {

      // If the developer correctly used a ", ", there will be a space at the
      // start of the string. Remove it. If they forgot the space, that's fine too.
      name = name.replace(/^\s/, '');
      let file_path = path.join( dir, name );

      try {
        fs.accessSync( file_path );
        paths.push( file_path );

      } catch ( err ) {
        // TODO: Should this throw an error?
        await scope.addToReport( scope, { type: `warning`, value: `Could not find "${ name }" in "${ dir }"` });
      }
    }

    if ( paths.length === 0 ) {
      await scope.addToReport( scope, { type: `error`, value: `Could not find "${set_to}".` });
      throw ReferenceError(`Could not find "${set_to}".`)
    } 
    // Prepare to wait for upload to complete
    let name = await handle.evaluate( elem => { return elem.getAttribute(`name`); });
    let selector = `*[name="${ name }"]`
    let disabled_selector = `${ selector }[disabled]`;
    let enabled_selector = `${ selector }:not([disabled])`;

    // This comes before the upload starts
    // Notice `await` is absent. Don't actually wait here.
    // Just start looking for it now. That way we'll catch it before it's gone
    let wait_for_disable = scope.page.waitForSelector( disabled_selector );
    
    // Upload
    await handle.uploadFile(...paths);

    // Halt progress to wait for the input to be disabled. If it already is, then this
    // will have resolved already and will keep going.
    await wait_for_disable;
    // When it's again enabled, the files have finished loading. Or so I have observed.
    await scope.page.waitForSelector( enabled_selector );
  

  },  // Ends scope.uploadFiles()

  setCheckbox: async function ( scope, { label, set_to }) {
    // Depending on the current value/status of a checkbox and the desired
    // value to set, either taps the checkbox or leaves it alone.
    let status = await label.evaluate( elem => { return elem.getAttribute('aria-checked'); });
    if ( set_to.toLowerCase() !== status ) {
      await label.evaluate( elem => { return elem.click(); });
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
    let msg = `Could not find a signature field.`;
    if ( !handle ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
    expect( handle, msg ).to.exist;

    let bounding_box = await handle.boundingBox();
    await scope.page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
    await scope.page.mouse.down();
    // await scope.page.mouse.move(1, 1);  // Too big? Wait a while before drawing?
    await scope.page.mouse.up();
  },

  examinePageID: async function ( scope, question_id = '' ) {
    /* Looks for a sanitized version of the question id as it's written
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
  // Note: Totally different from `enter_answer` (which is singular)
  // TODO: If a step triggers this and is not able to set a value, should it error?
  // TODO: Rename to setFieldsOfOnePage? setPageFields?
  setFields: async function ( scope, {
    var_data=[],
    ensure_navigation=true,
    ensure_all_vars_used=false
  }) {
    /* Non-recursive function to set as many variables as possible before
    * continuing to the next page. Important to avoid recursion because of async ops.
    * If it's not data in a table, the code can be more permissive about some input.
    * 
    * @param var_data {arr} - Array of objects containing names of variables, what
    *     value to set them to, and possibly what the page's trigger variable is. Or empty.
    * @param ensure_navigation {bool} [true] - Default true. If true, presses continue button
    *     if navigation is not triggered another way.
    * @param ensure_all_vars_used {bool} [false] = Default false. If true, errors if any
    *     object in var_data is not used during running of this function.
    */
    if ( session_vars.get_debug() ) { console.log( `~~~~~~~~~~~~~~ scope.setFields() ~~~~~~~~~~~~~~` ); }

    // Only record the page id once for each page to which we navigate
    let { id } = await scope.examinePageID( scope, 'none to match' );
    if ( scope.page_id !== id ) {
      await scope.addToReport(scope, { type: `page_id`, value: `${ id }`, });
      scope.page_id = id;
    }

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
        let row_used = await scope.setVariable( scope, { field, var_data });
        if ( row_used ) {

          something_new_was_set = true;
          field.was_set = true;
          await scope.addToReport(scope, {
            type: `row`,
            value: `${ await scope.convertToOriginalStoryTableRow(scope, { row_data: row_used }) }`
          });

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

        let row_used = await scope.setVariable( scope, { field, var_data, });
        if ( row_used ) {

          await scope.addToReport(scope, {
            type: `row`,
            value: `${ await scope.convertToOriginalStoryTableRow(scope, { row_data: row_used }) }`
          });

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
          // if ( error.was_found ) {
          //   await scope.throwPageError( scope, { id: id });
          // }

          did_navigate = true;
          process.stdout.write(`\x1b[36m${ 'v' }\x1b[0m`);  // pressed button successfully
          break;

        }  // ends if row_used
      }  // ends if button submit
    }  // ends for buttons in fields

    // If all table rows must be used and any table row was not, error
    if ( ensure_all_vars_used ) {
      let num_unused_rows = 0;
      for ( let row of var_data ) {
        if ( row.times_used === 0 ) {
          num_unused_rows += 1;
          let source_row = row;
          // TODO: Make the row object flatter so we don't need to dig in this way
          if ( row.source ) { source_row = row.source; }
          let original_row = source_row.original;
          let msg = `Did not find a field on this page for the variable "${ original_row.var }" that could be set to "${ original_row.value }"`;
          await scope.addToReport(scope, { type: `warning`, value: msg });
        }
      }
      if ( num_unused_rows > 0 ) {
        let msg = `Missing variable or variables on page.`;
        await scope.addToReport(scope, { type: `error`, value: msg });
        expect( num_unused_rows, msg ).to.equal( 0 );
      }
    }

    // If didn't already press a continue button, press one now.
    if ( !did_navigate && ensure_navigation  ) {
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
      // if ( error.was_found ) {
      //   await scope.throwPageError( scope, { id: id });  
      // }

      did_navigate = true;
      process.stdout.write(`\x1b[36m${ '>' }\x1b[0m`);  // continued successfully
    }  // ends if !did_navigate && ensure_navigation

    if ( did_navigate && scope.check_all_for_a11y ) {
      let { passed } = await scope.checkForA11y(scope);
      if (!passed) {
        scope.passed_all_for_a11y = false;
      }
    }

    // TODO: Since we now continue only once no matter what, we can put
    // the error in the caller of the function, though we may want
    // to pass the symbol to print as well.
    return error;
    // TODO: Maybe we should return something else or something in addition about used vars
  },  // Ends scope.setFields()

  // TODO: Move this to under `normalizeTable`
  ensureSpecialRows: async function ( scope, { var_data, from_story_table=true }) {
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
      if ( from_story_table && var_datum.var.match( /\.target_number$/ )) {
        let special_row = {
          artificial: true,  // not currently used but is future-proofing to mark non-dev generated rows
          source: var_datum,
          var: var_datum.var.replace( /\.target_number$/, `.there_is_another` ),
          value: await scope.getThereIsAnotherValue( scope, { row: var_datum, from_story_table }),
          // devs are supposed to use the right `trigger` name, but they might not
          trigger: var_datum.trigger.replace( /\.target_number$/, `.there_is_another` ),
        };

        enhanced_var_data.push( special_row );

      // Neutralize a `.there_is_another` row in a story table
      } else if ( from_story_table && var_datum.var.match( /\.there_is_another$/ ) ) {
        var_datum.invalid = true;
        // Removing the row will just cause a different error that will take longer to fail and
        // probably add a confusing message to the report, so mutating seems, sadly, more useful.
        var_datum.value = `False`;  // The original value is still preserved
        // Warn the developer not to use `.there_is_another`.
        await scope.addToReport( scope, { type: `warning`, value: `The attribute \`.there_is_another\` is invalid in story table tests. Replace it with \`.target_number\` in your \`var\` and \`trigger\` columns. Set the \`value\` to the number of items in that list. This test will now set this row's \`value\` to \`False\`. See https://suffolklitlab.github.io/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing#there_is_another. The row data is\n${ JSON.stringify( var_datum.original )}` });
      }
    }

    return enhanced_var_data;
  },  // Ends scope.ensureSpecialRows()

  getThereIsAnotherValue: async function ( scope, { row, from_story_table=true }) {
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
    * This feels precarious, but I can't see another permutation.
    * 
    * This may in future be used to normalize all values that need `True`/`False`
    * normalization.
    */
    let value = row.value.toLowerCase();
    let val_to_print = printable_var_value(row); 
    let int_val = parseInt( value );
    
    // Step stuff. Take into account a lot of possible values
    if ( value.match( /(false|no|unchecked|uncheck|deselected|deselect)/i )) {
      // Should this also contain a warning if this is trying to set `target_number`?
      return `False`;

    } else if ( value.match( /(true|yes|checked|check|selected|select)/i )) {
      if ( from_story_table ) {
        if ( row.var.match( /\.there_is_another$/ ) ) {
          // `.there_is_another` should never get in here, but just in case
          await scope.addToReport( scope, { type: `warning`, value: `The attribute \`.there_is_another\` is invalid in story table tests. Replace it with \`.target_number\` in your \`var\` column. Set the \`value\` to the number of items in that list. This test will now set this row's \`value\` to \`False\`. See https://suffolklitlab.github.io/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing#there_is_another-loop. The row data is\n${ JSON.stringify( row.original )}` });
        } else {
          // If `target_number` is set to True instead of a number
          // Since secret vars can't be passed in a table, this should never be a secret var
          await scope.addToReport( scope, { type: `warning`, value: `${ val_to_print } value is not a valid value for ${ row.var } here. This test will default to \`False\` to avoid problems.` });
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
      // I can't figure out how to trigger this warning either
      await scope.addToReport( scope, { type: `warning`, value: `${ val_to_print } value is not a valid value for ${ row.var } here. This test will default to \`False\` to avoid problems.` });
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
      await scope.page.waitForTimeout( 50 );
      curr_url = await scope.page.url();
      error = await scope.checkForError( scope );
    }

    let timeout_err_message = `The test tried to continue to the next page, but it took longer than ${ (scope.timeout/1000)/60 } min. Check the screenshot.`
    if ( timedOut ) { await scope.addToReport(scope, { type: `error`, value: timeout_err_message }); }
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
      // The below does not work if there's not a space between ':' and 'none'
      simple_user_error: await scope.page.$x(`//*[contains(@class, "da-has-error")][not(contains(@style,"display: none"))]`),
      system_error: await scope.page.$x( '//meta[@content="docassemble: Error"]' ),
    };

    let error_handlers = {};
    let was_found = false;
    for ( let error_key in possible_errors ) {
      if ( possible_errors[ error_key ][0] ) {
        // If you're debugging and you close the window early, the process will still
        // take this long to exit after the tests finish. Not sure how to account for that.
        if ( session_vars.get_debug() ) { await scope.page.waitForTimeout( 60 * 1000 ); }
        was_found = true;
        error_handlers[ error_key ] = possible_errors[ error_key ][0];
      }
    }

    return { was_found, error_handlers };
  },  // Ends scope.checkForError()

  throwPageError: async function ( scope, { error_handlers = {}, id = '' }) {
    /* Throw a cucumber error with the error that appeared on the page. */
    if ( error_handlers.system_error !== undefined ) {
      let sys_err_message = `The test tried to continue to the next page after ${ id }, but there was a system error. Check the screenshot.`
      await scope.addToReport(scope, { type: `error`, value: sys_err_message });
      expect( was_system_error, sys_err_message ).to.be.false;

    } else {
      // If it wasn't a system error, it was a user error
      let user_err_message = `The test tried to continue to the next page after ${ id }, but the user got an error. Check the screenshot.`
      await scope.addToReport(scope, { type: `error`, value: user_err_message });
      expect( true, user_err_message ).to.be.false;
    }

    return scope;
  },  // Ends scope.throwPageError()


  //#####################################
  //#####################################
  // Custom timeouts for **a bunch of stuff** for v7+ of cucumber
  //#####################################
  //#####################################
  steps: {

    screenshot: async ( scope, name ) => {
      /* Download and save a screenshot. `name` does not have to be
      * unique as the filename will be made unique. */
      name = name || '';

      let date = files.readable_date();
      let { id } = await scope.examinePageID( scope, 'none to match' );
      // Include the custom name if it has one
      if ( name.length > 0 ) {
        name = `screenshot-${ name }-on-${ id }-${ date }`;
      } else {
        name = `screenshot_on-${ id }-${ date }`;
      }

      await scope.page.screenshot({
        path: `./${ scope.paths.scenario }/${ name }.jpg`,
        type: 'jpeg',
        fullPage: true
      });

      await scope.afterStep( scope );
    },  // Ends screenshot()

    add_json_vars_to_report: async ( scope ) => {
      /** Uses  https://docassemble.org/docs/functions.html#js_get_interview_variables
      *    to get the variable values on the page of the interview and add
      *    them to the report. */
      let data = await scope.page.evaluate(async function ( elem ) {
        return await get_interview_variables();
      });

      // In future, may be saved to artifact file
      await scope.addToReport( scope, {
        type: `json`,
        value: JSON.stringify( data, null, 2 )
      });
    },  // Ends add_json_vars_to_report()

    link_works: async ( scope, linkText ) => {
      let [link] = await scope.page.$x(`//a[contains(text(), "${ linkText }")]`);
      let prop_obj = await link.getProperty( 'href' );
      let actual_url = await prop_obj.jsonValue();

      let linkPage = await scope.browser.newPage();
      let response = await linkPage.goto( actual_url, { waitUntil: 'domcontentloaded' });

      let msg = `The "${ linkText }" link is broken.`;
      if ( !response.ok() ) { await scope.addToReport( scope, { type: `error`, value: msg }); }
      expect( response.ok(), msg ).to.be.true;

      linkPage.close()

      await scope.afterStep(scope);
    },  // Ends link_works()

    set_regular_var: async ( scope, var_name, set_to ) => {
      /** Set a non-story table variable (with or without a choice associated with it) to a value. Set:
      *  - Buttons associated with variables
      *  - Dropdowns
      *  - Checkboxes (multiple choice checkboxes must be set to "true" or "false")
      *  - Radio buttons
      *  - Text inputs
      *  - Textareas
      */
      // Let kiln know not to test against trigger variable values, even for proxy vars
      let var_data = await scope.normalizeTable( scope, {
        var_data: [{ var: var_name, value: set_to, trigger: scope.trigger_not_needed_flag }],
      });
      // Don't continue if the variable doesn't cause navigation itself. Also,
      // if this variable cannot be set on this page, trigger an error
      await scope.setFields( scope, { var_data, ensure_navigation: false, ensure_all_vars_used: true });
    },  // Ends set_regular_var()

    set_secret_var: async ( scope, var_name, set_to_env_name ) => {
      /** Sets a non-story table variable to a "secret" value (i.e. an env var) */
      // Prevent pictures of a screen with a secret.
      scope.disable_error_screenshot = true;
      let var_data = await scope.normalizeTable( scope, {
              var_data: [{
                var: var_name,
                value: set_to_env_name,
                trigger: scope.trigger_not_needed_flag,
                flags: {secret_name: set_to_env_name}
              }],
      });
      // Don't continue if the variable doesn't cause navigation itself. Also,
      // if this variable cannot be set on this page, trigger an error
      await scope.setFields( scope, { var_data, ensure_navigation: false, ensure_all_vars_used: true });
    },

    tap_term: async ( scope, phrase ) => {
      /** Tap a link that doesn't navigate. Depends on the language of the text. */
      const [link] = await scope.page.$x(`//a[contains(text(), "${phrase}")]`);

      let msg = `The term "${ phrase }" seems to be missing.`;
      if ( !link ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
      expect( link, msg ).to.exist;

      await link.evaluate( elem => { return elem.click(); });

      await scope.afterStep(scope, {waitForShowIf: true});
    },  // Ends tap_term()

    sign: async ( scope ) => {
      /** Sign on a signature page. */
      await scope.sign( scope );
      await scope.afterStep(scope);
    },  // Ends sign()

    download: async ( scope, filename ) => {
      /* Taps the link that leads to the given filename to trigger downloading.
      *    and waits till the file has been downloaded before allowing the tests to continue.
      *    WARNING: Cannot download the same file twice in a single scenario.
      *    WARNING: Must not have any characters that are totally unique to that
      *    page load. It's usually just the name of the file.
      * 
      * TODO: Properly wait for download to complete. See notes in
      * scope.js scope.detectDownloadComplete()
      */
      let [elem] = await scope.page.$x(`//a[contains(@href, "${ filename }")]`);

      let msg = `"${ filename }" seems to be missing. Cannot find a link to that document.`;
      if ( !elem ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
      expect( elem, msg ).to.exist;

      scope.toDownload = filename;
      await elem.evaluate( elem => { return elem.click(); });
      await scope.detectDownloadComplete( scope );
    },  // Ends download()

    set_al_name: async ( scope, var_base, name_str ) => {
      /** Given a variable name and a space-separated string, fills the
      *    appropriate fields on an Assembly Line name question.
      *    It handles any of:
      *    1. A one-word value to set name.text (ex: 'LandlordEtAl')
      *    1. An Individual's name that it will set based on the number of words:
      *       1. Two words - a first and last name (ex: "Tal Taylor")
      *       1. Three words - a first, middle, and last name (ex: "Tal Tay Taylor")
      *       1. Four words - a first, middle, last, and suffix (ex: "Tal Tay Taylor III")
      *
      * The string 'the var'/'the variable' part of the step is optional, as you can see below.
      */
      let name_patterns = [
        [ `text` ],
        [ `first`, `last` ],
        [ `first`, `middle`, `last` ],
        [ `first`, `middle`, `last`, `suffix` ],
      ];

      let name_parts = name_str.split(' ');

      if (name_parts.length > 4) {
        let name_parts_last = name_parts[name_parts.length - 1];
        let name_parts_slice = name_parts.slice(0, 3);
        name_parts_slice.push(name_parts_last);
        name_parts = name_parts_slice;
      
        await scope.addToReport(scope, {
          type: `warning`,
          value: `The name "${name_str}" has more than 4 parts, but 4 is the maximum allowed. The test will set the name to "${name_parts.join(" ")}".`
        });
      }

      let desired_pattern = name_patterns[( name_parts.length - 1 )];

      for ( let parti = 0; parti < name_parts.length; parti++ ) {
        let var_name = `${ var_base }.name.${ desired_pattern[ parti ] }`
        let value = name_parts[ parti ];
        await scope.setVar( scope, var_name, value );
      }

      // Continue to next page...?
      await scope.afterStep(scope, {waitForShowIf: true});
    },  // Ends set_al_name()

    set_al_address: async ( scope, var_base, address_str ) => {
      /** Given a variable name and a four-part address formatted as below,
      *    sets the appropriate Assembly Line address fields.
      *
      * The string 'the var'/'the variable' part of the step is optional,
      *    as you can see below.
      */
      
      // Get all the parts of the address properly separated
      // First, split apart each line of the address to [address line 1, address line 2, city, state zip]...
      let split = address_str.split(/,\s*/);
      // ...then, separate the state and the zip code...
      let last_parts = (split.pop()).split(/\s+/);
      // ...and add them back in, to end up with [address line 1, address line 2, city, state, zip].
      let address_parts = split.concat( last_parts );
      let start = `${ var_base }.address.`;

      let index = 0;
      await scope.setVar( scope, `${start}address`, address_parts[0] );
      // Ensure it's without 'Unit '/'unit '
      await scope.setVar( scope, `${start}unit`, (address_parts[1].toLowerCase()).replace(/unit\s*/, '') );
      await scope.setVar( scope, `${start}city`, address_parts[2] );
      await scope.setVar( scope, `${start}state`, address_parts[3] );
      await scope.setVar( scope, `${start}zip`, address_parts[4] );

      await scope.afterStep(scope, {waitForShowIf: true});
    },  // Ends set_al_address()

    sign_in: async function ( scope, { email_secret_name, password_secret_name }) {
      /** Allow the developer to log a user into their server using GitHub
      * secrets to authenticate.
      */
      // Don't take a picture of a failed login in case one of the inputs is correct
      scope.disable_error_screenshot = true;

      // If there is no browser open, start a new one
      if (!scope.browser) {
        scope.browser = await scope.driver.launch({ headless: !session_vars.DEBUG });
      }
      if ( !scope.page ) { scope.page = await scope.browser.newPage(); }

      // Go to the sign in page
      let login_url = `${ session_vars.get_da_server_url() }/user/sign-in`;
      await scope.page.goto( login_url, { waitUntil: `domcontentloaded`, timeout: scope.timeout })
      await scope.page.waitForSelector( `.dabody` );

      let email = process.env[ email_secret_name ];
      let password = process.env[ password_secret_name ];

      // Give as many useful messages to the user as possible if the env vars
      // aren't defined. Eventually, just provide a link to the docs because
      // this is complex
      let email_msg = `The email address GitHub SECRET "${ email_secret_name }" doesn't exist. Check for a typo and check your workflow file.`
      if ( email === undefined ) {
        await scope.addToReport( scope, { type: `error`, value: email_msg })
      }
      let password_msg = `The password GitHub SECRET "${ password_secret_name }" doesn't exist. Check for a typo and check your workflow file.`
      if ( password === undefined ) {
        await scope.addToReport( scope, { type: `error`, value: password_msg })
      }
      expect( email, email_msg ).to.not.equal( undefined );
      expect( password, password_msg ).to.not.equal( undefined );

      // Try to log in
      await scope.page.type( `#email`, email );
      await scope.page.type( `#password`, password );
      await scope.page.$eval( `button[name="submit"]`, (elem) => { return elem.click(); });

      // Wait to see the success message.
      // This is a bit of an assumption and needs success and failure testing
      // TODO: use a Promise.race to fail faster.
      await scope.page.waitForSelector( `.datopcenter .alert-success` );

      await scope.addToReport( scope, {
        type: `row`,
        value: `Signed into ${ session_vars.get_da_server_url() }/user/sign-in successfully.`
      });

      await scope.afterStep(scope, {waitForShowIf: false});
    },  // Ends scope.steps.sign_in()

    set_random_page_vars: async ( scope ) => {
      /** Answer inputs randomly. */

      let html = await scope.page.content();
      // These are the fields on the current page. Their handles should all exist.
      let fields = await scope.getAllFields( scope, { html: html });

      // For every field on the page
      for ( let field of fields ) {

        // * @param fields - data representing one DOM field
        // * @param fields[n].selector {str} - used to find the DOM node
        // * @param fields[n].tag {str} - HTML tag of node
        // * @param fields[n].type {str} - HTML type of node if it has one
        // * @param fields[n].guesses {arr} - arr of objects that could
        // *    possibly match a table row's `var` column
        // * @param fields[n].guesses[n].var {str} - name of variable
        // * @param fields[n].guesses[n].value {str} - value of a choice
        // * @param <fields[n].guesses[n].trigger> {str} - var name that triggered this page

        // Try to give a random answer for that element tag
        await scope.set_random_input_for[ field.tag ]( scope, { field: field });

      }  // End for all page fields

    },  // Ends scope.steps.set_random_page_vars()

  },  // ends scope.steps

  set_random_input_for: {
    button: async function (scope, { field }) {
      // Do nothing at the moment. For MVP, we expect a button to navigate.
    },
    textarea: async function (scope, { field }) {
      // Get random paragraph of text
      let answer = faker.lorem.paragraph();
      // Get the element's puppeteer handler
      let handle = await scope.get_handle_from_selector( scope, { field: field });
      // Type the random text into the textarea
      await scope.funnel_the_answer( scope, { handle, field, set_to: answer });
      // await scope.enter_answer[ field.type ]( scope, { handle, set_to: answer } );
    },
    select: async function (scope, { field }) {
      // Get the values of all the options of the field
      let handle = await scope.get_handle_from_selector( scope, { field: field });
      // Get the values of all the choices
      let answer_choices = await handle.evaluate(function ( elem ) {
        let values = Array.from(elem.querySelectorAll(`option`)).map(element=>element.value);
        return values;
      });

      // Select randomly between them
      // https://fakerjs.dev/api/helpers.html#uniqueArray
      let answer_array = faker.helpers.uniqueArray( answer_choices, 1 );
      let answer = answer_array[ 0 ];

      // Set that value
      await scope.funnel_the_answer( scope, { handle, field, set_to: answer });

    },
    canvas: async function (scope, { field }) {
      // WARNING: Do not test this in headless mode.
      // If we do this in headless mode, the test will fail. It signs, but
      // can't continue. Not sure why.
      let handle = await scope.get_handle_from_selector( scope, { field: field });
      await scope.funnel_the_answer( scope, { handle, field, set_to: `doesn't matter` });
    },
    input: async function (scope, { field }) {
      /** Handles various `type`s of input element fields, except:
      * 
      * Does not handle "file" type
      * Does not handle custom data values yet, like BirthDate, because they have
      *    `type="hidden"` which also matches other special da fields on the
      *    page that we SHOULDN'T interact with.
      * Does not handle range, which is not a `type`, but it is an input element
      */

      // Use the type instead of the tag to get get the answer for
      // an input field
      let type = field.type;
      
      // Custom datatype question: Do all custom datatypes hide their
      // original field? Probably not...
      // TODO: Move custom datatype checking to the caller of this
      // function somehow - in future, not all custom datatypes will
      // be inputs _and_ this won't handle, for example, a `select` field
      // that is part of a custom datatype with a hidden field and this
      // doesn't take care of that situation. Also, don't rely on a
      // hidden field. Only do so if a hidden field does actually exist -
      // some custom datatypes won't have hidden fields.

      let handle = await scope.get_handle_from_selector( scope, { field: field });

      // If this is a custom datatype
      let custom_datatype = await scope.get_custom_datatype( scope, { handle });
      let is_custom_datatype = scope.get_random_input_for[ custom_datatype ] !== undefined;
      if ( is_custom_datatype ) {

        // And the custom datatype has a hidden field (which will be the original field)
        let hidden_field = await scope.get_custom_datatype_hidden_field( scope, { handle });
        if ( hidden_field !== null ) {
          // only set the value once - just for the original field
          if ( type === `hidden` ) {

            // set the value
            let set_to = await scope.get_random_input_for[ custom_datatype ]( scope );
            await scope.funnel_the_answer( scope, { handle, field, set_to });

          }
          // Otherwise ignore the non-original field

        // Untested: If no hidden field exists, just try to set the custom
        // datatype field
        } else {
          // set the value
          let set_to = await scope.get_random_input_for[ custom_datatype ]( scope );
          await scope.funnel_the_answer( scope, { handle, field, set_to });
        }

      // If this is not a custom datatype
      } else {

        // `file` type inputs come next to an input with a type of ''.
        // Maybe others do too.
        if ( type !== `` && type !== `hidden` ) {
          // Field types that we can't yet handle, but plan to in future
          if ( type === `file` ) {
            await scope.addToReport( scope, {
              type: `warning`,
              value: `Sorry, ALKiln cannot yet handle "${ type }" fields.`
            });
          } else {
            let set_to = await scope.get_random_input_for[ type ]( scope );
            await scope.funnel_the_answer( scope, { handle, field, set_to });
          }  // ends if field type is one we cover
        }  // ends if field type exists

      }  // ends if is custom datatype

    },  // ends scope.set_random_input_for.input
  },  // ends scope.set_random_input_for

  get_custom_datatype_hidden_field: async function (scope, { handle }) {
    /** If there's a hidden field in a custom datatype, returns that
    *    DOM node, otherwise returns null. */

    let hidden_field = await handle.evaluate(( elem )=> {
      // If the element is in a form group**, then extract the form group's
      // datatype value.
      // ** For now the only custom datatype we have is in a form group. In
      // future we should look into what happens with a `fieldset` for
      // `choices:`, etc.
      let custom_datatype = null, matches = null;
      let group = elem.closest( `.da-form-group` );
      // Returns an element or null
      let hidden_child = group.querySelector( `[type="hidden"]` );

      return hidden_child;
    });

    return hidden_field;
  },  // Ends scope.get_custom_datatype_hidden_field()

  get_random_input_for: {
    checkbox: async function ( scope ) {
      return `${ Math.random() > .5 }`;
    },
    radio: async function ( scope ) {
      return `${ Math.random() > .5 }`;
    },
    text: async function ( scope ) {
      return faker.random.word();
    },
    number: async function ( scope ) {
      let answer_array = faker.helpers.uniqueArray( [`1`, `2`, `3`], 1 );
      return answer_array[ 0 ];
    },
    date: async function ( scope ) {
      let past = faker.date.past(25);
      let future = faker.date.future(1);

      let date = null;
      if ( Math.random() > .5 ) {
        date = past;
      } else {
        date = future;
      }
      // Ensure 2-digit number for month and day
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = ("0" + (date.getDay() + 1)).slice(-2);
      // Format the string in the way ALKiln can read it
      return `${ month }/${ day }/${ date.getFullYear() }`;
    },
    currency: async function ( scope ) {
      return `${ Math.random() * 100 }`;
    },
    email: async function ( scope ) {
      return faker.internet.email( faker.random.word(), faker.random.word(), `example.com` );
    },
    password: async function ( scope ) {
      return faker.internet.password();
    },
    hidden: async function ( scope ) {
      return null;
    },
    BirthDate: async function ( scope ) {
      let date = faker.date.birthdate({ max: 70, min: 0, mode: `age` });
      // Ensure 2-digit number for month and day
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = ("0" + (date.getDay() + 1)).slice(-2);
      // Format the string in the way ALKiln can read it
      let date_str = `${ month }/${ day }/${ date.getFullYear() }`;
      return date_str;
    },
    ThreePartsDate: async function ( scope ) {
      return await scope.get_random_input_for.date( scope );
    },
  },  // ends scope.get_random_input_for()


  //#####################################
  //#####################################
  // Framework Development
  //#####################################
  //#####################################
  reportIncludesAllExpected: async function ( scope, { expected=[] }) {
    /* Tests the behavior of this testing framework.
    * Test whether the expected values are included in the test report.
    * 
    * @param expected {array} Arr of strs that should appear in the report.
    */
    let current_report_obj = scope.report.get( scope.scenario_id );
    let scenario = [ scope.scenario_id, current_report_obj ];  // Mimic how loop works with `Map`
    let report = await scope.getPrintableScenario( scope, { scenario });
    let all_are_included = true;
    for ( let one_expectation of expected ) {
      if ( !report.includes( one_expectation )) {
        all_are_included = false;
        expect( report ).to.contain( one_expectation );
      }
    }

    return all_are_included;
  },  // Ends scope.reportIncludesAllExpected()
};
