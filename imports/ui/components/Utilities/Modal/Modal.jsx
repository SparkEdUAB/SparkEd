import React from 'react';
import { PropTypes } from 'prop-types';

export const ModalDialog = ({
  id, title, msg, callBack,
}) => (
  <div id={id} className="modal">
    <div className="modal-content">
      <h4>{title}</h4>
      <p>{msg}</p>
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
        onClick={callBack}
        id="yes"
        className="modal-action  waves-effect waves-green btn-flat"
      >
        Yes
      </a>
    </div>
  </div>
);

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
