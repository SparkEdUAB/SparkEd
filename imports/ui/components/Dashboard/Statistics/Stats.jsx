import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _Courses } from '../../../../api/courses/courses';
import { _Units } from '../../../../api/units/units';
import { _Topics } from '../../../../api/topics/topics';
import { Resources, References } from '../../../../api/resources/resources';

export function StatsView({ users, courses, units, topics, resources }) {
  return (
    <div className="col m9 s11">
      <StatCard count={users} type={'users'} />
      <StatCard count={courses} type={'courses'} />
      <StatCard count={units} type={'units'} />
      <StatCard count={topics} type={'topics'} />
      <StatCard count={resources} type={'resources'} />
    </div>
  );
}

function StatCard({ count, type }) {
  return (
    <div className="col s6 m4">
      <div className="card-panel teal">
        <h1 className="white-text center-align">{count}</h1>
        <br />
        <h5 className="white-text center-align">{type}</h5>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  count: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

StatsView.propTypes = {
  users: PropTypes.number.isRequired,
  courses: PropTypes.number.isRequired,
  units: PropTypes.number.isRequired,
  topics: PropTypes.number.isRequired,
  resources: PropTypes.number.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('users');
  Meteor.subscribe('courses');
  Meteor.subscribe('units');
  Meteor.subscribe('topics');
  Meteor.subscribe('resourcess');
  return {
    users: Meteor.users.find().count(),
    courses: _Courses.find().count(),
    topics: _Topics.find().count(),
    units: _Units.find().count(),
    resources: Resources.find().count(),
  };
})(StatsView);
// export default StatsView;
