import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _Topics } from '../topics/topics';

Meteor.methods({
  'topic.insert'(id, unitId, name, unit, details) {
    check(id, String);
    check(unitId, String);
    check(unit, String);
    check(name, String);
    check(details, Object);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _Topics.insert({
        _id: id,
        unitId,
        name,
        unit,
        resources: [],
        sync: {},
        createdAt: new Date(),
        createdBy: this.userId,
      });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  'topic.update'(id, topic) {
    check(id, String);
    check(topic, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _Topics.update(
        { _id: id },
        { 
        $set:
          { name: topic } },
      );
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  'topic.remove'(id) {
    check(id, String);
    const topic = _Topics.findOne({ _id: id});
    const { resources } = topic;
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        if (resources && resources.length >= 1) {
          throw new Meteor.Error('sorry', 'The selected topic has resources that depend on it');
        } else if (!resources || resources.length === 0) {
          _Topics.remove(id);
        } else {
        throw new Meteor.Error('oops', 'You are not allowed to not make changes');
        }
    }
  },
  'singletopic.insert'(_id, unitId, name, unit) {
    check(_id, String);
    check(unitId, String);
    check(name, String);
    check(unit, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _Topics.insert({
          _id, 
          unitId, 
          name, 
          unit,
          resources: [],
          sync: {},
          createdAt: new Date(), 
          createdBy: this.userId,
        },);
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
});
