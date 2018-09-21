/* eslint-disable */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _Units } from './units';
import { _Topics } from '../topics/topics';

Meteor.methods({
  'unit.insert'(id, name, topics, unitDesc, details) {
    check(id, String);
    check(name, String);
    check(topics, Match.OneOf(Number, null, undefined));
    check(unitDesc, String);
    check(details, Object);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _Units.insert({
        _id: id,
        name,
        topics,
        unitDesc,
        details,
        sync: {},
        createdAt: new Date(),
        createdBy: this.userId,
      });
      //  You can also trigger if something wrong happens
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },

  'unit.update'(id, name, desc) {
    check(id, String);
    check(name, String);
    check(desc, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _Units.update({ _id: id }, { $set: { name, unitDesc: desc } });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  'unit.remove'(id) {
    check(id, String);
    const topics = _Topics.find({ unitId: id }).fetch();
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager']) && !topics.length) {
      _Units.remove(id);
    } else if (topics.length >= 1) {
      throw new Meteor.Error('sorry', 'The selected course unit has topics that depend on it');
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
});
