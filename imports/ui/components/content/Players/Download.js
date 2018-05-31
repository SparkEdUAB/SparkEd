import React, { Fragment, Component } from 'react';
import { PropTypes } from 'prop-types';

export default class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {
      download: false,
    };
  }
  downLoadFile = e => {
    e.preventDefault();
    if (confirm('Do you want to Download the file?')) {
      this.setState({
        download: true,
      });
    } else {
      this.setState({
        download: false,
      });
    }
    return this.state.download;
  };
  render() {
    const { download } = this.state;
    const name = `${this.props.download._id}.${this.props.download.ext}`;
    const { link } = this.props;
    return (
      <div className="">
        <p>This file is not viewable by the browser. click the button to download </p>
        <button className="btn" onClick={this.downLoadFile}>
          <span className="fa fa-download" /> Download
        </button>
        {download ? <embed src={link} /> : <p>Based on your choice the File is not downloaded</p>}
        <hr />
      </div>
    );
  }
}

Download.propTypes = {
  download: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};
