import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { syncData } from './syncData';

// check internet connection

const baseUrl = 'http://13.232.61.192';
const collections = ['course', 'unit', 'topic', 'resources', 'references'];

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
  // Insert Courses
  insertremoteCourse: (token, userId) => {
    check(token, String);
    check(userId, String);
    let count = 0;
    HTTP.get(
      `${baseUrl}/api/course/`,
      {
        headers: {
          'X-Auth-Token': token,
          'X-User-Id': userId,
        },
      },
      (err, response) => {
        if (err) {
          console.log(err.reason);
        }
        const {
          data: { data },
        } = response;
        console.log('##########################################');
        data.forEach((course, index) => {
          count = index;
          return Meteor.call(
            'course.add',
            course._id,
            course.name,
            course.code,
            course.details,
            course.createdAt,
            course.createdBy,
          );
        });
        console.log(count);
      },
    );
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
              { type: coll },
              { $set: { data, count: data.length } },
              { upsert: true },
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
});
