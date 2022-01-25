@observation
Feature: Observational steps

# In tag names, 'o' is for 'observational'

@fast @o1
Scenario: I observe things on a single page when I arrive
  Given I start the interview at "all_tests"
  And I tap to continue
  Then the question id should be "group of complex fields"
  And I should see the phrase "Some complex fields"
  And I SHOULD see the phrase "Some complex fields"
  And I should not see the phrase "zzzzzzz"
  And I should NOT see the phrase "zzzzzzz"
  And an element should have the id "daform"

@fast @o2
Scenario: I see user errors.
#  They're everywhere.  Some don't even know they are errors.
  Given I start the interview at "all_tests"
  And I tap to continue
  And I tap to continue
  And I tap to continue
  Then I can't continue
  And I will be told an answer is invalid

@fast @o3
Scenario: I can include .yml in the filename
  Given I start the interview at "all_tests.yml"

@slow @o4
Scenario: I check navigation
  Given I start the interview at "all_tests"
  And I tap to continue
  And I get to "showifs" with this data:
    | var | value | trigger |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | dropdown_test | dropdown_opt_2 | |
    | radio_yesno | False | false |
    | radio_other | radio_other_opt_3 | |
    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    | text_input | Regular text input field value | |
    | textarea | Multiline text\narea value | |
    | date_input | today | |
  Then I arrive at the next page
  Then I get to "screen features" with this data:
    | var | value | trigger |
    | button_continue | True |  |
    | buttons_other | button_2 |  |
    | buttons_yesnomaybe | True |  |
  And I should see the link to "http://ecosia.org/"

@fast @o4
Scenario: Test "Then I don't continue" with a single quote
  Given I start the interview at "all_tests"
  And I tap to continue
  And I tap to continue
  And I tap to continue
  Then I don't continue
  And I will be told an answer is invalid

@fast @o5
Scenario: Test "Then I cannot continue"
  Given I start the interview at "all_tests"
  And I tap to continue
  And I tap to continue
  And I tap to continue
  Then I cannot continue
  And I will be told an answer is invalid

@fast @o6
Scenario: Test "Then I do not continue"
  Given I start the interview at "all_tests"
  And I tap to continue
  And I tap to continue
  And I tap to continue
  Then I do not continue
  And I will be told an answer is invalid

@fast @o7
Scenario: Test "Then I can’t continue" with an apostrophe
  Given I start the interview at "all_tests"
  And I tap to continue
  And I tap to continue
  And I tap to continue
  Then I can’t continue
  And I will be told an answer is invalid

@fast @o8
Scenario: Test "Then I don’t continue" with an apostrophe
  Given I start the interview at "all_tests"
  And I tap to continue
  And I tap to continue
  And I tap to continue
  Then I don’t continue
  And I will be told an answer is invalid

@fast @o9
Scenario: I can match JSON page var to str
  Given I start the interview at "all_tests.yml"
  And I get to "showifs" with this data:
    | var | value | trigger |
    | double_quote_dict["double_quote_key"]['dq_two'] | true |  |
    | checkboxes_other['checkbox_other_opt_1'] | true |  |
    | dropdown_test | dropdown_opt_2 | |
    | radio_yesno | False | false |
    | radio_other | radio_other_opt_3 | |
    | single_quote_dict['single_quote_key']['sq_two'] | true |  |
    | text_input | Regular text input field value | |
    | textarea | Multiline text\narea value | |
    | date_input | today | |
  Then the text in the JSON variable "dropdown_test" should be
  """
  dropdown_opt_2
  """

# Maybe this one should be in the report tests (as well?)
@fast @o10 @json
Scenario: I get the page's JSON
  Given I start the interview at "all_tests"
  Then I get the page's JSON variables and values
