import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { _School } from '../../../api/schools/school';
import Header from '../layouts/Header.jsx';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import Sidenav from './Sidenav.jsx';
import MainModal from '../../../ui/modals/MainModal';
import { closeModal, schoolStates } from '../../../ui/modals/methods.js';

export class School extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modalIdentifier: '', // School Id
      modalType: '', // Add or Edit
      title: '', // Add School or Edit
      confirm: '',
      reject: '',
      ids: [],
      name: '',
      code: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // close the modal, and clear the states;
  close = () => {
    this.setState(closeModal);
  };

  // ide => modalType, id=> courseId
  /**
   * @param { String } ide - Type of the modal
   * @param { String } id - resource Id,
   * @param { String } name - Name of the resource
   * @default { id, name } - can be optional
   * Testing the documentation
   */

  toggleEditModal = (ide, id = '', name = '', code = '') => {
    // check if the user has full rights
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Materialize.toast('Only Admins can edit the School', 4000, 'error-toast');
      return;
    }
    this.schoolName = name;
    this.code = code;
    switch (ide) {
      case 'edit':
        this.setState(
          schoolStates(ide, 'Edit School', 'Save', 'Close', id, this.schoolName, this.code),
        );
        break;
      case 'add':
        this.setState(schoolStates(ide, 'Add School', 'Save', 'Close'));
        break;

      case 'del':
        const school = getCheckBoxValues('chk');
        const count = school.length;
        const name = count > 1 ? 'schools' : 'school';
        if (count < 1) {
          Materialize.toast('Please check atleast one school', 4000, 'error-toast');
          return;
        }
        this.setState({
          modalIdentifier: 'id',
          modalType: ide,
          title: `Are you sure to delete ${count} ${name}`,
          confirm: 'Yes',
          reject: 'No',
          ids: school,
        });
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  static handleUrl(id) {
    FlowRouter.go(`/dashboard/program/${id}`);
  }

  renderSchools() {
    let count = 1;

    if (this.props.schools === undefined) {
      return null;
    }
    return this.props.schools.map(school => (
      <tr className="link-section" key={school._id}>
        <td>{count++}</td>
        <td onClick={School.handleUrl.bind(this, school._id)}>{school.name}</td>
        <td>{school.createdAt.toDateString()}</td>
        <td>
          <a
            href=""
            className="fa fa-pencil"
            onClick={e => this.toggleEditModal('edit', school._id, school.name, school.code, e)}
          />
        </td>
        <td>
          <a href={`/dashboard/program/${school._id}`} className="fa fa-pencil" />
        </td>
        <td onClick={handleCheckboxChange.bind(this, school._id)}>
          <input type="checkbox" className={` filled-in chk chk${school._id}`} id={school._id} />
          <label />
        </td>
      </tr>
    ));
  }

  handleSubmit(e) {
    e.preventDefault();

    let sku;
    let skuCode;
    const id = new Meteor.Collection.ObjectID().valueOf();
    const { modalType, ids, modalIdentifier } = this.state;
    switch (modalType) {
      case 'add':
        sku = e.target.school.value;
        skuCode = e.target.scode.value;
        Meteor.call('addSchool', id, sku, skuCode, err => {
          err
            ? Materialize.toast(err.reason, 4000, 'error-toast')
            : Materialize.toast(`Successfully added ${sku}`, 4000, 'success-toast');
        });

        break;

      case 'edit':
        sku = e.target.school.value;
        skuCode = e.target.scode.value;
        Meteor.call('editSchool', modalIdentifier, sku, skuCode, err => {
          err
            ? Materialize.toast(err.reason, 4000, 'error-toast')
            : Materialize.toast(`Successfully updated ${sku}`, 4000, 'success-toast');
        });
        break;

      case 'del':
        let count = 0;
        const schools = ids;
        schools.forEach((v, k, arra) => {
          count += 1;
          const name = count > 1 ? 'schools' : 'school';
          Meteor.call('removeSchool', v, err => {
            err
              ? Materialize.toast(err.reason, 4000, 'error-toast')
              : Meteor.call('removeSearchData', v, err => {
                  err
                    ? Materialize.toast(err.reason, 4000, 'error-toast')
                    : Meteor.call('insertDeleted', v, err => {
                        err
                          ? Materialize.toast(err.reason, 4000, 'error-toast')
                          : Materialize.toast(
                              `${count} ${name} successfully deleted`,
                              4000,
                              'success-toast',
                            );
                      });
                });
          });
        });

        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const { isOpen, title, confirm, reject, modalType, name, code } = this.state;
    return (
      <>
        {/* Add and Edit Modal */}

        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
        >
          {modalType === 'del' ? (
            ''
          ) : (
            <div className="input-field">
              <input
                placeholder="Name of School"
                type="text"
                defaultValue={name}
                className="validate clear"
                required
                name="school"
              />
              <input
                placeholder="School Code"
                type="text"
                defaultValue={code}
                className="validate clear"
                required
                name="scode"
              />
            </div>
          )}
        </MainModal>

        <div className="col m9 s11">
          <div className="">
            <h4>Manage School</h4>
          </div>
          <div className="row">
            <div className="col m3">
              <button
                className="btn red darken-3 fa fa-remove"
                onClick={e => this.toggleEditModal('del', e)}
              >
                {' '}
                Delete
              </button>
            </div>
            <div className="col m3">
              <a href="">
                <button
                  className="btn green darken-4 fa fa-plus"
                  onClick={e => this.toggleEditModal('add', e)}
                >
                  {' '}
                  New
                </button>
              </a>
            </div>
          </div>

          <table className="highlight bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>School</th>
                <th>Created At</th>
                <th>Edit School</th>
                <th>Programs</th>
                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                  <input type="checkbox" className="filled-in chk-all" readOnly />
                  <label>Check All</label>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderSchools()}</tbody>
          </table>
        </div>
      </>
    );
  }
}

School.propTypes = {
  schools: PropTypes.array,
};

export default withTracker(() => {
  Meteor.subscribe('schools');
  Meteor.subscribe('deleted');
  Meteor.subscribe('searchdata');
  return {
    schools: _School.find({ createdBy: Meteor.userId() }).fetch(),
  };
})(School);
