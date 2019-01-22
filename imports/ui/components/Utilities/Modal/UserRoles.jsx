import React from 'react';
import PropTypes from 'prop-types';
import M from 'materialize-css';

export class UserRoles extends React.Component {
  componentDidMount() {
    M.AutoInit();
  }
  render() {
    return (
      <select id="auth" required defaultValue={this.props.value} name="roles">
        <option value="admin">Admin</option>
        <option value="content-manager">Content-Manager</option>
        <option value="student">Student</option>
      </select>
    );
  }
}

UserRoles.propTypes = {
  value: PropTypes.string.isRequired,
};
