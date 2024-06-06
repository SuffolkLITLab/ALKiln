# ALKiln

ALKiln, or Assembly Line Kiln, is an open source project that helps [docassemble](https://docassemble.org/) developers create automated tests for their interviews (online forms). It works well with the [Document Assembly Line Project](https://suffolklitlab.org/docassemble-AssemblyLine-documentation) but isn't dependent on it.

<!-- 
https://github.com/18F/open-source-guide/blob/18f-pages/pages/making-readmes-readable.md
√ What is this repo or project? (You can reuse the repo description you used earlier because this section doesn’t have to be long.)
√ How does it work?
√ Who will use this repo or project?
√ What is the goal of this project?
-->

## Use ALKiln

Read about how to use [this framework in Assembly Line's documentation](https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/intro).

If you have questions or need to report a bug, [start a new issue](https://github.com/SuffolkLITLab/ALKiln/issues/new).

The following documentation is for internal developers—those working on ALKiln itself.

## Our code

Our code pretends to be a human interacting with online forms (interviews) that have been made with the [docassemble](https://docassemble.org) open source platform. It looks at the HTML DOM, manipulates it, and interacts with it.

It uses [cucumber](https://cucumber.io/docs/installation/javascript/), [puppeteer](https://pptr.dev/), and [chai](https://www.chaijs.com/).

## Our users

Our users are developers of online forms (interviews). Usually they're very new to coding and are unfamiliar with GitHub and with a lot of coding concepts. If they know how to code, it tends to be in Python because that's what docassemble uses. They usually don't have the resource or funding to put into learning these skills.

For example, a pro bono law firm is trying to write a form that people can use to create a restraining order. They're coding it using docassemble. Their users are already going through a hard time, and the forms make them outline their heart wrenching experiences in detail. The developers need to make sure their users don't get system errors right in the middle of that. They use our framework to run the end-to-end tests.

They do good work and we hope to give them a less code-focused way to automate their testing. They avoid having to learn Javascript, GitHub actions, and other such things.

To do that, we use [cucumberjs](https://cucumber.io/docs/installation/javascript/), which uses [Gherkin](https://cucumber.io/docs/gherkin/reference/) syntax to give a user/developer a more human-like syntax to instruct alkiln on what answers to give to the user's online form.

## Contributing

Read about contributing in our [CONTRIBUTING.md document](CONTRIBUTING.md). Here's a quick cheat sheet for some commands once you're up and running:

## Cheat sheet

*Once you've already read the contributing documentation, you can use these as quick reminders for running our internal tests.*
To set up for the integration tests, create the project on the server:

```bash
npm run setup
```

Use the syntax below to trigger specific tags:

```bash
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
