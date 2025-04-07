#!/usr/bin/env node

const Log = require(`../utils/Log`);
const set_sources_paths = require(`../utils/set_sources_paths`);
const TestGenerator = require(`../TestGenerator`);

// process.argv is a list of strings of commands and args.
// If using `npm run cucumber` (as opposed to the bin commands),
// use `--` before `--sources=./foo`
const argv = require(`minimist`)( process.argv.slice(2) );
const log = new Log({ path: argv.path, context: `generating files` });
// Run script
generate_constrained_random_test_files();


function generate_constrained_random_test_files() {
  /** Executable that generates constrained random answers tests and throws
   *    errors.
   * 
   * Takes no arguments - uses command line arguments instead.
   * */
  let all_errors = [];

  // Every file that's executed separately needs to figure out the location of
  //    the sources folders.
  let sources_paths = set_sources_paths({ log });
  let generator = new TestGenerator();
  for ( let sources_path of sources_paths ) {
    let { errors: generating_errors } = generator.create({
      sources_path,
      logger: log
    });
    all_errors.push( ...generating_errors );
  }

  if ( all_errors.length > 0 ) {
    log.throw({ code: `ALK0270`, context: `generating files`,
      error: new Error( `ALKiln got error(s) when it tried to generate constrained random answers tests. See warnings and errors above.` )
    });
  };

};
