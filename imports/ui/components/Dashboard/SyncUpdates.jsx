import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
// import { Session } from 'meteor/session';
import { Resources } from '../../../api/resources/resources';

export class SyncUpdates extends Component {
  render() {
    return (
      <>
        <div className="col m9 s11">
          <div className="col m5">Your Collections Reference: {this.props.resources}</div>
          <div className="col m4">Server Collections</div>
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
