#!/bin/bash

# Identify missing and duplicate message code issues

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
lines=$(grep -roh --exclude-dir="check_codes.sh" --exclude-dir="node_modules" --exclude-dir="alkiln-*" --exclude-dir="_alkiln*" "ALK\d\d\d\d" "$directory")
cleaned=$(grep -v '0000' <(echo "$lines"))
sorted=$(echo "$cleaned" | sort -n)
leading_zeros=$(echo "$sorted" | sed 's/^ALK//')


echo "=== Missing codes ==="

# More understandable version that doesn't yet come out with a final variable
# Keeping it here for discussion
# nums=$(echo "$sorted" | sed 's/^ALK0*//')

# prev_number=0
# echo "$nums" | while read -r current_number; do

#   diff=$((current_number - prev_number))
#   # If the difference is more than 1, print the missing
#   # numbers until we catch up with the current number
#   if [ $diff -gt 1 ]; then
#     echo "Start listing missing numbers"
#     for ((i=prev_number+1; i<current_number; i++)); do
#       printf -v missing_number "ALK%04d" $i
#       echo $missing_number
#       # echo $i
#     done
#     echo "End listing missing numbers"
#   fi

#   prev_number=$current_number

# done

# Version that is opaque, but generates a variable to check at the end
# Convert the list into an array
IFS=$'\n' read -rd '' -a num_array <<<"$leading_zeros"
# Find the minimum and maximum numbers in the array, considering leading zeros
min_num=$(printf "%s\n" "${num_array[@]}" | sort -n | head -n 1)
max_num=$(printf "%s\n" "${num_array[@]}" | sort -n | tail -n 1)
# Generate a sequence of numbers from min to max with leading zeros
expected_sequence=$(printf "%04d\n" $(seq $min_num $max_num))
# Compare the expected sequence with the actual numbers
missing_numbers=$(comm -23 <(printf "%s\n" $expected_sequence | sort -n) <(printf "%s\n" "$leading_zeros"))

if [ -z "$missing_numbers" ]; then
  echo "None"
else
  echo "$missing_numbers"
  ((exit_code+=2))
fi


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
ALK0027
ALK0029"

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
echo "Exit code meanings:
- code 2: missing codes
- code 20: duplicate codes
- code 22: both"

if test $exit_code -eq 0; then
  echo "🌈 Passed! The codes for logs are as they should be."
  highest=$(echo "$sorted" | tail -n 1)
  echo "The highest log code is $highest"
else
  echo "😞 Log codes are messed up. Exited with exit code $exit_code. See above for more details."
fi

exit $exit_code
