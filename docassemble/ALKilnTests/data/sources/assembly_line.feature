@assembly_line
Feature: Assembly Line package-specific Steps

@temp
Scenario: I take the shortest path
  Given I sign in with the email "ALKILN_EMAIL" and the password "ALKILN_PASSWORD"
  And I start the interview at "https://dev.pleadingpower.com/interview?i=docassemble.playground109ALKilnInstallv5:index.yml"
  #And I set the variable "warn_dev_no_subscription" to "True"
  #And I set the variable "user_agrees_to_terms_of_service['agrees']" to "True"
  #And I take a screenshot
  #And I tap to continue
  #And I take a screenshot
  #And I tap to continue
  #And I take a screenshot
  #And I set the variable "selected_templates[0].template" to "gard-notice_of_appearance_-_general.docx"
  #And I take a screenshot
  #And I tap to continue
  #And I take a screenshot
  And the user gets to "final screen" with this data:
    | var | value |
    | warn_dev_no_subscription | True |
    | user_agrees_to_terms_of_service['agrees'] | True |
    | intro | True |
    | attorney_from_database.address.location.known | False |
    | attorney_from_database.location.known | False |
    | case_type | trial |
    | cocounsels.person_type.name | docassemble.AssemblyLine.al_general.ALIndividual |
    | cocounsels.revisit | True |
    | cocounsels.there_are_any | False |
    | coparties.revisit | True |
    | coparties.there_are_any | False |
    | county_designator | 04 |
    | county_of_action | Bradford |
    | court_case_number | 04-2024-CA-000001-CC |
    | court_type_designator | CA |
    | judge.id | 18205 |
    | judge.name.text | George M. Wright |
    | matter_type | other |
    | other_parties[0].name.first | Acme, Inc. |
    | other_parties[0].person_type | business |
    | other_parties[0].location.known | False |
    | other_parties[0].mailing_address.location.known | False |
    | other_parties[0].address.location.known | False |
    | other_parties[0].complete | True |
    | other_parties[0].attorney.address.location.known | False |
    | other_parties[0].attorney.bar_number | 196749 |
    | other_parties[0].attorney.bar_number_unknown | False |
    | other_parties[0].attorney.email2 | |
    | other_parties[0].attorney.location.known | False |
    | other_parties[0].attorney.mailing_address.location.known | False |
    | other_parties[0].attorney.name.first | Joseph |
    | other_parties[0].attorney.name.last | Little |
    | other_parties[0].attorney.name.middle | W. |
    | other_parties[0].attorney.name.text | Joseph W. Little |
    | other_parties[0].attorney.service_address.location.known | False |
    | other_parties[0].db_attorney.address.address | 3731 Northwest 13th Place |
    | other_parties[0].db_attorney.address.city | Gainesville |
    | other_parties[0].db_attorney.address.location.known | False |
    | other_parties[0].db_attorney.address.state | Florida |
    | other_parties[0].db_attorney.address.zip | 32605-4823 |
    | other_parties[0].db_attorney.bar_number | 196749 |
    | other_parties[0].db_attorney.circuit | Eighth |
    | other_parties[0].db_attorney.county | Alachua |
    | other_parties[0].db_attorney.email | littlegnv@gmail.com |
    | other_parties[0].db_attorney.id | 775533 |
    | other_parties[0].db_attorney.location.known | False |
    | other_parties[0].db_attorney.mobile_number | 0 |
    | other_parties[0].db_attorney.name.first | Joseph |
    | other_parties[0].db_attorney.name.last | Little |
    | other_parties[0].db_attorney.name.middle | W. |
    | other_parties[0].db_attorney.phone_number | (352) 273-0954 |
    | other_parties[0].db_attorney.salutation | Mr. |
    | other_parties[0].represented | True |
    | other_parties[0].serve_person_or_attorney | attorney |
    | other_parties[0].service_address.location.known | False |
    | other_parties[0].service_method['efiling'] | True |
    | other_parties[0].service_method['email'] | False |
    | other_parties[0].service_method['fax'] | False |
    | other_parties[0].service_method['hand'] | False |
    | other_parties[0].service_method['mail'] | False |
    | other_parties.detailed_role | plaintiff |
    | other_parties.revisit | True |
    | other_parties.there_are_any | True |
    | other_parties.target_number | 1 |

    # Templates need their user-visible name
    | selected_templates[0].template | Notice of Appearance - General |

    | selected_templates[0].template_as_file.filename | gard-notice_of_appearance_-_general.docx |
    | selected_templates.there_are_any | True |
    | selected_templates.target_number | 1 |
    | small_claims | False |
    | trial_court.address.location.known | False |
    | trial_court.location.known | False |
    | unknown_court_case_number | False |
    | unknown_judge | False |
    | user_has_no_bar_number | False |
    | user_wants_to_review_answers | False |
    | user_wants_to_save_answers | False |
    | users[0].attorney.address.location.known | False |
    | users[0].attorney.bar_number | 149683 |
    | users[0].attorney.email | kochlawoffice@gmail.com |
    | users[0].attorney.firm | users.attorney.firm |
    | users[0].attorney.firm.address.address | 151 Ward Lane |
    | users[0].attorney.firm.address.city | Livingston |
    | users[0].attorney.firm.address.county | Overton |
    | users[0].attorney.firm.address.state | TN |
    | users[0].attorney.firm.address.unit | |
    | users[0].attorney.firm.address.zip | 38570 |
    | users[0].attorney.firm.address.location.known | False |
    | users[0].attorney.firm.location.known | False |
    | users[0].attorney.firm.mailing_address.location.known | False |
    | users[0].attorney.firm.service_address.location.known | False |
    | users[0].attorney.gender | male |
    | users[0].attorney.location.known | False |
    | users[0].attorney.mailing_address.location.known | False |
    | users[0].attorney.phone_number | 3867471486 |
    | users[0].attorney.representation_level | full |
    | users[0].attorney.service_address.location.known | False |
    | users[0].complete | True |
    | users[0].location.known | False |
    | users[0].mailing_address.location.known | False |
    | users[0].person_type | ALIndividual |
    | users[0].address.address | 151 Ward Lane |
    | users[0].address.city | Livingston |
    | users[0].address.county | Some county |
    | users[0].address.location.known | False |
    | users[0].address.state | TN |
    | users[0].address.unit | |
    | users[0].address.zip | 38570 |
    | users[0].file_number | 24-MF-1 |
    | users[0].name.first | Mark |
    | users[0].name.last | Firstly |
    | users[0].name.middle | |
    | users[0].name.suffix | |
    | users[0].gender | male |
    | users[0].represented | True |
    | users[0].service_address.location.known | False |
    | users[0].unassigned_file_number | False |
    | users.ask_role | defendant |
    | users.attorney.address.location.known | False |
    | users.attorney.bar_number | 149683 |
    | users.attorney.email | kochlawoffice@gmail.com |
    | users.attorney.firm.address.address | 151 Ward Lane |
    | users.attorney.firm.address.city | Livingston |
    | users.attorney.firm.address.county | Overton |
    | users.attorney.firm.address.location.known | False |
    | users.attorney.firm.address.state | TN |
    | users.attorney.firm.address.unit | |
    | users.attorney.firm.address.zip | 38570 |
    | users.attorney.firm.location.known | False |
    | users.attorney.firm.mailing_address.location.known | False |
    | users.attorney.firm.name.first | |
    | users.attorney.firm.service_address.location.known | False |
    | users.attorney.gender | male |
    | users.attorney.location.known | False |
    | users.attorney.mailing_address.location.known | False |
    | users.attorney.name.first | Michael |
    | users.attorney.name.last | Koch |
    | users.attorney.name.middle | |
    | users.attorney.name.suffix | |
    | users.attorney.phone_number | 3867471486 |
    | users.attorney.representation_level | full |
    | users.attorney.service_address.location.known | False |
    | users.attorney.signature | users.attorney.signature_temp |
    | users.attorney.signature | |
    | users.attorney.signature_temp | |
    | users.detailed_role | defendant |
    | users.represented | True |
    | users.revisit | True |
    | users.there_are_any | True |
    | users.target_number | 1 |

# In tag names, 'al' is for 'assembly line'

# Note: the first test for this suite is the first test in this file and we're having timeout issues, so we're trying to give the server longer to load.

@fast @al1
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

@fast @al1_no_proxy @no_proxy
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

@fast @al2
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

@fast @al3
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
