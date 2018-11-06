import React, { Component, Fragment } from 'react';

class ChangePassword extends Component {
  state = {
    oldPassword: '',
    passwordConfirm: '',
    error: '',
  };
  validatePassword = () => {};
  confirmPassword = () => {};
  render() {
    const {
      oldPassword, password, passwordConfirm, error,
    } = this.state;
    return (
      <Fragment>
        <div className="row">
          <div className="input-field col s12">
            <input
              type="password"
              defaultValue={oldPassword}
              className="validate field"
              placeholder="New Password"
              name="password"
              onChange={this.validatePassword}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input
              type="password"
              defaultValue={password}
              className="validate field"
              placeholder="New Password"
              name="password"
              onChange={this.validatePassword}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input
              type="password"
              defaultValue={passwordConfirm}
              className="validate field"
              placeholder="Confirm Password"
              name="confirm-password"
              onChange={this.confirmPassword}
            />
          </div>
        </div>
        <div className="row center">
          <button className="btn">Save</button>
        </div>
      </Fragment>
    );
  }
}

export default ChangePassword;
