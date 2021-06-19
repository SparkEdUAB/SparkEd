import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import * as Config from '../../../config.json';

const _Config = new Mongo.Collection('config', { idGeneration: 'STRING' });

export default _Config;

const { isUserAuth } = Config;

export function isAuthRequired() {
  return isUserAuth ? !!Meteor.user() : true;
}
