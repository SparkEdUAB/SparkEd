import React, { Fragment, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import i18n from 'meteor/universe:i18n';
import Languages from '../Language/Languages';
import ChangePassword from './ChangePassword';

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
  };
  render() {
    const user = Meteor.user();
    const { isVisible } = this.state;
    return (
      <ul id="dropdown1" className="dropdown-content">
        {user ? (
          <Fragment>
            <li id="dropBody">
              <div id="accName">
                {`${user.profile.name} `}
                <span id="userEmail">{user.emails[0].address}</span>
                <span id="uiWrapper">
                  <a href="#" onClick={logUserOut}>
                    <span className="btn-flat" id="accounts-button">
                      <T>common.accounts.Logout</T>
                    </span>
                  </a>
                </span>
                <span id="uiWrapper">
                  <a href="#" onClick={logUserOut}>
                    <span className="btn-flat" id="accounts-button">
                      Change Password
                    </span>
                  </a>
                </span>
              </div>
            </li>
            <li>
              <ChangePassword />
            </li>
            <li id="dropBody">
              <Languages />
            </li>
            <li id="dropFooter">
              {Roles.userIsInRole(Meteor.userId(), [
                'admin',
                'content-manager',
              ]) ? (
                <div className="valign center-align" id="dashStylesDrop">
                  <span
                    className="dashLink link waves-effect teal btn-flat"
                    onClick={takeToDashboard}
                  >
                    dashboard
                  </span>
                </div>
              ) : (
                <span />
              )}
            </li>
          </Fragment>
        ) : (
          <li id="dropBody">
            <div id="accName">
              <span
                className="btn-flat"
                id="accounts-button"
                onClick={() => FlowRouter.go('/login')}
              >
                You are not Logged in
              </span>
            </div>
          </li>
        )}
      </ul>
    );
  }
}

export default UserInfo;
