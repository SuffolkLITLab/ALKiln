require('dotenv').config();

/* This file is providint both `process.env` variables and other variables
*    that are needed in a similar way, but are not `process.env` variables themselves,
*    though they are based on the `process.env` variables.
* 
* The alternative seems to be some `process.env` type variables and some `foo`
*    variables without great ways to differentiate between them. That or duplicate
*    fiddly work in multiple files.
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

env_vars.PROJECT_NAME = ('testing' + env_vars.BRANCH_NAME).replace(/[^A-Za-z0-9]/gi, '');
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
env_vars.BASE_INTERVIEW_URL = `${env_vars.BASE_URL}/interview?new_session=1&i=docassemble.playground${env_vars.PLAYGROUND_ID}${env_vars.PROJECT_NAME}%3A`;

// These are actually the words that are on the buttons or links
// that change the language of the interview. Have not yet detected
// another distinguishing feature
if ( process.env.EXTRA_LANGUAGES && process.env.EXTRA_LANGUAGES !== 'default' ) {
  env_vars.EXTRA_LANGUAGES = process.env.EXTRA_LANGUAGES.split(', ');
} else {
  env_vars.EXTRA_LANGUAGES = [];
}


module.exports = env_vars;
