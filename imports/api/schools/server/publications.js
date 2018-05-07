import { Meteor } from 'meteor/meteor';
import { _School } from '../school';
import { isAuthRequired } from '../../config/config';

Meteor.publish('schools', function getSchools() {
  if (!isAuthRequired() && !Roles.userIsInRole(this.userId, ['admin'])) {
    return this.ready();
  }
  return _School.find({});
});
