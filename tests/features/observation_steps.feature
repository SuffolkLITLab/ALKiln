@observation
Feature: Observational steps

# In tag names, 'O' is for 'Observational'

#@fast @O1
#Scenario: I observe things on a single page when I arrive
#  Given I start the interview at "all_tests"
#  Then the question id should be "direct standard fields"
#  And I should see the phrase "Direct standard fields"
#  And I SHOULD see the phrase "Direct standard fields"
#  And I should not see the phrase "zzzzzzz"
#  And I should NOT see the phrase "zzzzzzz"
#  And an element should have the id "daform"
#
#@fast @O2
#Scenario: I see user errors
#  Given I start the interview at "all_tests"
#  And I tap to continue
#  Then I can't continue
#  And I will be told an answer is invalid

@fast @O3
Scenario: I check navigation
  Given I start the interview at "all_tests"
  And the user gets to "showifs" with this data:
    | var | value | sought |
    | checkboxes_other | checkbox_other_opt_1 |  |
    | dropdown_test | dropdown_opt_2 |  |
    | radio_yesno | False |  |
    | radio_other | radio_other_opt_3 |  |
    | text_input | Regular text input field value | |
    | textarea | Multiline text\narea value |  |
  Then I arrive at the next page
  Then the user gets to "screen features" with this data:
    | var | value | sought |
    | button_continue | True |  |
    | buttons_other | button_2 |  |
    | buttons_yesnomaybe | True |  |
    | checkboxes_other | checkbox_other_opt_1 |  |
    | checkboxes_other | checkbox_other_opt_2 |  |
    | checkboxes_yesno | True |  |
    | dropdown_test | dropdown_opt_2 |  |
    | radio_other | radio_other_opt_3 |  |
    | radio_yesno | False |  |
    | text_input | Regular text input field value |  |
    | textarea | Multiline text\narea value |  |
  And I should see the link to "http://ecosia.org/"
