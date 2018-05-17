import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

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
