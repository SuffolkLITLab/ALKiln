const chai = require('chai');
const expect = chai.expect;

const reports = require('./reports.fixtures.js');

let test = {};

test.reports = function( stored_report_key, should_error, actual_report ) {
  expect( actual_report ).to.deep.equal( reports[ stored_report_key ] );
};


module.exports = test;
