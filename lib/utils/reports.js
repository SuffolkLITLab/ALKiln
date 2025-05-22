const fs = require(`fs`);

// Ours
const session_vars = require(`./session_vars`);
const files = require(`./files` );


module.exports = reports = {};

reports.title = `Assembly Line Kiln Automated Testing Report - ${ (new Date()).toUTCString() }\n`;
reports.failures = [ `\n\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n🤕 Failed scenarios\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n` ];
reports.successes = [ `\n\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n🌈 Passed scenarios\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n` ];
// reports.warnings = [ `\n\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n🔎 Scenarios to check\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n` ];
// reports.undefineds = [ `\n\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n[langs icon] Scenarios with typos\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n` ];
reports.others = [ `\n\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n🔎 Other scenarios that did not pass\n≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡\n` ];

reports.addReportHeading = function (scope, { scenario }) {
  /** Return printable heading based on Scenario name and tags.
  *    Allow characters from other languages.
  */
  if ( session_vars.get_debug() ) { console.log(`🔎 ALK0175 INFO: reports.addReportHeading(): ${scenario.pickle.name} \n`); }

  // Collect all tag names
  let tag_names = [];
  for ( let tag of scenario.pickle.tags ) {
    tag_names.push( tag.name );
  }

  let heading = `\n━━━━━━━━━━━━━━━\n`
    + `Scenario: ${ scenario.pickle.name }`;

  if ( tag_names.length > 0 ) {
    heading += `\nTags: ${ tag_names.join(' ') }`;
  }

  heading += `\n━━━━━━━━━━━━━━━`;

  reports.addToReport( scope, {
    code: `ALK0176`,
    type: `heading info`,
    value: heading,
  });
};  // Ends reports.addReportHeading()

// TODO: Maybe return line so it can be used in error messages, etc.
reports.addToReport = function( scope, { type, code, value }) {
  /** Add an item to a specific list in a scenario's report.
  * Create report if necessary.
  * 
  * The report has a key for each scenario and each of those
  * keys should correspond to a list containing the relevant data.
  *
  * @params code {string} (Optional) Error or warning code. Default
  *    is unspecified error or warning.
  * */
  // TODO: return full message so it can be passed to manually
  // thrown errors if needed.

  // Debugging logs
  let debug_line = getDebugLine({ type, code, value, indent: global_indent });
  if ( session_vars.get_debug() ) {
    console.log( `Report: ${ debug_line }` );
  }

  // Ensure default file path for saving internal unit test logs
  const MISC_ARTIFACTS_DIR = `_alkiln-misc_artifacts`;
  if ( !scope.paths ) {
    // Can this be usefully abstracted?
    let date = files.readable_date();
    scope.paths = {
      debug_log: `${ MISC_ARTIFACTS_DIR }/unit_tests_debug_log-${ date }.txt`,
      report_log: `${ MISC_ARTIFACTS_DIR }/unit_tests_report_log-${ date }.txt`,
    };
  }

  try {
    fs.appendFileSync( scope.paths.debug_log, `\nReport:\n${debug_line}` );
    fs.appendFileSync( scope.paths.report_log, `\nReport:\n${debug_line}` );
  } catch ( file_error ) {
    fs.mkdirSync( MISC_ARTIFACTS_DIR );
    fs.appendFileSync( scope.paths.debug_log, `\nReport:\n${debug_line}` );
    fs.appendFileSync( scope.paths.report_log, `\nReport:\n${debug_line}` );
    // An error in here should throw (for now)
  }

  // Report stuff
  let scenario = reports.makeSureScenarioExists( scope );
  scenario.lines.push({ type, code, value, indent: global_indent });

  return getLineText({ type, code, value, indent: global_indent });
};  // Ends reports.addToReport()


let indent_num = 0;
let global_indent = ``;
reports.indent = function() {
  indent_num += 2;
  global_indent = ` `.repeat( indent_num );
}
reports.outdent = function() {
  indent_num = Math.max( 0, indent_num - 2 );
  global_indent = ` `.repeat( indent_num );
}


reports.create = function( scope ) {
  reports.makeSureReportExists( scope );
}

reports.makeSureReportExists = function( scope ) {
  /** If a part of the report needs to exist right now, but doesn't exist,
  * create it. */
  if ( !scope.report ) { scope.report = new Map(); }
  return this;
};  // Ends reports.makeSureReportExists()

reports.makeSureScenarioExists = function ( scope ) {
  reports.makeSureReportExists( scope );
  if ( !scope.scenario_id ) {
    scope.scenario_id = `_report_${ Date.now() }`;
  }
  if ( !scope.report.get( scope.scenario_id )) {
    scope.report.set( scope.scenario_id, {} );
    scope.report.get( scope.scenario_id ).status = `in progress`;
  }

  let scenario = scope.report.get( scope.scenario_id );
  if ( !scenario.lines ) { scenario.lines = []; }

  return scenario;
};  // Ends reports.makeSureScenarioExists()

reports.saveFinalScenarioData = function( scope, { status=`in progress` }) {
  this.setReportScenarioStatus( scope, { status });
  let scenario = scope.report.get( scope.scenario_id );
  let report = this.getPrintableScenario( scenario );
  if ( scenario.status === `PASSED` ) {
    this.successes.push( report );
  } else {
    this._save_unexpected( scope, { status: scenario.status, report });
  }
  // if ( scenario.status === `FAILED` ) {
  //   this.failures.push( report );
  // }
  // else if ( scenario.status === `PASSED` ) { this.successes.push( report ); }
  // // else if ( scenario.status === `WARNING` ) { passed_reports += report; this.warnings.push( report ); }
  // // else if ( scenario.status === `UNDEFINED` ) { passed_reports += report; this.undefineds.push( report ); }
  // else { this.others.push( report ); }

  // // Save to unexpected results files (worry about optimization later)
  // if ( this.failures.length > 1 || this.others.length > 1 ) {
  //   let unexpected_results = this.title + this.getPrintableUnexpected( scope );
  //   fs.writeFileSync( scope.paths.report_of_unexpected, unexpected_results );
  //   fs.appendFileSync( scope.paths.debug_of_unexpected, unexpected_results );
  // }

  // Save to reports.txt (worry about optimization later)
  fs.writeFileSync( scope.paths.report, this.getPrintableReport( scope ) );

  return scenario;
};  // Ends reports.saveFinalScenarioData()

reports._save_unexpected = function(scope, { status, report }) {
  /** Store the unexpected report and write to the unexpected report file.
   *
   * @param {Object} scope - State and methods of the current tests
   * @param {Object} data
   * @param {Object} data.status - Status of the current scenario
   * @param {string} data.report - Report for the current scenario
   * */
  if ( status === `FAILED` ) {
    this.failures.push( report );
  // } else if ( status === `WARNING` ) { passed_reports += report; this.warnings.push( report );
  // } else if ( status === `UNDEFINED` ) { passed_reports += report; this.undefineds.push( report ); }
  } else {
    this.others.push( report );
  }

  // If it's our first unexpected result, add the title to the top of the page
  let already_unexpected = ``;
  try { already_unexpected = fs.readFileSync( scope.paths.report_of_unexpected ); }
  catch ( ignore_non_critical_error ) {}
  if ( already_unexpected === `` ) {
    try { fs.appendFileSync( scope.paths.report_of_unexpected, this.title ); }
    catch ( ignore_non_critical_error ) {}
  }

  try { fs.appendFileSync( scope.paths.report_of_unexpected, report ); }
  catch ( ignore_non_critical_error ) {}

  return this;
}

reports.progress = function ({ logs=[] }) {
  // TODO: save stdout-style to report_log, object, and getting printable scenario
};

reports.setReportScenarioStatus = function( scope, { status=`PASSED` }) {
  /** Add final status of scenario to scenario report object - passed, failed, etc. */
  scope.report.get( scope.scenario_id ).status = status;
  return scope.report.get( scope.scenario_id );
};  // Ends reports.setReportScenarioStatus()

reports.convertToOriginalStoryTableRow = function( scope, { row_data }) {
  /** Returns the original data of row into a string formatted as a story table row.
  * Should this show the actual row data that was used instead? That could
  * be pretty confusing to most devs. */
  let source_row = row_data.source || row_data;
  let original = source_row.original;
  let var_str = trimJSON( original.var );
  let value_str = trimJSON( original.value );
  let trigger_str = trimJSON( original.trigger );
  if ( trigger_str === scope.trigger_not_needed_flag ) {
    // This text was added by ALKiln itself. It's not part of the user's data
    trigger_str = ``;
  }
  return `${ ' '.repeat(6) }| ${ var_str } | ${ value_str } | ${ trigger_str } |`;
};  // Ends reports.convertToOriginalStoryTableRows()

let trimJSON = function( str=`` ) {
  /** Turn into JSON string then trim quotes from the start and end. */
  let json = JSON.stringify( str );
  let trimmed = json.replace( /^"/, `` ).replace( /"$/, `` ).replace( /\\\\/g, `\\`);
  return trimmed;
};  // Ends trimJSON()

reports.getPrintableReport = function( scope ) {
  /** Return a string generated from test report data.
  *
  * First list failed scenarios, then non-passed scenarios, then passed scenarios. */
  let report = this.getTitle( scope );

  if ( this.failures.length > 1 ) { report += this.failures.join( `` ); }
  if ( this.successes.length > 1 ) { report += this.successes.join( `` ); }
  // if ( this.warnings.length > 1 ) {}
  // if ( this.undefineds.length > 1 ) {}
  if ( this.others.length > 1 ) { report += this.others.join( `` ); }

  return report;
};  // Ends reports.getPrintableReport()

reports.getTitle = function( scope ) { return this.title; }

reports.getPrintableUnexpected = function( scope ) {
  // Note about `> 1`: The first line of the report section always exists
  let output = ``;
  if ( this.failures.length > 1 ) {
    output += this.failures.join(``);
  }
  if ( this.others.length > 1 ) {
    output += this.others.join(``);
  }
  return output;
};  // Ends reports.getPrintableUnexpected()

reports.getPrintableScenario = function( scenario ) {
  /** Return a string generated from scenario list of report items. */
  let report = ``;
  for ( let line of scenario.lines ) {
    let { type, code, value, indent } = line;
    report += `${ getLineText({ type, code, value, indent }) }\n`;
  }
  return report;
};  // Ends reports.getPrintableScenario()

let getLineText = function ({ from_log, type=`no type`, code=`ALK00rl`, value=``, indent=`` }) {

  value = `${ value.replace( /\n/g, `\n` + indent ) }`;

  if ( type === `as_is` ) { return `${ indent }${ value }`; }

  let start = indent;
  if ( type.includes(`outcome`) ) { start = `\n`; }  // extra new line

  if ( type.includes(`page_id`) ) { start += `screen id: `; }
  else if ( type.includes(`warning`) && !from_log ) { start += `🔎 ${ code } WARNING: `; }
  else if ( type.includes(`error`) && !from_log ) { start += `🤕 ${ code } ERROR: `; } // extra new line

  return `${ start }${ value }`;

}; // Ends getLine()

let getDebugLine = function ({ from_log, type=``, code=`ALK00rd`, value=``, indent=`` }) {
  /** In debug log lines, include all the information possible. */

  // Discuss: How to prevent saving in the debug log twice
  if ( from_log ) { return value; }
  // `plain` is usually used for visual clarity and shouldn't have
  // codes and such associated with it. Return right away.
  if ( type.includes(`plain`) ) { return `${ indent }${ value }`; }

  let start = indent;

  // Get all the relevant emoji
  if ( type.includes(`debug`) ) { start += `🐛`; }
  if ( type.includes(`info`) ) { start += `💡`; }
  if ( type.includes(`success`) ) { start += `🌈`; }
  if ( type.includes(`warning`) ) { start += `🔎`; }
  if ( type.includes(`error`) ) { start += `🤕`; }
  // Default
  if ( start === indent ) { start += `?`; }

  start += ` ${ code }`;

  let description_parts = [];
  let extra_types = type.replace(/debug|info|success|warning|error/i, ``).replace(/  +/g, ' ').trim();
  if ( extra_types.length > 0 ) { description_parts = extra_types.split(` `); }

  // Get all the main descriptive text
  if ( type.includes(`debug`) ) { description_parts.push( `DEBUG` ); }
  if ( type.includes(`info`) ) { description_parts.push( `INFO` ); }
  if ( type.includes(`success`) ) { description_parts.push( `SUCCESS` ); }
  if ( type.includes(`warning`) ) { description_parts.push( `WARNING` ); }
  if ( type.includes(`error`) ) { description_parts.push( `ERROR` ); }
  // Default
  if ( description_parts.length <= 0 ) { description_parts.push( `UNKNOWN LOG TYPE` ); }

  start = [ start, ...description_parts ].join(` `);

  return `${ start }: ${ value }`;
};  // Ends getLine()
