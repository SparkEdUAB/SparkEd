import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _Notifications } from './notifications';
import { Roles } from 'meteor/alanning:roles'; // eslint-disable-line

Meteor.methods({
  insertNotification(title, category, unitId = '', topicId = '', fileId = '') {
    check(unitId, String);
    check(topicId, String);
    check(fileId, String);
    check(title, String);
    check(category, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      const testUsers = Meteor.users.find();
      // eslint-disable-next-line
      testUsers.map(usr => {
        const _id = new Meteor.Collection.ObjectID().valueOf();
        const userId = usr._id;
        // insert in Notifications
        _Notifications.insert({
          _id,
          userId,
          unitId,
          topicId,
          fileId,
          title,
          category,
          createdAt: new Date(),
          read: false,
        });
      });
    } else {
      throw new Meteor.Error('oops', 'There was a problem updating Notifications');
    }
  },
  markRead(id, bool) {
    check(id, String);
    check(bool, Boolean);
    _Notifications.update(
      {
        _id: id,
        userId: this.userId,
      },
      {
        $set: {
          read: bool,
        },
      },
    );
  },
  // remove notifications that belong to the user and have been read
  dropUserNotifications() {
    return _Notifications.remove({ read: true, userId: this.userId });
  },

  // remove notifications that belong to the user
  dropAllUserNotifications() {
    return _Notifications.remove({ userId: this.userId });
  },

  // remove notifications older than 30days for all users
  dropNotifications() {
    const date = new Date();
    const daysToDeletion = 30; // 'Delete after 30days'
    const deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));
    return _Notifications.remove({ createdAt: { $lte: deletionDate } });
  },
});
