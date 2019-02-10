import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const PasswordEdit = ({
  password,
  passwordConfirm,
  validatePassword,
  confirmPassword,
  error,
  color,
}) => (
  <Fragment>
    <div className="row">
      <div className="input-field">
        <input
          type="password"
          defaultValue={password}
          className="validate field"
          placeholder="New Password"
          style={{ color }}
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
          style={{ color }}
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
  color: PropTypes.string,
  error: PropTypes.string.isRequired,
  validatePassword: PropTypes.func.isRequired,
  confirmPassword: PropTypes.func.isRequired,
};

export default PasswordEdit;
