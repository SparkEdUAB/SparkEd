import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import ReactPaginate from 'react-paginate';
import i18n from 'meteor/universe:i18n';
import M from 'materialize-css';
import { _Feedback } from '../../../api/feedback/feedback';
import { ThemeContext } from '../../containers/AppWrapper'; // eslint-disable-line

export const T = i18n.createComponent();

export class Feedback extends Component {
  componentDidMount() {
    M.AutoInit();
    Session.set('limit', 8);
  }

  getPageCount() {
    const { count } = this.props;
    return Math.ceil(count / Session.get('limit'));
  }

  handlePageClick = data => {
    const { selected } = data;
    const offset = Math.ceil(selected * Session.get('limit'));
    Session.set('skip', offset);
  };
  getEntriesCount = (e, count) => {
    Session.set('limit', count);
  };

  renderPagination() {
    const { count } = this.props;
    if (!count || count <= Session.get('limit')) {
      return <span />;
    }
    return (
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={<a href="">...</a>}
        breakClassName={'break-me'}
        pageCount={this.getPageCount()}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination '}
        activeClassName={'active blue'}
        pageLinkClassName={'link'}
      />
    );
  }

  renderComments(color) {
    const { feeds } = this.props;
    if (!feeds || !feeds.length) {
      return (
        <span className="center">You have not received any feedback yet</span>
      );
    }

    return feeds.map(feed => (
      <ul
        key={feed._id}
        className="collapsible popout"
        data-collapsible="accordion"
      >
        <li>
          <div
            className="collapsible-header"
            style={{ backgroundColor: color }}
          >
            <i className="fa fa-user " />
            <span style={{ marginRight: '2%' }}>{feed.createdBy}</span>
            <span style={{ marginRight: '40%' }}>Title: {feed.title}</span>
            <a href={feed.link} className="blue-text right">
              <T>common.titles.source</T>
            </a>
          </div>
          <div className="collapsible-body" style={{ backgroundColor: color }}>
            <p className="flow-text">{feed.feedback}</p>
          </div>
        </li>
      </ul>
    ));
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {({ state }) => (
          <div
            className="col m9 s11"
            style={{
              backgroundColor: state.isDark ? state.mainDark : '#FFFFFF',
              color: state.isDark ? '#F5FAF8' : '#000000',
            }}
          >
            <h3 className="center blue-text">
              <T>common.titles.usersfeedback</T>
            </h3>
            <div className="row">
              <div className="">
                {this.renderComments(state.isDark ? '#F5FAF8' : '#000000')}
              </div>
            </div>
            {this.renderPagination()}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
Feedback.propTypes = {
  feeds: PropTypes.array.isRequired,
  count: PropTypes.number,
};

export default withTracker(() => {
  Meteor.subscribe('feedbacks');
  return {
    feeds: _Feedback
      .find(
        {},
        {
          skip: Session.get('skip'),
          limit: Session.get('limit'),
          sort: { createdAt: -1 },
        },
      )
      .fetch(),
    count: _Feedback.find().count(),
  };
})(Feedback);
