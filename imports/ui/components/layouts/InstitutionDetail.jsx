import React from 'react';
import PropTypes from 'prop-types';

const InstitutionDetail = ({ institution, name, tagline }) => {
  if (!institution) {
    return (
      <div className="logo-container" style={{ pointer: 'cursor', marginLeft: -52 }}>
        <span onClick={() => FlowRouter.go('/')} className="inst-link">
          <h5>{name}</h5>
          <h6>{tagline}</h6>
        </span>
      </div>
    );
  }
  return (
    <div className="logo-container"
      style={{
        marginLeft: -52,
      }} >
      <span
        style={{ pointer: 'cursor' }}
        onClick={() => FlowRouter.go('/')}
        className="inst-link"
      >
        <img
          style={{ float: 'left' }}
          src={`/uploads/logos/${institution._id}.${institution.ext}`}
          alt="logo"
          width="80px"
          height="80px"
        />
        <h5>{name}</h5>
        <h6>{tagline}</h6>
      </span>
    </div>
  );
};

InstitutionDetail.propTypes = {
  institution: PropTypes.object,
  name: PropTypes.string,
  tagline: PropTypes.string,
};

export default InstitutionDetail;
