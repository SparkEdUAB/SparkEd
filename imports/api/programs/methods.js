import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import { _Programs } from '../../api/programs/programs';
import { _Courses } from '../../api/courses/courses';

Meteor.methods({
  'program.insert'(name, code, details) {
    check(name, String);
    check(code, String);
    check(details, {
        schoolId: String,
        duration: String,
    });
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      _Programs.insert({
        name,
        code,
        details,
        createdAt: new Date(),
        createdBy: this.userId,
      }) // You can also trigger if something wrong happens
       } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
       }
  },
  'program.edit'(id, program, code, duration) {
    check(id, String);
    check(program, String);
    check(code, String);
    check(duration, String);
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
        _Programs.update({
          _id: id
        }, {
          $set: {
            'name': program,
            code,
            'details.duration': duration
          }
        },);
      } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
      }
  },
  'program.remove'(id) {
    check(id, String);
    const courses = _Courses.find({ 'details.programId': id }).fetch();
    if (Roles.userIsInRole(this.userId, ['admin', 'content-manager'])) {
      if (courses.length >= 1) {
        throw new Meteor.Error('sorry', 'The selected program has courses that depend on it');
      } else if (courses.length === 0) {
        _Programs.remove(id);
      } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
      }
  }
},
});
