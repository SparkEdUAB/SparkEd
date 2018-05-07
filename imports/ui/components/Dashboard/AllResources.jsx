import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { _FileDetails } from '../../../api/resources/resources';
import Pagination, {
  getPageNumber,
  validatePageNum,
  getQuery,
} from '../Utilities/Pagination/Pagination.jsx';
import Search from '../Utilities/Search/Search.jsx';
import { SearchField } from '../Utilities/Utilities.jsx';

export class AllResources extends Component {
  constructor() {
    super();
    this.SESSION_RESULTS = 'RESOURCE_RESULTS';
    this.SESSION_RESULTS_COUNT = 'RESOURCE_RESULTS_COUNT';
    this.itemPerPage = 10;
    this.totalResults = 0;
    this.queryParams = [{ param: 'q' }];
    Meteor.subscribe('filedetails');
  }

  componentDidMount() {
    const self = this;
    Tracker.autorun(() => {
      Session.get('RESOURCE_RESULTS');
      Session.get('RESOURCE_RESULTS_COUNT');

      self.setState({ data: Session.get('RESOURCE_RESULTS') });
      self.setState({ resultsCount: Session.get('RESOURCE_RESULTS_COUNT') });
    });
  }

  renderResources() {
    let count = 1;

    if (this.state == null || this.state.data === undefined) {
      return null;
    }

    this.totalResults = this.state.resultsCount;

    return this.state.data.map(resource => (
      <tr
        key={resource.resourceId}
        onClick={AllResources.handleUrl.bind(this, resource.resourceId)}
        className="link-section"
      >
        <td>{count++}</td>
        <td>{resource.resourceName}</td>
        <td>{resource.resourceType.split('/')[1]}</td>
      </tr>
    ));
  }
  static handleUrl(id, event) {
    event.preventDefault();
    FlowRouter.go(`/dashboard/view_resource/${id}`);
  }

  getResources() {
    const query = getQuery(this.queryParams, true, true, 'q');
    let searchParams = [{ name: query }];
    if (query === '') {
      searchParams = [{}];
    }
    return (
      <Search
        limit={this.itemPerPage}
        skip={getPageNumber(this.itemPerPage)}
        coll={_FileDetails}
        session={this.SESSION_RESULTS}
        data={searchParams}
        criteria={'OR'}
      />
    );
  }

  render() {
    return (
      <div>
        {this.getResources()}

        <div className="col s11 m9">
          <h4>List of All resources</h4>

          <div className="col m8 offset-m2">
            <SearchField
              action={'/dashboard/list_resources'}
              name={'resources'}
              placeholder={'search all resources'}
              query={'q'}
            />
          </div>

          <table className="highlight">
            <thead>
              <tr>
                <th>#</th>
                <th>Resource</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>{this.renderResources()}</tbody>
          </table>
        </div>
        <Pagination
          path={'/dashboard/list_resources'}
          itemPerPage={this.itemPerPage}
          query={getQuery(this.queryParams, true)}
          totalResults={this.totalResults}
        />
      </div>
    );
  }
}

// No longer needed data pulled from sessions
export default withTracker(() => ({
  resources: {},
}))(AllResources);
