
// We'll use a library if we need anything more complicated
let time = {};
module.exports = time;

/**
 * Causes your script to wait for the given number of milliseconds.
 *
 * @remarks
 * From https://github.com/puppeteer/puppeteer/pull/6268/files#diff-94b4e5903a98ebf8e5f178eb3354b806fd2aed9c74a5022d88dcd24bc477a5aaR1096-R1100
 *
 * @example
 *
 * Wait for 1 second:
 *
 * ```
 * await time.waitForTimeout( 1000 );
 * ```
 *
 * @param milliseconds - the number of milliseconds to wait.
 */
time.waitForTimeout = function( milliseconds ) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};
time.sleep = time.waitForTimeout;
time.wait = time.waitForTimeout;

time.filename_date = function() {
  /** Return the current timestamp in a human-readable
  *   filename-safe format to match the workflow artifact
  *   date format.
  *   See https://stackoverflow.com/a/48729396/14144258 and https://stackoverflow.com/a/6040556/14144258
  */
  // let date = new Date();  // now
  // let day = ("0" + date.getUTCDate()).slice(-2);
  // let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  // let year = date.getUTCFullYear();
  // let hours = ("0" + date.getUTCHours()).slice(-2);
  // let mins = ("0" + date.getUTCMinutes()).slice(-2);
  // let secs = ("0" + date.getUTCSeconds()).slice(-2);

  let dt = time.get_time_parts();
  let safe_date = `${ dt.y }-${ dt.mon }-${ dt.d } at ${ dt.h }h${ dt.min }m${ dt.s }sUTC`;
  return safe_date;
};  // Ends time.filename_date()

time.log_date = function () {
  /** Return the current timestamp in a human-readable
  *   more compact log format.
  * See https://stackoverflow.com/a/48729396/14144258 and https://stackoverflow.com/a/6040556/14144258
  */
  let dt = time.get_time_parts();
  let short_date = `${ dt.y }-${ dt.mon }-${ dt.d } ${ dt.h }:${ dt.min }:${ dt.s }UTC`;
  return short_date;
};  // Ends time.log_date()

time.get_time_parts = function () {
  /** Get all the parts of the date as numbers. */
  let date = new Date();  // now
  return ({
    y: date.getUTCFullYear(),
    mon: ("0" + (date.getUTCMonth() + 1)).slice(-2),
    d: ("0" + date.getUTCDate()).slice(-2),
    h: ("0" + date.getUTCHours()).slice(-2),
    min: ("0" + date.getUTCMinutes()).slice(-2),
    s: ("0" + date.getUTCSeconds()).slice(-2),
  });
}
