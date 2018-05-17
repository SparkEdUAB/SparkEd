import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { Resources } from '../../../api/resources/resources';

export class SyncUpdates extends Component {
  constructor() {
    super();
    this.state = {
      isOnline: false,
    };
    this.inCheck = 0;
  }
  // check connectivity every ten seconds
  checkInternet() {
    this.inCheck = Meteor.setInterval(() => {
      Meteor.call('checkNetwork', (err, isOnline) => {
        if (isOnline) {
          this.setState({
            isOnline,
          });
        } else {
          this.setState({
            isOnline,
          });
        }
      });
    }, 10000);
  }
  componentDidMount() {
    this.checkInternet();
  }
  // clear the interval when leaving
  componentWillUnmount() {
    clearInterval(this.inCheck);
  }

  render() {
    const { isOnline } = this.state;
    return (
      <>
        <div className="col m9 s11">
          <div className="col m5">Your Collections Reference: {this.props.resources}</div>
          <div className="col m4">
            Server Collections
            <h5>{isOnline.toString()}</h5>
          </div>
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
