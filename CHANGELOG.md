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
<!-- ## [Unreleased] -->
## [3.0.0] - 2021-12-07
### Changed
- v3 release to update to da Bootstrap 5. Breaks for servers that have not yet updated to that da version.

## [2.7.0-pre-update-dom.4] - 2021-12-03
### Changed
- Give test resetting, a common failure point, a couple of tries and add a warning and instructions about simply re-running the tests.

## [2.7.0-pre-update-dom.3] - 2021-12-02
### Fixed
- Abandon puppeteer clicks and handle them all ourselves. This means people can't run a mobile device because they can't tap. It takes some implementation. See https://stackoverflow.com/a/56547605/14144258.

## [2.7.0-pre-update-dom.2] - 2021-12-02
### Fixed
- Quick fix for frequent timeout errors. See https://github.com/SuffolkLITLab/ALKiln/issues/389#issuecomment-984844240, Option 1 - disable cucumber timeout and, instead, handle timeout errors to allow 3 attempts to load an interview. For future development, convert to API key to check if server is restarting.

## [2.7.0-pre-update-dom] - 2021-11-22
### Changed
- Update to Bootstrap 5 Docassemble DOM changes
- Remove test(s?) for guessing proxy vars as we don't do that anymore #221
- Added instructions for using tags when running cucumber tests
- Handle clicking in `tapElement()` ourselves now instead of with puppeteer. See previous commit for the change.

## [2.6.0] - 2021-08-07
### Added
- 'today' and 'today - 1' for setting dates

## [2.5.4] - 2021-08-07
### Fixed
- In page load, total timeout needs to be checked in more places to give useful error message before Step fully times out.

## [2.5.3] - 2021-08-06
### Fixed
- Not giving enough time for package to load - failing too soon on error of module not found.
- Not waiting for package page to appear on setup: https://github.com/plocket/docassemble-cucumber/issues/367#issuecomment-892591770. I believe we tried this in the past and it wasn't enough.

## [2.5.2] - 2021-08-03
### Fixed
- Wrong error when server times out on page load.

## [2.5.1] - 2021-07-31
### Added
- Tests for failed Scenarios and their reports

### Changed
- Tweak report wording

### Fixed
- Internal report check logic
- Loading page did not catch system error and re-trying without timeout was not robust.

## [2.5.0] - 2021-07-31
### Added
- Report line for error on load.
- Internal testing Step to test contents of reports include certain content.
- Internal testing Step to check passing tests should be passing and failing ones should be failing.

## [2.4.2] - 2021-07-31
### Fixed
- Steps that set vars (other than the story table) should fail when they can't set their var, but they did not fail.

## [2.4.1] - 2021-07-24
### Fixed
- Upload Step wasn't waiting for files to finish uploading

## [2.4.0] - 2021-07-23
### Added
- Values can be set to comma-separated list of names of files to upload to upload multiple files. Files must be in the package's 'sources' folder or in the 'tests/features' folder.

### Changed
- Increased `showif_timeout` because a hidden field missed getting set via a race condition. The only explanation we could come up with was that the field wasn't shown fast enough.
- Allow duplicates of '[class="file-caption-name"]' fields as they should not be dangerous.

## [2.3.0] - 2021-07-22
### Changed
- Report: List failed scenarios first, other non-passing scenarios second (should not run into those much I think), and passed scenarios last.
- Two internal tests adjusted to be 10 secs shorter each
- One internal test tag updated

### Fixed
- Some report ids not being recorded because old id from previous test was not different from new id in new scenario.

## [2.2.3] - 2021-07-18
### Changed
- Updated package-lock.json with `npm fix` based on `npm audit`

## [2.2.2] - 2021-07-16
### Fixed
- `toBase64` returns default valid base 64 value with clear name if needed

### Added
- Clarifying code comments

## [2.2.1] - 2021-07-14
### Fixed
- Variable undefined in scope.js (message)

## [2.2.0] - 2021-07-12
### Added
- Tests for reports for unexpected failures

### Changed
- Bump minor version for added timeout behavior, etc.

## [2.1.8] - 2021-07-11
### Added
- Step: Custom global timeout, #317, for when interviews know they'll need longer timeouts for such things as loading large documents.

### Changed
- Timeout is now 30 sec instead of 2 min as individual devs can set a custom timeout for their scenarios. We've made an assumption that this will be enough for most interviews and will have to see if that bears out.

## [2.1.7] - 2021-07-08
### Added
- More detailed reports that print 1. variables that were set on each page 2. all rows that set variables, and 3. all rows that weren't used

## [2.1.6] - 2021-07-07
### Added
- Backwards compatibility with `#sought_variable` element.
- Report tests

### Fixed
- Typo in report

## [2.1.5] - 2021-07-07
### Changed
- Not sure. Can't find this commit.

## [2.1.4] - 2021-07-06
### Fixed
- Var name typos in `scope.ensureSpecialRows()`

## [2.1.3] - 2021-07-06
### Added
- Reports now also show data about which variables were used on each page, as well as a list of which variables from a story table were used and which weren't.

## [2.1.2] - 2021-07-04
### Changed
- Refactor `scope.processVar()`, including rename

## [2.1.1] - 2021-07-04
### Changed
- Use new Buffer reference instead of old deprecated reference.

## [2.1.0] - 2021-07-01
### Added
- Support interview filenames ending in `.yml` in the first step

## [2.0.0] - 2021-06-29
### Added
- Support for `.there_is_another` loops in story tables using `.target_number`
- New step: 'I should see the link to' and its test.
- 'I get to' is available in the `And I get to the question "some id" with this data:` instead of just 'the user gets to'
- Add some warnings/feedback for the developer.
- Tests for some observational Steps.
- Tests for some interactive Steps.
- Tests for Assembly Line package-specific tests.
- Move debug logs for getMatchingRow and getPageData to appropriate places.

### Changed
- Added `trigger` column to table to define trigger var (| var | value | checked | trigger |). See https://github.com/plocket/docassemble-cucumber/issues/256. This allows devs to use index vars and generic objects (proxy vars) freely in their interview.
- Tried to make element selectors more picky.
- Make screenshot names unique and line up alphabetically with timestamps.
- Allow more languages in scenario name.
- Different data structure for matches - check one field at a time - and replace `page_data` with `fields`.
- Remove the need for the `checked` story table column and prop by: 1) Moving the `value` of checkboxes into their var name column. 2) Moving the `checked` value of checkboxes into the `value` column.
- Combined checkbox encoding matching regex into one regex.
- Steps setting choices now work the same as the story tables - only two values given. No need for a 'trigger' column value.
- Updated tests to match new functionality.

### Deprecated
- Previous formats of the table: `| var | choice | value |` *and* `| var | value | checked |`

### Removed
- Some Steps that won't work with translations and are not currently being used by anyone. TODO: Look up and ennumerate which steps.
- `checked` column.
- `scope.getField()` and other now unused scope functionality.

### Fixed
- Assert found invalid input.
- 'I sign' was passing incorrect arguments.
- Regex testing for match to proxy var - both the regex itself being more strict and the test for a match being more predictable.
- #202 handles accidental mixup of single quotes for double quotes or visa versa in all columns.

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
