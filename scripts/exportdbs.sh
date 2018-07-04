#!/bin/bash

# Array of collections to be exported
colls=( fs.chunks fs.files )

if [ -d "dump" ] ; then
  # Control will enter here if $DIRECTORY doesn't exist.
  echo "Directory exist and will be removed"
  sleep 1
  echo "Removing the directory"
  sleep 2
  rm -rf dump
fi

for c in ${colls[@]} # gets all items in the array and applies to it like a normal loop
do
  echo $c
  mongodump -h 127.0.0.1:4001 -d meteor -c $c
  # mongodump -h localhost:27017 -d sparked -c $c # for the remote main server
done
