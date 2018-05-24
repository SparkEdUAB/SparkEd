import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import * as Config from '../../../config.json';

export const Conf = new Mongo.Collection('config', { idGeneration: 'STRING' });

const { isUserAuth } = Config;

export function isAuthRequired() {
  return isUserAuth ? !!Meteor.user() : true;
}
