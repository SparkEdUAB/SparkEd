import React from 'react';
import PropTypes from 'prop-types';

const ExternalLinksView = ({ externallinks }) => {
  if (!externallinks || !externallinks.length) {
    return <li className={'collection-item'}> No External links!</li>;
  }
  return externallinks.map(externallink => (
    <li className="collection-item" key={externallink._id}>
      <span>{externallink.name}</span>
      <a
        href={externallink.url}
        target="_blank"
        rel="noopener noreferrer"
        className="secondary-content"
      >
        {externallink.url}
      </a>
    </li>
  ));
};

ExternalLinksView.propTypes = {
  externallinks: PropTypes.array,
};

export default ExternalLinksView;
