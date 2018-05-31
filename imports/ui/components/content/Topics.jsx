import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _Topics } from '../../../api/topics/topics';
import ReactPaginate from 'react-paginate';
import { insertStatistics } from '../Statistics/Statistics.jsx';
import { setActiveItem } from '../Utilities/Utilities.jsx';
import { Session } from 'meteor/session';
import * as config from '../../../../config.json';
import { _Units } from '../../../api/units/units';

export class Topics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topicName: '',
    };
    Session.set('limit', 15);
  }

  componentWillUnmount() {
    Session.set({
      limit: 0,
      skip: 0,
    });
  }
  getPageCount() {
    const { count } = this.props;
    return Math.ceil(count / Session.get('limit'));
  }

  handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * Session.get('limit'));
    Session.set('skip', offset);
  };
  getEntriesCount = (e, count) => {
    Session.set('limit', count);
  };
  renderPagination() {
    const { count } = this.props;
    if (!count || !count <= Session.get('limit')) {
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

  componentDidMount() {
    setActiveItem(Session.get('activetopic'), 'topic', 'cardListItem');
  }

  saveUsage(id, name, url) {
    setActiveItem(id, 'topic', 'cardListItem');
    const material = name;
    const urlData = FlowRouter.current();
    const page = 'TOPIC';
    const user = Meteor.userId();
    const date = new Date();
    const data = {
      id,
      material,
      url,
      page,
      user,
      date,
    };
    insertStatistics(data);
    Session.set('activetopic', id);
    FlowRouter.go(url);
  }
  renderTopic() {
    let index = 0;
    const { topics, unitId } = this.props;
    if (topics === undefined) {
      return null;
    }
    return topics.map(topic => (
      <li
        key={index++}
        onClick={this.saveUsage.bind(
          this,
          topic._id,
          topic.name,
          `/contents/${unitId}?rs=${topic._id}`,
        )}
        id={topic._id}
        className={'link topic cardListItem'}
      >
        <div id="selectedTopic"> {topic.name}</div>
      </li>
    ));
  }
  render() {
    return (
      <ul className="topic-item-container">
        {this.renderTopic()}
        {this.renderPagination()}
      </ul>
    );
  }
}

Topics.propTypes = {
  unitId: PropTypes.string.isRequired,
};

export default withTracker(param => {
  if (config.isHighSchool) {
    Meteor.subscribe('units');
    return {
      topics: _Units
        .find(
          { 'details.courseId': param.unitId },
          { skip: Session.get('skip'), limit: Session.get('limit') },
          { fields: { name: 1 } },
        )
        .fetch(),
      count: _Units.find({ 'details.courseId': param.unitId }).count(),
    };
  }
  Meteor.subscribe('topics');
  return {
    topics: _Topics
      .find(
        { unitId: param.unitId },
        { skip: Session.get('skip'), limit: Session.get('limit') },
        { fields: { name: 1 } },
      )
      .fetch(),
    count: _Topics.find({ unitId: param.unitId }).count(),
  };
})(Topics);
