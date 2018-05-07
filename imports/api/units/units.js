import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _Units = new Mongo.Collection('unit', { idGeneration: 'STRING' });

_Units.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const Schema = {};

Schema.Details = new SimpleSchema({
  courseId: String,
  programId: {
    type: String,
    optional: true,
  },
  year: String,
});

Schema.unitSchema = new SimpleSchema({
  name: String,
  topics: {
    type: Number,
    optional: true,
  },
  unitDesc: String,
  details: Schema.Details,
  createdAt: Date,
  createdBy: String,
  sync: Object, // Sync will have to be defined when it gets property names
});

_Units.attachSchema(Schema.unitSchema);
