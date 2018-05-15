import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class PDF extends Component {
  render() {
    // const name = `${this.props.pdf._id}.${this.props.pdf.ext}`;
    const  { link } = this.props;
    return (
      <>
        <object className="pdfViewer" data={link} type="application/pdf">
          <iframe src={link} />
        </object>
      </>
    );
  }
}

PDF.propTypes = {
  link: PropTypes.string.isRequired,
};
