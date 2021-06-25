let names = {};

names.language = 'some_lang';
names.safe_id = 'a_safe_id';

names.chinese_input = `是汉字`;
names.chinese_output = `是汉字_`;

names.no_underscore_input = `ends_in_no_underscore`;
names.no_underscore_output = `ends_in_no_underscore_`;

names.one_underscore_input = `ends_in_one_underscore_`;
names.one_underscore_output = `ends_in_one_underscore_`;

names.two_underscores_input = `ends_in_two_underscores__`;
names.two_underscores_output = `ends_in_two_underscores__`;

names.empty_string_input = ``;
names.empty_string_output = ``;

names.undefined_input;
names.undefined_output = ``;


module.exports = names;
