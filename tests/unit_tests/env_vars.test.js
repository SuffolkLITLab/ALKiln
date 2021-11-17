const chai = require('chai');
const expect = chai.expect;

const env_vars = require("../../lib/utils/env_vars.js");
const validateEnvironment = env_vars.validateEnvironment;

describe('env_vars', function () {
    describe('validateEnvironment', function() {

        /**
         * All required variables should be defined in .env. For reference, those variables are the following:
         * 
         * PLAYGROUND_ID
         * PLAYGROUND_EMAIL
         * PLAYGROUND_PASSWORD
         * BASE_URL
         * REPO_URL
         */ 
        it("All variables set", function() {
            env_vars.validateEnvironment();
        });

        /**
         * This test has an ordering dependency with the test below.  I'm not certain if I am getting lucky or if I need to explicitly declare the order.
         */
        it("One variable missing", function() {
            delete process.env.PLAYGROUND_PASSWORD;

            expect(env_vars.validateEnvironment).to.throw(ReferenceError, /PLAYGROUND_PASSWORD/);            
        });

        /**
         * Delete all environment variables before validating the variables.
         */
        it("No variables set", function() {
            delete process.env.PLAYGROUND_ID;
            delete process.env.PLAYGROUND_EMAIL;
            delete process.env.PLAYGROUND_PASSWORD;
            delete process.env.BASE_URL;
            delete process.env.REPO_URL;

            // This test just tests that the variable names show up in a fixed order.
            //
            // For whatever reason, /PLAYGROUND_ID.*PLAYGROUND_EMAIL.*PLAYGROUND_PASSWORD.*SERVER_URL.*REPO_URL/ simply wouldn't work once I got to the first letter
            // after the second underscore so I have used separate matchers.
            expect(env_vars.validateEnvironment).to.throw(ReferenceError, /PLAYGROUND_ID/);
            expect(env_vars.validateEnvironment).to.throw(ReferenceError, /PLAYGROUND_EMAIL/);
            expect(env_vars.validateEnvironment).to.throw(ReferenceError, /PLAYGROUND_PASSWORD/);
            expect(env_vars.validateEnvironment).to.throw(/SERVER_URL/);
            expect(env_vars.validateEnvironment).to.throw(/REPO_URL/);
        });
    });
});