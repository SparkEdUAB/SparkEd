import { Meteor } from 'meteor/meteor';
import { _Deleted } from '../deleted';

Meteor.publish(null, () => _Deleted.find({}));
