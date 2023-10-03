const fs = require('fs');

// Ours
const session_vars = require('./session_vars');
const files = require('./files' );


module.exports = reports = {};

reports.addReportHeading = function (scope, { scenario }) {
  /** Return printable heading based on Scenario name and tags.
  *    Allow characters from other languages.
  */
  if ( session_vars.get_debug() ) { console.log( scenario.pickle.name ); }

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
    type: `heading`,
    value: heading,
  });
};  // Ends reports.addReportHeading()

reports.addToReport = function( scope, { type, value }) {
  /** Add an item to a specific list in a scenario's report.
  * Create report if necessary.
  * 
  * The report has a key for each scenario and each of those
  * keys should correspond to a list containing the relevant data. */
  if ( session_vars.get_debug() ) { console.log(`Report:\ntype: ${ type }, value: ${ value }\n`) }
  let scenario = makeSureReportPartsExist( scope );
  scenario.lines.push({ type, value });

  // TODO: Not sure how to use .add_to_debug_log() here considering possibly dynamic filepath
  // log.add_to_debug_log(`Report:\ntype: ${ type }, value: ${ value }\n`);

  const MISC_ARTIFACTS_DIR = `_alkiln-misc_artifacts`;
  // Ensure filepath for saving local unit test logs
  if ( !scope.paths ) {
    // TODO: would it be useful to put in existing artifacts folder if possible.
    // Can this be usefully abstracted?
    scope.paths = { debug_log: `${ MISC_ARTIFACTS_DIR }/unit_tests_logs-${ files.readable_date() }.txt` };
  }

  try {
    fs.appendFileSync(scope.paths.debug_log, `\nReport:\ntype: ${ type }, value: ${ value }`);
  } catch (err) {
    fs.mkdirSync( MISC_ARTIFACTS_DIR );
    fs.appendFileSync(scope.paths.debug_log, `\nReport:\ntype: ${ type }, value: ${ value }`);
  }
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
  let var_str = trimJSON( scope, { str: original.var });
  let value_str = trimJSON( scope, { str: original.value });
  let trigger_str = trimJSON( scope, { str: original.trigger });
  if ( trigger_str === scope.trigger_not_needed_flag ) {
    // This text was added by ALKiln itself. It's not part of the user's data
    trigger_str = ``;
  }
  return `${ ' '.repeat(6) }| ${ var_str } | ${ value_str } | ${ trigger_str } |`;
};  // Ends reports.convertToOriginalStoryTableRows()

let trimJSON = function( scope, { str='' }) {
  /** Turn into JSON string then trim quotes from the start and end. */
  let json = JSON.stringify( str );
  let trimmed = json.replace( /^"/, '' ).replace( /"$/, '' ).replace( /\\\\/g, `\\`);
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

    let report = reports.getPrintableScenario( scope, { scenario });
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

reports.getPrintableScenario = function( scope, { scenario }) {
  /** Return a string generated from scenario list of report items. */
  let [ scenario_id, data ] = scenario;
  let report = ``;
  for ( let line of data.lines ) {
    if ( line.type === `page_id` ) { report += `screen id: `; }
    else if ( line.type === `outcome` ) { report += `\n`; }
    else if ( line.type === `warning` ) { report += `WARNING: `; }
    else if ( line.type === `error` ) { report += `\nERROR: ` }
    report += `${ line.value }\n`;
  }
  return report;
};  // Ends reports.getPrintableScenario()
