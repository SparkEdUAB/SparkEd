import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { Resources } from '../../../api/resources/resources';

export class SyncUpdates extends Component {
  constructor() {
    super();
    this.inCheck = 0;
  }

  componentDidMount() {
    Meteor.call('authenticate', 'manolivier93@gmail.com', 'manoli', (err, res) => {
      err ? console.log(err.reason) : Session.set('data', res.data.data);
    });
  }
  getCourses = () => {
    const data = Session.get('data');
    const { authToken, userId } = data;
    Meteor.call('getCourses', authToken, userId, (err, courses) => {
      err ? console.log(err.reason) : console.log(courses.data.data);
    });
  };

  render() {
    return (
      <>
        <div className="col m9 s11">
          <div className="col m5">Your Collections Reference: {this.props.resources}</div>
          <div className="col m4">Server Collections</div>
          <button onClick={this.getCourses}>Get Them</button>
        </div>
      </>
    );
  }
}
export default withTracker(() => {
  Meteor.subscribe('resourcess');
  return {
    resources: Resources.find().count(),
  };
})(SyncUpdates);
