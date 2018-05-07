import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Header from '../layouts/Header.jsx';
import Sidenav from './Sidenav.jsx';
import { _Feedback } from '../../../api/feedback/feedback';

export class Feedback extends Component {
  componentDidMount() {
    Meteor.setTimeout(() => {
      $('.collapsible').collapsible();
    }, 100);
  }

  renderComments() {
    const comments = this.props.feedback;
    if (this.props.feedback === undefined) {
      return null;
    }

    return comments.map(feedback => (
      <ul key={feedback._id} className="collapsible popout" data-collapsible="accordion">
        <li>
          <div className="collapsible-header">
            <i className="fa fa-user " />
            <span style={{ marginRight: '2%' }}>{feedback.createdBy}</span>
            <span style={{ marginRight: '40%' }}>Title: {feedback.title}</span>
            <a href={feedback.link} className="blue-text right">
              Source
            </a>
          </div>
          <div className="collapsible-body">
            {/* Yet to include the "flow-text" to make the text more responsive and larger */}
            <p className="flow-text">{feedback.feedback}</p>
          </div>
        </li>
      </ul>
    ));
  }

  render() {
    return (
      <>
        <div className="col m9 s11">
          <h3 className="center blue-text">Users Feedback</h3>
          <div className="row">
            <div className="">{this.renderComments()}</div>
          </div>
        </div>
      </>
    );
  }
}
Feedback.propTypes = {
  feedback: PropTypes.array.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('feedbacks');
  return {
    feedback: _Feedback
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
