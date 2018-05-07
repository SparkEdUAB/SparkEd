import { Meteor } from 'meteor/meteor';
import { _Feedback } from '../feedback';

Meteor.publish('feedbacks', () => _Feedback.find({}));
