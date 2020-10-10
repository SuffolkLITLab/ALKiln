const puppeteerutils = require('./puppeteer-utils');
const interviewConstants = require('./interview-constants.js');

const setup = async () => {
  let {page, browser} = await puppeteerutils.login();
  try {
    await puppeteerutils.createProject(page);
    await puppeteerutils.installRepo(page);
    await waitForPage(page);  // Ensure server has really restarted
  }
  catch (e) {
    console.log(e);
  }
  finally {
    browser.close();
  }
};

const takedown = async () => {
  let {page, browser} = await puppeteerutils.login();
  try {
    await puppeteerutils.deleteProject(page);
  }
  catch (e) {
    console.log(e);
  }
  finally {
    browser.close();
  }
};

// Way we've found to be sure the server finishes restarting
const waitForPage = async (page) => {
  const tries = 20;

  await page.goto(interviewConstants.INTERVIEW_URL, {waitUntil: 'domcontentloaded'});

  for (i=0; i<tries; i++) {    
    const element = await page.$('#daMainQuestion');
    if (element) {
      console.log("found question on page");
      break;
    } else {
      console.log("question not found:", interviewConstants.INTERVIEW_URL);
      await page.waitFor(5 * 1000); // 5 seconds
      await page.reload();
    }
  }
};


module.exports = {setup, takedown};
