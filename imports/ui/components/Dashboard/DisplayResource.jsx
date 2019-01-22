import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { References } from '../../../api/resources/resources';
import { _Courses } from '../../../api/courses/courses';
import ResourceRender from '../content/ResourceRender.jsx';
import { courseName } from '../content/CourseContent.jsx';
import { SideMenu } from '../content/ReferenceLibrary.jsx';
import ErrorBoundary from '../ErrorBoundary';

export class DisplayResource extends Component {
  static extractFileType(data) {
    const fileTypeData = data.split('/');
    let type = fileTypeData[0];
    if (type === 'application') {
      [, type] = fileTypeData;
    }
    return type;
  }

  fetchResource() {
    let { resource } = this.props;

    if (!resource) {
      resource = null;
    }
    return resource;
  }

  renderResource() {
    let resource = this.fetchResource();
    if (!resource) {
      return null;
    }

    const _resource = {
      type: resource.type,
      ext: resource.ext,
      name: resource.name,
      _id: resource._id,
    };
    const link = `/cdn/storage/References/${resource._id}/original/${resource._id}.${resource.ext}`;
    return <ResourceRender resource={_resource} Link={link} />;
  }
  // display the related files and if not present put a back button
  renderResources() {
    const { resources } = this.props;
    if (!resources || resources.length < 1) {
      return <SideMenu address={'/reference'} name={'Go Back'} />;
    }

    return resources.map(res => (
      <SideMenu
        key={res._id}
        address={`/extra/view_resource/${res.courseId}?rs=${res._id}`}
        name={res.name}
      />
    ));
  }

  render() {
    let resourceName = '';
    let resourceType = '';
    const { resource } = this.props;
    if (!resource) {
      return '';
    }
    resourceName = resource.name;
    resourceType = resource.ext;
    return (
      <ErrorBoundary>
        <div className="row">
          <div className="col s12 m9">
            <h4 className="teal-text text-lighten-1 center">{resourceName}</h4>
            <span className="right grey-text" />

            <div className="">{this.renderResource()}</div>
          </div>
          <>
            {// if the admin is viewing the resource from the dashboard, keep them there
            FlowRouter.getRouteName() === 'DisplayResource' ? (
              <span />
            ) : (
              <>
                <div className="col m2 s12 menu_simple">
                  <ul className="item-container">
                    <li className="">
                      <a disabled={true} id="dashtweek" href="" className="center">
                        {courseName(this.props.courseName) || 'Anonymous'}
                      </a>
                    </li>
                    <li>
                      <a href="/reference">
                        <i className="fa fa-arrow-left" /> Back to Library
                      </a>
                    </li>
                    {this.renderResources()}
                  </ul>
                </div>
              </>
            )}
          </>
        </div>
      </ErrorBoundary>
    );
  }
}

DisplayResource.propTypes = {
  resource: PropTypes.object,
  courseName: PropTypes.object,
};

// show references that don't belong to any course but they are extra
export function getCourseId() {
  const id = FlowRouter.getParam('_id');
  if (id.toString() === 'null') {
    return null;
  }
  return id;
}

export function getResourceId() {
  const route = FlowRouter.getRouteName();
  if (route === 'DisplayResource') {
    return FlowRouter.getParam('_id');
  }
  return FlowRouter.getQueryParam('rs');
}

export default withTracker(() => {
  Meteor.subscribe('resources');
  Meteor.subscribe('courses');
  Meteor.subscribe('filedetails');
  Meteor.subscribe('references');
  return {
    resources: References.find({ courseId: getCourseId() }).fetch(),
    resource: References.findOne({ _id: getResourceId() }),
    courseName: _Courses.findOne({ _id: getCourseId() }, { fields: { name: 1 } }),
  };
})(DisplayResource);
