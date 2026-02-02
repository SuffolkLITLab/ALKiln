# Format for ALKiln version numbers

These basically follow a subset of [semver](https://semver.org/) rules when we update our npm package version. We should publish new versions when we need to be able to share our code, either for all our authors to use or for testing. Or maybe just to impress our friends.

Also, remember that version numbers are not a guarantee. Any change may be a breaking change even if we just meant to add a feature or fix a bug. Version numbers just tell our authors what we were trying to do. The road to bugs is paved with good intentions.

Below are our own definitions of the parts (symbols) that ALKiln's version numbers are made of. If a definition includes other symbols, those symbols will have definitions of their own.

Characters you may use:

- `.` (maximum of 3 of these)
- Alphanumeric (A-z, 0-9)
- `-`


## Stable versions

Summary: `major.minor.patch`

Example: `12.4.105`

When you publish a new major, minor, or patch version of ALKlin, it should have the format of a `stableVersion`.

Definitions:

| symbol | definition |
| -- | -- |
| `stableVersion` | `major.minor.patch` (see definitions below) |
| `.` | A period |
| `major` | An integer. Increase this by 1 to show that we know that the new code breaks previous ALKiln Steps or other features. Old tests may incorrectly fail or succeed. Old config env var values may behave differently than before. |
| `minor` | An integer. Increase this by 1 to show that we have a new feature or features in a way that we intend to be backwards compatible. |
| `patch` | An integer. Increase this by 1 to show that we have fixed a bug or refactored internal code in a way we intend to be backwards compatible. |


## Development versions

Summary: `parentVersion-type-purpose-increment`

Example: `12.4.105-feat-story-2`

> [!CAUTION]
> When you publish a development version, you **must** publish using a descriptive `tag`. The `tag` should be a one-word reminder of the purpose of this version. Example:
> 
> ```
> npm publish --tag "story"
> ```
> 
> > If used in the `npm publish` command, this is the tag that will be added to the package submitted to the registry.
> \- [npm docs](https://docs.npmjs.com/cli/v11/commands/npm-dist-tag)
> 
> If you forget this then your code counts as the latest official version of ALKiln (as far as npm is concerned) and authors' code will automatically use that code to run tests.
> 
> Also, forgetting is not the worst thing in the world. Everyone forgets sometimes. I certainly have.

When you are publishing a `devVersion` of ALKiln to try out a feature, fix, or other change, use these rules.

| symbol | definition |
| -- | -- |
| `devVersion` | `parentVersion-type-purpose-increment`. Use this version scheme to try out new changes before publishing them for all authors. |
| `parentVersion` | Has the same format as `stableVersion` (from above). This should be the branch's original version number. Why not a new version number? Because what other core version number do you want to give it? When we start developing a change, we don't know what version number ALKiln will get to before we actually publish this change. The whole world could change in between then and now. |
| `-` | A dash |
| `type` | The type of change this is testing. E.g. `feat`, `fix`, `test`, `docs`, `fort` (see definitions below). If you really need something different, you can come up with your own. Then possibly discuss it and add it to these docs. |
| `purpose` | A one or two word reminder of what specific topic this change is addressing. Really truly try to keep this short. It is just a reminder after all. If you **must** use multiple words, separate them with a dash. |
| `increment` | An integer. Starts at 1. If this will be your first time publishing for this development, use 1. If this is your second time, use 2. And so on. To be very specific, and more confusing: when you publish these changes to try them out, how many times will you have published changes for this `parentVersion-type-purpose` combination? |

**Some `type`s**

It is better to choose something closer to the top of the list if the definition fits your changes.

| symbol | definition |
| -- | -- |
| `feat` | The string "feat". It stands for "feature". Use this when you're making a new feature |
| `fix` | The string "fix". Use this when you're fixing a bug |
| `test` | The string "test". Most code changes should include new tests, of course. This is for changes that improve *only* testing. This will help your fellow devs know when to expect just test changes as opposed to refactoring and so on. |
| `docs` | The string "docs". It stands for "documentation". Use this when you update or add only documentation. This file is an example of documentation! You probably shouldn't need to use this `type`. Why would you need anyone to test docs? Still, there are stranger things, etc. |
| `fort` | The string "fort". It stands for "fortify". Use this when you are strengthening or improving code in other ways. For example, refactoring. Also for situations where pillow forts can be involved. |


## Why did we choose these rules?

1. Simplicity and clarity. Semver has a lot of details our project doesn't need right now, so we can simplify it. Using semver as a base, though, has advantages. It is clear in many ways and a lot of developers are familiar with it.
1. Our `breaking_news` feature compares version numbers to decide what notifications to show to authors that are using ALKilnInThePlayground. We want to keep those version comparison calculations as simple as possible. At the same time, we want to let internal developers be descriptive enough with version names so that they are useful at-a-glance. This doc describes the balance we have chosen.
1. I can't remember another reason right now, but every list should have a minimum of 3 items, so here's the 3rd.
