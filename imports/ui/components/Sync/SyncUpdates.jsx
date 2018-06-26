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
  // Try and Sync
  syncContents = () => {
    const data = Session.get('data');
    const { authToken, userId } = data;
    return Meteor.call('insertremoteCourse', authToken, userId);
  };
  componentDidMount() {
    Meteor.call('authenticate', 'manolivier93@gmail.com', 'manoli', (err, res) => {
      err ? this.setState({ error: err.reason }) : Session.set('data', res.data.data);
    });
    this.handleTimeOut = setTimeout(() => this.getCounts(), 500); // get counts after 500ms
  }
  getCounts = () => {
    const data = Session.get('data');
    const { authToken, userId } = data;
    Meteor.call('getAllCollections', authToken, userId);
  };

  componentWillUnmount() {
    this.handleTimeOut.stop();
  }
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
