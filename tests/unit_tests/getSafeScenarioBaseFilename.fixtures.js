let names = {};

names.with_spaces = `a tests description`;

names.non_english_chars = `是汉字`;

names.colon_input = `invalid:colon`;
names.colon_output = `invalid_colon`;

names.long_input = `Longest scenario description should be 70 characters or less 0123456789`;
names.long_output = `Longest scenario description should be 70 characters or less 012345678`;

module.exports = names;
