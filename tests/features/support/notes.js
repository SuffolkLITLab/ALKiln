// https://github.com/jhpyle/docassemble/blob/master/tests/features/steps/docassemble.py

/*
KEY:
1. √ means implemented
1. x means won't implement
1. ~ means needs to be done
1. ? means needs to be discussed
1. ^ means a version is done, but may need improvement
*/

// // Copying some da aloe steps
// const { When, Then, And, Given, After, AfterAll, setDefaultTimeout } = require('cucumber');
// const { expect } = require('chai');
// const puppeteer = require('puppeteer');
// const interviewConstants = require('../../interview-constants');
// const scope = require('./scope');

// /* Of Note:
// - We're using `*=` because sometimes da text has funny characters in it
//     that are hard to anticipate, so we allow people to just put in some of the text
// */


// // =========================
// // Contstants
// // =========================
// let ordinal_to_integer = {
//   first: 0, second: 1, third: 2, fourth: 3, fifth: 4,
//   sixth: 5, seventh: 6, eighth: 7, ninth: 8, tenth: 9,
//   '1st': 0, '2nd': 1, '3rd': 2, '4th': 3, '5th': 4,
//   '6th': 5, '7th': 6, '8th': 7, '9th': 8,'10th': 9,
// };
// let specified = '?"?(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|"[^"]+)?"?';
// let click_with = { mobile: 'tap', pc: 'click', };
// // non-capturing capturing group expression for single or double quotes?


// =========================
// Establishing
// =========================
//x @step(r'I spend at least ([0-9]+) seconds? on each page')
//x @step(r'I want to store screenshots in the folder "([^"]+)"')


// =========================
// Start
// =========================
//x @step(r'I start the possibly error-producing interview "([^"]+)"')
//x @step(r'I am using the server "([^"]+)"')
//x @step(r'I log in with "([^"]+)" and "([^"]+)"')
//x @step(r'I launch the interview "([^"]+)"')

// ? @step(r'I start the interview "([^"]+)"')
// ? I start the interview file "([^"]+)" on mobile
// ? I open the interview file ?"?([^"]+)"?( on mobile/a phone/a computer/a pc/a tablet???)
// ? I open the interview file ?"?([^"]+)"?[ on ]?(.*)/
// √ I start the interview on mobile|pc


// =========================
// Observational/Passive
// =========================
//x @step(r'I wait forever')
//x @step(r'I should see "([^"]+)" as the title of the page')
//x @step(r'I should see "([^"]+)" as the URL of the page')
//x @step(r'I save a screenshot to "([^"]+)"')
//x @step(r'I set the window size to ([0-9]+)x([0-9]+)')
//x @step(r'I screenshot the page')

// √ @step(r'I wait (\d+) seconds?')

// Make writing tests more comfortable.
// √ I do nothing

// ~ I should see the term "([^"]+)"

// √ /I (should|should not) see the phrase "([^"]+)"/i

// √ For things that have double quotes in them
// √ I (should|should not) see the phrase '([^']+)'/i

// √ the question id should be {string}

// √ I will be told an answer is invalid

// ? @step(r'I should see that "([^"]+)" is "([^"]+)"')  // What do? Anything with label

// ? "" is selected/picked?
// √ the third "blah" checkbox in "bleh" is checked

// √ I arrive at the next page

// √ I (don't|can't) continue

// √ the link "([^"]+)" should lead to "([^"]+)"

// √ the link "([^"]+)" should open in (a new window|the same window)


// =========================
// Navigational
// =========================
//x @step(r'I exit by taping "([^"]+)"')
//x @step(r'If I see it, I will tap the link "([^"]+)"')

// ? I tap the ${ specified } link "([^"]+)"

// Also sometimes not navigational
// ^ @step(r'I tap the button "([^"]+)"')
// ? I tap "([^"]+)" (can this be a button or link or anything?) (Include 1st, 2nd, etc?)
// ? @step(r'I tap the "([^"]+)" button')
// ? @step(r'I tap the link "([^"]+)"')
// Maybe go with 'I tap'? Is that possible? Maybe we should stick to the script.
// √ I tap the (button|link) "([^"]+)"

// √ the link "([^"]+)" should open a working page


// =========================
// Interactive
// =========================
//x @step(r'I upload the file "([^"]*)"')
//x @step(r'I reload the screen')
//x @step(r'I select "([^"]+)" from the menu')
//x @step(r'I tap the back button')
//x @step(r'I tap the question back button')
//x @step(r'I tap the (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) link "([^"]+)"')
//x @step(r'I tap the final link "([^"]+)"')

// ? @step(r'I select "([^"]+)" in the combobox')
// ~ I pick "([^"]+)" in the { specified } combobox

// ? @step(r'I set the combobox text to "([^"]*)"')
// ~ I set the {specified} combobox text to "([^"]*)"

//x too vague @step(r'I choose "([^"]+)"')  // dropdown
// ^ I select "" from the "" dropdown
// ? I choose "([^"]+)" from the ${ descriptor } dropdown
// ? I set the "([^"]*)" dropdown to "([^"]*)"
// ? I pick "" from the "" dropdown?

// These could be better differentiated
// ? @step(r'I select "([^"]+)" as the "([^"]+)"')  // options
// ? @step(r'I select "([^"]+)" as the (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) "([^"]+)"')
// All could be combined with regex?
// ? I pick ""?

// They're both (all?) text fields. Combine these two? The end behavior is a little different for some reason.
// 'set' is a good way of expressing that they're cleared first, but maybe clearing should be done separately?
// Or maybe there should be 'set', 'type', and 'clear' options.
//x too vague @step(r'I set "([^"]+)" to "([^"]*)"')
//x too vague @step(r'I set the (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) "([^"]+)" to "([^"]*)"')
// √ @step(r'I set the ""? text box to "([^"]*)"')
// ~ @step(r'I set text box ([0-9]+) to "([^"]*)"')  // combined with above
// ? I type "([^"]*)" ?(?:in)? (?:the)? ?("([^"]*)")? (?:text box)?
//x I type {string} in the {string} field  // not actually working
//x I type {string} in the unlabeled field  // not actually working

// ? I clear the textbox

// ? @step(r'I set the text area to "([^"]*)"')
// ? I type "([^"]*)" in the ${ specified } textarea

// ? I clear the textarea

// Radio buttons or checkboxes. 'option' is confusing.
//x @step(r'I tap the "([^"]+)" option under "([^"]+)"')
//x @step(r'I tap the "([^"]+)" option')
//x @step(r'I tap the option "([^"]+)" under "([^"]+)"')
//x @step(r'I tap the option "([^"]+)"')
// ? I tap the {ordinal} "([^"]+)" (choice|checkbox|radio) under ?(?: the)? ?{ordianl} "([^"]+)"
// ^? I tap the (button|link) "([^"]+)"
// ^? I tap the option with the text "([^"]+)" (too vague?)
// ^? I tap the {string} choice (too vague?)

// ? @step(r'I unfocus')  // Not sure of this one
// ? I tap somewhere else?

// ^? I tap the defined text link {string}  // I tap the term?

// ~ @step(r'I go to the help screen')
// Still 'I tap'? A possible alterntive to it if someone's really struggling to make the text match?

// ~ @step(r'I go back to the question screen')

//x @step(r'I tap inside the signature area')
// ^ I sign  // Add 'They'?

