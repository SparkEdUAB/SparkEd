import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';

const PDF = props => (
  <Fragment>
    <object className="pdfViewer" data={props.link} type="application/pdf">
      <iframe src={props.link} />
    </object>
  </Fragment>
);
PDF.propTypes = {
  link: PropTypes.string.isRequired,
};
export default PDF;
