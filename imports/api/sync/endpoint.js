import { Meteor } from 'meteor/meteor';
import { Restivus } from 'meteor/mrest:restivus';
import { Resources } from '../resources/resources';
import { References } from '../resources/resources';
import { _Courses } from '../courses/courses';
import { _SearchData } from '../search/search';
import { _Statistics } from '../statistics/statistics';
import { Titles } from '../settings/titles';
import { _Topics } from '../topics/topics';
import { _Units } from '../units/units';
import { centers } from '../../../centers';

const Api = new Restivus({
  useDefaultAuth: true,
  prettyJson: true,
});

// GET endpoint for the references
Api.addCollection(References, {
  excludedEndpoints: ['put', 'post', 'delete'],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    get: {
      authRequired: true,
    },
  },
});
// GET endpoint for search
Api.addCollection(_SearchData, {
  excludedEndpoints: ['put', 'post', 'delete'],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    get: {
      authRequired: true,
    },
  },
});

// GET endpoint for statistics

Api.addCollection(_Statistics, {
  excludedEndpoints: ['put', 'post', 'delete'],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    get: {
      authRequired: true,
    },
  },
});

// GET endpoint for titles
Api.addCollection(Titles, {
  excludedEndpoints: ['put', 'post', 'delete'],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    get: {
      authRequired: true,
    },
  },
});

// GET endpoint for Topics
Api.addCollection(_Topics, {
  excludedEndpoints: ['put', 'post', 'delete'],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    get: {
      authRequired: true,
    },
  },
});
// GET endpoint for Topics
Api.addCollection(_Units, {
  excludedEndpoints: ['put', 'post', 'delete'],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    get: {
      authRequired: true,
    },
  },
});
// GET endpoint for COurses
Api.addCollection(_Courses, {
  excludedEndpoints: ['put', 'post', 'delete'],
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
  excludedEndpoints: ['put', 'post'],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    get: {
      authRequired: true,
    },
  },
});

Api.addRoute(
  'resources',
  { authRequired: true },
  {
    get: {
      action: function() {
        const resources = Resources.find({}).fetch();
        if (resources) {
          return { status: 'success', data: resources };
        }
        return {
          statusCode: 400,
          body: { status: 'fail', message: 'get me thsi' },
        };
      },
    },
  },
);

Api.addRoute(
  'references',
  { authRequired: true },
  {
    get: {
      action: function() {
        // var article = Articles.findOne(this.urlParams.id);
        const references = References.find({}).fetch();
        if (references) {
          return { status: 'success', data: references };
        }
        return {
          statusCode: 400,
          body: { status: 'fail', message: "Error happened, I couldn't fetch the data" },
        };
      },
    },
  },
);

Api.addRoute(
  'centers',
  { authRequired: false },
  {
    get: {
      action: function() {
        const { query } = this.queryParams;
        if (centers) {
          return { status: 'success', data: centers, count: centers.length };
        }
        return {
          statusCode: 400,
          body: { status: 'fail', message: "Error happened, I couldn't fetch the data" },
        };
      },
    },
  },
);
