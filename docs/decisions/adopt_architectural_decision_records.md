# Document decisions

## Context and Problem Statement

What is a good way to avoid re-hashing old decisions, or to at least know why those decisions were made?

## Considered Options

- GitHub issues
- GitHub discussions
- Actual files in the repo

Formats:
- https://adr.github.io/madr


## Decision Outcome

Use in-repo .md files using the https://adr.github.io/madr format. We found keeping the data within the repo to be the most compelling factor.

## Pros and Cons of the Options

### GitHub issues

Pros:

- Easy to search.
- Can add labels and such.
- In one of the most common places to search.
- Allows comments

Cons:

- Not actually in the repository, so any forks or clones would lose that info.
- Comments can get confusing and hard to read.

### GitHub discussions

Pros:

- Labels and such.
- Probably easy to search?

Cons:

- A separate place from issues. Not everyone even knows those exist.
- All the cons of GitHub issues

### Actual files in the repo

Pros:

- They go everywhere the repo goes.

Cons:

- Probably not as searchable, though maybe we could institute a way to "label"/tag them.
- Not very visible.
