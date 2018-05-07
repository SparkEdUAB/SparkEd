import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _Bookmark = new Mongo.Collection('bookmarks', { idGeneration: 'STRING' });

_Bookmark.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const bookMarkSchema = new SimpleSchema({
  user: String,
  title: String,
  description: String,
  url: String,
  color: String,
  path: String,
  createdAt: Date,
});

_Bookmark.attachSchema(bookMarkSchema);
