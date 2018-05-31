/* eslint import/no-unresolved: 'off' */
import React from 'react';
import { PropTypes } from 'prop-types';
import Video from './Players/Video';
import PDF from './Players/Pdf';
import IMG from './Players/Img';
import Audio from './Players/Audio';
import Download from './Players/Download';
import TextView from './Players/TextView';

const ResourceRender = (props) => {
  const { resource, Link } = props;

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
  } else if (resource.ext === 'txt') {
    return <TextView text={resource} link={Link} />;
  } else if (resource.type === 'audio/mp3' || resource.type === 'audio/ogg') {
    return <Audio audio={resource} link={Link} />;
  }
  // if the filetype isn't known avoid crashing the application
  return <Download download={resource} link={Link} />;
};
ResourceRender.propTypes = {
  resource: PropTypes.object.isRequired,
  Link: PropTypes.string,
};

export default ResourceRender;
