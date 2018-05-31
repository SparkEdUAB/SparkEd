import React from 'react';
import { PropTypes } from 'prop-types';

const Audio = props => (
  <p>
    <iframe src={props.link} frameBorder="0" height="400" width="95%" />
  </p>
);

Audio.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string,
};
export default Audio;
