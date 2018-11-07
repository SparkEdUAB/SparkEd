import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ChangePassword = props => (
  <Fragment>
    <div className="row">
      <div className="input-field col s12">
        <input
          type="password"
          defaultValue={props.oldPassword}
          className="validate field"
          placeholder="New Password"
          name="password"
          onChange={props.handleOldPassword}
        />
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12">
        <input
          type="password"
          defaultValue={props.newPassword}
          className="validate field"
          placeholder="Old Password"
          name="password"
          onChange={props.handleNewPassword}
        />
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12">
        <input
          type="password"
          defaultValue={props.validatedPassword}
          className="validate field"
          placeholder="Confirm Password"
          name="confirm-password"
          onChange={props.validatePassword}
        />
      </div>
    </div>
  </Fragment>
);

ChangePassword.propTypes = {
  handleOldPassword: PropTypes.func.isRequired,
  handleNewPassword: PropTypes.func.isRequired,
  validatePassword: PropTypes.func.isRequired,
  newPassword: PropTypes.string.isRequired,
  oldPassword: PropTypes.string.isRequired,
  validatedPassword: PropTypes.string.isRequired,
};

export default ChangePassword;
