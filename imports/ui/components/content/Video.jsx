import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class Video extends Component {
  render() {
    const name = `${this.props.video._id}.${this.props.video.ext}`;
    return (
      <div className="videoViewerContainer">
        <video controls autoPlay className="videoViewer">
          <source src={`/uploads/resources/${name}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
}

Video.propTypes = {
  video: PropTypes.object.isRequired,
};
