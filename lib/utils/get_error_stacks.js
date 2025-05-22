module.exports = function get_error_stacks({ errors }) {
  /** Given a list of Error instances, return a list of their stacks
   * 
   * Discuss: Move this into `Log`. Potentially print each stack with the
   *    same icon as the message. `{to_stack: [Errors]}.
   * 
   * @param {object} obj - Named arguments
   * @param {[Error]} obj.errors - A list of Error instances
   * 
   * @returns {[Error.stack]} - A list of Error instances' `.stack` properties
   * */
  let stacks = errors.map(function( error ) {
    return error.stack;
  });
  return stacks;
};
