import { Meteor } from 'meteor/meteor';

Meteor.publish('all.users', function allUsers() {
  if (!this.userId && !Roles.userIsInRole(this.userId, ['admin'])) {
    return this.ready();
  }
  return Meteor.users.find({});
});

Meteor.publish(null, () => Meteor.roles.find({}));

