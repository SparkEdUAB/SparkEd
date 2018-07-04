#!/bin/bash

# Array of collections to be restored
# This script is for local server

colls=( fs.chunks fs.files )

if [ -d "dump" ] ; then

  # Control will enter here if $DIRECTORY doesn't exist.
  echo "Great, the Directory exist "
  sleep 1
  echo "Restoring the files"
  for c in ${colls[@]} # gets all items in the array and applies to it like a normal loop
    do
    echo $c
    # mongorestore -h localhost:27017 -d sparked -c $c ˜
    mongorestore -h 127.0.0.1:4001 -d meteor -c $c dump/meteor/$c.bson
    # mongodump -h localhost:27017 -d sparked -c $c # for the remote main server
    done
fi




# mongorestore --host 13.232.61.192 --port 37017 --username olivier --password "manoli" /opt/backup/mongodump-2011-10-24
