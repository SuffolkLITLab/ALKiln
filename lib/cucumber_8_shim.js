module.exports = async function wrapPromiseWithTimeout (
  promise,
  timeoutInMilliseconds,
  timeoutMessage=''
) {
  /** Race between a timeout and another function and clean up
  *    async afterwards.
  * 
  * Taken from https://github.com/cucumber/cucumber-js/blob/main/src/time.ts#L42-L59
  */
  if ( timeoutMessage === '' ) {
    timeoutMessage = `Action did not complete within ${ timeoutInMilliseconds } milliseconds`;
  }

  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error( timeoutMessage ))
    }, timeoutInMilliseconds)
  });

  return await Promise.race([ promise, timeoutPromise ]).finally(() =>
    clearTimeout(timeoutId)
  );
}