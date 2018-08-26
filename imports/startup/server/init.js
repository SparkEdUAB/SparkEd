import { Meteor } from 'meteor/meteor';
import { Titles } from '../../api/settings/titles';
import { _Settings } from '../../api/settings/settings';

/*
  The file contains the initial database of the Institution and the users
*/

Meteor.startup(() => {
  if (Titles.find().count() === 0) {
    Titles.insert({
      title: 'Course',
      sub_title: 'Unit',
      editedAt: new Date(),
    });
  }

});
