const { When, Then, And, Given, After, Before, BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const puppeteer = require('puppeteer');

const scope = require('./scope');
const env_vars = require('./utils/env_vars');

/* Of Note:
- We're using `*=` because sometimes da text has funny characters in it that are hard to anticipate
*/

require("dotenv").config();  // Where did this go?

/* TODO:
1. 'choice' to be any kind of choice - radio, checkbox,
    dropdown, etc. Have to research the different DOM for each
1. 'choice' to have a more specific way to access each item. For
    example, for a list collect or other things that have multiple
    things with the same text on the page.
1. Figure out how to test allowing felxibility for coder. For example:
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

// Hoping that most load and download times will be under 30 seconds.
// TODO: Check what average load and download times are in our current interviews.
setDefaultTimeout( 30 * 1000 );

let click_with = {
  mobile: 'tap',
  pc: 'click',
};

BeforeAll(async () => {
  scope.timeout = 30 * 1000;
  scope.showif_timeout = 600;
  scope.report = new Map();
});

Before(async (scenario) => {
  if ( env_vars.DEBUG ) { console.log( scenario.pickle.name ); }
  // Names for files and reports
  // TODO: Allow scenario ids to have digits in their name
  let scenario_name = scenario.pickle.name.replace(/(\P{L})+/gu, '_'); // allow more languages
  let tags = ''
  for ( let tag of scenario.pickle.tags ) {
    tags += tag.name.replace(/[^A-Za-z0-9]+/g, '_').replace(/(\P{L})+/gu, '_');
  }
  // With tag names automatically added to langauges, this should work to make
  // each language unique.
  let new_id = `${ scenario_name }${ tags }`

  // Should we add a counter? It would have to be unique to each scenario name.
  // Not sure of another good way to indicate the _name_ is a duplicate
  while ( scope.report.get( new_id ) !== undefined  ) {
    new_id += '_';
  }
  scope.scenario_id = new_id;
  await scope.addToReport( scope, { type: `heading`, value: `\n---------------\nScenario: ${ new_id.replace(/_/g, ` `) }\n---------------` });

  // Downloads
  scope.downloadComplete = false;
  scope.toDownload = '';
  // Device interaction
  scope.device = 'pc';
  scope.activate = click_with[ scope.device ];

  scope.page_id = null;

  // Reset default timeout
  scope.timeout = 30 * 1000;
  setDefaultTimeout( 30 * 1000 );
});

// Add a check for an error page before each step? After each step?


//#####################################
//#####################################
// Establishing
//#####################################
//#####################################

Given(/I start the interview at "([^"]+)"(?: in lang "([^"]+)")?/, {timeout: -1}, async (file_name, language) => {  // √
  // NO CUCUMBER TIMEOUT. Handling our own timeouts to deal with initial scenario load.
  // It involves wrapping everything in custom timeouts. See
  // https://github.com/SuffolkLITLab/ALKiln/issues/389#issuecomment-984844240
  let max_load_attempts = 3;
  let num_attempts = 0;
  // First test long load time discussion:
  // https://github.com/SuffolkLITLab/ALKiln/issues/389#issuecomment-984844240
  while ( num_attempts < max_load_attempts ) {

    num_attempts++;
    let timeout_message = `Failed to load "${ file_name }" after ${ num_attempts } tries.` +
      `Each try gave the page ${ scope.timeout/1000 } seconds to load.`;
    
    let loaded = new Promise(async ( resolve, reject ) => {
      // Exit if timeout is exceeded. Reject only if final attempt failed
      let page_timeout = setTimeout(function() {
        if ( num_attempts === max_load_attempts ) { reject( `${ timeout_message } Internal timeout.` ); }
        else { resolve( false ); }  // Give it another shot
      }, scope.timeout);
      // self-invoke an anonymous async function so we don't have to
      // abstract the details of resolving and rejecting.
      (async function() {
        try {
          await scope.load( scope, file_name );
          resolve( true );
        } catch ( err ) {
          // Only fail on final attempt. Actual error should be logged by cucumber output.
          if ( num_attempts === max_load_attempts ) {
            // This may not be the most useful error for us framework developers, but
            // we'll have the rejection error I hope
            await scope.addToReport(scope, { type: `error`, value: timeout_message });
            reject( err );
          } else { resolve( false ); }  // Give it another shot
        } finally {
          clearTimeout( page_timeout );  // prevent temporary hang at end of tests
        }
      })();
    });  // ends loaded promise
    await loaded;
    if ( loaded === true ) { break; }
  }  // ends while attempting to load page
  
  // The page timeout is set in here too in case someone set a custom timeout
  // before a page was loaded.
  // The function itself won't really timeout here, so we don't need to wrap it in
  // a custom timeout
  await scope.page.setDefaultTimeout( scope.timeout );  // overrides outer default timeout

  // Allow developer to save download files
  let custom_download_behavior_timeout = new Promise(async ( resolve, reject ) => {
    let page_timeout = setTimeout(function() {reject( `Took too long to set download behavior.` ); }, scope.timeout);
    // self-invoke an anonymous async function so we don't have to
    // abstract the details of resolving and rejecting.
    (async function() {
      // I've seen stuff take an extra moment or two. Shame to have it everywhere
      try {
        // Interview files should get downloaded to downloads folder
        let docs_dir = await scope.getSafeScenarioFilename( scope, { prefix: `downloads` });
        await scope.page._client.send('Page.setDownloadBehavior', {
          behavior: 'allow',
          downloadPath: path.resolve( docs_dir ),  // Save in root of this project
        });
        resolve();
      } catch ( err ) { reject( err ); }
      // prevent temporary hang at end of tests
      finally { clearTimeout( page_timeout ); }
    })();
  });  // ends custom_download_behavior_timeout
  await custom_download_behavior_timeout;

  // ---- EVENT LISTENERS ----
  // Wait for possible download. From https://stackoverflow.com/a/51423688
  scope.page.on('response', async response => {
    // Note: We can expect that only one file will be getting downloaded
    // at any one time since each step completes synchronously

    // If response has a file in it that matches the file we are downloading
    if ( response._headers['content-disposition'] && (response._headers['content-disposition']).includes(`attachment;filename=${scope.toDownload}`) ) {
      // Remove the event listener since we might not be closing the browser
      scope.page.removeEventListener('response', arguments.callee);

      // Watch event on download folder or file
      await fs.watchFile( docs_dir, function (curr, prev) {
        // If current size eq to size from response then close
        if (parseInt(curr.size) === parseInt(response._headers['content-length'])) {
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


  // TODO: Move language into a different step
  scope.language = language;
  let custom_lang_timeout = new Promise(async ( resolve, reject ) => {
    let page_timeout = setTimeout(function() { reject( `It took to long to try to set the language "${ language }".` ); }, scope.timeout);
    // self-invoke an anonymous async function so we don't have to
    // abstract the details of resolving and rejecting.
    (async function() {
      try {
        await scope.setLanguage( scope, { language });
        resolve();
      } catch ( err ) { reject( err ); }
      // prevent temporary hang at end of tests
      finally { clearTimeout( page_timeout ); }
    })();
  });  // ends custom_lang_timeout
  await custom_lang_timeout;


  let custom_aferStep_timeout = new Promise(async ( resolve, reject ) => {
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
  });  // ends custom_aferStep_timeout
  await custom_aferStep_timeout;
});

// I am using a moble/pc
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
  scope.timeout = parseInt( seconds ) * 1000;
  setDefaultTimeout( scope.timeout );
  // If there is no page yet, we've ensured custom timeout will still be set
  // appropriately in the interview loading step
  if ( scope.page ) { await scope.page.setDefaultTimeout( scope.timeout ); }
});

//#####################################
//#####################################
// Story
//#####################################
//#####################################

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

  let supported_table = await scope.normalizeTable( scope, { var_data: raw_var_data.hashes() });

  let { question_has_id, id, id_matches } = await scope.examinePageID( scope, target_id );
  // Until we reach the final page or hit an error
  while ( !id_matches ) {
    let custom_timeout = new Promise(function( resolve, reject ) {
      // Set up the timeout
      let page_timeout = setTimeout(function() {
        let timeout_message = `The target id was "${ target_id }", but it took too long` +
        ` to try to reach it (over ${ scope.timeout/1000/60 } min). The test got stuck on "${ id }".`
        reject( timeout_message );
      }, scope.timeout);

      // self-invoke an anonymous async function so we don't have to
      // abstract the details of resolving and rejecting.
      (async function() {
        try {
          let { question_has_id, id, id_matches } = await scope.examinePageID( scope );

          // Add special rows. Basically, do weirder things.
          // TODO: Remove from_story_table - no longer needed if only called from in here
          let ensured_var_data = await scope.ensureSpecialRows( scope, {
            var_data: supported_table,
            from_story_table: true,
          });
          // Some errors happen in there to be closer to the relevant code. We'd have to try/catch anyway.
          let error = await scope.setFields(scope, { var_data: ensured_var_data, id, ensure_navigation: true });
          if ( error.was_found ) { await scope.throwPageError( scope, { id: id }); }
          resolve();
        } catch ( err ) {
          reject( err );
        } finally {
          clearTimeout( page_timeout );  // prevent temporary hang at end of tests
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
    row.report_str = `${ await scope.convertToOriginalStoryTableRow(scope, { row_data: row }) }`;
  }
  // Sort into aphabetical order, as is recommended for writing story tables
  let sorted_rows = supported_table.sort( function ( row1, row2 ) {
    if( row1.report_str < row2.report_str ) { return -1; }
    if( row1.report_str > row2.report_str ) { return 1; }
    return 0;
  });

  // Add full used table to report so it can be copied if needed.
  // TODO: Should we/How do we get this in the final scenario report instead of here?
  await scope.addToReport( scope, { type: `note`, value: `\n${ ' '.repeat(2) }Rows that got set:` });
  await scope.addToReport( scope, { type: `step`, value: `${ ' '.repeat(4) }And I get the question id "${ target_id }" with this data:` });
  await scope.addToReport(scope, { type: `row`, value: `${ ' '.repeat(6) }| var | value | trigger |`, });
  let at_least_one_row_was_NOT_used = false;
  for ( let row of sorted_rows ) {
    if ( row.times_used > 0 ) {
      await scope.addToReport(scope, { type: `row`, value: row.report_str, });
    } else {
      at_least_one_row_was_NOT_used = true;
    }
  }

  // Add unused rows if needed
  if ( at_least_one_row_was_NOT_used ) {
    await scope.addToReport( scope, { type: `note`, value: `${ ' '.repeat(2) }Unused rows:` });
    for ( let row of sorted_rows ) {
      if ( row.times_used === 0 ) {
        await scope.addToReport(scope, { type: `row`, value: row.report_str, });
      }
    }
  } else {
    await scope.addToReport(scope, { type: `note`, value: `${ ' '.repeat(2) }All rows were used` });
  }

  await scope.addToReport(scope, { type: `note`, value: `` });
});

//#####################################
//#####################################
// Passive/Observational
//#####################################
//#####################################

// Need to see if it's possible to remove the need for this on most occasions
// I wait 1 second
// I wait .5 seconds
When(/I wait (\d*\.?\d+) seconds?/, async (seconds) => {  // √
  // Should this reset the 'navigated' flag?
  // Shoudl any observational things reset the 'navigated' flag?
  // Maybe the 'navitaged' flag should only be reset just before trying to
  // navigate (after pressing a button)
  await scope.afterStep(scope, {waitForTimeout: (parseFloat(seconds) * 1000)});
});

Then(/I take a screenshot ?(?:named "([^"]+)")?/, async ( name ) => {
  /* Save/download a screenshot. `name` does not have to be unique as
  * the filename will be made unique. */
  name = name || '';
  let safe_path = await scope.getSafeScenarioFilename( scope, { prefix: `screenshot_${ name }` });
  await scope.page.screenshot({ path: `./${ safe_path }.jpg`, type: 'jpeg', fullPage: true });
  await scope.afterStep(scope);
});

/* Here to make writing tests more comfortable. */
When("I do nothing", async () => { await scope.afterStep(scope); });  // √

Then('the question id should be {string}', async (question_id) => {  // √
  /* Looks for a santized version of the question id as it's written
  *     in the .yml. docassemble's way */
  let { question_has_id, id, id_matches } = await scope.examinePageID( scope, question_id );

  // Trying to make helpful error messages
  let no_id_msg = `Did not find any question id.`;
  if ( !question_has_id ) { await scope.addToReport( scope, { type: `error`, value: no_id_msg }); }
  expect( question_has_id , no_id_msg ).to.be.true;

  let no_match_msg = `The question id was supposed to be "${ question_id }", but it's actually "${ id }".`;
  if ( !id_matches ) { await scope.addToReport( scope, { type: `error`, value: no_match_msg }); }
  expect( id_matches, no_match_msg ).to.be.true;

  await scope.afterStep(scope);
});

// Allow emphasis with capital letters
Then(/I should see the phrase "([^"]+)"/i, async ( phrase ) => {  // √
  /* In Chrome, this `innerText` gets only visible text */
  const bodyText = await scope.page.$eval('body', elem => elem.innerText);

  let msg = `The text "${ phrase }" SHOULD be on this page, but it's NOT.`;
  if ( !bodyText.includes( phrase )) { await scope.addToReport(scope, { type: `error`, value: msg }); }
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
  if ( bodyText.includes( phrase )) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect( bodyText, msg ).not.to.contain( phrase );

  await scope.afterStep(scope);
});

Then('an element should have the id {string}', async ( id ) => {  // √
  const element = await scope.page.$('#' + id);

  let msg = `No element on this page has the ID "${ id }".`;
  if ( !element ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
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

// This is phrase is confusing. It sounds like it's going to at least try to continue.
Then(/I (don't|can't|don’t|can’t|cannot|do not) continue/, async (unused) => {  // √
  /* Tests for detection of url change from button or link tap.
  *    Can other things trigger navigation? Re: other inputs things
  *    like 'Enter' acting like a click is a test for docassemble */
  let msg = `The page should have stopped the user from continuing, but the user was able to continue.`;
  if ( scope.navigated ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect( scope.navigated, msg ).to.be.false;

  await scope.afterStep(scope);
});

Then('I will be told an answer is invalid', async () => {  // √

  let { was_found, error_handlers } = await scope.checkForError( scope );

  let no_error_msg = `No error message was found on the page`;
  if ( !was_found ) { await scope.addToReport(scope, { type: `error`, value: no_error_msg }); }
  expect( was_found, no_error_msg ).to.be.true;

  let was_user_error = error_handlers.complex_user_error !== undefined || error_handlers.simple_user_error !== undefined;
  let not_user_error_msg = `The error was a system error, not an error message to the user. Check the error screenshot.`;
  if ( !was_user_error ) { await scope.addToReport(scope, { type: `error`, value: not_user_error_msg }); }
  expect( was_user_error, not_user_error_msg ).to.be.true;

  await scope.afterStep(scope);
});

Then('I arrive at the next page', async () => {  // √
  /* Tests for detection of url change from button or link tap.
  *    Can other things trigger navigation? Re: other inputs things
  *    like 'Enter' acting like a click is a test for docassemble */
  let msg = `User did not arrive at the next page.`
  if ( !scope.navigated ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect( scope.navigated, msg ).to.be.true;
  await scope.afterStep(scope);
});

// Link observations have the 'Escape' button link in mind
Then('I should see the link {string}', async ( linkText ) => {  // √
  /* Loosley match link visible text. Should probably deprecate this. */
  let [link] = await scope.page.$x(`//a[contains(text(), "${linkText}")]`);

  let msg = `Cannot find a link with the text "${ linkText }".`;
  if ( !link ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect( link, msg ).to.exist;

  await scope.afterStep(scope);
});

Then('I should see the link to {string}', async ( url ) => {  // √
  /* Strictly match href of link. */
  let link = await scope.page.$(`*[href="${ url }"]`);

  let msg = `Cannot find a link to "${ url }".`;
  if ( !link ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect(link, msg ).to.exist;
  
  await scope.afterStep(scope);
});

Then(/the "([^"]+)" link leads to "([^"]+)"/, async (linkText, expected_url) => {  // √
  /* Find link by its visible text and where it leads. */
  let [link] = await scope.page.$x(`//a[contains(text(), "${linkText}")]`);
  // TODO: Possibly add a check here for the link text, though note this
  // Step is not currently supported.
  
  let prop_obj = await link.getProperty('href');
  let actual_url = await prop_obj.jsonValue();

  let msg = `Cannot find a link with the text "${ linkText }" leading to ${ expected_url }.`;
  if ( actual_url !== expected_url ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect( actual_url ).to.equal( expected_url );

  await scope.afterStep(scope);
});

Then(/the "([^"]+)" link opens in (a new window|the same window)/, async (linkText, which_window) => {  // √
  let [link] = await scope.page.$x(`//a[contains(text(), "${linkText}")]`);

  let prop_obj = await link.getProperty('target');
  let target = await await prop_obj.jsonValue();

  let should_open_a_new_window = which_window === 'a new window';
  let opens_a_new_window = target === '_blank';
  let hasCorrectWindowTarget =
    ( should_open_a_new_window && opens_a_new_window )
    || ( !should_open_a_new_window && !opens_a_new_window );

  let msg = `The link "${ linkText }" does NOT open in ${ which_window }.`;
  if ( !hasCorrectWindowTarget ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect( hasCorrectWindowTarget, msg ).to.be.true;

  await scope.afterStep(scope);
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
Then(/the "([^"]+)" link opens a working page/, async (linkText) => {  // √
  let [link] = await scope.page.$x(`//a[contains(text(), "${linkText}")]`);
  let prop_obj = await link.getProperty('href');
  let actual_url = await prop_obj.jsonValue();

  let linkPage = await scope.browser.newPage();
  let response = await linkPage.goto(actual_url, {waitUntil: 'domcontentloaded'});

  let msg = `The "${ linkText }" link is broken.`;
  if ( !response.ok() ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect( response.ok(), msg ).to.be.true;

  linkPage.close()

  await scope.afterStep(scope);
});

When('I tap to continue', async () => {
  // Any selectors for this seem somewhat precarious
  // No data will cause an automatic continue when `ensure_navigation` is true
  await scope.setFields( scope, { var_data: [], ensure_navigation: true });
});


//#####################################
// UI element interaction
//#####################################

// -------------------------------------
// --- VARIABLES-BASED STEPS ---

When(/I set the var(?:iable)? "([^"]+)" to "([^"]+)"/, async ( var_name, set_to ) => {
  /* Set any variable (with or without a choice associated with it) to a value. Set:
  *  - Buttons associated with variables
  *  - Dropdowns
  *  - Checkboxes (multiple choice checkboxes must be set to "true" or "false")
  *  - Radio buttons
  *  - Text inputs
  *  - Textareas
  *
  * Examples:
  * 1. I set the var "benefits['SSI']" to "false"
  * 1. I set the var "rent_interval" to "weekly"
  */
  let var_data = await scope.normalizeTable( scope, {
    var_data: [{ var: var_name, value: set_to, trigger: '' }],
  });
  // Don't continue if the variable doesn't navigate and if this variable cannot be set
  // on this page, trigger an error
  await scope.setFields( scope, { var_data, ensure_navigation: false, ensure_all_vars_used: true });
});

Then(/I upload "([^"]+)" to "([^"]+)"/, async ( filenames, var_name ) => {
  /* Uploads sibling file (docx, jpg, etc) to input var. Can actually use
  * 'I set the var "" to ""', but this is more explicit if it's desired. */
  let var_data = await scope.normalizeTable( scope, {
    var_data: [{ var: var_name, value: filenames, trigger: '' }],
  });
  // Don't continue if the variable doesn't navigate and if this variable cannot be set
  // on this page, trigger an error
  await scope.setFields( scope, { var_data, ensure_navigation: false, ensure_all_vars_used: true });
});


// -------------------------------------
// --- OTHER UI STEPS ---

When('I tap the defined text link {string}', async (phrase) => {  // hold
  /* Not sure what 'defined' means here. Maybe for terms? */
  const [link] = await scope.page.$x(`//a[contains(text(), "${phrase}")]`);

  let msg = `The term "${ phrase }" seems to be missing.`;
  if ( !link ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect( link, msg ).to.exist;

  await link.evaluate( elem => { return elem.click(); });

  await scope.afterStep(scope, {waitForShowIf: true});
});

Then('I sign', async () => {
  await scope.sign( scope );
  await scope.afterStep(scope);
});

When(/I download "([^"]+)"$/, async (filename) => {
  /* Taps the link that leads to the given filename to trigger downloading.
  * and waits till the file has been downloaded before allowing the tests to continue.
  WARNING: Cannot download the same file twice in a single scenario. */
  let [elem] = await scope.page.$x(`//a[contains(@href, "${ filename }")]`);

  let msg = `"${ filename }" seems to be missing. Cannot find a link to that document.`;
  if ( !elem ) { await scope.addToReport(scope, { type: `error`, value: msg }); }
  expect( elem, msg ).to.exist;

  scope.toDownload = filename;
  await elem.evaluate( elem => { return elem.click(); });
  await scope.detectDownloadComplete( scope );
});

//#####################################
//#####################################
// Macros
//#####################################
//#####################################

When(/I set the name of ?(?:the var(?:iable)?)? "([^"]+)" to "([^"]+)"/, async (var_base, name_str) => {
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
  let name_patterns = [
    [ `text` ],
    [ `first`, `last` ],
    [ `first`, `middle`, `last` ],
    [ `first`, `middle`, `last`, `suffix` ],
  ];

  let name_parts = name_str.split(' ');
  let desired_pattern = name_patterns[( name_parts.length - 1 )];

  for ( let parti = 0; parti < name_parts.length; parti++ ) {
    let var_name = `${ var_base }.name.${ desired_pattern[ parti ] }`
    let value = name_parts[ parti ];
    await scope.setVar( scope, var_name, value );
  }

  // Continue to next page...?
  await scope.afterStep(scope, {waitForShowIf: true});
});


When(/I set the address of ?(?:the var(?:iable)?)? "([^"]+)" to "([^"]+)"/, async (var_base, address_str) => {
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

Given(/the final Scenario status should be "(passed|failed)"/i, async ( expected_status ) => {
  /* WARNING: If a Step will fail, this Step must come first.
  * 
  * Prepare to test that the Scenario completes with the correct status. */
  scope.expected_status = expected_status;
});


//#####################################
//#####################################
// After
//#####################################
//#####################################

After(async function(scenario) {

  // Record status before internal report tests can interfere with values
  await scope.setReportScenarioStatus( scope, { status: scenario.result.status });

  if (scenario.result.status !== `passed`) {
    if ( env_vars.DEBUG ) {
      // When debugging locally, pause to allow dev to examine the page
      console.log( `Error occurred while running test` );
      await scope.page.waitFor( 60 * 1000 );
    }

    await scope.addToReport(scope, { type: `outcome`, value: `**-- Scenario Failed --**` });
    // Save/download a picture of the screen during the error
    let safe_filename = await scope.getSafeScenarioFilename( scope, { prefix: `error` });
    await scope.page.screenshot({ path: `${ safe_filename }.jpg`, type: `jpeg`, fullPage: true });

  }

  let original_scenario_status = scenario.result.status;

  // Internal tests of this framework
  if ( scope.expected_status ) {
    let expected = scope.expected_status;
    scope.expected_status = null;  // reset for next Scenario
    expect( scenario.result.status ).to.equal( expected );
  }
  if ( scope.expected_in_report ) {
    let expected = scope.expected_in_report;
    // Reset report values no matter what so they don't mess up future scenarios
    // Maybe this should be in `Before`, but it would be so out of context there...
    scope.expected_in_report = [];
    let all_were_included = await scope.reportIncludesAllExpected( scope, { expected });
    if ( all_were_included ) { scenario.result.status = `passed`; }
  }

  // If there is a page open, then sign out and close it
  if ( scope.page ) {
    // Make sure the new interview really starts fresh. Sometimes insufficient.
    // Also, often is a failure point.
    // Consider, instead, catching the reload error for a bad restart and just
    // re-trying at that point.
    try {
      await scope.page.goto(`${ env_vars.BASE_URL }/user/sign-out`, {waitUntil: `domcontentloaded`});  
    } catch ( err ) {
      await scope.addToReport(scope, {
          type: `warning`,
          value: `Trying to reset for the next test a second time because the first time failed.`
        });
      try {
        await scope.page.goto(`${ env_vars.BASE_URL }/user/sign-out`, {waitUntil: `domcontentloaded`});  
      } catch ( err ) {
        await scope.addToReport(scope, {
          type: `warning`,
          value: `This test ${ original_scenario_status }, but also there was an error while trying to reset for the next test. Re-running until you don't get this error would probably be a good idea.`
        });
      }
    }
    
    await scope.page.close();
    scope.page = null;
  }
});

AfterAll(async function() {
  let report = await scope.getPrintableReport( scope );
  // Log the report. Can't get this.attach() or this.log() to work in `After()` or here.
  // May need newest version of cucumberjs
  console.log( `\n\n${ report }` );

  // Save/download the report as an artifact
  fs.writeFileSync( `alkiln_report_${ Date.now() }.txt`, report );

  // If there is a browser open, then close it
  if (scope.browser) {
    await scope.browser.close();
  }
});
