const {
  When,
  Then,
  And,
  Given,
  After,
  Before,
  BeforeAll,
  AfterAll,
  setDefaultTimeout //,
  // wrapPromiseWithTimeout  // cucumber v8
} = require('@cucumber/cucumber');
const wrapPromiseWithTimeout = require('./cucumber_8_shim');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');

// Ours
const scope = require('./scope');
const Log = require(`./utils/log`);
const session_vars = require('./utils/session_vars');
const files = require('./utils/files' );
const reports = require(`./utils/reports`);
const da_api = require('./docassemble/docassemble_api_interface');

/* Of Note:
- We're using `*=` for selectors because sometimes da text has funny characters in it that are hard to anticipate
- Can't use elem[ scope.activate ](). It works locally, but errors on GitHub
  with "Node is not visible or not an HTMLElement". We're not using a custom Chromium version
  Unfortunately, this won't catch an invisible element. Hopefully we'd catch it before click
  attempts are made. "Tap" on mobile is more complex to implement ourselves.
  See https://stackoverflow.com/a/56547605/14144258
  and other convos around it. We haven't made it public that the device
  can customized. Until we do that, we'll just use "click" all the time.
*/


require("dotenv").config();  // Where did this go?

/* TODO:
1. 'choice' to be any kind of choice - radio, checkbox,
    dropdown, etc. Have to research the different DOM for each
1. 'choice' to have a more specific way to access each item. For
    example, for a list collect or other things that have multiple
    things with the same text on the page.
1. Figure out how to test allowing flexibility for coder. For example:
    there is placeholder text for the title of the form and if it's not
    defined, placeholder text should appear (though that behavior may
    bear discussion).
1. Add links to resources on:
   1. taps that trigger navigation need Promise.all: https://stackoverflow.com/a/60789449/14144258
       > I ran into a scenario, where there was the classic POST-303-GET
       and an input[type=submit] was involved. It seems that in this case,
       the tap of the button won't resolve until after the associated form's
       submission and redirection, so the solution was to remove the waitForNavigation,
       because it was executed after the redirection and thus was timing out.

       I think Promise.all is what's taking care of these situations.
   1. Listening for `targetchanged` or changed URL
   1. Listening for responses

Should post example of detecting new page/no new page on submit when there
is a DOM change that you can detect. I suspect no request is
being sent, but I could be wrong. Haven't yet figured out how
to detect that.

regex thoughts: https://stackoverflow.com/questions/171480/regex-grabbing-values-between-quotation-marks
*/

// Make sure all the required env vars exist. Required to be
// here as well as `setup`` specifically for local development.
session_vars.validateEnvironment();

// Hoping that most load and download times will be under 30 seconds.
// TODO: Check what average load and download times are in our current interviews.
let default_timeout = 30 * 1000
setDefaultTimeout( default_timeout );

let click_with = {
  mobile: 'tap',
  pc: 'click',
};

let log = null;

BeforeAll(async () => {
  scope.showif_timeout = 600;
  // TODO: Do these really need to be maps? As sets, they may make the output
  // more predictable to the user, but they add complexity.
  scope.scenarios = new Map();
  scope.report = new Map();

  // Start tracking whether server is up and running
  scope.track_server_status( scope );

  // Store path names for files and docs created for the tests
  scope.paths = {};

  // TODO: figure out how to test file and folder creation stuff,
  // especially when setup is excluded from the flow.

  // Make the folder to store all the files for this run of the tests
  scope.paths.artifacts = files.make_artifacts_folder();
  // Save its name in a file. `session_vars` can get it back later.
  // The value we are saving is used by at least run_cucumber.js.
  session_vars.save_artifacts_path_name( scope.paths.artifacts );
  log = new Log({ path: scope.paths.artifacts, context: `steps` });
  scope.set_log({ log_obj: log });

  scope.paths.report = `${ scope.paths.artifacts }/report.txt`;
  scope.paths.failures = `${ scope.paths.artifacts }/${ log.unexpected_filename }`;
  scope.paths.debug_log = `${ scope.paths.artifacts }/${ log.debug_log_filename }`;
  fs.writeFileSync( scope.paths.debug_log, "" );

  reports.create( scope );
});

Before(async (scenario) => {

  // Start the running "progress bar" for the Scenario
  console.log(``);  // New line (which stdout doesn't do)
  log.stdout({ log: `Scenario: ${ scenario.pickle.name }: ` })

  // Create browser, which can't be created in BeforeAll() where .driver doesn't exist for some reason
  if (!scope.browser) {
    if ( session_vars.get_origin() !== `local` ) {
      // Will only run in the Playground outside of a sandbox. TODO: There's a
      // better way to do this, though it's more complicated. See comments in
      // https://github.com/SuffolkLITLab/ALKiln/issues/661
      scope.browser = await scope.driver.launch({ args: ['--no-sandbox'] });
    } else {
      scope.browser = await scope.driver.launch({ headless: !session_vars.get_debug(), devtools: session_vars.get_debug() });
    }
  }
  // Clean up all previously existing pages
  for (const page of await scope.browser.pages()) {
    await page.close();
  }
  // Make a new page
  scope.page = await scope.browser.newPage()

  scope.scenario_id = uuidv4();
  scope.scenarios.set( scope.scenario_id, {} );
  scope.scenarios.get( scope.scenario_id ).interviews = {};
  scope.scenarios.get( scope.scenario_id ).api_keys = [];
  scope.expected_status = null;
  scope.expected_in_report = null;
  scope.expected_not_in_report = null;
  scope.server_reload_promise = null;

  reports.addReportHeading(scope, {scenario});
  // Make folder for this Scenario in the all-tests artifacts folder
  scope.base_filename = await scope.getSafeScenarioBaseFilename(scope, {scenario});
  // Add a date for uniqueness in case dev has accidentally copied a Scenario description
  let date = Date.now();
  scope.paths.scenario = `${ scope.paths.artifacts }/${ scope.base_filename }-${ date }`;
  fs.mkdirSync( scope.paths.scenario );
  // Store path name for this Scenario's individualized report
  scope.paths.scenario_report = `${ scope.paths.scenario }/report.txt`;

  // Downloads
  scope.downloadComplete = false;
  scope.toDownload = '';
  // Device interaction
  scope.device = 'pc';
  scope.activate = click_with[ scope.device ];
  scope.disable_error_screenshot = false;

  scope.page_id = null;
  scope.check_all_for_a11y = false;
  scope.passed_all_for_a11y = true;
  scope.failed_pdf_compares = [];

  // Reset default timeout
  scope.timeout = default_timeout;
});

// Add a check for an error page before each step? After each step?


//#####################################
//#####################################
// Establishing
//#####################################
//#####################################

Given(/I start the interview at "([^"]+)"/, {timeout: -1}, async (file_name) => {  // √

  // Load the right interview page
  await scope.load( scope, file_name );

  // The page timeout is set in here too in case someone set a custom timeout
  // just before a page was loaded for the Scenario. Move this to just after page creation?
  // The function itself won't really timeout here, so we don't need to wrap it in
  // a custom timeout
  await scope.page.setDefaultTimeout( scope.timeout );  // overrides outer default timeout

  // TODO: Move this to the `download` Step and only do it once per scenario
  // Allow developer to save download files
  let custom_download_behavior_timeout = new Promise(async ( resolve, reject ) => {
    let page_timeout = setTimeout(function() {reject( `🤕 ALK0057 ERROR: Took too long to set download behavior.` ); }, scope.timeout);
    // self-invoke an anonymous async function so we don't have to
    // abstract the details of resolving and rejecting.
    (async function() {
      // I've seen stuff take an extra moment or two. Shame to have it everywhere
      try {
        // Interview files should get downloaded to downloads folder
        await scope.page._client().send('Page.setDownloadBehavior', {
          behavior: 'allow',
          downloadPath: path.resolve( scope.paths.scenario ),  // Save in root of this scenario
        });
        resolve();
      } catch ( err ) { reject( err ); }
      // prevent temporary hang at end of tests
      finally { clearTimeout( page_timeout ); }
    })();
  });  // ends custom_download_behavior_timeout
  await custom_download_behavior_timeout;

  // ---- EVENT LISTENERS ----

  // TODO: Wait for download to complete doesn't work. See notes in
  // scope.js scope.detectDownloadComplete()

  // ~Wait for possible download. From https://stackoverflow.com/a/51423688~
  scope.page.on('response', async response => {
    // Note: We can expect that only one file will be getting downloaded
    // at any one time since each step completes synchronously
    // If response has a file in it that matches the file we are downloading
    // Sadly, 'content-disposition' isn't working. We're not sure what will.
    if ( response.headers()['content-disposition'] && (response.headers()['content-disposition']).includes(`attachment;filename=${scope.toDownload}`) ) {
      // We're choosing to avoid removing the event listener in case removal
      // would prevent downloading other files. The listener should get
      // destroyed when the page closes anyway.

      // Watch event on download folder or file
      await fs.watchFile( scope.paths.scenario, function (curr, prev) {
        // If current size eq to size from response then close
        if (parseInt(curr.size) === parseInt(response.headers()['content-length'])) {
          // Lets the related function in `scope` know that the download
          // is done so that the next step can start.
          scope.downloadComplete = true;
          this.close();
          return true;
        }
      });  // ends fs.watchFile

      return false;
    }  // ends if this is the file the developer expected
  });  // ends page.on 'response'

  // TODO: Wrap everything in this step in this timeout? Or is this Step's timeout different?
  // Wait for navigation
  let custom_afterStep_timeout = new Promise(async ( resolve, reject ) => {
    let page_timeout = setTimeout(function() { reject(`\`afterStep()\` took too long.`); }, scope.timeout);
    // self-invoke an anonymous async function so we don't have to
    // abstract the details of resolving and rejecting.
    (async function() {
      // I've seen stuff take an extra moment or two. Shame to have it everywhere
      try { await scope.afterStep(scope, {waitForTimeout: 200}); resolve(); }
      catch ( err ) { reject( err ); }
      // prevent temporary hang at end of tests
      finally { clearTimeout( page_timeout ); }
    })();
  });  // ends custom_afterStep_timeout
  await custom_afterStep_timeout;
});

Given(/I go to "([^"]+)"/i, {timeout: -1}, async ( url ) => {
  /** Navigate to an arbitrary url. What you do after that depends on you. There's
   *    a limited amount ALKiln can do on a non-docassemble page or a very customized
   *    docassemble page.
   *
   * @params {string} A valid url */
  let result = await wrapPromiseWithTimeout(
    scope.page.goto( url, { waitUntil: 'domcontentloaded', timeout: scope.timeout }),
    scope.timeout,
    // TODO: Turn this into a function
    `🤕 ALK0058 ERROR: It took to long to get to "${ url }"`
  );

  reports.addToReport(scope, { type: `info`, code: `ALK0059`, value: `Successfully went to "${ url }"` });
  return result;
});

Given(
  /I (?:sign|log) ?(?:in)?(?:on)?(?:to the server)? with(?: the email)? "([^"]+)",?(?: and)?(?: the password)? "([^"]+)"(?: SECRETs)?(?:,?(?: and)?(?: the API key)? "([^"]+)")?/i,
  { timeout: -1 },
  async ( email, password, api_key ) => {
  /** Uses the names of environment variables (most often GitHub SECRETs) to
  *     log into an account on the user's server. Must be secure.
  * 
  * Variations:
  * I sign into the server with the email "USER2_EMAIL" and the password "USER2_PASSWORD"
  * I sign on with the email "USER2_EMAIL" and the password "USER2_PASSWORD"
  * I log in with "USER2_EMAIL" and "USER2_PASSWORD"
  * I sign in with the email "USER2_EMAIL", the password "USER2_PASSWORD", and the API key "USER2_API_KEY"
  * I sign in with "USER2_EMAIL", "USER2_PASSWORD", "USER2_API_KEY"
  */
  // `page` timeout will deal with custom timeout
  // Couldn't test the timeout for tapping the button because there's not
  // enough of a pause between initial navigation and pressing button.
  await scope.steps.sign_in( scope, {
    email_secret_name: email,
    password_secret_name: password,
    api_key_secret_name: api_key
  });
});

// I am using a mobile/pc
When(/I am using an? (.*)/, async ( device ) => {
  // Let developer pick mobile device if they want to
  // TODO: Add tablet?
  if ( device ) {
      if ( device.includes( 'mobile' ) || device.includes( 'phone' ) ) {
      await scope.page.setUserAgent("Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36");
      scope.device = 'mobile';
    }
  } else {
    await scope.page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");
    scope.device = 'pc';
  }

  scope.activate = click_with[ scope.device ];
});

Given(/the max(?:imum)? sec(?:ond)?s for each step (?:in this scenario )?is (\d+)/i, async ( seconds ) => {
  /* At any time, set a custom timeout for the scenario. */
  // TODO: Add 1 second to this to allow other steps to not fail, like "I wait n seconds"
  scope.timeout = parseInt( seconds ) * 1000;

  // Cucumber timeouts are made custom for each step that needs it

  // If there is no page yet, we've ensured custom timeout will still be set
  // appropriately in the interview loading step
  if ( scope.page ) { await scope.page.setDefaultTimeout( scope.timeout ); }
});

//#####################################
//#####################################
// Story
//#####################################
//#####################################
// TODO: Consider more permissive sentences:
// with(?: this data| these answers)?:?
// with(?:.*):?
When(/^(?:the user gets)?(?:I get)? to ?(?:the)?(?: ?question)?(?: id)? "([^"]+)" with this data:?/, {timeout: -1}, async (target_id, raw_var_data) => {
  /* NO CUCUMBER TIMEOUT. Must handle timeout ourselves:
  * https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/timeouts.md#disable-timeouts
  * Iterate in here to keep timeout reasonable */

  // Note: Why do we not just stop when we've used all the vars in the table or
  // reach the last var? Vars are not required to be given in sequence and pages that
  // have non-button fields don't usually have a var assigned to the 'continue' button.
  // Alternative: require vars even for 'continue' pages. Then in loop require at least one var
  // to be found on a page before hitting 'continue'. That requires detecting navigation because
  // pages with fields will not have a var for the continue button, so there will
  // still have to be some automatic continuing.
  // It also seems harsh, but more reliable.
  // Ask developers what they'd like.


  let supported_table = await scope.normalizeTable( scope, { raw_var_data });

  let { question_has_id, id, id_matches } = await scope.examinePageID( scope, target_id );
  // Until we reach the target page, hit an error, or time out (take too long)
  while ( !id_matches ) {
    let custom_timeout = new Promise(function( resolve, reject ) {

      // Set up the timeout that avoids infinite loops
      let on_page_timeout = async function() {

        let non_reload_report_msg = `The target id was "${ target_id }", but it took `
        + `too long to try to reach it (over ${ scope.timeout/1000/60 } min). The `
        + `test got stuck on "${ id }".`
        let error = non_reload_report_msg;
        await scope.handle_page_timeout_error( scope, { non_reload_report_data: {
          code: `ALK0060`,
          message: non_reload_report_msg,
        }, error });
      };  // Ends on_page_timeout()
      let page_timeout_id = setTimeout(on_page_timeout, scope.timeout);

      // self-invoke an anonymous async function so we don't have to
      // abstract the details of resolving and rejecting.
      // If we need to call recursively, signature function might look like:
      // func( scope, { resolve, reject, supported_table, page_timeout_id })
      // Maybe list of timeout and/or interval ids in state that can all be cleared at once?
      (async function() {
        try {
          let { question_has_id, id, id_matches } = await scope.examinePageID( scope );

          // THIS FUNCTION ACTUALLY MATTERS
          // Add special rows. Basically, do weirder things.
          // TODO: Remove from_story_table - no longer needed if only called from in here
          let ensured_var_data = await scope.ensureSpecialRows( scope, {
            var_data: supported_table,
            from_story_table: true,
          });

          log.debug({ code: `ALK0061`, context: `table`, },
            `Rows, including special rows:`, ensured_var_data
          );

          // THIS FUNCTION ACTUALLY MATTERS
          // Some errors happen in there to be closer to the relevant code. We'd have to try/catch anyway.
          let error = await scope.setFields(scope, { var_data: ensured_var_data, id, ensure_navigation: true });

          if ( error.was_found ) { await scope.throwPageError( scope, { id: id }); }
          resolve();
        } catch ( err ) {
          let err_msg = `Error occurred when tried to answer fields on question "${ id }".`
          reports.addToReport( scope, { type: `error`, code: `ALK0062`, value: err_msg });
          // Throw error instead?
          reject( err );
        } finally {
          clearTimeout( page_timeout_id );  // prevent temporary hang at end of tests
        }
      })();
    });  // ends custom_timeout for setFields

    await custom_timeout;

    // Prep for next loop
    ({ question_has_id, id, id_matches } = await scope.examinePageID( scope, target_id ));

  }  // ends while !id_matches
  // Can anything unsatisfactory get through here?

  // Add report strings from supported table, not an altered one
  for ( let row of supported_table ) {
    row.report_str = `${ reports.convertToOriginalStoryTableRow(scope, { row_data: row }) }`;
  }
  // Sort into alphabetical order, as is recommended for writing story tables
  let sorted_rows = supported_table.sort( function ( row1, row2 ) {
    if( row1.report_str < row2.report_str ) { return -1; }
    if( row1.report_str > row2.report_str ) { return 1; }
    return 0;
  });

  // Add full used table to report so it can be copied if needed.
  // TODO: Should we/How do we get this in the final scenario report instead of here?
  reports.addToReport( scope, { type: `note info`, code: `ALK0063`, value: `\n${ ' '.repeat(2) }Rows that got set:` });
  reports.addToReport( scope, { type: `step info`, code: `ALK0064`, value: `${ ' '.repeat(4) }And I get to the question id "${ target_id }" with this data:` });
  reports.addToReport(scope, { type: `row info`, code: `ALK0065`, value: `${ ' '.repeat(6) }| var | value | trigger |`, });
  let at_least_one_row_was_NOT_used = false;
  for ( let row of sorted_rows ) {
    if ( row.times_used > 0 ) {
      reports.addToReport(scope, { type: `row info`, code: `ALK0066`, value: row.report_str, });
    } else {
      at_least_one_row_was_NOT_used = true;
    }
  }

  // Add unused rows if needed
  if ( at_least_one_row_was_NOT_used ) {
    reports.addToReport( scope, { type: `note info`, code: `ALK0067`, value: `${ ' '.repeat(2) }Unused rows:` });
    for ( let row of sorted_rows ) {
      if ( row.times_used === 0 ) {
        reports.addToReport(scope, { type: `row info`, code: `ALK0068`, value: row.report_str, });
      }
    }
  } else {
    reports.addToReport(scope, { type: `note info`, code: `ALK0069`, value: `${ ' '.repeat(2) }All rows were used` });
  }

  reports.addToReport(scope, { type: `plain`, value: `` });
});


//#####################################
//#####################################
// Passive/Observational
//#####################################
//#####################################

When(/I wait ?(?:for)? (\d*\.?\d+) seconds?/, { timeout: -1 }, async ( seconds ) => {
  /** Wait for a specified amount of time. Can help with some race conditions.
  *    We're working on reducing race conditions, but it'll never be perfect.
  *
  * Variations:
  * - I wait 1 second
  * - I wait .5 seconds
  *
  * Questions:
  * - Should this really reset the 'navigated' flag? Should the below
  *     return succeed or fail? e.g:
  *     I tap to continue; I wait 10 seconds; I arrive at the next page;
  *     Maybe the 'navigated' flag should only be reset just before trying to
  *     navigate (after pressing a button)
  */
  return wrapPromiseWithTimeout(
    scope.afterStep(scope, {waitForTimeout: (parseFloat( seconds ) * 1000)}),
    scope.timeout
  );
});

Then(/I take a (?:screenshot|pic) ?(?:named "([^"]+)")?/, { timeout: -1 }, async ( name ) => {
  /* Download and save a screenshot. `name` does not have to be
  * unique as the filename will be made unique. */
  return wrapPromiseWithTimeout(
    scope.steps.screenshot( scope, name ),
    scope.timeout
  );
});

/* Here to make writing tests more comfortable. */
When("I do nothing", async () => { await scope.afterStep(scope); });  // √

Then(/the (?:question|page|screen) id should be "([^"]+)"/i, { timeout: -1 }, async ( question_id ) => {
  /* Looks for a sanitized version of the question id as it's written
  *     in the .yml. docassemble's way */
  let { question_has_id, id, id_matches } = await scope.examinePageID( scope, question_id );

  // No question id exists
  let no_id_msg = `Did not find any question id.`;
  if ( !question_has_id ) {
    reports.addToReport( scope, { type: `error`, code: `ALK0070`, value: no_id_msg });
  }
  expect( question_has_id , no_id_msg ).to.be.true;

  // Wrong question id
  let no_match_msg = `The question id was supposed to be "${ question_id }"`
    + `, but it is actually "${ id }".`;
  if ( !id_matches ) {
    reports.addToReport( scope, { type: `error`, code: `ALK0071`, value: no_match_msg });
  }
  expect( id_matches, no_match_msg ).to.be.true;

  await scope.afterStep(scope);
});

// Allow emphasis with capital letters
Then(/I ?(?:should)? see the phrase "([^"]+)"/i, async ( phrase ) => {  // √
  /* In Chrome, this `innerText` gets only visible text */
  const bodyText = await scope.page.$eval('body', elem => elem.innerText);

  let msg = `The text "${ phrase }" SHOULD be on this page, but it's NOT.`;
  if ( !bodyText.includes( phrase )) { reports.addToReport(scope, { type: `error`, code: `ALK0072`, value: msg }); }
  expect( bodyText, msg ).to.contain( phrase );

  await scope.afterStep(scope);
});

// Allow emphasis with capital letters
Then(/I should not see the phrase "([^"]+)"/i, async ( phrase ) => {  // √
  /* In Chrome, this `innerText` gets only visible text:
  * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
  * "ignores hidden elements" */
  const bodyText = await scope.page.$eval('body', elem => elem.innerText);

  let msg = `The text "${ phrase }" should NOT be on this page, but it IS here.`;
  if ( bodyText.includes( phrase )) { reports.addToReport(scope, { type: `error`, code: `ALK0073`, value: msg }); }
  expect( bodyText, msg ).not.to.contain( phrase );

  await scope.afterStep(scope);
});

Then('an element should have the id {string}', async ( id ) => {  // √
  const element = await scope.page.$('#' + id);

  let msg = `No element on this page has the ID "${ id }".`;
  if ( !element ) { reports.addToReport(scope, { type: `error`, code: `ALK0074`, value: msg }); }
  expect( element, msg ).to.exist;

  await scope.afterStep(scope);
});

// TODO:
// Just realized it's much more likely that the group name will be
// repeated than that the choice name will be repeated. Or maybe
// they're both equally likely to be repeated, but writing about the
// ordinal of the group would probably be more comfortable for a human.
// Need to think about this.

// let ordinal_regex = '?(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)?';
// // Haven't figured out ordinal_regex for group label yet
// // Allow "checkbox" and "radio"? Why would they be called the same thing?
// // TODO: Remove final pipe in regex
// let the_checkbox_is_as_expected = new RegExp(`the ${ ordinal_regex } ?(?:"([^"]+)")? (choice|checkbox|radio)(?: button)? ?(?:in "([^"]+)")? is (checked|unchecked|selected|unselected)`);
// Then(the_checkbox_is_as_expected, async (ordinal, label_text, choice_type, group_label_text, expected_status) => {  // √
  /* Non-dropdown non-combobox choices
  * Examples of use:
  * 1. the choice is unchecked
  * 1. the radio is unchecked
  * 1. the checkbox is unchecked
  * 1. the only checkbox is unchecked
  * 1. the third checkbox is checked
  * 1. the "My court" checkbox is unchecked
  * 1. the checkbox in "Which service" is checked
  * 1. the third "My court" checkbox is checked
  * 1. the third checkbox in "Which service" is checked
  * 1. the "My court" checkbox in "Which service" is checked
  * 1. the third "My court" checkbox in "Which service" is checked
  * combos: none; a; b; c; a b; a c; b c; a b c;
  */
//   let roles = [ choice_type ];
//   if ( choice_type === 'choice' ) { roles = ['checkbox', 'radio']; }

//   let elem = await scope.getSpecifiedChoice(scope, {ordinal, label_text, roles, group_label_text});

//   // See if it's checked or not
//   let is_checked = await elem.evaluate((elem) => {
//     return elem.getAttribute('aria-checked') === 'true';
//   });
//   let what_it_should_be = expected_status === 'checked' || expected_status === 'selected';
//   expect( is_checked ).to.equal( what_it_should_be );

//   await scope.afterStep(scope);
// });

// This phrase is confusing. It sounds like it's going to at least try to continue.
Then(/I (don't|can't|don’t|can’t|cannot|do not) continue/, async (unused) => {  // √
  /* Tests for detection of url change from button or link tap.
  *    Can other things trigger navigation? Re: other inputs things
  *    like 'Enter' acting like a click is a test for docassemble */
  let msg = `The page should have stopped the user from continuing, but the user was able to continue.`;
  if ( scope.navigated ) { reports.addToReport(scope, { type: `error`, code: `ALK0075`, value: msg }); }
  expect( scope.navigated, msg ).to.be.false;

  await scope.afterStep(scope);
});

Then('I will be told an answer is invalid', async () => {  // √

  let { was_found, error_handlers } = await scope.checkForError( scope );

  let no_error_msg = `No error message was found on the page`;
  if ( !was_found ) { reports.addToReport(scope, { type: `error`, code: `ALK0076`, value: no_error_msg }); }
  expect( was_found, no_error_msg ).to.be.true;

  let was_user_error = error_handlers.complex_user_error !== undefined || error_handlers.simple_user_error !== undefined;
  let not_user_error_msg = `The error was a system error, not an invalid user answer. Check for the picture of the page's error if the Step did not use any secret variables.`;
  if ( !was_user_error ) { reports.addToReport(scope, { type: `error`, code: `ALK0077`, value: not_user_error_msg }); }
  expect( was_user_error, not_user_error_msg ).to.be.true;

  await scope.afterStep(scope);
});

Then('I arrive at the next page', async () => {  // √
  /* Tests for detection of url change from button or link tap.
  *    Can other things trigger navigation? Re: other inputs things
  *    like 'Enter' acting like a click is a test for docassemble */
  let msg = `User did not arrive at the next page.`
  if ( !scope.navigated ) { reports.addToReport(scope, { type: `error`, code: `ALK0078`, value: msg }); }
  expect( scope.navigated, msg ).to.be.true;
  await scope.afterStep(scope);
});

// Link observations have the 'Escape' button link in mind
Then('I should see the link {string}', async ( linkText ) => {  // √
  /* Loosely match link visible text. Should probably deprecate this. */
  let [link] = await scope.page.$$(`xpath/.//a[contains(text(), "${linkText}")]`);

  let msg = `Cannot find a link with the text "${ linkText }".`;
  if ( !link ) { reports.addToReport(scope, { type: `error`, code: `ALK0079`, value: msg }); }
  expect( link, msg ).to.exist;

  await scope.afterStep(scope);
});

Then('I should see the link to {string}', async ( url ) => {  // √
  /* Strictly match href of link. */
  let link = await scope.page.$(`*[href="${ url }"]`);

  let msg = `Cannot find a link to "${ url }".`;
  if ( !link ) { reports.addToReport(scope, { type: `error`, code: `ALK0080`, value: msg }); }
  expect(link, msg ).to.exist;

  await scope.afterStep(scope);
});

Then(/the "([^"]+)" link leads to "([^"]+)"/, async (linkText, expected_url) => {  // √
  /* Find link by its visible text and where it leads. */
  let [link] = await scope.page.$$(`xpath/.//a[contains(text(), "${linkText}")]`);
  // TODO: Possibly add a check here for the link text, though note this
  // Step is not currently supported.

  let prop_obj = await link.getProperty('href');
  let actual_url = await prop_obj.jsonValue();

  let msg = `Cannot find a link with the text "${ linkText }" leading to ${ expected_url }.`;
  if ( actual_url !== expected_url ) { reports.addToReport(scope, { type: `error`, code: `ALK0081`, value: msg }); }
  expect( actual_url ).to.equal( expected_url );

  await scope.afterStep(scope);
});

Then(/the "([^"]+)" link opens in (a new window|the same window)/, async (linkText, which_window) => {  // √
  let [link] = await scope.page.$$(`xpath/.//a[contains(text(), "${linkText}")]`);

  let prop_obj = await link.getProperty('target');
  let target = await prop_obj.jsonValue();

  let should_open_a_new_window = which_window === 'a new window';
  let opens_a_new_window = target === '_blank';
  let hasCorrectWindowTarget =
    ( should_open_a_new_window && opens_a_new_window )
    || ( !should_open_a_new_window && !opens_a_new_window );

  let msg = `The link "${ linkText }" does NOT open in ${ which_window }.`;
  if ( !hasCorrectWindowTarget ) { reports.addToReport(scope, { type: `error`, code: `ALK0082`, value: msg }); }
  expect( hasCorrectWindowTarget, msg ).to.be.true;

  await scope.afterStep(scope);
});

Then(/(?:the )?text(?: in)?(?: the)?(?: JSON)?(?: var)?(?:iable)?(?: )?"([^"]+)" should be/i, async (var_name, expected_value) => {
  /* Check that the text string of the page's JSON var value matches
  *    the given text string. Does not currently accept nested values
  *    like "foo.bar". The word "text" is required.
  *
  * The format for this step is something like this:
  * ```
  * Then the text in the JSON variable "var_name" should be
  * """
  * A single or
  * multiline string
  * """
  * ```
  *
  * Sentence combinations that will work:
  * `the text in the JSON variable "variable_with_text_value" should be`
  * `the text in the JSON var "variable_with_text_value" should be`
  * `the text in "variable_with_text_value" should be`
  * `text var "variable_with_text_value" should be`
  */

  // Get JSON variable value
  let { json_path, json } = await scope.savePageJSONData( scope );
  let actual_value = json.variables[ var_name ];

  // Add warning to report if value is not as expected
  if ( actual_value !== expected_value ) {
    reports.addToReport( scope, {
      type: `error`,
      code: `ALK0083`,
      value: `The variable "${ var_name }" was not equal to the expected `
        + `value on the "${ scope.page_id }" screen. Check `
        + `${ json_path } to see the page's JSON variables.`
    });
  }

  expect( actual_value ).to.equal( expected_value );

});


Then(/I get the(?: page's)?(?: JSON)? var(?:iable)?s and val(?:ue)?s/i, { timeout: -1 }, async () => {
  /** Uses  https://docassemble.org/docs/functions.html#js_get_interview_variables
  *    to get the variable values on the page of the interview and add
  *    them to the report.
  * 
  * Variations:
  * I get the page's JSON variables and values
  * I get the json vars and vals
  * I get the page's vars and vals
  * I get the vars and vals
  */
  return await wrapPromiseWithTimeout(
    scope.steps.add_json_vars_to_report( scope ),
    scope.timeout
  );
});

Then(/I expect the baseline PDF "([^"]+)" and the new PDF "([^"]+)" to be the same/i, async (existing_pdf_path, new_pdf_path) => {
  /** Compare the text or fields of a baseline PDF and the newly downloaded PDF.
  * 
  * Variations:
  * Then I expect the baseline PDF "simple-doc-Baseline.pdf" and the new PDF "simple-doc.pdf" to be the same
  */

  return await wrapPromiseWithTimeout(
    scope.steps.compare_pdfs(scope, {existing_pdf_path, new_pdf_path}),
    scope.timeout
  );
});

//#####################################
//#####################################
// Actions
//#####################################
//#####################################

//#####################################
// Possible navigation
//#####################################

// Consider people wanting to use this for an in-interview page
// Also consider 'the link url "..." should open...'?
Then(/the "([^"]+)" link opens a working page/, { timeout: -1 }, async ( linkText ) => {
  return wrapPromiseWithTimeout(
    scope.steps.link_works( scope, linkText ),
    scope.timeout
  );
});

When(/I tap to continue/i, { timeout: -1 }, async () => {
  // Any selectors for this seem somewhat precarious
  // No data will cause an automatic continue when `ensure_navigation` is true

  // `page` timeout will deal with custom timeout
  // check if the server is reloading
  await scope.setFields( scope, { var_data: [], ensure_navigation: true });
});

When(/I tap the "([^"]+)" tab/i, { timeout: -1 }, async ( tabId ) => {
  // `page` timeout will deal with custom timeout
  await scope.tapTab( scope, tabId );
});

When(/I tap the "([^"]+)" element(?: and go to (?:a new|the next) page)?$/i, { timeout: -1 }, async ( elemSelector ) => {
  // `page` timeout will deal with custom timeout
  await scope.tapSelectorToNavigate( scope, elemSelector, 2000 );
});

When(/I tap the "([^"]+)" element and stay(?: on the same page)?$/i, { timeout: -1 }, async ( selector ) => {
  // `page` timeout will deal with custom timeout
  await scope.tapSelectorAndStay( scope, { selector });
});

When(/I tap the "([^"]+)" element and wait (?:for )?([0-9]+) second(?:s)?/i, { timeout: -1 }, async ( elemSelector, waitTime ) => {
  // TODO: Why is it the developer can't just wait after the step?
  // Also, this is always supposed to navigate, and that handles its own waiting.

  // `page` timeout will deal with custom timeout
  await scope.tapSelectorToNavigate( scope, elemSelector, waitTime * 1000 )
});

When(/I check the page for (?:accessibility|a11y) issues/i, {timeout: -1}, async () => {
  let { passed, axe_filepath } = await wrapPromiseWithTimeout(
    scope.checkForA11y(scope),
    scope.timeout
  )

  let msg = `Found potential accessibility issues on the "${ scope.page_id }" screen. Details in ${ axe_filepath }.`;
  if ( !passed ) {
    reports.addToReport( scope, { type: `error`, code: `ALK0084`, value: msg });
  }
  expect( passed, msg ).to.be.true;
});

When(/I check all pages for (?:accessibility|a11y) issues/i, {timeout: -1}, async () => {
  scope.check_all_for_a11y = true;
  scope.passed_all_for_a11y = true;
});

//#####################################
// UI element interaction
//#####################################

// -------------------------------------
// --- RANDOM INPUT ---
When(/I answer randomly for at most ([0-9]+) (?:page(?:s)?|screen(?:s)?)/, { timeout: -1 }, async ( max_pages_str ) => {
  /** Give random answers until the user can't continue any more.
  * 
  * Variations:
  * I answer randomly for at most 1 page
  * I answer randomly for at most 10 pages
  * I answer randomly for at most 101 screens
  */
  // Give each screenshots folder a time-stamped name in case the dev gets clever
  // and use the same Scenario to run multiple randomized tests.
  let timestamp = Date.now();
  let random_input_path = `${ scope.paths.scenario }/random${ timestamp }`
  scope.paths.random_screenshots = random_input_path;
  fs.mkdirSync( scope.paths.random_screenshots );
  reports.addToReport( scope, {
    type: 'row info',
    code: `ALK0085`,
    value: `Testing interview with random input (in ${ random_input_path })`
  });

  // Force the dev to prevent infinite loops
  let max_pages = parseInt( max_pages_str );
  let curr_page_num = 0;

  // While a continue-type button is on the current page, fill out
  // the fields and then try to continue
  let buttons_exist = true;
  while ( buttons_exist && curr_page_num < max_pages ) {

    curr_page_num = curr_page_num + 1;
    let { id } = await scope.examinePageID( scope, `no target id` );

    let no_content_err = `The interview seemed to run into an error page`
      + ` after the page with the question id "${ id }".`
      + ` See the picture of the page in "${ random_input_path }".`;

    let has_thrown = false;
    // Ensure no infinite loop, but each page has a full timeout to run
    let custom_timeout = new Promise(async function( resolve, reject ) {

      // Set up timeout to stop infinite loops
      let page_timeout_id = setTimeout(async function() {

        // Make sure to only throw once
        if ( has_thrown ) { return; }
        else { has_thrown = true; }

        if (!( await scope.is_on_server_still(scope))) {
          await scope.page.goBack();
          resolve();
        }

        let has_content = await scope.has_interview_content( scope );

        if ( !has_content ) {
          reports.addToReport( scope, {
            type: `error`,
            code: `ALK0086`,
            value: no_content_err
          });
          reject( no_content_err );

        } else {
          let timeout_message = `The page with an id of "${ id }" took too long`
            + ` to fill with random answers (over ${ scope.timeout/1000/60 } min).`
          reports.addToReport( scope, { type: `error`, code: `ALK0087`, value: timeout_message });
          reject( timeout_message );
        }

      }, scope.timeout );

      // self-invoke an anonymous async function so we don't have to
      // abstract the details of resolving and rejecting.
      (async function() {
        try {

          // Set all the fields on the page
          let buttons = await scope.steps.set_random_page_vars( scope );

          // Take a screenshot of the page before continuing or ending
          let short_id = `${ id }`.substring(0, 20);
          let path = `${ scope.paths.random_screenshots }/random-${ short_id }${ Date.now() }.jpg`;
          await scope.take_a_screenshot( scope, { path: path });

          // Prep for the next loop to possibly stop. Signature page buttons
          // don't count as buttons in the way our field detects them
          buttons_exist = buttons.length > 0;
          // If there were any buttons, pick a random one to try to press
          if ( buttons_exist ) {
            await scope.set_random_input_for.buttons( scope, { fields: buttons });
          } else {
            // If can theoretically continue, try to. Also prep to
            // stop or continue for the next loop
            buttons_exist = await scope.continue_exists( scope );
            if ( buttons_exist ) {
              await scope.continue( scope );
            }  // ends if continue exists
          }  // ends if buttons_exist
          if (!( await scope.is_on_server_still(scope))) {
            await scope.page.goBack();
            resolve();
          }

          let has_content = await scope.has_interview_content( scope );
          if ( !has_content ) {

            // Throw an error if there's no interview content
            // Make sure to only throw once
            if ( !has_thrown ) {
              has_thrown = true;
              reports.addToReport( scope, {
                type: `error`,
                code: `ALK0088`,
                value: no_content_err
              });
              reject( no_content_err );
            }

          }  // ends if !has_content

          if ( buttons_exist ) {
            process.stdout.write(`\x1b[36m${ 'v' }\x1b[0m`);  // pressed button
          }

          resolve();

        } catch ( error ) {

          // Make sure to only throw once
          if ( has_thrown ) { return; }
          else { has_thrown = true; }

          if (!( await scope.is_on_server_still(scope))) {
            await scope.page.goBack();
            resolve();
          }

          // Throw a specific error if there's no interview content
          let has_content = await scope.has_interview_content( scope );
          if ( !has_content ) {
            reports.addToReport( scope, {
              type: `error`,
              code: `ALK0089`,
              value: no_content_err
            });
            reject( no_content_err );

          // Otherwise throw a generic error
          } else {
            let err_msg = `The page with the question id "${ id }" errored when trying to fill`
              + ` it with random answers: ${ error.name }`
            reports.addToReport( scope, { type: `error`, code: `ALK0090`, value: err_msg });
            reject( error );
          }  // ends if !has_content

        } finally {
          // prevent temporary hang at end of tests
          clearTimeout( page_timeout_id );
        }
      })();

    });  // ends custom_timeout for set_random_page_vars

    await custom_timeout;

  }  // ends while continue_exists


});  // Ends random input

// -------------------------------------
// --- VARIABLES-BASED STEPS ---

When(/I set the var(?:iable)? "([^"]+)" to "([^"]+)"/, { timeout: -1 }, async ( var_name, answer ) => {
  /* Set a non-story table variable (with or without a choice associated with it) to a value. Set:
  *  - Buttons associated with variables
  *  - Dropdowns
  *  - Checkboxes (multiple choice checkboxes must be set to "true" or "false")
  *  - Radio buttons
  *  - Text inputs
  *  - Textareas
  *
  * Variations:
  * 1. I set the var "benefits['SSI']" to "false"
  * 1. I set the variable "rent_interval" to "weekly"
  */
  // `page` timeout will deal with custom timeout
  await scope.steps.set_regular_var( scope, var_name, answer )

});

When(/I set the var(?:iable)? "([^"]+)" to ?(?:the)? ?(?:GitHub)? secret "([^"]+)"/i, { timeout: -1 }, async ( var_name, set_to_env_name ) => {
  /* Set a non-story table variable to a secrete value. Same as the above, but reads the value from `process.env` */
  // This could theoretically tap an element, so
  // `page` timeout will deal with custom timeout
  await scope.steps.set_secret_var( scope, var_name, set_to_env_name )
});


Then(/I upload "([^"]+)" to "([^"]+)"/, { timeout: -1 }, async ( filenames, var_name ) => {
  /* Uploads file (docx, jpg, etc) in same folder to input var. Can actually use
  * 'I set the var "" to ""', but this is more explicit if it's desired. */
  return wrapPromiseWithTimeout(
    scope.steps.set_regular_var( scope, var_name, filenames ),
    scope.timeout
  );
});


// -------------------------------------
// --- OTHER UI STEPS ---

When('I tap the defined text link {string}', { timeout: -1 }, async ( phrase ) => {
  /** Tap a link that doesn't navigate. Depends on the language of the text. */
  // `page` timeout will deal with custom timeout
  await scope.steps.tap_term( scope, phrase );
});

Then(/^I sign$/, { timeout: -1 }, async () => {
  return wrapPromiseWithTimeout(
    scope.steps.sign( scope ),
    scope.timeout
  );
});

Then('I sign with the name {string}', { timeout: -1 }, async ( name ) => {
  /* Signs with the string argument */
  return wrapPromiseWithTimeout(
    scope.steps.sign( scope, name ),
    scope.timeout
  );
});

When(/I download "([^"]+)"$/, { timeout: -1 }, async ( filename ) => {
  /* Taps the link that leads to the given filename to trigger downloading.
  *    and waits till the file has been downloaded before allowing the tests to continue.
  *    WARNING: Cannot download the same file twice in a single scenario.
  *    WARNING: Must not contain any characters that are totally unique to that
  *    page load. Just stick to the name of the file.
  */
  // TODO:
  // This should be using `scope.tapElementAndStayOnPage()`? When someone clicks on a link to
  // download a document, it sends a request to the server, which could be reloading
  return wrapPromiseWithTimeout(
    scope.steps.download( scope, filename ),
    scope.timeout
  );
});

//#####################################
//#####################################
// Macros
//#####################################
//#####################################

When(/I set the name of ?(?:the var(?:iable)?)? "([^"]+)" to "([^"]+)"/, { timeout: -1 }, async (var_base, name_str) => {
  /* Given a variable name and a space-separated string, fills the
  *    appropriate fields on an Assembly Line name question.
  *    It handles any of:
  *    1. A one-word value to set name.text (ex: 'LandlordEtAl')
  *    1. An Individual's name that it will set based on the number of words:
  *       1. Two words - a first and last name (ex: "Tal Taylor")
  *       1. Three words - a first, middle, and last name (ex: "Tal Tay Taylor")
  *       1. Four words - a first, middle, last, and suffix (ex: "Tal Tay Taylor III")
  *
  * The string 'the var'/'the variable' part of the step is optional, as you can see below.
  *
  * Examples:
  * 1. I set the name of "user" to "Uli Uster"
  * 1. I set the name of the var "defendant" to "Dalia Day Defo Jr"
  * 1. I set the name of the variable "defendant" to "Dalia Day Defo Jr"
  */
  return wrapPromiseWithTimeout(
    scope.steps.set_al_name( scope, var_base, name_str ),
    scope.timeout
  );
});


When(/I set the address of ?(?:the var(?:iable)?)? "([^"]+)" to "([^"]+)"/, { timeout: -1 }, async (var_base, address_str) => {
  /* Given a variable name and a four-part address formatted as below,
  *    sets the appropriate Assembly Line address fields.
  *
  * The string 'the var'/'the variable' part of the step is optional, as you can see below.
  *
  * Examples:
  * 1. When I set the address of "users[0]" to "112 Southampton St., Unit 1, Boston, MA 02118"
  * 1. When I set the address of the variable "users[0]" to "112 Southampton St., Unit 1, Boston, MA 02118"
  * 1. When I set the address of the var "users[0]" to "112 Southampton St., Unit 1, Boston, MA 02118"
  */
  return wrapPromiseWithTimeout(
    scope.steps.set_al_address( scope, var_base, address_str ),
    scope.timeout
  );
});

// Next macro - download sequence?



//#####################################
//#####################################
// Framework Development
//#####################################
//#####################################
// TODO: Add Step for testing final report

Given(/the Scenario report should include/i, async ( report_text ) => {
  /* WARNING: If a Step will fail, this Step must come first.
  * 
  * Prepare to test that the report for a Scenario includes the given text.
  * The actual test has to be done at the end of the Scenario as some text
  * may be added to the report there. */
  if ( !scope.expected_in_report ) {
    scope.expected_in_report = [];
  }
  scope.expected_in_report.push( report_text );

});

Given(/the Scenario report should not include/i, async ( report_text ) => {
  /* WARNING: If a Step will fail, this Step must come first.
  * 
  * Prepare to test that the Scenario report does not include `report_text`.
  * The actual test has to be done at the end of the Scenario as some text
  * may be added to the report there. */
  if ( !scope.expected_not_in_report ) {
    scope.expected_not_in_report = [];
  }
  scope.expected_not_in_report.push( report_text );

});

Given(/the final Scenario status should be "([^"]+)"/i, async ( expected_status ) => {
  /** WARNING: If a Step will fail, this Step must come first.
  * 
  * Prepare to test that the Scenario completes with the correct status. */
  scope.expected_status = expected_status.toUpperCase();
});

Then(/of two interviews, I delete one __internal__/i, async () => {
  /** Test that an interview does get successfully deleted. This tests whether
   *    the API code is working correctly.
   */
  // Make sure we have two interviews in `scope.scenario.interviews` (two session ids)
  let interviews = scope.scenarios.get( scope.scenario_id ).interviews;
  let interview_keys = Object.keys( interviews );
  expect(
    interview_keys.length,
    `Of 2 interview sessions, ALKiln only saved ${ interview_keys.length }`
  ).to.equal( 2 );

  // Check that both interviews exist on the server. 1 √ 2 √
  let api_keys = scope.scenarios.get( scope.scenario_id ).api_keys;
  let visible_interviews = await da_api.get_interviews({ interviews, api_keys });
  let visible_keys = Object.keys( visible_interviews );
  expect(
    visible_keys.length,
    `2 interviews should be on the server. Instead: "${ visible_keys.join(', ') }"`
  ).to.equal( 2 );

  // Delete one. 1 x 2 √
  let to_delete = interviews[ interview_keys[ 0 ]];
  await da_api.quietly_try_to_delete_interviews({
    interviews: { [interview_keys[ 0 ]]: to_delete },
    api_keys
  });

  // Check that only one session exists on the server. This tests that
  // 1. An interview has been deleted and
  // 2. We are fetching interviews correctly because we are getting one
  // back (e.g. not passing null into the api function)
  // 1 x 2 √
  let after_deletion = await da_api.get_interviews({ interviews, api_keys });
  let keys_after_deletion = Object.keys( after_deletion );
  expect(
    keys_after_deletion.length,
    `1 interviews should be on the server: ${ keys_after_deletion.join(', ') }`
  ).to.equal( 1 )
  // In After(), the other session should get deleted
});

Then(/I fail to delete (\d) detected interview(?:s)? and get no error __internal__/i, async ( num ) => {
  /** Test that there is no error when ALKiln is unable to delete an interview. */
  num = parseInt( num );
  // Make sure we started an interview
  let interviews = scope.scenarios.get( scope.scenario_id ).interviews;
  expect(
    Object.keys( interviews ).length,
    `The test should have saved ${ num } interview session(s)`
  ).to.equal( num );

  // There should be no error about an unauthorized user
  let api_keys = scope.scenarios.get( scope.scenario_id ).api_keys;
  let visible_interviews = await da_api.get_interviews({ interviews, api_keys });
  let visible_keys = Object.keys( visible_interviews );
  expect(
    visible_keys.length,
    `User should detect 0 interviews on the server. Instead: "${ visible_keys.join(', ') }"`
  ).to.equal( 0 );

  // Deleting with an anonymous user should fail silently
  await da_api.quietly_try_to_delete_interviews({ interviews, api_keys });
});


//#####################################
//#####################################
// After
//#####################################
//#####################################

After(async function(scenario) {

  // Log errors
  if ( scenario.result.message ) {
    log.debug({ code: `ALK0091`, context: `scenario`, },
      scenario.result.message
    );
  }

  let changeable_test_status = scenario.result.status;
  // The accessibility failures don't happen til the end, so the rest of the test can continue
  if ( scope.check_all_for_a11y && !scope.passed_all_for_a11y) {
    // The fact that the scenario failed has already been noted earlier in the report
    changeable_test_status = `FAILED`;
    reports.addToReport(scope, {
      type: `error`,
      code: `ALK0092`,
      value: `Accessibility standards tests failed. See information above.`
    });
  }

  if ( scope.failed_pdf_compares.length > 0) {
    let msg = scope.failed_pdf_compares.reduce((str, new_msg) => `${ str }\n―――\n${ new_msg }`)
    changeable_test_status = `FAILED`;
    reports.addToReport(scope, {
      type: `error`,
      code: `ALK0093`,
      value: `PDF comparison failed ${ scope.failed_pdf_compares.length } time(s)\n―――\n${ msg }\n―――\n`
    });
  }

  // Record status before internal report tests can interfere with values
  reports.saveFinalScenarioData( scope, { status: changeable_test_status });

  if (changeable_test_status !== `PASSED`) {
    log.debug({ code: `ALK0094`, level: `warn`, },
      `Non-passed status occurred while running test: ${ changeable_test_status }`
    );

    if ( scope.page ) {

      if ( !!scope.disable_error_screenshot ) {
        reports.addToReport(scope, {
          type: `row info`,
          code: `ALK0095`,
          value: `For security, ALKiln will avoid creating a picture of the page for this error. It's possible a secret is being used on this screen.`
        });
      } else {

        // Save/download a picture of the screen that's showing during the unexpected status
        // Save one copy in the outer-most artifact folder
        let scenario_filename = await scope.getSafeScenarioFilename( scope, { prefix: `error_on` });
        let path_outer = `${ scope.paths.artifacts }/${ scenario_filename }.jpg`;
        await scope.take_a_screenshot( scope, { path: path_outer });

        // Save another copy in the artifact's Scenario folder
        let screenshot_name = `error_on`;
        let { id } = await scope.examinePageID( scope, 'none to match' );
        let short_id = `${ id }`.substring(0, 20);
        screenshot_name += `-${ short_id }`;
        let path_scenario = `${ scope.paths.scenario }/${ screenshot_name }.jpg`;
        await scope.take_a_screenshot( scope, { path: path_scenario });

      }  // ends if scope.disable_error_screenshot
    }  // ends if scope.page exists

    // This has to come after the security message or security message doesn't print. Not sure why.
    if (changeable_test_status === `FAILED`) {
      reports.addToReport(scope, { type: `outcome failure info`, code: `ALK0096`, value: `**-- Scenario Failed --**` });
    }

  }  // ends if not passed

  // Add report text to Scenario folder after everything has been added to the report
  let scenario_report_obj = scope.report.get( scope.scenario_id );
  let report = reports.getPrintableScenario( scenario_report_obj );
  // Save the report as in the Scenario folder
  fs.writeFileSync( scope.paths.scenario_report, report );
  // TODO: Save any cucumber failure message for the Scenario here (instead of waiting till run_cucumber.js)

  // ---------------- Check internal test results ----------------

  if ( scope.expected_in_report && scope.expected_in_report.length > 0) {
    let report_includes_all_expected_strings = await scope.reportIncludesAllExpected(
      scope,
      { expected: scope.expected_in_report }
    );
    if ( !report_includes_all_expected_strings ) { changeable_test_status = `FAILED`; }
    // Reset report values no matter what so they don't mess up future scenarios
    scope.expected_in_report = null;
  }

  if (scope.expected_not_in_report && scope.expected_not_in_report.length > 0) {
    let all_prohibited_strings_were_absent = await scope.reportDoesNotInclude(
      scope,
      { not_expected: scope.expected_not_in_report }
    );
    if ( !all_prohibited_strings_were_absent ) { changeable_test_status = `FAILED`;}
    // Reset report values no matter what so they don't mess up future scenarios
    scope.expected_not_in_report = null;
  }

  // ---------------- Ends internal results check ----------------

  if ( scope.expected_status === null ) {
    scope.expected_status = `PASSED`;  // default expected status
  }

  let expected_status_was_met = true;
  let expected_status_err_msg = ``;
  // Avoid manipulating `UNDEFINED` and such
  if ( changeable_test_status === `PASSED`
       || changeable_test_status === `FAILED` ) {

    if ( changeable_test_status === scope.expected_status ) {
      // If the status was as expected, pass this Scenario. E.g. an internal
      // test was supposed to fail and it did. Or a test was suppose to pass
      // and it passed.
      changeable_test_status = `PASSED`;
    } else {
      // If a test that was supposed to fail passed (e.g. internal
      // test), it failed. If is was supposed to pass and failed, it also
      // failed. E.g. a11y failures let the Scenario pass initially, but
      // should cause a failure here.
      changeable_test_status = `FAILED`;
      // Flag this failure to trigger an error later, so cucumber shows
      // it as failed too.
      expected_status_was_met = false;
      // Keep it general. Users may see this message, e.g. for a11y tests.
      let msg = `Test ${ changeable_test_status }. `
          + `Expected status: ${scope.expected_status}. `
          + `See the report for details.`;
      let code = `ALK0099`;
      expected_status_err_msg = log.debug({ code: code, level: `error`, },
        msg
      );
      // Temp for debugging new log output
      expect( expected_status_err_msg ).to.equal(`🤕 ${ code } ERROR: ${ msg }`);
    }
  }
  scope.expected_status = null;  // reset for next Scenario

  let need_to_force_failed_status = false;
  let force_failure_msg = `ALKiln assessed that the test failed. See the report for details.`;
  let force_failure_code = `ALK0180`;
  if ( changeable_test_status !== `FAILED` ) {
    // Other than `FAILED`, it's fine to set the scenario status to make
    // sure it matches up with ALKiln's assessed status.
    // WARNING: This may be impossible in future cucumber versions
    scenario.result.status = changeable_test_status;
    // TODO: Should we add (an info) debug log here too?

  // If assessed status is FAILED, but result.status is something else
  } else if ( scenario.result.status !== `FAILED` ) {
    // Make sure that tests which ALKiln has calculated as failed
    // cause a cucumber error later. Just changing the status to `FAILED`
    // causes unhelpful cucumber errors. TODO: Add to internal docs.
    // TODO: Should we move this to where the error is thrown?
    log.debug({ code: force_failure_code, level: `error`, },
      force_failure_msg
    );
    // TODO: Look into setDefinitionFunctionWrapper to catch errors
    // of failing tests that should indeed be failing:
    // https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#setdefinitionfunctionwrapperwrapper
    need_to_force_failed_status = true;
  }

  let signout_succeeded = true;
  let signout_error_msg = ``;
  // If there is a page open, then sign out and close it
  if ( scope.page ) {
    // Catch a possible reload error.
    try {
      // puppeteer will ensure proper timeout.
      await scope.page.goto(`${ session_vars.get_da_server_url() }/user/sign-out`, {waitUntil: `domcontentloaded`});

    } catch ( error ) {
      signout_succeeded = false;

      if ( error.name === `TimeoutError` ) {
        // TODO: Should a more specific message about signing out get into the report no matter what?
        // If so, what should the message be in order to not get confused with these other messages?
        let non_reload_report_msg = `It took too long to sign out in preparation for the next test.`;
        let code = `ALK0097`;
        try {
          await scope.handle_page_timeout_error( scope, { non_reload_report_data: {
            code: code,
            message: non_reload_report_msg,
          }, error });
        } catch ( error ) {
          signout_error_msg = `🤕 ${ code } ERROR: ${ non_reload_report_msg }`;
        }
      } else {
        // Throw any non-timeout error
        let other_err_msg = `Error occurred when ALKiln tried to sign out in preparation for the next test.`
        let code = `ALK0098`;
        reports.addToReport( scope, { type: `error`, code: code, value: other_err_msg });
        signout_error_msg = `🤕 ${ code } ERROR: ${ other_err_msg }`;
      }  // ends if error is timeout error

    }  // ends try/catch

  }  // ends if scope.page

  // Now that we're no longer on the interview page, one way or
  // another, try to delete the interviews created during the test
  // Authors running this manually get to choose what to do with
  // the interviews they're creating unless we hear otherwise.
  if ( session_vars.get_origin() !== `playground` ) {
    try {
      let interviews = scope.scenarios.get( scope.scenario_id ).interviews;
      let api_keys = scope.scenarios.get( scope.scenario_id ).api_keys;
      await da_api.quietly_try_to_delete_interviews({ interviews, api_keys });
      let visible_interviews = await da_api.get_interviews({ interviews, api_keys });
      let visible_keys = Object.keys( visible_interviews );
      // Deleting interviews is nice, but not non-critical. Don't bother the
      // user with it. Don't want to cover up a more meaningful failure (like
      // going to the wrong file). If it becomes a problem we can track it down later.
      if ( visible_keys.length > 0 ) {
        // Can an API key ever see an interview that it can't delete?
        log.debug({ code: `ALK0197`, context: `internal`, level: `warn`, }
          `The API key can see ${ visible_keys.length } interviews that were not deleted:`,
          visible_keys
        );
      }
    } catch ( error ) {
      // Deleting interviews is nice, but not non-critical. Don't bother the
      // user with it. Don't want to cover up a more meaningful failure (like
      // going to the wrong file). Example of OK failure: the user owns the
      // interview is different than the API key that's trying to delete the
      // interview. If it becomes a problem we can track it down later.
      // Consider add "internal" to docs: "If you see this, make an
      // issue in ALKiln with your debug/verbose log"
      log.debug({ code: `ALK0198`, context: `internal`, level: `warn`, error },
        `Cleaning up interviews incomplete, but unimportant.`
      );
    }
  }

  // Collect all the relevant special errors
  let internal_errors = []
  if ( !expected_status_was_met ) { internal_errors.push( expected_status_err_msg ); }
  if ( !signout_succeeded ) { internal_errors.push( signout_error_msg ); }

  // Theoretically, we should never get here:
  // If everything else worked, if we need to force an internal test failure
  if ( need_to_force_failed_status ) {
    if ( internal_errors.length > 0 ) {
      // Handle all the accumulated errors
      throw new Error( `${internal_errors.join( internal_errors, '\n')}` );
    }
    throw new Error( `🤕 ${ force_failure_code } unreachable ERROR: ${ force_failure_msg }` );

  } else if ( internal_errors.length > 0 ) {
    log.debug({ code: `ALK0203`, context: `internal`, level: `warn`, },
      `There was no need to force failed status and yet there are error messages.`,
      internal_errors
    );
  }

  // Find the race condition.
  log.debug({ code: `ALK0100`, context: `scenario`, },
    `Scenario AfterStep() message:`, scenario.result.message
  );

});

AfterAll(async function() {
  // Stop collecting server response statuses
  scope.stop_tracking_server_status = true;

  let report = reports.getPrintableReport( scope );
  // Log the report. Can't get this.attach() or this.log() to work in `After()` or here.
  // May need newest version of cucumberjs
  console.log( `\n\n${ report }` );

  // If there is a browser open, then close it
  if (scope.browser) {
    await scope.browser.close();
  }
});