#!/bin/bash

# If folder doesn't exist, make folder
mkdir to_push

# https://stackoverflow.com/questions/34885949/how-to-i-save-grep-regex-matched-result-to-a-variable
# https://www.cyberciti.biz/faq/how-to-assign-a-grep-command-value-to-a-variable-in-linuxunix/
# https://unix.stackexchange.com/a/229237


# 's|just_repo|'
# 's|user_repo|'"$DESTINATION_REPO"'|g' to_copy_and_change.json > output/output_file_01.json
# sed 's|github_url|'"$DESTINATION_REPO"'|g' to_copy_and_change.json > output/output_file_01.json

repo_name=$(echo "$DESTINATION_REPO" | sed 's|.*\/\(.*\)$|\1|')

# just_repo "$repo_name"
# user_repo "$DESTINATION_REPO"

# sed '/^FOOTER/d; s/^\"//; s/\"$//; s/\"|\"/|/g' csv > csv1
# sed -e '/^FOOTER/d' -e 's/^\"//' -e 's/\"$//' -e 's/\"|\"/|/g' csv > csv1

sed -e 's|just_repo|'"$repo_name"'|' -e 's|user_repo|'"$DESTINATION_REPO"'|' package.json > to_push/package.json

# myuser="$(grep '^vivek' /etc/passwd)"
# "grep -oE '.*\/(.+)' $DESTINATION_REPO"
# echo $(grep '.*\/(.+)' pla/blah-blah)

# sed 'foo'     \
# | sed 's/d/a/' \
# | sed 's/e/b/' \
# | sed 's/f/c/' \
# > myfile
# sed '
# s|user_repo|'"$DESTINATION_REPO"'|g
# s/\bBC\b/________CD________/g
# s/________//g
# ' path_to_your_files/*.txt
