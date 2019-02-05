import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _Courses } from '../../../../api/courses/courses';

export function StatsView({ users, courses }) {
  return (
    <div className="col m9 s11">
      <StatCard count={users} type={'users'} />
      <StatCard count={courses} type={'courses'} />
      <StatCard count={2} type={'units'} />
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
};

export default withTracker(() => {
  Meteor.subscribe('users');
  Meteor.subscribe('courses');
  Meteor.subscribe('users');
  return {
    users: Meteor.users.find().count(),
    courses: _Courses.find().count(),
    topics: [],
    resources: [],
  };
})(StatsView);
// export default StatsView;
