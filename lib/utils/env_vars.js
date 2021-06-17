const fs = require('fs');

require('dotenv').config();

/* This file is providint both `process.env` variables and other variables
*    that are needed in a similar way, but are not `process.env` variables themselves,
*    though they are based on the `process.env` variables.
* 
* The alternative seems to be some `process.env` type variables and some `foo`
*    variables without great ways to differentiate between them. That or duplicate
*    fiddly work in multiple files.
* 
* The need to get and set project name, etc. makes me wonder if we should create
* a class with getters and setters, but general wisdom is that it's a bad idea and
* maybe it comes to mind because I'm used to asking for `env_vars.CAPS_CASE`. Another
* alternative is `env_vars.get( 'CAPS_CASE' )` and `env_vars.set( 'CAPS_CASE', 'value' )`
*/
const env_vars = {
  PLAYGROUND_ID: process.env.PLAYGROUND_ID,
  PLAYGROUND_EMAIL: process.env.PLAYGROUND_EMAIL,
  PLAYGROUND_PASSWORD: process.env.PLAYGROUND_PASSWORD,
  BASE_URL: process.env.BASE_URL,
  REPO_URL: process.env.REPO_URL,
  DEBUG: process.env.DEBUG,
};

// Path could be 'refs/branch_name' or 'refs/head/branch_name' and maybe other things
// Assume branch name is last part of branch path
if ( process.env.BRANCH_PATH ) {
  let split = process.env.BRANCH_PATH.split('/');
  env_vars.BRANCH_NAME = split[ split.length - 1 ];
} else {
  env_vars.BRANCH_NAME = 'test'
}

// ---- Project name ----
let no_starting_digit = ( 'testing' + env_vars.BRANCH_NAME ).replace( /^[0-9]+/i, '' );
env_vars.PROJECT_BASE_NAME = no_starting_digit.replace( /[^A-Za-z0-9]+/gi, '' );

const project_name_file_path = '_al_test_project_name.json';
env_vars.setProjectName = function ( value ) {
  // As long as it's a string, it can be made safe for a project name
  if ( typeof value !== 'string' ) { throw new TypeError(`The project's name must start as a string. It was ${ value }.`); }
  // Make the name safe for a project name
  let no_starting_digit = value.replace( /^[0-9]+/i, '' );
  let alphanumeric = no_starting_digit.replace( /[^A-Za-z0-9]+/gi, '' );
  // Create or modify a file to store the actual name of the project
  // for later deletion as internal values and context get destroyed before
  // the takedown command that comes later. It's a string, not a list, to avoid
  // the list getting out of date and deleting another test's project.
  fs.writeFileSync( project_name_file_path, JSON.stringify( alphanumeric ));
  console.log( `Saved new project name: ${ alphanumeric }` );

  return alphanumeric;
}

env_vars.getProjectName = function () {
  /* Get the stored name of the project that was created on the
  * server - the base project name might have been adjusted to
  * avoid overwriting existing project. */
  if ( env_vars.DEBUG ) { console.trace( `Getting project name` ); }
  let actual_proj_name = null;
  // Avoid race coditions possibly caused by checking for existence first
  try {
    actual_proj_name = JSON.parse( fs.readFileSync( project_name_file_path ));
    if ( env_vars.DEBUG ) { console.log( `Project name from file is ${ actual_proj_name }.` ); }
  } catch ( error ) {}  // Do nothing

  // If no such file existed or value was invalid, set up the file with a basic name
  if ( !actual_proj_name ) {
    actual_proj_name = env_vars.setProjectName( env_vars.PROJECT_BASE_NAME );
  }

  if ( env_vars.DEBUG ) { console.log( `Processed project name is "${ actual_proj_name }"` ); }
  return actual_proj_name;
};

env_vars.cleanUpProjectName = function () {
  /* Delete stored name of project */
  // Avoid race coditions possibly caused by checking for existence first
  // Delete file if possible
  try { fs.unlinkSync( project_name_file_path ); }
  catch ( error ) {
    console.warn(`After trying to delete the project created for the test, the file containing the name of project did not exist. ${ error }`)
  }
};

// Notes: We were using `new_session=1` in the url args, but it wasn't
// always working. The idea was to save each session so we could look
// back on it if needed. Aside from the fact that you usually need to log in
// to make the sessions retrievable (though if you're using `interview_list()`
// you can get them anyway), it also has inconsistent behavior when
// `sessions are unique`` or `temporary session` or use `interview_list()`
// and/or respond immediately with a `command()`. Three ways to avoid this:
// 1. x Start a new browser instead of just a new page each time. Lengthens the tests.
// 1. √ Visit `/user/sign-out` (needed even if the user is not logged in)
// 1. x (seems to be causing a 'Unable to locate interview session' error
// instead) Use `reset=2` instead , which will not save the previous session at all. It
// Will not just restart any existing interview sessions, it will also
// clear out the browser session's memory of what other interviews the user has
// visited in the same browser session.
env_vars.getBaseInterviewURL = function () {
  /* Return the part of the interview URL that comes before the filename.
  * Depends on the project name, which may have been changed. */
  let new_session = `/interview?new_session=1&i=docassemble.playground`;
  return `${ env_vars.BASE_URL }${ new_session }${ env_vars.PLAYGROUND_ID }${ env_vars.getProjectName() }%3A`;
};
env_vars.BASE_INTERVIEW_URL = env_vars.getBaseInterviewURL();


// These are actually the words that are on the buttons or links
// that change the language of the interview. Have not yet detected
// another distinguishing feature
if ( process.env.EXTRA_LANGUAGES && process.env.EXTRA_LANGUAGES !== 'default' ) {
  env_vars.EXTRA_LANGUAGES = process.env.EXTRA_LANGUAGES.split(', ');
} else {
  env_vars.EXTRA_LANGUAGES = [];
}


module.exports = env_vars;
