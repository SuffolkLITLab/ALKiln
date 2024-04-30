#!/bin/bash

# Identify missing and duplicate message code issues

echo "Script executed from: ${PWD}
Dir contents:
"

for entry in "."/*; do
  echo "$entry"
done

exit_code=0

# Check if the caller sent an argument to the script
if [ $# -eq 0 ]; then
    # If there was no argument, set a default value
    directory="../.."
else
    # If there was an argument, use it
    directory="$1"
fi

# The grepped files will include the list of all the codes that have been
# removed and are no longer used.
lines=$(grep -roh --exclude="tests/log_codes/check_codes.sh" --exclude-dir="node_modules" --exclude-dir='alkiln-*' --exclude-dir='_alkiln*' 'ALK\d\d\d\d' "$directory")
#lines=$(grep -roh --exclude="tests/log_codes/check_codes.sh" --exclude-dir="node_modules" --exclude-dir="alkiln-*" --exclude-dir="_alkiln*" "ALK\d\d\d\d" "$directory")
echo "lines: $lines

"
four_zeros_codes_removed=$(grep -v '0000' <(echo "$lines"))
echo "4 zeros removed: $four_zeros_codes_removed

"
sorted=$(echo "$four_zeros_codes_removed" | sort -n)
echo "sorted: $sorted

"
# 0's in front of numbers confuses bash about the number format
just_numbers=$(echo "$sorted" | sed 's/^ALK0*//')
echo "just_numbers: $just_numbers

"


echo "=== Missing codes ==="

# # -- Version 1 --
# # More understandable version that doesn't yet come out with a final variable
# # Keeping it here for discussion
# nums=$(echo "$sorted" | sed 's/^ALK0*//')

# missing_numbers=()
# prev_number=0
# echo "$nums" | while read -r current_number; do

#   diff=$((current_number - prev_number))
#   # If the difference is more than 1, print the missing
#   # numbers until we catch up with the current number
#   if [ $diff -gt 1 ]; then
#     for ((i=prev_number+1; i<current_number; i++)); do
#       printf -v missing_number "ALK%04d" $i
#       missing_numbers+=("$missing_number")
#       echo $missing_number
#       # missing_numbers+=$(echo "%04d\n" $missing_number)
#     done
#     echo "---"
#   fi

#   prev_number=$current_number

# done

# missing_numbers_str=$(printf '%s' "${missing_numbers[@]}")
# echo "missing: $missing_numbers_str"


# -- Version 2 --
# Version that is opaque, but generates a variable to check at the end
# Convert the list into an array
IFS=$'\n' read -rd '' -a num_array <<<"$just_numbers"
# Find the minimum and maximum numbers in the array
min_num=$(printf "%s\n" "${num_array[@]}" | sort -n | head -n 1)
max_num=$(printf "%s\n" "${num_array[@]}" | sort -n | tail -n 1)

# Generate a sequence of numbers from min to max with leading zeros
# # (seq doesn't exist everywhere. Keep this till we look up installing seq to avoid loop)
# expected_sequence=$(printf "ALK%04d\n" $(seq $min_num $max_num))
expected_sequence=""
for ((i=min_num; i<=max_num; i++)); do
    # Make sure these won't look like numbers to avoid confusing bash
    expected_sequence+=$(printf "ALK%04d" $i)$'\n'
done
echo "sorted $sorted
"
echo "expected $expected_sequence
"

# Compare the expected sequence with the actual numbers
missing_numbers=$(comm -23 <(printf "%s\n" "$expected_sequence" | sort -n) <(printf "%s\n" "$sorted"))
if [ -z "$missing_numbers" ]; then
  echo "None"
else
  echo "$missing_numbers"
  ((exit_code+=2))
fi


echo ""
echo "=== Duplicate codes ==="

# We know these duplicates are ok
accepted_duplicates="ALK0002
ALK0003
ALK0006
ALK0007
ALK0008
ALK0009
ALK0010
ALK0011
ALK0012
ALK0018
ALK0019
ALK0022
ALK0023
ALK0025
ALK0026
ALK0027"
# ALK0029"

# Use a sorted list. `uniq` only detects consecutive duplicates
duplicates=$(echo "$sorted" | uniq -d)
unaccepted_duplicates=$(echo "$duplicates" | grep -v -f <(echo "$accepted_duplicates"))

if [ -z "$unaccepted_duplicates" ]; then
  echo "None"
else
  echo "$unaccepted_duplicates"
  ((exit_code+=20))
fi

# === Final messages ===
echo ""
echo "Exit code meanings:
- code 2: missing codes
- code 20: duplicate codes
- code 22: both"
echo ""

if test $exit_code -eq 0; then
  echo "🌈 Passed! The codes for logs are as they should be."
  highest=$(echo "$sorted" | tail -n 1)
  echo "The highest log code is $highest"
else
  echo "🤕 ERROR: Log codes are messed up. Exited with exit code $exit_code. See above for more details."
fi

exit $exit_code
