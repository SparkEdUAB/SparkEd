import { Meteor } from 'meteor/meteor';
import { _Programs } from '../programs';
import { isAuthRequired } from '../../config/config';

Meteor.publish('programs', function getPrograms() {
  if (!isAuthRequired()) {
    return this.ready();
  }
  return _Programs.find({});
});
