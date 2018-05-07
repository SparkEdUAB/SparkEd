import { Meteor } from 'meteor/meteor';
import { _Bookmark } from '../bookmarks';
import { isAuthRequired } from '../../config/config';

Meteor.publish('bookmarks', function getBookmarks() {
  if (!isAuthRequired()) {
    this.ready();
  }
  return _Bookmark.find({});
});
