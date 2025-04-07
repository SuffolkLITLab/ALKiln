const Gherkin = require(`@cucumber/gherkin`);
const Messages = require(`@cucumber/messages`);

module.exports = function get_Gherkin_AST({ file_text }) {
  /** Return Gherkin parser's abstract syntax tree of the given generator file
   *
   * @param {object} obj - Named arguments
   * @param {string} file_text - The generator file's text contents
   *
   * @returns {object} - Gherkin parser's AST of the given generator file
   * */
  let AST = null;
  let parse_errors = [];
  try {
    let uuidFn = Messages.IdGenerator.uuid();
    let builder = new Gherkin.AstBuilder(uuidFn);
    let matcher = new Gherkin.GherkinClassicTokenMatcher(); // or Gherkin.GherkinInMarkdownTokenMatcher()

    let parser = new Gherkin.Parser(builder, matcher);
    AST = parser.parse( file_text );
  } catch ( gherkin_error ) {
    parse_errors.push( gherkin_error );
  }

  return { AST, errors: parse_errors };
}
