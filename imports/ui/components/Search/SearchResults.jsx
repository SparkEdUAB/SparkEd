/* eslint class-methods-use-this: "off" */
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import Header from '../layouts/Header.jsx';
import { _SearchData } from '../../../api/search/search';
import Pagination, {
  getQuery,
  validatePageNum,
  getPageNumber,
} from '../Utilities/Pagination/Pagination.jsx';
import SearchListView from './SearchListView.jsx';
import { insertStatistics } from '../Statistics/Statistics.jsx';

export class SearchResults extends Component {
  componentDidMount() {
    SearchResults.saveUsage(FlowRouter.getQueryParam('q'));
  }

  static saveUsage(name) {
    const id = name;
    const urlData = FlowRouter.current();
    const url = urlData.path;
    const page = 'search_results';
    const user = Meteor.userId();
    const date = new Date();
    const data = {
      id,
      material: name,
      url,
      page,
      user,
      date,
    };
    insertStatistics(data);
  }

  renderSearchDisplay() {
    if (this.props.results.length === 0) {
      return (
        <tr>
          <td>
            <h6>Sorry no results found </h6>
          </td>
        </tr>
      );
    }

    return this.props.results.map(result => (
      <SearchListView
        key={result._id}
        result={{
          _id: result._id,
          name: result.name,
          category: result.category,
          ids: result.ids,
        }}
      />
    ));
  }
  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <table>
            <thead>
              <tr>
                <th>Showing results for {FlowRouter.getQueryParam('q')}</th>
              </tr>
            </thead>
            <tbody>{this.renderSearchDisplay()}</tbody>
          </table>

          <Pagination
            path={'/results'}
            query={getQuery(queryParams, true)}
            itemPerPage={limit}
            totalResults={this.props.count}
          />
        </div>
      </div>
    );
  }
}

SearchResults.propTypes = {
  results: PropTypes.array,
};

export function search() {
  const queryData = getQuery(queryParams, true, true);
  const query = queryData.q;
  return query;
}

export const limit = 5;
export const query = 'q'; // default search query param
export const queryParams = [{ param: query }]; // prepare search query paramaters

export default withTracker(() => {
  Meteor.subscribe('topics');
  Meteor.subscribe('units');

  return {
    results: _SearchData.find({ name: search() }, { skip: getPageNumber(limit), limit }).fetch(),
    count: _SearchData.find({ name: search() }).count(),
  };
})(SearchResults);
