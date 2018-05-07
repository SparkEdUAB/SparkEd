import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class PageDetails extends Component {
  render() {
    return (
      <tr>

        <td>{this.props.page.page}</td>
        <td>{this.props.page.url}</td>
        <td>{this.props.page.material}</td>
        <td>{this.props.page.freq}</td>
        <td>{this.props.page.date}</td>

      </tr>

    );
  }
}
PageDetails.propTypes = {
  page: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  material: PropTypes.string.isRequired,
  freq: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
