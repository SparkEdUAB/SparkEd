import { Meteor } from 'meteor/meteor';
import { _Settings } from './settings';

Meteor.methods({
  'syncSettings.update': function(id, name, val, label, placeholder, category) {
    check(name, String);
    check(val, String);
    check(placeholder, String);
    check(label, String);
    check(category, String);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        _Settings.update(
            { _id: id },
            { 
              $set: {
              name,
              val,
              placeholder,
              label,
              category,
            },
            },
          );
      } 
    //   return something wrong in case it happens
   
  },
  'settings.insert': (name, val, placeholder, label, category) => {
    check(name, String);
    check(val, String);
    check(placeholder, String);
    check(label, String);
    check(category, String);
    _Settings.insert({
      name,
      val,
      placeholder,
      label,
      category,
      createdAt: new Date(),
    });
  },
  updateSetting: (id, name, val) => {
    check(id, String);
    check(name, String);
    check(val, String);
    _Settings.update({
      _id: id,
    }, {
      $set: {
        name,
        val,
      },
    });
  },
});
