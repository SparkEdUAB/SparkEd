import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { PropTypes } from 'prop-types';
import { Resources, References } from '../../../api/resources/resources';
import { _Courses } from '../../../api/courses/courses';
import { _Units } from '../../../api/units/units';
import { _Topics } from '../../../api/topics/topics';
import { syncData } from '../../../api/sync/syncData';
import DataList from './DataList';

export class SyncUpdates extends Component {
  constructor(props) {
    super(props);
    this.inCheck = 0;
    this.handleTimeOut = () => {};
  }
  // Try and Sync  courseAdd(id, course, courseCode, details)
  syncContents = () => {
    const { data } = this.props;
    data.map(item => {
      const { data } = item;
      switch (item.type) {
        case 'course':
          data.map(course => {
            Meteor.call('course.add', course._id, course.name, course.code, course.details, err => {
              err
                ? Materialize.toast(err.reason, 3000, 'error-toast')
                : Materialize.toast(`Successfully added ${course} `, 3000, 'success-toast');
            });
          });
          break;
        case 'unit':
          data.map(unit => {
            Meteor.call(
              'unit.insert',
              unit._id,
              unit._id,
              unit.topics,
              unit.unitDesc,
              unit.details,
              err => {
                err
                  ? Materialize.toast(err.reason, 4000, 'error-toast')
                  : Materialize.toast(`Synced Units successfully`, 5000, 'success-toast');
              },
            );
          });
          break;
        case 'resources':
          console.log(item);
          break;
        case 'topic':
          data.map(topic => {
            Meteor.call(
              'singletopic.insert',
              topic._id,
              topic.unitId,
              topic.name,
              topic.unit,
              err => {
                err
                  ? Materialize.toast(err.reason, 4000, 'error-toast')
                  : Materialize.toast(`Successfully synced topics`, 4000, 'success-toast');
              },
            );
          });
          break;
        default:
          break;
      }
    });
  };
  componentDidMount() {
    Meteor.call('authenticate', 'manolivier93@gmail.com', 'manoli', (err, res) => {
      err ? this.setState({ error: err.reason }) : Session.set('data', res.data.data);
    });
    setTimeout(() => this.getCounts(), 500); // get counts after 500ms
  }
  // check server collections and their counts
  getCounts = () => {
    const data = Session.get('data');
    if (data) {
      const { authToken, userId } = data;
      Meteor.call('getAllCollections', authToken, userId);
    }
  };

  renderSyncData() {
    const { data } = this.props;
    if (!data) {
      return 'null';
    }

    return data.map(coll => (
      <li className="collection-item" key={coll._id}>
        <div>
          {coll.type}
          <a href="#!" className="secondary-content">
            <span className="blue-text">{coll.count}</span>
          </a>
        </div>
      </li>
    ));
  }

  render() {
    return (
      <>
        <div className="col m9 s11">
          <div className="col m5">
            <DataList count={this.props} title={'Current Count'} />
          </div>
          <div className="col m4">
            <ul className="collection with-header">
              <li className="collection-header">
                <h5> Server Collection</h5>
              </li>
              {this.renderSyncData()}
            </ul>
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
