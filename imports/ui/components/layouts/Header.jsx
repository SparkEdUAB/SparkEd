import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { SearchView } from '../Utilities/Utilities.jsx';
import { _Bookmark } from '../../../api/bookmarks/bookmarks';
import { _Notifications } from '../../../api/notifications/notifications';
import { Institution } from '../../../api/settings/institution';
import { _ExternalLink } from '../../../api/externallink/externallink';
import { _Settings } from '../../../api/settings/settings';
import Bookmark from '../Bookmark/Bookmark.jsx';
import MainModal from '../../modals/MainModal';
import UserInfo from './UserInfo';
import ExternalLinksView from '../ExternalLink/ExternalLinksView';
import InstitutionDetail from './InstitutionDetail';
import { T } from '../Language/Languages';
import { ThemeContext } from '../../containers/AppWrapper';
import * as config from '../../../../config.json';

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modalIdentifier: '',
      modalType: '',
      title: '',
      confirm: '',
      reject: '',
      value: '',
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const { modalType, value } = this.state;

    switch (modalType) {
      case 'note':
        FlowRouter.go('/notifications');
        break;
      case 'bookmarks':
        break;
      case 'link':
        break;
      case 'search':
        FlowRouter.go(`/results?q=${value}`);
        break;
      default:
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  // Notifications Number
  countNotifications() {
    const { notificationsCount } = this.props;
    if (!notificationsCount) {
      return (
        <a
          href="#"
          className="fa fa-bell fa-2x inst-link"
          onClick={e => this.toggleEditModal(e, 'note')}
        />
      );
    }
    return (
      <a href="#" onClick={e => this.toggleEditModal(e, 'note')} className="inst-link">
        <div id="notificationBellContainer">
          <i className="fa fa-bell fa-2x block" id="usrIcon" />
          <span className="danger-bg">{notificationsCount}</span>
        </div>
      </a>
    );
  }

  handleUrl = (event, unitId, id, cat, topicId, fileId) => {
    // event.preventDefault();
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

  renderNotifications(nameClass) {
    const { notifications } = this.props;
    if (!notifications || !notifications.length) {
      return <li className={`collection-item ${nameClass}`}> No new notifications!</li>;
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
                  this,
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
        ) : (
          <ul>
            <li
              style={{ backgroundColor: '#edf2fa', padding: '1px 10px 5px', cursor: 'pointer' }}
              onClick={e =>
                this.handleUrl(
                  this,
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

  // update the notification collection on the click
  readAll = event => {
    event.preventDefault();
    FlowRouter.go('/notifications');
  };

  componentDidMount() {
    $('.dropdown-button').dropdown({
      inDuration: 0,
      outDuration: 0,
      hover: false, // opens just on hover
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false, // Stops event propagation
    });
  }

  markAllAsVisited = bool => {
    const { notifications } = this.props;
    return notifications.map(notification => {
      const id = notification._id;
      return Meteor.call('markRead', id, bool);
    });
  };

  // close the modal, close the modal, and clear the states;
  close = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

  toggleEditModal = (e, type) => {
    switch (type) {
      case 'note':
        this.setState({
          modalType: type,
          title: <T>common.titles.notifications</T>,
          confirm: 'More',
          reject: <T>common.actions.close</T>,
        });
        break;
      case 'bookmark':
        this.setState({
          modalType: type,
          title: <T>common.titles.bookmarks</T>,
          confirm: 'See',
          reject: <T>common.actions.close</T>,
        });
        break;
      case 'link':
        this.setState({
          modalType: type,
          title: <T>common.sidenav.externalLinks</T>,
          confirm: 'See',
          reject: <T>common.actions.close</T>,
        });
        break;
      case 'search':
        this.setState({
          modalType: type,
          title: 'Search',
          confirm: '',
          reject: '',
        });
      default:
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  getQuery() {
    let query = FlowRouter.getQueryParam(this.props.query);
    query = !query ? null : query;
    return query;
  }
  grabText = ({ target: { value } }) => {
    this.setState({
      value,
    });
  };
  render() {
    const { isOpen, title, confirm, reject, modalType } = this.state;
    const { externallinks, institution, details } = this.props;
    const { name, tag } = config;
    return (
      <ThemeContext.Consumer>
        {color => (
          <Fragment>
            <div className="container-fluid " style={{ backgroundColor: color.main }}>
              <div className="row ">
                <div className="col s12 m6">
                  <InstitutionDetail 
                    institution={institution} 
                    name={details.name} 
                    tagline={details.tag} 
                  />
                </div>
                <div className="col s12 m2 hide-on-small-only">
                  <SearchView
                    action={'/results'}
                    placeholder={'Search'}
                    query={'q'}
                    sClass={'searchAnim'}
                  />
                </div>
                <div className="row ">
                  <div className="col s2 m1 head-icons ">{this.countNotifications()}</div>
                  <div className="col s2 m1 head-icons ">
                    <a href="/reference" className="fa fa-book fa-2x inst-link" />
                  </div>

                  <div className="col s2 m1 head-icons hide-on-med-and-up">
                    <a
                      href=""
                      className="inst-link fa fa-search"
                      onClick={e => this.toggleEditModal(e, 'search')}
                    />
                  </div>
                  <div className="col s2 m1 head-icons">
                    <a
                      href="#"
                      className={
                        this.props.count > 0
                          ? 'fa fa-star fa-2x inst-link'
                          : 'fa fa-star-o fa-2x inst-link'
                      }
                      data-activates="slide-out"
                      onClick={e => this.toggleEditModal(e, 'bookmark')}
                    >
                      <span className="new" />
                    </a>
                  </div>

                  <div className="col s2 m1 head-icons">
                    <div href="#" data-activates="slide-out">
                      <div className="dropdownLink">
                        <button className="dropbtnLink fa fa-link fa-2x inst-link" style={{backgroundColor: color.main}}/>
                        <div className="dropdownLink-content" >
                          <a href="/externallinkpages" className="openLinks">
                            Click here to Open all the external links in a page
                          </a>
                          <p className=" blue-text externalLink">
                            <b> External Links</b>
                          </p>
                          <hr />
                          <ExternalLinksView externallinks={externallinks} />
                        </div>
                      </div>
                      <span className="new" />
                    </div>
                  </div>

                  <div className="col s2 m1 head-icons ">
                    <a className="dropdown-button inst-link " href="#" data-activates="dropdown1">
                      <i className="fa fa-user fa-2x" id="usrIcon" />
                    </a>
                    <UserInfo />
                  </div>
                </div>
              </div>
            </div>

            <MainModal
              show={isOpen}
              onClose={this.close}
              subFunc={this.handleSubmit}
              title={title}
              confirm={confirm}
              reject={reject}
            >
              {modalType === 'note' ? (
                <div className="row">
                  <div className="">
                    <a
                      href=""
                      className=" blue-text "
                      style={{ fontSize: '11px' }}
                      onClick={e => this.markAllAsVisited(true)}
                    >
                      <u> Mark opened as read</u>
                    </a>
                  </div>
                  <ul className="collection">{this.renderNotifications('')}</ul>
                </div>
              ) : modalType === 'bookmark' ? (
                <Bookmark />
              ) : modalType === 'link' ? (
                <div className="row" />
              ) : modalType === 'search' ? (
                <div className="searchbox-wrapper">
                  <input
                    className={''}
                    name={'search'}
                    type="search"
                    defaultValue={this.getQuery()}
                    id="searchField"
                    placeholder={'Search'}
                    onChange={this.grabText}
                  />
                </div>
              ) : (
                ''
              )}
            </MainModal>
          </Fragment>
        )}
      </ThemeContext.Consumer>
    );
  }
}

Header.propTypes = {
  count: PropTypes.number,
  institution: PropTypes.object,
  notificationsCount: PropTypes.number,
  notifications: PropTypes.array,
};

export default withTracker(() => {
  Meteor.subscribe('notifications');
  Meteor.subscribe('externallinks');
  Meteor.subscribe('institution');
  Meteor.subscribe('bookmarks');
  Meteor.subscribe('logo');
  return {
    notificationsCount: _Notifications.find({ read: false, userId: Meteor.userId() }).count(),
    notifications: _Notifications
      .find({ read: false, userId: Meteor.userId() }, { sort: { createdAt: -1 } })
      .fetch(),
    externallinks: _ExternalLink.find({}).fetch(),
    details: _Settings.findOne({}),
    institution: Institution.findOne({}, { sort: { 'meta.createdAt': -1 } }),
    count: _Bookmark.find({ user: Meteor.userId() }, { sort: { color: 1 } }).count(),
  };
})(Header);
