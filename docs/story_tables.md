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

That's no problem at all for our code. If we require our users to use `.target_number`[^1] we have one unique variable to tell us how many times to say "Yes" to a `.there_is_another` question, letting us know when to answer "No" and stop the loop. We just also have to do a bit of extra work to make that happen.

## The loop architecture

First, the very basic flow for setting a variable. Note: every variable that is set uses the same code that handles Story Table rows.

1. If this isn't a Story Table step, transform the given arguments into a Story Table structure - a list of row objects.
2. For each row object
    1. Create a new object with almost the same properties. It contains the original object in a property called `original` so the original can be used to print stuff for the user's report.
    2. In this new object substitute environment variables the author gave into actual values. They may do this to keep a value (like a password) secret.
    3. Add ways to accumulate the number of times the row is used.
3. For each page
    1. Identify and store all the fields on the page and all the variables they set.
    2. Shallowly clone the Story Table row list.
        1. Create a new object almost the same as the old object
        2. Print a warning to the user if they've created a `.there_is_another` row with a value of `'True'` and change that value to `'False'`.
        3. If there is a `.target_number` row, use it to create new rows for `.there_is_another` and `.there_are_any`
        4. This new list will be used to actually put answers into fields.
    3. For each field on the page
        1. Find which Story Table row, if any, matches that field.
        2. Set the field to the given value.
        3. Increment the row's accumulators.
            1. Increment all relevant `.times_used` by 1.
            2. Increment the relevant `.used_for['foo']` by 1.
    4. Try to continue.

Now some details.

A row object can have two different structures (sorry). The first is for non-artificial rows:

```js
{
  original: {
    trigger: `moms.target_number`,
    var: `x.target_number`,
    value: `SECRET_NUMBER_OF_MOMS`,
  },
  trigger: `moms.target_number`,
  var: `x.target_number`,
  // These are different
  value: `2`,
  is_artificial: false,
  times_used: 0,
  used_for: { `x.target_number`: 0 },
}
```

The second is for artificial rows. An example of a `.there_are_any` row:

```js
{
  source: {
    // The contents of the previous outer object, with one change:  
    used_for: {
      `x.target_number`: 0,
      `x.there_are_any`: 0,
      `x.there_is_another`: 0,
    }
  }
  is_artificial: true,
  var: `x.there_are_any`,
  value: `True`,
  trigger: `moms.there_are_any`,
  used_for: { `x.there_are_any`: 0 }
  // `.times_used` is the same
}
```

An example of a `.there_is_another` row:

```js
{
  source: {
    // The contents of the previous outer object, with one change:  
    used_for: {
      `x.target_number`: 0,
      `x.there_are_any`: 0,
      `x.there_is_another`: 0,
    }
  }
  is_artificial: true,
  var: `x.there_is_another`,
  value: `True`,
  trigger: `moms.there_is_another`,
  used_for: { `x.there_is_another`: 0 }
  //`.times_used` is the same
}
```

Why is it all so nested? That's just how it evolved. It could probably use some refactoring.

The parts relevant to loops for gathering multiple items in a list are the `.target_number` accumulators and the artificial rows. Whenever a `.there_is_another` row is used to set an answer to a field, we add 1 to its `source.times_used`. That is, we mutate the `.target_number` object's `.times_used` property. We alsoadd 1 to its `source.used_for['x.there_is_another']` value. That mutates the `'x.there_is_another'` property of the `.used_for` of the `.target_number` object. We do the same for `.there_is_another` rows, but that doesn't matter for now.

Why do we increment both the `.times_used` property and the `.used_for` properties? Have patience and read on.

We set the value of a `.there_are_any` row using its `source` row's `value`.  If it's greater than `0`, the value is `'True'`, otherwise it's `'False'`.

When this comes from a `.target_number` row (which I think is currently the only way we get to this stage), we set the value of a `.there_is_another` row using the `.there_is_another` accumulator in the `source` row. Three scenarios are possible.

1. If the `.source.value` is `0` and its `.used_for['x.there_is_another']` is `0`, set the `.there_is_another` `value` to `'False'`.
3. This also sounds weird, but if the `.source.value` is `> 0` and the `.source.used_for['x.there_is_another'] >= (.source.value - 1)`, return `False`. For example, if `.source.value` is `2` and `.source.used_for['x.there_is_another']` is `1`, return `False`. (We will explain this further down.)
2. Otherwise, return `True`.

Why `value - 1`? That's a wierd calculation. But think about the questions the user is being asked again:

Page 1: Do you have any moms? (Set `moms.there_are_any` to `True`)
Page 2: What is your first mom's name? (Set `mom[0].name.first`)

We just set our 1st entry in the loop and `.there_is_another` wasn't used at all.

Page 3: Do you have any other moms? (Set `moms.there_is_another` to `True` because `.source.used_for['x.there_is_another'] == 0`)
Page 4: What is your second mom's name? (Set `mom[1].name.first`)

`.there_is_another` is being used for the 1st time, even though this is actually the 2nd item in the list.

Page 5: Do you have any other moms? (Set `moms.there_is_another` to `False` because `.source.used_for['x.there_is_another'] == 1`)
This is the 2nd time `.there_is_another` is being used, but this would cause a 3rd loop if we didn't use the weird math.

We did consider other options, though.

One option: have the test author set their `.target_number` value to 1 less than the number of items they want. This follows the tradition of 0 indexed languages. Unfortunately (or fortunately), the authors are generally human, not computers, and that doesn't really make sense. Also, the pattern we chose is the pattern docassemble uses for `.target_number` already.

Another option: we could just use `.times_used`. That gets incremented with `.there_are_any` as well as with `.there_is_another` and we don't need to do the weird math. The problem with this option is that sometimes the `.there_are_any` question is never asked. The author of the interview can set that ahead of time so that the user doesn't have to bother with it. In a form that's definitely about children, the author may assume the user already has children. They may exclude, "Do you have any children?" They would just ask for the first child's name right away. `.times_used` would then be off by one.

That's why we chose the weird math instead. That leaves us with a couple more questions.

`.times_used`. Why have `.times_used` at all? That's a stylistic choice. It makes later code less complicated. When we print the test report at the end and want to show the author which `.target_number` rows were actually used during the test, we need to know the total number of times the `.target_number` was used. We could add up the `used_for` values, but for now we're avoiding doing that extra math and the etra refactoring. The choice has its pros and cons.

Also, why make artificial rows? Well, that way when we loop through to match a page's fields to the variables in the Story Table structure, we don't have to do anything special for these rows. Why not calculate the `.there_are_any` and `.there_is_another` values in the row-matching loop? That's another stylistic choice. There's more logic to the `.there_is_another` value than we've talked about here and that method seems like it would add a lot more cruft and complexity in that match-finding loop. We may eventually change our minds.

---

[^1] Why use `target_number`? We count on our users being at least a bit familiar with docassemble variables and to have access to the docassemble docs, so the `target_number` variable is something they should be able to recognize or easily find information about. We decided to take advantage of that. 