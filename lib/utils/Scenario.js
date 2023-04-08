
// ====================
// Scenario
// ====================
class Scenario {
  /**
  * Follows the example of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze#description
  *    for preventing changing some properties.
  */
  
  constructor ({ artifacts_path, scenario_name }) {
    this.name = scenario_name;
    this.paths = new ScenarioPaths({ artifacts_path, scenario_name: this.scenario_name });
  }  // Ends Scenario.constructor()

  set name () {
    throw new TypeError(`You can only set this object's .name value when it's created. It is currently ${ this.name }.`);
  }

};  // Ends Scenario{}


// ====================
// Paths
// ====================
class ScenarioPaths {
  /**
  * Follows the example of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze#description
  *    for preventing changing some properties.
  * 
  * Root files like report.txt and debug_log.txt are not a responsibility
  *    of this class, though scenario-specific error screenshots are.
  */

  constructor ({ artifacts_path, scenario_name }) {

    this.scenario_name = scenario_name;
    this.root = artifacts_path;
    this.folder = `${ artifacts_path }/${ this.scenario_name }`;
    this.report = `${ paths.folder }/report.txt`;

  }  // Ends ScenarioPaths.constructor()

  set scenario_name () {
    throw new TypeError(`You can only set this object's .scenario_name value when it's created. It is currently ${ this.scenario_name }.`);
  }

  set root () {
    throw new TypeError(`You can only set this object's .root value when it's created. It is currently ${ this.root }.`);
  }

  set folder () {
    throw new TypeError(`You can only set this object's .folder value when it's created. It is currently ${ this.folder }.`);
  }

  set report () {
    throw new TypeError(`You can only set this object's .report value when it's created. It is currently ${ this.report }.`);
  }

  get_root_error_path ({ page_id }) {
    return `${ this.paths.folder }/error_on-${ files.below_21( page_id )}-${ files.below_71( this.scenario_name )}-${ Date.now() }.jpg`;
  }

  get_error_path ({ page_id }) {
    // There is only 1 error screenshot per scenario
    // TODO: can page id name be longer here? `.below_71()`?
    return `${ this.paths.folder }/error_on-${ files.below_21( page_id )}.jpg`;
  }

  get_screenshot_path ({ page_id, name=`` }) {
    // TODO: can page id name be longer here? `.below_71()`?
    if ( name == `` ) {
      return `${ this.paths.folder }/pic_on-${ files.below_21( page_id )}-${ Date.now() }`;
    } else {
      return `${ this.paths.folder }/pic-${ files.below_71( name ) }-on-${ files.below_21( id ) }-${ Date.now() }`;
    }
  }

  get_random_folder_path ({ page_id }) {
    // How to handle that folder has different names?
  }
};  // Ends ScenarioPaths{}


module.exports = { Scenario, ScenarioPaths }
