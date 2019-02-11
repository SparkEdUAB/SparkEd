/* eslint no-unused-expressions: 0  */
import React, { Component, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import axios from 'axios';
import { _ } from 'lodash';
import { Resources, References } from '../../../api/resources/resources';
import { _SearchData } from '../../../api/search/search';
import { _Courses } from '../../../api/courses/courses';
import { _Units } from '../../../api/units/units';
import { _Topics } from '../../../api/topics/topics';
import { formatText } from '../../utils/utils';
import * as config from '../../../../config.json';
import { ThemeContext } from '../../containers/AppWrapper'; // eslint-disable-line

const wait = ms => new Promise(resolve => setTimeout(resolve, ms)); // promise to be used for servr calls
const { server } = config;

export class SyncUpdates extends Component {
  state = {
    coursesData: [],
    unitsData: [],
    topicsData: [],
    error: '',
    loading: true,
    status: 'Checking remote data to Sync ...',
    synced: false,
    data: null,
  };

  _syncContents = async () => {
    const {
      coursesData,
      unitsData,
      topicsData,
      searchData,
      synced,
    } = await this.state;
    const { courses, units, topics, search } = await this.props;

    if (synced) {
      Materialize.toast('You have synced already', 2000, 'success toast');
      return;
    }

    // sync courses
    await this.setState({
      loading: true,
      status: 'Fetching and Syncing data ...',
    });
    const coursesSync = await _.differenceBy(coursesData, courses, '_id');
    const unitsSync = await _.differenceBy(unitsData, units, '_id');
    const topicsSync = await _.differenceBy(topicsData, topics, '_id');
    const searchSync = await _.differenceBy(searchData, search, '_id');

    await coursesSync.map(course => {
      Meteor.call(
        'course.add',
        course._id,
        course.name,
        course.code,
        course.details,
        err => {
          err
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
            Meteor.call(
              'logger',
              formatText(err.message, Meteor.userId(), 'course'),
              'error',
            ))
            : Materialize.toast(
              `Successfully synced ${coursesSync.length} `,
              3000,
              'success-toast',
            );
        },
      );
    });

    await wait(2000);
    // sync units

    await unitsSync.map(unit => {
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
            Meteor.call(
              'logger',
              formatText(err.message, Meteor.userId(), 'units'),
              'error',
            ))
            : Materialize.toast(
              `Successfully synced ${unitsData.length} `,
              3000,
              'success-toast',
            );
        },
      );
    });
    await wait(2000);
    // sync topics

    await topicsSync.map(topic => {
      Meteor.call(
        'topic.insert',
        topic._id,
        topic.unitId,
        topic.name,
        topic.unit,
        err => {
          err
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
            Meteor.call(
              'logger',
              formatText(err.message, Meteor.userId(), 'topics'),
              'error',
            ))
            : Materialize.toast(
              `Successfully synced ${topicsData.length} `,
              3000,
              'success-toast',
            );
        },
      );
    });
    // insert search Data
    await wait(2000);

    searchSync.map(search => {
      Meteor.call(
        'insert.search',
        search._id,
        search.ids,
        search.name,
        search.category,
        err => {
          err
            ? Meteor.call(
              'logger',
              formatText(
                err.message,
                Meteor.userId(),
                console.log(err),
                'search',
              ),
              'error',
            )
            : '';
        },
      );
    });

    if (!coursesSync.length) {
      this.setState({
        loading: true,
        status: 'No Courses to Sync, Checking Units ...',
      });
    }
    await wait(1000);
    if (!unitsSync.length) {
      this.setState({
        loading: true,
        status: 'No Units to Sync, Checking Topics ...',
      });
    }
    await wait(1000);
    if (!unitsSync.length) {
      this.setState({
        loading: true,
        status: 'No Topics to Sync ...',
      });
    }

    // When all is done, get the resources and references and sync them to the local
    Meteor.call('restoreDbChunks');
    await Meteor.call(
      'logger',
      formatText('Data was successfully synced', Meteor.userId(), 'sync'),
      'info',
    );

    // await wait(2000);
    // write to the file that the sync was successful
    await this.setState({
      loading: false,
      synced: true,
    });
  };

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  getRemoteColls = async () => {
    const {
      data: { authToken, userId },
    } = await this.state;

    try {
      const coursesPromise = axios(`${server}/api/course/`);
      const unitsPromise = axios(`${server}/api/unit`, {
        headers: {
          'X-Auth-Token': authToken,
          'X-User-Id': userId,
        },
      });
      const topicsPromise = axios(`${server}/api/topic`, {
        headers: {
          'X-Auth-Token': authToken,
          'X-User-Id': userId,
        },
      });
      const searchPromise = axios(`${server}/api/search/`, {
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
      if (this._isMounted) {
        this.setState({
          coursesData: courses.data.data,
          topicsData: topics.data.data,
          unitsData: units.data.data,
          searchData: search.data.data,
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        error: error.message,
      });
      Meteor.call(
        'logger',
        formatText(error.message, Meteor.userId()),
        'error',
      );
    }
  };

  serverAuthenticate = async () => {
    const user = Meteor.user();
    const { password } = this.state;
    const { address } = user.emails[0];
    Meteor.call('authenticate', address, password, (err, res) => {
      err
        ? (this.setState({ error: err }),
        Meteor.call(
          'logger',
          formatText(err.message, Meteor.userId()),
          'error',
        ))
        : this.setState({
          data: res.data.data,
        });
    });
    await wait(1500);
    this.getRemoteColls();
  };
  getPassword = ({ target: { value } }) => {
    this.setState({
      password: value,
      error: '',
    });
  };
  render() {
    const {
      unitsData,
      coursesData,
      topicsData,
      error,
      loading,
      status,
      data,
    } = this.state;
    const { courses, units, topics } = this.props;
    return (
      <ThemeContext.Consumer>
        {({ state }) => (
          <Fragment>
            <div
              className="col m9 s11"
              style={{ color: state.isDark ? '#F5FAF8' : '#000000' }}
            >
              <p>
                The Sync Address is <span className="red-text">{server}</span>
                <a href="/setup"> click here</a> if you wish to change the
                address
              </p>
              {!data ? (
                <InputPassword
                  authenticateFunc={this.serverAuthenticate}
                  onChange={this.getPassword}
                  error={error}
                  isDark={state.isDark}
                />
              ) : (
                <Fragment>
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
                        <td>{courses.length}</td>
                        <td>{coursesData.length}</td>
                      </tr>
                      <tr>
                        <td>Units</td>
                        <td>{units.length}</td>
                        <td>{unitsData.length}</td>
                      </tr>
                      <tr>
                        <td>Topics</td>
                        <td>{topics.length}</td>
                        <td>{topicsData.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  {error.length > 0 ? (
                    <p className="red-text">{`${error} Please check your internet connection`}</p>
                  ) : loading ? (
                    <Fragment>
                      <p>{status}</p>
                      <div className="progress">
                        <div className="indeterminate" />
                      </div>
                    </Fragment>
                  ) : (
                    <button className="btn " onClick={this._syncContents}>
                      Sync
                    </button>
                  )}
                  <p>
                    Resources and other references will be synced in the
                    background.
                  </p>
                </Fragment>
              )}
            </div>
          </Fragment>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const InputPassword = props => (
  <div className="col m9 s11">
    <div className="row">
      <div className="input-field col s12 m6">
        <input
          id="inst_tag"
          type="text"
          className="validate"
          required
          style={{ color: props.isDark ? '#F5FAF8' : '#000000' }}
          onChange={props.onChange}
        />
        <label htmlFor="inst_tag">
          Enter your password <span className="red-text">*</span>
        </label>
      </div>
    </div>
    <div className="row">
      <button
        className="btn "
        onClick={props.authenticateFunc}
        style={{ backgroundColor: '#006b76' }}
      >
        Authenticate
      </button>
    </div>

    <div className="row">{props.error.length ? props.error : null}</div>
  </div>
);

SyncUpdates.propTypes = {
  courses: PropTypes.array,
  units: PropTypes.array,
  topics: PropTypes.array,
};
InputPassword.propTypes = {
  authenticateFunc: PropTypes.func,
  onChange: PropTypes.func,
  error: PropTypes.string,
  isDark: PropTypes.bool,
};

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
    courses: _Courses.find().fetch(),
    units: _Units.find().fetch(),
    topics: _Topics.find().fetch(),
    search: _SearchData.find().fetch(),
  };
})(SyncUpdates);
