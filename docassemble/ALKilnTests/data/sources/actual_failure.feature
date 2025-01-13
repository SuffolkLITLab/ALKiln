@error
Feature: Cause actual errors

# In our workflow, exclude these. Run them manually when needed.
# TODO: all ourselves a final status of "undefined"

@er1
Scenario: The Step is undefined
  Given there is no such Step

@er2
Scenario: Non-existent interview
  Given I start the interview at "no interview.yml"