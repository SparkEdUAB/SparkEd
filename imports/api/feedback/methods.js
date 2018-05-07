import { Meteor } from 'meteor/meteor';
import { _Feedback } from './feedback';

Meteor.methods({
  'feedback.insert': (title, feedback, link, name) => {
    check(title, String);
    check(feedback, String);
    check(link, String);
    check(name, String);

    _Feedback.insert({
      title,
      feedback,
      link,
      createdAt: new Date(),
      createdBy: name,
    });
  },
});
