# Story Tables overview

The Story Table is a very flexible tool. It lets the author answer interview (form) questions in any order. They can make cosmetic changes to their interview code without having to change their tests. They can edit the order of their interview's pages, move fields from one page to another, and so on.

When the robot arrives on each interview page, it finds all the fields on the page and loops through the whole Story Table trying to match rows with fields.

Here's some [documentation on the use of Story Table rows](https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/alkiln/#story-tables).

## Tracking use of rows

Why do we track how many times each Story Table row was used to set a form's fields?

First, it lets us give the author useful information. We can show the author which rows of their story table were or weren't used. This can help the author tell that some crucial variables aren't being set as they expected. It also outputs a new Story Table for them. If they had a bunch of extra rows adding cruft, like from our [story table generator](https://plocket.github.io/al_story/), it gives the author a table with only the variables that are needed for the test.

Second, in some cases we need to actually throw an error if any row was left unused, so we have to keep track of that.

Third, looping questions that gather multiple items in a list are tricky when the interview answers need the `.there_is_another` attribute. We can't use that attribute. Instead, we handle all gathering with `target_number` rows. Next we'll discuss what problem the `.there_is_another` attribute creates and our approach to solving it.

## The loop problem

Since the Story Table loops through all its rows for each page, each row in the table needs to be unique. That is, you can only set one variable to one value. That's fine most of the time, but when gathering items in a list in a docassemble interview, there are a few ways to do it and one of them sets one variable over and over again - `.there_is_another`. This kind of loop can start with a question that sets `.there_are_any`.

For example, look for `.there_is_another` in the scenario below:

Page 1: Do you have any moms? (Set `moms.there_are_any` to `True`)
Page 2: What is your first mom's name? (Set `mom[0].name.first`)
Page 3: Do you have any other moms? (Set `moms.there_is_another` to `True`)
Page 4: What is your second mom's name? (Set `mom[1].name.first`)
Page 5: Do you have any other moms? (Set `moms.there_is_another` to `False`)

See that on page 3, `moms.there_is_another` is set to `True` and on page 5 it's set to `False`. We can't represent this in a Story Table.

```
| x.there_is_another | True | moms.there_is_another |
```

The above will always say that we have another `mom`. If we allowed our users to do that, it would create an infinite loop. So we prevent our users from creating a `there_is_another`  row that has a value of `True`. We still need to allow them to set `.there_is_another`, though, so what do we do?

## The loop solution

Well, there's another way to loop to gather items in docassemble - `target_number`. For example:

Page 1: How many moms do you have? (Set `moms.target_number` to `2`)
Page 2: What is your first mom's name? (Set `mom[0].name.first`)
Page 3: What is your second mom's name? (Set `mom[1].name.first`)

The target number row looks like this:

```
| x.target_number | 2 | moms.target_number |
```

If authors use `.target_number`, that's no problem at all for our code. We can't require authors to use that method to ask their questions, though. That may make their form questions confusing to their end users sometimes. Fortunately, we _can_ require developers to use `.target_number`[^1] in their Story Tables. We can use a `.target_number` table value to calculate what to answer for `.there_are_any` and to know how many times to set `.there_is_another` to `'True'`.

## The loop architecture

First, the very basic flow for setting a variable. Note: whatever Step the dev uses to set a variable's value, we send it to this loop. It may be useful to follow along in the code here.

1. If this isn't a Story Table step, transform the given arguments into a Story Table structure - a list of row objects.
2. For each row object (see `scope.normalizeTable()`)
    1. Create a new object with almost the same properties. It contains the original object in a property called `original` so the original can be used to print stuff for the user's report.
    2. In this new object, substitute environment variables the author gave into actual values. They may have done this to keep a sensitive value (like a password) secret.
    3. Add ways to accumulate the number of times the row is used.
3. For each page (see `scope.setFields()`)
    1. Identify and store all the fields on the page and all the variables they set.
    2. Shallowly clone the Story Table row list.
        1. Create a new object almost the same as the old object
        2. Print a warning to the user if they've created a `.there_is_another` row with a value of `'True'` and change that value to `'False'`.
        3. If there is a `.target_number` row, use it to create new artificial rows for `.there_is_another` and `.there_are_any`.
        4. This new list will be used to actually put answers into fields.
    3. For each field on the page
        1. Find which Story Table row, if any, matches that field.
        2. Set the field to the given value.
        3. Increment the row's accumulators.
            1. Increment the relevant `.used_for['foo']` by 1.
            2. Increment all relevant `.times_used`[^2] by 1.
    4. Try to continue.

<!-- From feedback, I'm not sure how to clarify this part or if readers will need it
Why make artificial rows? Well, that way when we loop through to match a page's fields to the variables in the Story Table structure, we don't have to do anything special for these rows. If they're not needed, they won't be triggered.

Why not calculate the `.there_are_any` and `.there_is_another` values in the row-matching loop? That's another stylistic choice. There's more logic to the `.there_is_another` value than we've talked about here and that method seems like it would add a lot more cruft and complexity in that match-finding loop. We may eventually change our minds.
 -->

---

[^1] Why use `target_number`? We count on our users being at least a bit familiar with docassemble variables and to have access to the docassemble docs, so the `target_number` variable is something they should be able to recognize or easily find information about. We decided to take advantage of that. Also, we chose to avoid 0 indexing so that the number starts at 1 and feels like human language, not computer language as our users are generally more human than computer. It's also the way docassemble does it.

[^2] It would seem like the `.times_used` property is redundant, but it has a different purpose that the `.used_for` properties. It lets us show the dev whether the `target_number` table row was used at all during the test to let us give appropriate feedback to the user. We could add up the `used_for` values, but for now we're avoiding doing that extra math and the extra refactoring. The choice has its pros and cons.
