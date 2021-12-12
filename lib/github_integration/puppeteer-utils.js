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
  // Because of private repo issues (#417), can't use `github` url arg
  let params_for_url =  urlParams({ project: env_vars.getProjectName() });
  return `${ env_vars.BASE_URL }/pullplaygroundpackage?${ params_for_url }`;
};

const urlParams = (params) => urlString = Object.keys(params).map(
  (key) => `${key}=${params[key]}`
).join('&')

const tap_pull = async ( page, elem_to_blur ) => {
  await elem_to_blur.evaluate((elem) => { elem.blur(); });

  try {
    // Wait for the options to appear after the ajax call
    let optSelector = '[value="' + env_vars.BRANCH_NAME + '"]';
    console.log( `Looking for the ${ env_vars.BRANCH_NAME } branch of the repository at ${ env_vars.REPO_URL }.\n` );
    await page.waitFor( optSelector );  // This is the key
    console.log( `We found the ${ env_vars.BRANCH_NAME } branch of the repository at ${ env_vars.REPO_URL }. Next, we will try to pull the code.\n` );
    let html = await page.$eval( optSelector, (elem) => { return elem.innerHTML });  // Why are we doing this?
  
    // Tap 'Pull' and wait till the page has finished loading
    const pullButton = await page.$('button[name=pull]');
    await Promise.all([
      pullButton.click(),
      page.waitForNavigation({waitUntil: 'domcontentloaded'}),
    ]);
  } catch ( error ) {
    return { succeeded: false, error: error };
  }

  return { succeeded: true, error: null };
}

const installRepo = async (page) => {
  // await page.goto(installUrl(), {waitUntil: 'domcontentloaded'});
  // `https://apps-dev.suffolklitlab.org/playgroundpackages?project=EmptyProject`
  let package_url = `${ env_vars.BASE_URL }/playgroundpackages?project=${ env_vars.getProjectName() }`;
  await page.goto(package_url, {waitUntil: 'domcontentloaded'});

  // Without this temporary workaround, a current bug will not
  // allow you to pull from a private repo if the Project is empty.
  // For now, we'll make a package first so it's not empty.
  let package_input = await page.$( `#file_name` );
  await package_input.type( `TemporaryFix` );
  let save_button = await page.$( `button[value="Save"]` );
  Promise.all([
    save_button.evaluate( (el) => { return el.click(); }),
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  ]);
  // Waiting for navigation isn't enough.
  await page.waitFor( 1000 );
  await page.waitForSelector(`#daDelete`, { visible: true });

  await page.goto(installUrl(), {waitUntil: 'domcontentloaded'});
  // For private repos especially, needs the format
  // git@github.com:user/docassemble-package.git from original
  // format https://github.com/user/docassemble-package
  let user = env_vars.REPO_URL.split("/")[3];
  let package = env_vars.REPO_URL.split("/")[4];
  let repo_input = await page.$( `#github_url` );
  await repo_input.type( `git@github.com:${ user }/${ package }.git` );

  let result = await tap_pull( page, repo_input );

  // if body contains "Could not read from remote repository"
  let permissions_failed = await page.$eval(`body`, function (elem) {
    return elem.innerText.includes("Could not read from remote repository");
  });

  // Try just the regular env_vars.REPO_URL
  if ( permissions_failed ) {
    console.log( `If this is a private repo, pay attention to the following: we tried to pull the package using the testing account's docassemble GitHub integration and the address git@github.com:${ user }/${ package }.git. It looks like the testing account is either not integrated with GitHub or the testing account GitHub account does not have permissions in this private GitHub repo. Try setting up the GitHub permissions for that docassemble testing account. If you're sure you have already done so, make an issue at https://github.com/SuffolkLITLab/ALKiln/issues.\n` );
    await page.goto(installUrl(), {waitUntil: 'domcontentloaded'});
    repo_input = await page.$( `#github_url` );  // new page, new input element
    await repo_input.type( env_vars.REPO_URL );
    result = await tap_pull( page, repo_input );
    if ( result.error ) { throw result.error; }
  } else if ( result.error ) {
    // If there was a different problem, throw that error
    throw result.error;
  }
  // What's a better way to handle this in the future?
  // With the API, check if the user has GitHub integration set up.

  // After all the pulling has been tried that needs to be tried, wait for loading to finish
  try {
    // server/module reload. See https://github.com/plocket/docassemble-cucumber/issues/367#issuecomment-892591770
    // The selector find the 'Package Name' field on the 'Packages' page
    await page.waitForSelector(`#file_name`, { visible: true })
  } catch ( error ) {
    console.log( `It looks like pulling the ${ env_vars.BRANCH_NAME } branch of the repository at ${ env_vars.REPO_URL } failed. Download the error screenshots in the GitHub Action artifacts to see if it tells you more.\n` );
    throw error ;
  }

  console.log( `Pulled the GitHub branch "${ env_vars.BRANCH_NAME }" into the project "${ env_vars.getProjectName() }".\n` );
}



module.exports = {
  login: login,
  createProject: createProject,
  deleteProject: deleteProject,
  installRepo: installRepo,
  initPuppeteer: initPuppeteer,
};
