import React, { Fragment, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import i18n from 'meteor/universe:i18n';
import Languages from '../Language/Languages';
import ChangePassword from './ChangePassword';
import MainModal from '../../modals/MainModal';
import { checkPassword } from '../Accounts/AccountFunction';

const T = i18n.createComponent();

const takeToDashboard = () => {
  FlowRouter.go('/dashboard/accounts');
};

const logUserOut = () => {
  Meteor.logout(error => {
    if (!error) {
      FlowRouter.go('/login');
    } else {
      return null;
    }
  });
};
class UserInfo extends Component {
  state = {
    isVisible: false,
    title: 'Change Password',
    reject: 'Cancel',
    confirm: 'Save',
    isOpen: false,
    password: '',
    oldPassword: '',
    passwordConfirm: '',
    error: '',
    checked: localStorage.getItem('isDark') || false,
  };

  handleOldPasswordChange = e => {
    this.setState({
      oldPassword: e.target.value,
    });
  };
  handlePasswordConfirm = e => {
    this.setState({
      password: e.target.value,
    });
  };

  validatePassword = e => {
    this.setState({
      passwordConfirm: e.target.value,
    });
  };
  close = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };
  handleSubmit = e => {
    e.preventDefault();
    const { oldPassword, password, passwordConfirm } = this.state;
    const response = checkPassword(password, passwordConfirm);
    if (!response.status) {
      this.setState({
        error: response.msg,
      });
      return false;
    }
    Accounts.changePassword(oldPassword, password, err => {
      err
        ? this.setState({
          error: err.reason,
        })
        : FlowRouter.go('/login');
    });
  };
  handleNightMode = async () => {
    const { checked } = await this.state;
    await this.setState({ checked: !checked });
    // change the color theme from here
    localStorage.setItem('isDark', await this.state.checked);
    Meteor.call('setDarkMode', await this.state.checked, err => {
      if (err) {
        console.log(err.reason);
      }
      console.log('changed the mode');
    });
  };

  render() {
    const user = Meteor.user();
    const {
      isVisible,
      isOpen,
      title,
      confirm,
      reject,
      password,
      oldPassword,
      passwordConfirm,
      error,
      checked,
    } = this.state; // eslint-disable-line
    // const isChecked = 
    return (
      <Fragment>
        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
        >
          <ChangePassword
            handleOldPassword={this.handleOldPasswordChange}
            handleNewPassword={this.handlePasswordConfirm}
            validatePassword={this.validatePassword}
            oldPassword={oldPassword}
            newPassword={password}
            validatedPassword={passwordConfirm}
            error={error}
          />
        </MainModal>
        <ul id="slide-out" className="sidenav">
          {user ? (
            <Fragment>
              <li id="dropBody">
                <div id="accName">
                  {`${user.profile.name} `}
                  <span id="userEmail">{user.emails[0].address}</span>
                  <span id="uiWrapper">
                    <button className="btn teal" onClick={logUserOut}>
                      <T>common.accounts.Logout</T>
                    </button>
                  </span>
                  <span id="uiWrapper">
                    <button
                      className="btn teal"
                      onClick={() =>
                        this.setState(prevState => ({
                          isOpen: !prevState.isOpen,
                        }))
                      }
                    >
                      Change Password
                    </button>
                  </span>
                </div>
              </li>
              {Meteor.userId() && isVisible ? (
                <li>
                  <ChangePassword />
                </li>
              ) : null}

              <br />
              <br />
              <li>
                <Languages />
              </li>
              <li>
                {Roles.userIsInRole(Meteor.userId(), [
                  'admin',
                  'content-manager',
                ]) ? (
                  <button className="btn teal" onClick={takeToDashboard}>
                    Dashboard
                  </button>
                ) : (
                  <span />
                )}
              </li>
            </Fragment>
          ) : (
            <li id="dropBody">
              <div id="accName">
                <button
                  className="btn teal"
                  onClick={() => FlowRouter.go('/login')}
                >
                  You are not Logged in
                </button>
              </div>
            </li>
          )}
          <div className="switch">
            <label>
              Day Mode
              <input
                type="checkbox"
                onChange={this.handleNightMode}
                checked={checked}
              />
              <span className="lever" />
              Night Mode
            </label>
          </div>
        </ul>
      </Fragment>
    );
  }
}

export default UserInfo;
