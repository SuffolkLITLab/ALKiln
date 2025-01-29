@random_tests @success
Feature: I generate valid constrained random answers tests

This line does not get parsed as a Scenario despite the Scenario: keyword
This line doesn't get added either.

# TODO: Double or triple up on what we test in one test. These adds a lot of
#    time to tests (to visit a new interview each time), which is unavoidable
#    with only one constraints Step allowed in each Scenario
# Discuss: Should one Scenario failure fail the whole file? Signs point to yes.

# Note: In here we test Scenarios that create extra artifacts in generated
#    like warnings. Tests here are also in unit tests.

# One normal test
@temp_constrained
Scenario: simplest random input Steps
  Given I start the interview at "test_kickout"
  And I generate 2 random tests that get to any of "kickout screen", "success screen" when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |

#### Discuss: Do we need different behavior for fully empty row than for empty
####    column option? Hold off on this for now
#### TODO: Both unit and integration tests
###Scenario: random answers table rows are empty
###  Given the final Scenario status should be "failed"
###  And the max seconds for each Step is 5 seconds
###  And I start the interview at "test_kickout"
###  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
###    | var | possible_values |
###    |  |  |
###
#### Discuss: Should empty var columns have warnings/errors? They're valid table
####    rows. If not, are these tests necessary? Hold off on this for now.
#### TODO: Both unit and integration tests
###Scenario: random answers table is missing a var name
###  Given the final Scenario status should be "failed"
###  And the max seconds for each Step is 5 seconds
###  And I start the interview at "test_kickout"
###  And I generate 1 random test that get to any of ["kickout screen", "success screen"] when I use these constraints:
###    | var | possible_values |
###    |  | correct;; wrong |


# =====================
# Generate debug warnings for users
# Discuss: Should we have author warnings that are only in the debug logs? 
#    These would be warnings for tests that aren't invalid, but may (or may
#    not) have unexpected behavior. Should they have a different icon and
#    keyword?
# =====================

Scenario: Debug warning for constraints table syntax that creates missing vals
  And the max seconds for each Step is 5 seconds
  And I start the interview at "test_kickout"
  And I generate 1 random test that get to any of "kickout screen", "success screen" when I use these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
    | fake_var | fake 1;; fake 2;; |


# =====================
# Generate warnings Steps
# =====================

@generated_warning
Scenario: With a missing number I get a warning and 1 generated test
  Given I start the interview at "test_kickout"
  And I generate not a number constrained random tests that get to ["kickout screen", "success screen"] when I pick from:
    | var | possible_values |
    | user_choice | correct;; wrong |

@generated_warning
Scenario: With too many numbers I get a warning and use the 2nd number
  Given I start the interview at "test_kickout"
  And I generate 4 2 constrained random tests that get to "kickout screen" or "success screen" when I pick from:
    | var | possible_values |
    | user_choice | correct;; wrong |

Scenario: I'm warned when I ask for too many unique tests
  Given I start the interview at "test_kickout"
  And I generate 3 random tests that get to any of "kickout screen", "success screen" when I pick from these constraints:
    | var | possible_values |
    | user_choice | correct;; wrong |
