import { Meteor } from 'meteor/meteor';
import _Config from '../config'; // eslint-disable-line

Meteor.publish('config', () => _Config.find({}));
