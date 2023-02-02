# ALKiln

ALKiln, or Assembly Line Kiln, is an open source project that helps [docassemble](https://docassemble.org/) developers create automated tests for their interviews (online forms). It works well with https://github.com/suffolklitlab/docassemble-AssemblyLine but isn't dependent on it.

<!-- 
https://github.com/18F/open-source-guide/blob/18f-pages/pages/making-readmes-readable.md
√ What is this repo or project? (You can reuse the repo description you used earlier because this section doesn’t have to be long.)
√ How does it work?
√ Who will use this repo or project?
√ What is the goal of this project?
-->

## Use ALKiln
Read about how to use this framework at https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/.

If you have questions or need to report a bug, [start a new issue](https://github.com/SuffolkLITLab/ALKiln/issues/new).

# Project overview

## Our code

Our code is a bot that pretends to be a human interacting with online forms (interviews) that have been made with the [docassemble](https://docassemble.org) open source platform. It looks at the HTML DOM, manipulates it, and interacts with it.

It uses [cucumber](https://cucumber.io/docs/installation/javascript/), [puppeteer](https://pptr.dev/), and [chai](https://www.chaijs.com/).

## Our users

Our users are developers of online forms (interviews). Usually they're very new to coding and are unfamiliar GitHub and with a lot of coding concepts. If they know how to code, it tends to be in Python. They usually don't have the resource or funding to put into learning these skills.

They do good work and we hope to give them a less code-focused way to automate their testing. They avoid having to learn Javascript, GitHub actions, and other such things.

To do that, we use [cucumberjs](https://cucumber.io/docs/installation/javascript/)[1], which uses [Gherkin](https://cucumber.io/docs/gherkin/reference/) syntax to give a user/developer a more human-like syntax to instruct alkiln on what answers to give to the user's online form.

## How the tests run

This section requires knowledge of the docassemble platform a bit, as well as GitHub actions, so be ware. We're working on improving this.

Our tests require the user/developer to have a docassemble server on which they host these interviews and at least one developer account. When GitHub runs the tests, it does the following:

1. Sets up on the docassemble server. In a given developer account:
   1. Creates a new interview (online form) for this particular branch of the repository.
   1. Pulls in the code from that branch into the docassemble server.
1. Runs the tests
   1. Pretends to be an anonymous account that comes to the form and inputs answers.
   1. Writes up reports and possibly takes screenshots to show to the developer.
1. Cleans up by deleting the interview it created

The developers have a GitHub action that is really just a wrapper. It uses a composite action in our repository and gives important variables, like their GitHub secret of the API key for their docassemble server developer account.

# Contributing

Read about contributing in our [CONTRIBUTING.md document](CONTRIBUTING.md). Here's a quick cheat sheet for some commands once you're up and running:

## Cheat sheet
To setup for the integration tests, create the project on the server:
```
npm run setup
```

Use the syntax below to trigger specific tags:
```
npm run cucumber -- "--tags" "@tagname"
```

To run the unit tests in isolation:
```
npm run unit
```

When done you want to test a new branch or test files have been updated, clean up before setting up again:
```
npm run takedown
```

# Footnotes

[1] To be clear, our framework is a misuse of cucumberjs. cucumberjs is geared towards behavior driven development. We try to make BDD available to our developers, but it's not always possible and not necessarily our goal.
