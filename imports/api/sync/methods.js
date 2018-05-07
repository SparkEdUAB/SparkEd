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


// get json file sync file from host
Meteor.methods({
  getSyncFile: () => {
    try {
      const url = 'http://date.jsontest.com/'; // get file
      const file = HTTP.call('GET', url);
      return file;
    } catch (e) {
      return false;
    }
  },
});
