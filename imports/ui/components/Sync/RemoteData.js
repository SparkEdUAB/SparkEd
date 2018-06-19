import React, { Component } from 'react';
import DataList from './DataList';
import { Resources } from '../../../api/resources/resources';

export default class RemoteData extends Component {
  constructor(props) {
    super(props);
    this.inCheck = 0;
    this.state = {
      courses: 0,
      units: 0,
      topics: 0,
      resources: 0,
      references: 0,
    };
  }

  componentDidMount() {
    Meteor.call('authenticate', 'manolivier93@gmail.com', 'manoli', (err, res) => {
      err ? console.log(err.reason) : Session.set('data', res.data.data);
    });
    setTimeout(() => this.getCounts(), 500);
  }
  getCounts = () => {
    const data = Session.get('data');
    const { authToken, userId } = data;

    // Courses
    Meteor.call('getCourses', authToken, userId, (err, response) => {
      err ? console.log(err.reason) : this.setState({ courses: response.data.data.length });
    });
    // Units
    Meteor.call('getUnits', authToken, userId, (err, response) => {
      err ? console.log(err.reason) : this.setState({ units: response.data.data.length });
    });
    // Topics
    Meteor.call('getTopics', authToken, userId, (err, response) => {
      err ? console.log(err.reason) : this.setState({ topics: response.data.data.length });
    });
    // Resources
    Meteor.call('getResources', authToken, userId, (err, response) => {
      err ? console.log(err.reason) : this.setState({ resources: response.data.data.length });
    });
    // References
    Meteor.call('getReferences', authToken, userId, (err, response) => {
      err ? console.log(err.reason) : this.setState({ references: response.data.data.length });
    });
  };

  render() {
    return (
      <>
        <DataList count={this.state} title={'Server Count'} />
      </>
    );
  }
}
