#!/bin/bash

# Array of collections to be exported
colls=( fs.chunks fs.files Resources References )
new_colls=(course notifications externallinks settings feedback roles search statistic title topic unit users slides)

if [ -d "dump" ] ; then
  # Control will enter here if $DIRECTORY doesn't exist.
  echo "Directory exist and will be removed"
  sleep 1
  echo "Removing the directory"
  sleep 2
  rm -rf dump dump.tar.gz # remove the dump directory and the previously decompressed dump
fi

for coll in ${new_colls[@]} # gets all items in the array and applies to it like a normal loop
do
  echo $coll
  mongodump -h 127.0.0.1:3001 -c $coll # Testing on the local server
  # mongodump -h localhost:27017 -d sparked -c $coll # for the remote main server
done


#when done it should compress the file
echo "compressing the dumped directory "

# tar cvzf /var/www/sparked/bundle/public/dump.tar.gz dump/ # bundle and send to the public to be downloadable (main server)
