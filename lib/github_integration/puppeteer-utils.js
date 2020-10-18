const puppeteer = require('puppeteer');
const env_vars = require('../utils/env_vars');

// const BRANCH_NAME = env_vars.BRANCH_NAME;
// const PROJECT_NAME = ('testing' + BRANCH_NAME).replace(/[^A-Za-z0-9]/gi, '');
// const BASE_INTERVIEW_URL = `${BASE_URL}/interview?reset=1&i=docassemble.playground${env_vars.PLAYGROUND_ID}${PROJECT_NAME}%3A`;

const initPuppeteer = async () => {
  const browser = await puppeteer.launch({headless: !env_vars.DEBUG});
  const page = await browser.newPage();
  page.setDefaultTimeout(120 * 1000);

  return {'page': page, 'browser': browser};
}

const login = async () => {
  const {page, browser} = await initPuppeteer();
  // Login
  await page.goto(`${env_vars.BASE_URL}/user/sign-in?`, {waitUntil: 'domcontentloaded'});
  const emailElement = await page.$('#email');
  await emailElement.type(env_vars.PLAYGROUND_EMAIL);
  const passwordElement = await page.$('#password');
  await passwordElement.type(env_vars.PLAYGROUND_PASSWORD);
  await Promise.all([
    passwordElement.press('Enter'),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);
  return {'page': page, 'browser': browser};
};

const navigateToManageProject = async (page) => {
  // Go to manage projects page URL
  await page.goto(`${env_vars.BASE_URL}/playgroundproject`, {waitUntil: 'domcontentloaded'});
};

const createProject = async (page) => {
  await navigateToManageProject(page);
  // Check if a project with this name already exists
  const projectLink = `[href="/playground?project=${env_vars.PROJECT_NAME}"]`;
  const projectButton = await page.$(projectLink);
  // If project already exists, don't create a new one
  if (projectButton) {
    return;
  }
  // Go to "Add a new project" page
  await page.goto(`${env_vars.BASE_URL}/playgroundproject?new=1&project=default`, {waitUntil: 'domcontentloaded'});
  // Enter new project name
  const projectNameElement = await page.$('#name');
  await projectNameElement.type(env_vars.PROJECT_NAME);
  // Click Save
  const saveButton = await page.$('[type="submit"]');
  await Promise.all([
    saveButton.click(),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);
};

const deleteProject = async (page) => {
  await navigateToManageProject(page);
  // Click Delete button
  const deleteLink = `[href="/playgroundproject?delete=1&project=${env_vars.PROJECT_NAME}"]`;
  const deleteButton = await page.$(deleteLink);
  if (!deleteLink) {
    console.log('No such project exists');
    return;
  }
  await Promise.all([
    deleteButton.click(),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);
  // Click Delete button again
  const deleteButton2 = await page.$('[type="submit"]');
  await Promise.all([
    deleteButton2.click(),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);
};

const installUrl = () => `${env_vars.BASE_URL}/pullplaygroundpackage?${urlParams(
  {
    project: env_vars.PROJECT_NAME,
    github: env_vars.REPO_URL,
    branch: env_vars.BRANCH_NAME,
  }
)}`;

const urlParams = (params) => urlString = Object.keys(params).map(
  (key) => `${key}=${params[key]}`
).join('&')

const installRepo = async (page) => {
  console.log( 'env_vars.BRANCH_NAME:', env_vars.BRANCH_NAME, '; pull url:', installUrl() );
  await page.goto(installUrl(), {waitUntil: 'domcontentloaded'});

  // Wait for the options to appear after the ajax call
  let optSelector = '[value="' + env_vars.BRANCH_NAME + '"]';
  await page.waitFor( optSelector );  // This is the key
  let html = await page.$eval( optSelector, (elem) => { return elem.innerHTML });
  console.log('<option> text:', html);  // Sanity check

  // Tap 'Pull' and wait till the page has finished loading
  const pullButton = await page.$('button[name=pull]');
  await Promise.all([
    pullButton.click(),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);
}

module.exports = {
  BASE_INTERVIEW_URL: env_vars.BASE_INTERVIEW_URL,
  BRANCH_NAME: env_vars.BRANCH_NAME,
  login: login,
  createProject: createProject,
  deleteProject: deleteProject,
  installRepo: installRepo,
  initPuppeteer: initPuppeteer,
};
