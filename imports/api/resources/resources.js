import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { FilesCollection } from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
import { MongoInternals } from 'meteor/mongo';
import fs from 'fs';

let gfs;
if (Meteor.isServer) {
  gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
}

export const _Egranary = new Mongo.Collection('egranary', { idGeneration: 'STRING' }); // void kept for the sync

export const Resources = new FilesCollection({
  collectionName: 'Resources',
  // storagePath: `${process.env.PWD}/public/uploads/resources/`,
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
  onAfterUpload(file){
         // Move file to GridFS
    Object.keys(file.versions).forEach(versionName => {
      const metadata = { versionName, fileId: file._id, storedAt: new Date() }; // Optional
      const writeStream = gfs.createWriteStream({ filename: file.name, metadata });

      fs.createReadStream(file.versions[versionName].path).pipe(writeStream);
      
      writeStream.on('close', Meteor.bindEnvironment(uploadedFile => {
        const property = `versions.${versionName}.meta.gridFsFileId`;
        // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
        // LocalCollection.ObjectID, which GFS doesn't understand.
        this.collection.update(file._id.toString(), {
            $set: {
                [property]: uploadedFile._id.toString()
            }
        });
        this.unlink(this.collection.findOne(file._id.toString()), versionName); // Unlink file by version from FS
    }));
});
  },
  interceptDownload(http, file, versionName) {
    const _id = (file.versions[versionName].meta || {}).gridFsFileId;
    if (_id) {
      const readStream = gfs.createReadStream({ _id });
      readStream.on('error', err => { throw err; });
      readStream.pipe(http.response);
    }
    return Boolean(_id); 
  },
  onAfterRemove(images) {
    images.forEach(image => {
      Object.keys(image.versions).forEach(versionName => {
        const _id = (image.versions[versionName].meta || {}).gridFsFileId;
        if (_id) gfs.remove({ _id }, err => { if (err) throw err; });
      });
    });
  }
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
