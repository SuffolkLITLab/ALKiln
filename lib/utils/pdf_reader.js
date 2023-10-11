// All functions dealing with getting information from PDFs

const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const Diff = require("diff");
const path = require("path");

let _load_pdf = async function(pdf_path) {
  // Simple wrapper to get the document
  return await pdfjsLib.getDocument({
    url: pdf_path,
    standardFontDataUrl: path.join(__dirname, '../../node_modules/pdfjs-dist/standard_fonts/')
  }).promise;
};

let _get_content = async function(pdf_doc) {
  let num_pages = pdf_doc.numPages;
  let contents = "";
  for (var i = 1; i <= num_pages; i++) {
    const page_contents = await (await pdf_doc.getPage(i)).getTextContent();
    contents += "\n" + page_contents.items.map((item) => item.str).join(" ");
  }
  return contents;
};

let pdf_reader = {};

pdf_reader.get_content = async function(pdf_path) {
  /* Gets the full text content from the PDF.
   *
   * @returns str
   */

  let doc = await _load_pdf(pdf_path);
  return await _get_content(doc);
}; // Ends get_content()

pdf_reader.get_fields = async function(pdf_path) {
  /* Gets all of the fields in the PDF
   * 
   * Example:
   * {
   *   "users1_name_first": [
   *      {
   *         "id": "6R",
   *         "value": "aeu",
   *         "defaultValue": "",
   *         "multiline": false,
   *         "password": false,
   *         "charLimit": 0,
   *         "comb": false,
   *         "editable": true,
   *         "hidden": false,
   *         "name": "users1_name_first",
   *         "rect": [
   *             143.52,
   *             660.72,
   *             315.11,
   *             674.88
   *         ],
   *         "actions": null,
   *         "page": 0,
   *         "strokeColor": null,
   *         "fillColor": null,
   *         "rotation": 0,
   *         "type": "text"
   *       }
   *   ],
   */
  let doc = await _load_pdf(pdf_path);
  const field_objects = await doc.getFieldObjects();
  return field_objects;
}; // Ends get_fields

pdf_reader.get_field_value = async function(pdf_path, field_name) {
  let field_objects = await pdf_reader.get_fields(pdf_path);
  if (field_name in field_objects) {
    for (let inst of field_objects[field_name]) {
      if ("value" in inst) {
        return inst["value"];
      }
    }
  }
  return null;
}; // Ends get_field

pdf_reader.compare_pdfs = async function(existing_pdf_path, new_pdf_path) {
  /**
   * Returns the change objects between the PDF fields, if there's any diff
   */
  let existing_doc = await _load_pdf(existing_pdf_path);
  let new_doc = await _load_pdf(new_pdf_path);
  let existing_content = await _get_content(existing_doc);
  let new_content = await _get_content(new_doc);

  let change = Diff.diffWords(existing_content, new_content);
  if (change.some(diff => diff.added || diff.removed)) {
    return change;
  }

  const existing_fields = await existing_doc.getFieldObjects();
  const new_fields = await new_doc.getFieldObjects();

  let changeObjs = Diff.diffJson(existing_fields, new_fields);
  if (changeObjs.some(diff => diff.added || diff.removed)) {
    return changeObjs;
  }
  return null;
}; // End compare_pdfs

module.exports = pdf_reader;