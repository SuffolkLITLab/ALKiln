const chai = require('chai');
const expect = chai.expect;
const fs = require(`fs`);

const scope = require(`../../lib/scope.js`);

scope.log_and_update_if_new_page_id = async function() {
  /** Mock this `scope` function to avoid extraneous errors. */
  return `mock-page-id`;
};

describe(`The deepest navigation logic`, function () {

  it(`will handle a missing required system error handler by throwing ALK0295`, async function() {
    let error = null
    try {
      await scope.wait_until_continued( scope, { post_nav_handlers: [
        scope.throw_on_invalid_answers,
        scope.throw_on_non_navigation_timeout,
      ] });
    } catch (err) {
      error = err;
    }
    expect( error instanceof ReferenceError, `Not a ReferenceError` ).to.be.true;
    expect( error.message.includes(`ALK0295`), `Missing log code ALK0295` ).to.be.true;
    expect( error.message.includes(`ALK0296`), `Unwanted log code ALK0296 is present`).to.be.false;
  });

  it(`will handle a missing required navigation timeout handler by throwing ALK0296`, async function() {
    let error = null
    try {
      await scope.wait_until_continued( scope, { post_nav_handlers: [
        scope.throw_on_system_error,
        scope.throw_on_invalid_answers,
      ] });
    } catch (err) {
      error = err;
    }
    expect( error instanceof ReferenceError, `Not a ReferenceError` ).to.be.true;
    expect( error.message.includes(`ALK0295`), `Unwanted log code ALK0295 is present`).to.be.false;
    expect( error.message.includes(`ALK0296`), `Missing log code ALK0296` ).to.be.true;
  });

  it(`will handle the absence of both critical error throwers by throwing ALK0295 and ALK0296`, async function() {
    let error = null
    try {
      await scope.wait_until_continued( scope, { post_nav_handlers: [
        scope.throw_on_invalid_answers,
      ] });
    } catch (err) {
      error = err;
    }
    expect( error instanceof ReferenceError, `Not a ReferenceError` ).to.be.true;
    expect( error.message.includes(`ALK0295`), `Missing log code ALK0295` ).to.be.true;
    expect( error.message.includes(`ALK0296`), `Missing log code ALK0296` ).to.be.true;
  });

  it(`will not throw ALK0295 or ALK0296 if all required handlers are present`, async function() {
    let error = null
    try {
      await scope.wait_until_continued( scope, { post_nav_handlers: [
        scope.throw_on_system_error,
        scope.throw_on_non_navigation_timeout,
      ] });
    } catch (err) {
      error = err;
    }
    expect( error.message.includes(`ALK0295`), `Unwanted log code ALK0295 is present` ).to.be.false;
    expect( error.message.includes(`ALK0296`), `Unwanted log code ALK0296 is present` ).to.be.false;
  });

});
