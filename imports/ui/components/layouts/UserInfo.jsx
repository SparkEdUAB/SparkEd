import React from 'react';
import { Meteor } from 'meteor/meteor';

const takeToDashboard = () => {
  FlowRouter.go('/dashboard/accounts');
};

const UserInfo = () => {
  if (Roles.userIsInRole(Meteor.userId(), ['admin', 'content-manager'])) {
    return (
      <div className="valign center-align" id="dashStylesDrop">
        <span className="dashLink link waves-effect waves-teal btn-flat" onClick={takeToDashboard}>
          dashboard
        </span>
      </div>
    );
  }
  return <span />;
};

export default UserInfo;
