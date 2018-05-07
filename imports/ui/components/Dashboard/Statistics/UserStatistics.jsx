import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _Statistics } from '../../../../api/statistics/statistics';

export class UserStatistics extends Component {
  constructor() {
    super();
    Meteor.subscribe('allUsers');
  }

  exportUserDataToCSV() {
    const data = this.props.statistics;
    const { user } = this.props;
    let userStats = null;
    data.forEach((v, k, arr) => {
      userStats = {};
      userStats.name = `${user.profile.name}`;
      userStats.email = user.emails[0].address;
      userStats.gender = user.profile.gender;
      $.map(v, (col, index) => {
        userStats[index] = col;
      });
      data[k] = userStats;
    });

    const name = `${this.props.user.profile.name}`;
    const nameFile = `${name}.csv`;
    Meteor.call('DataToCSV', data.reverse(), (err, fileContent) => {
      if (fileContent) {
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, nameFile);
      } else {
        console.log(err);
      }
    });
  }

  renderPageData() {
    if (this.props.statistics === undefined) {
      return null;
    }

    return this.props.statistics.map(page => (
      <tr key={page._id}>
        <td>{page.page}</td>
        <td>
          <a target={'_blank'} href={page.url}>
            {page.material}
          </a>
        </td>
        <td>{page.freq}</td>
        <td>{moment(page.date).fromNow()}</td>
      </tr>
    ));
  }
  static getBack() {
    FlowRouter.go('/dashboard/overview');
  }

  renderUserName() {
    const { user } = this.props;
    if (user === undefined) {
      return null;
    }
    return <span>{user.profile.name}</span>;
  }

  render() {
    return (
      <div>
        <div className="col m9 s11 ">
          <div className="">
            <h4>Statistics for {this.renderUserName()}</h4>
          </div>
          <div className="row">
            <div className="col m3 ">
              <button
                className="btn grey darken-1 fa fa-angle-left"
                onClick={UserStatistics.getBack.bind(this)}
              >
                {' '}
                Users
              </button>
            </div>

            <div className="col m3 ">
              <button
                className="btn green darken-1 fa fa-download"
                onClick={this.exportUserDataToCSV.bind(this)}
              >
                {' '}
                Export
              </button>
            </div>
          </div>

          <table className="highlight">
            <thead>
              <tr>
                <th>Page </th>
                <th>Material</th>
                <th>Frequency</th>
                <th>Last Active</th>
              </tr>
            </thead>

            <tbody>{this.renderPageData()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

UserStatistics.propTypes = {
  statistics: PropTypes.array,
  user: PropTypes.object,
};

export function userId() {
  return FlowRouter.getParam('_id');
}

export default withTracker(() => {
  Meteor.subscribe('statistics');
  return {
    statistics: _Statistics.find({ user: userId() }).fetch(),
    user: Meteor.users.findOne({ _id: userId() }),
  };
})(UserStatistics);
