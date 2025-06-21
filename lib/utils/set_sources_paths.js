const fast_glob = require(`fast-glob`);
const path = require(`path`);

const session_vars = require(`./session_vars`);


module.exports = function set_sources_paths({ log }) {
  /** Set the globally accessible value of the paths to the sources folder,
   *    where authors store tests and other relevant test files. Can throw an
   *    error.
   * 
   * @param {object} obj - Named arguments
   * @param {Log} obj.log - Logs and saves useful info for later debugging.
   * 
   * @returns {[string]} - All paths found for package sources folders.
   * */
  session_vars.validateEnvironment();

  let maybe_paths = get_potential_paths();

  let sources_paths = get_sources_paths({ maybe_paths });
  if ( sources_paths.length === 0 ) {
    // If we don't throw, it'll be more confusing when no tests run
    log.throw({ code: `ALK0050`, context: `sources`,
      error: new ReferenceError(
        `ALKiln can't find your "sources" folder(s) which should contain tests and their related files.`
      ),
    });
  }

  log.info({ code: `ALK0042`, context: `sources` },
    `Did find "sources" file(s) at "${ sources_paths.join('", "') }".`
  );
  session_vars.set_sources_paths( sources_paths );
  
  return sources_paths;
}


function get_potential_paths() {
  /** Use command line args and session vars to return a list of strings of
   *    possible sources files paths.
   * 
   * @returns {[string]} - Potential sources paths.
   * */
  // `project` is the name in the server docassemble "Project" page
  let project = session_vars.get_user_project_name();
  let id = session_vars.get_user_id();
  let root = process.cwd();

  // process.argv is a list of strings of commands and args.
  // Internal note: If using `npm run cucumber`, use `--` before
  //    `--sources=./foo`
  let cli_args = require(`minimist`)( process.argv.slice(2), {
    default: {
      sources: [
        `./docassemble/*/data/sources`,  // In GitHub folder
        `/usr/share/docassemble/files/playgroundsources/${id}/${project}/*.feature`, // From playground without S3
        path.join( root, `/playgroundsources/${id}/${project}/*.feature`), // From playground with S3
      ],
    }
  });

  // Make sure `sources` is always a list
  let potential_paths_list = cli_args.sources;
  if ( !Array.isArray( cli_args.sources )) {
    potential_paths_list = [ cli_args.sources ];
  }

  return potential_paths_list;
}


function get_sources_paths({ maybe_paths }) {
  /** Of the given possible paths, return the paths that actually exist. Maybe
   *    none.
   * 
   * @param {object} obj - Named arguments
   * @param {[string]} obj.maybe_paths - All possible paths
   * 
   * @returns {[string]} - List of all existing paths
   * */
  // Check every path, tracking which exist and which are missing
  let existing_paths = [];
  let missing_paths = [];
  for ( let path of maybe_paths ) {
    let dirs = fast_glob.sync(
      [ path ],
      { onlyFiles: false, suppressErrors: true }
    );

    if ( dirs.length > 0 ) {
      existing_paths.push( ...dirs );
    } else {
      missing_paths.push( path );
    }
  }

  return existing_paths;
}
