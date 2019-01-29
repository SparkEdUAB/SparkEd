import { Meteor } from 'meteor/meteor';
import { _Settings } from '../../api/settings/settings';

/*
  The file contains the initial database of the Institution and the users
*/

// eslint-disable-next-line func-names
Meteor.startup(() => {
  // initialize the main color
  if (!_Settings.find().count()) {
    _Settings.insert({
      main: '#006b76',
      mainDark: '#0c0c0c',
    });
  }
});
