import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _Topics = new Mongo.Collection('topic');

_Topics.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const topicSchema = new SimpleSchema({
  unitId: String,
  name: String,
  unit: String,
  resources: Array,
  'resources.$': Object,
  sync: Object,
  createdAt: Date,
  createdBy: String,
});

_Topics.attachSchema(topicSchema);
