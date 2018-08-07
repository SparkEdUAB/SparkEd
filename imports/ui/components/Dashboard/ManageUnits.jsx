import { Session } from 'meteor/session';
import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';
import { _Courses } from '../../../api/courses/courses';
import { _Units } from '../../../api/units/units';
import { Titles } from '../../../api/settings/titles';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../Utilities/CheckBoxHandler.jsx';
import Pagination, { getPageNumber, getQuery } from '../Utilities/Pagination/Pagination.jsx';
import { SearchField } from '../Utilities/Utilities.jsx';
import Search from '../Utilities/Search/Search.jsx';
import UploadWrapper from '../../../ui/modals/UploadWrapper.jsx';
import MainModal from '../../../ui/modals/MainModal';
import * as config from '../../../../config.json';
import { formatText } from '../../utils/utils';

export const T = i18n.createComponent();
// this lists what a specific course contains

export class ManageUnits extends Component {
  constructor(props) {
    super(props);
    this.SESSION_RESULTS = 'UNIT_RESULTS'; //
    this.SESSION_RESULTS_COUNT = 'UNIT_RESULTS_COUNT'; //
    this.itemPerPage = 10;
    this.totalResults = 0;
    this.queryParams = [{ param: 'q' }];
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isOpen: false,
      modalIdentifier: '', // School Id
      title: '', // Add School or Edit
      confirm: '',
      reject: '',
      name: '',
      ids: [],
      table_title: '',
      sub_title: '',
      description: '',
    };
    this.computation = '';
  }

  componentDidMount() {
    this._ismounted = true;
    this.computation = Tracker.autorun(() => {
      if (this._ismounted) {
        this.setState({ data: Session.get('UNIT_RESULTS') });
        this.setState({ resultsCount: Session.get('UNIT_RESULTS_COUNT') });
      }
      return;
    });
    // don't clean the courseId on unmount
    Session.set('courseId', FlowRouter.getQueryParam('cs'));
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.computation.stop();
    Session.set({
      UNIT_RESULTS: '',
      UNIT_RESULTS_COUNT: '',
    });
    this.setState({
      data: '',
      resultsCount: '',
    });
    this._ismounted = false;
  }

  // close the modal, and clear the states;
  closeModal = () => {
    this.setState({
      isOpen: false,
      modalIdentifier: '', // Topic Id
      modalType: '', // Add or Edit
      title: '', // Add Topic or Edit Topic
      confirm: '',
      reject: '',
      name: '',
    });
  };

  getDescription = ({ target: { value } }) => {
    this.setState({
      description: value,
    });
  };

  // ide => modalType, id=> schoolId
  toggleEditModal = (ide, id = '', name = '', desc = '') => {
    // check if the user has full rights
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      return;
    }

    this.name = name;
    this.id = id;
    this.desc = desc;

    switch (ide) {
      case 'edit':
        this.setState({
          modalIdentifier: this.id,
          modalType: ide,
          title: `Edit ${Session.get('sub_unit_title')}`,
          confirm: 'Save',
          reject: 'Close',
          name: this.name,
          description: this.desc,
        });

        break;

      case 'del':
        const unit = getCheckBoxValues('chk');
        const count = unit.length;
        const name = count > 1 ? 'units' : 'unit';
        if (count < 1) {
          Materialize.toast('Please check atleast one unit', 4000, 'error-toast');
          return;
        }
        this.setState({
          modalIdentifier: 'id',
          modalType: ide,
          title: `Are you sure to delete ${count} ${name}`,
          confirm: 'Yes',
          reject: 'No',
          ids: unit,
        });
        break;
      case 'upload':
        this.setState({
          modalIdentifier: '',
          modalType: ide,
          title: `Upload resource for ${Session.get('courseName')} `,
          confirm: 'Save', // this should be out
          reject: 'Close', // this too should be out
        });
        break;
      case 'field':
        this.setState({
          title: 'Edit Table titles on this page',
          confirm: 'Save',
          reject: 'Close',
          modalType: ide,
          table_title: id,
          sub_title: name,
        });
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  renderUnits() {
    let count = 1;
    const { data, resultsCount } = this.state;
    if (!data) {
      return null;
    }
    this.totalResults = resultsCount;
    return data.map(unit => (
      <Unit
        key={unit._id}
        href={`/dashboard/edit_unit/${unit._id}`}
        count={count++}
        unit={{
          _id: unit._id,
          name: unit.name,
          createdBy: unit.createdBy,
          createdAt: moment(unit.createdAt).format('YYYY-MM-DD'),
        }}
        EditUnit={e => this.toggleEditModal('edit', unit._id, unit.name, unit.unitDesc, e)}
      />
    ));
  }

  // edit course unit
  handleSubmit(event) {
    event.preventDefault();
    const { modalType, ids, modalIdentifier, table_title, sub_title, description } = this.state;
    const { target } = event;

    switch (modalType) {
      case 'edit':
        const unit = target.unit.value;
        Meteor.call('unit.update', modalIdentifier, unit, description, err => {
          err
            ? (Materialize.toast(err.reason, 3000, 'error-toast'),
              Meteor.call('logger', formatText(err.message, Meteor.userId(), 'unit-edit'), 'error'))
            : Meteor.call('updateSearch', modalIdentifier, unit, err => {
                err
                  ? Materialize.toast(err.reason, 3000, 'error-toast')
                  : Materialize.toast(`${unit} successfully updated`, 3000, 'success-toast');
              });
        });
        break;

      case 'del':
        let count = 0;
        ids.forEach(id => {
          Meteor.call('unit.remove', id, err => {
            count += 1;
            const name = count > 1 ? 'units' : 'unit';
            err
              ? (Materialize.toast(err.reason, 3000, 'error-toast'),
                Meteor.call(
                  'logger',
                  formatText(err.message, Meteor.userId(), 'unit-remove'),
                  'error',
                ))
              : Meteor.call('removeSearchData', id, err => {
                  err
                    ? Materialize.toast(err.reason, 3000, 'error-toast')
                    : Meteor.call('insertDeleted', id, err => {
                        err
                          ? Materialize.toast(err.reason, 3000, 'error-toast')
                          : Materialize.toast(
                              `${count} ${name} successfully deleted`,
                              3000,
                              'success-toast',
                            );
                      });
                });
          });
        });
        break;
      case 'field':
        const name = target.course.value;
        const title_id = Session.get('title_id');
    }

    // close the modal when done;
    this.closeModal();
  }

  getUnits() {
    let query = getQuery(this.queryParams, true, true, 'q');
    var searchParams = [{ name: query }];
    if (query == '') {
      searchParams = [{}];
    }
    return (
      <Search
        limit={this.itemPerPage}
        skip={getPageNumber(this.itemPerPage)}
        coll={_Units}
        session={this.SESSION_RESULTS}
        data={searchParams}
        criteria={'OR'}
      />
    );
  }

  routeToCourses = e => {
    e.preventDefault();
    return FlowRouter.go('/dashboard/course');
  };

  render() {
    let { course, titles } = this.props;
    const {
      isOpen,
      title,
      confirm,
      reject,
      modalType,
      name,
      table_title,
      sub_title,
      description,
    } = this.state;
    let courseId, new_title, new_sub_title, year;
    courseName = null;
    if (course) {
      courseId = course._id;
      year = course.details.year;
      courseName = course.name;
      Session.set('courseName', courseName);
    }
    if (titles) {
      new_title = titles.title;
      new_sub_title = titles.sub_title;
      Session.set({
        unit_title_id: titles._id,
        sub_unit_title: new_sub_title,
        unit_title: new_title,
      });
    }

    return (
      <Fragment>
        {this.getUnits()}

        {this.state.modalType === 'upload' ? (
          <UploadWrapper show={isOpen} close={this.closeModal} title={title} />
        ) : (
          <MainModal
            show={isOpen}
            onClose={this.closeModal}
            subFunc={this.handleSubmit}
            title={title}
            confirm={confirm}
            reject={reject}
          >
            {modalType === 'del' ? (
              ''
            ) : (
              <>
                <div className="input-field">
                  <input
                    placeholder="Name of Unit"
                    type="text"
                    defaultValue={name}
                    className="validate clear"
                    required
                    name="unit"
                  />
                </div>
                <div className="input-field">
                  <textarea
                    name="descr"
                    className="unitdesc clear materialize-textarea"
                    placeholder="Add Unit Description"
                    value={description}
                    onChange={e => this.getDescription(e)}
                    required
                  />
                </div>
              </>
            )}
          </MainModal>
        )}

        <div className="col m9 s11">
          <div className="row">
            <div className="">
              <h4>{`${Session.get('sub_unit_title')} for ${courseName}`} </h4>
            </div>
            <div className="col m8 ">
              <SearchField
                action={'/dashboard/Units/'}
                name={'units'}
                placeholder={'search unit by name'}
                query={'q'}
              />
            </div>
          </div>

          <div className="row">
            <div className="col m3">
              <button
                className="btn grey darken-3 fa fa-angle-left"
                onClick={e => this.routeToCourses(e)}
              >
                <a href={''} className="white-text">
                  {` ${new_title}`}
                </a>
              </button>
            </div>
            <div className="col m3">
              <button
                className="btn red darken-2 fa fa-remove"
                onClick={e => this.toggleEditModal('del', e)}
              >
                {' '}
                <T>common.actions.delete</T>
              </button>
            </div>
            <div className="col m2">
              <a href={`/dashboard/unit/${courseId}?y=${year}`}>
                <button className="btn grey fa fa-plus">
                  {' '}
                  <T>common.actions.new</T>
                </button>
              </a>
            </div>
            <div className="col 4">
              <button
                className="btn fa fa-upload green darken-4 "
                onClick={e => this.toggleEditModal('upload', e)}
              >
                {' '}
                <T>common.actions.addreference</T>
              </button>
            </div>
          </div>

          <table className="highlight striped">
            <thead>
              <tr>
                <th>#</th>
                <th>{new_sub_title}</th>
                <th>
                  <T>common.actions.createdAt</T>
                </th>
                <th>{`Edit ${new_sub_title}`}</th>
                <th>{`Manage sub-${new_sub_title}`}</th>
                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                  <input type="checkbox" className="filled-in chk-all" readOnly />
                  <label>
                    <T>common.actions.check</T>
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderUnits()}</tbody>
          </table>

          <Pagination
            path={'/dashboard/Units'}
            itemPerPage={this.itemPerPage}
            query={getQuery(this.queryParams, true)}
            totalResults={this.totalResults}
          />
        </div>
      </Fragment>
    );
  }
}

export const Unit = ({ EditUnit, count, unit: { _id, name, createdAt } }) => (
  <tr key={_id} className="link-unit">
    <td>{count}</td>
    <td onClick={e => this.handleUrl(e, _id)}>{name}</td>
    <td>{createdAt}</td>
    <td>
      <a href="" className="fa fa-pencil" onClick={EditUnit} />
    </td>
    <td>
      <a href={''} onClick={e => this.handleUrl(e, _id)} className="fa fa-pencil" />
    </td>
    <td onClick={handleCheckboxChange.bind(this, _id)}>
      <input type="checkbox" className={' filled-in chk chk' + _id} id={_id} />
      <label />
    </td>
  </tr>
);

handleUrl = (e, id) => {
  // id => unit_id
  if (config.isHighSchool) {
    FlowRouter.go(`/dashboard/isHighSchool/edit_unit/${id}`);
  } else {
    FlowRouter.go(`/dashboard/edit_unit/${id}`);
  }
};

export default withTracker(params => {
  Meteor.subscribe('searchUnits', Session.get('courseIde'));
  Meteor.subscribe('courses');
  Meteor.subscribe('deleted');
  Meteor.subscribe('titles');
  return {
    course: _Courses.findOne({ _id: Session.get('courseIde') }),
    titles: Titles.findOne({}),
    Units: [],
  };
})(ManageUnits);
