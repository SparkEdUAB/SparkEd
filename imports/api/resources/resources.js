import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { FilesCollection } from 'meteor/ostrio:files';

export const _Egranary = new Mongo.Collection('egranary', { idGeneration: 'STRING' }); // void kept for the sync

export const Resources = new FilesCollection({
  collectionName: 'Resources',
  storagePath: `${process.env.PWD}/public/uploads/resources/`,
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 5Gb, and only in png/jpg/jpeg formats
    if (
      file.size <= 5368709120 &&
      /png|jpg|jpeg|mp4|pdf|mp3|pptx|ppt|webm|/i.test(file.extension)
    ) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
});
if (Meteor.isServer) {
  Resources.allowClient();
}

export const References = new FilesCollection({
  collectionName: 'References',
  storagePath: `${process.env.PWD}/public/uploads/resources/`,
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 5Gb, and only in png/jpg/jpeg formats
    if (
      file.size <= 5368709120 &&
      /png|jpg|jpeg|mp4|pdf|mp3|pptx|ppt|webm|/i.test(file.extension)
    ) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
});

const Schema = {};

Schema.File = new SimpleSchema({
  name: String,
  path: String,
  size: SimpleSchema.Integer,
  type: String,
  subDirectory: {
    type: String,
    optional: true,
  },
  baseUrl: String,
  url: String,
  error: {
    type: String,
    optional: true,
  },
});

Schema.resourceSchema = new SimpleSchema({
  topicId: {
    type: String,
    optional: true,
  },
  programId: {
    type: String,
    required: false,
    optional: true,
  },
  courseId: {
    type: String,
    optional: true,
  },
  name: String,
  extra: Boolean,
  file: Schema.File,
  createdBy: String,
});

Schema.fileSchema = new SimpleSchema({
  resourceId: String,
  topicId: String,
  resourceName: String,
  resourceType: String,
  extra: Boolean,
  createdBy: String,
});
