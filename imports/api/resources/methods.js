import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import { Resources, References } from './resources';

Meteor.methods({
  updateResource(id, resource) {
    check(id, String);
    check(resource, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      Resources.update(
        {
          _id: id,
        },
        {
          $set: {
            name: resource,
          },
        },
      );
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  updateReference(id, reference) {
    check(id, String);
    check(reference, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      References.update(
        {
          _id: id,
        },
        {
          $set: {
            name: reference,
          },
        },
      );
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  removeResource(id) {
    check(id, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      Resources.remove(id);
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to remove the resource');
    }
  },
  removeReference(id) {
    check(id, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      References.remove(id);
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to remove the resource');
    }
  },
});
