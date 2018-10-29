import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import { _SearchData } from './search';

Meteor.methods({
  // eslint-disable-next-line
  removeSearchData(id) {
    check(id, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _SearchData.remove(id);
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  // eslint-disable-next-line
  updateSearch: function(id, name) {
    check(id, String);
    check(name, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _SearchData.update(
        { _id: id },
        {
          $set: { name, _ids: {} },
        },
      );
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  // eslint-disable-next-line
  'insert.search': function(id, ids, name, category) {
    check(id, String);
    check(ids, Object);
    check(name, String);
    check(category, String);

    _SearchData.insert({
      _id: id,
      ids,
      name,
      category,
      createdAt: new Date(),
    });
  },
});
