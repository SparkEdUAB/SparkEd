import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Video from './Video.jsx';
import PDF from './Pdf.jsx';
import IMG from './Img.jsx';
import Audio from './Audio';
import Download from './Download';

export default class ResourceRender extends Component {
  render() {
    // resource ====== file;
    const { resource, Link } = this.props;
    if (
      resource.type === 'video' ||
      resource.ext === 'mp4' ||
      resource.ext === 'webm' ||
      resource.ext === 'ogg'
    ) {
      return <Video video={resource} link={Link} />;
    } else if (resource.ext === 'pdf') {
      return <PDF pdf={resource} link={Link} />;
    } else if (
      resource.ext === 'image' ||
      resource.ext === 'jpeg' ||
      resource.ext === 'jpg' ||
      resource.ext === 'png'
    ) {
      return <IMG img={resource} link={Link} />;
    } else if (
      resource.ext === 'mp3' ||
      resource.ext === 'ogg' ||
      resource.ext === 'webm' ||
      'wav'
    ) {
      return <Audio audio={resource} link={Link} />;
    } else if (resource.ext === 'txt') {
      return <TextView text={resource} link={Link} />;
    }
    // if the filetype isn't known avoid crashing the application
    return <Download download={resource} link={Link} />;
  }
}

ResourceRender.propTypes = {
  resource: PropTypes.object.isRequired,
  Link: PropTypes.string,
};
