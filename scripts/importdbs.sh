#!/bin/bash


# This script is for local server
# Run the Script from the root directory

collections=( fs.chunks fs.files Resources References) # Array of collections to be restored
server_address="13.232.61.192" # current server address should be passed as an argument

# get the dum from the main server
curl -O http://$server_address/dump.tar.gz

sleep 5

# Decompress the downloaded file

tar -xvzf dump.tar.gz  

if [ -d "dump" ] ; then

  # Control will enter here if $DIRECTORY doesn't exist.
  echo "Great, the Directory exist "
  sleep 1
  echo "Restoring the files"
  for coll in ${collections[@]} # gets all items in the array and applies to it like a normal loop
    do
    echo $coll
    # mongorestore -h localhost:27017 -d sparked -c $coll ˜
    # mongorestore -h 127.0.0.1:4001 -d meteor -c $coll dump/sparked/$coll.bson
    mongorestore -h localhost:27017 -d sparked -c $coll dump/sparked/$coll.bson # for the remote main server
    done
 else 
sleep 2
 echo "The folder does not exist, Try and export again."   
fi

echo "Congratulations you have restored the files"
# mongorestore --host 13.232.61.192 --port 37017 --username olivier --password "manoli" /opt/backup/mongodump-2011-10-24
