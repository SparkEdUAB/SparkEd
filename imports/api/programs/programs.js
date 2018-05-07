import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _Programs = new Mongo.Collection('program', { idGeneration: 'STRING' });

_Programs.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const details = new SimpleSchema({
  schoolId: String,
  duration: String,
});

const programSchema = new SimpleSchema({
  name: String,
  code: String,
  details,
  createdAt: Date,
  createdBy: String,
});

_Programs.attachSchema(programSchema);
