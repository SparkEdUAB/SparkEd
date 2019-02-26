#!/bin/bash

echo "Restoring the database sparked db"

# in Development the db is meteor
# in Production the db is sparked


# mode == dev
mongorestore -h localhost:3001 -d meteor dump/meteor

# tar cvzf public/dump.tar.gz dump/

# mode == prod 

# mongorestore -h localhost:27017 -d sparked dump/sparked

# tar cvzf /var/www/sparked/bundle/public/dump.tar.gz dump/