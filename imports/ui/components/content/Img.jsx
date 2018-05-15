/* eslint class-methods-use-this: "off" */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class IMG extends Component {
  componentDidMount() {
    $('.materialboxed').materialbox();
  }
  render() {
    return (
      <div className="">
        <img
          className="materialboxed responsive-img"
          src={this.props.link}
          data-caption={this.props.img.name}
        />
      </div>
    );
  }
}

IMG.propTypes = {
  img: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};
