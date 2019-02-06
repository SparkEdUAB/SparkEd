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
export class AppWrapper extends React.Component {
  state = {
    isDark: false,
    mainDark: '#212121',
    main: '#005555',
  };
  toggleDarkMode = () => {
    this.setState(state => ({
      isDark: !state.isDark,
    }));
  };
  render() {
    const { color, children } = this.props;
    const { isDark } = this.state;
    if (!color) {
      return 'loading';
    }
    return (
      <ThemeContext.Provider
        value={{ state: this.state, toggle: this.toggleDarkMode }}
      >
        <div style={{ backgroundColor: isDark ? '#252829' : '#fff' }}>
          <Header />
          <Fragment>{children}</Fragment>
        </div>
      </ThemeContext.Provider>
    );
  }
}
// export const AppWrapper = ({ children, color }) => {
// if (!color) {
//   // color = colors; //eslint-disable-line
//   return 'loading';
// }
// return (
//   <ThemeContext.Provider value={color}>
//     <div style={{ backgroundColor: color.isDark ? '#252829' : '#fff' }}>
//       <Header />
//       <Fragment>{children}</Fragment>
//     </div>
//   </ThemeContext.Provider>
// );
// };
AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.object,
};

export default withTracker(() => ({
  color: _Settings.findOne({}), // get the current main color
}))(AppWrapper);
