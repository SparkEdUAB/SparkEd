/* eslint class-methods-use-this: "off" */
/* eslint import/no-unresolved: "off" */

import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import Header from '../components/layouts/Header';
import colorReducer from '../reducers/colorReducer';

const store = createStore(colorReducer, devToolsEnhancer());

const AppWrapper = props => (
  <Provider store={store}>
    <Fragment>
      <Header />
      <Fragment>{props.children}</Fragment>
    </Fragment>
  </Provider>
);

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppWrapper;
