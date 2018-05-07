import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

/**
 * @prop { subFunc } a callback function for different modals
 */

export default class MainModal extends Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      // <div style={styles.backdropStyle}>
      <div id="notifications">
        {/* <div style={styles.modalStyle} className="main_modal"> */}
        <div id = "notificationsStyle" className="main_modal">
          <h5>{this.props.title}</h5>
          <div className="row">
            <form onSubmit={this.props.subFunc}>
              <div className="row">{this.props.children}</div>
              <div className="" id = "notificationBody">
                <div className="modal-footer">
                  <button className="btn left" role="submit">
                    {' '}
                    {this.props.confirm}
                  </button>
                  <a href="" onClick={this.props.onClose} className="btn grey darken-3 right">
                    {' '}
                    {this.props.reject}
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
MainModal.propTypes = {
  subFunc: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node, // it shouldn't be required, it can work independently, check ManageAccount
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  confirm: PropTypes.string.isRequired,
  reject: PropTypes.string.isRequired,
};
