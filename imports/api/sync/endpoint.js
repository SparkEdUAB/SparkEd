import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
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
import bodyParser from 'body-parser';

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Picker.route('/coll', (params, req, res, next) => {
  const collName = params.query.name;

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
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

// Global configuration
Api = new Restivus({
  useDefaultAuth: false,
  prettyJson: true,
});
// Generates: GET/POST on /api/v1/users, and GET/PUT/DELETE on /api/v1/users/:id
// for Meteor.users collection (works on any Mongo collection)
Api.addCollection(_Courses, {
  routeOptions: {
    authRequired: false,
  },
  endpoints: {
    get: {
      authRequired: false,
    },
  },
});

Api.addCollection(Meteor.users, {
  excludedEndpoints: ['get', 'put'],
  routeOptions: {
    authRequired: false,
  },
  endpoints: {
    get: {
      authRequired: false,
    },
  },
});
// Api.addCollection(Resources);
// That's it! Many more options are available if needed...

// Maps to: POST /api/v1/articles/:id
Api.addRoute(
  'name',
  { authRequired: true },
  {
    get: {
      action: function() {
        // var article = Articles.findOne(this.urlParams.id);
        const courses = _Courses.find({}).fetch();
        if (courses) {
          return { status: 'success', data: courses };
        }
        return {
          statusCode: 400,
          body: { status: 'fail', message: 'get me thsi' },
        };
      },
    },
  },
);
