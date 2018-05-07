import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _School = new Mongo.Collection('school', { idGeneration: 'STRING' });

_School.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const schoolSchema = new SimpleSchema({
  _id: String,
  name: String,
  code: String,
  createdAt: Date,
  createdBy: String,
});

_School.attachSchema(schoolSchema);
