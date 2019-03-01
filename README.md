# SparkEd

[![Build Status](https://travis-ci.com/SparkEdUAB/SparkEd.svg?branch=master)](https://travis-ci.com/SparkEdUAB/SparkEd)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Software for organizing and presenting educational and training content for delivery on most platforms.

To get started check out [our wiki](https://github.com/SparkEdUAB/SparkEd/wiki)  

[Check here](https://sparkeduab.github.io/sparked-manual/) for the online documentation how to use this project.

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

### For Windows Users
Download and install Git

 Use **PowerSell** in Administrator Mode
 
 > Go through the **Requirements** found  [here](https://chocolatey.org/install) Before installing **Meteor**

- After Doing The Above Now You Can install **meteor**

`choco install meteor`

 After Installing **meteor** Use Git to Clone the repo **WINDOWS USERS**
 
 

Clone the repo

`git clone https://github.com/SparkEdUAB/SparkEd.git`  
`cd SparkEd`

Install dependencies

`meteor npm install` or `meteor yarn`

Run the application

`meteor`

### Contribution

Fork this repo

Clone your forked repo

`git clone https://github.com/your-github-username/SparkEd.git`

Add this repo to your remotes as upstream.

`git remote add upstream https://github.com/SparkEdUAB/SparkEd`

Before pushing anything to your fork, always

`git pull upstream`

> Make sure your commit messages should be clear not vague e.g "Changes and Updates made"  
> Work from a branch other than master whenever possible and branch name should be clear  
> Write clean and transparent code which is easy to maintain  
> When making PRs, give clear descriptions of the changes you made.

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

### Deployment

**SparkEd** was meant to run in an offline environment but you are initially required to have internet to have it deployed, you can check [our wiki](https://github.com/SparkEdUAB/SparkEd/wiki) for more info on setting up a proper server.

The wiki mentioned above includes deployment as well, the guide I am going to show is to allow you to simply put up a stable server that in a shorter time.  
Just like in Development mentioned [here](https://github.com/SparkEdUAB/SparkEd#development) I will assume that you have a working version of SparkEd on your local machine, you can follow the instructions mentioned above in the development to get it running.

#### Requirements

- Nodejs ˆ8.10
- Latest version of Npm or Yarn
- Access to a terminal

To get started, install `mup` (meteor-up)  
**mup** allows you to deploy your meteor apps to any server and anywhere, it runs on a docker container

`npm install --global mup` or `yarn add global mup`

The above command will install `mup` globally, and it will allow you to access it anywhere in your terminal.  
next run the following command

`mup init`

The above will initialize the meteor up for your project, make sure you are inside SparkEd  
it creates a directory called `.deploy` which contains 2 files `mup.js` and `settings.json`

```bash
├── .deploy
│   └── mup.js
    └── settings.json
```

The `mup.js` file is the one you will want to pay attention to, it contains the server information you will need to update as required

```Javascript

  servers: {
    one: {
      host: '', // change this to the server address
      username: '', // username of the server
      password: '', // password for the username above
      // pem: './path/to/pem', // in case you are using an ssh key
    },
  },

   app: {
   name: 'SparkEd',  // name of the app is SparkEd
   path: '../', // Specify the location of the app, used ../ because we are in .deploy directory
   env: {
   	ROOT_URL: '', // this is server address of where you are deploying to, it can be a local IP of the server you are deploying to
   	MONGO_URL: 'mongodb://mongodb/meteor',
   	MONGO_OPLOG_URL: 'mongodb://mongodb/local',
   },
```

Double check to make sure that your details are correct, if something doesn't work, kindly create an issue to let us know  
run the following command to get the setup meteor up

`mup setup`

The above command might take a while, make sure you have a good internet and just wait for it, when it is done run the following command

`mup deploy`

The above command will deploy SparkEd on the specified server address

Make sure you read more info [here](http://meteor-up.com) on meteor-up

#### Issues

Check [here](https://github.com/SparkEdUAB/SparkEd/issues) for issues, urgent issues that need attention are pinned on top of other issues. feel free to file an issue if you are experiencing a problem or dive in the existing ones to contribute. 

