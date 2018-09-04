/* eslint one-var: 'off', no-console: 'off'  */

import { Meteor } from 'meteor/meteor';
import fs from 'fs-extra';
import * as config from '../config.json';

const path = `${process.env.PWD}/config.json`;

Meteor.methods({
  addConfig: (name, tag, auth, isHighSchool, server) => {
    check(name, String);
    check(tag, String);
    check(auth, Boolean);
    check(server, String);
    check(isHighSchool, Match.OneOf(Boolean, null));
    // check(set, Boolean);

    const isSet = config.isConfigured;
    let newConfig;
    if (isSet) {
      newConfig = {
        name,
        tag,
        isUserAuth: auth,
        isHighSchool: config.isHighSchool,
        isConfigured: true,
        server
      };
    } else {
      newConfig = {
        name,
        tag,
        isUserAuth: auth,
        isHighSchool,
        isConfigured: true,
        server
      };
    }

    let title, subTitle;
    check(newConfig, Object);

    fs.writeFile(
      path,
      JSON.stringify(newConfig, null, 2),
      Meteor.bindEnvironment(err => {
        if (err) {
          throw new Meteor.Error('something wrong happened', "Couldn't write to the file");
        }
        // Create a config from here
        if (isHighSchool) {
          title = 'Subject';
          subTitle = 'Unit';
        } else {
          title = 'Course';
          subTitle = 'Unit';
        }
        Meteor.call('insert.title', title, subTitle, error => {
          error ? console.err(error.reason) : console.log('Saved titles');
        });
      }),
    );
  },
});
