# Leave pdfjs at its current version

## Context and Problem Statement

pdfjs has a security vulnerability (that does not affect us) where malicious PDFs can inject code into an unsuspecting project and cause havoc.

Our users are downloading and manipulating their own PDFs. We will assume they're not putting malicious code into their PDFs.

The update changes pdfjs .js files to be .mjs files. It might take some bother to configure our repo to use .mjs files.

## Considered Options

- Update pdfjs
- Leave pdfjs at its current version, 3.2.146

## Decision Outcome

Leave pdfjs at its current version, 3.2.146. The vulnerability is irrelevant for our situation and we don't have bandwidth to set up the configurations right now.
