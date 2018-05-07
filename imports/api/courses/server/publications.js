import { Meteor } from 'meteor/meteor';
import { _Courses } from '../courses';
import { isAuthRequired } from '../../config/config';

// publishes all courses;
Meteor.publish('courses', function allCourses() {
  if (!isAuthRequired()) {
    return this.ready();
  }
  return _Courses.find({});
});

// publish when school is available

Meteor.publish('school.courses', function programCourses(id) {
  check(id, String);
  if (!isAuthRequired()) {
    return this.ready();
  }
  return _Courses.find({ 'details.programId': id });
});
