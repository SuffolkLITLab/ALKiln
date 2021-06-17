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
  /* Create a project with a unique name. Its name will be stored in an ignored file. */

  // Check if a project with this name already exists
  // If it does, come up with a new project name
  await navigateToManageProject(page);
  let projectExists = true;
  let nameIncrementer = 0;
  let base_project_name = env_vars.getProjectName();  // Will stay the same so just the number increments
  let actual_project_name = base_project_name;
  while ( projectExists ) {
  if ( env_vars.DEBUG ) { console.log( `Trying the project name "${ actual_project_name }"` ); }
    let projectLinkSelector = `[href="/playground?project=${ actual_project_name }"]`;
    // This might be the 'Back to Playground' button because it remembers the last
    // project you visited, even if it doesn't exist anymore
    let projectButton = await page.$(projectLinkSelector);
    if ( projectButton ) {
      let text = await page.$eval(projectLinkSelector, elem => elem.innerText);
      // If project already exists, try a new project name
      if ( text === actual_project_name ) {
        actual_project_name = base_project_name + nameIncrementer;
        nameIncrementer++;
      } else {
        projectExists = false;
      }
    } else {
      projectExists = false;
    }
  }

  // Store the actual name of the project for later deletion
  safe_project_name = env_vars.setProjectName( actual_project_name );

  // Go to "Add a new project" page
  await page.goto(`${env_vars.BASE_URL}/playgroundproject?new=1&project=default`, {waitUntil: 'domcontentloaded'});
  // Enter new project name
  const projectNameElement = await page.$('#name');
  await projectNameElement.type( safe_project_name );
  // Click Save
  const saveButton = await page.$('[type="submit"]');
  await Promise.all([
    saveButton.click(),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);

  console.log( `Created the project "${ actual_project_name }" with no contents yet.` );
};

const deleteProject = async (page) => {
  await navigateToManageProject(page);

  let proj_name = env_vars.getProjectName();
  console.log(`Trying to delete "${ proj_name }".`);

  // Click Delete button
  const deleteLink = `[href="/playgroundproject?delete=1&project=${ proj_name }"]`;
  const deleteButton = await page.$(deleteLink);
  if ( !deleteButton ) {
    console.log(`The project "${ proj_name }" does not seem to exist.`);
    return;
  }
  await Promise.all([
    deleteButton.click(),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);
  // Click follow-up screen Delete confirmation button
  const deleteButton2 = await page.$('[type="submit"]');
  await Promise.all([
    deleteButton2.click(),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ]);

  // Delete project name file if possible
  env_vars.cleanUpProjectName();
  console.log(`Deleted the project "${ proj_name }".`);
};

const installUrl = function () {
  let params_for_url =  urlParams({
    project: env_vars.getProjectName(),
    github: env_vars.REPO_URL,
    branch: env_vars.BRANCH_NAME,
  });
  return `${ env_vars.BASE_URL }/pullplaygroundpackage?${ params_for_url }`;
};

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

  console.log( `Pulled the GitHub branch "${ env_vars.BRANCH_NAME }" into the project "${ env_vars.getProjectName() }".` );
}



module.exports = {
  login: login,
  createProject: createProject,
  deleteProject: deleteProject,
  installRepo: installRepo,
  initPuppeteer: initPuppeteer,
};
