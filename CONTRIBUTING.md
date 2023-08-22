# Contributing

For documentation changes, you can just edit and make a pull request. Ignore the instructions below.

## Setup

If you are not already in contact with us, you can join the #assembly-line-test channel in the [docassemble Slack](https://docassemble.org/docs/support.html#tocAnchor-1-1) or [make a new issue](https://github.com/SuffolkLITLab/ALKiln/issues/new) and mention @niharikasingh to let us know you're interested.

1. Asking to join as a contributor is simplest. You can fork, but you will have to change lines in your `.env` file and may have to set GitHub secrets in your repository. You have to talk to us either way.
1. Clone the repository locally: `git clone git@github.com:SuffolkLITLab/ALKiln.git`
1. Run `npm install`
1. Create [your `.env` file](#env) at the root of the project.
1. Contact @niharikasingh to get important information for your `.env` file.
1. Run `npm run setup`

Advanced contributors: If you're going to work on our docassemble internal testing interviews, do so as a contributor on this repository. Avoid forking if you can. The reasons are complex. If you feel a need to fork, reach out to us.

## PRs

Before making a pull request

1. Search issues to see if what you are thinking of has been discussed yet.
1. Make an issue about the change you are thinking of.
1. Assign yourself to an issue.
1. Make a new branch.
1. Make your edits. Feel free to [run tests](#running-internal-tests) as you go.
1. When you're ready to push
   1. Run `npm run test` to make sure your code passes all our tests.
   1. Make an entry in the `CHANGELOG.md` describing your change.
   1. AVOID changing the version number. We'll do that after merging your changes.
   1. If needed, update the `README.md` (e.g. the cheat sheet section) and/or `CONTRIBUTING.md` docs. Changes to our architecture might require editing `CONTRIBUTING.md`.
1. Push to GitHub.
1. Wait for the GitHub tests to pass. You may have to re-run failing tests—server restarts or race conditions may interfere with them. We have reduced them greatly, but some are impossible to avoid.
1. Make your pull request. Work in progress pull requests are great too. A pull request must be reviewed before it can be merged.

## .env

You need to make your own `.env` file. It contains sensitive variables, like passwords. We use them for our internal tests. The file should look something like the below:

```bash
# For everyone

DOCASSEMBLE_DEVELOPER_API_KEY=<ask @niharikasingh>
SERVER_URL=https://apps-dev.suffolklitlab.org
REPO_URL=https://github.com/SuffolkLITLab/alkiln
SERVER_RELOAD_TIMEOUT_SECONDS=
MAX_SECONDS_FOR_SETUP=

# For internal tests

# Set DEBUG to 1 to run in non-headless mode and see the test run live
DEBUG=
# If you edit interview files (.yml files), you should push to a new 
# branch and update BRANCH_PATH to that branch name
BRANCH_PATH=v4
USER1_EMAIL=<ask @niharikasingh>
USER1_PASSWORD=<ask @niharikasingh>
SECRET_VAR1=secret-var1-value
SECRET_VAR2=secret-var2-value
SECRET_FOR_MISSING_FIELD=secret for missing field
SECRET_INVALID_THERE_IS_ANOTHER=invalid value for there_is_another
```

## Running internal tests

Only run this the first time you run tests in this repository to make the code available to test on the docassemble server:

```bash
npm run setup
```

If you run `takedown`, you will then have to run `setup` again.

Use the syntax below to trigger all tests (cucumber and unit tests):

```bash
npm run test
```

Run only cucumber tests:

```bash
npm run cucumber

# To test Features or Scenarios specific tags:
npm run cucumber -- "--tags" "@tagname"
```

To run the unit tests in isolation:

```bash
npm run unit
```

If you or someone else changes the interview code in `./docassemble`, you have to clean up the old data on the server before running `setup` again:

```bash
npm run takedown
```

## How the tests run

Our tests require the user/developer to have a docassemble server on which they host these interviews (online forms) and at least one developer account. With our help, our users set up the tests to run when they commit new code or to run manually. When GitHub runs the tests, it does the following:

1. Sets up on the docassemble server. In a given developer account:
   1. Creates a new interview for this particular branch of the repository.
   1. Pulls in the code from that branch into the docassemble server.
1. Runs the tests
   1. Pretends to be an anonymous account that comes to the form and inputs answers.
   1. Writes up reports and possibly takes screenshots to show to the developer.
1. Cleans up by deleting the interview it created

When the developer commits code to GitHub, their account triggers our code, passing along variables that our code needs, like their GitHub secret of the API key for their docassemble server developer account.

## Updating dependencies

Sometimes you will have to add dependencies to ALKiln. You can do so by adding the dependency in the `package.json` "dependencies" section, specifying an exact version. Then, run `npm install` to update `npm-shrinkwrap.json` to have the new dependency.

If you have to update an existing dependency, you can change the version in `package.json`, and run `npm install` to update `npm-shrankwrap.json`.

## Very general architecture of files and folders

An honest look at our current project architecture—some of our files and folders, what they do, and how they interact.

### Logic architecture

ALKiln uses [cucumber](https://cucumber.io/docs/installation/javascript/)[^1] with [Gherkin](https://cucumber.io/docs/gherkin/reference/) syntax, [puppeteer](https://pptr.dev/), and [chai](https://www.chaijs.com/).

#### .feature files

The `.feature` files are written in Gherkin, a syntax cucumber uses. The "code" in there relies on the functions set up in `./lib/steps.js`.

```js
// The test_something.feature file step
Then I sign

// relies on the code in steps.js
Then('I sign', { timeout: -1 }, async () => {
  return wrapPromiseWithTimeout(
    scope.steps.sign( scope ),
    scope.timeout
  );
});
```

#### steps.js

`./lib/steps.js` defines all the Gherkin sentences that our users (the developers) can write. See [cucumber documentation on defining steps](https://cucumber.io/docs/cucumber/step-definitions/?lang=javascript). We sometimes use "cucumber expressions" and, but often use regular expressions as we often want to be more flexible about the user's input.

The file handles things like:

* Creating state
* Defining steps for the users/developers
* Defining steps for internal testing, like testing for appropriate errors and error messages
* Finishing a Scenario
* Finishing all tests

#### scope.js

`./lib/steps.js` makes heavy use of `./lib/scope.js`, where most of the action happens. We have decided to mostly keep it in one file to avoid bouncing back and forth between files.

Many `./lib/steps.js` steps make use of the `scope.steps` object. It is there to avoid duplicating code between steps.

The file handles things like:

* Finding form fields on a page
* Filling out form fields
* Generating random data for form fields
* Waiting for pages to load
* Checking for server restarts
* Generating test report content

### Logging

`./lib/utils/log.js` takes care of logging information of various kinds (normal, debug, error) to the command line in ways we hope are useful. We should probably find a logging library instead, but this is what we have for now. An important feature is that it ensures the messages clearly belong to ALKiln and not to some other process.

### session_vars.js

The `./lib/utils/session_var.js` file keeps track of what you might otherwise think of as environment variables. We like to think of them as constants, but some of them do need to go through functions, so for consistency we get them all through functions. Also because it was easier to test them when they are functions.

### Setup and takedown logic

All of the setup and takedown logic is in the `./lib/docassemble` directory. It is named after the docassemble API code that is in there. Also, setup and takedown interact very closely with docassemble and the docassemble server.

Other files also use the docassemble API functions, so this folder is in a bit of a messy position.

### Bash commands

When you `npm run` the scripts in our `./package.json` you can setup, run, or takedown tests. We are working on converting this to a command line tool to avoid some complexity in GitHub actions, increase security, and align more with what this framework has grown into. (TODO: Define this better)

### GitHub composite action

Our `./action.yml` is a [composite action](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action). The users/developers let it do most of the work for them. It installs npm, installs our repo, then uses our repo to set up the tests, run the tests, generate and save reports, errors, and screenshots, and clean up the tests.

### Internal tests

We have our own docassemble package in our repo to test our own end-to-end tests. Most of what the package needs is in `./docassemble`. That docassemble package is what the test setup pulls into the docassemble server. Our internal end-to-end cucumber tests are `.feature` files that are stored in `./docassemble/ALKilnTests/data/sources`. The interview (online form) `.yml` files that those `.feature` files use are also deep in the `./docassemble` package. You probably won't be touching the interview files. If you get curious, feel free to ask us.

There are other files the docassemble package needs, like `./setup.py`, so if you see them around, don't worry about them.

Our unit tests are in `./tests/unit_tests` and their filenames end in `.test.js`. Like the cucumber tests, they use chai for assertions. The fixtures for the tests are also contained in that folder and end in `.fixtures.js`.

If you want to know the commands, you can go to the [instructions for running tests](#running-internal-tests).

### Files that you don't need to look at

`index.js` and `world.js` are short files that cucumber needs.

## Footnotes

[1] To be clear, our framework is a misuse of cucumberjs. cucumberjs is geared towards behavior driven development. We try to make BDD available to our developers, but it's not always possible and not necessarily our goal.
