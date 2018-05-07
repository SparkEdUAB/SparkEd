import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Titles = new Mongo.Collection('title');

Titles.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

const titleSchema = new SimpleSchema({
  title: String,
  sub_title: {
    type: String,
    optional: true,
  },
  editedAt: Date,
});
Titles.attachSchema(titleSchema);
