import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { check } from 'meteor/check'
import { _School } from './school';
import { _Programs } from '../programs/programs';
import { _ } from 'meteor/underscore';

Meteor.methods({
  'addSchool'(id, sku, skuCode) {
    check(id, String)
    check(sku, String)
    check(skuCode, String)
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      _School.insert({
        _id: id,
        name: sku,
        code: skuCode,
        createdAt: new Date(),
        createdBy: this.userId,
      });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to create A School')
    }
  },

  'editSchool'(schoolId, schoolName, scode) {
    check(schoolId, String)
    check(schoolName, String)
    check(scode, String)
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      _School.update(
        { _id: schoolId },
        { $set: { 'name': schoolName, 'code': scode } },
      )
     } else {
      throw new Meteor.Error('oops', 'You are not allowed to not changes here')
     }
  },

  // todo, check if school has dependencies;
  'removeSchool'(id) {
    check(id, Match.OneOf(String, Object));
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      var programs = _Programs.find({'details.schoolId': id}).fetch();
      if (programs.length >= 1) {
        throw new Meteor.Error('sorry', 'The selected school has programs that depend on it');
      } else if (programs.length === 0) {
        _School.remove(id);
      }   
   } 
  // else {
  //     throw new Meteor.Error('oops', 'You are not allowed to remove the School')
  //  }
  },
})
