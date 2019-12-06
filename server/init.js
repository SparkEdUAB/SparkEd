/* eslint no-console: 'off' */
import { Meteor } from 'meteor/meteor';
import fs from 'fs-extra';

Meteor.startup(() => {
  const currentPath = `${process.env.PWD}/public/sparked.png`;
  const newPath = `${process.env.PWD}/public/uploads/sparked.png`;
  try {
    if (fs.statSync(currentPath)) {
      fs.copy(currentPath, newPath)
        .then(() => console.log(''))
        .catch(err => console.error(err));
    } else {
      console.log('no such file exists!');
    }
  } catch (err) {
    console.error(err);
  }
});
