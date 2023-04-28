#!/usr/bin/env node

const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

// Loading file from file system into typed array
const pdfPath =
  process.argv[2] || "Adult Name Change (Alabama).pdf";

async function testPdf(pdfPath) {
  const loadingTask = await pdfjsLib.getDocument(pdfPath);

  const doc = await loadingTask.promise;
  const contents = await (await doc.getPage(1)).getTextContent();
  console.log(contents.items.map((item) => item.str).join(" "));
  const field_objects = await doc.getFieldObjects();
  console.log(JSON.stringify(field_objects, null, 4));
  return field_objects;
}

testPdf(pdfPath);
