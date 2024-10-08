const chai = require('chai');
const expect = chai.expect;
const fs = require(`fs`);

const Log = require('../../lib/utils/log.js');

const path = `_alkiln-misc_artifacts/logs_${ Date.now() }`;
const log = new Log({ path, context: `unit_tests log_tests` });
const temp_log_path = `_alkiln-log_test_path`;

// TODO: Stop our logs from showing up in the console
// Note: neutralize_console/restore_console in before/after/each
// hides chai's logs. Using neutralize_console/restore_console
// in each `it` causes errors to stop chai execution.
// let old_log;
// let old_info;
// let old_warn;
// let old_error;
// let old_stdout;
// let old_stderr;

describe(`An instance of log`, function () {

  /** Creates the right files and folders */

  it(`creates a folder at the given path`, async function() {
    // neutralize_console();
    // throw 'foo';  // with `neutralize_console`, stops chai execution
    const temp_log1 = new Log({ path: temp_log_path });
    const exists = fs.existsSync( temp_log_path );
    expect( exists ).to.be.true;
    // Clean up by deleting the folder
    fs.rmSync(temp_log_path, { recursive: true, force: true });
    // restore_console();
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

  /** Returns and/or throws and/or stores the right values with the given arguments */

  describe(`with an empty .debug`, function () {
    it(`returns the right values`, async function() {
      let returned = log.debug();
      expect_debug_file_to_include(`🐛 ALK000d DEBUG`);
    });
    it(`stores the right values in the debug file`, async function() {
      expect_debug_file_to_include(`🐛 ALK000d DEBUG`);
    });
  })

  describe(`given totally custom metadata`, function () {
    // TODO: ("uses `console.info` with a non-standard level". Needs a spy?)
    it(`.debug returns the right values`, async function() {
      let options = {
        before: `custom_DEBUG_before~`,
        level: `custom_DEBUG_level`,
        icon: `custom_DEBUG_icon`,
        code: `custom_DEBUG_code`,
        context: `custom_DEBUG_context`,
        // do_throw: true,  // This prevents returning a value
      };
      let returned = log.debug( options, `custom_DEBUG_log` );
      // Note the intentional lack of space with `before`
      expect( returned ).to.include(`custom_DEBUG_before~custom_DEBUG_icon custom_DEBUG_code custom_DEBUG_context CUSTOM_DEBUG_LEVEL`);
      expect( returned ).to.include(`custom_DEBUG_log`);
    });
    it(`.debug stores the right text in the debug file`, async function() {
      expect_debug_file_to_include(`custom_DEBUG_before~custom_DEBUG_icon custom_DEBUG_code custom_DEBUG_context CUSTOM_DEBUG_LEVEL`);
      expect_debug_file_to_include(`custom_DEBUG_log`);
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

  describe(`given totally custom metadata`, function () {
    it(`.console returns the right values`, async function() {
      let options = {
        before: `custom_CONSOLE_before~`,
        level: `custom_CONSOLE_level`,
        icon: `custom_CONSOLE_icon`,
        code: `custom_CONSOLE_code`,
        context: `custom_CONSOLE_context`,
        // do_throw: true,  // This prevents returning a value
      };
      let returned = log.console( options, `custom_CONSOLE_log` );
      // Note the intentional lack of space with `before`
      expect( returned ).to.include(`custom_CONSOLE_before~custom_CONSOLE_icon custom_CONSOLE_code custom_CONSOLE_context CUSTOM_CONSOLE_LEVEL`);
      expect( returned ).to.include(`custom_CONSOLE_log`);
    });
    it(`.console stores the right text in the debug file`, async function() {
      expect_debug_file_to_include(`custom_CONSOLE_before~custom_CONSOLE_icon custom_CONSOLE_code custom_CONSOLE_context CUSTOM_CONSOLE_LEVEL`);
      expect_debug_file_to_include(`custom_CONSOLE_log`);
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

  describe(`given totally custom metadata`, function () {
    it(`.success only overwrites some values`, async function() {
      let options = {
        before: `custom_SUCCESS_before~`,
        level: `custom_SUCCESS_level`,
        icon: `custom_SUCCESS_icon`,
        code: `custom_SUCCESS_code`,
        context: `custom_SUCCESS_context`,
        // do_throw: true,  // This prevents returning a value
      };
      let returned = log.success( options, `custom_SUCCESS_log` );
      // Note the intentional lack of space with `before`
      expect( returned ).to.include(`custom_SUCCESS_before~🌈 custom_SUCCESS_code custom_SUCCESS_context SUCCESS`);
      expect( returned ).to.include(`custom_SUCCESS_log`);
    });
    it(`.success stores the right text in the debug file`, async function() {
      expect_debug_file_to_include(`custom_SUCCESS_before~🌈 custom_SUCCESS_code custom_SUCCESS_context SUCCESS`);
      expect_debug_file_to_include(`custom_SUCCESS_log`);
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

  describe(`given totally custom metadata`, function () {
    it(`.info only overwrites some values`, async function() {
      let options = {
        before: `custom_INFO_before~`,
        level: `custom_INFO_level`,
        icon: `custom_INFO_icon`,
        code: `custom_INFO_code`,
        context: `custom_INFO_context`,
        // do_throw: true,  // This prevents returning a value
      };
      let returned = log.info( options, `custom_INFO_log` );
      // Note the intentional lack of space with `before`
      expect( returned ).to.include(`custom_INFO_before~💡 custom_INFO_code custom_INFO_context INFO`);
      expect( returned ).to.include(`custom_INFO_log`);
    });
    it(`.info stores the right text in the debug file`, async function() {
      expect_debug_file_to_include(`custom_INFO_before~💡 custom_INFO_code custom_INFO_context INFO`);
      expect_debug_file_to_include(`custom_INFO_log`);

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

  describe(`given totally custom metadata`, function () {
    it(`.warn only overwrites some values`, async function() {
      let options = {
        before: `custom_WARN_before~`,
        level: `custom_WARN_level`,
        icon: `custom_WARN_icon`,
        code: `custom_WARN_code`,
        context: `custom_WARN_context`,
        // do_throw: true,  // This prevents returning a value
      };
      let returned = log.warn( options, `custom_WARN_log` );
      // Note the intentional lack of space with `before`
      expect( returned ).to.include(`custom_WARN_before~🔎 custom_WARN_code custom_WARN_context WARNING`);
      expect( returned ).to.include(`custom_WARN_log`);
    });
    it(`.warn stores the right text in the debug file`, async function() {
      expect_debug_file_to_include(`custom_WARN_before~🔎 custom_WARN_code custom_WARN_context WARNING`);
      expect_debug_file_to_include(`custom_WARN_log`);
    });
  })

  describe(`with an empty log.throw`, function () {
    it(`throws default error message`, async function() {
      let error_to_test;
      try {
        log.throw();
      } catch ( error ) {
        error_to_test = error;
      }
      expect( error_to_test.message ).to.equal(`ALKiln default error`);
      expect( error_to_test.stack ).to.include(`at Log.throw`);
    });
    it(`stores an error message in the debug file`, async function() {
      expect_debug_file_to_include(`🤕 ALK000t ERROR`);
      expect_debug_file_to_include(`ALKiln default error`);
      expect_debug_file_to_include(`at Log.throw`);
    });
    it(`stores an error message in the unexpected output file`, async function() {
      expect_unexpected_output_file_to_include(`🤕 ALK000t ERROR`);
      expect_unexpected_output_file_to_include(`ALKiln default error`);
      expect_unexpected_output_file_to_include(`at Log.throw`);
    });
  })

  describe(`with totally custom data and string as error for .throw()`, function () {
    it(`overrides some data and keeps other data`, async function() {
      let error_to_test;
      try {
        let options = {
          before: `custom_THROW_before~`,
          level: `custom_THROW_level`,
          icon: `custom_THROW_icon`,
          code: `custom_THROW_code`,
          context: `custom_THROW_context`,
          error: `CUSTOM_THROW_ERROR_STRING`,
          do_throw: false,  // Make sure it's overwritten
        };
        log.throw( options, `custom_THROW_log` );
      } catch ( error ) {
        error_to_test = error;
      }
      // Note: No metadata is included in the error so that we don't have
      // to re-throw every error that comes in and they can keep their nice
      // stack traces.
      // Note: Also excludes logs from error message
      expect( error_to_test.message ).to.include(`CUSTOM_THROW_ERROR_STRING`);
      expect( error_to_test.stack ).to.include(`at Log.throw`);
    });
    it(`stores an error message in the debug file`, async function() {
      expect_debug_file_to_include(`custom_THROW_before~🤕 custom_THROW_code custom_THROW_context ERROR`);
      expect_debug_file_to_include(`custom_THROW_log`);
      expect_debug_file_to_include(`CUSTOM_THROW_ERROR_STRING`);
      expect_debug_file_to_include(`at Log.throw`);  // a bit useless because it's a repeat
    });
    it(`stores an error message in the unexpected output file`, async function() {
      expect_unexpected_output_file_to_include(`custom_THROW_before~🤕 custom_THROW_code custom_THROW_context ERROR`);
      expect_unexpected_output_file_to_include(`custom_THROW_log`);
      expect_unexpected_output_file_to_include(`CUSTOM_THROW_ERROR_STRING`);
      expect_unexpected_output_file_to_include(`at Log.throw`);  // a bit useless because it's a repeat
    });
  })

  describe(`.throw() with an actual error`, function () {
    it(`doesn't include .Log in its stack`, async function() {
      let error_to_test;
      try {
        let options = {
          error: new Error(`No .Log should be in this stack`),
          do_throw: true,  // Not really needed
        };
        log.throw( options, `custom_THROW_log` );
      } catch ( error ) {
        error_to_test = error;
      }
      expect( error_to_test.stack ).to.not.include(`at Log.throw`);
    });
  })

  describe(`when given 1 option and no logs, .console()`, function () {
    it(`returns the right text`, async function() {
      let returned = log.console({ icon: `test_icon` });
      expect( returned ).to.include(`test_icon ALK000c LOG`);
    });
    it(`stores the right text in the debug log file`, async function() {
      expect_debug_file_to_include(`test_icon ALK000c LOG`);
    });
  })

  describe(`when given multiple logs of multiple types, .console()`, function () {
    it(`returns the right text`, async function() {
      let returned = log.console({}, `log 1`, { log_2: `log_2` });
      expect( returned ).to.include(`log 1\n{ log_2: 'log_2' }`);
    });
    it(`stores the right text in the debug log`, async function() {
      expect_debug_file_to_include(`log 1\n{ log_2: 'log_2' }`);
    });
  })

  describe(`with a value for \`error\` and no throw with .console()`, function () {
    it(`returns the right value`, async function() {
      let options = { error: `custom_CONSOLE_non_thrown_error`, };
      let returned = log.console( options );
      expect( returned ).to.not.include(`custom_CONSOLE_non_thrown_error`);
      expect( returned ).to.not.include(`at Log.throw`);
    });
    it(`stores the warning in the debug file`, async function() {
      expect_debug_file_to_not_include(`custom_CONSOLE_non_thrown_error`);
      expect_debug_file_to_include(`ALK0223`);
    });
    it(`stores the warning in the unexpected output file`, async function() {
      expect_unexpected_output_file_to_not_include(`custom_CONSOLE_non_thrown_error`);
      expect_unexpected_output_file_to_include(`ALK0223`);
    });
  })

  /** Circular references */

  describe(`with circular reference to .console()`, function () {
    it(`fails silently`, function () {
      let obj = { foo: [], test: `.console circular reference log` };
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

  describe(`.throw()`, function () {
    it(`throws a circular error without tripping another error`, function () {
      let obj = { foo: [], test: `throw circular reference error` };
      obj.foo.push(obj);
      obj.foo.push(obj);
      try {
        log.throw({ error: obj }, `circular error`);
      } catch ( error ) {
        // Note: excludes metadata and logs from error
        expect( error.message ).to.include(`[Circular *1], [Circular *1]`);
      }
    })
    it(`stores the right value in the debug file`, async function() {
      expect_debug_file_to_include(`throw circular reference error`);
      expect_debug_file_to_include(`circular error`);
      expect_debug_file_to_include(`[Circular *1], [Circular *1]`);
    });
    it(`stores the right value in the unexpected file`, async function() {
      expect_unexpected_output_file_to_include(`throw circular reference error`);
      expect_unexpected_output_file_to_include(`circular error`);
      expect_unexpected_output_file_to_include(`[Circular *1], [Circular *1]`);
    });
  })

  describe(`.stdout`, function () {
    it(`stores in debug log`, async function() {
      log.stdout({}, `test 1 stdout log~`, `test 2 stdout log\n`);
      // Spy to see console contents (`test 1 stdout log~test 2 stdout log`? See notes below.
      expect_debug_file_to_include(`test 1 stdout log~test 2 stdout log\n`);  // Note no space.
    });
    // Note: There's no way to test that multiple stdout calls
    // would exclude a new line between them in the console. In
    // debug, each gets its own metadata with its own line.
  })

  /** Internal errors */

  describe(`fails with a log instead of throwing an error with internal tests`, function () {
    it(`when a log file doesn't exist`, async function() {
      // // Spy on console.warn to make sure it gets called with the right value
      // // This ruins console.warn for the rest of the test
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
      fs.rmSync( temp_log_path, { recursive: true, force: true });
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
function expect_debug_file_to_not_include( text ) {
  let from_file = fs.readFileSync(`${path}/${log.debug_log_filename}`, 'utf8');
  expect( from_file ).to.not.include( text );
};


function expect_unexpected_output_file_to_include( text ) {
  let from_file = fs.readFileSync(`${path}/${log.unexpected_filename}`, 'utf8');
  expect( from_file ).to.include( text );
};
function expect_unexpected_output_file_to_not_include( text ) {
  let from_file = fs.readFileSync(`${path}/${log.unexpected_filename}`, 'utf8');
  expect( from_file ).to.not.include( text );
};

function neutralize_console() {
  // old_log = console.log;
  // old_info = console.info;
  // old_warn = console.warn;
  // old_error = console.error;
  // console.log = function () { /* Do nothing */ };
  // console.info = function () { /* Do nothing */ };
  // console.warn = function () { /* Do nothing */ };
  // console.error = function () { /* Do nothing */ };

  // old_stdout = process.stdout.write;
  // old_stderr = process.stderr.write;
  // process.stdout.write = function() {};
  // process.stderr.write = function() {};
}

function restore_console() {
  // console.log = old_log;
  // console.info = old_info;
  // console.warn = old_warn;
  // console.error = old_error;

  // process.stdout.write = old_stdout;
  // process.stderr.write = old_stderr;
}