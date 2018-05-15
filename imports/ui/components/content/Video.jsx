import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class Video extends Component {
  render() {
    const { link } = this.props;
    return (
      <div className="videoViewerContainer">
        <video controls autoPlay className="videoViewer">
          <source src={link} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
}

Video.propTypes = {
  link: PropTypes.string.isRequired,
};
