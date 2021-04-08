const puppeteer = require('puppeteer');
const env_vars = require('../utils/env_vars');

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
  // Check if a project with this name already exists
  // If it does, come up with a new project name
  await navigateToManageProject(page);
  let projectExists = true;
  let nameIncrementer = 0;
  while (projectExists) {
    let projectLinkSelector = `[href="/playground?project=${env_vars.PROJECT_NAME}"]`;
    // This might be the 'Back to Playground' button because it remembers the last
    // project you visited, even if it doesn't exist anymore
    let projectButton = await page.$(projectLinkSelector);
    if (projectButton) {
      let text = await page.$eval(projectLinkSelector, elem => elem.innerText);
      // If project already exists, use a new project name
      if ( text === env_vars.PROJECT_NAME ) {
        env_vars.PROJECT_NAME = env_vars.PROJECT_NAME + nameIncrementer;
        nameIncrementer++;
      } else {
        projectExists = false;
      }
    } else {
      projectExists = false;
    }
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
  await page.goto(installUrl(), {waitUntil: 'domcontentloaded'});

  // Wait for the options to appear after the ajax call
  let optSelector = '[value="' + env_vars.BRANCH_NAME + '"]';
  await page.waitFor( optSelector );  // This is the key
  let html = await page.$eval( optSelector, (elem) => { return elem.innerHTML });

  // Tap 'Pull' and wait till the page has finished loading
  const pullButton = await page.$('button[name=pull]');
  await Promise.all([
    pullButton.click(),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);
}

module.exports = {
  login: login,
  createProject: createProject,
  deleteProject: deleteProject,
  installRepo: installRepo,
  initPuppeteer: initPuppeteer,
};
