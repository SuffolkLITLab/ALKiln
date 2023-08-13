let session_vars = require(`../utils/session_vars`);
let docassemble_api_interface = require('./docassemble_api_interface');

let get_base_interview_url = async function () {
  /** Return the part of the interview URL that comes before the filename.
  *    Depends on the project name, which may get changed.
  *    This also needs to ensure that variable values from previous tests aren't used.
  *    That's not completely possible, but our tests try to do this in several ways.
  *    This function uses `new_session=1` to try to ensure old session vars aren't used.
  *    When finishing a test, we go to the sign out page (which is supposed to help even
  *    when the user is not logged in.) We can't use `reset=2` because it caused an
  *    'Unable to locate interview session' error. */
  let server_url = session_vars.get_da_server_url();
  console.log(session_vars.get_install_type());
  if (session_vars.get_install_type() === "server") {
    let x = `${ server_url }/interview?new_session=1&i=${session_vars.get_package_name().replace("-", ".")}%3A`;
    console.log(`base_interview_url: ${x}`)
    return x;
  } else {
    let dev_id = await docassemble_api_interface.get_dev_id();
    let project_name = session_vars.get_project_name();
    let x = `${ server_url }/interview?new_session=1&i=docassemble.playground${ dev_id }${ project_name }%3A`;
    console.log(`base_interview_url: ${x}`)
    return x;
  }
};

module.exports = get_base_interview_url;
