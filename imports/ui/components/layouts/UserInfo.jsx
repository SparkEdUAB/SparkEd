import React, { Fragment, PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Languages from '../Language/Languages';
import ChangePassword from './ChangePassword';
import MainModal from '../../modals/MainModal';
import { checkPassword } from '../Accounts/AccountFunction';
import { ThemeContext } from '../../containers/AppWrapper';

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
class UserInfo extends PureComponent {
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
    } = this.state; // eslint-disable-line
    return (
      <ThemeContext.Consumer>
        {({ state }) => (
          <div>
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

            <ul
              id="slide-out"
              className="sidenav"
              style={{
                backgroundColor: state.isDark ? state.mainDark : '#ffffff',
                color: state.isDark ? '#ffffff' : '#000000',
              }}
            >
              {
                user ?
                  <Fragment>
                    <li id="dropBody">
                      <div id="accName">
                        {`${user.profile.name} `}
                        <span id="userEmail">{user.emails[0].address}</span>
                        <span id="uiWrapper">
                          <a href=""
                            onClick={logUserOut}
                            className="tooltipped"
                            data-position="bottom"
                            data-tooltip="Click here to logout">

                            <T>common.accounts.Logout</T>
                          </a>
                        </span>
                        <span id="uiWrapper">
                          <a
                            href=""
                            onClick={() =>
                              this.setState(prevState => ({
                                isOpen: !prevState.isOpen,
                              }))
                            }
                            className="tooltipped"
                            data-position="bottom"
                            data-tooltip="Click here to change your password">

                            Change Password
                        </a>
                        </span>
                      </div>
                    </li>
                    {Meteor.userId() && isVisible ? (
                      <li
                      >
                        <ChangePassword />
                      </li>
                    ) : null}
                    <br />
                    <br />
                    <li
                      className="tooltipped"
                      data-position="bottom"
                      data-tooltip="Click here to change the language"
                    >
                      <Languages />
                    </li>
                    <li>
                      <div id="accName">
                        {Roles.userIsInRole(Meteor.userId(), [
                          'admin',
                          'content-manager',
                        ]) ? (
                            <a href=""
                              className="tooltipped"
                              data-position="bottom"
                              data-tooltip="Click here to go to dashboard"
                              onClick={takeToDashboard}>
                              Dashboard
                            </a>
                          ) : (
                            <span />
                          )}
                      </div>
                    </li>
                  </Fragment>
                  :
                  <li id="dropBody">
                    <div id="accName">
                      <a
                        href=""
                        onClick={() => FlowRouter.go('/login')}
                        className="tooltipped"
                        data-position="bottom"
                        data-tooltip="Click here to login"
                      >
                        You are not Logged in
                    </a>
                    </div>
                  </li>

              }
              <li>
                <div className="switch tooltipped"
                  data-position="bottom"
                  data-tooltip="Change SparkEd theme"
                  style={{
                    marginLeft: '3.5em',
                  }}
                >
                  <label>
                    Day Mode
                  <input
                      type="checkbox"
                      onChange={this.props.handleNightMode}
                      checked={this.props.checked}
                    />
                    <span className="lever" />
                    Night Mode
                </label>
                </div>
              </li>
            </ul>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
UserInfo.propTypes = {
  handleNightMode: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default UserInfo;
