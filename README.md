# ALKiln

ALKiln, or Assembly Line Kiln, is an open source project that helps [docassemble](https://docassemble.org/) developers create automated tests for their interviews (online forms). It works well with https://github.com/suffolklitlab/docassemble-AssemblyLine but isn't dependent on it.

This documentation is for internal developers—those working on ALKiln itself.

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

## Our code

Our code pretends to be a human interacting with online forms (interviews) that have been made with the [docassemble](https://docassemble.org) open source platform. It looks at the HTML DOM, manipulates it, and interacts with it.

It uses [cucumber](https://cucumber.io/docs/installation/javascript/), [puppeteer](https://pptr.dev/), and [chai](https://www.chaijs.com/).

## Our users

Our users are developers of online forms (interviews). Usually they're very new to coding and are unfamiliar with GitHub and with a lot of coding concepts. If they know how to code, it tends to be in Python because that's what docassemble uses. They usually don't have the resource or funding to put into learning these skills.

For example, a pro bono law firm is trying to write a form that people can use to create a restraining order. They're coding it using docassemble. Their users are already going through a hard time, and the forms make them outline their heart wrenching experiences in detail. The developers need to make sure their users don't get system errors right in the middle of that. They use our framework to run the end-to-end tests.

They do good work and we hope to give them a less code-focused way to automate their testing. They avoid having to learn Javascript, GitHub actions, and other such things.

To do that, we use [cucumberjs](https://cucumber.io/docs/installation/javascript/), which uses [Gherkin](https://cucumber.io/docs/gherkin/reference/) syntax to give a user/developer a more human-like syntax to instruct alkiln on what answers to give to the user's online form.

## How the tests run

This section requires knowledge of the docassemble platform a bit, as well as GitHub actions, so be wary. We're working on improving this.

Our tests require the user/developer to have a docassemble server on which they host these interviews and at least one developer account. When GitHub runs the tests, it does the following:

1. Sets up on the docassemble server. In a given developer account:
   1. Creates a new interview (online form) for this particular branch of the repository.
   1. Pulls in the code from that branch into the docassemble server.
1. Runs the tests
   1. Pretends to be an anonymous account that comes to the form and inputs answers.
   1. Writes up reports and possibly takes screenshots to show to the developer.
1. Cleans up by deleting the interview it created

The developers have a GitHub action that is really just a wrapper. It uses a composite action in our repository and gives important variables, like their GitHub secret of the API key for their docassemble server developer account.

## Contributing

Read about contributing in our [CONTRIBUTING.md document](CONTRIBUTING.md). Here's a quick cheat sheet for some commands once you're up and running:

## Cheat sheet

*Once you've already read the contributing documentation, you can use these as quick reminders for running our internal tests.*
To set up for the integration tests, create the project on the server:
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

If you or someone else changes the interview code in `./docassemble`, you have to clean up the old data on the server before running `setup` again:
```
npm run takedown
```
