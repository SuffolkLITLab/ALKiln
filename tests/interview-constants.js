const putils = require('./puppeteer-utils');

// Each repo has its own interview that it's testing
// We'll deal with multiple urls when it becomes an issue
let filename = 'basic_questions_tests';  // Easier to edit
const INTERVIEW_URL_START = process.env.INTERVIEW_URL || `${putils.BASE_INTERVIEW_URL}%3A`;
const INTERVIEW_URL = process.env.INTERVIEW_URL || `${INTERVIEW_URL_START}${filename}.yml`;


module.exports = {
  INTERVIEW_URL,
  INTERVIEW_URL_START
};
