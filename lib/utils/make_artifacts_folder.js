const fs = require('fs');
//const path = require('path');
const safe_filename = require("sanitize-filename");


const make_artifacts_folder = function (folder_name) {
  /** Makes a folder in the root of the project, either with the given name
  *   or with a default name.
  * 
  * Works for local development as well, unlike action.yml or the workflow file.
  */
  if (folder_name) {
    folder_name = safe_filename( folder_name );
  } else {
    folder_name = `alkiln_tests_output-${ Date.now() }`
  }

  fs.mkdirSync( folder_name );
  return folder_name;
};  // Ends make_artifacts_folder()

module.exports = make_artifacts_folder;
