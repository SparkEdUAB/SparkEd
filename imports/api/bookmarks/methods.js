import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _Bookmark } from './bookmarks';
// there should be added a better way of inserting a bookmark not updating the non-existing one

Meteor.methods({
  updateBookmark(bookmark, title, description, url, color, path) {
    // TODO: construct the whole input as an object to have it checked once
    check(bookmark, Match.OneOf(undefined, null, String));
    check(title, String);
    check(description, String);
    check(url, String);
    check(color, String);
    check(path, String);

    _Bookmark.update(
      { _id: bookmark },
      {
        $set: {
          user: this.userId,
          title,
          description,
          url,
          color,
          path,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
  },
  removeBookmark(id) {
    check(id, String);
    _Bookmark.remove({ _id: id, user: this.userId });
  },
});
