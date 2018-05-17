import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

// methods
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
});
