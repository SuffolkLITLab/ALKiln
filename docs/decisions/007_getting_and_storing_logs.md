# Getting and storing logs

## Context and Problem Statement

There are multiple processes that log to the console - our own console logs, cucumberjs logs, and GitHub action logs[^1]. We want to save some of those to the reports and all of those to the debugging logs. We also want to save plain debug messages that get sent only to the instance of `Log` and not to the console[^2].

Also, if we want to search one of the debugging logs for output that was sent to the console, it would be nice to just copy the text and search for the exact text.

Every process that we trigger separately in the GitHub action - setup, server_install, run_cucumber, and takedown - each need their own instance of `Log`. There isn't a way to pass the instance between those processes[^1]. Also, until we wrap the entire cucumberjs process inside another manager of some kind (which we may do in the future to improve and manage internal tests for failure handling), it seems impossible to pass an instance of `Log` from our cucumberjs runner (currently `run_cucumber.js`) to the cucumberjs `World` object so we can use it while running the actual tests with the tests handler[^3].

[^1]: See the architecture design doc about our 4 environments.

[^2]: See the decision doc about our report and log architecture.

## Goals

MVP:
- Have a unified way of getting and storing all messages including console logs, stdout, and internal silent debug logs.
- Make the logs look like the console's logs to more easily visually match the output.

Ideally:
- Also capture information from cucumberjs.

## Considered Options

- Listen for write to `stdout`
- Save with `fs` `console.Console` `writeStream`s
- Cucumber formatters
- `fs.appendFileSync` with node's `util.inspect`
- A combination of methods

## Decision Outcome

Use fs.appendFileSync with node's `util.inspect`. In future, we might explore capturing cucumber logs in this process too.

## Pros and Cons of the Options

### Listen for write to `stdout`

We'd listen for `stdout` and `stderr` events. We haven't yet experimented with detecting which logs are cucumber's and storing only those. See pseudo code in the supplementary material section.

**Pros:**

- We wouldn't have to make an intermediary for handling first saving to debug logs and then logging to the console. We could simply log straight to the console which would trigger a function that would save to the debug files.
- Those saved strings would look the same as those console logs.
- We might be able to catch some of cucumber's output more easily and accurately.

**Cons:**

- When we tried this, the data that came into the console listener was unable to handle emoji, even with various methods of encoding/decoding. It may have problems with other characters as well.
- We'd still need to create metadata, which makes the process more complex than "simply logging to the console".
- We might still need to make custom error throwing behavior, which might then make our code less consistent.
- We haven't experimented with detecting what log level the caller used.

### Save with `fs` Console write streams

We would create one custom `console.Console` instance that saves to the debugging files and maybe another for the report logs.

**Pros:**

- The saved strings would look the same as console logs because we'd literally be using an actual console object's `.log()`.
- We could avoid handling circular references and other annoying errors ourselves.

**Cons:**

- We have to manage the streams' lifecycles - opening, flushing, and closing the streams. That includes special ways to flush the streams to get their text into the debugging and report files with event listeners for `end` and `close` and such. We need to do that by wrapping node processes in a try/catch. There are problems with this.
   1. It seems fragile.
   2. In one case, it's potentially impossible - the tests handler[^3]. The cucumber runner has a clear beginning and end to its node process and we can open and close the write streams around that process. The tests handler is buried in that and we don't have the experience we need to understand how to wrap the node process in there. E.g. do we wrap the whole steps.js file in a try/catch? Do we wrap each hook? Do we wrap the code in each hook? We need to throw errors so that cucumber can catch them and detect failures. See example below in supplementary material.

### Cucumber formatters

`cucumberjs` recommends using its [formatters](https://github.com/cucumber/cucumber-js/blob/main/docs/formatters.md)

**Pros:**

- We would be working within the `cucumberjs` ecosystem. That could give us access to data we might not otherwise be able to get and may have other benefits that we haven't explored fully because of the cons.

**Cons:**

- We were unable to get anything to work.
- We won't be able to use that with anything outside cucumber. For example, setup, takedown, possibly the cucumber runner, and (in future) with GitHub action logs.
- We would need to keep up with `cucumberjs` updates for this too.

### `fs.appendFileSync` with node's `util.inspect`

**Pros:**

- We're familiar with the functionality.
- `util.inspect` is what node uses to write to the console, so it can give us very similar output, though there's some customization we still have to do.

**Cons:**

- We have to do some of our own formatting and it would probably take a lot of care to make it completely match the console logs. For example, we could easily inspect the list of logs, but then it would look like a list, not like individual logs.
- We have to manage circular dependencies and possibly other details.

### A combination of methods

For example, the cucumber formatter as well as one of the other methods.

**Pros:**

- We'd get the functionality of the pros of each.

**Cons:**

- We'd get at least some of the cons of each.
- It may be a more complex system and possibly harder to maintain.

## Supplementary material

### Use `fs` Console to write to custom streams

Examples of using node `fs` custom [console.Console](https://nodejs.org/docs/latest-v18.x/api/console.html) and [writeStream](https://nodejs.org/docs/latest-v18.x/api/fs.html#filehandlecreatewritestreamoptions). Before exiting, either with 0 or with an error, we have to flush the stream with `.on("close")` and `.on("error")` to write to the file.

Flushing streams:

```js
// Based on https://github.com/nodejs/node/issues/24688#issuecomment-442688666
const fs = require(`fs`);
const util = require(`util`);

async function run() {
  // Create the stream to save to the debug.log file
  const stream = fs.createWriteStream(`debug.log`);
  // We can use this later to wait for the stream to close
  const streamPromise = new Promise((res, rej) => {
    stream.once(`close`, res).once(`error`, rej);
  });

  // Write some things
  stream.write(new Date().toISOString() + `\n`);
  stream.write(new Date().toISOString() + `\n`);

  try {
    // Example of exiting early
    throw new Error(`Without ending the stream and awaiting the promise, this causes a blank debug.log`);
  } catch (error) {
    // Add more information to the file
    stream.write(util.inspect(error));
    stream.write(`We managed to avoid a blank file`);
    // Avoid leaving the file blank
    stream.end();
    await streamPromise;
    throw error;
  }
}

run();
```

To keep the logic in `Log`, `Log` could have a method that a process can use to wrap its functionality:

```js
const run = function() { /* Do stuff */ };
log.with_flush( run );
```

`Log` would handle creating the promises. `log.with_flush()` would handle the try/catch logic to wait for the listeners and close the streams.

### Listen for write to `stdout`

For capturing console output, look into how to get the `stdin` for capturing various console output. https://stackoverflow.com/a/54202970:

```js
const stdin = process.openStdin()

process.stdout.write('Enter name: ')

stdin.addListener('data', text => {
  const name = text.toString().trim()
  console.log('Your name is: ' + name)

  stdin.pause() // stop reading
})
```

We couldn't figure out how to handle decoding emoji.

[^3]: I'm not sure of good names to differentiate the code in run_cucumber.js, which triggers the rest of the test running, but is separate from it, and the code that handles the nitty gritty - like index.js, steps.js, scope.js, etc. "Running cucumber" is ambiguous. I'm calling run_cucumber.js code the "cucumber runner" and I'm calling the code that handles the actual tests the "tests handler".
