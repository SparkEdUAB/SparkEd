/* eslint class-methods-use-this: "off" */
/* eslint import/no-unresolved: "off" */

import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _Settings } from '../../api/settings/settings';
import Header from '../components/layouts/Header';

export const ThemeContext = React.createContext();

export const AppWrapper = ({ children, color }) => {
  if (!color) {
    return 'loading';
  }
  return (
    <ThemeContext.Provider value={color}>
      <div style={{ backgroundColor: color.isDark ? '#252829' : '#fff' }}>
        <Header />
        <Fragment>{children}</Fragment>
      </div>
    </ThemeContext.Provider>
  );
};
AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.object,
};

export default withTracker(() => ({
  color: _Settings.findOne(), // get the current main color
}))(AppWrapper);
