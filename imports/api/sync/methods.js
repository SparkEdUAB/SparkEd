import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { _Courses } from '../courses/courses';
import { _Units } from '../units/units';
import { _Topics } from '../topics/topics';
import { Resources, References } from '../resources/resources';

// check internet connection
export const syncCount = new Mongo.Collection('count', { idGeneration: 'STRING' });

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
    return HTTP.post('http://localhost:3000/api/login/', {
      data: {
        email,
        password,
      },
      content: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  // authenticated call to courses collection
  getCourses: (token, userId) => {
    check(token, String);
    check(userId, String);
    return HTTP.get('http://localhost:3000/api/course/', {
      headers: {
        'X-Auth-Token': token,
        'X-User-Id': userId,
      },
    });
  },
  // authenticated Units calls
  getUnits: (token, userId) => {
    check(token, String);
    check(userId, String);
    return HTTP.get('http://localhost:3000/api/unit/', {
      headers: {
        'X-Auth-Token': token,
        'X-User-Id': userId,
      },
    });
  },
  // authenticated Topics calls
  getTopics: (token, userId) => {
    check(token, String);
    check(userId, String);
    return HTTP.get('http://localhost:3000/api/topic/', {
      headers: {
        'X-Auth-Token': token,
        'X-User-Id': userId,
      },
    });
  },
  // authenticated getResources calls
  getResources: (token, userId) => {
    check(token, String);
    check(userId, String);
    return HTTP.get('http://localhost:3000/api/resources/', {
      headers: {
        'X-Auth-Token': token,
        'X-User-Id': userId,
      },
    });
  },
  // authenticated references calls
  getReferences: (token, userId) => {
    check(token, String);
    check(userId, String);
    return HTTP.get('http://localhost:3000/api/references/', {
      headers: {
        'X-Auth-Token': token,
        'X-User-Id': userId,
      },
    });
  },
  // Insert Courses
  insertremoteCourse: (token, userId) => {
    check(token, String);
    check(userId, String);
    let count = 0;
    HTTP.get(
      'http://localhost:3000/api/course/',
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
          syncCount.insert({}, { $set: { count: index } });
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
});
