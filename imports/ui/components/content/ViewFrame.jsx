import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import i18n from 'meteor/universe:i18n';
import ViewResource from './ViewResource';

export const T = i18n.createComponent();

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
          {
            FlowRouter.getQueryParam('scid')
            ?
            <a title="Go back to Topics" id="backButtonLink" href={ViewFrame.getUrl()}>
              <i className="fa fa-chevron-circle-left fa-lg" />
            </a>
            :
            null
          }
          <p className="sideNavHeading">
            <T>common.manage.resources</T>
          </p>
        </div>
        <ul>{this.renderResources()}</ul>
      </div>
    );
  }
}

ViewFrame.propTypes = {
  resources: PropTypes.array,
};
