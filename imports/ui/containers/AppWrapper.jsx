/* eslint class-methods-use-this: "off" */
/* eslint import/no-unresolved: "off" */

import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import Header from '../components/layouts/Header';

const AppWrapper = props => (
  <Fragment>
    <Header />
    <Fragment>{props.children}</Fragment>
  </Fragment>
);

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppWrapper;
