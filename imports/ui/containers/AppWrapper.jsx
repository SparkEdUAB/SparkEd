/* eslint class-methods-use-this: "off" */
/* eslint import/no-unresolved: "off" */

import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
// import { Session } from 'meteor/session';
import { _Settings } from '../../api/settings/settings';
import Header from '../components/layouts/Header';

export const ThemeContext = React.createContext();

// const colors = {
//   main: Session.get('main'),
//   isDark: Session.get('isDark'),
//   mainDark: Session.get('main'),
//   bodyBackground: '',
// };

export const AppWrapper = ({ children, color }) => {
  if (!color) {
    // color = colors; //eslint-disable-line
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
  color: _Settings.findOne({}), // get the current main color
}))(AppWrapper);
