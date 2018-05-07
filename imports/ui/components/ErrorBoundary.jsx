import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Header from '../components/layouts/Header';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, info });
  }
  takeBack = e => {
    e.preventDefault();
    return history.go(-1);
  };
  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1 className="notFoundHead">
            Error Happened <i className="fa fa-frown-o" />
          </h1>
          <h3 className="notFound">
            {' '}
            Sorry it seems like something went wrong <br />Try
            <a href="" onClick={e => this.takeBack(e)}>
              {' '}
              go back
            </a>
          </h3>
        </>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
