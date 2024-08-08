const { expect } = require('chai');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const safe_filename = require("sanitize-filename");
// "en" is faster to import: https://github.com/faker-js/faker/issues/1114#issuecomment-1169532948
const faker = require('@faker-js/faker/locale/en').faker;

// Ours
const pdf_reader = require('./utils/pdf_reader');
const session_vars = require('./utils/session_vars');
const get_base_interview_url = require(`./docassemble/get_base_interview_url`);
const time = require('./utils/time');
const log = require('./utils/log');
const { waitForTimeout } = require('./utils/time');
const files = require('./utils/files' );
const da_api = require('./docassemble/docassemble_api_interface');
const wrapPromiseWithTimeout = require('./cucumber_8_shim');
const reports = require(`./utils/reports`);


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
};

let fromBase64 = function(base64_str) {
  /* Takes a base64 encoded string and returns it decoded.
   * Note that this can take strings with invalid base 64 characters,
   * but will change those characters to `/`s instead.
   */
  let buffer = Buffer.from( base64_str, 'base64' );
  return buffer.toString( `utf-8` );
}

let toBase64 = function ( utf8_str, exclude_padding=true) {
  /* Encoded a given string (@param utf8_str) in base64.
   * @param exclude_padding {boolean} - if true, strips off `=` characters
   *     that are added as padding while base64 encoding (docassemble doesn't
   *     include those characters, and uses the UTF-7 base64 encoding
   *     (RFC-2152)). For more details, see
   *     https://github.com/nodejs/node/issues/6107#issuecomment-207177131
   */
  if ( typeof( utf8_str ) !== `string`  ) {  // Prevent an error
    return `Will+Never+Match+Existing+DOM+Node==`;
  }
  let buffer = Buffer.from( utf8_str, 'utf-8' );
  let base64str = buffer.toString( `base64` )
  return exclude_padding ? base64str.replace(/=/g, '') : base64str;
}

let proxies_regex = /(\bx\.)|(\bx\[)|(\[[ijklmn]\])/g;
let da_base64_regex = /^[A-Za-z0-9+/]+$/;

module.exports = {
  trigger_not_needed_flag: `ALKiln: no trigger variable needed`,

  getSafeScenarioBaseFilename: async function( scope, { scenario }) {
    /** Return a string that's safe to be a filename. Include the Scenario
    *    description and tags.
    */
    let filename = scenario.pickle.name;
    let safe_name = safe_filename( filename, { replacement: `_` });
    // Allow room for extensions, date, etc.
    let short_name = `${ safe_name }`.substring(0, 70);

    return short_name;
  },  // Ends scope.getSafeScenarioBaseFilename()

  // TODO: Does this need a name change? getSafeScenarioBasedFilename?
  getSafeScenarioFilename: async function( scope, options={ prefix: '' }) {
    /* Return a string that's safe to be a filename. Use a timestamp,
    *    a prefix the caller wants, and the base filename. We hope it can
    *    contain non-english characters too. We do not offer a suffix option
    *    because it may be cut off if the filename is too long.
    * 
    * @Examples
    * Return value possible formats
    * prefix-id-scenario_description-timestamp
    * id-scenario_description-timestamp
    * scenario_description-timestamp
    * 
    * @returns str
    */
    let name = options.prefix || '';

    // As long as it's not an empty string, add a separator between it and the rest of the name
    if ( name.length > 0 ) {
      name += `-`;
    }

    if ( scope.page ) {
      let { id } = await scope.examinePageID( scope, 'none to match' );
      let short_id = `${ id }`.substring(0, 20);
      name += `${ short_id }-`;
    }

    name += scope.base_filename;
    name += `-${ Date.now() }`;

    let safe_name = safe_filename( name, { replacement: `_` });
    return safe_name;
  },  // Ends scope.getSafeScenarioFilename()

  getA11yPath: async function( scope ) {
    // Get a unique path for a json file
    let { id } = await scope.examinePageID( scope, 'none to match' );
    let short_id = `${ id }`.substring(0, 20);
    // Need timestamp in case of a loop where the same page gets assessed for a11y multiple times
    let a11y_path = path.join( scope.paths.scenario, `aXe_failure-${ short_id }-${ Date.now() }.json` );
    return a11y_path;
  },

  getJSONFilename: async function( scope ) {
    // Get a unique path for a json file
    let { id } = await scope.examinePageID( scope, 'none to match' );
    let short_id = `${ id }`.substring(0, 20);
    let json_path = path.join( scope.paths.scenario, `json_for-${ short_id }-${ Date.now() }.json` );
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
    if ( showif ) { await time.waitForTimeout( scope.showif_timeout ); }
  },

  waitForTab: async function waitForTab(scope, { tab_id }) {
    /**
     * @param { tab_id } the aria-labeledby text of the tab panel, which
     *   we use to query and wait for that tab panel to be shown.
     */
    // Implementation linked to https://github.com/SuffolkLITLab/docassemble-ALToolbox/blob/4aa1069389d2ca9cadb586f309dd73d791f081d1/docassemble/ALToolbox/misc.py#L127
    // I think `.$()` does not use a timeout
    if ( tab_id.length == 0) { return }
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
    }, `div[aria-labelledby="${ tab_id }"]`);
  },

  afterStep: async function afterStep(scope, options = {waitForShowIf: false, navigated: false, waitForTimeout: 0}) {
    /** Common things to do after a step, including take care of errors.
     *    `waitForShowIf` is automatically `false` for observation/non-interactive steps, etc.
     *
     *    TODO: discuss splitting into `afterField` and `afterStep` or something. Or just change name
     *    TODO: Update to latest cucumberjs, which has `AfterStep`
     */

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

        reports.addToReport(scope, { type: `error`, code: `ALK0101`, value: system_error_text });
        throw system_error_text;
      };

      // Wait for elements that might get revealed
      if ( options.waitForShowIf ) { await scope.waitForShowIf( scope ); }
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

  tapElementAndNavigate: async function(scope, { elem, waitForTimeout=0 }) {
    /** Tap a given element, detect navigation, and do appropriate related things.
     *  TODO: not quite sure if we'll be using `waitForTimeout`. */

    let start_url = await scope.page.url();  // so we can later check for navigation

    await scope.tapElementAndStayOnPage(scope, {
      elem,
      click_promise: Promise.all([
        scope.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        elem.evaluate( (el) => { return el.click(); })
      ])
    });

    // TODO: Not sure how to detect navigation landing at same page, such as
    // with a user input validation error. Does that count as navigating?
    // Maybe url change + trigger var change? Maybe just trigger var?
    let end_url = await scope.page.url();
    let navigated = start_url !== end_url;

    // Might be able to handle this in `scope.afterStep`
    if ( navigated ) {

      // TODO: Can we remove this?
      // Save the id that comes next
      let { question_has_id, id, id_matches } = await scope.examinePageID( scope, 'none to match' );

      // If navigation, wait for 200ms to let things finish loading and moving
      await scope.afterStep(scope, { waitForTimeout: 200, navigated: true });
    } else {
      await scope.afterStep(scope, { waitForTimeout, navigated: false });
    }
  },  // Ends scope.tapElementAndNavigate()

  tapElementAndStayOnPage: async function(scope, { elem, click_promise }) {
    /** Tap a given element, detect navigation, and do appropriate related things.
    *  `click_promise can be any kind of Promise, including a Promise.all()
    */
    await scope.guard_against_missing_tap_element(scope, { elem });

    // Get the text on the button or link for a potential error message later
    let tapperText = await (await elem.getProperty('textContent')).jsonValue();

    click_promise = click_promise || elem.click();
    
    // TODO: implement and use scope.handle_possible_timeout()
    try {
      // Serever error loads page, so keeping things shorter by not looking
      // for that text too. Also, puppeteer will ensure proper timeout.
      await Promise.race([
        click_promise,
        // This is meant to detect user-visible alerts/errors,
        // not breaking errors in the testing code.
        scope.page.waitForSelector('.alert-danger', { visible: true }),
        scope.page.waitForSelector('.da-has-error', { visible: true }),
      ]);
    } catch ( error ) {

      if ( error.name === `TimeoutError` ) {
        let non_reload_report_msg = `After ALKiln tapped "${ tapperText }" it took too long to load the next page.`;
        await scope.handle_page_timeout_error( scope, { non_reload_report_data: {
          code: `ALK0103`,
          message: non_reload_report_msg,
        }, error });
      } else {
        // Throw any non-timeout error
        let err_msg = `An error occurred when ALKiln tried to tap "${ tapperText }".`
        reports.addToReport( scope, { type: `error`, code: `ALK0104`, value: err_msg });
        throw error;
      }  // ends if error is timeout error

    }  // ends try/catch
  },  // Ends scope.tapElementAndStayOnPage()

  guard_against_missing_tap_element: async function(scope, { elem }) {
    /** Handle the error message for a missing tap element, if it's missing. */
    let msg = `Cannot find the element to tap.`;
    if ( !elem ) { reports.addToReport(scope, { type: `error`, code: `ALK0102`, value: msg }); }
    expect( elem, msg ).to.exist;
    return elem;
  },

  // Handle server reload errors
  server_statuses: [],
  server_check_interval_ms: 1 * 1000,
  stop_tracking_server_status: false,
  track_server_status: async function( scope ) {
    /** Updates server_statuses list by checking if server is responding until,
    *    eventually, it is told to stop. */
    let server_check_start_time = Date.now();

    while ( !scope.stop_tracking_server_status ) {
      // This code assumes a reasonable response time would be n seconds if the
      // server is up and that a server reload/restart won't take less than n seconds.
      // Also, it's non-blocking, so it doesn't slow down tests
      let is_up = await da_api.is_server_responding({ timeout: scope.server_check_interval_ms });
      // Add status to the beginning of the list to make truncating easier
      scope.server_statuses.unshift( is_up );

      // Ensure we wait longer if a full second hasn't yet passed
      let ms_passed = Date.now() - server_check_start_time;
      // Use Math.max to ensure no negative numbers
      let ms_remaining = Math.max( 0, scope.server_check_interval_ms - ms_passed );
      await time.waitForTimeout( ms_remaining );
      // Prepare for next check
      server_check_start_time = Date.now()

      // To make it easier to check past server statuses, remove defunct server statuses
      let max_length = Math.round( scope.timeout/scope.server_check_interval_ms );
      // Trying to extract more items than the actual length is ok
      scope.server_statuses = scope.server_statuses.slice( 0, max_length );
    }  // ends while !scope.stop_tracking_server_status
    
  },  // Ends scope.track_server_status()

  did_server_reload: async function( scope ) {
    return scope.server_statuses.includes( false );
  },  // Ends scope.did_server_reload()

  // handle_possible_timeout: async function( scope, {
  //   promise: ,
  //   non_timeout_msg: ,
  //   normal_timeout_msg: ,
  //   actual_error: ,
  // }) {},  // Ends scope.handle_possible_timeout()

  handle_page_timeout_error: async function( scope, { non_reload_report_data, error } ) {
    /* For a page timeout error, handles server reload vs. other timeout errors
    
    @param options.non_reload_report_data { str } Non-reload message to add to
        the report as an error.
    @param options.error { object | str } Error to throw. It can be the actual
        error object or a string that will show up as a message in the error.
    */
    // If the server was reloading during that time, wait for the server to
    // respond again so the next test has a better chance of passing. Then
    // throw an error. The command-line script will re-try the Scenario after.
    let server_reloaded_during_interval = await scope.did_server_reload( scope );
    if ( server_reloaded_during_interval ) {
      // Wait for the server to reload just to make sure the next test
      // doesn't also fail because of this same server reload.
      await scope.get_server_reload_promise( scope );
    } else {
      // Otherwise just throw the error
      reports.addToReport( scope, {
        type: `error`,
        code: non_reload_report_data.code,
        value: non_reload_report_data.message });
      throw error;
    }
  },  // Ends scope.handle_page_timeout_error()

  get_server_reload_promise: async function( scope ) {
    /** If the promise already exists in state, return it because it can
    *    be used anywhere with `await`. Otherwise, make the promise, store
    *    it in state, and return that.
    */
    if ( scope.server_reload_promise !== null ) {
      // Return the existing promise of the func that will check on reloading the server
      return scope.server_reload_promise

    } else {
      // Create and return the promise of the func that will check on reloading the server
      scope.server_reload_promise = scope.wait_for_server_response( scope );
      return scope.server_reload_promise;
    }
  },  // Ends scope.get_server_reload_promise()

  wait_for_server_response: async function( scope ) {
    /** Wait for the server to respond using a multiple of scope.timeout
    *    (or a custom timeout?) so the tests don't fail just because the
    *    server isn't responding. Should this take an argument of an amount
    *    of time to check or just assume we're using scope.timeout?
    *
    * This should only be called if the server failed to respond at some point.
    * 
    * This currently assumes we're either using scope.timeout as basis for
    * the amount of time in which to detect a finished reload or that
    * there's a test input that defines a different timeout.
    */
    
    let ms_till_server_timeout;
    if ( session_vars.get_server_reload_timeout() !== null ) {
      // Should we require the expected value to be seconds instead of ms?
      ms_till_server_timeout = parseInt( session_vars.get_server_reload_timeout() );
    } else {
      // Default server timeout will always be based on scope.timeout even if it changes
      ms_till_server_timeout = 5 * scope.timeout;
    }

    let throw_after_server_reloads = async function () {

      // Continue waiting until server has responded or until it's taken too long
      let time_accumulator = 0;
      let max = ms_till_server_timeout/scope.server_check_interval_ms

      while ( scope.server_statuses[0] !== true && time_accumulator < max ) {
        await time.waitForTimeout( scope.server_check_interval_ms );
        time_accumulator += 1;
      }

      // If the server hasn't responded yet even now, let the developer know
      if ( time_accumulator >= max ) {
        let timeout_message = `The server took longer than `
          + `${ Math.round( ms_till_server_timeout/1000 ) } seconds to respond. `
          + `If the server was just reloading and needed more time, try setting the `
          + `"SERVER_RELOAD_TIMEOUT_SECONDS" GitHub secret to a longer amount of time.`
        reports.addToReport( scope, { type: `error`, code: `ALK0105`, value: timeout_message });
      }

      // Once server has responded, throw an error to end the test. After the first
      // failure, the whole Scenario should retry because of command line flag. Hopefully
      // it'll get through the next time. We considered trying to redo the input on the
      // page instead of re-doing the whole test, but that wouldn't work - we don't
      // know how many Steps to back to do that and we can't redo Steps anyway.
      await scope.throw_server_was_reloading_error( scope )
    };

    await throw_after_server_reloads();

  },  // Ends scope.wait_for_server_response()

  throw_server_was_reloading_error: async function( scope ) {//, { server_timeout_id, timeout_message } ) {
    /* Throw the server reload error with appropriate side effects. */
    let reload_failure_msg = `The test was unable to continue because it `
      + `took too long to reach the server. ALKiln will try this Scenario a total of `
      + `2 times. A full error will be printed for the second attempt.`;
    reports.addToReport( scope, { type: `error`, code: `ALK0106`, value: reload_failure_msg });
    // clearTimeout( server_timeout_id );
    throw( reload_failure_msg );
  },  // Ends scope.throw_server_was_reloading_error()

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

    // If file has finished downloading
    if ( scope.downloadComplete ) {
      // reset the flag and resolve
      scope.downloadComplete = false;
      return true;
    }

    // Stop/resolve if too much time has passed
    let expirationTime = scope.timeout - 200;  // ms
    if ( !endTime ) { endTime = new Date((new Date()).getTime() + expirationTime); }
    let diff = endTime.getTime() - Date.now();
    if ( diff <= 0 ) { return false; }

    // If time hasn't expired, wait and then check again
    await time.waitForTimeout( 100 );
    await scope.detectDownloadComplete(scope, endTime);

    return false;
  },

  continue_button_selector: `fieldset.da-field-buttons button[type="submit"].btn-primary`,
  signature_selector: `fieldset .dasigsave`,
  continue: async function ( scope ) {
    /* Presses whatever button it finds that might lead to the next page. */
    // Any selectors I find seem somewhat precarious.
    let elem = await Promise.race([
      scope.page.waitForSelector(scope.continue_button_selector),  // other pages (this is the most consistent way)
      scope.page.waitForSelector(scope.signature_selector),  // signature page
    ]);
    await elem.evaluate( el => { return el.className });
    // Waits for navigation or user error
    await scope.tapElementAndNavigate( scope, { elem });
  },  // Ends scope.continue()

  continue_exists: async function ( scope ) {
    /** Return true if a button that will allow continuing appears
    *    on this page. Otherwise return false. */

    // Will only find this with "Continue buttons":
    // * An actual continue button that doesn't set a variable
    //   <button class="btn btn-da btn-primary" type="submit">Continue</button>
    // * One that sets a variable:
    //   <button type="submit" class="btn btn-da btn-primary" name="Zm9v" value="True">Continue</button>
    // It will not find event screen `buttons:`, like an exit button or a restart button
    // <button type="submit" class="btn btn-da btn-danger" name="X211bHRpcGxlX2Nob2ljZQ" value="0">exit</button>
    // `buttons:` can be used in question blocks as choices
    let regular = await scope.page.$(scope.continue_button_selector);
    let signature = await scope.page.$(scope.signature_selector);

    return regular !== null || signature !== null;

  },  // Ends scope.continue_exists()

  tapTab: async function ( scope, tab_id ) {
    let elem = await scope.page.$(`#${tab_id}`); 
    let error_msg = `Couldn't find the tab with id "#${tab_id}" on the page, is there a typo?`;
    if ( !elem ) {
      reports.addToReport(scope, { type: `error`, code: `ALK0107`, value: error_msg });
    }
    expect( elem, error_msg ).to.exist;
    await scope.tapElementAndStayOnPage(scope, { elem });
    await scope.waitForTab( scope, { tab_id });
  },

  checkForA11y: async function (scope ) {
    /** Return if there were any violations and the file containing aXe output with more details of the checks */
    let { id } = await scope.examinePageID( scope, 'none to match' );
    if ( scope.page_id !== id ) {
      reports.addToReport(scope, { type: `page_id info`, code: `ALK0108`, value: `${ id }`, });
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
      axe_path = await scope.getA11yPath( scope );
      fs.writeFileSync( axe_path, JSON.stringify( axe_result, null, 2 ));
      let msg = `Found potential accessibility issues on the ${ scope.page_id } screen. Details in ${ axe_path }.`;
      reports.addToReport( scope, { type: `error`, code: `ALK0109`, value: msg });
    } else {
      reports.addToReport(scope, { type: `row info`, code: `ALK0110`, value: `Accessibility on ${ scope.page_id } passed!`})
    }
    return {
      passed: axe_result.violations.length == 0,
      axe_filepath: axe_path
    };
  },

  tapSelectorToNavigate: async function ( scope, selector, waitForTimeout ) {
    let elem = await scope.page.$(`${ selector }`);
    let error_msg = `Couldn't find "${ selector }" on the page, is there a typo?`;
    if ( !elem ) {
      reports.addToReport(scope, { type: `error`, code: `ALK0111`, value: error_msg });
    }
    expect( elem, error_msg ).to.exist;
    await scope.tapElementAndNavigate( scope, { elem, waitForTimeout });
  },

  tapSelectorAndStay: async function ( scope, { selector }) {
    let elem = await scope.page.$(`${ selector }`);
    let error_msg = `Couldn't find "${ selector }" on the page, is there a typo?`;
    if ( !elem ) {
      reports.addToReport(scope, { type: `error`, code: `ALK0112`, value: error_msg });
    }
    expect( elem, error_msg ).to.exist;
    await scope.tapElementAndStayOnPage(scope, { elem });
    await scope.afterStep(scope, { waitForShowIf: false, navigated: false, waitForTimeout: 0 });
  },

  load: async function ( scope, file_name ) {
    /* Try to load the page. Should we also pass a `timeout` arg or just
    *    use scope.timeout? */

    let interview_url = null;
    // If the file is already a full url, just use that arbitrary url
    if ( /^http/.test( file_name ) ) {
      interview_url = file_name;

    // If the filename is not a full url
    } else {
      // If the filename is just the name of the interview without `.yml`, add `.yml` to the end
      if ( !file_name.includes('.yml') ) { file_name = `${ file_name }.yml` }
      // Otherwise, the filename might have url args, so leave it alone

      // Add the server address to the filename
      let base_url = await get_base_interview_url();
      interview_url = `${ base_url }${ file_name }`;
    }

    reports.addToReport(scope, {
      code: `ALK0113`,
      type: `row info`,
      value: `Trying to load the interview at "${ interview_url }"`
    });

    if ( !scope.page ) { scope.page = await scope.browser.newPage(); }

    // TODO: implement and use scope.handle_possible_timeout()
    try {

      await scope.page.goto(interview_url, { waitUntil: 'domcontentloaded', timeout: scope.timeout });
      // Get interview session values, if possible, so we can delete the session later
      let interview_vars = await scope.page.evaluate(async function() {
        try {
          // won't exist on non-da interview pages
          return await get_interview_variables();
        } catch (error) {
          return null;
        }
      });
      scope.set_interview_session_data( scope, { vars: interview_vars });

    } catch ( error ) {

      // If the page didn't load because it took to long to load
      if ( error.name === `TimeoutError` ) {

        let non_reload_report_msg = `Timeout error occurred when ALKiln tried to go to the interview at ${ interview_url }`;
        await scope.handle_page_timeout_error( scope, { non_reload_report_data: {
          code: `ALK0114`,
          message: non_reload_report_msg,
        }, error });
        // TODO: Should this throw to avoid multiple error messages?

      // If the page didn't load because of any other reason
      } else {

        // Throw any non-timeout error
        reports.addToReport( scope, {
          type: `error`,
          code: `ALK0115`,
          value: `Error occurred when ALKiln tried to go to the interview at ${ interview_url }`
        });
        throw( error );
      }  // ends if error is timeout error

    }  // ends try/catch

    let load_result = await scope.getLoadData( scope );
    // da page invalidation errors or timeout will show an error to the developer at the end
    if ( load_result.error ) {
      reports.addToReport(scope, {
        type: `error`,
        code: `ALK0116`,
        value: `On final attempt to load interview at "${ interview_url }", got "${ load_result.error }"`
      });
      expect( load_result.error ).to.equal( '' );
    } else {
      reports.addToReport(scope, { type: `row info`, code: `ALK0117`, value: `Successfully found the interview at "${ interview_url }"` });
    }

    return scope.page;
  },  // Ends scope.load()

  set_interview_session_data: function ( scope, { vars = null }) {
    /** Sets this interview's session data for this scenario if it doesn't
     *    already exist.
     *
     * @returns final_vars { object | null }
     * @returns final_vars.i { str } File path of interview
     * @returns final_vars.uid { str } UID of interview
     * */
    if ( vars && vars.i ) {
      let scenario = scope.scenarios.get( scope.scenario_id );
      if ( !scenario.interviews ) { scenario.interviews = {}; }
      if ( !scenario.interviews[ vars.uid ] ) {
        scenario.interviews[ vars.uid ] = vars;
        log.debug({
          code: `ALK0185`, type: `info`,
          pre: `Saved new interview data. File path: ${ vars.i }. Session id: ${ vars.uid }.`
        });
      } else {
        log.debug({
          code: `ALK0186`, type: `info`,
          pre: `Interview data already existed. File path: ${ vars.i }. Session id: ${ vars.uid }.`
        });
      }
      return vars;
    } else {
      log.debug({ code: `ALK0187`, type: `info`, pre: `Found no interview data.` });
      return null;
    }
  },  // Ends scope.set_interview_session_data()

  getLoadData: async function ( scope ) {
    /* Return elements that could load on the page, like #daMainQuestion
    * and #da-retry. If there's a system error on the page, return its main text.
    * 
    * If server isn't loaded yet, it should get the browser timeout error,
    * which won't match those selectors and this will timeout and error. */
    let result = { error: ``, elem: null };

    // Wait for at least one of these to appear
    let winner = await Promise.race([
      // Signature page
      scope.page.waitForSelector( `#dasigpage`, { timeout: scope.timeout }),
      // Any other valid page
      scope.page.waitForSelector( `#daMainQuestion`, { timeout: scope.timeout }),
      scope.page.waitForSelector( `#da-retry`, { timeout: scope.timeout }),
    ]).catch( function ( error ) {
      // With any error in here, stop execution of the test

      // If none of them appear before this times out
      if ( error.name.includes(`TimeoutError`) ) {

        result.error = `ALKiln could not find any interview question page with the given information`;
        return result;

      // or if they cause some other kind of error
      } else {
        reports.addToReport(scope, {
          type: `error`,
          code: `ALK0118`,
          value: `ALKiln got an error when it tried to load the interview page.`,
          data: error
        });
        throw error;
      }  // ends if error.name.includes(`TimeoutError`)
    });  // ends Promise.race()

    result.elem = winner;

    // If a page was loaded, but there's a specific type of error on the page
    // throw an error
    let error_id_elem = await scope.page.$( `#da-retry` );
    if ( error_id_elem ) {

      // If it's a specific type of error, we can show the developer its text
      let error_elem = await scope.page.$( `blockquote` );
      if (error_elem !== null) {
        let error_handle = await error_elem.getProperty( `textContent` );
        let system_error_text = await error_handle.jsonValue();

        result.error = system_error_text;

      // Error types we haven't accounted for
      } else {
        result.error = "Docassemble ran into an error on the page, but ALKiln does not know what the error is. Check the picture of this page. If a secret variable was used, there will be no picture.";
      }  // ends if error_elem !== null
    }  // ends if error_id_elem

    return result;
  },  // Ends scope.getLoadData()

  normalizeTable: async function ( scope, { var_data=null, raw_var_data=null }) {
    /* Return data derived from cucumber variable-setting data, from either an object format
     * (var_data) or an array format (raw_var_data). `var_data` only is used when calling
     * normalizeTable internally.
     */

    if (!var_data && !raw_var_data) {
      let no_data_msg = `ALKiln Internal error: normalizeTable called w/o var_data or raw_var_data:` +
          ` open an issue at https://github.com/SuffolkLITLab/ALKiln/issues/new if you see this!`;
      reports.addToReport( scope, { type: `error`, code: `ALK0119`, value: no_data_msg });
      throw Error(no_data_msg);
    }

    // Always use the raw var data if present; it has the full first row
    if (raw_var_data) {

      var_data = raw_var_data.hashes();
      // If this table doesn't have headers
      if (!(`var` in var_data[0]) || !(`value` in var_data[0])) {
        let raw_array = raw_var_data.raw();
        var_data = [];
        for (let row_raw of raw_array) {

          // Wrong number of columns error
          if (row_raw.length < 2 || row_raw.length > 3) {
            let more_or_less = `more`;
            if ( row_raw.length > 3 ) { more_or_less = `less`; }
            let bad_table_msg = `Your Story Table should have ${ more_or_less } than`
              + ` ${ row_raw.length } columns. Take another look at Story Table documentation at`
              + ` https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/writing#story-table.`
            reports.addToReport( scope, { type: `error`, code: `ALK0120`, value: bad_table_msg})
            throw Error(bad_table_msg);
          }

          if (row_raw.length == 2) {
            var_data.push({var: row_raw[0], value: row_raw[1]});
          } else {
            var_data.push({var: row_raw[0], value: row_raw[1], trigger: row_raw[2]});
          }
        }  // ends for every row in table
      }  // ends if this table doesn't have headers

    }  // ends if we have access to the full raw data

    // Support tables with no 'trigger' column
    let supported_table = [];

    for ( let row of var_data ) {
      // See tests > unit_tests > tables.fixtures.js > tables.old_to_current_formatting
      let actual_var_value = row.value;
      if (is_secret_var(row)) {
        actual_var_value = process.env[ row.flags.secret_name ];
        if ( actual_var_value === undefined ) {
          let not_in_env_msg = `ALKiln could not find the GitHub secret "${ row.flags.secret_name }".`
            + ` Check for a typo and check your workflow file.`
            + ` Read more about using GitHub secrets in your workflow file at`
            + ` https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/writing#secrets.`
          reports.addToReport( scope, { type: `error`, code: `ALK0121`, value: not_in_env_msg });
          throw ReferenceError(not_in_env_msg);
        }
      }  // ends if is secret var

      let result = {
        // NOTE: mutating frozen objects will fail silently, so don't mutate this attribute
        original: Object.freeze(row),
        artificial: false,
        // Give fake data if needed to prevent some kind of hidden input field from being found
        // See bug at https://github.com/plocket/docassemble-cucumber/issues/79
        // May be able to remove this once converted to `getAllFields`
        var: row.var || `alkiln_no_var_name`,
        value: actual_var_value,
        trigger: row.trigger || ``,
        // This will track how many times total the row or its connected
        // artificial rows are used. Artificial rows are only added for some rows.
        times_used: 0,
        used_for: {},
      }
      result.used_for[ result.var ] = 0;

      supported_table.push( result );
    }  // ends for every row

    log.debug({
      code: `ALK0122`,
      type: `info`,
      pre: `scope.normalizedTable():\n ${JSON.stringify( supported_table )}`
    });

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
    let $trigger_elem = $( `#trigger` );
    if ( !$trigger_elem.length ) { $trigger_elem = $( `#sought_variable` ); }  // Backwards compatibility
    let encoded_trigger_var = $( $trigger_elem ).data( `variable` ) || ``;
    let trigger = fromBase64( encoded_trigger_var );

    let $proxies_node = $( `#alkiln_proxy_var_values` );
    let proxies = {};
    // If possible, get values of `x` and `i` that the dev put on the page
    if ( $proxies_node.length ) {
      // Empty strings are fine since that means that proxy is absent and won't come into play.
      proxies.x = fromBase64( $proxies_node.data( `generic_object` ) );
      for ( let index_var of `ijklmn`.split(``) ) {
        proxies[index_var] = fromBase64( $proxies_node.data( `index_var_${ index_var }` ) );
      }
    }

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

      // Often used for the variable name
      let not_decoded_name = $node.attr( `name` );

      // `<input type="hidden" name="_save_as" value="c2lnbmF0dXJlXzE">`
      // canvas elements are the only field on a signature page
      if ( $(`#dasigpage`).length > 0 && $(`#dasigpage`)[0].name ) {
        field_data.selector = `#daquestion canvas`;
        field_data.tag = `canvas`;

        // If da server's config value of `restrict input variables`
        // set to True, `_save_as` should work to get the var name
        if ( $( `input[name="_save_as"]` ).length > 0 ) {
          not_decoded_name = $( `input[name="_save_as"]` ).attr( `value` );

        // If not, the author will have to use the trigger var HTML element
        // or we can't get the var name being set for the signature
        } else if ( trigger !== `` ) {
          not_decoded_name = trigger;

        // If we have neither of those, we need to tell the user we can't
        // set this variable this way. We can't test this without a
        // server that has that special config value set to `True`
        } else {
          reports.addToReport(scope, {
            type: `error`,
            code: `ALK0123`,
            value: `You cannot sign a signature page this way because the `
              + `interview's HTML is missing data. Use the "I sign" Step `
              + `instead. You can also read documentation about `
              + `how to create the "trigger" HTML.`
          });
        }
      }
      
      // The selector we'll use to set the DOM node's value later
      if ( !field_data.selector ) {
        field_data.selector = await scope.getFieldSelector( scope, { $, node });
      }

      // Action buttons keep their var name in a unique place
      // TODO: add examples of the hrefs
      if ( $( node ).hasClass( 'daquestionactionbutton' )) {
        let href = node.attribs.href;
        let match = href.match( /action=([^&]*)/ );
        if ( match ) {
          not_decoded_name = match[1];
        } else {
          // Some action buttons just use urls instead of da actions
          // This means the first guess of the name should be the not_decoded_name
          // TODO: This only replaces the chars at the start of the string. Is that
          // intentional? Does this `.replace()` need the `g` flag?
          not_decoded_name = href.replace(/^[A-Za-z0-9]*/, '_');
        }
      }

      if ( !not_decoded_name ) {
        // Some fields, like comboboxes, have a weird var name setup
        not_decoded_name = $node.attr( `id` );
      }

      // ====================
      // Table rows
      // ====================
      // "None of the above" checkbox/object radio options don't contain their variable's name
      let is_none_of_the_above = false;
      if ( $node.hasClass('danota-checkbox') || $node.parents(`.da-field-container-datatype-object_radio`).name ) {
        is_none_of_the_above = true;
        let first_sib = $(node.parent).find( 'input' )[0];
        not_decoded_name = first_sib.attribs.name;
        // TODO: Do we need daaota as well? ("all of the above")
      }

      let var_names = await scope.getPossibleDecodedNames( scope, {
        not_decoded: not_decoded_name,
        field_like_names,
        is_none_of_the_above: is_none_of_the_above,
        proxies,
      });

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

    log.debug({
      code: `ALK0124`,
      type: `info`,
      pre: `page fields:\n${ JSON.stringify( fields )}`
    });
    return fields;
  },  // Ends scope.getAllFields()

  getPageJSON: async function ( scope ) {
    /* Get the JSON data of the current page. */
    return await scope.page.evaluate(async function ( elem ) {
      return await get_interview_variables();
    });
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
      reports.addToReport(scope, { type: `warning`, code: `ALK0125`, value: msg });
    }

    return selector;
  },  // Ends scope.getSelector()

  getPossibleTableRowMatchers: async function ( scope, { var_names, values }) {
    /* Return variable names and values combined in ways that can
    * try to match table rows. Tables can have two properties:
    * variable name and value. */
    log.debug({
      code: `ALK0126`,
      type: `info`,
      pre: `scope.getPossibleTableRowMatchers() var_names: ${JSON.stringify(var_names)} values: ${JSON.stringify(values)}`
    });
    let possible_table_rows = [];
    for ( let var_name of var_names ) {
      // Inputs like textareas don't have values
      if ( values.length > 0 ) {
        for ( let value of values ){
          possible_table_rows.push({ var: var_name, value: value, });
          // Ignore blanks, and values that certainly aren't base64 encoded like True and False
          // Modified from https://stackoverflow.com/a/8571649/11416267
          // DA doesn't use `==` to pad base 64
          // TODO: How are 'None', 'True', and 'False' being handled?
          if (value !== undefined && value !== null
              && value !== 'None' && value !== 'True' && value !== 'False'
              && value.match(da_base64_regex)) {
            let value_decoded = fromBase64(value);
            let values_decoded = scope.decodeFully( scope, { expr_str: value_decoded });
            for (let possible_val of values_decoded) {
              possible_table_rows.push({var: var_name, value: possible_val, });
            }
          }
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

    // TODO: Why are we docoding the field names here? We could decode them later, right?
    // In `getPossibleDecodedNames` we could do:
    // if ( field_like_original_names[ not_decoded ] ) {
    //   still_encoded = field_like_names[ not_decoded ];
    //   decode( still_encoded )
    // }

    let field_like_names = {};
    let field_like_names_encoded = $('input[name="_varnames"]')[0].attribs.value;
    let field_like_names_str = fromBase64( field_like_names_encoded );
    let field_like_names_json = JSON.parse( field_like_names_str );
    for ( let field_like_key in field_like_names_json ) {
      let field_like_DOM_name = fromBase64( field_like_key );
      // Even with `multiselect`, field names are only encoded once
      let field_like_var_name = fromBase64( field_like_names_json[ field_like_key ] );
      field_like_names[ field_like_DOM_name ] = field_like_var_name;
    }

    return field_like_names;
  },  // Ends scope.getFieldNamesDict()

  getPossibleDecodedNames: async function ( scope, {
    not_decoded,
    field_like_names={},
    is_none_of_the_above=false,
    proxies={}
  }) {
    /** Given a potentially base64 encoded string and a map of `_field_n` to var names, return
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
    *  @param not_decoded {str} - potentially base64 encoded string from the node
    *  @param field_like_names {obj} - e.g. `{ _field_0: 'some_checkbox_var_name' }`
    *  @param is_none_of_the_above {bool} - is the field a 'none of the above' field?
    *  @param proxies {obj} - e.g. `{ x: str, i: str, j: str, ... n: str }`. Empty strings
    *     are fine since that means that proxy is absent and won't come into play.
    */

    // E.g. continue buttons that don't set a variable
    if ( not_decoded === undefined ) { return []; }
    // Not sure it's necessary to have both with and without proxies here
    let guesses = scope.with_and_without_proxies( scope, {
      var_name: `${ not_decoded }`,
      proxies,
    });

    // Names can be encoded multiple times, so start peeling the layers
    let decoded_once = fromBase64( not_decoded );
    // If this is of the format `_field_n`, we need to get the actual matching var name
    if ( field_like_names[ decoded_once ] ) {
      decoded_once = field_like_names[ decoded_once ];
    }

    try {
      // We think this never has proxy vars
      let action_button_json = JSON.parse( decoded_once );
      if ( action_button_json.action ) { decoded_once = action_button_json.action }
    } catch ( error ) {
      // Things that are not action buttons can't be parsed this way.
      // A special error for action buttons requires passing the node in here too, which is a lot to pass in.
      // TODO: Should we move this back into `getAllFields()`?
    }

    // Include `not_decoded` since the name might not be encoded
    // TODO: Should we try to replace proxies in `not_decoded`. I can't
    // think of an occasion where that would be necessary.
    guesses = guesses.concat( scope.decodeFully( scope, {
        expr_str: decoded_once,
        field_like_names,
        is_none_of_the_above,
        proxies
      })
    );

    return guesses;
  },  // Ends scope.getPossibleDecodedNames()

  decodeFully: function ( scope, {
    expr_str,
    field_like_names = {},
    is_none_of_the_above=false,
    proxies={}
  }) {
    /**
    * Given a DA variable or value name, make sure it's fully decoded from base64.
    *  @param expr_str {str} - a python variable string, potentially partially base64 encoded
    *    Some examples:
    *    - my_variable
    *    - checkboxes_choices[B'Y2hlY2tib3hfb3RoZXJfb3B0XzI']
    *    - foo[bar][B'Y2hlY2tib3hfb3RoZXJfb3B0XzI']
    *  @param field_like_names {obj} - e.g. `{ _field_0: 'some_checkbox_var_name' }`
    *  @param is_none_of_the_above {bool} - is the field a 'none of the above' field?
    *  @param proxies {obj} - e.g. `{ x: str, i: str, j: str, ... n: str }`. Empty strings
    *     are fine since that means that proxy is absent and won't come into play.
    */
    // Some fields have a key hidden inside them.
    // This gets the variable name before the final brackets, and the likely
    // still base64 encoded string inside the brackets
    let before_and_in_brackets = expr_str.match( /^(.*)\[[BRO]'(.*)'\]/ );

    // Of the format `foo[B'encoded']` or `foo[R'encoded']`
    // The B means internal to docassemble, the encoded portion is a string,
    // and the R means that the python `repr` function was called with a
    // non-string object
    // See https://github.com/jhpyle/docassemble/blob/595ad0a08572c0188f9ab49b1a6af99a3621cd42/docassemble_base/docassemble/base/standardformatter.py#L2108

    // =====================
    // Ex: checkboxes_choices[B'Y2hlY2tib3hfb3RoZXJfb3B0XzI']
    // Ex: checkboxes_choices[R'Y2hlY2tib3hfb3RoZXJfb3B0XzI']
    let possible = [];
    if ( before_and_in_brackets ) {
      let key_or_name = before_and_in_brackets[1];
      // If this is of the format `_field_n`, we need to get the actual matching var name.
      let var_name = field_like_names[ key_or_name ] || key_or_name;

      let dictionary_key = before_and_in_brackets[2];

      // Our own marker for a 'none of the above' checkbox choice
      if ( is_none_of_the_above ) {
        // possible.push( `${ var_name }['None']` );
        possible = possible.concat( scope.with_and_without_proxies( scope, {
          var_name: `${ var_name }['None']`,
          proxies,
        }));
      } else {

        // TODO: Just use try/catches?

        if (dictionary_key.match(da_base64_regex)) {
          // Get the choice name. E.g. option_1, option_2
          let dictionary_key_decoded = fromBase64( dictionary_key );
          // possible.push( `${ var_name }['${ dictionary_key_decoded }']` );
          possible = possible.concat( scope.with_and_without_proxies( scope, {
            var_name: `${ var_name }['${ dictionary_key_decoded }']`,
            proxies,
          }));
          if (dictionary_key_decoded.match(da_base64_regex)) {
            try {
              // The part inside `[B|R|O'encoded']` could need one more decoding.
              // possible.push(`${ var_name }['${ fromBase64( dictionary_key_decoded ) }']`);
              possible = possible.concat( scope.with_and_without_proxies( scope, {
                var_name: `${ var_name }['${ fromBase64( dictionary_key_decoded ) }']`,
                proxies,
              }));
            } catch ( err ) {}  // It wasn't double encoded. Do nothing.
          }
        }
      }

    // =====================
    // If bracket regex didn't match, just use var name
    } else {
      possible = possible.concat( scope.with_and_without_proxies( scope, {
        var_name: `${ expr_str }`,
        proxies,
      }) );
    }
    return possible;
  },

  with_and_without_proxies: function ( scope, { var_name, proxies={} }) {
    /** Given a variable or value's possible name and a map of values for
     *    each proxy variable, return a list of either one or two strings.
     *    It always includes the given variable name. If proxies were found
     *    and replaced, the list also includes a version of the variable
     *    name in which the proxies have been replaced by their values.
     *
     * Proxies are generic objects (x) or index variables (i, j, k, l, m, n).
     *
     * @param { string } var_name - The possible name of a variable or value
     * @param { Object } proxies - A map of proxy variables to their values on
     *    the HTML page, if they're there.
     *
     * @returns {Array<string>} - An array of at least one string - var_name
     *    itself. Possibly a second value where proxy variables in var_name
     *    are replaced with their values (if the proxy variables are present
     *    and if their values are passed in).
     * */
    // We could combine these regexes, but this may be easier to read
    let generic_obj_regex = /^(x)\b/;
    let index_var_regex = /(?<=\[)([ijklmn])(?=\])/g;
    // If proxies exist in the HTML, replace any proxies in the variables
    // with those values.
    let new_name = var_name;
    if ( proxies.x !== '' && proxies.x !== undefined ) {
      new_name = new_name.replace( generic_obj_regex, proxies.x );
    }
    new_name = new_name.replace( index_var_regex, function(match) {
      if ( proxies[ match ] === '' || proxies[ match ] === undefined ) {
        return match;
      } else {
        return proxies[ match ];
      }
    });

    // The older versions of Story Table need to see "x", "i", etc.,
    // so keep that old name around.
    let unique_names = [ var_name ];
    // If there were proxies, add the new version of the name
    if ( new_name !== var_name ) { unique_names.push( new_name ); }

    return unique_names;
  },  // Ends scope.with_and_without_proxies()

  getOptionValues: async function ( scope, { $select }) {
    /* Returns all the option node values of the select node. */
    let options = [];
    let option_nodes = $select.find( `option` );
    for ( let opt of option_nodes ) {
      // Some options don't have a value, like for ajax comboboxes
      if ( opt.attribs.value !== undefined ) {
        options.push( opt.attribs.value );
      }
      // Dropdowns created w/ objects are base64 encoded; but it's handled in getPossibleTableRowMatchers
    }
    return options;
  },  // Ends scope.getOptionValues()


  // TODO: Maybe add `from_story_table` to the var data table (array...)
  getMatchingRows: async function ( scope, { field, var_data }) {
    /** Given var_data, a list of objects with variable data for
    * setting fields, and an object for a DOM field, returns list of the
    * rows that match the DOM field. That list of story table rows may be empty.
    *
    * Using a `trigger` column is deprecated, but still used in many tests in the wild.
    * For notes on trigger var, see https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/#trigger
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

          // TODO: can we just use `uses_proxies` in here?
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
        let page_trigger_warning = `You are using a 3-column Story Table. If possible, you should `
          + `think about switching to the newer, easier, 2-column Story Table. That will probably `
          + `get rid of this warning. Read more at `
          + `https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/trouble#deprecated-story-tables. `
          + `If you still want to use this 3-column format, here is more info about the warning: `
          + `A field on this page uses an index variable or a generic object in a 3-column `
          + `Story Table, but the page is missing the ALKiln "trigger" variable's name. See `
          + `https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/#a-missing-trigger-variable.`;
        reports.addToReport(scope, { type: `warning`, code: `ALK0127`, value: page_trigger_warning });
      }

      for ( let row_that_matches_this_field of rows_that_match_field_names ) {

        let table_row_trigger_name = row_that_matches_this_field.trigger;

        if ( !table_row_trigger_name ) {
          // var/row trigger name is (probably) needed but is missing. Caveat: If there's
          // only one page in the proxy var loop and there's only one row (like the "I set the var"
          // Step), trigger name is not needed, but I'm not sure how we figure out all those
          // things here and log a useful message.

          // First, make the row data more readable to humans.
          let row_as_story_table = reports.convertToOriginalStoryTableRow( scope, { row_data: row_that_matches_this_field });
          let row_trigger_warning = `This 3-column Story Table row needs a value in the "trigger" `
            + `column, but it is empty. The test might get unexpected results. See `
            + `https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/#trigger.`
            + `\nThe rows:\n${ row_as_story_table }`;
          reports.addToReport(scope, { type: `warning`, code: `ALK0128`, value: row_trigger_warning });

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
      // Missing trigger names don't count as conflicting. [Did this mean missing in the table or in the page?]
      if ( final_matching_rows.length === 0 ) {

        // First, make the row data more readable to humans.
        let conflicts_as_story_table_rows = [];
        for ( let row of rows_with_conflicting_trigger_names ) {
          let table_str = reports.convertToOriginalStoryTableRow( scope, { row_data: row });
          conflicts_as_story_table_rows.push( table_str );
        }

        let all_trigger_names_conflict_msg = `${ rows_that_match_field_names.length } `
          + `Story Table row(s) matched a field name, but didn't match a trigger `
          + `variable. This 3-column Story Table might be missing a row or a trigger variable. `
          + `The test will have to ignore this field. See `
          + `https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/#trigger.`
          + `\nThe row(s) data:\n${ conflicts_as_story_table_rows.join( `\n` )}`
          + `\nThis field's data:\n${ JSON.stringify( field )}`;
        reports.addToReport(scope, {
          type: `warning`,
          code: `ALK0129`,
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
        let table_str = reports.convertToOriginalStoryTableRow( scope, { row_data: row });
        rows_as_story_table.push( table_str );
      }

      let multiple_matches_msg = `Do you have a duplicate story table row? `
        + `Multiple story table rows match this field's variable name. `
        + `The test will use the last row that matched.`

      if ( trigger_might_be_needed ) {
        multiple_matches_msg += ` See https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/#trigger.`
      }
      multiple_matches_msg += `\nThe matching rows:\n${ rows_as_story_table.join(`\n`) }`
        + `\nThis field's data:\n${ JSON.stringify( field )}`;
      reports.addToReport(scope, { type: `warning`, code: `ALK0130`, value: multiple_matches_msg });
    }

    log.debug({
      code: `ALK0131`,
      type: `info`,
      pre: `final_matching_rows:\n${JSON.stringify( final_matching_rows )}`
    });
    if ( final_matching_rows.length == 0) {
      log.debug({
        code: `ALK0132`,
        type: `info`,
        pre: `field:\n${JSON.stringify( field )}`
      });
    }

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

    let handle = await scope.get_handle_from_field( scope, { field: field });
    // TODO: expect elem to exist

    // After each previous input, figure out if this input is (now/still) disabled
    // TODO: Consider testing for disabled this before we get the matching row
    let disabled = await handle.evaluate(( elem )=> {
      // da's header covers the top of the section containing the fields which means
      // sometimes it blocks nodes from clicks. Scroll item to the bottom instead.
      // Note: I'm not sure how we'd get in here if `elem` didn't exist, but
      // I once got an error here that I couldn't read `.disabled` of `null`.
      if ( elem && !elem.disabled ) {
        elem.scrollIntoView(false);
        return elem.disabled;
      } else {
        return false;
      }
    });

    // If field is disabled, don't set it yet
    if ( disabled ) { return row_used; }

    if ( session_vars.get_debug() ) {
      let name = await handle.evaluate(( elem ) => {  // Not using this right now
        try { elem.nextSibling.style.background = 'Khaki'; }
        catch(err){ elem.style.background = 'Khaki'; }
        return elem.getAttribute('for') || elem.getAttribute('name'); 
      });
      await time.waitForTimeout( 400 );
    }

    // We use the last match. We wrote a warning for the user if there were
    // multiple matches in the story that the last value will be used. In future,
    // Steps will be able to set this data gradually and we don't want the developer
    // to get confused thinking that an earlier Step was used instead of a later one.
    let row = matching_input_rows[ matching_input_rows.length - 1 ];
    let answer = row.value;

    // Will implement `was_used` in cases as they come along. For now, this is
    // necessary for file uploads to be as flexible as any other Story Table row.
    let was_used = await scope.funnel_the_answer( scope, { handle, answer, field });
    if ( was_used === false ) { row = null; }

    return row;
  },  // Ends scope.setVariable()

  get_handle_from_field: async function ( scope, { field }) {
    /** Get the element's puppeteer handle using the field's selector. */
    log.debug({
      code: `ALK0133`,
      type: `info`,
      pre: `scope.get_handle_from_field() field.selector: ${JSON.stringify(field.selector)}`
    });
    let handle = await scope.page.evaluateHandle(( selector ) => {
      let elem = document.querySelector( selector );
      // If the element has a sibling that's a label, we need to
      // interact with that label instead.
      if ( elem && elem.nextSibling && elem.nextSibling.tag === `label` ) {
        return elem.nextSibling;
      } else { return elem; }
    // Pass in the selector as an argument
    }, field.selector );

    return handle;
  },  // Ends scope.get_handle_from_field()

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
      if (elem) {
        let group = elem.closest( `.da-form-group` );
        if ( group && group.className ) {
          matches = ` ${ group.className } `.match(/da-field-container-datatype-([^ ]+) /);
        }
        if ( matches ) {
          custom_datatype = matches[1];
        }
      }
      return custom_datatype;
    });

    return custom_datatype;
  },  // Ends scope.is_custom_datatype()
  
  funnel_the_answer: async function( scope, { handle, field, answer }) {
    /** Use the tag or custom datatype to funnel the answer to the right
    *    field. Pages without a handle should pass in `null` for the
    *    handle.
    */

    let custom_datatype = null;
    // Pages with elements like `canvas` for signatures won't have a handle
    // to pass in. They should pass in `null` for the handle and shouldn't
    // need a handle in order to function.
    if ( handle !== null ) {
      // Get the element of that custom type if it exists
      custom_datatype = await scope.get_custom_datatype( scope, { handle });  
    }

    let row_was_used = true;
    // If there is a custom datatype function available, use it to set the field
    if ( scope.setCustomDatatype[ custom_datatype ] !== undefined ) {
      // Set da package custom fields. TODO: find `custom_handle` in the setter?
      let custom_handle = await handle.evaluateHandle(( elem )=> { return elem.closest( `.da-form-group` ) });
      row_was_used = await scope.setCustomDatatype[ custom_datatype ]( scope, { handle: custom_handle, answer });
    } else {
      // If no custom datatype, set a regular field

      // Skip hidden fields. When a `show if` date field is above a combobox,
      // interacting with the hidden field causes the date field to open its
      // calendar which blocks input to the combobox
      if ( field.type === `hidden` ) {
        row_was_used = false;
      } else {
        row_was_used = await scope.enter_answer[ field.tag ]( scope, { handle, answer });
      }
    }  // ends if custom datatype

    return row_was_used;
  },  // Ends scope.funnel_the_answer()

  // Handle setting values for da custom datatypes. E.g. `da-field-container-datatype-BirthDate`
  // TODO: Make this more easily extensible.
  // TODO: Just put this in `scope.enter_answer`? Find the custom handle in the setter itself.
  setCustomDatatype: {
    al_date: async function ( scope, { handle, answer, is_past }) {
      /* Given a date of the format 'mm/dd/yyyy' and the handle of the
      * custom field container, sets an AssemblyLine three-part date's
      * field values. */

      // If it doesn't have the right format
      if ( answer === null || !answer.includes(`/`) ) {
        // Return field unused.
        reports.addToReport( scope, {
          type: `warning`,
          code: `ALK0134`,
          value: `Invalid date. Value given: "${ answer }".`
        });
        return false;
      }

      let date_parts = answer.split(`/`);
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
            answer: date_parts[ field_i ]
          });
          await handle.press(`Tab`);
        }

      }  // For each field

      await scope.afterStep( scope );
      return true;
    },  // Ends scope.setCustomDatatype.al_date()

    BirthDate: async function ( scope, { handle, answer }) {
      /** Given a date of the format 'mm/dd/yyyy' and the handle of the
      * custom field container, sets the ALToolbox custom birthdate
      * field values. */
      answer = await scope.today_to_date(scope, { date: answer });
      await scope.setCustomDatatype.al_date( scope, { handle, answer })
    },  // Ends scope.setCustomDatatype.BirthDate()

    ThreePartsDate: async function ( scope, { handle, answer }) {
      /** Given a date of the format 'mm/dd/yyyy' and the handle of the
      * custom field container, sets the ALToolbox custom ThreePartsDate
      * field values. */
      answer = await scope.today_to_date(scope, { date: answer });
      await scope.setCustomDatatype.al_date( scope, { handle, answer })
    },  // Ends scope.setCustomDatatype.ThreePartsDate()

  },  // ends setCustomDatatype {}

  enter_answer: {
    button: async function ( scope, { handle, answer }) {
      await scope.tapElementAndNavigate( scope, { elem: handle });
      return true;
    },
    textarea: async function ( scope, { handle, answer }) {
      await scope.setText( scope, { handle, answer });
      await scope.afterStep(scope);  // No showifs for this one?
      return true;
    },
    select: async function ( scope, { handle, answer }) {
      // Note: I don't remember what's really going on in here.

      // A dropdown's option value can be one of two things
      // Try to find the element using the first value

      // TODO: Can we somehow pass in a `answer` that is encoded correctly since
      // we're getting the fields from the DOM to begin with? We'll probably
      // need another prop because we need the `option` human value to
      // match the story table

      // TODO: Change this to search in the actual handle instead of just $
      // There could be multiple fields on the page with the same option
      // values.
      // let option = await handle.$(`option[value="${ answer }"]`);
      let option = await scope.page.$(`option[value="${ answer }"]`);
      if ( option ) {
        await handle.select( answer );  // And use that value to set it

      // If that literal value isn't on the page, it should be a base64 encoded value
      // TODO: Can these be double encoded? Can they be encoded like objects?
      } else {
        let base64_name = toBase64( answer );
        await handle.select( base64_name );
      }
      
      await scope.afterStep(scope, { waitForShowIf: true });
      return true;
    },
    canvas: async function ( scope, { handle, answer }) {
      await scope.draw_signature( scope );
      await scope.afterStep( scope );
      return true;
    },
    input: async function ( scope, { handle, answer }) {
      /* Set value of some `input` element to the given value. */
      let row_was_used = true;

      let type = await handle.evaluate( elem => { 
        if (elem) {
          return elem.getAttribute('type'); 
        } else {
          return 'text';
        }
      });
      if ( type === `radio` || type === `checkbox` ) {

        let [label] = await handle.$$(`xpath/.//following-sibling::label`);
        
        if ( session_vars.get_debug() ) {
          if ( answer.toLowerCase() === 'false' ) { await label.evaluate( elem => { elem.style.background = 'tomato'; }); }
          else { await label.evaluate( elem => { elem.style.background = 'teal'; }); }
          let name = await label.evaluate( elem => { return elem.getAttribute('for'); });
        }

        if ( type === `radio` ) {
          await label.evaluate( elem => { return elem.click(); });
        } else {
          await scope.setCheckbox( scope, { label, answer });
        }

        await scope.afterStep(scope, { waitForShowIf: true });
        
      } else if ( type === `file` ) {
        row_was_used = await scope.uploadFiles( scope, { handle, answer });
        await scope.afterStep(scope, { waitForShowIf: true });

      } else if (type == `date`) {
        let answer_date = await scope.today_to_date(scope, { date: answer });
        await scope.setText( scope, { handle, answer: answer_date });
        await handle.press(`Tab`);
        await scope.afterStep(scope, { waitForShowIf: true });
        
      } else if (type == `time`) {
        // Authors should enter the time like 12:34 PM, but we shouldn't type ":", space, or M.
        let answer_time = answer.replace(":", "").replace(" ", "").replace("M", "");
        await handle.focus();
        let delay = 0;
        if ( session_vars.get_debug() ) { delay = 25; }
        await handle.type( answer, { delay });
        await handle.press(`Enter`);
        await scope.afterStep(scope, { waitForShowIf: true });
      } else {
        await scope.setText( scope, { handle, answer });
        await handle.press(`Tab`);
        await scope.afterStep(scope, { waitForShowIf: true });
      }

      return row_was_used;
    },  // Ends scope.enter_answer.input()
    hidden: async function ( scope, { handle, answer }) {
      // Do nothing. The only way the code should get here is if
      // this wasn't a custom datatype we can handle.
      // If we were to write a message, I don't know what we can
      // write - this may be a different custom datatype or this
      // could be a special da field that we shouldn't worry the
      // dev about at all.
      return;
    },

  },  // ends scope.enter_answer()

  today_to_date: async function ( scope, { date }) {
    /** Return `date` or, if the date is specified in the format
    *   "today" or "today + 2" or "today-1", return a date of the format
    *   "mm/dd/yyyy".
    * 
    * @param scope { obj } REQUIRED. Object with test state.
    * @param date { str } REQUIRED. Input from the developer.
    * 
    * @returns { str } `date` or "today" math as date str
    * 
    * WARNING: If the developer is counting on date boundaries to trigger
    *   other logic then timezone differences may interfere with that. They
    *   should:
    * 
    *   1. Test with a day well within the date range they're testing instead
    *   of near a boundary. For example, test 8 days from now instead of 10.
    *   This is because their test may run around 12am and thus be vulnerable
    *   to failure.
    *   2. Warn the user explicitly and let them know when they need to file by
    *   in case the user doesn't know and files a few days from the day they filled
    *   out the form.
    */
    let valid_date = date;
    if (date.indexOf(`today`) !== -1) {
      // Find out how many days to add/subtract
      let date_delta = date.replace(/\s/g, '');
      date_delta = date_delta.match(/today([+-]\d+)?/)[1];
      date_delta = date_delta == undefined ? 0 : date_delta;
      date_delta = parseInt(date_delta);
      // Get today's date
      valid_date = new Date(); 
      // Add/subtract required number of days
      valid_date.setDate(valid_date.getDate() + date_delta);
      // Convert to the docassemble date field format: mm/dd/yyyy
      // Reference: https://gomakethings.com/setting-a-date-input-to-todays-date-with-vanilla-js/
      valid_date = ((valid_date.getMonth() + 1).toString().padStart(2, 0) + '/' + 
                     valid_date.getDate().toString().padStart(2, 0) + '/' +
                     valid_date.getFullYear().toString());
    }
    return valid_date;
  },  // Ends scope.today_to_date()

  findFiles: async function( scope, {to_find_names}) {
    /** Returns a list of paths to the sources folder associated
    *    with the given list of file names.
    * 
    * @param to_find_names { [str] } List of file names
    * 
    * @returns { [str] } sources folder paths
    */
    // First make sure the list of files was defined. Don't remove spaces yet -
    // allow a typo where someone forgot to include a space after a comma.
    // TODO: wish we had the var name here that folks are trying to set
    if ( to_find_names.length === 0 ) {
      reports.addToReport( scope, {
        type: `warning`,
        code: `ALK0135`,
        value: `Your Step is missing the names of which file(s) to use.`
      });
      return [];
    }

    let sources_dirs = session_vars.get_sources_paths();
    // Get the full paths of all the existing files
    let paths = [];
    let missing_files = [];  // For any user warnings
    for ( let name of to_find_names ) {

      let trimmed_name = name.trim();
      let matching_paths = [];
      // Look for the file in all "sources" folders
      for ( let one_dir of sources_dirs ) {
        let new_paths = fg.sync(
          [ `${ one_dir }/${ trimmed_name }` ],
          { suppressErrors: true }
        );
        matching_paths.push( ...new_paths );
      }

      if ( matching_paths.length === 0 ) {
        missing_files.push( trimmed_name );
      } else {
        paths.push( ...matching_paths );
      }
    }  // ends for each file

    if ( missing_files.length > 0 ) {
      reports.addToReport( scope, {
        type: `warning`,
        code: `ALK0136`,
        value: `ALKiln could not find "${ missing_files.join('", "') }" in the folder(s) at "${ sources_dirs.join('", "') }".`
      });
    }

    // If all files missing, return an empty array
    if ( missing_files.length === to_find_names.length ) {
      return [];
    }
    return paths;
  },  // Ends scope.findFiles()

  uploadFiles: async function ( scope, { handle, answer }) {
    /* Try to upload one or more files to a file-type input field.
    *    Does not submit, so no danger of timeout with server reload.
    * 
    * Returns whether the row was used or not.
    */

    // First make sure the list of files was defined. Don't remove spaces yet -
    // allow a typo where someone forgot to include a space after a comma.
    let to_find_names = answer.split(`,`);
    let paths = await scope.findFiles(scope, {to_find_names});
    if (paths.length == 0) {
      // The row wasn't used
      return false;
    }

    // Prepare to wait for upload to complete
    let name = await handle.evaluate( elem => { return elem.getAttribute(`name`); });
    let selector = `*[name="${ name }"]`
    let disabled_selector = `${ selector }[disabled]`;
    let enabled_selector = `${ selector }:not([disabled])`;

    // This comes before the upload starts.
    // Notice `await` is absent. Don't actually wait here yet.
    // Start looking for it before it exists or we might miss it.
    let wait_for_disable = scope.page.waitForSelector( disabled_selector );
    
    // Upload
    await handle.uploadFile(...paths);

    // Halt progress to wait for the input to be disabled. If it already is, then this
    // will have resolved already and will keep going.
    await wait_for_disable;
    // When it's again enabled, the files have finished loading. Or so I have observed.
    await scope.page.waitForSelector( enabled_selector );

    // Return that the row was used
    return true;
  },  // Ends scope.uploadFiles()

  setCheckbox: async function ( scope, { label, answer }) {
    // Depending on the current value/status of a checkbox and the desired
    // value to set, either taps the checkbox or leaves it alone.
    let status = await label.evaluate( elem => { return elem.getAttribute('aria-checked'); });
    if ( answer.toLowerCase() !== status ) {
      await label.evaluate( elem => { return elem.click(); });
    }
  },  // Ends scope.setCheckbox()

  setText: async function ( scope, { handle, answer }) {
    /** Set text in some kind of field (input text, input date, textarea, etc.) */
    const typing_cutoff = 300;
    const slice_value = -3;

    // Deleting preexisting text here is slower, but more clear and maintainable
    await handle.evaluate(( elem ) => { elem.value = ``; });

    let is_ajax = await handle.evaluate(( elem, text, typing_cutoff, slice_value ) => {
      // For long strings or ajax comboboxes, set the value of the field to
      // most of the text. This will be faster in those cases.
      is_ajax = elem.className.includes(`da-ajax-combobox`);

      if ( is_ajax || text.length > typing_cutoff ) {
        elem.value = text.slice(0, slice_value);  // .slice(0, -3)
      }

      return is_ajax;
    }, answer, typing_cutoff, slice_value );

    // Interact like a "human" in all cases.
    await handle.focus();

    // For long strings or ajax comboboxes, where we have set most of the text
    // already, add a good pause for the field to detect the interaction.
    if ( is_ajax || answer.length > typing_cutoff ) {
      const to_type = answer.slice( slice_value );  // .slice(-3)
      await handle.type( to_type, { delay: 100 });
    } else {
      // Otherwise type the whole string with 0 delay
      await handle.type( answer );
    }
  },

  draw_signature: async function ( scope, name ) {
    /* On a signature page, there should only be a single signature canvas
    * and a continue button. Draw in the #dasigcanvas element. `<canvas>`
    * takes a while to load. */
    let canvas = await scope.page.waitForSelector( `#dasigcanvas` );
    let msg = `Could not find a signature field.`;
    if ( !canvas ) { reports.addToReport(scope, { type: `error`, code: `ALK0137`, value: msg }); }
    expect( canvas, msg ).to.exist;

    // Provides functionality to draw name arg on canvas
    if (name !== undefined) {
      await scope.page.$eval(`#dasigcanvas`, (canvas, name) => {
        const ctx = canvas.getContext("2d");
        ctx.font = "24px serif";
        ctx.fillText(name, 10, 50);
      }, name);
    }
    let bounding_box = await canvas.boundingBox();
    // We draw the dot because it allows the developer to tap continue
    // Docassemble does not allow to tap continue unless the user interacts with the canvas
    await scope.page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
    await scope.page.mouse.down();
    // await scope.page.mouse.move(1, 1);  // Too big? Wait a while before drawing?
    await scope.page.mouse.up();
  },

  examinePageID: async function ( scope, question_id = '' ) {
    /* Looks for a sanitized version of the question id as it's written
    *     in the .yml. docassemble's way in python:
    *     re.sub(r'[^A-Za-z0-9]+', '-', interview_status.question.id.lower())
    * 
    * @returns { question_has_id: bool, id: str, id_matches: bool }
    */
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
    log.debug({ type: `plain`, pre: `~~~~~~~~~~~~~~ scope.setFields() ~~~~~~~~~~~~~~` });

    // Only record the page id once for each page to which we navigate
    let { id } = await scope.examinePageID( scope, 'none to match' );
    if ( scope.page_id !== id ) {
      reports.addToReport(scope, { type: `page_id info`, code: `ALK0138`, value: `${ id }`, });
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
          reports.addToReport(scope, {
            type: `row info`,
            code: `ALK0139`,
            value: `${ reports.convertToOriginalStoryTableRow(scope, { row_data: row_used }) }`
          });

          // Accumulate number of times this row was used. Esp important for `.target_number`
          await scope.increment_row_use( scope, { row: row_used });

          process.stdout.write(`\x1b[36m${ '*' }\x1b[0m`);  // assumes var was set if no error occurred

        }
      }  // ends for every non-submit-button field on the page
    }  // ends while fields are still being set

    if ( session_vars.get_debug() ) { await time.waitForTimeout(2000); }

    // Press a continue button with a story table variable name if it exists
    let did_navigate = false;
    let error = {};
    for ( let field of fields ) {
      // All other fields should have been set
      if ( field.tag === 'button' && field.type === 'submit' ) {
        let page_url = await scope.page.url();

        let row_used = await scope.setVariable( scope, { field, var_data, });
        if ( row_used ) {

          reports.addToReport(scope, {
            type: `row info`,
            code: `ALK0140`,
            value: `${ reports.convertToOriginalStoryTableRow(scope, { row_data: row_used }) }`
          });

          // Esp important for `.target_number`
          await scope.increment_row_use( scope, { row: row_used });

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
      for ( let row of var_data ) {
        if ( row.times_used === 0 ) {
          let values_used_status = 'The page is missing a value';
          let source_row = row;
          // TODO: Make the row object flatter so we don't need to dig in this way
          if ( row.source ) { source_row = row.source; }
          let original_row = source_row.original;
          let { id } = await scope.examinePageID( scope, 'none to match' );
          let msg = `In a linear Step all the values you give MUST be filled in, but ALKiln was unable `
            + `to find a field on the page "${id}" for the variable "${ original_row.var }" that `
            + `could be set to "${ original_row.value }". See this Scenario's HTML file for details.`;
          reports.addToReport(scope, { type: `error`, code: `ALK0141`, value: msg });
          expect( values_used_status, msg ).to.equal( '' );
        }
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

  increment_row_use: async function ( scope, { row }) {
    /** Accumulate number of times this row was used. Esp important for `.target_number`.
    *   Mutates `row` and its props. */

    // Increment the number of times a row itself was used.
    row.times_used += 1;

    // Increment the times a row was used for a particular variable.
    // TODO: check if we need this initial default assignment.
    if ( !row.used_for ) { row.used_for = {}; }
    // TODO: check if we need this initial default assignment.
    if ( row.used_for[ row.var ] ) {
      row.used_for[ row.var ] += 1;
    } else {
      row.used_for[ row.var ] = 1;
    }

    // If this is an artificial row, increment its source row as well. This may
    // be one of multiple artificial rows and the source row will need to be
    // incremented for each of its artificial rows.
    // Right now, this is only used for `target_number` rows.
    if ( row.source ) {
      // For each artificial row, increment the total number of times its
      // source row was used.
      row.source.times_used += 1;

      // Indicate which of the artificial rows was incremented (this one).
      // TODO: check if we need this initial default assignment.
      if ( row.source.used_for[ row.var ] ) {
        row.source.used_for[ row.var ] += 1;
      } else {
        row.source.used_for[ row.var ] = 1;
      }
    }  // ends if there's a source row
    
  },  // Ends scope.increment_row_use()


  ensureSpecialRows: async function ( scope, { var_data, from_story_table=true }) {
    /* Given a list of variable data objects, add more objects or mutate
    *    row objects under special circumstances:
    * - `.target_number` will create `.there_are_any` and `.there_is_another` rows.
    *    If they're unused in the end, that's fine.
    * - `.there_is_another` with a value of True in a Story Table is invalid and
    *    will be neutralized.
    * 
    * To learn the bigger picture, see "docs/story_tables.md"
    */
    let enhanced_var_data = [...var_data];
    for ( let var_datum of var_data ) {

      if ( from_story_table && var_datum.var.match( /\.target_number$/ )) {

        // This is a row created by us, not by the user
        let artificial = true;

        // Add `.there_are_any` value depending on `.target_number` value.
        // If the dev has also created a `.there_are_any` row, that will come
        // first in the table and will be overriden by this later artificial row.
        // TODO: Document this for devs as this behavior might confuse folks
        // who accidentally include both and have conflicting values
        // for each of them.
        let var_name_any = var_datum.var.replace( /\.target_number$/, `.there_are_any` );

        let there_are_any = {
          artificial,
          // For now this is very nested. We may flatten in the future.
          ...var_datum,
          // `source` is acting as the accumulator of the row use here
          source: var_datum,
          var: var_name_any,
          // devs are supposed to use the right `trigger` name, but they might not.
          // Of course, this too might be the wrong trigger name, but there's no way to
          // know that and it's unlikely.
          // TODO: Make sure this is documented.
          trigger: var_datum.trigger.replace( /\.target_number$/, `.there_are_any` ),
          used_for: {},
        };
        there_are_any.used_for[ var_name_any ] = 0;

        // This creation function is run at the beginning of every page.
        // If this is the first page and the `target_number` source row
        // has just been created, it won't have this sub-accumulator yet,
        // so create them. Otherwise, don't override its current value.
        if ( var_datum.used_for[ var_name_any ] === undefined ) {
          var_datum.used_for[ var_name_any ] = 0;
        }

        // If `target_number` is 0, there are none of this item
        if ( parseInt(var_datum.value) <= 0 ) {
          there_are_any.value = `False`;
        // Otherwise, there's at least one item
        } else if ( parseInt(var_datum.value) > 0 ) {
          there_are_any.value = `True`;
        }

        // Now both `.target_number` and `.there_are_any` rows exist if needed
        enhanced_var_data.push( there_are_any );

        // Add `.there_is_another` value depending on `.target_number` value.
        // If the dev has also created a `.there_is_another` row, that will come
        // first in the table and will be overriden by this later artificial row.
        // The dev will still get a warning at the start of each page that they've
        // included an invalid `.there_is_another` with a value of `True`.
        // This row might not be needed if `.target_number` is 0, but for now that
        // seems like it would add more logic to read.
        let var_name_another = var_datum.var.replace( /\.target_number$/, `.there_is_another` );

        let there_is_another = {
          artificial,  
          ...var_datum,
          // `source` is acting as the accumulator of the row use here
          source: var_datum,
          var: var_name_another,
          // devs are supposed to use the right `trigger` name, but they might not.
          // Of course, this too might be the wrong trigger name, but there's no way to
          // know that and it's unlikely.
          trigger: var_datum.trigger.replace( /\.target_number$/, `.there_is_another` ),
          used_for: {},
        };
        there_are_any.used_for[ var_name_another ] = 0;

        // This creation function is run at the beginning of every
        // page. If this is the first page and the `target_number`
        // source row has just been created, it won't have these
        // sub-accumulators yet, so create them.
        // Otherwise, don't override their current values.
        if ( var_datum.used_for[ var_name_another ] === undefined ) {
          var_datum.used_for[ var_name_another ] = 0;
        }

        // Use those accumulators to get `True` or `False` for `there_is_another`
        there_is_another.value = await scope.getThereIsAnotherValue(
          scope,
          { row: there_is_another, from_story_table }
        );

        // Now both `.target_number` and `.there_is_another` rows exist if needed
        enhanced_var_data.push( there_is_another );

      // Neutralize a `.there_is_another` row in a story table
      } else if ( from_story_table && var_datum.var.match( /\.there_is_another$/ ) && var_datum.value !== `False`) {
        var_datum.invalid = true;
        // Removing the row will just cause a different error that will take longer to fail and
        // probably add a confusing message to the report, so mutating seems, sadly, more useful.
        var_datum.value = `False`;  // The original value is still preserved
        // Warn the developer not to use `.there_is_another`.
        reports.addToReport( scope, {
          type: `warning`,
          code: `ALK0142`,
          value: 'The attribute `.there_is_another` is invalid in story table tests. Replace it with '
            + '`.target_number` in your `var` and `trigger` columns. Set the `value` to the number of items in '
            + `that list. This test will now set this row's \`value\` to \`False\`. See `
            + `https://suffolklitlab.github.io/docassemble-AssemblyLine-documentation/docs/alkiln/writing/#there_is_another. `
            + `The row data is\n${ JSON.stringify( var_datum.original )}` });
      }  // ends if it's a `target_number` row
    }  // ends for each row

    return enhanced_var_data;
  },  // Ends scope.ensureSpecialRows()

  getThereIsAnotherValue: async function ( scope, { row, from_story_table=true }) {
    /* Given story row-like data as well as whether this is from a table row,
    * return the best guess as to a safe value to set for this round. Give
    * the developer a warning if it's an inappropriate value. Avoid mutation.
    * 
    * Right now this argument should always be a `.target_number` number row from
    *    Story Tables.
    * 
    * To learn the bigger picture, see the docs folder for info about Story Tables.
    */
    let value = row.source.value.toLowerCase();
    let val_to_print = printable_var_value(row); 
    let desired_num = parseInt( value );
    
    // Step stuff. Take into account a lot of possible values
    if ( value.match( /(false|no|unchecked|uncheck|deselected|deselect)/i )) {
      // Should this also contain a warning if this is trying to set `target_number`?
      return `False`;

    } else if ( value.match( /(true|yes|checked|check|selected|select)/i )) {
      if ( from_story_table && !row.artificial ) {
        if ( row.var.match( /\.there_is_another$/ ) ) {
          reports.addToReport( scope, { type: `warning`, code: `ALK0143`, value: `The attribute \`.there_is_another\` is invalid in story table tests. Replace it with \`.target_number\` in your \`var\` column. Set the \`value\` to the number of items in that list. This test will now set this row's \`value\` to \`False\`. See https://suffolklitlab.github.io/docassemble-AssemblyLine-documentation/docs/alkiln/writing/#there_is_another. The row data is\n${ JSON.stringify( row.original )}` });
        } else {
          // If `target_number` is set to True instead of a number
          reports.addToReport( scope, { type: `warning`, code: `ALK0144`, value: `${ val_to_print } value is not a valid value for ${ row.var } here. This test will default to \`False\` to avoid problems.` });
        }
        return `False`;
      } else { return `True`; }
    
    } else if ( isNaN( desired_num )) {  // Story table loop will end
      // I can't figure out how to trigger this warning, so maybe we're
      // already handling everything we need to
      reports.addToReport( scope, { type: `warning`, code: `ALK0145`, value: `${ val_to_print } value is not a valid value for ${ row.var } here. This test will default to \`False\` to avoid problems.` });
      return `False`;

	    // Check that the number of elements in the list hits our desired number.
      // The first time `.there_is_another` is used, it's always the second item
      // the form is asking about (and so forth), so we have to add 1 to this check.

      // Example behavior:
      // For 3 items, press 'yes' on there_is_another 2 times because
      // `.there_are_any` handles the first time.
      // target_number: 3 
      // used_for[ <var_name>.target_number ]: 0 -> `True`, 1 -> `True`, 2 -> `False`
	    } else if ( row.source && row.source.used_for[ row.var ] + 1 >= desired_num) {  // Story table loop will end
      return `False`;
    } else {
      return `True`;
    }  // ends act depending values
  },  // Ends scope.getThereIsAnotherValue()

  is_on_server_still: async function ( scope ) {
    let server_url = session_vars.get_da_server_url();
    return await scope.page.url().startsWith(server_url);
  },

  // throw_if_no_interview_content()?
  has_interview_content: async function ( scope ) {
    /** Return false if there's no element indicating a da interview question,
    *    like a signature page, other fields, or interview text. Assumes that page has already
    *    finished navigating. */
    let elem_da_question = await scope.page.$( `#daMainQuestion` );
    let elem_da_signature = await scope.page.$( `#dasigpage` );
    if ( elem_da_question === null && elem_da_signature === null ) {
      return false;
    } else {
      return true;
    }
  },  // Ends scope.has_interview_content()

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
      await time.waitForTimeout( 50 );
      curr_url = await scope.page.url();
      error = await scope.checkForError( scope );
    }

    let timeout_err_message = `The test tried to continue to the next page, but it took longer than ${ (scope.timeout/1000)/60 } min. Check the picture of this page. If a secret variable was used, there will be no picture.`
    if ( timedOut ) { reports.addToReport(scope, { type: `error`, code: `ALK0146`, value: timeout_err_message }); }
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
      complex_user_error: await scope.page.$$(`.alert-danger`),
      // The below does not work if there's not a space between ':' and 'none'
      simple_user_error: await scope.page.$$(`xpath/.//*[contains(@class, "da-has-error")][not(contains(@style,"display: none"))]`),
      system_error: await scope.page.$$(`xpath/.//meta[@content="docassemble: Error"]` ),
    };

    let error_handlers = {};
    let was_found = false;
    for ( let error_key in possible_errors ) {
      if ( possible_errors[ error_key ][0] ) {
        // If there's a page visible (locally), give us as much time to examine it as timeout allows.
        // Because of previous actions, this may still be a bit too long.
        // Also, if you're debugging and you close the window early, the process will still
        // take this long to exit after the tests finish. Not sure how to account for that.
        if ( session_vars.get_debug() ) {
          await time.waitForTimeout( ( scope.timeout - (1 * 1000)) );
        }
        was_found = true;
        error_handlers[ error_key ] = possible_errors[ error_key ][0];
      }
    }

    return { was_found, error_handlers };
  },  // Ends scope.checkForError()

  throwPageError: async function ( scope, { error_handlers = {}, id = '' }) {
    /* Throw a cucumber error with the error that appeared on the page. */
    if ( error_handlers.system_error !== undefined ) {
      let sys_err_message = `The test tried to continue to the next page after ${ id }, but there was a system error. Check the picture of this page.`
      reports.addToReport(scope, { type: `error`, code: `ALK0147`, value: sys_err_message });
      expect( was_system_error, sys_err_message ).to.be.false;

    } else {
      // If it wasn't a system error, it was a user error
      let user_err_message = `The test tried to continue to the next page after ${ id }, but the user got an error. Check the picture of this page.`
      reports.addToReport(scope, { type: `error`, code: `ALK0148`, value: user_err_message });
      expect( true, user_err_message ).to.be.false;
    }

    return scope;
  },  // Ends scope.throwPageError()

  take_a_screenshot: async ( scope,{ path }) => {
    /* Takes a jpeg screenshot. Avoids destroying signatures. */

    let fullPage = true;
    let signature_elem = await scope.page.$(scope.signature_selector);
    if ( signature_elem !== null ) {
      fullPage = false;
    }

    await scope.page.screenshot({
      path: path,
      type: 'jpeg',
      fullPage: fullPage,
    });

    let html_path = path;
    if (path.endsWith(".jpg")) {
      html_path = html_path.substring(0, html_path.length - 4) + ".html";
    } else {
      html_path = html_path + ".html";
    }

    // Also save the HTML of the page
    await scope.page.content().then(content => {
      let server_url = session_vars.get_da_server_url();
      content = content.replaceAll(/"(\/static\/.*\.css\?v=[^"]+")/g, server_url + "$1");
      content = content.replaceAll(/"(\/static\/.*\.js\?v=[^"]+")/g, server_url + "$1");
      content = content.replaceAll(/"(\/packagestatic\/.*\.css\?v=[^"]+")/g, server_url + "$1");
      content = content.replaceAll(/"(\/packagestatic\/.*\.js\?v=[^"]+")/g, server_url + "$1");
      fs.writeFileSync(html_path, content)
    });
  },  // Ends scope.take_a_screenshot()


  //#####################################
  //#####################################
  // Custom timeouts for **a bunch of stuff** for v7+ of cucumber
  //#####################################
  //#####################################
  steps: {

    screenshot: async ( scope, name ) => {
      /* Download and save a screenshot. `name` does not have to be
      * unique as the filename will be made unique. */

      let timestamp = Date.now();
      let { id } = await scope.examinePageID( scope, 'none to match' );
      let short_id = `${ id }`.substring(0, 20);
      // Include the custom name if it has one
      if ( name && name.length > 0 ) {
        let short_name = `${ name }`.substring(0, 70);
        pic_name = `pic-${ short_name }-on-${ short_id }-${ timestamp }`;
      } else {
        pic_name = `pic_on-${ short_id }-${ timestamp }`;
      }

      await scope.take_a_screenshot( scope, { path: `./${ scope.paths.scenario }/${ pic_name }.jpg` });

      await scope.afterStep( scope );
    },  // Ends scope.steps.screenshot()

    add_json_vars_to_report: async ( scope ) => {
      /** Uses  https://docassemble.org/docs/functions.html#js_get_interview_variables
      *    to get the variable values on the page of the interview and add
      *    them to the report. */
      let data = await scope.page.evaluate(async function ( elem ) {
        return await get_interview_variables();
      });

      // In future, may be saved to artifact file
      reports.addToReport( scope, {
        type: `json info`,
        code: `ALK0149`,
        value: JSON.stringify( data, null, 2 )
      });
    },  // Ends scope.steps.add_json_vars_to_report()

    link_works: async ( scope, linkText ) => {
      let [link] = await scope.page.$$(`xpath/.//a[contains(text(), "${ linkText }")]`);
      let prop_obj = await link.getProperty( 'href' );
      let actual_url = await prop_obj.jsonValue();

      let linkPage = await scope.browser.newPage();
      // This should not check for a server reload timeout error - it could be going anywhere.
      let response = await linkPage.goto( actual_url, { waitUntil: 'domcontentloaded' });

      let msg = `The "${ linkText }" link is broken.`;
      if ( !response.ok() ) { reports.addToReport( scope, { type: `error`, code: `ALK0150`, value: msg }); }
      expect( response.ok(), msg ).to.be.true;

      // This may cause problems if the linked page is the interview page
      linkPage.close()

      await scope.afterStep(scope);
    },  // Ends scope.steps.link_works()

    set_regular_var: async ( scope, var_name, answer ) => {
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
        var_data: [{ var: var_name, value: answer, trigger: scope.trigger_not_needed_flag }],
      });
      // Don't continue if the variable doesn't cause navigation itself. Also,
      // if this variable cannot be set on this page, trigger an error
      await scope.setFields( scope, { var_data, ensure_navigation: false, ensure_all_vars_used: true });
    },  // Ends scope.steps.set_regular_var()

    set_secret_var: async ( scope, var_name, answer_env_name ) => {
      /** Sets a non-story table variable to a "secret" value (i.e. an env var) */
      // Prevent pictures of a screen with a secret.
      scope.disable_error_screenshot = true;

      let var_data = await scope.normalizeTable( scope, {
              var_data: [{
                var: var_name,
                value: answer_env_name,
                trigger: scope.trigger_not_needed_flag,
                flags: {secret_name: answer_env_name}
              }],
      });
      // Don't continue if the variable doesn't cause navigation itself. Also,
      // if this variable cannot be set on this page, trigger an error
      await scope.setFields( scope, { var_data, ensure_navigation: false, ensure_all_vars_used: true });
    },  // Ends scope.steps.set_secret_var

    tap_term: async ( scope, phrase ) => {
      /** Tap a link that doesn't navigate. Depends on the language of the text.
       *  TODO: This may be broken at this point.
       * */
      const [link] = await scope.page.$$(`xpath/.//a[contains(text(), "${phrase}")]`);

      let msg = `The term "${ phrase }" seems to be missing.`;
      if ( !link ) { reports.addToReport(scope, { type: `error`, code: `ALK0151`, value: msg }); }
      expect( link, msg ).to.exist;
      await scope.tapElementAndStayOnPage(scope, { elem: link });
      await time.waitForTimeout(10000);
    },  // Ends scope.steps.tap_term()

    sign: async ( scope, name ) => {
      /** Sign on a signature page. */
      await scope.draw_signature( scope, name );
      await scope.afterStep(scope);
    },  // Ends scope.steps.sign()

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
      let [elem] = await scope.page.$$(`xpath/.//a[contains(@href, "${ filename }")]`);

      let msg = `"${ filename }" seems to be missing. Cannot find a link to that document.`;
      if ( !elem ) { reports.addToReport(scope, { type: `error`, code: `ALK0152`, value: msg }); }
      expect( elem, msg ).to.exist;

      let failed_to_download = false;
      let err_msg = "";
      try {
        const binaryStr = await scope.page.evaluate(el => {
          const url = el.getAttribute("href");
          return new Promise(async (resolve, reject) => {
            const response = await fetch(url, {method: "GET"});
            const reader = new FileReader();
            reader.readAsBinaryString(await response.blob());
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(`🤕 ALK0153 ERROR: Error occurred on page when downloading ${ url }: ${ reader.error }`);
          });
        }, elem);
        if (binaryStr !== '') {
          const fileData = Buffer.from(binaryStr, 'binary');
          fs.writeFileSync(`${ scope.paths.scenario }/${ filename }`, fileData);
          reports.addToReport(scope, { type: `row info`, code: `ALK0154`, value: `Downloaded ${ filename } (${ fileData.length } bytes) to ${ scope.paths.scenario }`});
        } else {
          failed_to_download = true;
          err_msg = `Couldn't download ${ filename }, binary data for download was empty`;
        }
      } catch (error) {
        failed_to_download = true;
        err_msg = error;
      }

      if (failed_to_download) {
        reports.addToReport(scope, { type: `warning`, code: `ALK0155`, value: `Could not download file using fetch (${ err_msg }). ALKiln will now fallback to the click download method.` });
        scope.toDownload = filename;
        // Should this be using `scope.tapElement`?
        await elem.evaluate( elem => { return elem.click(); });
        await scope.detectDownloadComplete( scope );
      }
    },  // Ends scope.steps.download()

    compare_pdfs: async function (scope, {existing_pdf_path, new_pdf_path}) {
      let existing_paths = await scope.findFiles(scope, {to_find_names: [existing_pdf_path]});
      if (existing_paths.length == 0) {
        // The row wasn't used
        let msg = `Could not find the existing PDF at ${ existing_pdf_path }`;
        reports.addToReport(scope, { type: `error`, code: `ALK0156`, value: msg });
        scope.failed_pdf_compares.push(msg);
        // Return early since we couldn't find the PDF
        return;
      }
      let full_existing_path = existing_paths[0];
      let full_new_pdf_path = `${scope.paths.scenario}/${new_pdf_path}`;
      let diffs = await pdf_reader.compare_pdfs(full_existing_path, full_new_pdf_path);
      if (diffs) {
        let added_str = diffs.filter(part => part.added).reduce((err_str, part) => {
          return err_str + `- ${ part.value }\n`
        }, 'The new PDF added: \n');
        let removed_str = diffs.filter(part => part.removed).reduce((err_str, part) => {
          return err_str + `- ${ part.value }\n`
        }, 'The new PDF removed: \n');
        let msg = `The PDFs were not the same.\n${ added_str }\n${removed_str}\n\n You can see the full PDFs at ${ full_existing_path } and ${ full_new_pdf_path}`;
        reports.addToReport(scope, { type: `error`, code: `ALK0157`, value: msg });
        scope.failed_pdf_compares.push(msg);
      }
    },

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
      * This is a linear step, so no trigger var is needed.
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
      
        reports.addToReport(scope, {
          type: `warning`,
          code: `ALK0158`,
          value: `The name "${name_str}" has more than 4 parts, but 4 is the maximum allowed. The test will set the name to "${name_parts.join(" ")}".`
        });
      }

      let desired_pattern = name_patterns[( name_parts.length - 1 )];

      let raw_data = [];
      for ( let parti = 0; parti < name_parts.length; parti++ ) {
        let var_name = `${ var_base }.name.${ desired_pattern[ parti ] }`
        let value = name_parts[ parti ];
        raw_data.push({ var: var_name, value: value, trigger: scope.trigger_not_needed_flag });
      }

      let var_data = await scope.normalizeTable( scope, { var_data: raw_data, });
      // Avoid continuing automatically. If this var cannot be set on this page, error
      await scope.setFields( scope, { var_data, ensure_navigation: false, ensure_all_vars_used: true });

      // Continue to next page...?
      await scope.afterStep(scope, {waitForShowIf: true});
    },  // Ends scope.steps.set_al_name()

    set_al_address: async ( scope, var_base, address_str ) => {
      /** Given a variable name and a four-part address formatted as below,
      *    sets the appropriate Assembly Line address fields.
      *
      * The string 'the var'/'the variable' part of the step is optional,
      *    as you can see below.
      * This is a linear step only, so it doesn't need to have a trigger var.
      */
      
      // Get all the parts of the address properly separated
      // First, split apart each line of the address to [address line 1, address line 2, city, state zip]...
      let split = address_str.split(/,\s*/);
      // ...then, separate the state and the zip code...
      let last_parts = (split.pop()).split(/\s+/);
      // ...and add them back in, to end up with [address line 1, address line 2, city, state, zip].
      let address_parts = split.concat( last_parts );
      let start = `${ var_base }.address.`;

      let no_trigger = scope.trigger_not_needed_flag;  // just making the lines shorter
      let raw_data = [
        { var: `${start}address`, value: address_parts[0], trigger: no_trigger },
        // Remove accidental 'Unit' or 'unit ' text in case dev included it accidentally
        { var: `${start}unit`, value: (address_parts[1].toLowerCase()).replace(/unit\s*/, ''), trigger: no_trigger },
        { var: `${start}city`, value: address_parts[2], trigger: no_trigger },
        { var: `${start}state`, value: address_parts[3], trigger: no_trigger },
        { var: `${start}zip`, value: address_parts[4], trigger: no_trigger },
      ];
      let var_data =  await scope.normalizeTable( scope, { var_data: raw_data, });
      // Avoid continuing automatically. If this var cannot be set on this page, error
      await scope.setFields( scope, { var_data, ensure_navigation: false, ensure_all_vars_used: true });

      await scope.afterStep(scope, {waitForShowIf: true});
    },  // Ends scope.steps.set_al_address()

    sign_in: async function ( scope, {
      email_secret_name, password_secret_name, api_key_secret_name
    }) {
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
      
      // TODO: implement and use scope.handle_possible_timeout()
      try {
        // puppeteer will ensure proper timeout.
        await scope.page.goto( login_url, { waitUntil: `domcontentloaded`, timeout: scope.timeout });
        await scope.page.waitForSelector( `.dabody` );

      } catch ( error ) {

        let err_msg = `Error occurred when ALKiln tried to go to "${ login_url }".`
        if ( error.name === `TimeoutError` ) {
          let non_reload_report_msg = `It took too long to load "${ login_url }"`;
          await scope.handle_page_timeout_error( scope, { non_reload_report_data: {
            code: `ALK0159`,
            message: non_reload_report_msg,
          }, error });
        } else {
          // Throw any non-timeout error
          reports.addToReport( scope, { type: `error`, code: `ALK0160`, value: err_msg });
          throw error;
        }  // ends if error is timeout error

      }  // ends try/catch

      let email = process.env[ email_secret_name ];
      let password = process.env[ password_secret_name ];

      // Give as many useful messages to the user as possible if the env vars
      // aren't defined. Eventually, just provide a link to the docs because
      // this is complex
      let email_msg = `The email address GitHub SECRET "${ email_secret_name }" doesn't exist. Check for a typo and check your workflow file.`
      if ( email === undefined ) {
        reports.addToReport( scope, { type: `error`, code: `ALK0161`, value: email_msg })
      }
      let password_msg = `The password GitHub SECRET "${ password_secret_name }" doesn't exist. Check for a typo and check your workflow file.`
      if ( password === undefined ) {
        reports.addToReport( scope, { type: `error`, code: `ALK0162`, value: password_msg })
      }
      // Save API key to clean up interviews later. Nice to have, not critical
      if ( api_key_secret_name ) {
        let api_key = process.env[ api_key_secret_name ];
        let api_key_msg = `The API key in the variable "${ api_key_secret_name }" is missing. Check for a typo in your test, workflow file, GitHub secret, or server config.`
        if ( api_key === undefined ) {
          reports.addToReport( scope, { type: `warning`, code: `ALK0199`, value: api_key_msg });
        } else if ( api_key === `` ) {
          reports.addToReport( scope, { type: `warning`, code: `ALK0200`,
            value: `ALKiln found the API key in the variable "${ api_key_secret_name }", but it was empty. It had no text in it. Edit the value of the GitHub secret or server config variable called "${ api_key_secret_name }".` });
        } else {
          let access_info = await da_api.get_api_key_access_status({ api_key });
          if ( !access_info.has_auth ) {
          reports.addToReport( scope, { type: `warning`, code: `ALK0201`,
            value: `The server rejected the API key in the variable "${ api_key_secret_name }". Does it exist on this server? Was it deleted somehow? You can always make a new one.` });
          }
          // Even if it doesn't have access, give it a shot anyway.
          // Maybe we got something wrong.
          scope.scenarios.get( scope.scenario_id ).api_keys.push( api_key );
        }
      }

      expect( email, email_msg ).to.not.equal( undefined );
      expect( password, password_msg ).to.not.equal( undefined );

      // Try to enter the information
      await scope.page.type( `#email`, email );
      await scope.page.type( `#password`, password );
      let elem = await scope.page.$( `button[type="submit"]` );
      await scope.guard_against_missing_tap_element(scope, { elem });

      // Submit and see what happens
      let winner = await scope.steps.race_sign_in_navigation( scope, { elem });
      // Add the result to the report and possibly throw errors
      if ( winner[0] === `success` ) {
        reports.addToReport( scope, {
          type: `row info`, code: `ALK0163`,
          value: `Successfully signed into ${ login_url }`
        });
        await scope.afterStep(scope, {waitForShowIf: false});
      } else if ( winner[0] === `failure` ) {
        let error_msg = reports.addToReport( scope, {
          type: `error`, code: `ALK0209`,
          value: `Failed to sign into ${ login_url }. Make sure you followed the instructions at https://assemblyline.suffolklitlab.org/docs/alkiln/writing/#sign-in.`
        });
        throw new Error( error_msg );
      } else if ( winner[0] === `error` ) {
        let error_msg = reports.addToReport( scope, {
          type: `error`, code: `ALK0210`,
          value: `Error on sign in page at ${ login_url }. Try this by hand and then run the test again.`
        });
        throw new Error( error_msg );
      }
    },  // Ends scope.steps.sign_in()

    race_sign_in_navigation: async function ( scope, { elem }) {
      /** Wait for sign in navigation success or failure, or system error. */

      // After everything, clean up incomplete promises
      const controller = new AbortController;

      // Redirect
      let redirect_promise = scope.page.waitForResponse(function ( response ) {
        return response.status() === 302;
      }, { signal: controller.signal })
      .catch(( error ) => {
        log.debug({
          code: `ALK0204`, type: `info`,
          pre: `302 sign-in wait error: ${ error.name }`,
          data: error,
        });
        console.log(`302 error:`, error.name);
      });

      // Invalid credentials, no navigation, no sign in
      let wrong_sign_in_promise = scope.page.waitForResponse(function ( response ) {
        return response.status() >= 200 && response.status() < 300 && response.url().includes(`/sign-in`);
      }, { signal: controller.signal })
      .catch(( error ) => {
        log.debug({
          code: `ALK0205`, type: `info`,
          pre: `200s sign-in wait error: ${ error.name }`,
          data: error,
        });
      });

      // System error
      let error_promise = scope.page.waitForResponse(function ( response ) {
        return response.status() >= 500 && response.status() < 600;
      }, { signal: controller.signal })
      .catch(( error ) => {
        log.debug({
          code: `ALK0206`, type: `info`,
          pre: `500s sign-in wait error: ${ error.name }`,
          data: error,
        });
      });

      let click_promise = elem.click();  // MUST complete
      const winner = await Promise.race([
        Promise.all([ `success`, click_promise, redirect_promise ]),
        Promise.all([ `failure`, click_promise, wrong_sign_in_promise ]),
        Promise.all([ `error`, click_promise, error_promise ]),
      ]).catch(function ( error ) {
        let error_msg = reports.addToReport( scope, {
          type: `error`, code: `ALK0207`,
          value: `Unknown error waiting for results during sign in at ${ login_url }.`
        });
        throw new Error( error );
      });

      // Clean up unresolved promises
      controller.abort();

      log.debug({
        code: `ALK0208`, type: `info`,
        pre: `Sign-in winner:`, data: winner,
      });

      return winner;
    },

    set_random_page_vars: async ( scope ) => {
      /** Answer inputs randomly. */

      let html = await scope.page.content();
      // These are the fields on the current page. Their handles should all exist.
      let fields = await scope.getAllFields( scope, { html: html });
      let buttons = [];

      // For every field on the page
      for ( let field of fields ) {
        // fields[n].tag is HTML tag of node, as a string

        // If the field is a button, save it in a list of buttons that we'll deal with later
        if ( field.tag === `button` ) {
          buttons.push( field );
        } else {
          // Try to give a random answer for that element tag
          await scope.set_random_input_for[ field.tag ]( scope, { field: field });
          process.stdout.write(`\x1b[36m${ '*' }\x1b[0m`);  // assumes var was set if no error occurred
        }

      }  // End for all page fields

      return buttons;

    },  // Ends scope.steps.set_random_page_vars()

  },  // ends scope.steps

  set_random_input_for: {
    a: async function (scope, { fields }) {
      // We don't do anything with links for random input tests
    }, 
    buttons: async function (scope, { fields }) {
      // Get a random button
      let back_btn = null;
      fields = fields.filter((ff) => {
        if (ff.selector.includes("daquestionbackbutton")) {
          back_btn = ff;
          return false;
        }
        return true;
      });
      let field = null;
      if (back_btn != null && Math.random() > 0.9) {
        // 10% chance of clicking the back button. Back buttons don't undo
        // external network calls or saving things to Redis, so we make sure
        // programs can handle (or least don't crash) when users press back
        field = back_btn;
      } else {
        field = faker.helpers.arrayElement( fields );
      }
      if (field == null) {
        // Just skip it? Shouldn't happen but has before. Dig in more
        log.debug({
          code: `ALK0164`,
          type: `info`,
          pre: `A random button field choice was null. These were the fields to choose from:\n${ JSON.stringify(fields, null, 2) }`,
        });
        return;
      }
      let handle = await scope.get_handle_from_field( scope, { field: field });
      // Send it to be tapped
      await scope.funnel_the_answer( scope, { handle, field, answer: `doesn't matter` });
    },
    textarea: async function (scope, { field }) {
      // Get random paragraph of text
      let answer = faker.lorem.paragraph();
      // Get the element's puppeteer handler
      let handle = await scope.get_handle_from_field( scope, { field: field });
      // Type the random text into the textarea
      await scope.funnel_the_answer( scope, { handle, field, answer: answer });
    },
    select: async function (scope, { field }) {
      // Get the values of all the options of the field
      let handle = await scope.get_handle_from_field( scope, { field: field });
      // Get the values of all the choices
      let answer_choices = await handle.evaluate(function ( elem ) {
        let values = Array.from(elem.querySelectorAll(`option`)).map(element=>element.value);
        return values;
      });

      // Remove the "no selection" option from the list ('')
      // TODO: blue sky - for optional fields allow no selection
      if ( answer_choices[0] === `` ) {
        answer_choices.shift();
      }

      // Select randomly between them
      let answer = faker.helpers.arrayElement( answer_choices );

      // Set that value
      await scope.funnel_the_answer( scope, { handle, field, answer: answer });

    },
    canvas: async function (scope, { field }) {
      // WARNING: Do not test this in headless mode.
      // If we do this in headless mode, the test will fail. It signs, but
      // can't continue. Not sure why.
      await scope.funnel_the_answer( scope, { field, handle: null, answer: `doesn't matter` });
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
      // that is part of a custom datatype with a hidden field - this
      // doesn't take care of that situation.

      let handle = await scope.get_handle_from_field( scope, { field: field });

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
            let answer = await scope.get_random_input_for[ custom_datatype ]( scope );
            await scope.funnel_the_answer( scope, { handle, field, answer });

          }
          // Otherwise ignore the non-original field

        // Untested: If no hidden field exists, just try to set the custom
        // datatype field
        } else {
          // set the value
          let answer = await scope.get_random_input_for[ custom_datatype ]( scope );
          await scope.funnel_the_answer( scope, { handle, field, answer });
        }

      // If this is not a custom datatype
      } else {

        // `file` type inputs come next to an input with a type of ''.
        // Maybe others do too.
        if ( type !== `` && type !== `hidden` ) {
          // Field types that we can't yet handle, but plan to in future
          if ( type === `file` ) {
            reports.addToReport( scope, {
              type: `warning`,
              code: `ALK0165`,
              value: `Sorry, ALKiln's random input tests cannot yet handle "${ type }" fields.`
            });
          } else {
            let answer = await scope.get_random_input_for[ type ]( scope );
            await scope.funnel_the_answer( scope, { handle, field, answer });
          }  // ends if field type is one we cover
        }  // ends if field type exists

      }  // ends else after is custom datatype

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
      let answer = faker.helpers.arrayElement( [`1`, `2`, `3`], 1 );
      return answer;
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
    let scenario = scope.report.get( scope.scenario_id );
    let report = reports.getPrintableScenario( scenario );
    let all_are_included = true;
    for ( let one_expectation of expected ) {
      if ( !report.includes( one_expectation )) {
        all_are_included = false;
        expect( report ).to.contain( one_expectation );
      }
    }

    return all_are_included;
  },  // Ends scope.reportIncludesAllExpected()

  reportDoesNotInclude: async function ( scope, { not_expected=[] }) {
    /* Tests the behavior of this testing framework.
    * Test whether the expected values are not included in the test report.
    * 
    * @param not_expected {array} Arr of strs that should not appear in the report.
    */
    let scenario = scope.report.get( scope.scenario_id );
    let report = reports.getPrintableScenario( scenario );
    let none_included = true;
    for ( let one_expectation of not_expected ) {
      if ( report.includes( one_expectation )) {
        none_included = false;
        expect( report ).not.to.contain( one_expectation );
      }
    }

    return none_included;
  },

};
