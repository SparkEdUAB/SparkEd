import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';

export default class ViewResource extends Component {
  static setActiveItem(resourceId) {
    const id = FlowRouter.getQueryParam('rs');
    if (id === resourceId) {
      return 'active-item';
    }
    return 'cardListItem';
  }
  static changeTextColor(resourceId) {
    const id = FlowRouter.getQueryParam('rs');
    if (id === resourceId) {
      return 'active-item-color';
    }
    return 'cardListItem';
  }
  static getIcon(type) {
    const fileTypesIcon = {
      video: 'fa fa-play-circle',
      pdf: 'fa fa-file-text',
      ppt: 'fa-television',
      docx: 'fa-file-text',
    };
    return fileTypesIcon[type];
  }

  changeFile = e => {
    e.preventDefault();
    const { resource } = this.props;
    // keep sessions in case, there is need to reactively get file id from parent componenr
    Session.set('file_id', resource._id);
    FlowRouter.go(
      `/view_resource/${FlowRouter.getParam('_id')}?rs=${
        resource._id
      }&scid=${FlowRouter.getQueryParam('scid')}`,
    );
  };

  render() {
    let fileType = this.props.resource.type;
    const { resource } = this.props;
    if (!fileType) {
      fileType = '';
    } else {
      fileType = ViewResource.getIcon(fileType);
      fileType = !fileType ? ViewResource.getIcon(fileType) : fileType;
    }

    return (
      <li className={`${ViewResource.setActiveItem(resource._id)} item${resource._id}`}>
        <a
          target={'_top'}
          href={''}
          onClick={e => this.changeFile(e)}
          className={`customAtag ${ViewResource.changeTextColor(resource._id)}`}
        >
          <span className={'resourceName truncate'}>{resource.name.replace(/\.[^/.]+$/, '')}</span>
        </a>
      </li>
    );
  }
}

ViewResource.propTypes = {
  resource: PropTypes.object.isRequired,
};
