import { Meteor } from 'meteor/meteor';
import { Resources, References } from '../resources';
import { isAuthRequired } from '../../config/config';

Meteor.publish('resourcess', function allResource() {
  if (!isAuthRequired()) {
    this.ready();
  }
  return Resources.find().cursor;
});

Meteor.publish('references', function allResource() {
  if (!isAuthRequired()) {
    this.ready();
  }
  return References.find().cursor;
});

// Meteor.publish('resourcess', () => Resources.find().cursor);
// Meteor.publish('references', () => References.find().cursor);
