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
Scenario: I see user errors
  Given I start the interview at "all_tests"
  And I tap to continue
  And I tap to continue
  And I tap to continue
  Then I can't continue
  And I will be told an answer is invalid

@fast @o3
Scenario: I can include .yml in the filename
  Given I start the interview at "all_tests.yml"

@slow @o3
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
  Then I arrive at the next page
  Then I get to "screen features" with this data:
    | var | value | trigger |
    | button_continue | True |  |
    | buttons_other | button_2 |  |
    | buttons_yesnomaybe | True |  |
  And I should see the link to "http://ecosia.org/"
