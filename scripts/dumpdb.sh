#!/bin/bash

echo "Dumping sparked db"

# in Development the db is meteor
# in Production the db is sparked


# mode == dev
mongodump -h localhost:3001 -d meteor 

tar cvzf public/dump.tar.gz dump/

# mode == prod 

# mongodump -h localhost:27017 -d sparked  

# tar cvzf /var/www/sparked/bundle/public/dump.tar.gz dump/