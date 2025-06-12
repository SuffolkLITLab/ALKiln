const chai = require(`chai`);
const expect = chai.expect;

const { try_to_break_the_news_gently } = require(`../../../lib/breaking_news.js`);

/** Example of process.argv: 
 * [
 *   `/Users/me/.nvm/versions/node/v18.17.0/bin/node`,
 *   `/Users/me/code/alkiln/lib/breaking_news.js`,
 *   `--alkiln_desired_version=6.20.0'`,
 *   `--alkip_version=1.0.0`
 * ]
 * */

describe(`try_to_break_the_news_gently() with`, function () {

  // ===== Announcements =====

  describe(`desired ALKiln at 5.15.0 and ALKiP at 1.3.1`, function () {

    it(`to return an announcement that includes "ALK0280"`, function () {
      process.argv = [`node_path`, `file_path`, `--alkiln_desired_version=5.15.0`, `--alkip_version=1.3.1`];
      let news = try_to_break_the_news_gently();
      expect( news ).to.include(`ALK0280`);
    });

  });

  describe(`current ALKiln at 5.14.1 and ALKiP at 1.4.0`, function () {

    it(`to return an announcement that includes "ALK0281"`, function () {
      process.argv = [`node_path`, `file_path`, `--alkiln_current_version=5.14.1`, `--alkip_version=1.4.0`];
      let news = try_to_break_the_news_gently();
      expect( news ).to.include(`ALK0281`);
    });

  });

  describe(`experimental versions of different formats for current ALKiln at 5.14.1-feat and ALKiP with a version greater than 1.3.1 purely because of the experimental version format at 1.3.1-b`, function () {

    it(`to return an announcement that includes "ALK0281"`, function () {
      process.argv = [`node_path`, `file_path`, `--alkiln_current_version=5.14.1-feat`, `--alkip_version=1.3.1-b`];
      let news = try_to_break_the_news_gently();
      expect( news ).to.include(`ALK0281`);
    });

  });


  // ===== Non-announcements =====

  describe(`desired ALKiln at 5.14.1 and ALKiP at 1.3.1`, function () {

    it(`to return no announcement ("ALK0278")`, function () {
      process.argv = [`node_path`, `file_path`, `--alkiln_desired_version=5.14.1`, `--alkip_version=1.3.1`];
      let news = try_to_break_the_news_gently();
      expect( news ).to.include(`ALK0278`);
    });

  });

  describe(`current ALKiln at 5.15.2 and ALKiP at 1.3.0`, function () {

    it(`to return no announcement ("ALK0278")`, function () {
      process.argv = [`node_path`, `file_path`, `--alkiln_current_version=5.15.2`, `--alkip_version=1.3.0`];
      let news = try_to_break_the_news_gently();
      expect( news ).to.include(`ALK0278`);
    });

  });

  describe(`experimental versions of different formats for current ALKiln at 5.15.2-3 and ALKiP at 1.3.0-5-2`, function () {

    it(`the version after the "-" doesn't get used as numbers and returns no announcement ("ALK0278")`, function () {
      process.argv = [`node_path`, `file_path`, `--alkiln_current_version=5.15.2-3`, `--alkip_version=1.3.0-5-2`];
      let news = try_to_break_the_news_gently();
      expect( news ).to.include(`ALK0278`);
    });

  });

});
