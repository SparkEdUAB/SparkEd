import { Meteor } from 'meteor/meteor';
import { _Statistics } from '../statistics';

Meteor.publish(null, () => _Statistics.find({}));

