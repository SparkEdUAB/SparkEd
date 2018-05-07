import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const _ExternalLink = new Mongo.Collection('externallinks', { idGeneration: 'STRING' });

_ExternalLink.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const externalLinkSchema = new SimpleSchema({
  name: String,
  url: String,
  createdAt: Date,
});

_ExternalLink.attachSchema(externalLinkSchema);
