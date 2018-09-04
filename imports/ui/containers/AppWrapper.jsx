/* eslint class-methods-use-this: "off" */
/* eslint import/no-unresolved: "off" */

import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _Settings } from '../../api/settings/settings';
import Header from '../components/layouts/Header';

export const ThemeContext = React.createContext();

export const AppWrapper = ({ children, colors }) => {
  if (!colors) {
    return 'loading';
  }
  return (
    <ThemeContext.Provider value={colors}>
    <Fragment>
      <Header />
      <Fragment>{children}</Fragment>
    </Fragment>
  </ThemeContext.Provider>
  )
}
AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  colors: PropTypes.object,
};

export default withTracker(() => ({
  colors: _Settings.findOne(), // get the current main color
}))(AppWrapper);
