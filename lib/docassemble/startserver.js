#!/usr/bin/env node
const puppeteer = require('puppeteer');
const da_i = require('./docassemble_api_interface');
const session_vars = require('../utils/session_vars');

const fs = require('fs')

const startserver = async () => {
  // Open the browser, login with env var creds
  let browser = await puppeteer.launch({headless: !session_vars.get_debug()})
  let page = await browser.newPage();
  // Go to the sign in page
  let login_url = `${ session_vars.get_da_server_url() }/user/sign-in`;
  try {
    // puppeteer will ensure proper timeout.
    await page.goto( login_url, { waitUntil: `domcontentloaded`, timeout: 3000 });
    await page.waitForSelector( `.dabody` );
  } catch ( error ) {
    let err_msg = `Error occurred when ALKiln tried to go to "${ login_url }: ${ error }".`
    console.log(err_msg);
    throw error;
  } 

  let email = process.env[ "USER_EMAIL" ];
  let password = process.env[ "USER_PASSWORD" ];

  // Try to log in
  await page.type( `#email`, email );
  await page.type( `#password`, password );
  let elem = await page.$( `button[name="submit"]` );
  await elem.click();
  await page.waitForNavigation({waitUntil: 'domcontentloaded'});

  // Wait to see the success message.
  // This is a bit of an assumption and needs success and failure testing
  // TODO: use a Promise.race to fail faster.
  await page.waitForSelector( `.datopcenter .alert-success` );
  // make an API key

  // TODO(brycew): with or without the API key?
  // Install the package in order to also install all of its dependencies
  let api_key_url = `${ session_vars.get_da_server_url() }/manage_api?action=new`;
  await page.goto( api_key_url, { waitUntil: `domcontentloaded`, timeout: 3000 });
  await page.type( `#name`, "ALKiln tmp key");
  await page.select( `#method`, "none");
  let winner = await Promise.all([page.click(`#submit`), page.waitForNavigation({waitUntil: 'domcontentloaded'})]);
  console.log(`submitted`);
  const api_text = await page.$eval('body p code', elem => elem.innerText);
  process.env.DOCASSEMBLE_DEVELOPER_API_KEY = api_text;
  console.log(`api key: ${api_text}`);
  let file = fs.writeFileSync( ".tmpenv", `export DOCASSEMBLE_DEVELOPER_API_KEY=${api_text}`);

  await page.goto(`${ session_vars.get_da_server_url() }/user/sign-out`, {waitUntil: `domcontentloaded`});  
  console.log(`signed out`);
  await browser.close();
  let task_id = await da_i.install_on_server();
  if (task_id) {
    console.log("Waiting...")
    await da_i.wait_for_server_to_restart(task_id);
  }
  console.log("Done!")
};  // Ends startserver();

startserver();