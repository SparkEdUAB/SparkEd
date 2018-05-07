import { Meteor } from 'meteor/meteor';
import { Institution } from '../institution';
import { Slides } from '../slides';
import { _Settings } from '../settings';
import { Titles } from '../titles';

Meteor.publish(null, () => _Settings.find({}));

Meteor.publish('titles', () => Titles.find({}));

Meteor.publish('slides', () => Slides.find().cursor);
Meteor.publish('logo', () => Institution.find().cursor);
