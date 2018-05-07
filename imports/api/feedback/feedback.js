import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _Feedback = new Mongo.Collection('feedback', { idGeneration: 'STRING' });

// attach the schema and define the rules
const Schema = {};

Schema.feedSchema = new SimpleSchema({
  title: String,
  feedback: String,
  link: String,
  createdAt: Date,
  createdBy: String,
});

_Feedback.attachSchema(Schema.feedSchema);
