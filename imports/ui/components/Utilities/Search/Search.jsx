import { Session } from 'meteor/session';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

export class Search extends Component {
  constructor() {
    super();
    this.COUNT = '_COUNT';
  }

  render() {
    return (
      <div>
        {Session.set(this.props.session, this.props.searcResults)}
        {Session.set(this.props.session + this.COUNT, this.props.count)}
      </div>
    );
  }
}

export function refineSearch(searchData) {
  // pass empty object if these options are specified
  // ??? validate data type ?????
  const limit = searchData.limit === undefined ? 0 : searchData.limit;
  const sort = searchData.sort === undefined ? {} : searchData.sort;
  const skip = searchData.skip === undefined ? 0 : searchData.skip;
  const fields = searchData.fields === undefined ? {} : searchData.fields;
  return {
    limit,
    sort,
    skip,
    fields,
  };
}

export function getSearchCriteria(criteria, data) {
  if (criteria === 'OR' && Array.isArray(data)) {
    return { $or: data };
  } else if (criteria === 'AND' && typeof data === 'object') {
    return data;
  }
  return {}; // return all fields
}

export default withTracker((params) => {
  const options = refineSearch(params);
  return {
    searcResults: params.coll
      .find(getSearchCriteria(params.criteria, params.data), options)
      .fetch(),
    count: params.coll.find(getSearchCriteria(params.criteria, params.data)).count(),
  };
})(Search);

Search.propTypes = {
  criteria: PropTypes.string.isRequired,
  coll: PropTypes.object.isRequired,
  session: PropTypes.string.isRequired, // name of the sessions
};
