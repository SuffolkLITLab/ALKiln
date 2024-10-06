#!/bin/bash

# Identify missing and/or duplicate log codes

# Profiling performance
# set -x
# PS4='+ $EPOCHREALTIME ($LINENO) '
# alias echo='time echo'

exit_code=0

echo " -------------------------------------------------------
| Usage:                                                |
| bash $(basename $0) [dir] [c file] [c folder] [-l arg]
| dir:      The directory in which to search for logs   |
| c file:   Name of the log instance counter file       |
| c folder: Path to the folder of the log counter file  |
| -l arg:   \"1\" prints extra logs                       |
 -------------------------------------------------------"

# Get flags and their values
loudness="0"
while getopts ':l:' opt; do
  case "${opt}" in
    l) loudness="${OPTARG}";;
    \?) script_args+=("-$OPTARG");;
  esac
done

# Use global "option index" to get the next args

where_to_look=${@:$OPTIND:1}  # User's value
if [ "$where_to_look" = "" ]; then
    where_to_look="../.." # Default value
fi

expected_instances_file=${@:$OPTIND+1:1}  # User's value
if [ "$expected_instances_file" = "" ]; then
    expected_instances_file="log_code_expected_instances.txt" # Default value
fi

expected_instances_folder=${@:$OPTIND+2:1}  # User's value
if [ "$expected_instances_folder" = "" ]; then
    expected_instances_folder="$where_to_look/tests/log_codes" # Default value
fi

expected_instances_path="$expected_instances_folder/$expected_instances_file"

if [[ "$loudness" != "0" ]]; then
  echo "loudness: $loudness"
  echo "where_to_look: $where_to_look"
  echo "File showing expected instances of log codes: $expected_instances_path"
fi


# removed and are no longer used. Syntax used works with GitHub cli - [[:digit:]]
# https://stackoverflow.com/a/6901221
# Exclude files and paths
instances=$(find "$where_to_look" -type f ! -name "CONTRIBUTING.md" ! -name "$expected_instances_file" ! -name "debug_log.txt" ! -name "cucumber-report.txt" ! -path "*/tests/*" ! -path "*/node_modules/*" ! -path "*/ALKilnTests/*" ! -path "*/alkiln-*/*" ! -path "*/_alkiln*/*" ! -path "*/docs/decisions/*" ! -path "*/\.*" -print0 | xargs -0 -P 4 grep -0 -ro 'ALK[[:digit:]][[:digit:]][[:digit:]][[:digit:]]' | grep -v -- '--' )

if [[ "$loudness" != "0" ]]; then
  total_instances=$(echo "$instances" | wc -l)
  echo "Number 'ALK' logs found: $total_instances"
fi

# Get the unique paths for every code
codes_unique_paths=()
# Also get the actual highest code by its number
highest_code="1"
for one_code in $instances; do
  # Format of the string is "the/path:ALK####"
  # Split around the ":"
  path=$(echo "$one_code" | cut -d ":" -f 1)
  code=$(echo "$one_code" | cut -d ":" -f 2)
  # Get the code as an integer
  item_index=$(echo "$code" | sed 's/^ALK0*//')
  if [[ $item_index == "" ]]; then
    item_index=0
  fi
  # This name is bad. It's really each log code's
  # unique appearance. We could just use any string,
  # but the path name gives a little more info.
  # ¯\_(ツ)_/¯
  # Also, we really want a list here, but bash can't
  # make nested lists, so we're using ";" as a safe
  # delimiter. If the user wants verbose output,
  # we can also use it to help format the output.
  codes_unique_paths[$item_index]+=";$path"

  if (( highest_code < item_index )); then
    highest_code="$item_index"
  fi
done

if [[ "$loudness" != "0" ]]; then
  echo "Instance count: ${#codes_unique_paths[@]}"
  echo ">>> highest_code <<<: $highest_code"
  echo "Paths of ALK0000: ${codes_unique_paths[0]}"
fi

indx=0
too_many=()
missing=()
while [ "$indx" -lt "$highest_code" ]; do
  # Turn the index into a log code by prepending ALK and adding leading zeros
  log_code=$(printf "ALK%04d" "$indx")
  # Count ";" - a stand-in for the number of
  # instances of the log code
  num_paths=$(echo "${codes_unique_paths[$indx]}" | awk '{orig_len = length($0); gsub(/;/, "", $0); new_len = length($0); print orig_len - new_len}')
  # The # of expected instances of the log code
  # in all the relevant ALKiln files.
  num_expected=($(grep -oh "$log_code:[[:digit:]]" "$expected_instances_path" | sed 's/^ALK[[:digit:]][[:digit:]][[:digit:]][[:digit:]]://'))
  # The file tracking the # of expected instances
  # may have a typo. One likely typo is we can catch:
  # Putting 2 entries for one log code in the file.
  num_expectations_found=${#num_expected[@]}
  if [[ "$num_expectations_found" -gt "1" ]]; then
    echo "WARNING: Multiple entries of '$log_code' in $expected_instances_path. Using the first one because that's easiest: ${num_expected[0]}"
    num_expected=${num_expected[0]}
  fi

  if [[ "$num_expected" == "" ]]; then
    num_expected="1"
  fi

  # To add to the list of strings to print later
  short_msg="$log_code $num_paths/$num_expected"
  long_msg="$log_code act/exp "
  long_msg+="$num_paths/$num_expected:"
  long_msg+=$(echo "${codes_unique_paths[$indx]}" | sed 's/;/\n  - /g')

  # missing
  if [ "$num_paths" -lt "$num_expected" ]; then
    if [[ "$loudness" != "0" ]]; then
      missing+=("$long_msg")
    else
      missing+=("$short_msg")
    fi

  # too_many
  elif [ "$num_paths" -gt "$num_expected" ]; then
    if [[ "$loudness" != "0" ]]; then
      too_many+=("$long_msg")
    else
      too_many+=("$short_msg")
    fi
  fi

  let indx++
done


if [[ "$loudness" != "0" ]]; then
  echo ""
  echo "Missing count: ${#missing[@]}"
  echo "Too many count: ${#too_many[@]}"
fi

# === Results ===

printf "\n=== Missing instances (actual/expected) ===\n"
if [[ "${#missing[@]}" > 0  ]]; then
  printf '%s\n' "${missing[@]}"
  ((exit_code+=2))
else
  printf "None"
fi

printf "\n\n=== Too many instances (actual/expected) ===\n"
if [[ "${#too_many[@]}" > 0  ]]; then
  printf '%s\n' "${too_many[@]}"
  ((exit_code+=20))
else
  printf "None"
fi

if test $exit_code -eq 0; then
  printf "\n\n🌈 Passed! The codes for logs are as they should be."
  printf "\n\n💡 Highest log code: $highest_code\n"
else
  printf "\n\n🤕 ERROR: "
  if [[ "$exit_code" == "2" ]]; then
    printf "Missing codes"
  elif [[ "$exit_code" == "20" ]]; then
    printf "Duplicate codes"
  elif [[ "$exit_code" == "22" ]]; then
    printf "Both missing and duplicate codes"
  fi
  echo ""
  echo "Exit code: $exit_code"
fi


exit $exit_code
