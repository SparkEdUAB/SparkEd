import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _Courses = new Mongo.Collection('course');

_Courses.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const Schema = {};

Schema.details = new SimpleSchema({
  schoolId: {
    type: String,
    optional: true,
  },
  programId: {
    type: String,
    optional: true,
  },
  language: String,
});

Schema.Course = new SimpleSchema({
  name: String,
  code: String,
  details: Schema.details,
  createdAt: Date,
  createdBy: String,
});

_Courses.attachSchema(Schema.Course);
