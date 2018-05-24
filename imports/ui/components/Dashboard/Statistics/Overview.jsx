import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

export class OverView extends Component {
  static userStatistics(id) {
    FlowRouter.go(`/user_details/${id}`);
  }

  renderUsers() {
    const { users } = this.props;
    let count = 1;

    return users.map((user) => {
      let email = user.emails;

      if (email === undefined) {
        email = '';
      } else {
        email = email[0].address;
      }

      return (
        <tr
          key={user._id}
          onClick={OverView.userStatistics.bind(this, user._id)}
          className="link-section"
        >
          <td>{count++}</td>
          <td>{user.profile.name}</td>
          <td>{email}</td>
          <td>{user.profile.gender}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="col m9 s11">
          <div className="col m10 container">
            <div>
              <div className="col  s12">
                <h4>Users OverView</h4>
              </div>
            </div>
            <table className="highlight">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                </tr>
              </thead>

              <tbody>{this.renderUsers()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

OverView.propTypes = {
  users: PropTypes.array,
};

export function getSch() {
  const isSchool = FlowRouter.getQueryParam('isSchool');
  const query = { 'profile.stats': 1 };

  if (isSchool === undefined || isSchool == null) {
    return query;
  }
  query['profile.isSchool'] = isSchool;

  return query;
}

export default withTracker(() => {
  Meteor.subscribe('allUsers');
  Meteor.subscribe('allUsers');
  return {
    users: Meteor.users.find(getSch()).fetch(),
  };
})(OverView);
