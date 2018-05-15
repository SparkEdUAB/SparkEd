import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';

export default class Audio extends Component {
  render() {
    const { link } = this.props;
    return (
      <Fragment>
        Audio File named  audio {name} <br />
        <audio autoPlay controls autorun src={link} width="80%" height="80%" />
      </Fragment>
    );
  }
}

Audio.propTypes = {
  link: PropTypes.string.isRequired,
};
