import { Meteor } from 'meteor/meteor';
import { _Notifications } from '../notifications';
import { isAuthRequired } from '../../config/config';

Meteor.publish('notifications', function publishNote() {
  if (!isAuthRequired()) {
    this.ready();
  }
  return _Notifications.find({ userId: this.userId });
});
