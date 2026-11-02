# Post navigation custom behavior

## Context and Problem Statement

What architecture should we use to abstract custom behavior after navigation, like for invalid answers?

At this time, we need to test for navigation failures in several different ways and in this specific order:

1. A visible system error page, a **critical error**, trumps all other errors. Must always run.
2. Invalid answers will offer more specific information than the handlers to come after. Optional and must allow custom handling (e.g. warning, failure.)
3. A timeout with failed navigation is an otherwise invisible **critical error**, but doesn't have much information. Must always run.
4. A final catchall navigation failure must allow custom handling (warning, failure, other) and has the least amount of information. Optional and must allow custom handling (e.g. warning, failure.)

Requirements:

- We must enforce test failure for all critical errors
- We must allow custom behavior for other situations
- Visible system errors must come first
- The custom catchall failure must come last if the caller wants it

```
Navigation attempt
    |
Visible system error page – critical error, required
    |
Invalid answers? – optional
    |
Nav timeout – critical error, required
    |
Catch‑all? – optional
```

We currently have only 1 need for custom behavior - the "I tap to continue" Step. That Step must avoid a test failure for invalid answers or other non-critical non-navigation.

Note that the default post-navigation functions are most strict and handle any kind of irregularity by throwing errors. They don't warn or skip checks.

## Considered Options

For each of these options, I'm assuming the caller passes in its desired post-navigation-attempt behavior as handler functions. Those post-navigation-attempt handlers will be called one after the other until finished. An error in one of the handlers will stop the execution of any further handlers. The handler arguments can be:

1. A list of handlers that the deepest function calls after the navigation attempt is complete.
2. Two individual handlers, one called after the page error handler, and the other called after the "timeout before navigation" error handler.
3. Option 2, but each argument would be a list of handlers.
4. Three lists of handlers with the error handlers running between them.

Also considered, but dismissed on the spot:

- Global state flags
- Caller passes in flags instead of functions
- The caller has a choice of top-level functions to call, each of which duplicates the initial required navigation behavior followed by a different variation on the post-navigation-attempt behavior 🤪

## Decision Outcome

We will use option 1, the caller passes a list of all the functions to run after attempted navigation. I'm most compelled by the second "pro" for option 1. That is, this option keeps the flow of the logic visible in one place at the highest level possible.

## Implementation

The deepest navigation logic is in `scope.wait_until_continued()`, which will accept, among other arguments, the list of handlers described in option 1. For the purposes of the rest of this documentation, I will use the name `post_navigation_handlers` as the name for the parameter containing the list of handlers from option 1.

Pseudo-code for one possible simplified implementation where most names are examples:

```js
function top_caller() {
  const post_navigation_handlers = [
    throw_on_page_system_error,
    warn_on_invalid_answers,
    throw_on_nav_timeout,
    warn_on_unspecified_non_navigation,
  ];
  await scope.first_chain_method( post_navigation_handlers );
};

// In `scope.js`

const scope = {
  first_chain_method: async ( post_navigation_handlers=null ) => {
    await scope.wait_until_continued( post_navigation_handlers );
  },
  wait_until_continued: async ( post_navigation_handlers=null ) => {
    post_navigation_handlers ??= [
      throw_on_page_system_error,
      throw_on_invalid_answers,
      throw_on_nav_timeout,
      throw_on_unspecified_non_navigation,
    ];
    // Other logic
    for ( const handler of post_navigation_handlers ) {
      await handler( shared_arguments );
    }
  },
}
```

As shown in the example, when the navigation attempt is finished, `scope.wait_until_continued()` will loop through `post_navigation_handlers`, calling each one in succession until one triggers an error or until it has called all the handlers. We will not handle catching any errors to let failing tests fail properly.

As shown in the example, sometimes `scope.wait_until_continued()` comes at the end of a chain of method calls. We will need to pass `post_navigation_handlers` down through all that chain. `scope.wait_until_continued()` will use a nullish coalescer to set the default handlers list. Because of that, when destructuring parameters, any method that doesn't need to override the final handlers should use `null` as its own default value for the handlers list. Passing `null` will allow the next method in the chain to use its own default handlers list.

As option 1 describes, a risk of this approach is that we will forget to include the critical error throwers in `post_navigation_handlers`. We will implement a validator that checks for the presence of the required functions.

## Pros and Cons of the Options

### 1. A list of handlers

The caller passes in a list of all the functions they want run once the navigation attempt is complete.

Pros:
1. Seems more straightforward and consistent.
2. The behavior is less buried. We can see the flow of functions in one place.

Cons:
1. We duplicate handing in the required failure handlers.
2. This might be going too far, providing more flexibility than we really need.
3. A possible risk is writing a caller that doesn't include the critical error throwers.

### 2. 2 separate handlers

The caller passes in 2 handlers. We call the visible system error, then the 1st function, then we call the timeout error, and finally we call the 2nd function.

Pros:
1. Enforces required failures so no one else has to think about them.

Cons:
1. Much less flexible. In future, will we want to handle something before the visible system failure?
2. The complex logic is buried in the most nested part of the code that runs.

### 3. 2 lists of handlers

The caller passes in 2 lists of handlers. We call the visible system error, then the first list of function, then the timeout navigation, then the last list of handlers.

Pros:
1. More flexible than option 2.
2. Still enforces strict failures.

Cons:
1. Again, hidden complexity.
2. Preemptive flexibility that we don't need yet.
