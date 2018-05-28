/* eslint class-methods-use-this: "off" */
/* eslint import/no-unresolved: "off" */

import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import Header from '../components/layouts/Header';
import { ThemeContext } from './ThemeContext';

// export default class AppWrapper extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return (
//       <ThemeContext.Consumer>
//         {theme => (
//           <Fragment {...props}>
//             <Header />
//             <Fragment>{this.props.children}</Fragment>
//           </Fragment>
//         )}
//       </ThemeContext.Consumer>
//     );
//   }
// }

const AppWrapper = props => (
  <ThemeContext.Provider>
    {theme => (
      <Fragment {...props} style={{ backgroundColor: theme.background }}>
        <Header />
        <Fragment>{this.props.children}</Fragment>
      </Fragment>
    )}
  </ThemeContext.Provider>
);

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppWrapper;
