#!/usr/bin/env node


// Run the code when it's called as an executable
if (require.main === module) {
    try_to_break_the_news_gently({});
    return;
}

// Export the function if it is being imported
module.exports = { try_to_break_the_news_gently };


function try_to_break_the_news_gently() {
  let news = null;
  try {
    news = break_the_news();
  } catch ( breaking_news_error ) {
    news = `🖊️ ALK0279 NOTE breaking news: Unable to break any news.\n${ breaking_news_error }\n`;
  }

  process.stdout.write( news );
  return news;
}


function break_the_news() {
  /** Returns a string. It will be either announcements for authors or a
   *     declaration of the lack of announcements depending on the
   *     arguments/flags of the command/subprocess.
   * 
   * Discuss: Should we integrate Log into here for, e.g., debugging?
   * 
   * @returns {str} - The breaking news or a non-news message.
   * */

  /* Example of process.argv: 
   * [
   *   '/Users/me/.nvm/versions/node/v18.17.0/bin/node',
   *   '/Users/me/code/alkiln/lib/breaking_news.js',
   *   '--alkiln_desired_version=6.20.0',
   *   '--alkip_version=1.0.0'
   * ]
   * */
  const argv = require(`minimist`)( process.argv.slice(2) );

  let {
    alkiln_desired_version,
    alkiln_current_version,
    alkip_version,
  } = argv;

  let alkiln_desired_semver = get_semver_parts( alkiln_desired_version );
  let alkiln_current_semver = get_semver_parts( alkiln_current_version );
  let alkip_semver = get_semver_parts( alkip_version );

  let reasons = {
    feature: { icon: `✨`, body: `A new feature is available` },
    fix: { icon: `🛠️`, body: `A bug fix is available` },
    versions: { icon: `🔀`, body: `ALKiln and ALKilnInThePlayground have misaligned versions` },
  }

  let subtitle = `*An ALKiln version or two has one or more messages for you*`;
  let valediction = `🌼 ALKiln`;

  let messages = [
    // This first one is for testing and will never be seen in real tests.
    //     Authors will need to update ALKiP > 1.3.x to see messages like this
    //     and that will disqualify it
    {
      body: `ALKiln has a new Step - the [constrained random answers Step](https://assemblyline.suffolklitlab.org/docs/components/ALKiln/writing/#constrained_random). Authors can now help ALKiln generate and run tests with randomized answers. To use it, update your server's version of ALKilnInThePlayground to be above 1.3.1, then follow the instructions in the linked documentation.`,
      do_include: ( none_are_null( alkiln_desired_semver, alkip_semver )
        && (
          semver_a_more_recent_than_b( alkiln_desired_semver, [5, 15, 0] )
          || semver_a_same_as_b( alkiln_desired_semver, [5, 15, 0] )
        ) && (
          semver_a_less_recent_than_b( alkip_semver, [1, 3, 1] )
          || semver_a_same_as_b( alkip_semver, [1, 3, 1] )
        )
      ),
      code: `ALK0280`,
      reason: reasons.feature,
    },
    {
      body: `ALKiln has a new Step - the [constrained random answers Step](https://assemblyline.suffolklitlab.org/docs/components/ALKiln/writing/#constrained_random). Authors can now help ALKiln generate and run tests with randomized answers. To use it, update your server's version of ALKiln to be 5.15.0 or above, then follow the instructions in the linked documentation.`,
      do_include: ( none_are_null( alkiln_current_semver, alkip_semver )
        && semver_a_less_recent_than_b( alkiln_current_semver, [5, 15, 0] )
        && semver_a_more_recent_than_b( alkip_semver, [1, 3, 1] )
      ),
      code: `ALK0281`,
      reason: reasons.feature,
    },
  ];

  let body_parts = [];
  for ( let msg_obj of messages ) {
    if ( msg_obj.do_include === true ) {
      let lines = [`## ${ msg_obj.reason.icon } Item ${ msg_obj.code }: ${ msg_obj.reason.body }`, msg_obj.body];
      body_parts.push( lines.join(`\n\n` ));
    }
  }

  let news = `💡 ALK0278 INFO breaking news: Nothing is breaking. Probably.\n`;
  if ( body_parts.length > 0 ) {
    // The "page header" is in ALKiP itself
    news = [ subtitle, ...body_parts, valediction ].join(`\n\n`) + `\n`;
  }

  return news;
}


// =============
// Helpers
// =============

function get_semver_parts( version_str ) {
  /** Given a semver (https://semver.org) formatted version string, return a
   *     list of ints, and possibly strings, that make up the parts of that
   *     version string. Otherwise returns null.
   * 
   * Note: This makes assumptions about our semver format:
   *     - There will be three or less `.` characters.
   *     - After the final period will come an integer which may be followed by
   *        - Nothing or
   *        - A `-` followed by other valid semver characters
   * 
   * @example
   * // returns [3, 1, 15, `feat-news-1`]
   * get_semver_parts(`3.1.15-feat-news-1`)
   * @example
   * // returns null
   * get_semver_parts(`3.a.15-feat-news-1`)
   * 
   * @param {str} version_str - See ./docs/version_formatting_rules.md
   * 
   * @returns {[int, int, ...int|str]} - Version as ints and maybe also strs.
   * */
  if ( !version_str || typeof( version_str ) !== `string` ) { return null; }

  let v_parts_strs = version_str.split(`.`);
  let initial_parts = strs_to_ints_or_strs( v_parts_strs );

  if ( initial_parts.length < 3 ) { return null; }
  if (
    typeof( initial_parts[0] ) !== `number`
    || typeof( initial_parts[1] ) !== `number` ) {
    return null;
  }

  let version_parts = [ initial_parts[0], initial_parts[1] ];

  // Handle "experimental" versions. E.g. "3.1.15-feat-news"
  if ( typeof( initial_parts[2] ) === `string`) {
    let patch_parts = split_around_first_dash( initial_parts[2] );
    let patch_num = str_to_int_or_str( patch_parts[0] );
    version_parts.push( patch_num, patch_parts[1] );

  } else if ( typeof( initial_parts[2] ) === `number`) {
    version_parts.push( initial_parts[2] );

  } else {
    return null;
  }

  return version_parts;
}


function strs_to_ints_or_strs( strs ) {
  /** Given a list of strings, turn each int string into an actual int and
   *     leaves the rest as-is.
   * 
   * @example
   * // returns [ 2, 10, 1 ]
   * strs_to_ints_or_strs([ `2`, `10`, `1` ])
   * 
   * @example
   * // returns [ 2, 10, `1-fix-typo` ]
   * strs_to_ints_or_strs([ `2`, `10`, `1-fix-typo` ])
   * 
   * @params {[str]} strs - Strings
   * 
   * @returns {[int|str]} - List of ints or strings or both
   * 
   * */
  let ints_and_or_strs = [];
  for ( let one_str of strs ) {
    ints_and_or_strs.push( str_to_int_or_str( one_str ));
  }

  return ints_and_or_strs;
}


function str_to_int_or_str( original_str ) {
  /** Converts a string to an int if it contains only digits. Otherwise, returns
   *     the original string.
   *
   * @param {str} original_str - The string to convert.
   * 
   * @returns {int|str} - An int if reasonable, otherwise the original string.
   */
  try {

    if ( includes_non_digit( original_str )) { return original_str; }
    return parseInt( original_str );

  } catch ( str_to_int_error ) {
    return original_str;
  }
}


function includes_non_digit( original_str ) {
  /** Returns whether the given string contains any non-digit characters.
   *
   * @param {str} original_str - The string to check.
   * 
   * @returns {bool} - true if the string has non-digit chars, otherwise false.
   */
  return original_str.match(/\D/);
}


function split_around_first_dash( original_str ) {
  /** Splits a string into two parts around the 1st dash (`-`). Excludes the
   *     dash itself.
   * 
   * @example
   * // returns [ 3, `feat-2` ]
   * split_around_first_dash( `3-feat-2` )
   *
   * @param {str} original_str - The string to be split.
   * 
   * @returns {[str, str]} - The str before the 1st dash and the str after.
   */
  let parts = original_str.match(/^([^-])-(.+)$/);
  return [ parts[1], parts[2] ];
}


function none_are_null( ...items ) {
  /** Returns true if all items are not `null`. Otherwise, returns false.
   *
   * @param {...*} items - The items to be checked.
   * 
   * @returns {bool} - true if none of the items are null, otherwise false.
   */
  return items.every(( item ) => { return item !== null; });
}


function semver_a_more_recent_than_b( semver_a, semver_b ) {
  /** Compares two semvers to see if the 1st semver is more recent than the 2nd.
   *
   * WARNING: This function doesn't differentiate well between different dev
   *     versions, as described in ./docs/version_formatting_rules.md
   *
   * @param {[int|str]} semver_a - The 1st semver (more recent semver?)
   * @param {[int|str]} semver_b - The 2nd semver.
   * 
   * @returns {bool} - true if semver_a is more recent than semver_b, otherwise
   *     false.
   */
  for ( let index = 0; index < semver_a.length; index++ ) {
    if ( semver_b[ index ] === undefined ) {
      // a is longer than b
      return true;
    }
    if ( semver_a[ index ] > semver_b[ index ] ) {
      return true;
    }
    if ( semver_a[ index ] < semver_b[ index ] ) {
      return false;
    }
  }

  return false;
}

function semver_a_less_recent_than_b( semver_a, semver_b ) {
  /** Compares two semvers to see if the 1st semver is less recent than the 2nd.
   *
   * @param {[int|str]} semver_a - The 1st semver (less recent semver?)
   * @param {[int|str]} semver_b - The 2nd semver.
   * 
   * @returns {bool} - true if semver_a is less recent than semver_b, otherwise
   *     false.
   */
  let is_less = true;
  if ( semver_a_more_recent_than_b( semver_a, semver_b )) {
    return false;
  }
  if ( semver_a_same_as_b( semver_a, semver_b )) {
    return false;
  }
  return true;
}


function semver_a_same_as_b( semver_a, semver_b ) {
  /** Compares two semver arrays to see if they are the same.
   *
   * @param {[int|str]} semver_a - The 1st semver as an array of ints &/or strs.
   * @param {[int|str]} semver_b - The 2nd semver as an array of ints &/or strs.
   * 
   * @returns {bool} - true if semver_a is the same as semver_b, otherwise
   *     false.
   * */
  let str_a = semver_a.join(``);
  let str_b = semver_b.join(``);
  return str_a === str_b;
}
