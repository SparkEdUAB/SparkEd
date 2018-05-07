import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _SearchData = new Mongo.Collection('search', { idGeneration: 'STRING' });

_SearchData.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const Schema = {};

Schema.ids = new SimpleSchema({
  unitId: {
    type: String,
    optional: true,
  },
  resourceId: {
    type: String,
    optional: true,
  },
  topicId: {
    type: String,
    optional: true,
  },
  courseId: {
    type: String,
    optional: true,
  },
});

Schema.searchSchema = new SimpleSchema({
  ids: Schema.ids,
  name: String,
  category: String,
  createdAt: Date,
});

_SearchData.attachSchema(Schema.searchSchema);
