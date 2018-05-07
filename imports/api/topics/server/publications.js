import { Meteor } from 'meteor/meteor';
import { _Topics } from '../topics';
import { isAuthRequired } from '../../config/config';

Meteor.publish('topics', () => {
  if (!isAuthRequired()) {
    this.ready();
  }
  return _Topics.find({});
});
