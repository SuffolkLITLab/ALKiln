#!/usr/bin/env node

// Trying to let developers develop without having to write js files
const child_process = require("child_process");
const path = require("path");

const result = child_process.execSync(
    `./node_modules/.bin/cucumber-js ${ process.argv.slice(2).join("; ") }`
);
console.log("result", result.toString());
