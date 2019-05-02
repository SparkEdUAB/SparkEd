import React, { useState, Fragment } from 'react';
import { PropTypes } from 'prop-types';

function Download({ link }) {
  const [isDownloaded, setDownloaded] = useState(false);

  function downLoadFile() {
    confirm('Do you want to Download the file?') // eslint-disable-line
      ? setDownloaded(true)
      : setDownloaded(false);
  }
  return (
    <Fragment>
      <p>
        This file is not viewable by the browser. click the button to download{' '}
      </p>
      <button className="btn" onClick={downLoadFile}>
        <span className="fa fa-download" /> Download
      </button>
      {isDownloaded && <embed src={link} />}
      {!isDownloaded ? (
        <p>Based on your choice the File is not downloaded</p>
      ) : (
        <p>The files was downloaded</p>
      )}
      <hr />
    </Fragment>
  );
}
export default Download;

Download.propTypes = {
  download: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};
