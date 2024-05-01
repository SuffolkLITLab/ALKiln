const fs = require(`fs`);

// Ours
const session_vars = require(`./session_vars`);
const files = require(`./files` );


module.exports = reports = {};

reports.addReportHeading = function (scope, { scenario }) {
  /** Return printable heading based on Scenario name and tags.
  *    Allow characters from other languages.
  */
  if ( session_vars.get_debug() ) { console.log(`🔎 ALK0177 INFO: reports.addReportHeading(): ${scenario.pickle.name} \n`); }

  // Collect all tag names
  let tag_names = [];
  for ( let tag of scenario.pickle.tags ) {
    tag_names.push( tag.name );
  }

  let heading = `\n---------------\n`
    + `Scenario: ${ scenario.pickle.name }`;

  if ( tag_names.length > 0 ) {
    heading += `\nTags: ${ tag_names.join(' ') }`;
  }

  heading += `\n---------------`;

  reports.addToReport( scope, {
    code: `ALK0178`,
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
  // Debugging logs
  let debug_line = getDebugLine({ type, code, value });
  if ( session_vars.get_debug() ) {
    console.log( `Report: ${ debug_line }` );
  }

  // Ensure default file path for saving internal unit test logs
  const MISC_ARTIFACTS_DIR = `_alkiln-misc_artifacts`;
  if ( !scope.paths ) {
    // Can this be usefully abstracted?
    scope.paths = { debug_log: `${ MISC_ARTIFACTS_DIR }/unit_tests_logs-${ files.readable_date() }.txt` };
  }

  try {
    fs.appendFileSync( scope.paths.debug_log, `\nReport:\n${debug_line}` );
  } catch ( err ) {
    fs.mkdirSync( MISC_ARTIFACTS_DIR );
    fs.appendFileSync( scope.paths.debug_log, `\nReport:\n${debug_line}` );
    // An error in here should throw (for now)
  }

  // Report stuff
  let scenario = makeSureReportPartsExist( scope );
  scenario.lines.push({ type, code, value });

  return scenario;
};  // Ends reports.addToReport()

let makeSureReportPartsExist = function( scope ) {
  /** If a part of the report needs to exist right now, but doesn't exist,
  * create it. */
  if ( !scope.report ) { scope.report = new Map(); }
  if ( !scope.scenario_id ) {
    scope.scenario_id = `_report_${ Date.now() }`;
  }
  if ( !scope.report.get( scope.scenario_id )) {
    scope.report.set( scope.scenario_id, {} )
    scope.report.get( scope.scenario_id ).status = `in progress`;
  }

  let scenario = scope.report.get( scope.scenario_id );
  if ( !scenario.lines ) { scenario.lines = []; }

  return scenario;
};  // Ends makeSureReportPartsExist()

reports.setReportScenarioStatus = function( scope, { status=`PASSED` }) {
  /** Add final status of scenario to scenario report object - passed, failed, etc. */
  scope.report.get( scope.scenario_id ).status = status;
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
  /** Return a string generated from test report data. */
  let report = `Assembly Line Kiln Automated Testing Report - ${ (new Date()).toUTCString() }\n`;

  // First list failed scenarios, then non-passed scenarios, then passed scenarios
  let failed_reports = ``;
  let passed_reports = ``;
  let other_reports = ``;
  for ( let scenario of scope.report ) {

    let report = reports.getPrintableScenario( scenario );
    let [ scenario_id, data ] = scenario;
    if ( data.status === `FAILED` ) { failed_reports += report; }
    else if ( data.status === `PASSED` ) { passed_reports += report; }
    else { other_reports += report; }
  };  // ends for every scenario

  if ( failed_reports !== `` ) { report += `\n\n===============================\n===============================\nFailed scenarios:\n${ failed_reports }`; }
  if ( other_reports !== `` ) { report += `\n\n===============================\n===============================\nScenarios that did not pass:\n${ other_reports }`; }
  if ( passed_reports !== `` ) { report += `\n\n===============================\n===============================\nPassed scenarios:\n${ passed_reports }`; }

  return report;
};  // Ends reports.getPrintableReport()

reports.getPrintableScenario = function( scenario ) {
  /** Return a string generated from scenario list of report items. */
  let [ scenario_id, data ] = scenario;
  let report = ``;
  for ( let line of data.lines ) {
    let { type, code, value } = line;
    report += `${ getLineText({ type, code, value }) }\n`;
  }
  return report;
};  // Ends reports.getPrintableScenario()

let getLineText = function ({ type=`no type`, code=`ALK0000`, value=`` }) {
  let start = ``;
  if ( type.includes(`page_id`) ) { start += `screen id: `; }
  else if ( type.includes(`outcome`) ) { start += `\n`; }  // extra new line
  else if ( type.includes(`warning`) ) { start += `🔎 ${ code } WARNING: `; }
  else if ( type.includes(`error`) ) { start += `\n🤕 ${ code } ERROR: `; }  // extra new line
  return `${ start }${ value }`;
};  // Ends getLine()

let getDebugLine = function ({ type=`no type`, code=`ALK0000`, value=`` }) {
  let start = ``;

  if ( type.includes(`info`) ) { start += [`💡`, code , `INFO` ].join(` `) }
  else if ( type.includes(`success`) ) { start += [`🌈`, code , `SUCCESS` ].join(` `) }
  else if ( type.includes(`warning`) ) { start += [`🔎`, code , `WARNING` ].join(` `) }
  else if ( type.includes(`error`) ) { start += [`🤕`, code , `ERROR` ].join(` `) }
  else { start += [`* ${ code }`].join(` `) }

  let extra_types = type.replace(/success|info|warning|error/i, ``).trim();
  if ( extra_types.length > 0 ) { start += ` ${ extra_types }`; }

  return `${ start }: ${ value }`;
};  // Ends getLine()
