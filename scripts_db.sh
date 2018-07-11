#!/bin/bash

# export data from MongoDB
# This supposes that mongodb is installed and running on this server.
# There are only 2 collections that needs to be exported(fs.chunks and fs.files)

DB="localhost";  #sparkEd for production database name
COLL_1="fs.chunks";
COLL_2="fs.files";

echo 'exporting the chunks collection ....';

sleep 5;

mongoexport --db $DB --collection $COLL_2 --out $COLL_1.json;
# wait 5 seconds and export the fs.files chunkks 
sleep 5;

echo 'exporting the files collection' + $COLL_2 + '.json';

mongoexport --db $DB --collection $COLL_2 --out $COLL_2.json;

# Consideration for using a mongodump and restore to share contents accross.
