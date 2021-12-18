const fs = require('fs');
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
const user_vars = {
  PLAYGROUND_ID: process.env.PLAYGROUND_ID,  // Need to get rid of this in favor of API
};

/**
 * Ensure all required environment variables exist. Add each missing variable
 *    to an error that will be thrown at the end.
 * 
 * @throws ReferenceError with a message for all missing variables. 
 */
 user_vars.validateEnvironment = function() {

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
  
user_vars.validateEnvironment();


let get_branch_name = function () {
  /* Get the name of the repository branch that is being tested */
  let branch_name = null;
  if ( process.env.BRANCH_NAME ) {
    branch_name = process.env.BRANCH_NAME;
  } else if ( process.env.BRANCH_PATH ) {
    // Path could be 'refs/branch_name' or 'refs/head/branch_name' and maybe other things
    // Path could also be 'refs/head/releases/v3' and we need to handle that. How?
    let split = process.env.BRANCH_PATH.split('/');
    branch_name = split[ split.length - 1 ];
  }

  return branch_name;
};

// // ---- Project name ----
// let no_starting_digit = ( 'testing' + user_vars.BRANCH_NAME ).replace( /^[0-9]+/i, '' );
// user_vars.PROJECT_BASE_NAME = no_starting_digit.replace( /[^A-Za-z0-9]+/gi, '' );

// const project_name_file_path = '_al_test_project_name.json';
// user_vars.setProjectName = function ( value ) {
//   // As long as it's a string, it can be made safe for a project name
//   if ( typeof value !== 'string' ) { throw new TypeError(`The project's name must start as a string. It was ${ value }.`); }
//   // Make the name safe for a project name
//   let no_starting_digit = value.replace( /^[0-9]+/i, '' );
//   let alphanumeric = no_starting_digit.replace( /[^A-Za-z0-9]+/gi, '' );
//   // Create or modify a file to store the actual name of the project
//   // for later deletion as internal values and context get destroyed before
//   // the takedown command that comes later. It's a string, not a list, to avoid
//   // the list getting out of date and deleting another test's project.
//   fs.writeFileSync( project_name_file_path, JSON.stringify( alphanumeric ));
//   console.log( `Saved new project name: ${ alphanumeric }` );

//   return alphanumeric;
// }

// user_vars.getProjectName = function () {
//    Get the stored name of the project that was created on the
//   * server - the base project name might have been adjusted to
//   * avoid overwriting existing project. 
//   if ( user_vars.DEBUG ) { console.trace( `Getting project name` ); }
//   let actual_proj_name = null;
//   // Avoid race coditions possibly caused by checking for existence first
//   try {
//     actual_proj_name = JSON.parse( fs.readFileSync( project_name_file_path ));
//     if ( user_vars.DEBUG ) { console.log( `Project name from file is ${ actual_proj_name }.` ); }
//   } catch ( error ) {}  // Do nothing

//   // If no such file existed or value was invalid, set up the file with a basic name
//   if ( !actual_proj_name ) {
//     actual_proj_name = user_vars.setProjectName( user_vars.PROJECT_BASE_NAME );
//   }

//   if ( user_vars.DEBUG ) { console.log( `Processed project name is "${ actual_proj_name }"` ); }
//   return actual_proj_name;
// };

// user_vars.cleanUpProjectName = function () {
//   /* Delete stored name of project */
//   // Avoid race coditions possibly caused by checking for existence first
//   // Delete file if possible
//   try { fs.unlinkSync( project_name_file_path ); }
//   catch ( error ) {
//     console.warn(`After trying to delete the project created for the test, the file containing the name of project did not exist. ${ error }`)
//   }
// };

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
// // visited in the same browser session.
// user_vars.getBaseInterviewURL = function () {
//   /* Return the part of the interview URL that comes before the filename.
//   * Depends on the project name, which may have been changed. */
//   let new_session = `/interview?new_session=1&i=docassemble.playground`;
//   return `${ user_vars.BASE_URL }${ new_session }${ user_vars.PLAYGROUND_ID }${ user_vars.getProjectName() }%3A`;
// };
// // user_vars.BASE_INTERVIEW_URL = user_vars.getBaseInterviewURL();


let get_languages = function () {
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
};  // Ends get_languages

user_vars.get_dev_api_key = function () { return process.env.DOCASSEMBLE_DEVELOPER_API_KEY; };
user_vars.get_da_server_url = function () { return process.env.BASE_URL || process.env.SERVER_URL; };
user_vars.get_project_name = function () { return user_vars.getProjectName(); };
user_vars.get_debug = function () { return process.env.DEBUG; };
user_vars.get_repo_url = function () { return process.env.REPO_URL; };
user_vars.get_branch = function () { return get_branch_name(); };
user_vars.get_languages = function () { return get_languages(); };
// missing/moving functionality:
// getBaseInterviewURL
// Project name setting/getting
// Playground id functionality needs to be transfered to api requests


module.exports = user_vars;
