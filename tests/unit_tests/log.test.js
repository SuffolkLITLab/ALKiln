const chai = require('chai');
const expect = chai.expect;
const fs = require(`fs`);

const Log = require('../../lib/utils/log.js');

const path = `_alkiln-misc_artifacts/logs_${ Date.now() }`;
const log = new Log({ path, context: `unit_tests log_tests` });
const temp_log_path = `_alkiln-log_test_path`;

describe(`An instance of log`, function () {

  /** Creates the right files and folders */

  it(`creates a folder at the given path`, async function() {
    const temp_log1 = new Log({ path: temp_log_path });
    const exists = fs.existsSync( temp_log_path );
    expect( exists ).to.be.true;
    // Clean up by deleting the folder
    fs.rmSync(temp_log_path, { recursive: true, force: true });
  });

  it(`creates a debug file at the given path`, async function() {
    const temp_log2 = new Log({ path: temp_log_path });
    const exists = fs.existsSync(`${temp_log2.path}/${temp_log2.debug_log_filename}`);
    expect( exists ).to.be.true;
    // Clean up by deleting the folder
    fs.rmSync(temp_log_path, { recursive: true, force: true });
  });

  it(`creates an unexpected results file on error at the given path`, async function() {
    const temp_log3 = new Log({ path: temp_log_path });
    try {
      temp_log3.throw({ error: new Error(`Unexpected results test error`) });
    } catch ( error ) {
      // Do nothing, go on to the other tests
    }
    const exists = fs.existsSync(`${temp_log3.path}/${temp_log3.unexpected_filename}`);
    expect( exists ).to.be.true;
    // Clean up by deleting the folder
    fs.rmSync(temp_log_path, { recursive: true, force: true });
  });

  /** Returns and/or stores the right values with the given arguments */

  describe(`with an empty .debug`, function () {
    it(`returns the right values`, async function() {
      let returned = log.debug();
      expect_debug_file_to_include(`🐛 ALK000d DEBUG`);
    });
    it(`stores the right values in the debug file`, async function() {
      expect_debug_file_to_include(`🐛 ALK000d DEBUG`);
    });
  })

  describe(`with an empty .console`, function () {
    it(`returns the right values`, async function() {
      let returned = log.console();
      expect( returned ).to.include(`* ALK000c LOG`);
    });
    it(`stores the right values in the debug file`, async function() {
      expect_debug_file_to_include(`* ALK000c LOG`);
    });
  })

  describe(`with an empty log.success`, function () {
    it(`returns the right values`, async function() {
      let returned = log.success();
      expect( returned ).to.include(`🌈 ALK000s SUCCESS`);
    });
    it(`stores the right values in the debug file`, async function() {
      expect_debug_file_to_include(`🌈 ALK000s SUCCESS`);
    });
  })

  describe(`with an empty log.info`, function () {
    it(`returns the right values`, async function() {
      let returned = log.info();
      expect( returned ).to.include(`💡 ALK000i INFO`);
    });
    it(`stores the right values in the debug file`, async function() {
      expect_debug_file_to_include(`💡 ALK000i INFO`);
    });
  })

  describe(`with an empty log.warn`, function () {
    it(`returns the right values`, async function() {
      let returned = log.warn();
      expect( returned ).to.include(`🔎 ALK000w WARNING`);
    });
    it(`stores the right values in the debug file`, async function() {
      expect_debug_file_to_include(`🔎 ALK000w WARNING`);
    });
    it(`stores the right values in the unexpected output file`, async function() {
      expect_unexpected_output_file_to_include(`🔎 ALK000w WARNING`);
    });
  })

  describe(`with an empty log.throw`, function () {
    it(`throws null`, async function() {
      let error_to_test = null;
      try {
        log.throw();
      } catch ( error ) {
        error_to_test = error;
      }
      expect( error_to_test.message ).to.include(`null`);
      expect( error_to_test.stack ).to.include(`at Log.throw`);
    });
    it(`stores an error message in the debug file`, async function() {
      expect_debug_file_to_include(`🤕 ALK000t ERROR`);
      expect_debug_file_to_include(`null`);
      expect_debug_file_to_include(`at Log.throw`);
    });
    it(`stores an error message in the unexpected output file`, async function() {
      expect_unexpected_output_file_to_include(`🤕 ALK000t ERROR`);
      expect_unexpected_output_file_to_include(`null`);
      expect_unexpected_output_file_to_include(`at Log.throw`);
    });
  })

  describe(`when given 1 option and no logs`, function () {
    it(`.console returns the right text`, async function() {
      let returned = log.console({ icon: `test_icon` });
      expect( returned ).to.include(`test_icon ALK000c LOG`);
    });
    it(`.console stores the right text in the debug log file`, async function() {
      expect_debug_file_to_include(`test_icon ALK000c LOG`);
    });
  })

  describe(`when given multiple logs of multiple types`, function () {
    it(`console returns the right text`, async function() {
      let returned = log.console({}, `log 1`, { log_2: `log_2` });
      expect( returned ).to.include(`log 1\n{ log_2: 'log_2' }`);
    });
    it(`.console stores the right text in the debug log`, async function() {
      expect_debug_file_to_include(`log 1\n{ log_2: 'log_2' }`);
    });
  })

  describe(`given totally custom metadata`, function () {
    // TODO: ("uses `console.info` with a non-standard level". Needs a spy?)
    // TODO: Should we test each individual option by itself?
    it(`.console returns the right values`, async function() {
      let options = {
        before: `custom_before~`,
        level: `custom_level`,
        icon: `custom_icon`,
        code: `custom_code`,
        context: `custom_context`,
        // do_throw: true,  // This prevents returning a value
      };
      let returned = log.console( options );
      // Note the intentional lack of space with `before`
      expect( returned ).to.include(`custom_before~custom_icon custom_code custom_context CUSTOM_LEVEL`);
    });
    it(`.console stores the right text in the debug file`, async function() {
      expect_debug_file_to_include(`custom_before~custom_icon custom_code custom_context CUSTOM_LEVEL`);
    });
  })

  describe(`with an error and no throwing`, function () {

    it(`.console can return the right value`, async function() {
      let options = { error: `custom_error`, };
      let returned = log.console( options );
      expect( returned ).to.include(`custom_error`);
      expect( returned ).to.include(`at Log.console`);
    });
    it(`.console can store the right value in the debug file`, async function() {
      expect_debug_file_to_include(`custom_error`);
      expect_debug_file_to_include(`at Log.console`);
    });
    it(`.console can store the right value in the unexpected output file`, async function() {
      expect_unexpected_output_file_to_include(`custom_error`);
      expect_unexpected_output_file_to_include(`at Log.console`);
    });
  })

  describe(`with circular reference to .console`, function () {
    it(`has no error`, function () {
      let obj = { foo: [], test: `circular reference` };
      obj.foo.push(obj);
      let returned = log.console({}, obj);
      expect(returned).to.include(`<ref`);
      expect(returned).to.include(`Circular`);
    })
    it(`stores the right value in the debug file`, async function() {
      expect_debug_file_to_include(`<ref`);
      expect_debug_file_to_include(`Circular`);
    });
  })

  describe(`while throwing a circular reference with .throw`, function () {
    it(`has no other error`, function () {
      let obj = { foo: [], test: `circular reference` };
      obj.foo.push(obj);
      let returned = log.throw({error: `circular error`}, obj);
      expect(returned).to.include(`<ref`);
      expect(returned).to.include(`Circular`);
    })
    it(`stores the right value in the debug file`, async function() {
      expect_debug_file_to_include(`circular error`);
    });
    it(`stores the right value in the unexpected file`, async function() {
      expect_unexpected_file_to_include(`circular error`);
    });
  })

  describe(`.stdout`, function () {
    it(`stores in debug log`, async function() {
      log.stdout({}, `test 1 stdout log~`);
      log.stdout({}, `test 2 stdout log\n`);
      // console print: `test 1 stdout log~test 2 stdout log`. Spy? See notes below.
      expect_debug_file_to_include(`test 1 stdout log~`);
      expect_debug_file_to_include(`test 2 stdout log`);
    });
  })

  /** Internal errors */

  describe(`fails with a log instead of throwing an error with internal tests`, function () {
    it(`when a log file doesn't exist`, async function() {
      // // Spy on console.warn to make sure it gets called with the right value
      // let warning = ``;
      // let done_warning = false;
      // let original_warn = console.warn;
      // // can we return a promise? Probably. Does that help? We won't be calling the promise.
      // console.warn = function () {
      //   done_warning = false
      //   warning = arguments[0];
      //   done_warning = true;
      // }

      const temp_log4 = new Log({ path: temp_log_path });
      // Trigger an error that should be silent
      temp_log4.path = `non-existent`;
      // Doesn't throw
      let returned = temp_log4.console({}, `No file, no save, no error` );
      expect( returned ).to.include( `No file, no save, no error` );

      // // Wait for the async console.warn to finish, then test its value
      // while ( !done_warning ) {
      //   await new Promise((resolve) => { setTimeout(resolve, 500) });
      // }
      // expect( warning ).to.include(`no such file or directory, open '${ temp_log4.path }/debug_log.txt'`);
      // // Clean up
      // console.warn = original_warn;

      // Clean up
      fs.rmSync(temp_log_path, { recursive: true, force: true });
    })
    // No contents for log files since they don't exist.
  })

  /**
   * TODO: Spy on console, if possible.
   * Note: I'm not sure this is safe. E.g. if run in parallel
   *   with other such tests. Consider giving `console` "alkiln"
   *   properties as flags. Maybe `alkiln_original` and
   *   `alkiln_warn_list`? Perhaps too dangerous.
   *
   * To test with spies
   * - Debug doesn't log to the console if nothing went wrong
   *   (spy on all node console methods?)
   * - An internal error fails with a log instead of actually
   *   throwing (see comments in "nonexistent file" test)
   *
   * */

});


function expect_debug_file_to_include( text ) {
  let from_file = fs.readFileSync(`${path}/${log.debug_log_filename}`, 'utf8');
  expect( from_file ).to.include( text );
};

function expect_unexpected_output_file_to_include( text ) {
  let from_file = fs.readFileSync(`${path}/${log.unexpected_filename}`, 'utf8');
  expect( from_file ).to.include( text );
};
