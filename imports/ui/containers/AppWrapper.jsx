/* eslint class-methods-use-this: "off" */
/* eslint import/no-unresolved: "off" */
import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import Header from '../components/layouts/Header';

export const ThemeContext = React.createContext();

export default class AppWrapper extends React.Component {
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
    const { children } = this.props;
    const { isDark } = this.state;
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

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.object,
};
