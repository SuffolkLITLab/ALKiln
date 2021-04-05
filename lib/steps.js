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

setDefaultTimeout( 120 * 1000 );

const base_url = env_vars.BASE_INTERVIEW_URL;

let click_with = {
  mobile: 'tap',
  pc: 'click',
};

BeforeAll(async () => {
  scope.timeout = 120 * 1000;
  scope.showif_timeout = 500;
  scope.report = {};
});

Before(async (scenario) => {
  // Names for files and reports
  let scenario_name = scenario.pickle.name.replace(/[^A-Za-z0-9]/gi, '');
  let tags = ''
  for ( let tag of scenario.pickle.tags ) {
    tags += tag.name.replace(/[^A-Za-z0-9]+/g, '_').replace(/(\P{L})+/gu, '_');
  }
  // With tag names automatically added to langauges, this should work to make
  // each language unique.
  let new_id = `_${ scenario_name }${ tags }`

  // Should we add a counter? It would have to be unique to each scenario name.
  // Not sure of another good way to indicate the _name_ is a duplicate
  while ( scope.report[ new_id ] !== undefined  ) {
    new_id += '_';
  }
  scope.safe_id = new_id;

  // Downloads
  scope.downloadComplete = false;
  scope.toDownload = '';
  // Device interaction
  scope.device = 'pc';
  scope.activate = click_with[ scope.device ];
});

// Add a check for an error page before each step? After each step?


//#####################################
//#####################################
// Establishing
//#####################################
//#####################################

Given(/I start the interview at "([^"]+)"(?: in lang "([^"]+)")?/, async (file_name, language) => {  // √
  await scope.load( scope, file_name );

  let { question_has_id, id, id_matches } = await scope.examinePageID( scope, 'none to match' );
  await scope.addToReport(scope, { key: 'ids', value: id });
  
  await scope.page.setDefaultTimeout( scope.timeout );  // overrides outer default timeout
  // Interview files should get downloaded to downloads folder
  scope.docs_dir = `downloads${ scope.safe_id }`;
  await scope.page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: path.resolve( scope.docs_dir ),  // Save in root of this project
  });

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
      await fs.watchFile(scope.docs_dir, function (curr, prev) {
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

  // Tap the language button if given
  let lang_url = null;
  if ( language ) {
    let [lang_link] = await scope.page.$x(`//a[text()="${ language }"]`);
    expect( lang_link, `Could not find the link for the language "${ language }"` ).to.exist;
    await scope.tapElement( scope, lang_link );
  }
  
  // I've seen stuff take an extra moment or two. Shame to have it everywhere
  await scope.afterStep(scope, {waitForTimeout: 200});
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

When(/^the user gets to ?(?:the)?(?: ?question)?(?: id)? "([^"]+)" with this data:?/, {timeout: -1}, async (target_id, raw_var_data) => {
  /* NO TIMEOUT. Must handle timeout ourselves since we can't caluclate it beforehand based
  * on the number of vars. Not sure how this will work:
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
  let count = 0;

  let supported_table = await scope.normalizeTable( scope, { var_data: raw_var_data.hashes()});

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
          // Some errors happen in there to be closer to the relevant code. We'd have to try/catch anyway.
          await scope.processVar(scope, { var_data: supported_table, id });
          resolve();
        } catch (err) {
          reject( err );
        } finally {
          clearTimeout( page_timeout );  // prevent temporary hang at end of tests
        }
      })();
    });  // ends custom_timeout for proccessVar

    await custom_timeout;
    
    // Prep for next loop
    ({ question_has_id, id, id_matches } = await scope.examinePageID( scope, target_id ));

  }  // ends while !id_matches
  // Can anything unsatisfactory get through here?
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
  /* That's not really the whole name, just part of the name, so it can be ignored and unique. */
  if ( !name ) { name = ''; }
  else { name += '_'; }
  await scope.page.screenshot({ path: `./screenshot${ scope.safe_id }_${ name }${ Date.now() }.jpg`, type: 'jpeg', fullPage: true });  // With timestamp name
  await scope.afterStep(scope);
});

/* Here to make writing tests more comfortable. */
When("I do nothing", async () => { await scope.afterStep(scope); });  // √

Then('the question id should be {string}', async (question_id) => {  // √
  /* Looks for a santized version of the question id as it's written
  *     in the .yml. docassemble's way in python:
  *     re.sub(r'[^A-Za-z0-9]+', '-', interview_status.question.id.lower()) */

  let { question_has_id, id, id_matches } = await scope.examinePageID( scope, question_id );

  // let id_as_class = question_id.toLowerCase().replace(/[^A-Za-z0-9]+/g, '-');
  // // `.className` is the node's list of classes as a string, separated by spaces
  // let classes_str = await scope.page.$eval(`body`, function (elem) { return elem.className });
  // let ids_found = classes_str.match(/question-([^ ]+)/);

  // Trying to make helpful error messages
  expect( question_has_id , '~ Did not find any question id ~' ).to.be.true;
  expect( id_matches, `~ This page's actual question id is "${ id }" ~` ).to.be.true;

  await scope.afterStep(scope);
});

// Allow emphasis with capital letters
Then(/I should see the phrase "([^"]+)"/i, async (phrase) => {  // √
  /* In Chrome, this `innerText` gets only visible text */
  const bodyText = await scope.page.$eval('body', elem => elem.innerText);
  expect(bodyText).to.contain(phrase);

  await scope.afterStep(scope);
});

// Allow emphasis with capital letters
Then(/I should not see the phrase "([^"]+)"/i, async (phrase) => {  // √
  /* In Chrome, this `innerText` gets only visible text:
  * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
  * "ignores hidden elements" */
  const bodyText = await scope.page.$eval('body', elem => elem.innerText);
  expect(bodyText).not.to.contain(phrase);

  await scope.afterStep(scope);
});

Then('an element should have the id {string}', async (id) => {  // √
  const element = await scope.page.waitFor('#' + id);
  expect(element).to.exist;

  await scope.afterStep(scope);
});

// TODO:
// Just realized it's much more likely that the group name will be
// repeated than that the choice name will be repeated. Or maybe
// they're both equally likely to be repeated, but writing about the
// ordinal of the group would probably be more comfortable for a human.
// Need to think about this.

let ordinal_regex = '?(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)?';
// Haven't figured out ordinal_regex for group label yet
// Allow "checkbox" and "radio"? Why would they be called the same thing?
// TODO: Remove final pipe in regex
let the_checkbox_is_as_expected = new RegExp(`the ${ ordinal_regex } ?(?:"([^"]+)")? (choice|checkbox|radio)(?: button)? ?(?:in "([^"]+)")? is (checked|unchecked|selected|unselected)`);
Then(the_checkbox_is_as_expected, async (ordinal, label_text, choice_type, group_label_text, expected_status) => {  // √
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
  let roles = [ choice_type ];
  if ( choice_type === 'choice' ) { roles = ['checkbox', 'radio']; }

  let elem = await scope.getSpecifiedChoice(scope, {ordinal, label_text, roles, group_label_text});

  // See if it's checked or not
  let is_checked = await elem.evaluate((elem) => {
    return elem.getAttribute('aria-checked') === 'true';
  });
  let what_it_should_be = expected_status === 'checked' || expected_status === 'selected';
  expect( is_checked ).to.equal( what_it_should_be );

  await scope.afterStep(scope);
});

Then(/I (don't|can't) continue/, async (unused) => {  // √
  /* Tests for detection of url change from button or link tap.
  *    Can other things trigger navigation? Re: other inputs things
  *    like 'Enter' acting like a click is a test for docassemble */
  expect( scope.navigated ).to.be.false;
  await scope.afterStep(scope);
});

Then('I will be told an answer is invalid', async () => {  // √
  let { error_found, error_handlers } = await scope.checkForError( scope );
  expect( error_found, `No error message was found on the page` ).to.be.true;
  let was_user_error = error_handlers.complex_user_error !== undefined || error_handlers.simple_user_error !== undefined;
  expect( was_user_error, `The error was a system error, not an error message to the user. Check the error screenshot` ).to.be.true;

  await scope.afterStep(scope);
});

Then('I arrive at the next page', async () => {  // √
  /* Tests for detection of url change from button or link tap.
  *    Can other things trigger navigation? Re: other inputs things
  *    like 'Enter' acting like a click is a test for docassemble */
  expect( scope.navigated ).to.be.true;
  await scope.afterStep(scope);
});

Then('I should see the link {string}', async (linkText) => {  // √
  let [link] = await scope.page.$x(`//a[contains(text(), "${linkText}")]`);
  expect(link).to.exist;

  await scope.afterStep(scope);
});

// Link observations have the 'Escape' button link in mind
Then(/the "([^"]+)" link leads to "([^"]+)"/, async (linkText, expected_url) => {  // √
  let [link] = await scope.page.$x(`//a[contains(text(), "${linkText}")]`);
  
  let prop_obj = await link.getProperty('href');
  let actual_url = await prop_obj.jsonValue();
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

  expect( hasCorrectWindowTarget ).to.be.true;
  
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
  expect( response.ok() ).to.be.true;
  linkPage.close()
  
  await scope.afterStep(scope);
});

When('I tap to continue', async () => {
  // Any selectors for this seem somewhat precarious
  await scope.continue( scope );
});

// TODO: See if we can/should make `(button|link)` a non-capturing group
When(/I tap the "([^"]+)" (button|link) to download "([^"]+\.[^"]+)"$/, async (phrase, elemType, filename) => {
  /* Taps the button or link and saves the file that is downloaded. */
  let [elem] = await scope.page.$x(`//a//text()[contains(normalize-space(), "${phrase}")]/..`);
  if ( !elem ) { await scope.page.$x(`//button//text()[contains(normalize-space(), "${phrase}")]/..`); }
  expect( elem, `Cannot find the "${ phrase }" ${ elemType }` ).to.exist;

  scope.toDownload = filename;

  await elem[ scope.activate ]();
  await scope.detectDownloadComplete( scope );
});

When(/I download "([^"]+)"$/, async (filename) => {
  /* Taps the link that leads to the given filename to trigger downloading.
  * and waits till the file has been downloaded before allowing the tests to continue. */
  let [elem] = await scope.page.$x(`//a[contains(@href, "${ filename }")]`);
  expect( elem, `Cannot find the 'href' attribute for the file "${ filename }"` ).to.exist;

  scope.toDownload = filename;
  await elem[ scope.activate ]();
  await scope.detectDownloadComplete( scope );
});


When(/I tap the (button|link) "([^"]+)"/, async (elemType, phrase) => {  // √
  /* Taps a button and stores or reacts to what happens:
  *    navigation, validation error, page error, or just a click. */
  let start_url = await scope.page.url()

  // Making this a race would probably be more simple
  let elem;
  if (elemType === 'button') {
    // [elem] = await scope.page.$x(`//button/span[contains(text(), "${phrase}")]`);
    // if ( !elem ) {
      [elem] = await scope.page.$x(`//button//text()[contains(normalize-space(), "${phrase}")]/..`);
      if ( !elem ) {
        // This how we'll handle it for now, but oh boy
        // Possibly look into https://stackoverflow.com/a/56044998/14144258
        [elem] = await scope.page.$x(`//div[contains(@class, "form-actions")]//a//text()[contains(normalize-space(), "${phrase}")]/..`);
      }
    // }
  } else {
    [elem] = await scope.page.$x(`//a//text()[contains(normalize-space(), "${phrase}")]/..`);
  }

  await scope.tapElement( scope, elem );
});

//#####################################
// UI element interaction
//#####################################

// -------------------------------------
// --- VARIABLES-BASED STEPS ---

When(/I set the ?(?:"([^"]+)" choice of)? var(?:iable)? "([^"]+)" to "([^"]+)"/, async ( choice_name, var_name, set_to ) => {
  /* Set any variable (with or without a choice associated with it) to a value. Set:
  *  - Buttons associated with variables
  *  - Dropdowns
  *  - Checkboxes (must be set to "true" or "false")
  *  - Radio buttons
  *  - Text inputs
  *  - Textareas
  *
  * Examples:
  * 1. I set the "tenant" choice of var "user_type" to "false"
  * 1. I set the var "rent_interval" to "weekly"
  */
  let { handle, tag } = await scope.getField( scope, { var_name, choice_name, set_to });

  if ( handle === null ) {
    let err_message = `Cannot find the input with the variable name "${ var_name }"`;
    if ( choice_name ) {
      throw new ReferenceError( `${ err_message } and the value "${ choice_name }"` );
    } else {
      throw new ReferenceError( err_message );
    }
  }

  // Be more flexible with table column (mostly for generated tests)
  if ( !set_to ) { set_to = choice_name; }
  await scope.setField[ tag ]( scope, { handle, set_to });
});


// -------------------------------------
// --- VISIBLE-TEXT-BASED STEPS ---

When('I tap the defined text link {string}', async (phrase) => {  // hold
  /* Not sure what 'defined' means here. Maybe for terms? */
  const [link] = await scope.page.$x(`//a[contains(text(), "${phrase}")]`);
  await link[ scope.activate ]();

  await scope.afterStep(scope, {waitForShowIf: true});
});

// TODO: Develop more specific choice selection
// Then(/the choice with "([^"]+)" of the "([^"]+)" options is (selected|unselected)/,
//   async (choice_label, field_label, expected_status) => {
//     let note = 'This is more annoying to implement even though it would let you get more specific.'
//   }
// );

When(/I tap the option with the text "([^"]+)"/, async (label_text) => {
  /* taps the first element with the label "containing" the "label text".
  *    Very limited. Anything more is a future feature.
  * 
  * May switch to using the below instead - almost same code, but
  *    its text has to match exactly and it turns out taping labels
  *    works for more than one thing.
  */
  let choice = await scope.page.$( `label[aria-label*="${ label_text }"]` );
  await choice[ scope.activate ]();

  await scope.afterStep(scope, {waitForShowIf: true});
});

// 'I choose {string}'? Is this precise enough to avoid dropdown confusion?
// This is also confusing because it could unselect something. I think 'choose' is a bad idea.
// Tapping does require the dev to know what the state of the choice was before, though.
When('I tap the {string} choice', async (label_text) => {
// When('I choose {string}', async (label_text) => {
  /* Taps the first checkbox/radio/thing with a label that contains `label_text`.
  *    Very limited. Anything more is a future feature.
  */
  let choice = await scope.page.$( `label[aria-label*="${ label_text }"]` );
  await choice[ scope.activate ]();

  await scope.afterStep(scope, {waitForShowIf: true});
});

// TODO: Should it be 'containing', or should it be exact? Might be better to be exact.
// TODO: Should we have a test just for the state of MA to be selected? Much easier... Or states in general
// When('I select the {string} option from the {string} choices', async (option_text, label_text) => {
When(/I select "([^"]+)" from the ?(?:"([^"]+)")? dropdown/, async (option_text, label_text) => {
  /* Selects the option containing the text `option_text` in, if specified
  *    the <select> with the label "containing" the `label_text`.
  *    Finding one dropdown out of a bunch is a future feature.
  * 
  * Note: `page.select()` is the only way to tap on an element in a <select>
  */
  // Make sure ajax is finished getting the items in the <select>
  await scope.page.waitForSelector('option');

  let select, select_id;
  if ( label_text ) {
    // The <label> will have the `id` for the <select> we're looking for
    let [label] = await scope.page.$x(`//label[contains(text(), "${label_text}")]`);
    select_id = await scope.page.evaluate(( label ) => {
      return label.getAttribute('for');
    }, label);

    select = await scope.page.$(`#${ select_id }`);
  } else {
    select = await scope.page.$(`select`);
    let prop_handle = await select.getProperty('id');
    select_id = await prop_handle.jsonValue();
  }

  // Get the actual option to pick. Can't use `value` here unfortunately as it doesn't reflect the text
  let option_value = await scope.page.evaluate(( select_elem, option_text ) => {
    let options = select_elem.querySelectorAll( 'option' );
    for ( let option of options ) {
      if ( (option.textContent).includes(option_text) ) { return option.getAttribute('value'); }
    }
    return null;
  }, select, option_text);

  // No other way to tap on an element in a <select>
  await scope.page.select(`#${ select_id }`, option_value);
  
  await scope.afterStep(scope, {waitForShowIf: true});
});

// TODO: Develop more specific choice selection
// Then(/check the "([^"]+)" checkbox in the "([^"]+)" options/,
//   async (choice_label, field_label, expected_status) => {
//     let note = 'This is more annoying to implement even though it would let you get more specific.'
//   }
// );

Then(/I set the ?(?:"([^"]+)")? text field to "([^"]*)"/, async (field_label, value) => {
  /* Clears the matching textfield in the question area and then types in it 
  * Example: I set the text field to "blah"
  * Example: I set the "label" text field to "blah"
  */
   
  let id = await scope.getTextFieldId(scope, field_label);
  await scope.page.$eval(`#${id}`, (el) => { el.value = ''});
  await scope.page.type( `#${id}`, value );
  await scope.afterStep(scope, {waitForShowIf: true});
});

Then('I sign', async () => {
  let { handle } = await scope.getField( scope, { set_to: '/sign' });
  await scope.sign( scope, { handle });
  await scope.afterStep(scope);
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

  // // Continue to next page...?
  // await scope.continue( scope );
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
  let split = address_str.split(/,\s*/);
  let last_parts = (split.pop()).split(/\s+/);
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
// After
//#####################################
//#####################################

After(async function(scenario) {
  if (scenario.result.status !== 'passed') {
    await scope.addToReport(scope, { key: 'ids', value: '~ scenario stopped here ~' });
    await scope.page.screenshot({ path: `error${ scope.safe_id }.jpg`, type: 'jpeg', fullPage: true });
  }

  // // TODO: Add used vars to the report somehow? Shown as a table so devs can
  // // compare more easily and copy/paste. How should this be done when user is
  // // not using a story table?
  // if (scope.used_vars) {
  //   await scope.addToReport(scope, { key: 'ids', value: `Table rows used: ${ JSON.stringify( scope.used_vars )}` });
  //   scope.used_vars = null;
  // }

  // If there is a page open, then close it
  if ( scope.page ) {
    // Make sure the new interview really starts fresh
    await scope.page.goto(`${ env_vars.BASE_URL }/user/sign-out`, {waitUntil: 'domcontentloaded'});
    await scope.page.close();
    scope.page = null;
  }
});

AfterAll(async function() {
  let report = await scope.getPrintableReport( scope );
  // Log the report. Can't get this.attach() or this.log() to work in `After()` or here.
  // May need newest version of cucumberjs
  console.log( `\n\n${ report }` );
  
  // Add the report as an artifact
  fs.writeFileSync( `alkiln_report_${ Date.now() }.txt`, report );

  // If there is a browser open, then close it
  if (scope.browser) {
    await scope.browser.close();
  }
});
