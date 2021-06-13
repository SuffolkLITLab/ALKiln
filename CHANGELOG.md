# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- How to create a new entry:
See the documentation for Keep a Changelog above.
Try to keep them in this order if possible, skipping what you don't need:

Added - for new features.
Changed - for changes in existing functionality.
Deprecated - for soon-to-be removed features.
Removed - for now removed features.
Fixed - for any bug fixes.
Security - in case of vulnerabilities.

Format:

## [Unreleased]
- 

## [1.0.0] - 2021-01-16
### Added
- 

### Changed
- 

### Deprecated
- 

### Removed
- 

### Fixed
- 

### Security
- 
-->
## [Unreleased]
### Added
- New step: 'I should see the link to' and its test.
- Tests for some observational Steps.
- Tests for some interactive Steps.
- Tests for Assembly Line package-specific tests.
- `sought` column for story table.

### Changed
- Removed `checked` column from table. Now only put a checkbox in the table if you want it to be checked. Everything not appearing in the table will be given 'empty' values. For checkboxes, radios, etc, that means ensuring they're unselected. For fields, that means emptying. Not sure what it means for dropdowns yet.
- Added `sought` column to table to define sought var (| var | value | sought |). See https://github.com/plocket/docassemble-cucumber/issues/256. This allows devs to use index vars and generic objects (proxy vars) freely in their interview.
- Matching of fields to story table rows works differently to line up with the removal of `checked`.
- Updated tests to match new functionality.
- Attempt to handle extra space chars in dropdown menu item values. Should use trim instead with everything eventually. See issue.
- Start scenario id with timestamp.

### Removed
- Previous formats of the table (| var | choice | value |) and (| var | value | checked |)
- Some Steps that won't work with translations and are not currently being used by anyone.
- `checked` column of story table.

### Fixed
- Assert found invalid input
- 'I sign' was passing incorrect arguments
- Tried to make element selectors more picky.
- Allow more languages in scenario name.
- Recognize anchor tag.

## [1.3.5] - 2021-05-04
### Added
- Handles setting [AssemblyLine](https://github.com/SuffolkLITLab/docassemble-AssemblyLine) ([ALToolbox](https://github.com/SuffolkLITLab/docassemble-ALToolbox)) `BirthDate` datatype. [See example of HTML here](https://github.com/plocket/docassemble-cucumber/pull/217).

## [1.3.4] - 2021-04-21
### Fixed
- Dropdowns created with objects always fail.

## [1.3.3] - 2021-04-16
### Changed
- This repo no longer has an action to generate test folders and scripts in the dependant repo. From now on, devs will use the interview in https://github.com/plocket/docassemble-ALAutomatedTestingTests to add it themselves. Note: That interview will put the tests in the `/sources` dir. Previous repos' scripts will continue as they are.

## [1.3.2] - 2021-04-07
### Changed
- Each test run creates a unique da Project now. No need to wait for previous tests to finish.

## [1.3.1] - 2021-04-07
### Fixed
- Message about duplicate selector matches.
- Bump _minor_ version number appropriately.

## [1.2.8] - 2021-04-06
### Fixed
- Newly found race condition on 'continue'. Can replicate inside of [DBD](https://github.com/caroRob/docassemble-DeadBrokeDads2/tree/add_tests_to_separating_interview_code_etc) very consistently, but not outside of it. See [#190](https://github.com/plocket/docassemble-cucumber/issues/190).
- Make action buttons more permissive. Some action buttons don't lead to an event, they just have a url. See [#200](https://github.com/plocket/docassemble-cucumber/issues/200).
- Fix all checkboxes getting checked no matter what.
- Account for `choices:` specifier DOM difference - unlike other fields, it has no `.form-group` container.
- Incorrect truthy test.

### Added
- New warning in report about variable appearing on a page in multiple places.

## [1.2.7] - 2021-04-05
### Changed
- A new table format is highly encouraged: `| var | value | checked |`. var = variable name, value = words of the value to set, checked = whether to select or unselect a checkbox (only needed for checkboxes).
- Basically, address much of [#158](https://github.com/plocket/docassemble-cucumber/issues/158), as noted below.

### Deprecated
- Previous version of table columns format (`| var | choice | value |`). The new version uses `| var | value | checked |`, though we do need a better name than `checked`. It will simplify the table for developers and for the code.

### Fixed
- Some proxy field var name finding
- Improved page var name finding in general
- Refactored to get all fields from the page first, then compare to a new format of table

## [1.2.6] - 2021-03-14
### Added
- Automated integrated self-testing
- Unit tests for getField with cheerio
- Refactor getField to use data

### Fixed
- Infinite loop when specific button tap causes error #168
- Some items not getting selected at all (scroll into view problem)

## [1.2.5] - 2021-03-06
### Fixed
- Simplest case of [index var](https://github.com/plocket/docassemble-cucumber/issues/158) (i.e. `i`) question.

## [1.2.4] - 2021-03-03
### Fixed
- Race condition where puppeteer thinks the page has progressed but it really hasn't.

## [1.2.3] - 2021-02-07
### Fixed
- Options of dropdown fields created with objects are not found [#149](https://github.com/plocket/docassemble-cucumber/issues/149)

## [1.2.2] - 2021-02-03
### Fixed
- Signature field rows (`/sign`) are not used up all in one loop

### Added
- .env-example file to files that will be pushed to dependants

## [1.2.1] - 2021-01-26
### Fixed
- #79, race condition breaks story table scenarios (ex: MADE `rental agreement`)
- #115, order of table items matter - continue button pressed too soon
- #139, `scope.getField()` `set_to` doesn't find all the fields


## [1.2.0] - 2021-01-13
### Changed
- Reports are saved as `.txt` files instead of `.md` files.
- Reports are prettier.
- Story table: If there are only two columns needed in a table row, the table doesn't care which columns the second item is in. This is to allow generated tests to work without a human editing them.
- Automatically generated language tags now handle spaces.

### Fixed
- Broken error message - showed the wrong error.

## [1.1.0] - 2021-01-13
### Changed
- Skipped this version somehow. Was sure it was in there somewhere...

## [1.0.0] - 2021-01-13
### Added
- Steps for setting variables, interacting with elements, and observing (to be documented elsewhere TODO: add link)
- 'Story' table - a Step with a cucumber table that can set several variables until a specified `question id` is reached
- Translations support - many Steps that work with any language, including the 'story' table
- Reports about the order the pages appeared that are saved in [github artifacts](https://docs.github.com/en/free-pro-team@latest/actions/managing-workflow-runs/downloading-workflow-artifacts)
- Screenshots from scenarios that created errors
- Ability to download documents
- [Basic documentation for test writing](https://docs.google.com/document/d/1hkNr78mrU3Ha98tPUL4OKWi3eNnt-1Sba7L8470u06g/edit?usp=sharing)
- Ability for this repo to push all needed files to other repositories on which it has push permissions. Those files make sure the tests will get run by github. See the files outlined below:
- `example.feature` - an example test to get a project started
- `github/workflows/run_form_tests.yml` - Automated github workflow to run tests when code is pushed and a manual trigger for testing without needing to push
- `.gitignore` - ignores files that are generated by the tests and shouldn't be added to the repo
- `package.json` - keep up-to-date version of this test repository and hold scripts that the automated tests run
