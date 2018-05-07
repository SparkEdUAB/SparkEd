import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ViewResource from './ViewResource.jsx';

export default class ViewFrame extends Component {
  renderResources() {
    const { resources } = this.props;
    let index = 0;
    if (!resources) {
      return null;
    }
    return resources.map(resource => <ViewResource key={index++} resource={resource} />);
  }

  static getUrl() {
    const sectionId = FlowRouter.getQueryParam('scid');
    const url = `/contents/${sectionId}?rs=${FlowRouter.getParam('_id')}`;
    return url;
  }
  render() {
    return (
      <div className=" ">
        <div className="sideNavHeadingUnderline">
          <a title="Go back to Topics" id="backButtonLink" href={ViewFrame.getUrl()}>
            <i className="fa fa-chevron-circle-left fa-lg" />
          </a>
          <p className="sideNavHeading">Resources</p>
        </div>
        <ul>{this.renderResources()}</ul>
      </div>
    );
  }
}

ViewFrame.propTypes = {
  resources: PropTypes.array,
};
