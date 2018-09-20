# SparkEd

> Software for organizing and presenting educational and training content for delivery on most platforms.

To get started check out [our wiki](https://github.com/SparkEdUAB/SparkEd/wiki)

# current 

**Sync ( Unstable )**

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
## EndPoints API

Each collection in SparkEd has an endpoint that can be used by an external application like a mobile app or any other.

`/api/course/`   
`/api/unit/`   
`/api/topic/`  
`/api/resources/`  
`/api/references/`  
`/api/statistic/`  
`/api/search/`  
 `/api/users/`  
   
### todo  
- [ ] Migrate API calls to Promises