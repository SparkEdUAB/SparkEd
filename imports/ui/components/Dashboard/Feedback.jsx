import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';
import { _Feedback } from '../../../api/feedback/feedback';

export const T = i18n.createComponent();

export class Feedback extends Component {
  componentDidMount() {
    Meteor.setTimeout(() => {
      $('.collapsible').collapsible();
    }, 100);
  }

  renderComments() {
    const { feeds } = this.props;
    if (!feeds || !feeds.length) {
      return <span className="center">You have not received any feedback yet</span>;
    }

    return feeds.map(feed => (
      <ul key={feed._id} className="collapsible popout" data-collapsible="accordion">
        <li>
          <div className="collapsible-header">
            <i className="fa fa-user " />
            <span style={{ marginRight: '2%' }}>{feed.createdBy}</span>
            <span style={{ marginRight: '40%' }}>Title: {feed.title}</span>
            <a href={feed.link} className="blue-text right">
              <T>common.titles.source</T>
            </a>
          </div>
          <div className="collapsible-body">
            <p className="flow-text">{feed.feedback}</p>
          </div>
        </li>
      </ul>
    ));
  }

  render() {
    return (
      <>
        <div className="col m9 s11">
          <h3 className="center blue-text">
            <T>common.titles.usersfeedback</T>
          </h3>
          <div className="row">
            <div className="">{this.renderComments()}</div>
          </div>
        </div>
      </>
    );
  }
}
Feedback.propTypes = {
  feeds: PropTypes.array.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('feedbacks');
  return {
    feeds: _Feedback
      .find(
        {},
        {
          sort: {
            createdAt: -1,
          },
        },
      )
      .fetch(),
  };
})(Feedback);
