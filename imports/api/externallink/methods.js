import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { _ExternalLink } from './externallink';

Meteor.methods({
  'externallink.add': function addExternalLink(id, externallink, url) {
    check(id, String);
    check(externallink, String);
    check(url, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _ExternalLink.insert({
        _id: id,
        name: externallink,
        url,
        createdAt: new Date(),
        createdBy: this.userId,
      });
      // You can also trigger if something wrong happens
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  // eslint-disable-next-line
  'externallink.edit'(id, externallink, url) {
    check(id, String);
    check(externallink, String);
    check(url, String);

    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _ExternalLink.update(
        { _id: id },
        {
          $set: {
            name: externallink,
            url,
          },
        },
      );
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  // eslint-disable-next-line
  'externallink.remove'(id) {
    check(id, String);

    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _ExternalLink.remove(id);
    } else {
      throw new Meteor.Error(
        'no-rights',
        'You are not allowed to remove the selected external Link',
      );
    }
  },
});
