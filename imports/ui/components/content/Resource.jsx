import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { ThemeContext } from '../../containers/AppWrapper';

export default class Resource extends Component {
  static viewResource(url) {
    Session.set('isMounted', false);
    FlowRouter.go(url);
  }

  static getIcon(type) {
    const fileTypesIcon = {
      video: 'fa-television',
      pdf: 'fa fa-file-pdf-o ',
      ppt: 'fa-television',
      docx: 'fa-file-text',
      image: 'fa-picture-o',
      audio: 'fa-headphones',
      text: 'fa-file-text',
    };
    return fileTypesIcon[type];
  }

  render() {
    let fileType = this.props.file;
    if (fileType === undefined) {
      fileType = '';
    } else {
      const fileTypeData = fileType.split('/');
      [fileType] = fileTypeData;
      fileType = Resource.getIcon(fileType);
      fileType =
        fileType === undefined ? Resource.getIcon(fileTypeData[1]) : fileType;
    }
    const { resource, resourceId, topicId } = this.props;
    return (
      <ThemeContext.Consumer>
        {color => (
          <Fragment>
            <div className="col m4">
              <span
                className="link"
                onClick={Resource.viewResource.bind(
                  this,
                  `/view_resource/${topicId}?rs=${resourceId}&scid=${FlowRouter.getParam('_id')}`,
                )}
              >
                <span className={`resource-item fa ${fileType}`} />
                <span style={{ color: color.isDark ? '#fff' : '#000' }}>
                  {resource.replace(/\.[^/.]+$/, '')}
                </span>
              </span>
            </div>
          </Fragment>
        )}
      </ThemeContext.Consumer>
    );
  }
}

Resource.propTypes = {
  resource: PropTypes.string.isRequired,
  topicId: PropTypes.string,
  unitId: PropTypes.string,
  resourceId: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
};
