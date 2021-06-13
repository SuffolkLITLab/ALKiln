#@assembly_line
#Feature: Assembly Line package-specific Steps
#
## In tag names, 'al' is for 'assembly line'
#
#@fast @al1
#Scenario: I have 2 name parts
#  Given I start the interview at "AL_tests"
#  And I set the name of "users[0]" to "Uli User"
#  And I tap to continue
#  And I set the address of "users[0]" to "120 Tremont Street, Unit 2, Boston, MA 02108"
#  And I tap to continue
#  And I set the name of "users[1]" to "Uli2 User2"
#  And I set the var "users[i].proxy_var" to "Mixed proxy var step test"
#  And I tap to continue
#  Then the question id should be "end"
#
#@fast @al2
#Scenario: I have 3 name parts
#  Given I start the interview at "AL_tests"
#  And I set the name of "users[0]" to "Uli Udo User"
#  And I tap to continue
#  And I set the address of "users[0]" to "120 Tremont Street, Unit 2, Boston, MA 02108"
#  And I tap to continue
#  And I set the name of "users[1]" to "Uli2 User2"
#  And I set the var "users[i].proxy_var" to "Mixed proxy var step test"
#  And I tap to continue
#  Then the question id should be "end"
#
#@fast @al3
#Scenario: I have 4 name parts
#  Given I start the interview at "AL_tests"
#  And I set the name of "users[0]" to "Uli Udo User Sr"
#  And I tap to continue
#  And I set the address of "users[0]" to "120 Tremont Street, Unit 2, Boston, MA 02108"
#  And I tap to continue
#  And I set the name of "users[1]" to "Uli2 User2"
#  And I set the var "users[i].proxy_var" to "Mixed proxy var step test"
#  And I tap to continue
#  Then the question id should be "end"
