import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import ViewFrame from './ViewFrame.jsx';
import ResourceRender from './ResourceRender.jsx';
import { insertStatistics } from '../Statistics/Statistics.jsx';
import { FloatingButton } from '../Utilities/Utilities.jsx';
import ErrorBoundary from '../ErrorBoundary'; // eslint-disable-line
import { Resources } from '../../../api/resources/resources';
import * as config from '../../../../config.json';

export class ViewResourceApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      download: false,
    };
  }
  static extractFileType(data) {
    const fileTypeData = data.split('/');
    let type = fileTypeData[0];
    if (type === 'application') {
      [, type] = fileTypeData;
    }
    return type;
  }

  static saveUsage(name) {
    const id = FlowRouter.getQueryParam('rs');
    const material = name;
    const urlData = FlowRouter.current();
    const url = urlData.path;
    const user = Meteor.userId();
    const date = new Date();
    const page = 'RESOURCE';
    const data = {
      id,
      material,
      url,
      page,
      date,
      user,
    };
    insertStatistics(data);
  }

  fetchResource() {
    let { resource } = this.props;
    if (!resource) {
      resource = null;
    }
    return resource;
  }

  renderResource() {
    const resourceObj = this.fetchResource();
    if (!resourceObj) {
      return null;
    }
    const resources = resourceObj;
    const resource = {
      type: resources.type,
      ext: resources.ext,
      name: resources.name,
      urlLink: resourceObj.link(),
      _id: resources._id,
    };
    const link = `/cdn/storage/Resources/${resource._id}/original/${
      resource._id
    }.${resource.ext}`;

    return <ResourceRender resource={resource} Link={link} />;
  }

  fetchResources() {
    const query = this.props.resources;
    if (!query) {
      return null;
    }
    let data = query;
    if (!query) {
      data = [
        {
          id: 0,
          topicId: 0,
          name: '',
          file: {
            size: 0,
            type: null,
            url: '#',
          },
        },
      ];
    }

    if (data.length === 0) {
      // !data.length
      data = [
        {
          id: 0,
          topicId: 0,
          name: '',
          file: {
            size: 0,
            type: null,
            url: '#',
          },
        },
      ];
    }
    return data;
  }

  static getUrl() {
    const sectionId = FlowRouter.getQueryParam('scid');
    const url = `/contents/${sectionId}?rs=${FlowRouter.getParam('_id')}`;
    return url;
  }

  render() {
    return (
      <ErrorBoundary>
        <div className="row">
          <div className="col s12 m8 l9">{this.renderResource()}</div>
          <div className="col s12 m4 l3 ">
            <ViewFrame resources={this.props.resources} />
          </div>
        </div>
        <div className="">
          <FloatingButton className="left" />{' '}
        </div>
      </ErrorBoundary>
    );
  }
}

export function getResourceWithId(coll) {
  if (!coll) {
    return 'null';
  }
  const resourceArray = coll.resources;
  let resource = null;
  for (let index = 0; index < resourceArray.length; index += 1) {
    const element = resourceArray[index];
    if (element._id === FlowRouter.getQueryParam('rs')) {
      resource = element.file;
    } else {
      return null;
    }
    return resource;
  }
}
ViewResourceApp.propTypes = {
  resources: PropTypes.array,
  chapters: PropTypes.object,
  sectionName: PropTypes.string,
  resource: PropTypes.object,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('resourcess');
  if (config.isHighSchool) {
    return {
      subsReady: handle.ready(),
      resources: Resources.find(
        {
          'meta.unitId': FlowRouter.getParam('_id'),
        },
        { sort: { type: 1 } },
      ).fetch(),
      resource: Resources.findOne({ _id: FlowRouter.getQueryParam('rs') }),
    };
  }
  Meteor.subscribe('topics');
  return {
    subsReady: handle.ready(),
    resources: Resources.find(
      {
        'meta.topicId': FlowRouter.getParam('_id'),
      },
      { sort: { type: 1 } },
    ).fetch(),
    resource: Resources.findOne({ _id: FlowRouter.getQueryParam('rs') }),
  };
})(ViewResourceApp);
