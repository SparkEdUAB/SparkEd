import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { _Programs } from '../../../api/programs/programs';
import Header from '../layouts/Header.jsx';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import Sidenav from './Sidenav.jsx';
import MainModal from '../../../ui/modals/MainModal.jsx';
import { closeModal } from '../../../ui/modals/methods.js';

export class Program extends Component {
  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isOpen: false,
      modalIdentifier: '', // Program Id
      modalType: '', // Add or Edit
      title: 'Add Program', // Add Program or Edit Program
      confirm: '',
      reject: '',
      year: '',
      name: '',
      ids: [],
    };
  }

  // close modal
  close = () => {
    this.setState(closeModal);
  };

  // ide => modalType, id=> ProgramId
  toggleEditModal = (ide, yr = '', id = '', name = '', code = '') => {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Materialize.toast('Only Admins can edit Programs', 4000, 'error-toast');
      return;
    }
    this.year = yr;
    this.name = name;
    this.code = code;
    switch (ide) {
      case 'edit':
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: 'Edit The Program',
          confirm: 'Save',
          reject: 'Close',
          year: this.year,
          code: this.code,
          name: this.name,
        });
        break;
      case 'add':
        this.setState({
          modalIdentifier: id,
          modalType: ide,
          title: 'Add New Program',
          confirm: 'Save',
          reject: 'Close',
        });
        break;

      case 'del':
        const program = getCheckBoxValues('chk');
        const count = program.length;
        const name = count > 1 ? 'programs' : 'program';
        if (count < 1) {
          Materialize.toast('Please check atleast one program', 4000, 'error-toast');
          return;
        }
        this.setState({
          modalIdentifier: 'id',
          modalType: ide,
          title: `Are you sure to delete ${count} ${name}`,
          confirm: 'Yes',
          reject: 'No',
          ids: program,
        });
        break;
    }

    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  // make this flat arrow
  _handleUrl(id, sId, event) {
    event.preventDefault();
    FlowRouter.go(`/dashboard/course/${sId}?cs=${id}`);
  }

  // change the Url to take back the user to the programs
  _changeUrl() {
    FlowRouter.go('/dashboard/school');
  }

  // Adding New Program
  handleSubmit(event) {
    event.preventDefault();
    let program;
    let programCode;
    let duration;
    let details = {};
    const schoolId = FlowRouter.getParam('_id');
    const id = new Meteor.Collection.ObjectID().valueOf();
    const { modalIdentifier, modalType, ids } = this.state;
    const { target } = event;

    switch (modalType) {
      case 'add':
        program = target.program.value;
        programCode = target.pcode.value;
        duration = target.year.value;
        details = { schoolId, duration };
        // create a program
        Meteor.call('program.insert', program, programCode, details, err => {
          err
            ? Materialize.toast(err.reason, 4000, 'error-toast')
            : Materialize.toast(`Successfully added ${program}`, 4000, 'success-toast');
        });
        break;
      case 'edit':
        program = target.program.value;
        programCode = target.pcode.value;
        duration = target.year.value;
        details = { schoolId, duration };
        // update program
        Meteor.call('program.edit', modalIdentifier, program, programCode, duration, err => {
          err
            ? Materialize.toast(err.reason, 4000, 'error-toast')
            : Materialize.toast(
                `${program} Program has been updated successfully`,
                4000,
                'success-toast',
              );
        });
        break;
      case 'del':
        let count = 0;
        const programs = ids;
        programs.forEach((v, k, arra) => {
          count += 1;
          const name = count > 1 ? 'programs' : 'program';
          Meteor.call('program.remove', v, err => {
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
    // this.setState({
    //   prevState => ({ isOpen: !prevState.isOpen
    // });
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  // renderPrograms
  renderPrograms() {
    let count = 1;
    const { programs } = this.props;
    if (programs === undefined) {
      return '';
    }
    return programs.map(program => (
      <tr className="link-section" key={program._id}>
        <td>{count++}</td>
        <td onClick={e => this._handleUrl(program._id, program.details.schoolId, e)}>
          {program.name}
        </td>
        <td>{program.createdAt.toDateString()}</td>
        <td>
          <a
            href=""
            className="fa fa-pencil"
            onClick={e =>
              this.toggleEditModal(
                'edit',
                program.details.duration,
                program._id,
                program.name,
                program.code,
                e,
              )
            }
          />
        </td>
        <td>
          <a
            href={`/dashboard/course/${program.details.schoolId}?cs=${program._id}`}
            className="fa fa-pencil"
          />
        </td>
        <td onClick={handleCheckboxChange.bind(this, program._id)}>
          <input type="checkbox" className={`filled-in chk chk${program._id}`} id={program._id} />
          <label />
        </td>
      </tr>
    ));
  }

  render() {
    const { isOpen, title, confirm, reject, modalType, name, code, year } = this.state;
    return (
      <div className="">
        <MainModal
          show={isOpen}
          onClose={this.close}
          subFunc={this.handleSubmit}
          title={title}
          confirm={confirm}
          reject={reject}
        >
          {modalType === 'del' ? (
            <span />
          ) : (
            <div className="input-field">
              <input
                placeholder="Name of Program"
                type="text"
                defaultValue={name}
                className="validate clear"
                required
                name="program"
              />
              <input
                placeholder="Program Code"
                type="text"
                defaultValue={code}
                className="validate clear"
                required
                name="pcode"
              />
              <input
                placeholder="Program Duration eg: 1-7"
                id="year"
                defaultValue={year}
                type="text"
                pattern="[1-9]"
                className="validate clear"
                required
                title="Program Duration 1-7"
              />
            </div>
          )}
        </MainModal>

        <div className="col m9 s11">
          <div className="">
            <h4>Manage Programs</h4>
          </div>
          <div className="row">
            <div className="col m3">
              <button
                className="btn grey darken-3 fa fa-angle-left"
                onClick={() => this._changeUrl()}
              >
                {' '}
                School
              </button>
            </div>
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

          <table className="highlight">
            <thead>
              <tr>
                <th>#</th>
                <th>Program</th>
                <th>Created At</th>
                <th>Edit Program</th>
                <th>Course</th>
                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                  <input type="checkbox" className="filled-in chk-all" readOnly />
                  <label>Check All</label>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderPrograms()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

Program.propTypes = {
  programs: PropTypes.array,
};

export function getSchoolId() {
  return FlowRouter.getParam('_id');
}

export default withTracker(() => {
  Meteor.subscribe('programs');
  Meteor.subscribe('deleted');
  Meteor.subscribe('searchdata');

  return {
    programs: _Programs
      .find({ 'details.schoolId': getSchoolId(), createdBy: Meteor.userId() })
      .fetch(),
  };
})(Program);
