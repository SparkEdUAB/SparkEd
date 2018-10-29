import React from 'react';
import { PropTypes } from 'prop-types';
import ReactPlayer from 'react-player';

const Video = props => (
  <div className="videoViewerContainer">
    <ReactPlayer
      className="react-player"
      width="100%"
      height="100%"
      url={props.link}
      playing={true}
      loop={true}
      controls
    />
  </div>
);

Video.propTypes = {
  link: PropTypes.string.isRequired,
};

export default Video;
