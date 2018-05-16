import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { HTTP } from 'meteor/http';
import { Resources } from './resources';
import { Fiber } from 'fibers';
// cons Fiber = require('fibers');


const url = 'http://10.1.0.72:3000/';

Picker.route('/resources', (params, req, res, next) => {
  const resources = Resources.find({}).fetch();
  res.end(JSON.stringify(resources, null, 2));
});

Picker.route('/resources_count', (params, req, res, next) => {
  const resourcess = Resources.find({}).fetch();
  res.end(JSON.stringify(resourcess.length, null, 2));
})

