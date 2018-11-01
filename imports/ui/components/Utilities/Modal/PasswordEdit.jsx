import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const PasswordEdit = ({ password, passwordConfirm }) => (
  <Fragment>
    <div className="row">
      <div className="input-field">
        <input
          type="password"
          defaultValue={password}
          className="validate field"
          placeholder="New Password"
          name="password"
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
        />
      </div>
    </div>
  </Fragment>
);

PasswordEdit.propTypes = {
  password: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
};

export default PasswordEdit;
