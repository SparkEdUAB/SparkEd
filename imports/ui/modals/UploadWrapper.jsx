import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { styles } from './ModalStyle.js';
import FileUploadComponent from '../containers/FileUploadComponent';

export default class UploadWrapper extends Component {
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div style={styles.backdropStyle}>
        {' '}
        <div style={styles.modalStyle}>
          <a
            href=""
            className="pull-right waves-effect waves-light btn fa fa-times"
            onClick={this.props.close}
          />
          <h5>{this.props.title}</h5>
          <div className="row">
            <FileUploadComponent />
          </div>
        </div>
      </div>
    );
  }
}

UploadWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};
