import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import { Resources, References } from '../../../api/resources/resources';
import { _Courses } from '../../../api/courses/courses';
import { _Units } from '../../../api/units/units';
import { _Topics } from '../../../api/topics/topics';
import { syncData } from '../../../api/sync/syncData';
import DataList from './DataList';

let wait = ms => new Promise(resolve => setTimeout(resolve, ms)); // promise to be used for servr calls

export class SyncUpdates extends Component {
  state = {
    coursesData: [],
    unitsData: [],
    topicsData: [],
  };
  // Try and Sync  courseAdd(id, course, courseCode, details)
  _syncContents = () => {
    const { coursesData, unitsData, topicsData } = this.state;
    // start by inserting courses
    console.log(coursesData);
  };

  async componentDidMount() {
    Meteor.call('authenticate', 'manolivier93@gmail.com', 'manoli', (err, res) => {
      err ? this.setState({ error: err.reason }) : Session.set('data', res.data.data);
    });
    await wait(2000);
    await this.getRemoteColls();
  }

  getRemoteColls = async () => {
    const data = Session.get('data');
    let authToken, userId;
    if (data) {
      authToken = data.authToken;
      userId = data.userId;
    }
    try {
      const coursesPromise = axios('http://13.232.61.192/api/course/');
      const unitsPromise = axios('http://13.232.61.192/api/unit', {
        headers: {
          'X-Auth-Token': authToken,
          'X-User-Id': userId,
        },
      });
      const topicsPromise = axios('http://13.232.61.192/api/topic', {
        headers: {
          'X-Auth-Token': authToken,
          'X-User-Id': userId,
        },
      });

      const [courses, units, topics] = await Promise.all([
        coursesPromise,
        unitsPromise,
        topicsPromise,
      ]);
      this.setState({
        coursesData: courses.data.data,
        topicsData: topics.data.data,
        unitsData: units.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { unitsData, coursesData, topicsData } = this.state;
    return (
      <>
        <div className="col m9 s11">
          <table className="striped">
            <thead>
              <tr>
                <th>Collections</th>
                <th>Local Count</th>
                <th>Server Count</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Courses</td>
                <td>{this.props.courses}</td>
                <td>{coursesData.length}</td>
              </tr>
              <tr>
                <td>Units</td>
                <td>{this.props.units}</td>
                <td>{unitsData.length}</td>
              </tr>
              <tr>
                <td>Topics</td>
                <td>{this.props.topics}</td>
                <td>{topicsData.length}</td>
              </tr>
            </tbody>
          </table>
          <button className="btn " onClick={this._syncContents}>
            Sync
          </button>
        </div>
      </>
    );
  }
}
// todo: consider making these into server calls
export default withTracker(() => {
  Meteor.subscribe('resourcess');
  Meteor.subscribe('references');
  Meteor.subscribe('courses');
  Meteor.subscribe('units');
  Meteor.subscribe('topics');
  Meteor.subscribe('syncdata');
  return {
    resources: Resources.find().count(),
    references: References.find().count(),
    courses: _Courses.find().count(),
    units: _Units.find().count(),
    topics: _Topics.find().count(),
    data: syncData.find().fetch(),
  };
})(SyncUpdates);
