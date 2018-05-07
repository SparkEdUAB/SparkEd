import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _Notifications = new Mongo.Collection('notification');

_Notifications.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const notefSchema = new SimpleSchema({
  userId: String,
  unitId: {
    type: String,
    optional: true,
  },
  topicId: {
    type: String,
    optional: true,
  },
  fileId: {
    type: String,
    optional: true,
  },
  title: String,
  category: String,
  createdAt: Date,
  read: Boolean,
});

_Notifications.attachSchema(notefSchema);
