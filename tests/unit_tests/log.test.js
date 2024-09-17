const chai = require('chai');
const expect = chai.expect;
const fs = require(`fs`);

const Log = require('../../lib/utils/log.js');

const path = `_alkiln-misc_artifacts/logs_${ Date.now() }`;
const log = new Log({ path, context: `unit_tests log_tests` });
const temp_log_path = `_alkiln-log_test_path`;

describe(`log`, async function () {

  // Creates the right files and folders
  it(`creates a folder at the given path`, function() {
    const temp_log = new Log({ path: temp_log_path });
    const exists = fs.existsSync( temp_log_path );
    expect( exists ).to.be.true;
    // Clean up by deleting the folder
    fs.rmSync(temp_log_path, { recursive: true, force: true });
  });

  it(`creates a debug file at the given path`, function() {
    const temp_log = new Log({ path: temp_log_path });
    const exists = fs.existsSync(`${temp_log_path}/${temp_log.debug_log_filename}`);
    expect( exists ).to.be.true;
    // Clean up by deleting the folder
    fs.rmSync(temp_log_path, { recursive: true, force: true });
  });

  it(`creates an unexpected results file on error at the given path`, function() {
    const temp_log = new Log({ path: temp_log_path });

    try {
      temp_log.throw({ error: new Error(`Unexpected results test error`) });
    } catch ( error ) {
      // Maybe this belongs in a different test
      console.log(`\n~~~~~\n${JSON.stringify(error.message)}`);
      expect( error.message ).to.equal(`Unexpected results test error`);
    }

    const exists = fs.existsSync(`${temp_log_path}/${temp_log.unexpected_filename}`);
    expect( exists ).to.be.true;
    // Clean up by deleting the folder
    fs.rmSync(temp_log_path, { recursive: true, force: true });
  });

  // Returns the right values with the given arguments
  // Stores the right values (in debug log and unexpected log)
  it(`returns a debug message from an empty log.debug`, async function() {
    let returned = log.debug();
    expect_debug_file_to_include(`🐛 ALK000d DEBUG`);
  });
  it(`stores a debug message in the debug file from an empty log.debug`, async function() {
    expect_debug_file_to_include(`🐛 ALK000d DEBUG`);
  });

  it(`returns a console message from an empty log.console`, async function() {
    let returned = log.console();
    expect( returned ).to.include(`* ALK000c LOG`);
  });
  it(`stores a console message in the debug file from an empty log.console`, async function() {
    expect_debug_file_to_include(`* ALK000c LOG`);
  });

  it(`returns a success message from an empty log.success`, async function() {
    let returned = log.success();
    expect( returned ).to.include(`🌈 ALK000s SUCCESS`);
  });
  it(`stores a success message in the debug file from an empty log.success`, async function() {
    expect_debug_file_to_include(`🌈 ALK000s SUCCESS`);
  });

  it(`returns an info message from an empty log.info`, async function() {
    let returned = log.info();
    expect( returned ).to.include(`💡 ALK000i INFO`);
  });
  it(`stores an info message in the debug file from an empty log.info`, async function() {
    expect_debug_file_to_include(`💡 ALK000i INFO`);
  });

  it(`returns a warning message from an empty log.warn`, async function() {
    let returned = log.warn();
    expect( returned ).to.include(`🔎 ALK000w WARNING`);
  });
  it(`stores a warning message in the debug file from an empty log.warn`, async function() {
    expect_debug_file_to_include(`🔎 ALK000w WARNING`);
  });
  it(`stores a warning message in the unexpected output file from an empty log.warn`, async function() {
    expect_unexpected_output_file_to_include(`🔎 ALK000w WARNING`);
  });

  // Test no `null` on an empty throw
  it(`throws null on an empty log.throw`, async function() {
    try {
      log.throw();
    } catch ( error ) {
      // expect( error ).to.include(`🤕 ALK000t ERROR`);
      expect( error ).to.not.include(`null`);
    }
  });
  // it(`stores an error message in the debug file from an empty log.error`, async function() {
  //   expect_debug_file_to_include(`🤕 ALK000t ERROR`);
  //   expect_debug_file_to_include(`null`);
  // });
  // it(`stores an error message in the unexpected output file from an empty log.error`, async function() {
  //   expect_unexpected_output_file_to_include(`🤕 ALK000t ERROR`);
  //   expect_unexpected_output_file_to_include(`null`);
  // });

  it(`debug returns a message when given 1 option and no logs`, async function() {
    let returned = log.debug({ icon: `test_icon` });
    // TODO: Test other returned values
    expect( returned.everything_formatted ).to.include(`test_icon ALK000d DEBUG`);
    let from_file = fs.readFileSync(`${path}/${log.debug_log_filename}`, 'utf8');
    expect( from_file ).to.include(`test_icon ALK000d DEBUG`);
  });

  it(`debug returns a message when given multiple logs of multiple types`, async function() {
    let returned = log.debug({}, `log 1`, { log_2: `log_2` });
    // TODO: Test other returned values
    expect( returned.everything_formatted ).to.include(`log 1\n{ log_2: 'log_2' }`);
  });

  /*
      let options = {
      level: `custom_level`,
      before:  ``,  // different name? above? start_decorator?
      icon: `custom_icon`,
      code: `custom_code`,
      context: `custom_context`,
      error: null,
      do_throw: false,
    };
  */

  // (uses `console.info` with a non-standard level, but not sure how to test that)
  it(`console and debug metadata is completely customizable`, async function() {
    let options = {
      level: `custom_level`,
      icon: `custom_icon`,
      code: `custom_code`,
      context: `custom_context`,
    };
    let returned = log.console(options);
    expect( returned ).to.include(`custom_icon custom_code custom_context CUSTOM_LEVEL`);
  });


  // Does not exit process on error with non-existent file


});


function expect_debug_file_to_include( text ) {
  let from_file = fs.readFileSync(`${path}/${log.debug_log_filename}`, 'utf8');
  expect( from_file ).to.include( text );
};

function expect_unexpected_output_file_to_include( text ) {
  let from_file = fs.readFileSync(`${path}/${log.unexpected_filename}`, 'utf8');
  expect( from_file ).to.include( text );
};
