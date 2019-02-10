import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '../utils/Buttons';
import { ThemeContext } from '../containers/AppWrapper';

/**
 * @prop { subFunc } a callback function for different modals
 */
const MainModal = props => {
  if (!props.show) {
    return null;
  }
  return (
    <ThemeContext.Consumer>
      {({ state }) => (
        <div id="notifications">
          <div
            id="notificationsStyle"
            className="main_modal"
            style={{
              backgroundColor: state.isDark ? state.mainDark : '#ffffff',
              color: state.isDark ? '#F5FAF8' : '#000000',
            }}
          >
            <h5>{props.title}</h5>
            <div className="row">
              <form onSubmit={props.subFunc}>
                <div className="row">{props.children}</div>
                <div className="" id="notificationBody">
                  <div className="modal-footer">
                    <Button
                      title={props.confirm}
                      backgroundColor={state.main}
                      name={props.confirm}
                    />
                    <a
                      href=""
                      onClick={props.onClose}
                      className="btn grey darken-3 right"
                    >
                      {' '}
                      {props.reject}
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </ThemeContext.Consumer>
  );
};
MainModal.propTypes = {
  subFunc: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.node,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  confirm: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  reject: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default MainModal;
