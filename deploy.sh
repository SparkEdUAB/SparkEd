#!/bin/bash
echo 'Preparing the server'
echo 'Installing passenger'
sudo apt-get install -y dirmngr gnupg
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
sudo apt-get install -y apt-transport-https ca-certificates

sudo sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger xenial main > /etc/apt/sources.list.d/passenger.list'
sudo apt-get update


sudo apt-get install -y passenger

# validate passenger installation 

echo 'Validate Passenger config, choose which one (1st)'
sleep 2
sudo /usr/bin/passenger-config validate-install


# build the meteor package, builds into newpackage and renames it
sleep 5 

echo 'Building meteor package ..........'
meteor build --server-only ../new_package && mv ../new_package/*.tar.gz ~/package.tar.gz

echo "creating a new and unpacking new package..."
sleep 3
sudo mkdir -p /var/www/sparked

cd /var/www/sparked

sudo tar xzf ~/package.tar.gz
echo "creating public folder..."
sleep 3

mkdir -p bundle/public
chmod 777 bundle/public

echo "preparing App for production..."
sleep 5

cd bundle/programs/server
sudo npm install --production
sudo npm prune --production

sleep 5
echo "Starting the server "
cd /var/www/sparked/bundle/
passenger stop
passenger start
