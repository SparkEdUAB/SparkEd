import React from 'react';
import PropTypes from 'prop-types';

const ExternalLinksView = ({ externallinks }) => {
  if (!externallinks || !externallinks.length) {
    return <li className={'collection-item'}> No External links!</li>;
  }
  return externallinks.map(externallink => (
    <span key={externallink._id}>
      <a
        style={{ padding: '1px 10px 5px', cursor: 'pointer' }}
        onClick={() => window.open(externallink.url, '_blank')}
      >
        <span>
          <b> {externallink.name}</b> <br />
          <span className="fa fa-link fa-2x" style={{ fontSize: '10px', color: 'blue' }}>
            {' '}
            <b> {externallink.url}</b>
          </span>
        </span>
      </a>
    </span>
  ));
};

ExternalLinksView.propTypes = {
  externallinks: PropTypes.array,
};

export default ExternalLinksView;
