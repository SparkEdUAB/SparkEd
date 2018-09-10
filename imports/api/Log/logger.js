import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import fs from 'fs';

Meteor.methods({
  logger: (text, type) => {
    check(text, String);
    check(type, String);
    const path = `${process.env.PWD}/${type}.log`;
    fs.appendFile(path, text, (err) => {
      if (err) throw err;
      console.log('the log was successfully written');
    });
  },
});
