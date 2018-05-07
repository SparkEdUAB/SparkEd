import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AccountEditModal extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="input-field">
            <input
              type="email"
              readOnly
              value={this.props.email}
              className="validate field"
              placeholder="email"
              name="email"
            />
          </div>
        </div>
        <div className="row">
          <div className="input-field">
            <input
              type="text"
              defaultValue={this.props.fname}
              className="validate field"
              placeholder="First name"
              name="fname"
            />
          </div>
        </div>
      </div>
    );
  }
}

AccountEditModal.propTypes = {
  email: PropTypes.string.isRequired,
  fname: PropTypes.string.isRequired,
};
