import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { _Courses } from '../courses/courses';
import { _Units } from '../units/units';
import { _Topics } from '../topics/topics';
import { Resources, References } from '../resources/resources';

// check internet connection
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
});
