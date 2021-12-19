
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
