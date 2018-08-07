import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export class ModalDialog extends Component {
  render() {
    return (
      <div id={this.props.id} className="modal">
        <div ref="modal_upload" className="modal-content">
          <h4>{this.props.title}</h4>
          <p>{this.props.msg}</p>
        </div>
        <div className="modal-footer">
          <a
            href="#"
            id="closeModal"
            className="modal-action modal-close  waves-effect waves-green btn-flat"
            style={{ marginRight: 20 }}
          >
            No
          </a>
          <a
            href="#"
            onClick={this.props.callBack}
            id="yes"
            className="modal-action  waves-effect waves-green btn-flat"
          >
            Yes
          </a>
        </div>
      </div>
    );
  }
}

// propTypes
ModalDialog.propTypes = {
  msg: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  callBack: PropTypes.func.isRequired,
};

// functions

export function toggleModal(selector, status) {
  if (status) {
    $(selector).modal('open');
  } else {
    $(selector).modal('close');

    $('#closeModal').trigger('click');
  }
}
