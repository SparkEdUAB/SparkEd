import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { execFile } from 'child_process';
import { syncData } from './syncData';
import * as config from '../../../config.json';
// check internet connection

const { server } = config;
const collections = [
  'course',
  'unit',
  'topic',
  'resources',
  'references',
  'search',
  'search',
];

Meteor.methods({
  authenticate: (email, password) => {
    check(email, String);
    check(password, String);
    return HTTP.post(`${server}/api/login/`, {
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
    collections.map((coll) => { // eslint-disable-line
      return HTTP.get(
        `${server}/api/${coll}/`,
        {
          headers: {
            'X-Auth-Token': token,
            'X-User-Id': userId,
          },
        },
        (error, response) => {
          if (error) {
            console.log(error.reason); // eslint-disable-line
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
                  console.log(err.reason); // eslint-disable-line
                }
                console.log(res); // eslint-disable-line
              },
            );
          }
        },
      );
    });
  },
  // restore the dumped files from the server
  restoreDbChunks: () => {
    execFile(
      `${process.env.PWD}/scripts/importdbs.sh`,
      [server],
      (error, stdout) => {
        if (error) {
          console.log(error); // eslint-disable-line
        }
        console.log(stdout); // eslint-disable-line
      },
    );
    // return response;
    // return execFileSync(`${process.env.PWD}/scripts/importdbs.sh`, [server]);
  },
});
