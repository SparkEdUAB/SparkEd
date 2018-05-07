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
          src={`/uploads/resources/${this.props.img._id}.${this.props.img.ext}`}
          data-caption={this.props.img.name}
        />
      </div>
    );
  }
}

IMG.propTypes = {
  img: PropTypes.object.isRequired,
};
