import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
  'user.insert': user => {
    check(user, {
      email: String,
      password: String,
      profile: Object,
    });
    Accounts.createUser(user);
  },
  'account.check': email => {
    check(email, String);
    const initialUser = Meteor.users.findOne();
    const userId = initialUser._id;
    const user = Accounts.findUserByEmail(email);
    if (Meteor.users.find().count() === 1) {
      Roles.addUsersToRoles(userId, 'admin');
      Meteor.users.update({ _id: userId }, { $set: { 'profile.status': 1 } });
    } else if (!user) {
      return 'Sorry email not identified';
    }
    // removed the account approval for now
    // else if ((!user.profile.status || user.profile.status === 2)) {
    //   return 'Sorry account not activated. Inform Adminstrator';
    // }
    return false;
  },
  'user.approve'(id) {
    check(id, String);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Meteor.users.update(
        {
          _id: id,
        },
        {
          $set: {
            'profile.status': 1,
          },
        },
      );
    } else {
      throw new Meteor.Error('Sorry', "You don't have permissions to remove a user");
    }
  },
  'user.suspend'(id) {
    check(id, String);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Meteor.users.update(
        {
          _id: id,
        },
        {
          $set: {
            'profile.status': 2,
          },
        },
      );
    } else {
      throw new Meteor.Error('Sorry', "You don't have permissions to remove a user");
    }
  },
  promoteUser(id, role) {
    check(id, String);
    check(role, String);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      // Make sure the admin doesn't block himself out of the platform
      // Roles.addUsersToRoles(id, role);
      if (id === this.userId) {
        throw new Meteor.Error('Oops', 'You can not change your own Role as an Admin');
      }
      Roles.setUserRoles(id, role);
    } else {
      throw new Meteor.Error('Sorry', "You don't have permissions to promote a user");
    }
  },
  removeUser(id) {
    check(id, String);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Meteor.users.remove(id);
    } else {
      throw new Meteor.Error('Sorry', "You don't have permissions to remove a user");
    }
  },
  'user.update'(id, namef) {
    check(id, String);
    check(namef, String);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Meteor.users.update({ _id: id }, { $set: { 'profile.name': namef } });
    } else {
      throw new Meteor.Error('Sorry', "You don't have permissions to remove a user");
    }
  },
  accountExist(email) {
    check(email, String);
    const user = Accounts.findUserByEmail(email);
    if (user) {
      return 'Sorry email already registered.';
    }
    return false;
  },
  // return the number of users
  'num.users'() {
    const users = Meteor.users.find().count();
    return users;
  },
});
