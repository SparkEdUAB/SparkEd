import React from 'react';
import PropTypes from 'prop-types';

const InstitutionDetail = ({ institution }) => {
  if (!institution) {
    return null;
  } else if (!institution.length) {
    return (
      <div className="logo-container">
        <a href="/" className="inst-link">
          <h5>{'SparkEd'}</h5>
          <h6>{'Delivering Education Contents'}</h6>
        </a>
      </div>
    );
  }
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
};

InstitutionDetail.propTypes = {
  institution: PropTypes.object,
};

export default InstitutionDetail;
