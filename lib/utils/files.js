const fs = require('fs');
const safe_filename = require('sanitize-filename');

let files = {};

files.readable_date = function() {
  /* Return the current timestamp in a human-readable filename-safe format to
  *  match the workflow artifact date format.
  * 
  * See https://stackoverflow.com/a/48729396/14144258 and https://stackoverflow.com/a/6040556/14144258
  */
  let date = new Date();  // now
  let day = ("0" + date.getUTCDate()).slice(-2);
  let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  let year = date.getUTCFullYear();
  let hours = ("0" + date.getUTCHours()).slice(-2);
  let mins = ("0" + date.getUTCMinutes()).slice(-2);
  let secs = ("0" + date.getUTCSeconds()).slice(-2);

  let fancy_str = `${ year }-${ month }-${ day } at ${ hours }h${ mins }m${ secs }sUTC`;
  return fancy_str;
};  // Ends files.readable_date()

files.make_artifacts_folder = function (path) {
  /** Makes a folder in the root of the project if it doesn't
   *  already exist, either with the given name or with a default name.
   *
   * Works for local development as well, without action.yml or workflow files.
   * */
  if (path) {
    let name_parts = path.split(`/`);
    let safe_parts = [];
    for ( let part of name_parts ) {
      safe_parts.push(safe_filename( part ));
    }
    path = safe_parts.join(`/`);
  } else {
    path = `alkiln-${ files.readable_date() }`
  }

  // `recursive` avoids errors if folder already exists
  // https://nodejs.org/docs/latest-v18.x/api/fs.html#fspromisesmkdirpath-options
  fs.mkdirSync( path, { recursive: true });
  return path;
};  // Ends files.make_artifacts_folder()

module.exports = files;

