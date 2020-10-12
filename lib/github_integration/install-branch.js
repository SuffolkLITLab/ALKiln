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
  console.log("interview url:", test_url);
  console.log("This isn meant to make sure the interview will load. Sometimes it doesn't work. If this test errors because the interview wouldn't load, you can try re-running this test.");

  await page.goto(test_url, {waitUntil: 'domcontentloaded'});

  // Wait till an interview can load
  for (i=0; i < tries; i++) {
    const element = await Promise.race([
      page.$('#daMainQuestion'),
      page.$x('//*[contains(text(), "History")]'),
    ]);

    if (element) {
      console.log("found question on page");
      break;
    } else {
      let waitTime = 5  // 5 seconds
      await page.screenshot({ path: './error-noInterview.jpg', type: 'jpeg', fullPage: true });
      if ( i === tries ) {
        console.log('Giving up.');
      } else {
        console.log(`Attempt ${i + 1} of ${ tries }. Will try again in ${ waitTime } seconds`);
      }
      await page.waitFor(waitTime * 1000);  // seconds
      await page.reload();
    }
  }
};


module.exports = {setup, takedown};
