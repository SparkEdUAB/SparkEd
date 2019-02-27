
### Contribution

We appreciate you taking time to contribute to our project.

Fork this repo using the button in the right corner of this page.  

Clone your forked repo

`git remote add upstream https://github.com/SparkEdUAB/SparkEd`

Before pushing anything to your fork, always

Set up the remote version

`git remote add upstream https://github.com/OlivierJM/learn-js` 

verify that you have added and you have 2 remotes

`git remote -v`

- **origin** should point to your fork
- **upstream** should point to this repo

To Keep your fork up to date, do the following and make sure you do it everytime you want to push      

`git pull upstream master` 

After making changes on a specific branch, push your changes  
Always remember to create a specific branch that describes the issue you are working, and create a pull-request against the master of this repo.

`git push origin your_branch_name` 

Then create a Pull Request from here, we will take a look at it and merge it as soon as we can. 


> Make sure your commit messages should be clear not vague e.g "Changes and Updates made"  
> Work from a branch other than master whenever possible and branch name should be clear  
> Write clean and transparent code which is easy to maintain  
> When making PRs, give clear descriptions of the changes you made.

### Testing

`npm run test` or `yarn run test`

### linting

`npm run lint` or `yarn run lint`

Before you make commit, make sure that the linting are passing, check with the eslintrc.yml to check the rules.
