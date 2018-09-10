import React from 'react';
import PropTypes from 'prop-types';

const InstitutionDetail = ({ institution, name, tagline }) => {
  if (!institution) {
    return (
      <div className="logo-container">
        <a href="/" className="inst-link">
          <h5>{name}</h5>
          <h6>{tagline}</h6>
        </a>
      </div>
    );
  }
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
};

InstitutionDetail.propTypes = {
  institution: PropTypes.object,
  name: PropTypes.string,
  tagline: PropTypes.string,
};

export default InstitutionDetail;
