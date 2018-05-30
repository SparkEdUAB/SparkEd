import React from 'react';
import { PropTypes } from 'prop-types';

const Video = props => (
  <div className="videoViewerContainer">
    <video controls autoPlay className="videoViewer">
      <source src={props.link} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
);

Video.propTypes = {
  link: PropTypes.string.isRequired,
};

export default Video;
