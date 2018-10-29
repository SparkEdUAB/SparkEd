import { Mongo, MongoInternals } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';
import { FilesCollection } from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
// import {  } from 'meteor/mongo';
import fs from 'fs'; // eslint-disable-line

let gfs;
if (Meteor.isServer) {
  gfs = Grid(MongoInternals.defaultRemoteCollectionDriver().mongo.db, MongoInternals.NpmModule);
}

export const _Egranary = new Mongo.Collection('egranary', { idGeneration: 'STRING' }); // void kept for the sync
const validTypes = ['png', 'jpg', 'jpeg', 'mp4', 'pdf', 'mp3', 'pptx', 'ppt', 'webm', 'ogg', 'txt'];

export const Resources = new FilesCollection({
  collectionName: 'Resources',
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 5Gb, and only in png/jpg/jpeg formats
    if (file.size >= 5368709120) {
      return 'Please upload files, with size equal or less than 5GB';
    } else if (!validTypes.includes(file.ext)) {
      return `Please upload either one of the following formats ${validTypes.join()}`;
    }
    return true;
  },
  onAfterUpload(file) {
    // Move file to GridFS
    Object.keys(file.versions).forEach(versionName => {
      const metadata = { versionName, fileId: file._id, storedAt: new Date() }; // Optional
      const writeStream = gfs.createWriteStream({ filename: file.name, metadata });

      fs.createReadStream(file.versions[versionName].path).pipe(writeStream);

      writeStream.on(
        'close',
        Meteor.bindEnvironment(uploadedFile => {
          const property = `versions.${versionName}.meta.gridFsFileId`;
          // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
          // LocalCollection.ObjectID, which GFS doesn't understand.
          this.collection.update(file._id.toString(), {
            $set: {
              [property]: uploadedFile._id.toString(),
            },
          });
          this.unlink(this.collection.findOne(file._id.toString()), versionName); // Unlink file by version from FS
        }),
      );
    });
  },
  interceptDownload(http, file, versionName) {
    const _id = (file.versions[versionName].meta || {}).gridFsFileId;
    if (_id) {
      const readStream = gfs.createReadStream({ _id });
      readStream.on('error', err => {
        throw err;
      });
      readStream.pipe(http.response);
    }
    return Boolean(_id);
  },
  onAfterRemove(images) {
    images.forEach(image => {
      Object.keys(image.versions).forEach(versionName => {
        const _id = (image.versions[versionName].meta || {}).gridFsFileId;
        if (_id) {
          gfs.remove({ _id }, err => {
            if (err) throw err;
          });
        }
      });
    });
  },
});

if (Meteor.isServer) {
  Resources.allowClient();
}

export const References = new FilesCollection({
  collectionName: 'References',
  allowClientCode: false,
  onBeforeUpload(file) {
    // Allow upload files under 5Gb, and only in listed formats
    if (file.size >= 5368709120) {
      return 'Please upload files, with size equal or less than 5GB';
    } else if (!validTypes.includes(file.ext)) {
      return `Please upload either one of the following formats ${validTypes.join()}`;
    }
    return true;
  },
  onAfterUpload(file) {
    // Move file to GridFS
    Object.keys(file.versions).forEach(versionName => {
      const metadata = { versionName, fileId: file._id, storedAt: new Date() }; // Optional
      const writeStream = gfs.createWriteStream({ filename: file.name, metadata });

      fs.createReadStream(file.versions[versionName].path).pipe(writeStream);

      writeStream.on(
        'close',
        Meteor.bindEnvironment(uploadedFile => {
          const property = `versions.${versionName}.meta.gridFsFileId`;

          this.collection.update(file._id.toString(), {
            $set: {
              [property]: uploadedFile._id.toString(),
            },
          });
          this.unlink(this.collection.findOne(file._id.toString()), versionName); // Unlink file by version from FS
        }),
      );
    });
  },
  interceptDownload(http, file, versionName) {
    const _id = (file.versions[versionName].meta || {}).gridFsFileId;
    if (_id) {
      const readStream = gfs.createReadStream({ _id });
      readStream.on('error', err => {
        throw err;
      });
      readStream.pipe(http.response);
    }
    return Boolean(_id);
  },
  onAfterRemove(files) {
    files.forEach(file => {
      Object.keys(file.versions).forEach(versionName => {
        const _id = (file.versions[versionName].meta || {}).gridFsFileId;
        if (_id) {
          // eslint-disable-line
          gfs.remove({ _id }, err => {
            if (err) throw err;
          });
        }
      });
    });
  },
});
