import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { Institution } from '../../../api/settings/institution';

export class RegisterHeader extends Component {
  renderInstitution() {
    // Render the name of the institution
    const { institution } = this.props;
    if (institution === undefined) {
      return null;
    } else if (institution.length === 0) {
      return (
        <div className="logo-container">
          <a href="/" className="inst-link">
            <img
              style={{ float: 'left' }}
              src={`/uploads/sparked.png`}
              alt="logo"
              width="80px"
              height="80px"
            />
            <h5>{'SparkEd'}</h5>
            <h6>{'Delivering Education Contents'}</h6>
          </a>
        </div>
      );
    } else {
      const {
        meta: { name, tagline },
      } = institution;
      return (
        <div className="logo-container">
          <a href="/" className="inst-link">
            <img
              style={{ float: 'left' }}
              src={`/uploads/logos/${institution._id}.${institution.ext}`}
              alt="logo"
              width="80px"
              height="80px"
            />
            <h5>{name}</h5>
            <h6>{tagline}</h6>
          </a>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="">
        {/*= ====start fixed top na===== */}
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper">{this.renderInstitution()}</div>
          </nav>
        </div>
        {/*= =====end fixed top navbar====== */}
      </div>
    );
  }
}
RegisterHeader.propTypes = {
  institution: PropTypes.object.isRequired,
};
export default withTracker(() => {
  Meteor.subscribe('institution');
  return {
    institution: Institution.findOne({}, { sort: { createdAt: -1 } }),
  };
})(RegisterHeader);
