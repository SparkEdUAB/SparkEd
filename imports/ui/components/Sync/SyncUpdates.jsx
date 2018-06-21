import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { PropTypes } from 'prop-types';
import { Resources, References } from '../../../api/resources/resources';
import { _Courses } from '../../../api/courses/courses';
import { _Units } from '../../../api/units/units';
import { _Topics } from '../../../api/topics/topics';
import DataList from './DataList';
import RemoteData from './RemoteData';

export class SyncUpdates extends Component {
  constructor(props) {
    super(props);
    this.inCheck = 0;
  }
  // Try and Sync
  syncContents = () => {
    const data = Session.get('data');
    const { authToken, userId } = data;
    return Meteor.call('insertremoteCourse', authToken, userId);
  };
  render() {
    return (
      <>
        <div className="col m9 s11">
          <div className="col m5">
            <DataList count={this.props} title={'Current Count'} />
          </div>
          <div className="col m4">
            <RemoteData />
          </div>
          <div className="col m11">
            <button className="btn" onClick={this.syncContents}>
              Sync
            </button>
          </div>
        </div>
      </>
    );
  }
}
export default withTracker(() => {
  Meteor.subscribe('resourcess');
  Meteor.subscribe('references');
  Meteor.subscribe('courses');
  Meteor.subscribe('units');
  Meteor.subscribe('topics');
  return {
    resources: Resources.find().count(),
    references: References.find().count(),
    courses: _Courses.find().count(),
    units: _Units.find().count(),
    topics: _Topics.find().count(),
  };
})(SyncUpdates);
