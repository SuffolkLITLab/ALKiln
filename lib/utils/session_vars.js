const fs = require('fs');
const path = require('path'); 
require('dotenv').config();

/**
 * This code assumes that this module is run as part of a GitHub Action.  If the
 * customer is running it as a CLI tool, then they won't get useful messages yet.
 */

/* This file provides user info variables. E.g. server address. They're either
*    `process.env` vars or vars that have been built from `process.env` vars.
*    It is meant to avoid duplication, make testing easier, and leave room for
*    future manipulation. No other file should need to use `process.env`.
*
* We have a bunch of `.get_foo()` functions partly because it makes the code
*    much easier to test.
*/

const session_vars = {};

module.exports = session_vars;

// These default to null
// TODO: How to isolate debug elsewhere so this file can use the logger?
session_vars.get_debug = function () { return process.env.DEBUG || null; };
session_vars.get_dev_api_key = function () { return process.env.DOCASSEMBLE_DEVELOPER_API_KEY || null; };
session_vars.get_repo_url = function () { return process.env.REPO_URL || null; };
// .is_local more appropriate? To manage storing local results differently considering
// setup makes the artifacts folder, but local tests should only setup rarely, so
// we need a way to differentiate between environments. I think there's another way,
// I just don't remember right now.
session_vars.is_dev_env = function () { return process.env.DEV || null; }

// More complex logic
session_vars.get_setup_timeout_ms = function () {
  let timeout = 120 * 1000;
  if ( process.env.MAX_SECONDS_FOR_SETUP ) {
    timeout = parseFloat( process.env.MAX_SECONDS_FOR_SETUP ) * 1000;
  }
  return timeout;
};

session_vars.get_da_server_url = function () {
  try {
    let url = process.env.SERVER_URL || process.env.BASE_URL;
    return url.replace(/\/$/g, '');  // Remove any trailing slash for safety
  } catch ( error ) {
    return null;
  }
};

session_vars.get_branch_name = function () {
  /* Get the name of the repository's branch that is being tested */
  let branch_name = null;
  if ( process.env.BRANCH_PATH ) {
      branch_name = process.env.BRANCH_PATH.replace( `refs/heads/`, '' );
  } else if ( process.env.BRANCH_NAME ) {
    branch_name = process.env.BRANCH_NAME;
  }
  return branch_name;
};

session_vars.get_project_base_name = function () {
  /* Make an un-incremented project name based on the repo name and branch name. */
  let repo_url_without_trailing_slash = session_vars.get_repo_url().replace(/\/$/, '');
  let repo_name_parts = repo_url_without_trailing_slash.split('/');
  let package_name = repo_name_parts[ repo_name_parts.length - 1 ];

  let name = `testing${ package_name }${ session_vars.get_branch_name() }`;
  let sanitized_name = name.replace( /[^A-Za-z0-9]/g, '' );
  return sanitized_name;
};

session_vars.get_languages = function () {
  /* Returns an array of strings, names of languages that should be tested. */

  // These are assumed to be the words that are on the buttons or links
  // that change the language of the interview. Have not yet detected
  // another distinguishing feature
  // Need to research using the language url param instead.
  let langs = [];
  if ( process.env.EXTRA_LANGUAGES && process.env.EXTRA_LANGUAGES !== 'default' ) {
    langs = process.env.EXTRA_LANGUAGES.split(', ');
  }
  return langs;
};  // Ends session_vars.get_languages()


const project_name_file_path = `_alkiln_test_project_name.json`;
session_vars.save_project_name = function ( project_name ) {
  /* Saves the name of the project to a file so deletion can use it later.
  *    Built for local as well as remote testing. Assumes a kosher string.
  *    We avoided a list because of concerns over getting out of date.
  *    Should we try to prevent someone overwriting a previous project name?
  * 
  * @param project_name { string } - purely alphanumeric string */

  // Warn local developers if file already exists
  if ( fs.existsSync( project_name_file_path ) ) {
    let old_project_name = session_vars.get_project_name();
    let session_project_already_exists_msg = `ALKiln WARNING: `
      + `This session had a project name already: ${ old_project_name }. `
      + `A new project has now been created called ${ project_name }. `
      + `Remember to delete ${ old_project_name }`;
    console.warn( session_project_already_exists_msg );
  }

  let file = fs.writeFileSync( project_name_file_path, JSON.stringify( project_name ) );
  if ( session_vars.get_debug() ) {
    console.log( `ALKiln debug: Stored name of Project "${ project_name }" locally.` );
  }
  return file;
};  // Ends save_project_name()

session_vars.get_project_name = function () {
  /* Get the name of the current docassemble Project  */
  let project_name =  JSON.parse( fs.readFileSync( project_name_file_path ));
  if ( session_vars.get_debug() ) { console.log( `ALKiln debug: Project name from file is "${ project_name }".` ); }
  return project_name;
};  // Ends get_project_name()

session_vars.delete_project_name = function () {
  /* Delete the file storing the name of the docassemble Project */
  // Avoid race conditions possibly caused by checking for existence first
  // Delete file if possible
  try {
    fs.unlinkSync( project_name_file_path );
    console.log( `ALKiln: Deleted the file that stored the name of the Project.` );
    return true;
  } catch ( error ) {
    console.warn( `ALKiln WARNING: Could not delete the Project name file. Error: ${ error }.` );
    return false;
  }
};

// The file storing the artifacts path contains the name of the current artifacts folder.
// The directory name it contains will be created or changed with each run of all the tests.
const file_storing_artifact_path = `_alkiln_test_artifacts_dir_name.json`;
session_vars.save_artifacts_path_name = function ( path_name ) {
  /* Save a file with the name of the current artifacts folder in case it doesn't exist. */
  let folder = fs.writeFileSync( file_storing_artifact_path, JSON.stringify( path_name ) );
  if ( session_vars.get_debug() ) {
    console.log( `ALKiln debug: Stored name of artifacts directory "${ path_name }" locally.` );
  }
  return folder;
};  // Ends get_project_name()

session_vars.get_artifacts_path_name = function () {
  /* Get the name of the file containing the current artifacts path. */
  try {
    let path_name =  JSON.parse( fs.readFileSync( file_storing_artifact_path ));
    if ( session_vars.get_debug() ) { console.log( `ALKiln debug: Artifacts directory is "${ path_name }".` ); }
    return path_name;
  } catch ( error ) {
    return null;
  }
};  // Ends get_project_name()

/**
 * Ensure all required environment variables exist. Add each missing variable
 *    to an error that will be thrown at the end.
 * 
 * @throws ReferenceError with a message for all missing variables. 
 */
 session_vars.validateEnvironment = function() {
  /** Throw a useful error for the developer if any of the required env vars
  *    are missing. For most devs, these will be GitHub secrets. */

  // Note: We are checking for BASE_URL, but we are referring it as SERVER_URL as that
  // is the name used in GitHub secrets, which is what most devs will be using.

  let errorMessage = '';

  // Since this code will most often be run in GitHub, I'm going to build a single error message that outlines all missing variables.  Otherwise, a developer
  // will have to run their pipeline an incredible number of times to discover all the missing variables.
  if ( !session_vars.get_dev_api_key() )
  {
    errorMessage += `\nThe DOCASSEMBLE_DEVELOPER_API_KEY GitHub secret must be defined. The DOCASSEMBLE_DEVELOPER_API_KEY is a docassemble API key you created for your server's testing account. It should have developer permissions.`
  }
  if ( !session_vars.get_da_server_url() )
  {
    errorMessage += `\nThe SERVER_URL GitHub secret must be defined. The SERVER_URL is the URL of the Docassemble Server where the tests should be run.`;
  }
  if ( !session_vars.get_repo_url() )
  {
    errorMessage += `\nThe REPO_URL GitHub secret must be defined. The REPO_URL is the URL to the Git repo whose Actions are being run.`;
  }
  // The branch name is always automatically defined in Github, it'll be missing only if you're running locally and missing an env var.
  if ( !session_vars.get_branch_name() )
  {
    errorMessage += `\nThe BRANCH_NAME environment variable must be defined. The BRANCH_NAME is the name of the repository branch that should be pulled into the docassemble project.`;
  }

  errorMessage = errorMessage.trim();

  if (errorMessage !== '') {
    throw new ReferenceError(errorMessage);
  }
};
  
session_vars.validateEnvironment();
