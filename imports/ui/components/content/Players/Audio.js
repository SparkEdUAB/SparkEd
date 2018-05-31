import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';

const Audio = props => (
  <Fragment>
    Audio File named <strong>{props.audio.name} </strong> <br />
    <audio autoPlay controls src={props.link} />
  </Fragment>
);

Audio.propTypes = {
  link: PropTypes.string.isRequired,
  audio: PropTypes.object,
};
export default Audio;
