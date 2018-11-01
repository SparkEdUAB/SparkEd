import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const PasswordEdit = ({
  password,
  passwordConfirm,
  validatePassword,
  confirmPassword,
  error,
}) => (
  <Fragment>
    <div className="row">
      <div className="input-field">
        <input
          type="password"
          defaultValue={password}
          className="validate field"
          placeholder="New Password"
          name="password"
          onChange={validatePassword}
        />
      </div>
    </div>
    <div className="row">
      <div className="input-field">
        <input
          type="password"
          defaultValue={passwordConfirm}
          className="validate field"
          placeholder="Confirm Password"
          name="confirm-password"
          onChange={confirmPassword}
        />
      </div>
    </div>
    <div className="row">
      <p className="red-text">{error}</p>
    </div>
  </Fragment>
);

PasswordEdit.propTypes = {
  password: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  validatePassword: PropTypes.func.isRequired,
  confirmPassword: PropTypes.func.isRequired,
};

export default PasswordEdit;
