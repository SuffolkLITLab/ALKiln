#!/bin/bash

# If folder doesn't exist, make folder
mkdir to_push

# https://stackoverflow.com/questions/34885949/how-to-i-save-grep-regex-matched-result-to-a-variable
# https://www.cyberciti.biz/faq/how-to-assign-a-grep-command-value-to-a-variable-in-linuxunix/
# https://unix.stackexchange.com/a/229237

repo_name=$(echo "$INPUT_DESTINATION_REPO" | sed 's|.*\/\(.*\)$|\1|')
sed -e 's|just_repo|'"$repo_name"'|' -e 's|user_repo|'"$INPUT_DESTINATION_REPO"'|' pushing_testing_files/package.json > to_push/package.json
