import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';

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
});
