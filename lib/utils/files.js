const fs = require('fs');
const safe_filename = require('sanitize-filename');

let files = {};

files.readable_date = function() {
  /* Return the current timestamp in a human-readable filename-safe format to
  *  match the workflow artifact date format. */
  let date = new Date();  // now
  let str = date.toLocaleString('en-GB', { timeZone: 'UTC' });
  let fancy_str = str.replace(/\//g, '-').replace(',', ' at').replace(':', 'hrs ').replace(':', 'mins ') + 'secs UTC';
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
    folder_name = `alkiln_tests_output-${ files.readable_date() }`
  }

  fs.mkdirSync( folder_name );
  return folder_name;
};  // Ends files.make_artifacts_folder()

module.exports = files;

