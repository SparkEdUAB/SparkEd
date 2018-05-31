import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';

// export default class Download extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { download: false };
//   }
//   downLoadFile = () => {
//     if (confirm('Do you want to Download the file??')) {
//       this.setState({ download: true });
//     } else {
//       this.setState({ download: false });
//     }

//     return this.state.download;
//   };
//   render() {
//     const { download } = this.state;
//     const name = `${this.props.download._id}.${this.props.download.ext}`;
//     return (
//       <div className="">
//         <h5>
//           This file is not viewable by the browser. you can download the file using the download
//           button!{' '}
//         </h5>
//         <input type="button" value="Download" onClick={this.downLoadFile} />
//         {download ? (
//           <embed src={this.props.link} />
//         ) : (
//           <h5>Based on your choice the File is not downloaded</h5>
//         )}
//         <hr />
//       </div>
//     );
//   }
// }

const Download = props => (
  <Fragment>
    <h5>
      This file is not viewable by the browser. you can download the file using the download button!{' '}
    </h5>
    <input type="button" value="Download" />

    <embed src={props.link} />

    <hr />
  </Fragment>
);

Download.propTypes = {
  download: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};

export default Download;
