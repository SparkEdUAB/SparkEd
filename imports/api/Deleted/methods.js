import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';
import { _Deleted } from './deleted';

Meteor.methods({
  //  for resources
  insertDeleted: (id, col, file = null) => {
    check(id, String);
    check(col, Match.OneOf(String, null, undefined));
    check(file, Match.OneOf(Object, null, undefined));

    _Deleted.insert({
      delId: id,
      file,
      col,
      sync: {}, // this should change too
    });
  },
});
