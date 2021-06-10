@story_tables
Feature: Story tables

Scenario: I have two 2 name parts
  Given I start the interview at "AL_tests"
  And I set the name of "users[0]" to "Uli User"
  And I tap to continue
  And I set the address of "users[0]" to "120 Tremont Street, Unit 2, Boston, MA 02108"
  And I tap to continue
  Then the question id should be "end"

@generated @fast @st1 @sought_var
Scenario: Proxy and regular vars are mixed
  Given I start the interview at "AL_tests"
  And the user gets to "the end" with this data:
    | var | value | checked | sought |
    | users[0].name.first | Uli1 |  | users[0].name.first |
    | users[0].name.last | User1 |  | users[0].name.first |
    | users[0].address.address | 120 Tremont Street |  | users[0].name.first |
    | users[0].address.unit | Unit 2 |  | users[0].name.first |
    | users[0].address.city | Boston |  | users[0].name.first |
    | users[0].address.state | MA |  | users[0].name.first |
    | users[0].address.zip | 02108 |  | users[0].name.first |
    | users[1].name.first | Uli2 |  | users[1].name.first |
    | users[1].name.last | User2 |  | users[1].name.first |
    | users[i].proxy_var | Index var value |  | users[1].name.first |
