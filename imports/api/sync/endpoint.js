import { Meteor } from 'meteor/meteor';
import { Resources } from '../resources/resources';
import { References } from '../resources/resources';
import { _Courses } from '../courses/courses';
import { _Programs } from '../programs/programs';
import { _Schools } from '../schools/school';
import { _SearchData } from '../search/search';
import { _Statistics } from '../statistics/statistics';
import { Titles } from '../settings/titles';
import { _Topics } from '../topics/topics';
import { _Units } from '../units/units';

Picker.route('/coll', (params, req, res, next) => {
  const collName = params.query.name;
  switch (collName) {
    case 'users': {
      const users = Meteor.users.find({}).fetch();
      res.end(JSON.stringify(users, null, 2));
      break;
    }
    case 'courses': {
      const courses = _Courses.find({}).fetch();
      res.end(JSON.stringify(courses, null, 2));
      break;
    }
    case 'programs': {
      const programs = _Programs.find({}).fetch();
      res.end(JSON.stringify(programs, null, 2));
      break;
    }
    case 'schools': {
      const schools = _Schools.find({}).fetch();
      res.end(JSON.stringify(schools, null, 2));
      break;
    }
    case 'statistics': {
      const stats = _Statistics.find({}).fetch();
      res.end(JSON.stringify(stats, null, 2));
      break;
    }
    case 'units': {
      const units = _Units.find({}).fetch();
      res.end(JSON.stringify(units, null, 2));
      break;
    }
    case 'topics': {
      const topics = _Topics.find({}).fetch();
      res.end(JSON.stringify(topics, null, 2));
      break;
    }
    case 'statistics': {
      const stats = _Statistics.find({}).fetch();
      res.end(JSON.stringify(stats, null, 2));
      break;
    }
    case 'search': {
      const searchData = _searchData.find({}).fetch();
      res.end(JSON.stringify(searchData, null, 2));
      break;
    }
    case 'resources': {
      const resources = Resources.find({}).fetch();
      res.end(JSON.stringify(searchData, null, 2));
      break;
    }
    case 'references': {
      const references = References.find({}).fetch();
      res.end(JSON.stringify(references, null, 2));
      break;
    }

    default:
      res.end(
        `Collection named ${JSON.stringify(
          params.query.name,
          null,
          2,
        )} you specified doesn't exists`,
      );
      break;
  }
});
