require('dotenv').config();

const env_vars = {
  PLAYGROUND_ID: process.env.PLAYGROUND_ID,
  PLAYGROUND_EMAIL: process.env.PLAYGROUND_EMAIL,
  PLAYGROUND_PASSWORD: process.env.PLAYGROUND_PASSWORD,
  BASE_URL: process.env.BASE_URL,
  BRANCH_NAME: process.env.BRANCH_PATH && process.env.BRANCH_PATH.split('/')[1] || 'test',
  REPO_URL: process.env.REPO_URL,
  DEBUG: process.env.DEBUG,
};

env_vars.PROJECT_NAME = ('testing' + env_vars.BRANCH_NAME).replace(/[^A-Za-z0-9]/gi, '');
env_vars.BASE_INTERVIEW_URL = `${env_vars.BASE_URL}/interview?new_session=1&i=docassemble.playground${env_vars.PLAYGROUND_ID}${env_vars.PROJECT_NAME}%3A`;


module.exports = env_vars;
