@assembly_line
Feature: Assembly Line package-specific Steps

# In tag names, 'al' is for 'assembly line'

# Note: the first test for this suite is the first test in this file and we're having timeout issues, so we're trying to give the server longer to load.

@fast @al1 @temp_error
Scenario: I have two name parts
  Given the max secs for each step is 120
  Given I start the interview at "AL_tests"
  And I set the name of "users[0]" to "Uli User"
  And I tap to continue
  And I set the address of "users[0]" to "120 Tremont Street, Unit 2, Boston, MA 02108"
  And I tap to continue
  And I set the name of "users[1]" to "Uli2 User2"
  And I set the var "users[i].proxy_var" to "Mixed proxy var step test"
  And I tap to continue
  Then the question id should be "end"

@fast @al1_no_proxy @no_proxy @temp_error
Scenario: I use no proxies and have two name parts
  Given the max secs for each step is 120
  Given I start the interview at "AL_tests"
  And I set the name of "users[0]" to "Uli User"
  And I tap to continue
  And I set the address of "users[0]" to "120 Tremont Street, Unit 2, Boston, MA 02108"
  And I tap to continue
  And I set the name of "users[1]" to "Uli2 User2"
  And I set the var "users[1].proxy_var" to "Mixed proxy var step test"
  And I tap to continue
  Then the question id should be "end"

@fast @al2 @temp_error
Scenario: I have three name parts
  Given I start the interview at "AL_tests"
  And I set the name of "users[0]" to "Uli Udo User"
  And I tap to continue
  And I set the address of "users[0]" to "120 Tremont Street, Unit 2, Boston, MA 02108"
  And I tap to continue
  And I set the name of "users[1]" to "Uli2 User2"
  And I set the var "users[i].proxy_var" to "Mixed proxy var step test"
  And I tap to continue
  Then the question id should be "end"

@fast @al3 @temp_error
Scenario: I have four name parts
  Given I start the interview at "AL_tests"
  And I set the name of "users[0]" to "Uli Udo User II"
  And I tap to continue
  And I set the address of "users[0]" to "120 Tremont Street, Unit 2, Boston, MA 02108"
  And I tap to continue
  And I set the name of "users[1]" to "Uli2 User2"
  And I set the var "users[i].proxy_var" to "Mixed proxy var step test"
  And I tap to continue
  Then the question id should be "end"

@al4
Scenario: I set three part dates and use "today" with custom datatypes
  Given I start the interview at "AL_custom_dates"
  And I set the var "three_parts_date" to "today"
  And I set the var "birth_date" to "today - 2"
  And I tap to continue
  Then the question id should be "end"
