import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import M from 'materialize-css';
import { SearchView } from '../Utilities/Utilities.jsx';
import { _Bookmark } from '../../../api/bookmarks/bookmarks';
import { _Notifications } from '../../../api/notifications/notifications';
import { Institution } from '../../../api/settings/institution';
import { _ExternalLink } from '../../../api/externallink/externallink';
import { _Settings } from '../../../api/settings/settings';
import Bookmark from '../Bookmark/Bookmark.jsx';
import MainModal from '../../modals/MainModal'; // eslint-disable-line
import UserInfo from './UserInfo'; // eslint-disable-line
import ExternalLinksView from '../ExternalLink/ExternalLinksView'; // eslint-disable-line
import InstitutionDetail from './InstitutionDetail'; // eslint-disable-line
import { T } from '../Language/Languages'; // eslint-disable-line
import { ThemeContext } from '../../containers/AppWrapper'; // eslint-disable-line

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

  renderNotifications(nameClass, color, backgroundColor) {
    const { notifications } = this.props;
    if (!notifications || !notifications.length) {
      return <span className={`collection-item ${nameClass}`}> No new notifications!</span>;
    }
    notifications.length = 5;
    return notifications.map(notification => (
      <div key={ notification._id }
        style={{ backgroundColor, color }}>
        {notification.read ? (
            <div>
            <span
              style={{ padding: '1px 10px 5px', cursor: 'pointer', color }}
              onClick={() =>
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
              {notification.title} <br />
                <span
                  className="fa fa-clock-o fa-2x"
                  style={{ fontSize: '12px', color, marginLeft: 10 }}
                >
                  <b> {moment(notification.createdAt).fromNow()}</b>
                </span>
            </span>
          </div>
        ) : (
          <div>
            <span
              style={{ padding: '1px 10px 5px', cursor: 'pointer', color }}
              onClick={() =>
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
              <span className='center-align'>{notification.title} </span><br />
                <span
                  className="fa fa-clock-o fa-2x"
                  style={{ fontSize: '12px', color, marginLeft: 10 }}
                >
                  <b> {moment(notification.createdAt).fromNow()}</b>
                </span>
            </span>
          </div>
        )}
        <hr  />
      </div>
    ));
  }

  // update the notification collection on the click
  readAll = event => {
    event.preventDefault();
    FlowRouter.go('/notifications');
  };

  componentDidMount() {
    M.AutoInit();
    // used var intentionally
    var elems = document.querySelector('.sidenav');  // eslint-disable-line
    var instances = M.Sidenav.init(elems, {  // eslint-disable-line
      edge: 'left',
    });
    if (!Meteor.status().connected) {
      M.toast({
        html: '<span>You have been disconnected from the server</span>',
        classes: 'red',
        displayLength: 10000,
      });
    }
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
        break;
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
    return (
      <ThemeContext.Consumer>
        {({ state, toggle }) => (
          <Fragment>
            <div className="container-fluid " style={{
                backgroundColor: state.isDark ? state.mainDark : Meteor.status().connected ? state.main : '#757575',
              }}>
              <div className="row ">
                <div className="col s12 m5">
                  <InstitutionDetail
                    institution={institution}
                    name={details.name}
                    tagline={details.tag}
                  />
                </div>
                <div className="m6 offset-m6">
                <div className="col s12 m2 hide-on-small-only">
                  <SearchView
                    action={'/results'}
                    placeholder={'Search'}
                    query={'q'}
                    sClass={'searchAnim'}
                  />
                </div>
                <div className="row ">
                  {
                    Meteor.userId() && <div className="col s2 m1 head-icons ">{this.countNotifications()}</div>
                  }


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
                  {
                    Meteor.userId() && (
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
                        )
                    }
                  <div className="col s2 m1 head-icons ">
                    <span className="fa fa-link fa-2x white-text dropdown-trigger " data-target='dropdown1' />
                  </div>
                  <div id='dropdown1' className='dropdown-content'>
                    {/* <li className="collection-header">
                    </li> */}
                    <h6 className='center'>External links</h6>
                    <ul className='collection'>
                      <ExternalLinksView externallinks={externallinks} />
                    </ul>
                  </div>
                  <div className="col s2 m1 head-icons ">
                     <span data-target="slide-out" id="usrIcon" className="white-text sidenav-trigger fa fa-user fa-2x"/>
                  </div>
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
                      onClick={() => this.markAllAsVisited(true)}
                    >
                      <u> Mark opened as read</u>
                    </a>
                  </div>
                  <br />
                  {this.renderNotifications('', state.isDark && '#ffffff', state.isDark && state.mainDark)}
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
              <UserInfo handleNightMode={toggle} checked={state.isDark}/>
           
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
  externallinks: PropTypes.array,
  details: PropTypes.object,
  query: PropTypes.string,
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
