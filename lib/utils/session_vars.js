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
*    future maninpulation. No other file should need to use `process.env`.
*/

// session_vars/session, ~run~
const session_vars = {
  PLAYGROUND_ID: process.env.PLAYGROUND_ID,  // Need to get rid of this in favor of API
};

module.exports = session_vars;

/**
 * Ensure all required environment variables exist. Add each missing variable
 *    to an error that will be thrown at the end.
 * 
 * @throws ReferenceError with a message for all missing variables. 
 */
 session_vars.validateEnvironment = function() {

  // We are checking for BASE_URL, but we are referring it as SERVER_URL as that
  // is the name used in GitHub secrets, which is what most devs will be using.

  let errorMessage = '';

  // Since this code will most often be run in GitHub, I'm going to build a single error message that outlines all missing variables.  Otherwise, a developer
  // will have to run their pipeline an incredible number of times to discover all the missing variables.
  if (!process.env.DOCASSEMBLE_DEVELOPER_API_KEY)
  {
    errorMessage += `\nThe DOCASSEMBLE_DEVELOPER_API_KEY GitHub secret must be defined. The DOCASSEMBLE_DEVELOPER_API_KEY is a docassemble API key you created for your server's testing account. It should have developer permissions.`
  }
  if (!process.env.PLAYGROUND_ID)
  {
    errorMessage += '\nThe PLAYGROUND_ID GitHub secret must be defined.  The PLAYGROUND_ID is the ID of the Docassemble suite to run.'
  }
  if (!process.env.BASE_URL && !process.env.SERVER_URL)
  {
    errorMessage += `\nThe SERVER_URL GitHub secret must be defined. The SERVER_URL is the URL of the Docassemble Server where the tests should be run.`;
  }
  if (!process.env.REPO_URL)
  {
    errorMessage += `\nThe REPO_URL GitHub secret must be defined. The REPO_URL is the URL to the Git repo whose Actions are being run.`;
  }
  if (!process.env.BRANCH_PATH && !process.env.BRANCH_NAME)
  {
    errorMessage += `\nThe BRANCH_NAME environment variable must be defined. The BRANCH_NAME is the name of the repository branch that should be pulled into the docassemble project.`;
  }

  errorMessage = errorMessage.trim();

  if (errorMessage !== '')
    throw new ReferenceError(errorMessage);
};
  
session_vars.validateEnvironment();

session_vars.get_dev_api_key = function () { return process.env.DOCASSEMBLE_DEVELOPER_API_KEY; };
session_vars.get_da_server_url = function () { return process.env.BASE_URL || process.env.SERVER_URL; };
session_vars.get_debug = function () { return process.env.DEBUG; };
session_vars.get_repo_url = function () { return process.env.REPO_URL; };
// missing/moving functionality:
// getBaseInterviewURL
// Project name setting/getting
// Playground id functionality needs to be transfered to api requests


session_vars.get_branch_name = function () {
  /* Get the name of the repository's branch that is being tested */
  let branch_name = null;
  if ( process.env.BRANCH_NAME ) {
    branch_name = process.env.BRANCH_NAME;
  } else if ( process.env.BRANCH_PATH ) {
    branch_name = process.env.BRANCH_PATH.replace( `refs/head/`, '' );
  }

  return branch_name;
};

session_vars.get_project_base_name = function () {
  /* Make an un-incremented project name based on the repo name and branch name. */
  let repo_url_without_trailing_slash = session_vars.get_repo_url().replace(/\/$/, '');
  let repo_name_parts = repo_url_without_trailing_slash.split('/');
  let package_name = repo_name_parts[ repo_name_parts.length - 1 ];

  let name = `testing${ package_name }${ session_vars.get_branch_name() }`;
  let sanitized_name = name.replace( /[^A-Za-z0-9]+/i, '' );
  return sanitized_name;
};

// // Notes: We were using `new_session=1` in the url args, but it wasn't
// // always working. The idea was to save each session so we could look
// // back on it if needed. Aside from the fact that you usually need to log in
// // to make the sessions retrievable (though if you're using `interview_list()`
// // you can get them anyway), it also has inconsistent behavior when
// // `sessions are unique`` or `temporary session` or use `interview_list()`
// // and/or respond immediately with a `command()`. Three ways to avoid this:
// // 1. x Start a new browser instead of just a new page each time. Lengthens the tests.
// // 1. √ Visit `/user/sign-out` (needed even if the user is not logged in)
// // 1. x (seems to be causing a 'Unable to locate interview session' error
// // instead) Use `reset=2` instead , which will not save the previous session at all. It
// // Will not just restart any existing interview sessions, it will also
// // clear out the browser session's memory of what other interviews the user has
// // visited in the same browser session_vars.
// session_vars.getBaseInterviewURL = function () {
//   /* Return the part of the interview URL that comes before the filename.
//   * Depends on the project name, which may have been changed. */
//   let new_session = `/interview?new_session=1&i=docassemble.playground`;
//   return `${ session_vars.BASE_URL }${ new_session }${ session_vars.PLAYGROUND_ID }${ session_vars.getProjectName() }%3A`;
// };
// // session_vars.BASE_INTERVIEW_URL = session_vars.getBaseInterviewURL();


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


const project_name_file_path = `_al_test_project_name.json`;
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
  console.log( `ALKiln: Saved new project name: ${ project_name }` );
  return file;
};  // Ends save_project_name()

session_vars.get_project_name = function () {
  /* Get the name of the current project  */
  let project_name =  JSON.parse( fs.readFileSync( project_name_file_path ));
  if ( session_vars.get_debug() ) { console.log( `Project name from file is "${ project_name }".` ); }
  return project_name;
};  // Ends get_project_name()

session_vars.delete_project_name = function () {
  /* Delete the filing storing the name of the docassemble project */
  // Avoid race coditions possibly caused by checking for existence first
  // Delete file if possible
  try {
    fs.unlinkSync( project_name_file_path );
    if ( session_vars.get_debug() ) { console.log( `ALKiln takedown: Deleted file that stored the name of Project.` ); }
    return true;
  } catch ( error ) {
    console.warn( `ALKiln WARNING: Could not delete the project name file. Error: ${ error }.` );
    return false;
  }
};
