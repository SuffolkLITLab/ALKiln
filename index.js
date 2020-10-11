// require('./steps/index.js');
// require('./steps/steps.js');
let scope = require('./support/scope.js');
// require('./steps/world.js');

// const support = require('./support/index.js');

// module.exports = Object.assign({}, support);

const { When, Then, And, Given, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { expect } = require('chai');
const puppeteer = require('puppeteer');
// const scope = require('../support/scope');

/* Of Note:
- We're using `*=` because sometimes da text has funny characters in it that are hard to anticipate
*/


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


const INTERVIEW_URL = process.env.INTERVIEW_URL;
console.log(INTERVIEW_URL);
setDefaultTimeout(12 * 1000);

let click_with = {
  mobile: 'tap',
  pc: 'click',
};

// I start the interview on mobile
// I start the interview on pc
// I start the interview
// I go to the file "juvenile-sealing" on a mobile
// I go to "lskdfjlasd.com" on pc
// I go to the interview at "lksdfjls.com" on pc
// /I go to the interview at ?(?:"([^"]+)")?(?: on )?(.*) /
Given(/I start the interview[ on ]?(.*)/, async (optional_device) => {  // √
  // If there is no browser open, start a new one
  if (!scope.browser) {
    scope.browser = await scope.driver.launch({ headless: !process.env.DEBUG });
  }

  if (!scope.page) {
    scope.page = await scope.browser.newPage();
    scope.page.setDefaultTimeout(12 * 1000)
  }

  // Let developer pick mobile device if they want to
  // TODO: Add 'phone' and 'computer' and 'desktop'?
  if (optional_device && optional_device.includes( 'mobile' )) {
    await scope.page.setUserAgent("Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36");
    scope.device = 'mobile';
  } else {
    await scope.page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");
    scope.device = 'pc';
  }

  scope.activate = click_with[ scope.device ];

  // Then go to the given page
  await scope.page.goto(INTERVIEW_URL, {waitUntil: 'domcontentloaded'});
  // This shouldn't be needed, but I think it may help with the ajax
  // requests. Might not solve all race conditions.
  await scope.page.waitForSelector('#daMainQuestion');
  // I've seen stuff take an extra moment or two. Shame to have it everywhere
  await scope.afterStep(scope, {waitForTimeout: 200});
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
  await scope.afterStep(scope, {waitForTimeout: (parseFloat(seconds) * 1000)});
});

/* Here to make writing tests more comfortable. */
When("I do nothing", async () => { await scope.afterStep(scope); });  // √

// TODO: Switch to getting the id and then checking it against the argument
//     which will make for more useful test error messages.
Then('the question id should be {string}', async (question_id) => {  // √
  /* Looks for a santized version of the question id as it's written
  *     in the .yml. docassemble:
  *     re.sub(r'[^A-Za-z0-9]+', '-', interview_status.question.id.lower()) */
  clean_id = question_id.toLowerCase().replace(/[^A-Za-z0-9]+/g, '-');
  question_class = 'question-' + clean_id;
  const element = await scope.page.waitFor('body.' + question_class);
  expect(element).to.exist;

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
  /* In Chrome, this `innerText` gets only visible text */
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
let ordinal_to_integer = {
  only: 0, first: 0, second: 1, third: 2, fourth: 3, fifth: 4,
  sixth: 5, seventh: 6, eighth: 7, ninth: 8, tenth: 9,
  '1st': 0, '2nd': 1, '3rd': 2, '4th': 3, '5th': 4,
  '6th': 5, '7th': 6, '8th': 7, '9th': 8,'10th': 9,
};
let ordinal = '?(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)?';
// Haven't figured out ordinal for group label yet
// Allow "checkbox" and "radio"? Why would they be called the same thing?
let the_checkbox_is_as_expected = new RegExp(`the ${ ordinal } ?(?:"([^"]+)")? (choice|checkbox|radio)(?: button)? ?(?:in "([^"]+)")? is (checked|unchecked|)`);
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
  // Proposed: First dig all the way down to the label, then dig back out
  // Regected: It's not clear how to keep things in order and filtering them
  // that way is more confusing, not less. It also takes more lines of code.
  // Proposed: First collect all elements of expected status.
  // Rejected: That ruins getting the correct ordinal

  // Defaults
  ordinal = ordinal || 'first';
  label_text = label_text || '';
  group_label_text = group_label_text || '';

  let index = ordinal_to_integer[ ordinal ];
  let type = `@role="${ choice_type }"`  // Is this complicating things to much?
  if ( choice_type === 'choice') { type = `@role="checkbox" or @role="radio"` }

  // If possible, get the first group to which this choice belongs
  let group_name = null;
  if ( group_label_text ) {
    // Example: `//*[@id="daform"]//label[contains(text(), "serve")][1]`
    let identifier_xpath = `//*[@id="daform"]//label[contains(text(), "${ group_label_text }")][1]`;
    let [group_label] = await scope.page.$x( identifier_xpath );
    expect( group_label, `Did not find a "${ group_label_text }" group on this page.`).to.not.be.empty;

    group_name = await group_label.evaluate(( elem ) => elem.getAttribute('for'));
  }

  // labels for choices
  let label_xpath = `//*[@id="daform"]//label[${ type }]`;
  // Labels for a group of items will end in the group name plus _0, _1, etc. Ex: `[contains(@for, "X2ZpZWxkXzA_")]`
  if ( group_name ) { label_xpath += `[contains(@for, "${ group_name }_")]` }
  // These labels don't have text, their descendants do. Dig down to find matches then come back out to get the label again.
  // Ex: `//*[contains(text(), "My case")]/ancestor-or-self::label`
  if ( label_text ) { label_xpath += `//*[contains(text(), "${ label_text }")]/ancestor-or-self::label` }
  // The index to identify just one. It's 1-indexed. xpath still makes an array. Ex: `[1]`
  label_xpath += `[${ index + 1 }]`;
  // Ex: `//*[@id="daform"]//label[@role="checkbox" or @role="radio"][contains(@for, "X2ZpZWxkXzA_")]//*[contains(text(), "My case")]/ancestor-or-self::label[1]`

  let [elem] = await scope.page.$x( label_xpath );
  expect( elem, `Did not find anything where the ${ ordinal } "${ label_text }" should have been.`).to.not.be.empty;

  // See if it's checked or not
  let is_checked = await elem.evaluate((elem) => {
    return elem.getAttribute('aria-checked') === 'true';
  });
  let what_it_should_be = expected_status === 'checked';
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
  let error_message_elem = await Promise.race([
    scope.page.waitForSelector('.alert-danger'),
    scope.page.waitForSelector('.da-has-error'),
  ]);
  expect( error_message_elem ).to.exist;

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


When(/I tap the (button|link) "([^"]+)"/, async (elemType, phrase) => {  // √
  /* Taps a button and stores or reacts to what happens:
  *    navigation, validation error, page error, just a click. */
  let start_url = await scope.page.url()

  // Making this a race would probably be more simple
  let elem;
  if (elemType === 'button') {
    [elem] = await scope.page.$x(`//button/span[contains(text(), "${phrase}")]`);
    if ( !elem ) {
      [elem] = await scope.page.$x(`//button[contains(text(), "${phrase}")]`);
      if ( !elem ) {
        // This how we'll handle it for now, but oh boy
        // Possibly look into https://stackoverflow.com/a/56044998/14144258
        [elem] = await scope.page.$x(`//div[contains(@class, "form-actions")]//a[contains(text(), "${phrase}")]`);
      }
    }
  } else {
    [elem] = await scope.page.$x(`//a[contains(text(), "${phrase}")]`);
  }

  let winner;
  if (elem) {
    winner = await Promise.race([
      Promise.all([  // Error loads page, so no need to detect
        // Click with no navigation will end immediately
        elem[ scope.activate ](),
        scope.page.waitForNavigation({waitUntil: 'domcontentloaded'}),
      ]),
      scope.page.waitForSelector('.alert-danger'),
      scope.page.waitForSelector('.da-has-error'),
    ]);
  }

  let end_url = await scope.page.url();

  // If navigation, wait for 200ms. If stay on page, wait for `show if`.
  // Navigation may be to same page. Not sure how we'll do reload...
  if (winner.constructor.name === 'ElementHandle') {
    await scope.afterStep(scope, {waitForShowIf: true, navigated: start_url !== end_url});
  } else {
    await scope.afterStep(scope, {waitForTimeout: 200, navigated: start_url !== end_url});
  }
  
});

//#####################################
// UI element interaction
//#####################################

When('I tap the defined text link {string}', async (phrase) => {  // hold
  /* Not sure what 'defined' means here. Maybe for terms? */
  const [link] = await scope.page.$x(`//a[contains(text(), "${phrase}")]`);
  if (link) {
    await link[ scope.activate ]();
  } else {
    // Is this needed or will it cause an error anyway?
    if (process.env.DEBUG) {
      await scope.page.screenshot({ path: './error.jpg', type: 'jpeg', fullPage: true });
    }
    throw `No link with text ${phrase} exists.`;
  }

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
  /* Clears the matching textfield in the question area and then types in it */
  let id = await scope.getTextFieldId(scope, field_label);
  await scope.page.$eval(`#${id}`, (el) => { el.value = ''});
  await scope.page.type( `#${id}`, value );
  await scope.afterStep(scope, {waitForShowIf: true});
});

Then('I sign', async () => {
// Then('I sign', async () => {
  let canvas = await scope.page.waitForSelector('canvas');
  let bounding_box = await canvas.boundingBox();

  await scope.page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
  await scope.page.mouse.down();
  // await scope.page.mouse.move(1, 1);
  await scope.page.mouse.up();

  await scope.afterStep(scope);
});



//#####################################
//#####################################
// After
//#####################################
//#####################################

After(async (scenario) => {
  if (scenario.result.status === "failed") {
    const name = scenario.pickle.name.replace(/[^A-Za-z0-9]/gi, '');
    await scope.page.screenshot({ path: `error-${name}.jpg`, type: 'jpeg', fullPage: true });
  }
  // If there is a browser window open, then close it
  if (scope.page) {
    await scope.page.close();
    scope.page = null;
  }
});

AfterAll(async () => {
  // If there is a browser open, then close it
  if (scope.browser) {
    await scope.browser.close();
  }
});


