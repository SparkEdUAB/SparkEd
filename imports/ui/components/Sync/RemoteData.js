import React, { Component } from 'react';
import DataList from './DataList';
import { List } from './ReSend';
import Collection from './Collection';
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
      error: '', // Errors
    };
  }

  componentDidMount() {
    Meteor.call('authenticate', 'manolivier93@gmail.com', 'manoli', (err, res) => {
      err ? this.setState({ error: err.reason }) : Session.set('data', res.data.data);
    });
    setTimeout(() => this.getCounts(), 500); // get counts after 500ms
  }
  getCounts = () => {
    const data = Session.get('data');
    // const { authToken, userId } = data;
    const authToken = 'lUF8Da-wt8uY0TbeP6DuhRyAe_tOSwhGK8k-JCJq7ee';
    const userId = 'jQs3tMHG5iqz7YwKt';

    Meteor.call('getAllCollections', authToken, userId);
  };

  render() {
    const { error } = this.state;
    return (
      <ul className="collection">
        <li>Heee</li>
      </ul>
    );
  }
}
