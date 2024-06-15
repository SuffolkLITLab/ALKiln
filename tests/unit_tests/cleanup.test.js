// // mock unit test for cleanup function
// // Useless if mock becomes outdated

// // Add jest?
// // Add ts?



// // test file
// import da_api;
// let interviews = [{i, uid}, {i, uid}]
// let REST = {}
// REST.delete_interview = function (...) {
//   check that right args have been passed in so I need to know when to update mocks
//   depending on the loop, the right ids and file names have been passed in
// }

// // import da_api
// await delete_all_interviews({ delete: REST.delete_interview, interviews });

// // mock server same way
// // Separate test file?
// await delete_all_interviews();



// // abstracted function in the real file
// async func delete_all_interviews ({ delete, interviews }) {
//   for each interview
//     check that it passes in the right arguments to:
//     da_api.delete_interview
//   return
// }



// // API test happens elsewhere
// // TODO: Use jest to mock axios so we can test all the way down
//