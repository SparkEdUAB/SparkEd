/* eslint no-use-before-define:0 */
import React, { Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import M from 'materialize-css';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import i18n from 'meteor/universe:i18n';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import Pagination, { getPageNumber, getQuery } from '../Utilities/Pagination/Pagination.jsx';
import { SearchField } from '../Utilities/Utilities.jsx';
import AccountEditModal from '../Utilities/Modal/EditAccounts.jsx';
import { UserRoles } from '../Utilities/Modal/UserRoles.jsx';
import MainModal from '../../modals/MainModal.jsx';
import { closeModal, accountsModalStates } from '../../modals/methods';
import * as config from '../../../../config.json';
import { formatText } from '../../utils/utils';
import PasswordEdit from '../Utilities/Modal/PasswordEdit.jsx';
import { checkPassword } from './AccountFunction';
import { ThemeContext } from '../../containers/AppWrapper'

const T = i18n.createComponent();

const { isUserAuth } = config;
export class ManageAccounts extends React.Component {
  // subscribing to the Uses
  constructor(props) {
    super(props);
    this.state = {
      subscription: {
        users: Meteor.subscribe('all.users'),
      },
    };
    this.limit = 5;
    // this.itemPerPage = 2;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.state = {
      isOpen: false,
      modalType: '', // Add or Edit
      title: '', //
      confirm: '',
      reject: '',
      ids: [],
      role: 'student',
      password: '',
      passwordConfirm: '',
      userID: '',
      error: '',
    };
  }

  componentDidMount() {
    Session.set('accounts', ' active');
    M.AutoInit();
  }
  componentWillUnmount() {
    Session.set('accounts', '');
  }
  // close modal
  close = () => {
    this.setState(closeModal);
  };

  // open modals
  openModal = (type, id = '', email = '', fname = '', password = '', passwordConfirm = '', e) => {
    const users = getCheckBoxValues('chk');
    const count = users.length;
    const name = count > 1 ? 'users' : 'user';
    this._id = id;
    this.email = email;
    this.fname = fname;
    this.pass = password;
    this.passConfirm = passwordConfirm;

    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      M.toast({ html: '<span >Only Admins can delete a user</span>', classes: ' red ' });
      return;
    }
    if (type !== 'edit' && count < 1) {
      M.toast({ html: '<span >Please check atleast one user</span>', classes: ' red ' });
      return;
    }

    switch (type) {
      case 'delete':
        this.setState(accountsModalStates(type, count, name, users));
        break;

      case 'approve':
        this.setState(accountsModalStates(type, count, name, users));
        break;

      case 'suspend':
        this.setState(accountsModalStates(type, count, name, users));
        break;

      case 'upgrade':
        this.setState(accountsModalStates(type, count, name, users));
        break;

      case 'edit':
        this.setState({
          modalType: type,
          email: this.email,
          fname: this.fname,
          title: 'Edit user',
          confirm: 'Update',
          reject: 'Close',
          ids: this._id,
        });
        break;

      case 'roles':
        this.setState({
          modalType: type,
          title: 'Update User profile',
          confirm: 'Update',
          reject: 'Close',
          ids: users,
        });

        break;
      case 'pass':
        this.setState({
          modalType: type,
          title: 'Change User Password',
          confirm: 'Save',
          reject: 'Close',
          userID: users[0],
          password: this.pass,
          passwordConfirm: this.passConfirm,
        });
        break;
      default:
        console.log(type) // eslint-disable-line
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  // actions for buttons
  handleSubmit(e) {
    e.preventDefault();
    const {
      modalType, ids, count, name, password, passwordConfirm, userID,
    } = this.state;
    const { target } = e;

    switch (modalType) {
      case 'delete':
        ids.forEach((v) => {
          if (v === Meteor.userId()) {
            M.toast({ html: '<span >You can\'t delete yourself</span>', classes: 'red' });
            return;
          } else if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
            M.toast({ html: '<span >You can not delete the admin</span>', classes: 'red' });
            return;
          }
          Meteor.call('removeUser', v, err => {
            // eslint-disable-next-line
            err
              // ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
              ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
              Meteor.call(
                'logger',
                formatText(err.reason, Meteor.userId(), 'user-remove'),
                'error',
              ))
              : M.toast({ html: `<span>${count} ${name} successfully deleted</span>` });
          });
        });
        break;
        // eslint-disable-next-line
      case 'edit':
        const fname = target.fname.value;
        Meteor.call('user.update', ids, fname, err => {
          // eslint-disable-next-line
          err
            ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
            Meteor.call(
              'logger',
              formatText(err.reason, Meteor.userId(), 'user-update'),
              'error',
            ))
            : M.toast({ html: '<span>Successfully updated</span>' });
        });
        break;
      // eslint-disable-next-line
      case 'roles':
        const roles = target.roles.value;
        Meteor.call('promoteUser', ids[0], roles, err => {
          // eslint-disable-next-line
          err
            ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
            Meteor.call(
              'logger',
              formatText(err.reason, Meteor.userId(), 'roles-update'),
              'error',
            ))
            : M.toast({ html: '<span>Successfully updated user roles</span>' });
        });
        break;
        // eslint-disable-next-line
      case 'pass':
        const response = checkPassword(password, passwordConfirm);
        if (!response.status) {
          this.setState({
            error: response.msg,
          });
          return false;
        }
        Meteor.call('changeUserPassword', userID, password, err => {
          // eslint-disable-next-line
          err
            ? (M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' }),
            Meteor.call(
              'logger',
              formatText(err.reason, Meteor.userId(), 'pass-change'),
              'error',
            ))
            : M.toast({ html: '<span>Successfully created user password</span>' });
        });
        break;


      default:
        console.log(type) // eslint-disable-line
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  validatePassword = ({ target: { value } }) => {
    this.setState({
      password: value,
    });
  }
  confirmPassword = ({ target: { value } }) => {
    this.setState({
      passwordConfirm: value,
    });
  }

  render() {
    let count = 1;
    const { users } = this.props;
    const {
      error, email, fname, title, confirm, reject, isOpen, modalType, password, passwordConfirm,
    } = this.state;

    return (
      <ThemeContext.Consumer>
        {
          ({ state }) => (
      <div>
        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
          >
          {modalType === 'edit' ? (
            <AccountEditModal email={email} fname={fname} color={ state.isDark ? '#F5FAF8' : '#000000' } />
            ) : modalType === 'roles' ? (
              <div className="input-field">
              <UserRoles value={this.state.role}
                color={ state.isDark ? '#F5FAF8' : '#000000' } />
            </div>
          ) :
            modalType === 'pass' ? (
              <PasswordEdit password={password}
              passwordConfirm={passwordConfirm}
              validatePassword={this.validatePassword}
              confirmPassword={this.confirmPassword}
              error={error}
              color={ state.isDark ? '#F5FAF8' : '#000000' }
              />
              ) :
            <span />
          }
        </MainModal>
        <div className='m1' />
        <div className="col m9 s11"
              style={{
                backgroundColor: state.isDark ? state.mainDark : '#FFFFFF',
                color: state.isDark ? '#F5FAF8' : '#000000',
              }}
        >
          <div className="row">
            <div>
              <h4>
                Manage <T>common.manage.accounts</T>
              </h4>
            </div>
            <div className="col m8">
              <SearchField
                action={'/dashboard/accounts'}
                name={'accounts'}
                color={ state.isDark ? '#F5FAF8' : '#000000' }
                placeholder={'search user by name,email'}
                query={'q'}
                />
            </div>
          </div>
          <div className="row">
            <div className="col m3 s3">
              <button
                className="btn red darken-3"
                onClick={e => this.openModal('delete', e)}
                >
                {' '}
                <T>common.actions.delete</T>
              </button>
            </div>
            {isUserAuth ? (
              <Fragment>
                <div className="col m3 s3">
                  <button className="btn " onClick={e => this.openModal('approve', e)}>
                    {' '}
                    Approve
                  </button>
                </div>

                <div className="col m3 s3">
                  <button
                    className="btn grey darken-3"
                    onClick={e => this.openModal('suspend', e)}
                    >
                    {' '}
                    Suspend
                  </button>
                </div>
              </Fragment>
            ) : (
              <span />
            )}

            <div className="col m3 s3">
              <button
                className="btn green darken-3"
                onClick={e => this.openModal('roles', e)}
                >
                {' '}
                <T>common.actions.changeRole</T>
              </button>
            </div>
            <div className="col m3 s3">
              <button
                className="btn teal "
                onClick={e => this.openModal('pass', e)}
                >
                {' '}
                <T>Change Password</T>
              </button>
            </div>
          </div>
          <table className="highlight">
            <thead>
              <tr>
                <th>#</th>
                <th>
                  <T>common.accounts.name</T>
                </th>
                <th>
                  <T>common.accounts.Role</T>
                </th>
                <th>
                  <T>common.accounts.Email</T>
                </th>
                <th>
                  <T>common.accounts.Gender</T>
                </th>
                {isUserAuth ? <th>Status</th> : null}
                <th>
                  <T>common.actions.edit</T>
                </th>
                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                  <label>
                  <input type="checkbox" className=" chk-all" readOnly />
                    <T>common.actions.check</T>
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const { status } = user.profile;
                let statusIcon = 'fa-clock-o  ';
                let chkboxStatus = 'chk-appr  ';
                let email = user.emails; // eslint-disable-line
                email = email === undefined ? 'null' : email[0].address;
                if (status === 1) {
                  statusIcon = 'fa-check-circle ';
                  chkboxStatus = 'chk-ban ';
                } else if (status === 2) {
                  statusIcon = 'fa-ban ';
                }
                
                return (
                  <tr key={user._id}>
                    <td>{count++}</td>
                    <td>{`${user.profile.name}`}</td>
                    <td>{!user.roles ? 'student' : user.roles}</td>
                    <td>{email}</td>
                    <td>{user.profile.gender}</td>
                    {isUserAuth ? (
                      <td>
                        <i className={`fa-2x fa ${statusIcon}`} />
                      </td>
                    ) : null}
                    <td>
                      <a
                        href=""
                        onClick={e => this.openModal('edit', user._id, email, user.profile.name, e)}
                        className="fa fa-pencil"
                        />
                    </td>
                    <td onClick={handleCheckboxChange.bind(this, user._id)}>
                    <label htmlFor={user._id}>
                      <input type="checkbox" id={user._id} className={`${chkboxStatus} chk chk${user._id}`} />
                      <span/>
                    </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            path={'/dashboard/accounts'}
            itemPerPage={limit}
            query={getQuery(queryParams, true)}
            totalResults={this.props.count}
            />{' '}
        </div>
        {/* </div> */}
      </div>
    )
  }
</ThemeContext.Consumer>
    );
  }
}

export function search() {
  const queryData = getQuery(queryParams, true, true);
  const query = queryData.q;

  // export const itemPerPage = 2;
  if (queryData.q !== '') {
    return [
      {
        'emails.address': query,
      },
      {
        'emails.lname': query,
      },
      {
        'profile.name': query,
      },
    ];
  } else if (queryData.appr !== '') {
    return [
      {
        'profile.status': 0,
      },
    ];
  } else if (queryData.pend !== '') {
    return [
      {
        'profile.status': 2,
      },
    ];
  } else if (queryData.sspd !== '') {
    return [
      {
        'profile.status': 1,
      },
    ];
  }
  return [{}];
}

export const limit = 5;
export const query = 'q';
export const queryParams = [
  { param: 'q' },
  { param: 'appr' },
  { param: 'pend' },
  { param: 'sspd' },
]; // prepare search query paramaters
ManageAccounts.propTypes = {
  users: PropTypes.array,
  count: PropTypes.number,
};

export default withTracker(() => {
  Meteor.subscribe('all.users');
  return {
    users: Meteor.users
      .find(
        {
          $or: search(),
        },
        {
          sort: { 'profile.status': 1 },
          skip: getPageNumber(limit),
          limit,
        },
      )
      .fetch(),
    count: Meteor.users.find({ $or: search() }, { sort: { 'profile.status': 1 } }).count(),
  };
})(ManageAccounts);
