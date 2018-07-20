import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class SaveButton extends Component {
  static propTypes = {
    actionFunc: PropTypes.func,
    title: PropTypes.string,
    backgroundColor: PropTypes.string.isRequired,
  };
  render() {
    const { actionFunc, title, backgroundColor } = this.props;
    return (
      <button
        className="btn waves-effect waves-light center pulse"
        role="submit"
        onClick={actionFunc}
        title={title}
        style={{ backgroundColor }}
      >
        Save
      </button>
    );
  }
}
