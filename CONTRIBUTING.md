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

## Running internal tests

### Setup and takedown

Only run this the first time you run our internal tests. That will install the code that you will test onto the docassemble server:

```bash
npm run setup
```

If you run `takedown`, you will then have to run `setup` again:

```bash
npm run takedown
```

Use the syntax below to trigger all tests that should be passing[^1] (`pass` and unit tests):

```bash
npm run test
```

Run only cucumber tests that should pass:

```bash
npm run pass
```

Run deliberately failing cucumber tests:

```bash
npm run fail
```

Run all cucumber tests, even those that are incorrectly failing:

```bash
npm run cucumber
```

Run tests with specific cucumber tags or tag expressions:

```bash
npm run cucumber @tagname
```

Run only unit tests:

```bash
npm run unit
```

If you or someone else changes the interview code in `./docassemble/ALKilnTests/data/questions/*.yml`, you have to clean up the old code on the server before running `setup` again:

```bash
npm run takedown
```

## Updating dependencies

To add or update a dependency, edit `package.json` with an exact version. That means avoid notations like `^`, `~`, and `x`. Then run `npm install` and `npm shrinkwrap` to update `npm-shrinkwrap.json`.

## How one type of GitHub setup runs tests

Our tests require the user/interview author/developer to have a docassemble server on which they host these interviews (online forms) and at least one developer account. With our help, our users set up the tests to run when they commit new code to GitHub. When these GitHub tests run, ALKiln does the following:

1. Sets up on the docassemble server.
   1. In a given docassemble developer account's Playground it creates a new Project.
   1. Pulls in the code from the given branch into the new Project.
1. Runs the tests
   1. Pretends to be an anonymous or signed-in account that comes to the form and inputs answers.
   1. Writes up reports and creates other artifacts to show to the developer.
1. Cleans up by deleting the Project it created.

When the developer commits code to GitHub, their account triggers our code, passing along variables that our code needs, like their GitHub secret of the API key for their docassemble server developer account.

There are [other kinds of test you can read more about in the user documentation](https://assemblyline.suffolklitlab.org/docs/alkiln/setup). The differences can be subtle and hard to explain, but they each have their pros and cons.

## Very general architecture of files and folders

An honest look at our current project architecture—some of our files and folders, what they do, and how they interact.

### Logic architecture

ALKiln uses [cucumber](https://cucumber.io/docs/installation/javascript/)[^2] with [Gherkin](https://cucumber.io/docs/gherkin/reference/) syntax, [puppeteer](https://pptr.dev/), and [chai](https://www.chaijs.com/).

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

#### Setup and takedown logic

All of the setup and takedown logic is in the `./lib/docassemble` directory. It is named after the docassemble API code that is in there. Setup and takedown interact very closely with docassemble and the docassemble server API.

### .env

You need to copy [our `.env.example` file](https://github.com/SuffolkLITLab/ALKiln/blob/HEAD/.env.example). It has sensitive variables, like passwords. It also has custom values our tests need. Contact us to get involved with the project and get the sensitive information. We need to use environment variables in the same way our users do when they run their workflow files in their GitHub action. At the moment, it is the only way to pass values into ALKiln from a GitHub action.

### GitHub composite actions

Our `./action.yml` and `action_for_github_server/action.yml` are [composite actions](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action). The GitHub workflow files are there to trigger the code in these files. These composite actions install npm, install ALKiln. They execute the scripts in our `package.json` to set up the tests, run them, save the output of the tests - artifacts reports, errors, screenshots, etc. - clean up the tests, and output the reports back to the author's workflow files.

### Internal tests

We have our own docassemble package inside our repo `./docassemble` folder to test our own code with its own interview files and `.feature` test files.

There are other files the docassemble package needs, like `./setup.py`, so if you see them around, don't worry about them.

If you want to run the tests, you can go to the [instructions for running tests section](#running-internal-tests) in this README.

#### .feature and .yml files

The `.feature` are in `./docassemble/ALKilnTests/data/sources/*.feature`. They're written in Gherkin, a syntax cucumber uses. The "code" in there relies on the functions set up in `./lib/steps.js`. For example:

```js
// The test_something.feature file Step
Then I sign

// relies on the code in steps.js
Then('I sign', { timeout: -1 }, async () => {
  return wrapPromiseWithTimeout(
    scope.steps.sign( scope ),
    scope.timeout
  );
});
```

See [the documentation](https://assemblyline.suffolklitlab.org/docs/alkiln/writing) for other examples.

The `.yml` interviews (online forms) those tests go to are in `./docassemble/ALKilnTests/data/questions/*.yml`.

#### Unit tests

Our unit tests are in `./tests/unit_tests` and their filenames end in `.test.js`. Like some of the cucumber Steps, they use chai for assertions. The fixtures for the tests are also contained in that folder and end in `.fixtures.js`.

We also validate our log codes. Log codes help identify specific messages the user gets. An example of a log code is `ALK0105`. We want to avoid repeating or leaving out log code numbers, so we check those log codes before pushing or merging. That test, a bash file, is also in `./tests/unit_tests`.

#### GitHub workflow files

Like our users, we use GitHub workflow files in `.github/workflows` to trigger the ALKiln composite actions. These files do their best to act as the most up-to-date demonstration of what an ALKiln workflow file can look like. They contain notes for our users to try to help them adjust the code to their purposes. It's not ideal, but they're the files that we can update most reliably.

Those files use [environment variables that store sensitive information and custom variables](#env).

We also use workflow files to trigger our unit tests and our log codes validation.

### Logging

`./lib/utils/log.js` and `./lib/utils/reports.js` take care of logging information of various kinds (normal, debug, error) to the command line in ways we hope are useful, as well as building files to store the same information. We should probably find a logging library instead, but this is what we have for now. An important feature is that it ensures the messages clearly belong to ALKiln and not to some other process.

### session_vars.js

The `./lib/utils/session_var.js` file keeps track of what you might otherwise think of as environment variables. We like to think of them as constants, but some of them do need to go through functions, so for consistency we get them all through functions. It is also easier to test them when they are functions.

### Bash commands

ALKiln is a command line tool to avoid some complexity in GitHub actions, increase security, and align with what this framework has grown into. When you `npm run` the scripts in our `./package.json` they will setup, run, or take down tests.

### Files that you probably don't need to look at

`index.js` and `world.js` are short files that cucumber needs.

## Footnotes

[^1]: Some of our tests are sometimes in a failing state. For example, at times docassemble has changed its behavior and accessibility tests have failed. Those problems take a while to update and in the meantime we still need to continue development. For that reason, we sometimes mark tests with the tag `@temp_error`.
</br></br>We have tests that pass when they cause errors. They let us test our own error messages and error behavior. They will log an `F` in the console and yet those Scenarios will still pass.
</br></br>We also have some tests that cause actual errors so we can see their proper behavior. We have to run those manually and we avoid running them on GitHub. They have the tag `@error`.

[^2]: To be clear, our framework is a misuse of cucumberjs. cucumberjs is geared towards behavior driven development. We try to make BDD available to our developers, but it's not always possible and not necessarily our goal.
