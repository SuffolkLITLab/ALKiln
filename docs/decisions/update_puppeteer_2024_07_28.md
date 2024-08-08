# Use response data to detect sign-in success

## Context and Problem Statement

Should we update to the newest version of puppeteer, [22.15.0](https://github.com/puppeteer/puppeteer/blob/main/packages/puppeteer-core/CHANGELOG.md#22150-2024-07-31)?

See https://github.com/SuffolkLITLab/ALKiln/issues/930.

## Considered Options

- Update to 22.15.0
- Update to 22.12.0, which is the lowest version that would fix our current problems
- Stay with 20.8.2

See pros and cons

## Decision Outcome

Update puppeteer from 20.8.2 to 22.15.0

## Pros and Cons of the Options

### Update at all {#update}

**Pros:**

- Makes the current fix possible

**Cons:**

- Change in the middle of a complex PR
- [A few breaking changes](https://github.com/puppeteer/puppeteer/blob/main/packages/puppeteer-core/CHANGELOG.md#2200-2024-02-05), which includes for us at the very least:
   - "Removes the deprecated `$x` (replace with `$$`) and `waitForXpath` (replace with `waitForSelector`)." We need to add [extra syntax to the start of our selector strings](https://github.com/puppeteer/puppeteer/pull/11782): "xpath//."
   - Replace any `page.waitForTimeout` with cucumber's version or ours.

### Update to to 22.15.0

**Pros:**

- Has all the most recent bug fixes and features

**Cons:**

- Exposes us to possible unknown new bugs


### Update to to 22.12.0

This is the lowest version that would fix our problem

**Pros:**

- Avoids possibly unknown new bugs

**Cons:**

- Doesn't have fixes to already known bugs


### Stay with 20.8.2

Opposite of first entry ["Update at all"](#update).