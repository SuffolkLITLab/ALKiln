const chai = require('chai');
const expect = chai.expect;

const Log = require('../../lib/utils/log.js');

const path = `_alkiln-misc_artifacts`;
const log = new Log({ path, context: `unit_tests log_tests` });

describe(`log`, async function () {

  // Test it creates a new folder?
  // Test the contents that it saves to various files?

  it(`returns a debug message from an empty log.debug`, async function() {
    let result = log.debug();
    expect( result ).to.include( `🐛 ALK000v DEBUG` );
  });

});

