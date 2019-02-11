import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import i18n from 'meteor/universe:i18n';
import ViewResource from './ViewResource'; // eslint-disable-line
import { ThemeContext } from '../../containers/AppWrapper'; // eslint-disable-line

export const T = i18n.createComponent();

export default class ViewFrame extends Component {
  renderResources(color) {
    const { resources } = this.props;
    let index = 0;
    if (!resources) {
      return null;
    }
    // eslint-disable-next-line
    return resources.map(resource => (
      <ViewResource key={index++} resource={resource} color={color} />
    ));
  }

  static getUrl() {
    const sectionId = FlowRouter.getQueryParam('scid');
    const url = `/contents/${sectionId}?rs=${FlowRouter.getParam('_id')}`;
    return url;
  }
  render() {
    return (
      <ThemeContext.Consumer>
        {color => (
          <Fragment>
            <div className="sideNavHeadingUnderline">
              {FlowRouter.getQueryParam('scid') ? (
                <a
                  title="Go back to Topics"
                  id="backButtonLink"
                  href={ViewFrame.getUrl()}
                >
                  <i
                    className={`fa fa-chevron-circle-left ${color.isDark &&
                      'white-text'} fa-lg`}
                  />
                </a>
              ) : null}
              <p
                className="sideNavHeading"
                style={{ color: color.isDark ? '#fff' : '#000' }}
              >
                <T>common.manage.resources</T>
              </p>
            </div>
            <ul>{this.renderResources(color.isDark ? '#fff' : '#000')}</ul>
          </Fragment>
        )}
      </ThemeContext.Consumer>
    );
  }
}

ViewFrame.propTypes = {
  resources: PropTypes.array,
};
