import { Meteor } from 'meteor/meteor';
import { _SearchData } from '../search';

Meteor.publish(null, () => _SearchData.find({}));
