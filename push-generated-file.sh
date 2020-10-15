#!/bin/sh

# Combo of
# - https://github.com/cpina/github-action-push-to-another-repository
# - https://github.com/dmnemec/copy_file_to_another_repo_action
# Also used https://www.shellcheck.net/

echo "Starts"
SOURCE_USERNAME="$INPUT_USERNAME"
SOURCE_EMAIL="$INPUT_USER_EMAIL"
# DESTINATION_USERNAME="$5"
DESTINATION_REPO="$INPUT_DESTINATION_REPO"
DESTINATION_BRANCH="$INPUT_DESTINATION_BRANCH"

# Destructive
#    - source-directory }}
#    - ${{ inputs.destination-github-username }}
#    - ${{ inputs.destination-repository-name }}
#    - ${{ inputs.user-email }}
#    - ${{ inputs.destination-repository-username }}
#    - ${{ inputs.target-branch }}
# Non-generating
#    - ${{ inputs.source-file }}
#    - ${{ inputs.destination-repo }}
#    - ${{ inputs.destination-folder }}
#    - ${{ inputs.user-email }}
#    - ${{ inputs.destination-branch }}

# Give warnings
if [ -z "$INPUT_SOURCE_FILE" ]
then
  echo "source_file must be defined. It can include a directory path."
fi
if [ -z "$SOURCE_USER_NAME" ]
then
  echo "user_name must be defined"
fi
if [ -z "$SOURCE_EMAIL" ]
then
  echo "user_email must be defined"
fi
if [ -z "$DESTINATION_REPO" ]
then
  echo "destination_repo must be defined"
fi
# Does this have to be defined, or can it be an empty string?
#if [ -z "$INPUT_DESTINATION_FOLDER" ]
#then
#  echo "destination_folder must be defined"
#fi

# Set defaults
if [ -z "$INPUT_DESTINATION_FOLDER" ]
then
  INPUT_DESTINATION_FOLDER=""
fi

#if [ -z "$DESTINATION_USERNAME" ]
#then
#  DESTINATION_USERNAME="$SOURCE_USERNAME"
#fi
if [ -z "$DESTINATION_BRANCH" ]
then
  DESTINATION_BRANCH="main"
fi

CLONE_DIR=$(mktemp -d)

echo "Cloning destination git repository"
# Setup git
git config --global user.email "$SOURCE_EMAIL"
git config --global user.name "$SOURCE_USERNAME"
git clone --single-branch --branch "$DESTINATION_BRANCH" "https://$API_TOKEN_GITHUB@github.com/$DESTINATION_REPO.git" "$CLONE_DIR"
ls -la "$CLONE_DIR"

#echo "Cleaning destination repository of old files"
## Copy files into the git and deletes all git
#find "$CLONE_DIR" | grep -v "^$CLONE_DIR/\.git" | grep -v "^$CLONE_DIR$" | xargs rm -rf # delete all files (to handle deletions)
#ls -la "$CLONE_DIR"

echo "Copying contents to to git repo"
mkdir -p "$CLONE_DIR/$INPUT_DESTINATION_FOLDER"
cp -R "$INPUT_SOURCE_FILE" "$CLONE_DIR/$INPUT_DESTINATION_FOLDER"
cd "$CLONE_DIR"

echo "Adding git commit"
git add .
if git status | grep -q "Changes to be committed"
then
  git commit --message "Update from https://github.com/$GITHUB_REPOSITORY/commit/$GITHUB_SHA"
  echo "Pushing git commit"
  git push origin "$INPUT_DESTINATION_BRANCH"
else
  echo "No changes detected"
fi
