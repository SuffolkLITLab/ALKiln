const chai = require('chai');
const expect = chai.expect;

const session_vars = require("../../lib/utils/session_vars.js");
const validateEnvironment = session_vars.validateEnvironment;

// Not going to totally support these any more.
delete process.env.BRANCH_PATH;
delete process.env.BASE_URL;

describe('When the `session_vars` object uses', function () {
    describe('validateEnvironment, it', function() {

        /**
         * All required variables should be defined in .env. Different
         * env vars for different test runner locations/origins.
         */
        it("successfully completes when all required local env vars exist", function() {
            process.env._ORIGIN = `local`;
            process.env.SERVER_URL = `https://example.com`;
            process.env.DOCASSEMBLE_DEVELOPER_API_KEY = `1`;
            process.env.REPO_URL = `https://github.com/org/docassemble-repo`;
            process.env.BRANCH_NAME = `a_branch`;

            delete process.env._PROJECT_NAME;
            delete process.env._USER_ID;

            session_vars.validateEnvironment();
        });
        it("successfully completes when all required GitHub env vars exist", function() {
            process.env._ORIGIN = `github`;
            process.env.SERVER_URL = `https://example.com`;
            process.env.DOCASSEMBLE_DEVELOPER_API_KEY = `1`;
            process.env.REPO_URL = `https://github.com/org/docassemble-repo`;
            process.env.BRANCH_NAME = `a_branch`;

            delete process.env._PROJECT_NAME;
            delete process.env._USER_ID;

            session_vars.validateEnvironment();
        });
        it("successfully completes when all required Playground env vars exist", function() {
            process.env._ORIGIN = `playground`;
            process.env.SERVER_URL = `https://example.com`;
            process.env._PROJECT_NAME = `TheProject`;
            process.env._USER_ID = `1`;

            delete process.env.DOCASSEMBLE_DEVELOPER_API_KEY;
            delete process.env.REPO_URL;
            delete process.env.BRANCH_NAME;

            session_vars.validateEnvironment();
        });

        /**
         * Throwing errors
         */
        it("names all missing always-required variables in the error", function() {
            process.env._ORIGIN = 'playground';
            // Ensure it doesn't fail because of Playground required vars
            process.env._PROJECT_NAME = `TheProject`;
            process.env._USER_ID = `1`;

            delete process.env.SERVER_URL;

            // This test just tests that the variable names show up in a fixed order.
            expect(session_vars.validateEnvironment).to.throw(
                ReferenceError,
                /SERVER_URL/
            );
        });

        it("identifies when _ORIGIN has an invalid value", function() {
            process.env._ORIGIN = 'invalid';
            delete process.env.SERVER_URL;

            // This test just tests that the variable names show up in a fixed order.
            expect(session_vars.validateEnvironment).to.throw(
                ReferenceError,
                /_ORIGIN/
            );
        });

        it("names all missing local variables in the error, not just one", function() {
            // Ensure it doesn't fail because of always-required vars
            process.env.SERVER_URL = `https://example.com`;
            // Ensure it doesn't fail because of Playground required vars
            process.env._PROJECT_NAME = `TheProject`;
            process.env._USER_ID = `1`;

            process.env._ORIGIN = `local`;
            delete process.env.DOCASSEMBLE_DEVELOPER_API_KEY;
            delete process.env.REPO_URL;
            delete process.env.BRANCH_NAME;

            // Matches message contents in any order
            expect(session_vars.validateEnvironment).to.throw(
                ReferenceError,
                /(?=[\S\s]*REPO_URL)(?=[\S\s]*BRANCH_NAME)(?=[\S\s]*DOCASSEMBLE_DEVELOPER_API_KEY)/
            );
        });

        it("names all missing GitHub variables in the error, not just one", function() {
            // Ensure it doesn't fail because of always-required vars
            process.env.SERVER_URL = `https://example.com`;
            // Ensure it doesn't fail because of Playground required vars
            process.env._PROJECT_NAME = `TheProject`;
            process.env._USER_ID = `1`;

            process.env._ORIGIN = `github`;
            delete process.env.DOCASSEMBLE_DEVELOPER_API_KEY;
            delete process.env.REPO_URL;
            delete process.env.BRANCH_NAME;

            expect(session_vars.validateEnvironment).to.throw(
                ReferenceError,
                /(?=[\S\s]*REPO_URL)(?=[\S\s]*BRANCH_NAME)(?=[\S\s]*DOCASSEMBLE_DEVELOPER_API_KEY)/
            );
        });

        it("names all missing Playground variables in the error, not just one", function() {
            // Ensure it doesn't fail because of always-required vars
            process.env.SERVER_URL = `https://example.com`;
            // Ensure it doesn't fail because of GitHub required vars
            process.env.DOCASSEMBLE_DEVELOPER_API_KEY = `1`;
            process.env.REPO_URL = `https://github.com/org/docassemble-repo`;
            process.env.BRANCH_NAME = `a_branch`;

            process.env._ORIGIN = `playground`;
            delete process.env._PROJECT_NAME;
            delete process.env._USER_ID;

            expect(session_vars.validateEnvironment).to.throw(
                ReferenceError,
                /(?=[\S\s]*_PROJECT_NAME)(?=[\S\s]*_USER_ID)/
            );
        });
    });
});