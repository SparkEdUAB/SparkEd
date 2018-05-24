import { Meteor } from 'meteor/meteor';
import { _Units } from '../units';
import { isAuthRequired } from '../../config/config';

// don't use arrow functions here because of the context
Meteor.publish('searchUnits', function getUnits(cId) {
  check(cId, Match.OneOf(String, null));
  if (!isAuthRequired()) {
    this.ready();
  }
  return _Units.find({ 'details.courseId': cId, createdBy: this.userId });
});

Meteor.publish('units', function getAllUnits() {
  if (!isAuthRequired()) {
    this.ready();
  }
  return _Units.find({}, { fiels: { name: 1, topics: 1, details: 1 } });
});

// publish unit name

Meteor.publish('isHighScool.units', function getSecUnit(id) {
  check(id, String);
  if (isAuthRequired()) {
    this.ready();
  }
  return _Units.find({ _id: id }, { fields: { name: 1 } });
});
