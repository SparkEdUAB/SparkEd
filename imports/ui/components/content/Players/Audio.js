import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';

const Audio = props => (
  <Fragment>
    Audio File named audio {props.name} <br />
    <audio autoPlay controls autorun="true" src={props.link} />
  </Fragment>
);

Audio.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string,
};
export default Audio;
