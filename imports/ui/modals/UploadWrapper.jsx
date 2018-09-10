import React from 'react';
import { PropTypes } from 'prop-types';
import { styles } from './ModalStyle.js';
import FileUploadComponent from '../containers/FileUploadComponent';

const UploadWrapper = ({ show, close, title }) => {
  if (!show) {
    return null;
  }
  return (
    <div style={styles.backdropStyle}>
      {' '}
      <div style={styles.modalStyle}>
        <a
          href=""
          className="pull-right waves-effect waves-light btn fa fa-times"
          onClick={close}
          style={{ backgroundColor: '#006b76' }}
        />
        <h5>{title}</h5>
        <div className="row">
          <FileUploadComponent />
        </div>
      </div>
    </div>
  );
};

export default UploadWrapper;

UploadWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};
