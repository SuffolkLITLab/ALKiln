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

files.make_artifacts_folder = function (folder_name) {
  /** Makes a folder in the root of the project, either with the given name
  *   or with a default name.
  * 
  * Works for local development as well, unlike action.yml or the workflow file.
  */
  if (folder_name) {
    folder_name = safe_filename( folder_name );
  } else {
    folder_name = `alkiln-${ files.readable_date() }`
  }

  fs.mkdirSync( folder_name );
  return folder_name;
};  // Ends files.make_artifacts_folder()

module.exports = files;

