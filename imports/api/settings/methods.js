import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _Settings } from './settings';
import { Slides } from './slides';
import { Institution } from './institution';
import { Titles } from './titles';

Meteor.methods({
  addSliding(id, sku, file) {
    check(id, String);
    check(sku, String);
    check(file, Object);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Slides.insert({
        name: sku,
        file,
        createdAt: new Date(),
        CreatedBy: this.userId,
      });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },

  editSlides(slideId, slideName) {
    check(slideId, String);
    check(slideName, String);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Slides.update({ _id: slideId }, { $set: { name: slideName } });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },

  removeSlides(id) {
    check(id, String);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Slides.remove(id);
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },

  updateLogo(instId, name, tagline, logo, file) {
    check(instId, String);
    check(name, String);
    check(tagline, String);
    check(logo, String);
    check(file, Object);

    Institution.update(
      { _id: instId },
      {
        $set: {
          name,
          tagline,
          logo,
          file,
        },
      },
    );
  },
  // eslint-disable-next-line
  'insert.title'(title, sub_title) {
    check(title, String);
    check(sub_title, String);
    const today = new Date();
    Titles.insert({
      title,
      sub_title,
      editedAt: today,
    });
  },
  // eslint-disable-next-line
  'update.title'(id, title, sub) {
    check(id, String);
    check(title, String);
    check(sub, String);
    Titles.update(
      { _id: id },
      {
        $set: { title, sub_title: sub, editedAt: new Date() },
      },
    );
  },
  updateColors(id, main, button, sidebar) {
    check(id, String);
    check(main, String);
    check(button, Match.OneOf(Object, null, undefined));
    check(sidebar, Match.OneOf(String, null, undefined));
    _Settings.update(
      { _id: id },
      {
        $set: {
          main,
          button,
          sidebar,
        },
      },
      { upsert: true },
    );
  },
  // eslint-disable-next-line
  updateSettings(id, name, tag, server, isConfigured) {
    check(id, String);
    check(name, String);
    check(tag, String);
    check(server, String);
    check(isConfigured, Boolean);
    _Settings.update(
      { _id: id },
      {
        $set: {
          name,
          tag,
          server,
          isConfigured,
        },
      },
    );
  },
  // prevent Updating when user is not logged in
  setDarkMode(isSet) {
    check(isSet, Boolean);
    if (this.userId) {
      return _Settings.update(
        {},
        {
          $set: {
            isDark: isSet,
          },
        },
        // { upsert: true },
      );
    }
    throw new Meteor.Error('Auth', 'You are not authenticated');
  },
});
