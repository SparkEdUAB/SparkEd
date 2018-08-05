import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { syncData } from './syncData';
import child_process from 'child_process';
// check internet connection

const baseUrl = 'http://13.232.61.192';
const collections = ['course', 'unit', 'topic', 'resources', 'references', 'search', 'search'];

Meteor.methods({
  checkNetwork: () => {
    try {
      const url = 'http://date.jsontest.com/';
      HTTP.call('GET', url);
      return true;
    } catch (e) {
      return false;
    }
  },
  authenticate: (email, password) => {
    check(email, String);
    check(password, String);
    return HTTP.post(`${baseUrl}/api/login/`, {
      data: {
        email,
        password,
      },
      content: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  getAllCollections: (token, userId) => {
    check(token, String);
    check(userId, String);
    collections.map(coll => {
      return HTTP.get(
        `${baseUrl}/api/${coll}/`,
        {
          headers: {
            'X-Auth-Token': token,
            'X-User-Id': userId,
          },
        },
        (error, response) => {
          if (error) {
            console.log(error.reason);
          }
          if (response && response.data) {
            const {
              data: { data },
            } = response;
            syncData.update(
              {
                type: coll,
              },
              {
                $set: {
                  data,
                  count: data.length,
                },
              },
              {
                upsert: true,
              },
              (err, res) => {
                if (err) {
                  console.log(err.reason);
                }
                console.log(res);
              },
            );
          }
        },
      );
    });
  },
  // restore the dumped files from the server
  restoreDbChunks: () => {
    child_process.execFile('bash', [`${process.env.PWD}/scripts/importdbs.sh`], (error, stdout) => {
      if (error) {
        console.log(error);
      }
      console.log(stdout);
    });
  },
});

function getData() {
  HTTP.call('GET', 'https://jsonplaceholder.typicode.com/posts', (error, result) => {
    if (!error) {
      console.log(result);
    }
  });
  console.log('Going to grab data');
}
