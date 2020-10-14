#!/bin/bash

# If folder doesn't exist, make folder
mkdir output

#repo=$1

cat > output/practice_file.txt << ENDOFFILE
Practicing practice
<< ENDOFFILE

#echo "::save-state name=processID::12345
#sed -i -e "s/\(address=\).*/\1$1/" \
#-e "s/\(port=\).*/\1$2/" \
#-e "s/\(username=\).*/\1$3/" xyz.cfg

#pandoc -s main.md -o output/main.html
#pandoc main.md -o output/main_bare.html
#pandoc -s main.md -o output/main.pdf
#pandoc -s main.md -o output/main.epub
#pandoc -s main.md -o output/main.odt
#pandoc -s main.md -o output/main.docx
#
#cp index.html output/
#cp README.output.md output/
