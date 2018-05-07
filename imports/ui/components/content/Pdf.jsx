import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class PDF extends Component {
  render() {
    const name = `${this.props.pdf._id}.${this.props.pdf.ext}`;
    return (
      <>
        <object className="pdfViewer" data={`/uploads/resources/${name}`} type="application/pdf">
          <iframe src={`/uploads/resources/${name}`} />
        </object>
      </>
    );
  }
}

PDF.propTypes = {
  pdf: PropTypes.object.isRequired,
};
