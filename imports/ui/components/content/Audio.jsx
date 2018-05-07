import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';

export default class Audio extends Component {
  render() {
    const name = `${this.props.audio._id}.${this.props.audio.ext}`;
    return (
      <Fragment>
        Audio File named  audio {name} <br />
        <audio autoPlay controls autorun src={`/uploads/resources/${name}`} width="80%" height="80%" />

      </Fragment>
    );
  }
}

Audio.propTypes = {
  audio: PropTypes.object.isRequired,
};
