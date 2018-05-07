import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import ReactPaginate from 'react-paginate';
import { _Notifications } from '../../../api/notifications/notifications';
import MainModal from '../../../ui/modals/MainModal.jsx';
import { relative } from 'path';

export class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modalType: '', // remove all or remove read
      title: '', // remove all notifications
      confirm: '',
      reject: '',
    };
    Session.set('limit', 10);
  }

  componentWillUnmount() {
    Session.set({
      limit: 0,
      skip: 0,
    });
  }
  getPageCount() {
    const { notificationsCount } = this.props;
    return Math.ceil(notificationsCount / Session.get('limit'));
  }

  handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * Session.get('limit'));
    Session.set('skip', offset);
  };
  getEntriesCount = (e, count) => {
    Session.set('limit', count);
  };

  renderPagination() {
    const { count } = this.props;
    if (!count) {
      return <span />;
    }
    if (count <= Session.get('limit')) {
      return <span />;
    }
    return (
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={<a href="">...</a>}
        breakClassName={'break-me'}
        pageCount={this.getPageCount()}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination '}
        activeClassName={'active blue'}
        pageLinkClassName={'link'}
      />
    );
  }

  static handleUrl(unitId, id, cat, topicId, fileId, event) {
    event.preventDefault();
    const read = true;

    Meteor.call('markRead', id, read);

    switch (cat) {
      case 'resource':
        FlowRouter.go(`/view_resource/${topicId}?rs=${fileId}&scid=${unitId}`);
        break;
      case 'unit':
        FlowRouter.go(`/contents/${unitId}?ref=home`);
        break;
      case 'reference':
        FlowRouter.go(`/extra/view_resource/extra?rs=${fileId}`);
        break;
      default:
        break;
    }

    return false;
  }

  markAllAsVisited(bool) {
    const allNotifications = this.props.notifications;
    return allNotifications.map(function(notifications) {
      id = notifications._id;
      userId = Meteor.userId();

      Meteor.call('markRead', id, bool);
    });
  }

  renderNotifications() {
    const { notifications, notificationsCount } = this.props;
    if (notifications === undefined) {
      return null;
    } else if (notificationsCount === 0) {
      return (
        <li className="collection-item col m12 s12">
          <a className="notification-item" href="#" style={{ fontSize: '16px' }}>
            You have no new notifications
          </a>
        </li>
      );
    }
    return notifications.map(notification => (
      <li key={notification._id}>
        {notification.read === true ? (
          <ul>
            <li
              style={{ backgroundColor: 'white', padding: '1px 10px 5px', cursor: 'pointer' }}
              onClick={Notifications.handleUrl.bind(
                this,
                notification.unitId,
                notification._id,
                notification.category,
                notification.topicId,
                notification.fileId,
              )}
            >
              <span>
                {notification.title} <br />
                <span
                  className="fa fa-clock-o fa-2x"
                  style={{ fontSize: '12px', color: '#90949c' }}
                >
                  {' '}
                  <b> {moment(notification.createdAt).fromNow()}</b>
                </span>
              </span>
            </li>
          </ul>
        ) : (
          <ul>
            <li
              style={{ backgroundColor: '#edf2fa', padding: '1px 10px 5px', cursor: 'pointer' }}
              onClick={Notifications.handleUrl.bind(
                this,
                notification.unitId,
                notification._id,
                notification.category,
                notification.topicId,
                notification.fileId,
              )}
            >
              <span>
                {notification.title} <br />
                <span
                  className="fa fa-clock-o fa-2x"
                  style={{ fontSize: '12px', color: '#90949c' }}
                >
                  {' '}
                  <b> {moment(notification.createdAt).fromNow()}</b>
                </span>
              </span>
            </li>
          </ul>
        )}

        <hr />
      </li>
    ));
  }
  // clear read notifications for the current user
  clearNotifications = (e, type) => {
    e.preventDefault();

    // open modal

    this.setState({
      isOpen: !this.state.isOpen,
      modalType: type,
      title: `Are you sure to delete ${type} notifications?`,
      confirm: 'Yes',
      reject: 'No',
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { modalType } = this.state;
    const notes = _Notifications.find({ read: true, userId: Meteor.userId() }).fetch();
    const allNotes = _Notifications.find({ userId: Meteor.userId() }).fetch();
    const notesCount = notes.length;
    switch (modalType) {
      case 'all':
        Meteor.call('dropAllUserNotifications', err => {
          err
            ? Materialize.toast(err.reason, 3000, 'error-toast')
            : Materialize.toast(`cleared ${allNotes.length} notifications`, 3000, 'success-toast');
        });
        break;
      case 'read only':
        Meteor.call('dropUserNotifications', err => {
          err
            ? Materialize.toast(err.reason, 3000, 'error-toast')
            : Materialize.toast(`cleared ${notesCount} notifications`, 3000, 'success-toast');
        });
        break;
      default:
        break;
    }
    this.close();
  };

  close = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      modalType: '',
      title: '',
      confirm: '',
      reject: '',
    });
  };

  render() {
    const { isOpen, title, confirm, reject } = this.state;
    return (
      <Fragment>
        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
        />
        <div className="container">
          <div className="row">
            <div className="col s12 ">
              <h3 className="center blue-text">All Notifications</h3>
              <div className="row">
                <div className="col s6">
                  <button
                    className="btn orange fa fa-trash-o"
                    onClick={e => this.clearNotifications(e, 'read only')}
                  >
                    {' '}
                    clear read only
                  </button>
                </div>
                <div className="col s6">
                  <button
                    className="btn red right fa fa-trash"
                    onClick={e => this.clearNotifications(e, 'all')}
                  >
                    {' '}
                    clear all
                  </button>
                </div>
              </div>
              <div>
                <br /> <br />
                <span className=" blue-text" style={{ fontSize: '16px' }}>
                  <b>Your Notifications</b> ({this.props.unreadNotificationsCount})
                </span>
                <div className=" right">
                  <a
                    href=""
                    className=" blue-text "
                    style={{ fontSize: '11px' }}
                    onClick={this.markAllAsVisited.bind(this, true)}
                  >
                    <u> Mark all as read</u>
                  </a>
                  {'  |  '}
                  <a
                    href=""
                    className=" blue-tex "
                    style={{ fontSize: '11px' }}
                    onClick={this.markAllAsVisited.bind(this, false)}
                  >
                    <u> Mark all as unread </u>
                  </a>
                </div>
              </div>

              <br />
              <ul className="collection " style={{ position: 'inherit' }}>
                {this.renderNotifications()}
              </ul>
              {this.renderPagination()}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export function getuserId() {
  let user = Meteor.user();
  if (user) {
    return user._id;
  } else {
    return '';
  }
}

Notifications.propTypes = {
  notifications: PropTypes.array,
  notificationsCount: PropTypes.number,
};

export default withTracker(() => {
  Meteor.subscribe('notifications');

  return {
    // Show the newly created N notifications
    notifications: _Notifications
      .find({ userId: getuserId() }, { skip: Session.get('skip'), limit: Session.get('limit') })
      .fetch()
      .reverse(),
    notificationsCount: _Notifications.find({ userId: getuserId() }).count(),
    unreadNotificationsCount: _Notifications.find({ userId: getuserId(), read: false }).count(),
  };
})(Notifications);
