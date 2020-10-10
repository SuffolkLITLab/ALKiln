const puppeteer = require('puppeteer');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL;
const BRANCH_NAME = process.env.BRANCH_NAME
    || (process.env.BRANCH_PATH && process.env.BRANCH_PATH.split('/')[2])
    || 'master';
const PROJECT_NAME = ('testing' + BRANCH_NAME).replace(/[^A-Za-z0-9]/gi, '');
const BASE_INTERVIEW_URL = `${BASE_URL}/interview?reset=1&i=docassemble.playground${process.env.PLAYGROUND_ID}${PROJECT_NAME}`;

const initPuppeteer = async () => {
  const browser = await puppeteer.launch({headless: !process.env.DEBUG});
  const page = await browser.newPage();
  page.setDefaultTimeout(120 * 1000);

  return {'page': page, 'browser': browser};
}

const login = async () => {
  const {page, browser} = await initPuppeteer();
  // Login
  await page.goto(`${BASE_URL}/user/sign-in?`, {waitUntil: 'domcontentloaded'});
  const emailElement = await page.$('#email');
  await emailElement.type(process.env.PLAYGROUND_EMAIL);
  const passwordElement = await page.$('#password');
  await passwordElement.type(process.env.PLAYGROUND_PASSWORD);
  await Promise.all([
    passwordElement.press('Enter'),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);
  return {'page': page, 'browser': browser};
};

const navigateToManageProject = async (page) => {
  // Go to manage projects page URL
  await page.goto(`${BASE_URL}/playgroundproject`, {waitUntil: 'domcontentloaded'});
};

const createProject = async (page) => {
  await navigateToManageProject(page);
  // Check if a project with this name already exists
  const projectLink = `[href="/playground?project=${PROJECT_NAME}"]`;
  const projectButton = await page.$(projectLink);
  // If project already exists, don't create a new one
  if (projectButton) {
    return;
  }
  // Go to "Add a new project" page
  await page.goto(`${BASE_URL}/playgroundproject?new=1&project=default`, {waitUntil: 'domcontentloaded'});
  // Enter new project name
  const projectNameElement = await page.$('#name');
  await projectNameElement.type(PROJECT_NAME);
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
  const deleteLink = `[href="/playgroundproject?delete=1&project=${PROJECT_NAME}"]`;
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

const installUrl = () => `${BASE_URL}/pullplaygroundpackage?${urlParams(
  {
    project: PROJECT_NAME,
    github: process.env.REPO_URL,
    branch: BRANCH_NAME,
  }
)}`;

const urlParams = (params) => urlString = Object.keys(params).map(
  (key) => `${key}=${params[key]}`
).join('&')

const installRepo = async (page) => {
  console.log( 'BRANCH_NAME:', BRANCH_NAME, '; pull url:', installUrl() );
  await page.goto(installUrl(), {waitUntil: 'domcontentloaded'});

  // Wait for the options to appear after the ajax call
  let optSelector = '[value="' + BRANCH_NAME + '"]';
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
  BASE_INTERVIEW_URL: BASE_INTERVIEW_URL,
  BRANCH_NAME: BRANCH_NAME,
  login: login,
  createProject: createProject,
  deleteProject: deleteProject,
  installRepo: installRepo,
  initPuppeteer: initPuppeteer,
};
