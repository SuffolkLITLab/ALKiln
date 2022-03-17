const chai = require('chai');
const expect = chai.expect;

const session_vars = require("../../lib/utils/session_vars.js");
const validateEnvironment = session_vars.validateEnvironment;

describe('When the `session_vars` object uses', function () {
    describe('validateEnvironment, it', function() {

        /**
         * All required variables should be defined in .env. For reference, those variables are the following:
         * 
         * DOCASSEMBLE_DEVELOPER_API_KEY
         * BASE_URL
         * REPO_URL
         */ 
        it("successfully completes when all required env vars exist", function() {
            session_vars.validateEnvironment();
        });

        /**
         * This test has an ordering dependency with the test below.  I'm not certain if I am getting lucky or if I need to explicitly declare the order.
         */
        it("throws a reference error when any var is missing", function() {
            delete process.env.DOCASSEMBLE_DEVELOPER_API_KEY;

            expect(session_vars.validateEnvironment).to.throw(ReferenceError, /DOCASSEMBLE_DEVELOPER_API_KEY/);            
        });

        /**
         * Delete all environment variables before validating the variables.
         */
        it("names all missing variables in the error, not just one", function() {
            delete process.env.DOCASSEMBLE_DEVELOPER_API_KEY;
            delete process.env.BASE_URL;
            delete process.env.SERVER_URL;
            delete process.env.REPO_URL;

            // This test just tests that the variable names show up in a fixed order.
            expect(session_vars.validateEnvironment).to.throw(
                ReferenceError,
                /DOCASSEMBLE_DEVELOPER_API_KEY.*\n.*SERVER_URL.*\n.*REPO_URL/
            );
        });
    });
});