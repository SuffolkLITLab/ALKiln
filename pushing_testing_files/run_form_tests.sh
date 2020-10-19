#!/bin/bash

# If folder doesn't exist, make folder
mkdir workflows

# https://stackoverflow.com/questions/34885949/how-to-i-save-grep-regex-matched-result-to-a-variable
# https://www.cyberciti.biz/faq/how-to-assign-a-grep-command-value-to-a-variable-in-linuxunix/
# https://unix.stackexchange.com/a/229237

sed -e 's|repo_address|'"$DESTINATION"'|' -e 's|interview_base_url|'"$INTERVIEW_BASE_URL"'|' pushing_testing_files/run_form_tests.yml > workflows/run_form_tests.yml
