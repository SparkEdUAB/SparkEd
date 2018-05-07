import { Meteor } from 'meteor/meteor';
import { _Config } from '../config';

Meteor.publish('config', () => _Config.find({}));
