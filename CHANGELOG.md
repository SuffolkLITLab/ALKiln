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

### Internal
- 
-->

<!-- ## [Unreleased] -->

## [5.5.0] - 2023-10-27

### Added
- Added a github action that allows authors to run tests on an isolated server that ALKiln creates on GitHub. They will need to create a new GitHub workflow to run the action. This reduces flakiness that authors' servers can create during server reload caused by updating their config, pulling in a package with a module, and other such things. As with all tests, especially with end to end test, there will always be some flakiness.

### Fixed
- Continuing development of random input test: Deal with non-existent elements, add a default input `type` of 'text', only press 'Back' 10% of the time instead of potentially 50%, navigate back to the interview from an external link (that goes outside the server) if necessary. Also add more debug logs to help diagnose problems. https://github.com/SuffolkLITLab/ALKiln/pull/633

## [5.4.2] - 2023-10-22

### Changed
- Downloads are now faster! You won't have to wait for the full duration of a step (30 seconds by default) to download a file anymore. See [this PR](https://github.com/SuffolkLITLab/ALKiln/pull/798) for more details.

## [5.4.1] - 2023-10-18

### Internal
- BREAKS ALKilnInThePlayground v1.2.0 and below (as we discussed) as that project is still exploratory. Can now take the location of the "sources" folder or folders as an argument in the command line. The formats are `npm run cucumber @tags -- --sources=./foo` and `alkiln-run @tags --sources=./foo`.

## [5.4.0] - 2023-10-14

### Added

- New step to compare PDFs!
    - An example: `I expect the baseline PDF "something-in-sources.pdf" and the new PDF "downloaded.pdf" to be the same`
    - See [#774](https://github.com/SuffolkLITLab/ALKiln/pull/774) for more details.

## [5.3.0] - 2023-10-14

### Added
- Screenshots now come with an HTML file of the same page. Pages can be examined for their full errors and for accessibility details. Note that styles are weird because we don't control the page with js like docassemble does. Otherwise hidden elements are visible, etc. See [#763](https://github.com/SuffolkLITLab/ALKiln/issues/763).

### Fixed
- Fixed and improved error for accessibility failures. See [#744](https://github.com/SuffolkLITLab/ALKiln/issues/744).

### Internal
- Refatored report functions into their own file. See https://github.com/SuffolkLITLab/ALKiln/issues/770.
- Changed the format of the aXe file name to shorten it by avoiding repeating the scenario name.

## [5.2.1] - 2023-09-29

### Added
- New warning message to the developer when their date string doesn't have a `/` in it.

### Changed
- Told the user the url of the interview ALKiln tried to load. See https://github.com/SuffolkLITLab/ALKiln/issues/696.

### Fixed
- Restored Assembly Line custom datatype three-parts dates functionality. See https://github.com/SuffolkLITLab/ALKiln/issues/764.
- Fixed "today" not being converted into a date for custom datatypes.

## [5.2.0] - 2023-09-16

### Changed
- Make `I tap to continue` case insensitive to allow the author to match the capitalization of the button in Docassemble.

## [5.1.0] - 2023-08-12

### Added

- Comboboxes - can now fill in comboboxes on the latest Docassemble.

### Fixed

- Filling out a hidden field right after a date field triggered the date's calendar popup, which I believe ate the input for the next visible field.

## [5.0.2] - 2023-07-20

### Fixed

- Accept `SERVER_RELOAD_TIMEOUT_SECONDS` as an env var input in GitHub.

## [5.0.1] - 2023-07-18

### Changed

- Increment version of ALKiln that action.yml is using.

## [5.0.0] - 2023-07-18

### Added

- added additional functionality to the sign method to allow developers to take a name argument to sign on canvas: issue #596
- A new script: `alkiln-run`, which acts like `npm run cucumber`, but can
  be run in any directory, not just in an npm package.
- Additional environment variables and their validation to allow for tests that run on a developer's server/Playground instead of through GitHub. Also, other functionality for that purpose. [Issue #661](https://github.com/SuffolkLITLab/ALKiln/issues/661)
- Tests for new session_vars behavior and improve previous tests.
- Adds `npm-shrinkwrap.json`, so installs from npm will have fixed version dependencies.
- Allow author to specify loops with only `.target_number`. e.g. to leave out `.there_are_any`. See [issue #706](https://github.com/SuffolkLITLab/ALKiln/issues/706) and Story Table documentation in docs folder.

### Changed

- BREAKING: the github action no longer runs `npm run XYZ`; it directly calls scripts,
    e.g. `alkiln-setup`, `alkiln-run`, `alkiln-takedown`
- BREAKING: Remove EXTRA_LANGUAGES env var as languages are being handled through cucumber `Examples` now.
- upgraded cucumber v8.6.0
- using cucumber's JS API to run tests. For more details on how it works,
    see [the cucumber-js docs](https://github.com/cucumber/cucumber-js/blob/main/docs/javascript_api.md).
- don't print the ["publish this cucumber report" message](https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md#options)
- Adjusted validation of some environment variables to account for Playground vs. GitHub or local test runs. [Issue #661](https://github.com/SuffolkLITLab/ALKiln/issues/661)
- Docassemble Project name prefix now includes ALKiln in it for clarity
- Change interface for testing languages. See [#713](https://github.com/SuffolkLITLab/ALKiln/issues/713).
- Freeze all npm package versions.

### Fixed

- DOCKER UPDATE (for ALKilnInThePlayground): Allows ALKilnInThePlayground to upload files. See <https://github.com/SuffolkLITLab/docassemble-ALKilnInThePlayground/issues/18>. This may require some developers to update their system (updating their docker image) if they are below [docassemble-os 1.0.8](https://github.com/jhpyle/docassemble-os/releases/tag/v1.0.8). You can tell if you are below docassemble-os 1.0.8 if you run `docker image inspect jhpyle/docassemble | grep Created` on your host server (Lightsail, etc.) and the created date is before 2023-04-09. You can update as described in [the documentation](https://suffolklitlab.org/legal-tech-class/docs/practical-guide-docassemble/maintaining-docassemble#updates-to-the-docassemble-container). Updating to a new docker images is something that all docassemble users will have to do sometime anyway, sometimes for security.
- Conform upload file behavior to that of other Story Table rows - avoid erroring when field isn't set properly unless using all variables is required.
- Projects created in da each have a unique name. <https://github.com/SuffolkLITLab/ALKiln/issues/663>
- Shorten path names to try to accommodate limitations of windows systems while still keeping enough useful information to help devs identify the test outputs. <https://github.com/SuffolkLITLab/ALKiln/issues/618>
- Updated field decoding to handle new object field encoding. See [#711](https://github.com/SuffolkLITLab/ALKiln/issues/711)
- Allow multiple languages to be tested again. See [#713](https://github.com/SuffolkLITLab/ALKiln/issues/713).
- Fill in time fields correctly. See [#726](https://github.com/SuffolkLITLab/ALKiln/pull/726).
- Allow `.target_number` to be 0. See <https://github.com/SuffolkLITLab/ALKiln/issues/706>.
- Use the right number of loops for `.target_number`. See <https://github.com/SuffolkLITLab/ALKiln/issues/706>.

### Security

- Pass docassemble API keys through HTTP headers instead of as parameters.
  - Parameters to certain HTTP requests are printed directly in docassemble's
    uWSGI log, leaking API keys to actors with log access on your docassemble
    server
- Update dependencies. See [#727](https://github.com/SuffolkLITLab/ALKiln/pull/727).

### Internal

- added a test for multiline json values (only ones set by code not by user input)
- added an internal section to the change log

## [4.11.1] - 2023-03-21

### Changed

- Get error data from server errors

## [4.11.0] - 2023-03-13

### Changed

- Shorten Axios errors to make them more readable (<https://github.com/SuffolkLITLab/ALKiln/pull/632>)

## [4.10.4] - 2023-02-15

### Added

- Contribution docs

### Fixed

- #511, couldn't take screenshots of signature pages <https://github.com/SuffolkLITLab/ALKiln/issues/511>

## [4.10.3] - 2023-01-11

### Removed

- Internal - ignore local test output files. Part 2 of the process out of 2.

## [4.10.2] - 2023-01-11

### Removed

- Internal - deleted unignored local files (since adding .npmignore). Part 1 of the process out of 2.

## [4.10.1] - 2023-01-07

### Changed

- Fix artifacts not being saved in GitHub. See <https://github.com/SuffolkLITLab/ALKiln/issues/629>.
- Make internal test folder names a bit simpler and more modular-izable.

## [4.10.0] - 2022-11-17

### Changed

- Don't mark `...there_in_another | False |` in story tables as invalid, as it's necessary for some
  workflows (see <https://github.com/SuffolkLITLab/ALKiln/pull/580> for a longer discussion).
  - Explicitly **not** documented, as we don't want to encourage people to use it if it's not
    necessary for their interviews.
- continuing between screens will no longer press button with the `btn-primary` class. This means
  that it won't press "Exit", or "Restart" buttons, to avoid getting in an infinite loop.
- Shorten test report and artifact filenames, attempting to have fewer files whose whole paths are
  longer than 260 characters. (See <https://github.com/SuffolkLITLab/ALKiln/pull/626> for details).

### Fixed

- Corrects the month in the artifact folder timestamp; was printing things like `81` for September
  instead of `09`, because of a `+` being interpreted as Javascript string concatenation and not math.

## [4.9.3] - 2022-09-07

### Fixed

- `retry` of failed tests not implemented for developers. See <https://github.com/SuffolkLITLab/ALKiln/issues/601>.

## [4.9.2] - 2022-09-02

### Fixed

- Environment variables `SERVER_RELOAD_TIMEOUT_SECONDS` and `MAX_SECONDS_FOR_SERVER_RELOAD` were being used as milliseconds instead of seconds. See <https://github.com/SuffolkLITLab/ALKiln/issues/606>.

## [4.9.1] - 2022-09-01

### Fixed

- runtime_config.json gets created when needed when artifacts folder is created. See <https://github.com/SuffolkLITLab/ALKiln/issues/600>.

## [4.9.0] - 2022-09-01

### Changed

- Allow devs to test an arbitrary interview. See <https://github.com/SuffolkLITLab/ALKiln/issues/600>.
- Create artifacts folder even when setup has been skipped. See <https://github.com/SuffolkLITLab/ALKiln/issues/600>.

## [4.8.0] - 2022-08-30

### Changed

- Date for filenames. Format date in y-m-d format instead of d-m-y that it had by default. Include ms.

## [4.7.2] - 2022-08-09

### Changed

- Inform the developer when a test failure may have been caused by a server reload. See <https://github.com/SuffolkLITLab/ALKiln/issues/392>.
- Retry all failing tests once.

## [4.7.1] - 2022-08-07

### Changed

- Ensure unique folder names for random input screenshots in case developer uses multiple random steps in one Scenario.
- Ensure random input detects unexpected interview errors.

### Fixed

- Fix failure when signature page is the first screen.
- Internal tests failing even when failure status is as expected.
- Double printing in report of scenario failure, one of them even when Scenario was possibly non-failure, like skipped.

## [4.7.0] - 2022-07-27

### Added

- Generate random input to fill out a simple form automatically. Does not yet ensure that random screenshot folder names are unique, or that error screens are detected as errors. 4.7.1 implements those.

### Changed

- Add page id to the "Missing Variable or variables on page" error report
- Allows Story Tables to not include a header row, as long as they have 2 or 3 columns.
  This isn't the suggested way at the moment, since including headers is more readable,
  but can prevent confusing and unnecessary errors.

## [4.6.2] - 2022-06-28

### Changed

- Put cucumber tests' artifacts in one folder. See <https://github.com/SuffolkLITLab/ALKiln/issues/552>.
- Add separate artifacts dir for our own internal tests, like unit tests
- Abstract names of some of those artifact directories

## [4.6.1] - 2022-06-28

### Fixed

- Single dropdown fields on pages are now recognized as fields properly

## [4.6.0] - 2022-06-10

### Added

- Steps to test web accessibility either on individual page or for all subsequent pages.

## [4.5.2] - 2022-06-10

### Fixed

- (internal) Expected in report is reset properly
  - if a test used "the Scenario report should include ...", then all tests that were
    run after that would pass even if the test itself failed but wasn't expected to fail

## [4.5.1] - 2022-06-10

### Fixed

- Corrected some schema errors in the `action.yml` (the `run` key was specified twice, should only have been once, and `required: False` is needed
  for optional inputs)

## [4.5.0] - 2022-05-23

### Added

- Steps that tap tabs (made using the `tabbed_templates_html` function from ALToolbox) and other arbitrary elements on the page.

## [4.4.0] - 2022-05-23

### Added

- Appends the results of the cucumber [summary formatter](https://github.com/cucumber/cucumber-js/blob/main/docs/formatters.md#summary) to the `debug_log.txt`, which includes useful stack traces into the Kiln code when tests fail.

### Fixed

- Prevent login info from being saved in the report or screenshots being taken on error. [#599](https://github.com/SuffolkLITLab/ALKiln/issues/559).
- Prevent error screenshots of screens that used a secret.

## [4.3.0] - 2022-04-07

### Added

- GitHub environment variable `MAX_SECONDS_FOR_SETUP` to set a custom maximum time for setup and takedown for packages that take a long time to load.

## [4.2.0] - 2022-04-05

### Changed

- Pin versions of dependencies in action.yml and package.json
- Change log.txt file to debug_log.txt and upload as github artifact.
- Update cheerio version to remove vulnerabilities.

## [4.1.1] - 2022-04-01

### Added

- Step to set vars to secret variables. That is, using environment variables while hiding the names of those variables in the report, errors, and console logs.

## [4.0.0] - 2022-03-30

### Added

- BREAKING: Add package.json creation/overwriting to action.yml. Simplify package.json.
- BREAKING: Add action.yml that runs most of what users' workflows run now, along with notes for a new user workflow that will take less maintainance. See #420. We need to add documentation on how to write a workflow file as it currently is if they want to take back control. Setup interview has not yet been updated with this workflow.
- Step: `the text in the JSON variable "variable_with_text_value" should be`. Compare JSON variable with a text value to given text. See #470. Does not accept nested values, e.g. "child.name.first". Downloads all the JSON vars to a .json file in the "downloads" artifacts.
- Step to log the page's JSON variables and values in the report. Future goal: save to file. See #454.
- Step to log into the developer's docassemble server account using GitHub SECRETs. See #499.
- Create log.txt for report items and uploaded as github artifact so there's always some kind of output.
- Add control of alkiln npm version to the action.yml

### Changed

- BREAKING: NPM package is now suffolklitlab scoped package. Refer to @suffolklitlab/alkiln from now on.
- BREAKING: Update to v13 of puppeteer
- BREAKING: Update to v7 of cucumber
- BREAKING: Update action.yml node to v17
- BREAKING: Use alkiln v4 package.json we create during the test run in `action.yml` (as discussed in #489)
- BREAKING: Use API key to access da server, create projects, pull code, delete projects, and check for server restart.
- BREAKING: Throw an error for uploading nonexistent file, changed to error instead of warning in reports.
- Update test setup interview to v4 of ALKiln.
- Remove and ignore package-lock.json so that our tests will behave more like our users' tests
- Add warning in steps.js for name input with too many parts. Add test in reports.
- fix typo in the report
- Allow a developer to wait as a first Step. See #387.

<!-- ## [3.0.1-peer-deps.1] - 2021-12-07 -->
### Removed

- Peer dependencies and dev dependencies. Now `cucumber` is just a dependency. See <https://github.com/SuffolkLITLab/ALKiln/issues/396> for discussion. Setup interview has not been updated to remove dependencies.

### Fixed

- Proxy var story table row matches for any page containing the given variable name when there's only one row for the relevant variable. #464.
- Fixed interview name not allowing url parameters. #449
- Freeze colors npm package to before bug in both package.json and action.yml
- Fix invalid project name allowed.
- fix typo in the report.
- session_vars branch path regex not removing start of branch path

## [3.2.1] - 2022-02-09

### Fixed

- Typo in report that was messing up copy/paste of test table

## [3.2.0] - 2022-02-09

### Added

- Add Step to log into server account using GitHub SECRETs (environment variables). See #499.

## [3.1.11] - 2022-02-02

### Changed

- Handle an Assembly Line name Step value that has too many names, including a warning for the developer. Include the first three names and the last name to try to catch suffixes.

## [3.0.11] - 2022-01-25

### Added

- Step: `the text in the JSON variable "variable_with_text_value" should be`. Compare JSON variable with a text value to given text. See #470. Does not accept nested values, e.g. "child.name.first". Downloads all the JSON vars to a .json file in the "downloads" artifacts.

## [3.0.10] - 2022-01-24

### Added

- Step to log the page's JSON variables and values in the report. Future goal: save to file. See #454.

## [3.0.9] - 2022-01-10

### Security

- Install the security fix in the action's package.json as well. Because dependents have to require cucumber itself, if they're not using our action (if they have their own package.json), they're going to have to implement this fix in their repo too. That's why our fix isn't working. We'll start the process of helping developers update. We also need to deprecate all previous versions of ALKiln. See #489.

## [3.0.8] - 2022-01-10

### Security

- Fully publish the security fix in v3.0.7

## [3.0.7] - 2022-01-10

### Security

- Pinned colors library to 1.4.0. See <https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/>. We don't use faker, so we don't need to handle that.

## [3.0.6] - 2022-01-07

### Changed

- See #371
- Scenario heading tags are now on a second line
- Artifact filenames use dashes more and are created separately from Scenario headings
- Scenario ids are separated from filenames and Scenario headings

## [3.0.5] - 2022-01-06

### Added

- Add action.yml that runs most of what users' workflows run now, along with notes for a new user workflow that will take less maintainance. See #420. We need to add documentation on how to write a workflow file as it currently is if they want to take back control. Setup interview has not yet been updated with this workflow.
- Add package.json creation/overwriting to action.yml. Simplify package.json.

<!-- ## [3.0.1-peer-deps.1] - 2021-12-07 -->
### Removed

- Peer dependencies and dev dependencies. Now `cucumber` is just a dependency. See <https://github.com/SuffolkLITLab/ALKiln/issues/396> for discussion. Setup interview has not been updated to remove dependencies.

### Fixed

- Fixed interview name not allowing url parameters. #449

## [3.0.4] - 2021-12-11

### Fixed

- Use different criteria for testing that the package was saved.

## [3.0.3] - 2021-12-11

### Fixed

- Implement a temporary fix for inability to pull private repos into empty da Projects. See <https://github.com/SuffolkLITLab/ALKiln/issues/417#issuecomment-991812294>

## [3.0.2] - 2021-12-10

### Changed

- Improve some error messages and handling for the new private repo workflow.

## [3.0.1] - 2021-12-10

### Fixed

- Allow authenticated GitHub user to pull from a private repository for which they have at least read permissions.

## [3.0.0] - 2021-12-07

### Changed

- v3 release to update to da Bootstrap 5. Breaks for servers that have not yet updated to that da version.

## [2.7.0-pre-update-dom.4] - 2021-12-03

### Changed

- Give test resetting, a common failure point, a couple of tries and add a warning and instructions about simply re-running the tests.

## [2.7.0-pre-update-dom.3] - 2021-12-02

### Fixed

- Abandon puppeteer clicks and handle them all ourselves. This means people can't run a mobile device because they can't tap. It takes some implementation. See <https://stackoverflow.com/a/56547605/14144258>.

## [2.7.0-pre-update-dom.2] - 2021-12-02

### Fixed

- Quick fix for frequent timeout errors. See <https://github.com/SuffolkLITLab/ALKiln/issues/389#issuecomment-984844240>, Option 1 - disable cucumber timeout and, instead, handle timeout errors to allow 3 attempts to load an interview. For future development, convert to API key to check if server is restarting.

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
- Not waiting for package page to appear on setup: <https://github.com/plocket/docassemble-cucumber/issues/367#issuecomment-892591770>. I believe we tried this in the past and it wasn't enough.

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

- Added `trigger` column to table to define trigger var (| var | value | checked | trigger |). See <https://github.com/plocket/docassemble-cucumber/issues/256>. This allows devs to use index vars and generic objects (proxy vars) freely in their interview.
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

- This repo no longer has an action to generate test folders and scripts in the dependant repo. From now on, devs will use the interview in <https://github.com/plocket/docassemble-ALAutomatedTestingTests> to add it themselves. Note: That interview will put the tests in the `/sources` dir. Previous repos' scripts will continue as they are.

## [1.3.2] - 2021-04-07

### Changed

- Each test run creates a unique da Project now. No need to wait for previous tests to finish.

## [1.3.1] - 2021-04-07

### Fixed

- Message about duplicate selector matches.
- Bump *minor* version number appropriately.

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