import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const AccountEditModal = ({ email, fname }) => (
  <Fragment>
    <div className="row">
      <div className="input-field">
        <input
          type="email"
          readOnly
          value={email}
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
          defaultValue={fname}
          className="validate field"
          placeholder="First name"
          name="fname"
        />
      </div>
    </div>
  </Fragment>
);

AccountEditModal.propTypes = {
  email: PropTypes.string.isRequired,
  fname: PropTypes.string.isRequired,
};

export default AccountEditModal;
