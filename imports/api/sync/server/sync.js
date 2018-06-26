import { Meteor } from 'meteor/meteor';
import { syncData } from '../syncData';

Meteor.publish('syncdata', () => syncData.find({}));
