# SparkEd

[![Build Status](https://travis-ci.com/SparkEdUAB/SparkEd.svg?branch=master)](https://travis-ci.com/SparkEdUAB/SparkEd)

> Software for organizing and presenting educational and training content for delivery on most platforms.

To get started check out [our wiki](https://github.com/SparkEdUAB/SparkEd/wiki)

# For Contributors


 > Read the Code of Conduct [here](https://github.com/SparkEdUAB/SparkEd/blob/master/CODE_OF_CONDUCT.md)

The project uses the following stack 

- **Meteor** as the overall framework
- **React** as the User Interface library
- **eslint** to lint files
- **Jest** for testing

### Development

if you don't have meteor run the script below

`curl https://install.meteor.com/ | sh`

Clone the repo

`git clone https://github.com/SparkEdUAB/SparkEd.git`  
`cd SparkEd`

Install dependencies

`meteor npm install` or `meteor yarn`

Run the application

`meteor`

### Testing

`npm run test` or `yarn run test`

### linting

`npm run lint` or `yarn run lint`  

Before you make commit, make sure that the linting are passing, check with the eslintrc.yml to check the rules. 



## Sync

 - References
 - Resources
The above are all stored in MongoDB GridFS that means there is no need to access the filesystem to get images or videos, mongodb chunks them down.
⇒ The move was to facilitate the easy of moving files across servers.
⇒ Having One database for files and Data.
⇒ Easy Syncing

We have 2 scripts, 
> one exports the specified database collection from the main server, it will be checking every 24 hours.
> The other scripts downloads the exported database collection from the main server, and merges the local server with new data. 

Example of the script (exports chunks)
```
colls=( fs.chunks fs.files Resources References)
if [ -d  "dump" ] ;  then
	echo "Directory exist and will be removed"
	sleep 1
	echo "Removing the directory"
	sleep 2
	rm -rf dump dump.tar.gz 
fi
for  coll  in  ${colls[@]}  
	do
	echo  $coll
	# for the remote main server
	mongodump -h localhost:27017 -d sparked -c $coll  
done

echo "compressing the dumped directory "

tar cvzf /var/www/sparked/bundle/public/dump.tar.gz dump/ 
# bundle and send to the public to be downloadable (main server)

```

