import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';

export default class Audio extends Component {
  render() {
    const { link, name } = this.props;
    return (
      <Fragment>
        Audio File named audio {name} <br />
        <audio autoPlay controls autorun="true" src={link} />
      </Fragment>
    );
  }
}

Audio.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string,
};
