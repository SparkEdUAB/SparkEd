import { Mongo } from 'meteor/mongo';

export const syncData = new Mongo.Collection('syncData', { idGeneration: 'STRING' });
