import { Meteor } from 'meteor/meteor';
import { _ExternalLink } from '../externallink';
import { isAuthRequired } from '../../config/config';

Meteor.publish('externallinks', function getExternalLinks() {
  if (!isAuthRequired()) {
    this.ready();
  }
  return _ExternalLink.find({});
});
