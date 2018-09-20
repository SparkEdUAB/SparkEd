import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { _Courses } from './courses';
import { _Units } from '../units/units';

Meteor.methods({
  'course.add': function courseAdd(id, course, courseCode, details) {
    check(id, String);
    check(course, String);
    check(courseCode, String);
    check(details, Object);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _Courses.insert({
        _id: id,
        name: course,
        code: courseCode,
        details: details,
        createdAt: new Date(),
        createdBy: this.userId,
      });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to make changes');
    }
  },
  'course.edit'(id, course, courseCode, year, ownerId) {
    check(id, String);
    check(course, String);
    check(courseCode, String);
    check(year, String);
    check(ownerId, String);

    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _Courses.update(
        {
          _id: id,
        },
        {
          $set: {
            name: course,
            code: courseCode,
            'details.year': year,
          },
        },
      );
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  'course.remove'(id) {
    check(id, String);

    const units = _Units
      .find({
        'details.courseId': id,
      })
      .fetch();
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      if (units.length >= 1) {
        throw new Meteor.Error('sorry', 'The selected course has units that depend on it');
      } else if (units.length === 0) {
        _Courses.remove(id);
      } else {
        throw new Meteor.Error('no-rights', 'You are not allowed to remove the selected course');
      }
    }
  },
  'courses.count'() {
    _Courses.find().count();
  },
});
