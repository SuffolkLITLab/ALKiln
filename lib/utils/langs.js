#!/usr/bin/env node

let _path = require('path');
let fs = require('fs');
let glob = require('glob');

let env_vars = require('./env_vars');

// Get the glob filepaths to find all the test files
let dir_root = process.env.INIT_CWD;  // Path to root of project
let test_glob = process.argv[2];  // String of glob (regex for filepaths)
let filepaths = glob.sync( _path.resolve( dir_root, test_glob ) );
let flag = '_lang_';

let langs = env_vars.EXTRA_LANGUAGES;

// Generate new language files
for ( let full_path of filepaths ) {  // Handle old language files before creating new ones.
  
  // Don't apply this to the example test that this package always provides
  if ( full_path.includes( 'example_test.feature' )) { continue; }

  // Delete alredy existing non-default language files and skip the rest of this. For example,
  // if 3 languages were tested previously and now only two are being tested.
  if ( full_path.includes( '_lang_' )) {
      fs.unlinkSync( full_path );
      continue;
  }

  for ( let lang of langs ) {  // Create new language files
    // Get and change the text from the file to add the language to it
    let data = fs.readFileSync( full_path, 'utf8' );
    let result = data.replace(/(Given I start the interview.*$)/gm, `$1 in lang "${ lang }"`);

    // Save the file to the same folder with a new name indicating the language
    let test_dir = _path.dirname( full_path );
    // Put it alphabetically next to its matching tests by starting with the same name (discuss)
    let orig_filename = _path.basename( full_path ).replace('.feature', '');
    // Unicode category for NOT language characters \P{L}
    let filename = `${ orig_filename }_lang_${ lang.replace(/(\P{L})+/gu, '_') }.feature`;
    let fullPath = _path.resolve( test_dir, filename );
    // Always overwrite previous versions of the file if they exist
    fs.writeFileSync(fullPath, result, { encoding:'utf8', flag:'w' });
  }
}
