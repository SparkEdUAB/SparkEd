/* eslint class-methods-use-this: "off" */
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import i18n from 'meteor/universe:i18n';
import { _Topics } from '../../../api/topics/topics';
import Pagination, { getPageNumber, getQuery } from '../Utilities/Pagination/Pagination.jsx';
import Search from '../Utilities/Search/Search.jsx';
import { SearchField } from '../Utilities/Utilities';
import ErrorBoundary from '../../../ui/components/ErrorBoundary';

export const T = i18n.createComponent();

// todo: Add the name of unit where a topic belongs
export class AllTopics extends Component {
  constructor() {
    super();
    this.SESSION_RESULTS = 'TOPICS_RESULTS'; //
    this.SESSION_RESULTS_COUNT = 'TOPICS_RESULTS_COUNT'; //
    this.itemPerPage = 10;
    this.totalResults = 0;
    this.queryParams = [{ param: 'q' }];
    this.mounted = new ReactiveVar(false);
    this.computation = '';
  }

  componentDidMount() {
    this.mounted.set(true);
    this.computation = Tracker.autorun(() => {
      if (this.mounted) {
        Session.get('TOPICS_RESULTS');
        Session.get('TOPICS_RESULTS_COUNT');
        this.setState({
          data: Session.get('TOPICS_RESULTS'),
          resultsCount: Session.get('TOPICS_RESULTS_COUNT'),
        });
      }
    });
  }

  componentWillUnmount() {
    this.computation.stop();
    Session.set({
      TOPICS_RESULTS: '',
      TOPICS_RESULTS_COUNT: '',
    });
  }
  getTopics() {
    const query = getQuery(this.queryParams, true, true, 'q');
    let searchParams = [{ name: query }];
    if (query === '') {
      searchParams = [{}];
    }
    return (
      <Search
        limit={this.itemPerPage}
        skip={getPageNumber(this.itemPerPage)}
        coll={_Topics}
        session={this.SESSION_RESULTS}
        data={searchParams}
        criteria={'OR'}
      />
    );
  }
  static handleUrl(id) {
    FlowRouter.go(`/dashboard/edit_unit/${id}`);
  }

  renderAllTopics() {
    let count = 1;
    if (!this.state || !this.state.data) {
      return null;
    }

    this.totalResults = this.state.resultsCount;

    return this.state.data.map(topic => (
      <tr
        key={topic._id}
        onClick={AllTopics.handleUrl.bind(this, topic.unitId)}
        className="link-section"
      >
        <td>{count++}</td>
        <td>{topic.name}</td>
        <td>{topic.unit}</td>
      </tr>
    ));
  }

  render() {
    return (
      <ErrorBoundary>
        <div>
          {this.getTopics()}
          <div className="col m9 s11">
            <h4>
              List of <T>common.manage.topics</T>
            </h4>
            <div className="col m8 offset-m2">
              <SearchField
                action={'/dashboard/list_topics'}
                name={'topics'}
                placeholder={'search for topics'}
                query={'q'}
              />
            </div>

            <table className="highlight">
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    <T>common.manage.topics</T>
                  </th>
                  <th>
                    <T>common.manage.unit</T> <T>common.accounts.name</T>{' '}
                  </th>
                </tr>
              </thead>
              <tbody>{this.renderAllTopics()}</tbody>
            </table>
          </div>
          <Pagination
            path={'/dashboard/list_topics'}
            itemPerPage={this.itemPerPage}
            query={getQuery(this.queryParams, true)}
            totalResults={this.totalResults}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('topics');
  Meteor.subscribe('resourcess');
  return {
    topics: {},
  };
})(AllTopics);
