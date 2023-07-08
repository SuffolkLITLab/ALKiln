@langs
Feature: Multi-language tests

# Usually only run default test and skip or shorten others
# When commanded, run all non-default language tests

# We'll need to test these manually each time, as our users would,
# and check that the automatic tests didn't trigger the language
# tests

# Tag use examples:
# # No tags for default language only
# @al_language # for all languages
# @al_language @es # to isolate one language

# The screenshot will help us check manually that the right stuff is
# going on
@l1
Scenario Outline: language url
  Given I start the interview at "test_languages.yml<arg>"
  Then I SHOULD see the phrase "<text>"
  And I take a screenshot

  @en
  Examples: english
    | arg | text |
    | &new_session=1&lang=en | English page |

  @es
  Examples: spanish
    | arg | text |
    | &new_session=1&lang=es | Español page |

  @ar
  Examples: arabic
    | arg | text |
    | &new_session=1&lang=ar | عربي page |
