import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ChangePassword = props => (
  <Fragment>
    <div className="row">
      <div className="input-field col s12">
        <input
          type="password"
          defaultValue={props.password}
          className="validate field"
          placeholder="New Password"
          name="password"
          onChange={props.handlePasswordChange}
        />
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12">
        <input
          type="password"
          defaultValue={props.oldPassword}
          className="validate field"
          placeholder="New Password"
          name="password"
          onChange={props.validatePassword}
        />
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12">
        <input
          type="password"
          defaultValue={props.passwordConfirm}
          className="validate field"
          placeholder="Confirm Password"
          name="confirm-password"
          onChange={props.handlePasswordConfirm}
        />
      </div>
    </div>
  </Fragment>
);

ChangePassword.propTypes = {
  handlePasswordChange: PropTypes.func.isRequired,
  handlePasswordConfirm: PropTypes.func.isRequired,
  validatePassword: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  oldPassword: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
};

export default ChangePassword;
