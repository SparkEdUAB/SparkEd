import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Languages from './Language';

const takeToDashboard = () => {
  FlowRouter.go('/dashboard/accounts');
};

const openSettings = () => {
  Meteor.logout((error) => {
    if (!error) {
      FlowRouter.go('/login');
    } else {
      return null;
    }
  });
};

const UserInfo = () => {
  const user = Meteor.user();
  if (user) {
    return (
      <ul id="dropdown1" className="dropdown-content">
        <li id="dropBody">
          <div id="accName">
            {`${user.profile.name} `}
            <span id="userEmail">{user.emails[0].address}</span>

            <span>{!Meteor.loggingIn() ? '' : Meteor.userId()}</span>

            <span id="uiWrapper">
              <a href="#" onClick={openSettings}>
                {Meteor.userId() ? (
                  <span className="btn-flat" id="accounts-button">
                    Logout
                  </span>
                ) : (
                  <span className="btn-flat" id="accounts-button">
                    You are not Logged in
                  </span>
                )}
              </a>
            </span>
          </div>
        </li>
        <li id="dropFooter">
          {Roles.userIsInRole(Meteor.userId(), ['admin', 'content-manager']) ? (
            <div className="valign center-align" id="dashStylesDrop">
              <span
                className="dashLink link waves-effect waves-teal btn-flat"
                onClick={takeToDashboard}
              >
                dashboard
              </span>
            </div>
          ) : (
            <span />
          )}
        </li>
      </ul>
    );
  }
  return <span />;
};

export default UserInfo;
