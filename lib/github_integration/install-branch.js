const puppeteerutils = require('./puppeteer-utils');

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


const waitForPage = async (page) => {
  // Most reliable way we've found to be sure the server finishes restarting
  // This counts on the fact that docassemble makes a `test.yml` file
  // for every new project. This method doesn not care if the file errors.
  const tries = 20;
  const test_url = `${puppeteerutils.BASE_INTERVIEW_URL}%3Atest.yml`;

  await page.goto(test_url, {waitUntil: 'domcontentloaded'});

  for (i=0; i<tries; i++) {
    const element = await Promise.race([
      page.$('#daMainQuestion'),
      page.$x('//*[contains(text(), "History")]'),
    ]);
    if (element) {
      console.log("found question on page");
      break;
    } else {
      await page.screenshot({ path: './error-noInterview.jpg', type: 'jpeg', fullPage: true });
      console.log("question not found:", test_url);
      await page.waitFor(5 * 1000); // 5 seconds
      await page.reload();
    }
  }
};


module.exports = {setup, takedown};
