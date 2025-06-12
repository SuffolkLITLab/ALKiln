# Document decisions

## Context and Problem Statement

Sometimes we want to let authors who use ALKilnInThePlayground (ALKiP) know about changes or enhancements to ALKiln that can affect their use of ALKiP.

ALKiP is closely coupled with, yet disconnected from, ALKiln. Authors can update to the latest ALKiln version right inside the ALKiP interview, but the relationship between the versions of the two packages can be a little unclear so mistakes are easy to make.


## Considered Options

- Make a new nodejs executable for ALKiP to use
- Leave the system alone and just stick to making announcements


## Decision Outcome

Make a new nodejs executable for ALKiP to use.


## Pros and Cons of the Options

### New executable

Pros:

It will let us do something we usually are unable to do - tell our authors new information without requiring them to update ALKiP first. It will keep authors informed who:

- Don't have the bandwidth to keep up with the community channels
- Don't have the bandwidth to check the changelog regularly
- Are unsure how to align versions of ALKiP with ALKiln

Cons:

- It creates a new strange coupling between ALKiln and ALKiP. That said, this new coupling is a very light coupling.
- It gives ALKiln a way to influence ALKiP. We will have to make sure that we review the "breaking news" code to make sure that any Mako that gets executed will be safe. Granted, that is the case with most code everywhere.


### Just announcements in community channels

Pros:

- Less work
- Less coupling between ALKiln and ALKiP

Cons:

- We should keep making announcements in our community channels regardless, but I feel it's insufficient. In GitHub actions, most authors use an up-to-date version of ALKiln. I'm not as sure about ALKiP sitting on author's servers with no indications of updates. Docassemble didn't have indications of an out of date installed packages the last time I looked.

<!-- Fun for internal developers

Brainstorms that went into creating the new feature:

What kind of info could we need?

Now:

- Version of ALKiln users are asking for
- Version of ALKiP they have in the Playground
- Current version of ALKiln

Will we need more info in the future?

- docassemble-os/docassemble version?
- version of AssemblyLine if it's there?
- various env vars...? Not sure which ones, though, and those change. All env
  vars seems like tmi.
- npm-shrinkwrap.json of ALKiln? Or maybe just package.json? We should be able
  to see that in the given version of ALKiln.
- files we know we've put on the system...? (runtime_config.json)


Message format?

| Reason | Announcement |
| --- | --- |
| ALKiln version >= ... with ALKilnInTheP version <= ... | the message |

or

## Hear ye, hear ye

An ALKiln version or two has one or more messages for you

| Why this message? | Message |
| --- | --- |
| You have ALKiln >= ... and ALKiP <= ... | the message |

or

| Relevant versions | Message |
| ALKiln >= ..., ALKiP <= ... | the message |

or

## 📯 📣 📰 Breaking news! 📰 📣 📯

An ALKiln version or two has one or more messages for you

~~### Message 1~~

Version mismatch: alk ver >3 and alkp ver < 3

The message


Possible `reason`s:
🏚️ 🧩 🌋 🩺 🧹 💔 🔀 ™️ Version mismatch
✨ New feature
🛠️ Fix
-->



