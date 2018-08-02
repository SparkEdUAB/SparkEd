import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class NotificationModal extends Component {
  state = {
    isOpen: false,
  };

  handleUrl = (unitId, id, cat, topicId, fileId) => {
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
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const { notifications } = this.props;
    if (!notifications || !notifications.length) {
      return <li className={'collection-item'}> No new notifications!</li>;
    }
    notifications.length = 5;
    return notifications.map(notification => (
      <li key={notification._id}>
        {notification.read ? (
          <ul>
            <li
              style={{ backgroundColor: 'white', padding: '1px 10px 5px', cursor: 'pointer' }}
              onClick={e =>
                this.handleUrl(
                  notification.unitId,
                  notification._id,
                  notification.category,
                  notification.topicId,
                  notification.fileId,
                )
              }
            >
              <span>
                {notification.title} <br />
                <span
                  className="fa fa-clock-o fa-2x"
                  style={{ fontSize: '12px', color: '#90949c' }}
                >
                  {' '}
                  <b> {moment(note.createdAt).fromNow()}</b>
                </span>
              </span>
            </li>
          </ul>
        ) : (
          <ul>
            <li
              style={{ backgroundColor: '#edf2fa', padding: '1px 10px 5px', cursor: 'pointer' }}
              onClick={e =>
                this.handleUrl(
                  notification.unitId,
                  notification._id,
                  notification.category,
                  notification.topicId,
                  notification.fileId,
                )
              }
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
}
