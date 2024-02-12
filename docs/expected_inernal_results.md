# What results are we expecting in our own tests?

Our internal test results look a little strange. For example, they sometimes initially look like they're failing, but eventually pass. That's because we're testing that our tests respond appropriately to authors' failures as well as successees.

These are the results that we expect:

## Cucumber feature tests {#cucumber}

- Many red `F`s in our cucumber "progress bar"
- Final results to show all Scenarios passing
- Cucumber seems to be unable to print the name of the first scenario

## Unit tests {#unit}

All these must pass
