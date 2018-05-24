/* eslint class-methods-use-this: "off" */
/* eslint import/no-unresolved: "off" */

import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import Header from '../components/layouts/Header';

export default class AppWrapper extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Fragment>{this.props.yield}</Fragment>
      </Fragment>
    );
  }
}

AppWrapper.propTypes = {
  yield: PropTypes.node.isRequired,
};
