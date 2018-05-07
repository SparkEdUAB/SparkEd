/* eslint no-param-reassign: 'off' */
import { Meteor } from 'meteor/meteor';
import { _Statistics } from '../../api/statistics/statistics';

const db = { statistics: _Statistics };

Meteor.methods({
  DataToCSV(collection) {
    check(collection, Array);
    //  var collection = collection.find(query).fetch();
    const heading = true; // Optional, defaults to true
    const delimiter = ','; // Optional, defaults to ",";
    return exportcsv.exportToCSV(collection, heading, delimiter);
  },
});

Meteor.methods({
  getCSVData(collection, query, mUser) {
    check(collection, String);
    check(query, Object);
    check(mUser, Object);
    const data = db[collection].find(query).fetch();

    if (data.length === 0) {
      return false;
    }

    data.forEach((v, k, arr) => {
      v.name = `${mUser.profile.name}`;
      v.email = mUser.emails[0].address;
      v.gender = mUser.profile.gender;
    });

    const heading = true; // Optional, defaults to true
    const delimiter = ';'; // Optional, defaults to ",";
    return exportcsv.exportToCSV(data, heading, delimiter);
  },
});
