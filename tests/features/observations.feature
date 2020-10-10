Feature: Observational steps

Notes:
- checkbox ordinal need something more than 'first'
* 1. 
* 1. 
* 1. 
* 1. the checkbox in "Which service" is checked
* 1. 
* 1. the third checkbox in "Which service" is checked
* 1. the "My court" checkbox in "Which service" is checked
* 1. the third "My court" checkbox in "Which service" is checked

Scenario: Observe
  Given I start the interview
  Then I wait 1 second
  Then I wait .5 seconds
  Then I do nothing
  Then the question id should be "basic questions intro screen"
  Then I SHOULD see the phrase "Mass Access"
  Then I should NOT see the phrase "sweater vest"
  Then I should see the link "green words"
  Then an element should have the id "daMainQuestion"

  Then the checkbox is unchecked
  Then the first checkbox is unchecked
  Then the "I accept" checkbox is unchecked
  Then the first "I accept" checkbox is unchecked

  Then the "terms of use" link leads to "https://massaccess.suffolklitlab.org/privacy/"
  Then the "terms of use" link opens in a new window
  Then the "terms of use" link opens a working page

  When I tap the button "Next"
  Then I can't continue
  Then I will be told an answer is invalid

  When I tap the "I accept" choice
  When I tap the button "Next"
  Then I arrive at the next page
