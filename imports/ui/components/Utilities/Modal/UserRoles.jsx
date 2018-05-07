import React from 'react';
import PropTypes from 'prop-types';

export class UserRoles extends React.Component {
  componentDidMount() {
    $('select').material_select();
  }
  render() {
    return (
      <select id="auth" required="true" defaultValue={this.props.value} name="roles">
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
