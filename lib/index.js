#!/usr/bin/env node

// Trying to let developers develop without having to write js files
const child_process = require("child_process");
const path = require("path");
require("./lib/steps.js");

const result = child_process.execSync(
    path.resolve(process.cwd(), `./node_modules/.bin/cucumber-js`) + " " + process.argv.slice(2).join("; ")
);
console.log("result", result.toString());
