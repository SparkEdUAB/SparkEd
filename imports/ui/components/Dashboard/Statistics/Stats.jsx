import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

export function StatsView({ users }) {
  return (
    <div className="col m9 s11">
      <StatCard count={users} />
      <StatCard count={2} />
      <StatCard count={2} />
    </div>
  );
}

function StatCard({ count }) {
  return (
    <div className="col s6 m4">
      <div className="card-panel teal">
        <h1 className="white-text center-align">{count}</h1>
        <br />
        <h5 className="white-text center-align">users</h5>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  count: PropTypes.number.isRequired,
};

StatsView.propTypes = {
  users: PropTypes.number.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('users');
  return {
    users: Meteor.users.find().count(),
    courses: [],
    topics: [],
    resources: [],
  };
})(StatsView);
// export default StatsView;
