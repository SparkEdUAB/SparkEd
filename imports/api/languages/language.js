import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';

export const Language = new Mongo.Collection('language');

const Schema = {};

Schema.language = new SimpleSchema({
  language: String,
});

Language.attachSchema(Schema.language);

// export const updateLanguage = new ValidatedMethod({
//   name: 'language.update',
//   validate: null,
//   run({ id, language }) {
//     return Language.update({ _id: '345345730' }, { $set: { language } }, { upsert: true });
//   },
// });
