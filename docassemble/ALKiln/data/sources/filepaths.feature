@filepaths
Feature: Filepaths lengths

# In tag names, 'fp' is for 'filepaths'

@fp1
Scenario: Longest filepath should be under 184 characters with scenario description cut off at 70 and question id cut off at 20
  Given I start the interview at "test_longest_filepath.yml"
  And I answer randomly for at most 3 pages
