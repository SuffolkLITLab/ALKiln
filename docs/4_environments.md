# Designing for the complexity of the 4 environments in which ALKiln can run

## Context and scope

Authors have different testing needs. For example, sometimes authors need to run individual tests more quickly as they are developing code and sometimes authors need to run a whole test suite on a weekly schedule to make sure their online forms keep working over time. To run individual tests more quickly, an author can run the tests directly on their development server. To run scheduled tests, an author can run tests on GitHub. Those are very different environments.

Internal ALKiln developers need to run tests in more environments as well.

To help with all these, ALKiln can work in 4 different environments. We have to design ALKiln's architecture with that in mind.

## Goals

- Help authors to test in the environments that best help them develop.
- Help internal ALKiln developers develop the framework comfortably enough.
- Keep openings where authors can interact directly with the systems we're using so they can customize behavior that we can't account for.

## Non/anti-goals

- Be an intermediary between the author and all the possible customization they need for their tests.

## The actual design

This design involves:

- The 4 environments, the ALKiln flow for each, and the advantages each environment has.
- The 4 separate command line commands.
- Passing information between different runtime processes.
- The 2 composite action scripts.

<!-- Maybe the flows below should each be shown in the relevant individual sections for each environment. -->

The flow for each environment is different.

The temporary GitHub docasseble server action:

1. Author workflow file > `./action_for_github/action.yml` > author workflow file > `./action.yml` > `alkiln-server-install` > `alkiln-run` > author workflow file

<!-- Not sure how to represent this relationship. Trying to show what processes have access to what parts of the process. I'm not sure showing how `./action.yml` threads in and out is actually useful. I'm trying to show that the author's workflow has access in between `./action_for_github/action.yml` and `./action.yml` where they can do things so when someone reads about it later, they can understand.

Author workflow
  `./action_for_github/action.yml`
Author workflow
  `./action.yml`
    `alkiln-server-install`
  `./action.yml`
    `alkiln-run`
  `./action.yml`
Author workflow

Author workflow
  `./action_for_github/action.yml`
Author workflow
  `./action.yml`
    `alkiln-server-install`
    `alkiln-run`
Author workflow
-->

A GitHub action that installs tests in an author's account on their own docasseble server:

1. Author workflow file > `./action.yml` > `alkiln-setup` > `alkiln-run` > `alkiln-takedown` > author workflow file

<!-- Not sure how to represent this relationship
Author workflow
  `./action.yml`
    `alkiln-setup`
    `alkiln-run`
    `alkiln-takedown`
Author workflow
-->

ALKilnInThePlayground:

1. `alkiln-run`

A local developer might customize these steps in various ways in their console. If they are using the default workflow, this is what it looks like functionally when they develop a feature:

1. Command line > `alkiln-setup` once
2. Command line > `alkiln-run` many times
3. Command line > `alkiln-takedown` once

### 4 environments we need to account for

#### 2 GitHub options

Authors or admins use GitHub workflows to run our GitHub composite actions if they:

- Want to run tests every time an author commits code.
- Want to run tests based on other triggers, like a schedule or manually triggering the workflow.
- They want to require that all tests pass before they merge a branch.
- Use other CI pipelines.

**Run on a temporary GitHub server**

1. Author: commits code to GitHub.
2. ALKiln: Creates a docassemble server, installs the docassemble package globally on the server, run the test suite once, and destroys the server.

Authors use this if they:

- Want less flake.
- Want to test with latest version of da.
- Don't mind extra setup time each test suite takes.
- Know how to use bash to work with a Docker container (if needed).

**Run from GitHub, but on their own server**

1. Author: commits code to GitHub.
2. ALKiln: Installs the docassemble package in the author's account on their own docassemble server, runs the test suite once, and deletes the docassemble package.

Authors use this if they:

- Want to Use data from SS3 and other remote databases.
- Want to test with their own version of docassemble.
- Don't want to have to be so careful with all their dependencies (like having to put all dependencies on pypi) because they have installed them on their server themselves.

#### Running directly on docassemble server

A docassemble server doesn't just serve forms to end users. It also lets authors develop the code of their forms[^1]. That is why it is useful to install and use ALKiln on an author's docassemble server. They do this by using the AlKilnInThePlayground package.

An author installs AlKilnInThePlayground package on their server. They run the online form that package has. That lets them install ALKiln on their server. The package can tell who the user is and offers the user a choice of which of their Playground development Projects to test, and they run the tests right their on their server.

1. Author: Installs the package they want to test into their account on the docassemble 1. server, edits their package, triggers the test run.
2. ALKiln: Runs tests.
3. Author: Edits, tests, and repeats. Finally, the author deletes the package in their account on the docassemble server.

Authors use this if they:

- Want to run tests faster than the GitHub test flow allows (a faster iteration cycle).
- Want to avoid server reloads (in the case of a package with python modules).
- Feel uncomfortable with failures on GitHub - they can get tests passing before pushing to GitHub.
- Have the right version of nodejs on their docassemble server, which is based on what Docker image they have installed.

#### Command line

<!-- Do we mention that internal devs don't always use the bins? They use the package.json scripts? Seems like an unnecessary complication. -->

1. Internal developer with ALKiln's help or with their own command line arguments: Installs the package on a specified docassemble server (local or remote).
2. Internal developer with ALKiln's help: runs the tests as many times as they need while they develop the framework code.
3. Internal developer with ALKiln's help or with their own command line arguments: deletes the package from the docassemble server.

Internal developers do this if they:

- Have to edit ALKiln's own code.
- Want to run tests faster than the GitHub test flow allows (a faster iteration cycle).
- Want to run tests on a local server.
- See ALKiln's behavior live and with more detail.

### 4 node command line commands

`package.json` has 4 command-line commands. They are broken up by the different needs of the 4 different environments - installing packages on a server, saving temporary server information, running the core framework code[^2], deleting packages on a server. As this document describes. Some environments need only one of the commands.

Read the API section for more details.

Looking only at the command line commands does miss a crucial 1st part of the temporary GitHub docassemble server workflow - creating the docassemble server. That is done completely through `./action_for_github/action.yml`. See the section on GitHub composite actions for details.

### Passing information between different processes.

ALKiln needs to pass information between its different processes to do things like go to the right interview urls and store artifacts (like reports, debug logs, and screenshots) in the right folder.

**`runtime_config.json`**

Since different runtime processes can't pass information between them any other way, we create and modify `runtime_config.json` as each process runs to store information that other processes need. Different environments need to save different information or to save information differently.

For example, `alkiln-setup` needs to create a Project on an author's Playground[^1] to store the code of the online forms and show the forms online. Later, `alkiln-run` needs to know how to find the URL for that specific Project on the server so it can interact with the forms.

The name of the artifacts folder is an example of using `runtime_config.json` and how the complexity of these 4 environments invades ALKiln's core code. See the doc about the artifacts folder name.

<!-- Do we need to list the specific possible values here? These aren't recorded anywhere else, so it's worth considering, but it doesn't feel like the right place. This is incomplete. Holding off until we decide where it goes.
Everything uses these:

- `artifacts_path`

Temp GitHub docassemble server install uses these:

`da_install_method` - `server` or `playground`
`da_repo_folder_name` - For example, EvictionDefense in the docassemble-EvictionDefense repo. (see session_vars.js)

Installation in an author's account on their own docassemble server and command line uses these:

Does ALKilnInThePlayground also use the below?

- `da_project_name` - The name of the docassemble project. Helps get the url of the interview. In local internal development, this lets developers keep using the same Project over and over so they don't need to make a new Project, and upload the package code, every time they run a test.
-->

**Env vars**

ALKiln and test authors use environment variables to pass information to different processes. GitHub workflows and actions store them in their `.yml` files. ALKilnInThePlayground uses the server's configuration file. Local developers use their `.env` file. This is also the way authors and internal developers pass sensitive information to ALKiln. On GitHub, authors store sensitive information in GitHub secrets and then use them as environment variables.

### 2 GitHub composite actions

Authors use our GitHub composite actions in their GitHub workflow files.

- `./action_for_github/action.yml` - Creates the temporary GitHub docassemble server. This action is a crucial part of the flow for temporary GitHub docassemble servers. The fact that it is a separate action gives authors the information and environment they need to change and customize the temporary server themselves in more ways than we can account for. For example, authors might need to make user accounts so they can test what a logged-in user sees. Right now, it cannot help them access remote databases like S3.
- `./action.yml` - Installs packages on servers in the ways we've described, runs the tests, deletes packages on servers, and gives authors information from the test run, like reports and screenshots.

The rest of the details and API are in the files themselves and in the author-facing documentation about GitHub workflow files at https://assemblyline.suffolklitlab.org/docs/alkiln/writing/#workflows.

## APIs

### Command-line API

ALKiln's `package.json` offers 4 command-line commands:

1. `alkiln-server-install` - Stores `runtime_config.json` variables of a temporary GitHub docassemble server for the core framework code[^2].
2. `alkiln-setup` - Installs the docassemble package on the author's account and stores `runtime_config.json` variables for core framework code.
3. `alkiln-run` - Wraps and then runs the framework's core code to run the tests.
4. `alkiln-takedown` - Deletes the package there.

### GitHub composite actions API

The general description of the composite actions is in the composite action section. The details of composite action API is in the author-facing documentation about GitHub workflow files at https://assemblyline.suffolklitlab.org/docs/alkiln/writing/#workflows.

## Degree of constraint

This design is working within systems that limit how we can do what we need to do.

- GitHub's action and workflow API and environment. For example, interacting with the temporary GitHub docassemble server vs. interacting with an author's server. Also, the ways in which we need to store and use environment variables.
- docassemble's API and environment. It wasn't designed to be automated and used this way. For example, it stores package files very differently than the way GitHub arranges them and very differently depending on where we install the package, it has different memory constraints for installing the packages globally vs. in an individual developer's account, etc.
- cucumberjs's inability to pass non-primitives to core framework code[^2].
- 3rd party database storage systems, like S3, are hard to integrate into GitHub temporary server tests. We have excluded this feature at the moment. Authors would need to write their own workflow or composite action to access remote databases.

## Alternatives considered

Alternative: Get rid of our support for some of these environments. The temporary GitHub docassemble server environment hasn't been used by a lot of authors. Other than that, the other environments have gotten a lot of use. Even though authors have not yet used the temporary GitHub environment much, they say they want that functionality. The trouble there seems to be complexity with initial set up.

Alternative: Instead of dealing with separate runtimes, have one command and script that wraps all these currently separate processes in one runtime and handles which ones to trigger under what circumstances. If we included `./action_for_github/action.yml` in that command, we would prevent authors from customizing the temporary GitHub docassemble server. That would not be acceptable. To avoid closing off access to server customization, we can only partially integrate these different processes. Also, GitHub actions in general will still have to deal with some core business sometimes. For example, they have to create the artifacts folder name so they can use it later to upload the artifacts. This combined runtime also feels more coupled/entangled and therefore harder to maintain. The need for more command line arguments could make local development more complicated. It is still worth considering.

<!-- Discuss: How to articulate the entanglement with more specifics and examples. -->

Alternative script names: `install_package`, `save_server`, `delete_package`.

## Cross-cutting concerns

_Security, privacy, observability, etc._

- Some tests need to use sensitive information. For example, some tests need a logged-in user and thus ALKiln needs the login info for a user. Different environments store this information differently and there is documentation about how to use sensitive information securely and privately.
- Core ALKiln code[^2] ends up needing to handle some of the complexity of the 4 environments. Example - the `Log` class `path` takes an optional initial argument to set the artifacts path at the beginning of that runtime process. Other parts of the process have to assume that this path already exists. We have tried to abstract environment complexity out to `run_cucumber.js`, the script that wraps the core code, but there is still logic that the core code handles.

---

[^1]: A docassemble server can have multiple purposes. One is to contain the packages for online forms which end users then use. Those packages are stored in a special place on the server and admins configure the server to give end users a list of those forms. Another purpose of the docassemble server is to be a development environment in which to create the forms. An author/developer of the forms has a developer account on the server. That account can store multiple packages and versions of packages. It also has an IDE that authors can use to work on those packages. They can push those files to GitHub from that IDE. They can also pull those packages from GitHub using that IDE.

[^2]: **Core framework code/core code:** the code that implements the Steps in the `.feature` test files.
