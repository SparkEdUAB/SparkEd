import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _Topics } from '../topics/topics';
import { Resources } from '../resources/resources';

Meteor.methods({
  // eslint-disable-next-line
  "topic.insert"(id, unitId, name, unit) {
    check(id, String);
    check(unitId, String);
    check(unit, String);
    check(name, String);
    // check, Object);
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
      throw new Meteor.Error('oops', 'You are not allowed to make changes');
    }
  },
  // eslint-disable-next-line
  "topic.update"(id, topic) {
    check(id, String);
    check(topic, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _Topics.update(
        {
          _id: id,
        },
        {
          $set: {
            name: topic,
          },
        },
      );
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  // eslint-disable-next-line
  "topic.remove"(id) {
    check(id, String);
    const resources = Resources.find({ 'meta.topicId': id }).fetch();
    if (Roles.userIsInRole(this.userId, ['admin']) && !resources.length) {
      _Topics.remove(id);
    } else if (resources.length) {
      throw new Meteor.Error(
        'sorry',
        'The selected topic has resources that depend on it',
      );
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  // eslint-disable-next-line
  "singletopic.insert": function(_id, unitId, name, unit) {
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
      });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
});
