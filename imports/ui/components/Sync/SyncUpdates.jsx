import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import axios from 'axios';
import { Resources, References } from '../../../api/resources/resources';
import { _Courses } from '../../../api/courses/courses';
import { _Units } from '../../../api/units/units';
import { _Topics } from '../../../api/topics/topics';
import { formatText } from '../../utils/utils';

let wait = ms => new Promise(resolve => setTimeout(resolve, ms)); // promise to be used for servr calls

export class SyncUpdates extends Component {
  state = {
    coursesData: [],
    unitsData: [],
    topicsData: [],
    error: '',
    loading: true,
    status: 'Checking remote data to Sync ...',
    synced: false,
  };

  _syncContents = async () => {
    const { coursesData, unitsData, topicsData, searchData, synced } = await this.state;

    if (synced) {
      Materialize.toast('You have synced already', 2000, 'success toast');
      return;
    }

    // sync courses
    await this.setState({
      loading: true,
      status: 'Fetching and Syncing data ...',
    });

    coursesData.map(course => {
      Meteor.call('course.add', course._id, course.name, course.code, course.details, err => {
        err
          ? (Materialize.toast(err.reason, 3000, 'error-toast'),
            Meteor.call('logger', formatText(err.message, Meteor.userId(), 'course'), 'error'))
          : Materialize.toast(`Successfully synced ${coursesData.length} `, 3000, 'success-toast');
      });
    });

    await wait(2000);
    // sync units

    unitsData.map(unit => {
      Meteor.call(
        'unit.insert',
        unit._id,
        unit.name,
        unit.topics,
        unit.unitDesc,
        unit.details,
        err => {
          err
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
              Meteor.call('logger', formatText(err.message, Meteor.userId(), 'units'), 'error'))
            : Materialize.toast(`Successfully synced ${unitsData.length} `, 3000, 'success-toast');
        },
      );
    });
    await wait(2000);
    // sync topics

    topicsData.map(topic => {
      Meteor.call('topic.insert', topic._id, topic.unitId, topic.name, topic.unit, err => {
        err
          ? (Materialize.toast(err.reason, 3000, 'error-toast'),
            Meteor.call('logger', formatText(err.message, Meteor.userId(), 'topics'), 'error'))
          : Materialize.toast(`Successfully synced ${topicsData.length} `, 3000, 'success-toast');
      });
    });
    // insert search Data
    await wait(2000);

    searchData.map(search => {
      Meteor.call('insert.search', search._id, search.ids, search.name, search.category, err => {
        err
          ? Meteor.call(
              'logger',
              formatText(err.message, Meteor.userId(), console.log(err), 'search'),
              'error',
            )
          : '';
      });
    });
    // await wait(2000);
    // write to the file that the sync was successful
    await this.setState({
      loading: false,
      synced: true,
    });

    await Meteor.call(
      'logger',
      formatText('Data was successfully synced', Meteor.userId(), 'sync'),
      'info',
    );
  };

  async componentDidMount() {
    Meteor.call('authenticate', 'manolivier93@gmail.com', 'manoli', (err, res) => {
      err
        ? (this.setState({ error: err.reason }),
          Meteor.call('logger', formatText(err.message, Meteor.userId()), 'error'))
        : Session.set('data', res.data.data);
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
      const searchPromise = axios('http://13.232.61.192/api/search', {
        headers: {
          'X-Auth-Token': authToken,
          'X-User-Id': userId,
        },
      });

      const [courses, units, topics, search] = await Promise.all([
        coursesPromise,
        unitsPromise,
        topicsPromise,
        searchPromise,
      ]);
      this.setState({
        coursesData: courses.data.data,
        topicsData: topics.data.data,
        unitsData: units.data.data,
        searchData: search.data.data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
      Meteor.call('logger', formatText(error.message, Meteor.userId()), 'error');
    }
  };

  render() {
    const { unitsData, coursesData, topicsData, error, loading, status } = this.state;
    const { courses, units, topics } = this.props;
    return (
      <>
        <div className="col m9 s11">
          <table className="highlight">
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
                <td>{courses}</td>
                <td>{coursesData.length}</td>
              </tr>
              <tr>
                <td>Units</td>
                <td>{units}</td>
                <td>{unitsData.length}</td>
              </tr>
              <tr>
                <td>Topics</td>
                <td>{topics}</td>
                <td>{topicsData.length}</td>
              </tr>
            </tbody>
          </table>

          {error.length > 0 ? (
            <p className="red-text">{`${error} Please check your internet connection`}</p>
          ) : loading ? (
            <>
              <p>{status}</p>
              <div className="progress">
                <div className="indeterminate" />
              </div>
            </>
          ) : (
            <button className="btn " onClick={this._syncContents}>
              Sync
            </button>
          )}
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
  };
})(SyncUpdates);
